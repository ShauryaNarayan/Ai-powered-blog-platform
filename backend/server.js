const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Notice we are requiring Google here, not OpenAI!
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require('./db');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// CRUD ENDPOINTS FOR BLOGS
// ==========================================

// 1. Create a new blog post
app.post('/api/blogs', (req, res) => {
    const { title, content, author } = req.body;
    const query = `INSERT INTO Blogs (title, content, author) VALUES (?, ?, ?)`;
    
    db.run(query, [title, content, author], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Blog post created successfully", postId: this.lastID });
    });
});

// 2. Retrieve a list of all blog posts
app.get('/api/blogs', (req, res) => {
    const query = `SELECT * FROM Blogs ORDER BY created_at DESC`;
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 3. Retrieve a specific blog post by ID
app.get('/api/blogs/:id', (req, res) => {
    const query = `SELECT * FROM Blogs WHERE id = ?`;
    db.get(query, [req.params.id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ message: "Blog post not found" });
        res.json(row);
    });
});

// 4. Update a blog post by ID
app.put('/api/blogs/:id', (req, res) => {
    const { title, content, author } = req.body;
    const updated_at = new Date().toISOString(); 
    
    const query = `UPDATE Blogs SET title = ?, content = ?, author = ?, updated_at = ? WHERE id = ?`;
    
    db.run(query, [title, content, author, updated_at, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Blog post not found" });
        res.json({ message: "Blog post updated successfully" });
    });
});

// 5. Delete a blog post by ID
app.delete('/api/blogs/:id', (req, res) => {
    const query = `DELETE FROM Blogs WHERE id = ?`;
    
    db.run(query, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ message: "Blog post not found" });
        res.json({ message: "Blog post deleted successfully" });
    });
});

// ==========================================
// GEMINI GEN-AI ENDPOINT
// ==========================================

// Initialize Gemini using your environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/ai-suggestions', async (req, res) => {
    try {
        const { title, content } = req.body;
        
        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const prompt = `
            Act as a professional blog editor. Review the following draft:
            Title: "${title}"
            Content: "${content}"
            
            Provide two related blog topics and one introductory paragraph suggestion to help the author.
            Format your response STRICTLY as a JSON array of strings, like this:
            [
              "Related topic: [Topic 1]",
              "Related topic: [Topic 2]",
              "Intro paragraph: [Your intro paragraph]"
            ]
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Clean up the response to parse the JSON string array securely
        const cleanJson = responseText.replace(/```json|```/g, '').trim();
        const suggestionsArray = JSON.parse(cleanJson);

        res.json({ suggestions: suggestionsArray });

    } catch (error) {
        console.error("Gemini Generation Error:", error);
        res.status(500).json({ error: "Failed to generate suggestions." });
    }
});

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});