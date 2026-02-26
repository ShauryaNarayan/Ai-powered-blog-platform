import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react'; // This gives us that clean little pencil icon

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo linking to Home */}
        <Link to="/" className="nav-logo">
          Inkwell
        </Link>

        {/* Write Button linking to the Write page */}
        <Link to="/write" className="btn-primary flex-center">
          <Pencil size={16} style={{ marginRight: '6px' }} />
          Write
        </Link>
      </div>
    </nav>
);
}