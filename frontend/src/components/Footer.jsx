import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <span className="footer-logo">🏥</span>
          <span className="footer-brand-text">WardManager</span>
          <p className="footer-desc">
            Modern hospital ward management system built for speed and reliability.
          </p>
        </div>
        
        <div className="footer-links">
          <h4>Product</h4>
          <Link to="#">Features</Link>
          <Link to="#">Pricing</Link>
          <Link to="#">Support</Link>
        </div>

        <div className="footer-links">
          <h4>Company</h4>
          <Link to="#">About Us</Link>
          <Link to="#">Careers</Link>
          <Link to="#">Contact</Link>
        </div>

        <div className="footer-links">
          <h4>Legal</h4>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} WardManager. All rights reserved.</p>
      </div>
    </footer>
  );
}
