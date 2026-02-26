import { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, Loader2 } from 'lucide-react';

export default function WriteEdit() {
  const { id } = useParams(); // If there is an ID in the URL, we are in Edit mode
  const history = useHistory(); // React Router v5 navigation hook

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  // AI State
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch the existing blog data if we are editing
  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`https://ai-powered-blog-platform-1.onrender.com/api/blogs/${id}`);
          setTitle(response.data.title);
          setAuthor(response.data.author);
          setContent(response.data.content);
        } catch (error) {
          console.error("Error fetching post to edit:", error);
        }
      };
      fetchPost();
    }
  }, [id]);

  // Function to ask Gemini for help
  const handleGenerateAI = async () => {
    if (!title && !content) {
      alert("Please write a title or some content first so the AI knows what to think about!");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await axios.post('https://ai-powered-blog-platform-1.onrender.com/api/ai-suggestions', {
        title,
        content
      });
      setAiSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate suggestions. Make sure your backend is running!");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to save the blog to the database (handles both Create and Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !content) {
      alert("Please fill in all fields before publishing.");
      return;
    }

    setIsPublishing(true);
    try {
      if (id) {
        // If we have an ID, UPDATE the existing post
        await axios.put(`https://ai-powered-blog-platform-1.onrender.com/api/blogs/${id}`, { title, author, content });
        history.push(`/post/${id}`); // Go back to the reading page
      } else {
        // If no ID, CREATE a new post
        await axios.post('https://ai-powered-blog-platform-1.onrender.com/api/blogs', { title, author, content });
        history.push('/'); // Go back to home
      }
    } catch (error) {
      console.error("Publishing Error:", error);
      alert("Failed to save post.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="write-page">
      {/* Dynamic Title based on whether we are creating or editing */}
      <h1 className="page-title">{id ? 'Edit Post' : 'Write a New Post'}</h1>

      <div className="write-layout">
        {/* LEFT COLUMN: The actual form */}
        <div className="form-column">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                placeholder="Your post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                placeholder="Your name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                placeholder="Start writing your post..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field textarea-field"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-primary publish-btn"
              disabled={isPublishing}
            >
              {isPublishing ? 'Saving...' : (id ? 'Update Post' : 'Publish Post')}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: The AI Assistant Panel */}
        <div className="ai-column">
          <div className="ai-panel">
            <div className="ai-panel-header">
              <div className="ai-title">
                <Sparkles size={18} className="ai-icon" />
                <span>AI Suggestions</span>
              </div>
              <button
                type="button"
                onClick={handleGenerateAI}
                className="btn-ai-generate"
                disabled={isGenerating}
              >
                {isGenerating ? <Loader2 size={16} className="spin" /> : 'Generate'}
              </button>
            </div>

            <div className="ai-panel-body">
              {aiSuggestions.length === 0 ? (
                <p className="ai-empty-text">
                  Click "Generate" to get AI-powered topic and intro suggestions based on what you have written so far.
                </p>
              ) : (
                <div className="ai-results">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="ai-card">
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}