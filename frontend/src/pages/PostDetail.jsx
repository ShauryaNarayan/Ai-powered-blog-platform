import { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

export default function PostDetail() {
  const { id } = useParams(); // Grabs the post ID from the URL
  const history = useHistory(); // React Router v5 navigation hook
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the specific blog post when the page loads
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://ai-powered-blog-platform-1.onrender.com/api/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Could not load the post.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Function to delete the post from the reading view
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://ai-powered-blog-platform-1.onrender.com/api/blogs/${id}`);
        history.push('/'); // Go back to home after deleting
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete the post.");
      }
    }
  };

  if (loading) return <div className="loading">Loading post...</div>;
  if (!blog) return <div className="loading">Post not found.</div>;

  return (
    <div className="post-detail-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to posts
      </Link>

      <header className="post-header">
        <h1 className="post-title-large">{blog.title}</h1>
        
        <div className="post-meta-row">
          <span className="post-author">{blog.author}</span>
          <span className="meta-divider">·</span>
          <span className="post-date">
            {new Date(blog.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>

        <div className="post-actions">
          <Link to={`/edit/${blog.id}`} className="btn-outline">
            <Edit size={14} /> Edit
          </Link>
          <button onClick={handleDelete} className="btn-danger">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </header>

      <div className="post-content">
        {/* Splitting the content by newlines so it renders paragraphs correctly */}
        {blog.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}