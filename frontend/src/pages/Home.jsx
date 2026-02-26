import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from the backend when the page loads
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>Latest Posts</h1>
        <p className="subtitle">Thoughts, ideas, and stories from our community.</p>
      </header>

      <div className="blog-list">
        {blogs.length === 0 ? (
          <p>No posts yet. Be the first to write one!</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog.id} className="blog-card-container">
              {/* Clickable part of the card remains: links to post detail */}
              <Link to={`/post/${blog.id}`} className="blog-card-link">
                <h2 className="blog-title">{blog.title}</h2>
                <p className="blog-excerpt">
                  {blog.content.length > 150
                    ? blog.content.substring(0, 150) + '...'
                    : blog.content}
                </p>
              </Link>

              {/* Footer area */}
              <div className="blog-card-footer">

                <div className="blog-meta">
                  <span className="blog-author">{blog.author}</span>
                  <span className="meta-divider">·</span>
                  <span className="blog-date">
                    {new Date(blog.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}