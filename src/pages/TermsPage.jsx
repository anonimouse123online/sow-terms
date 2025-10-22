// src/TermsPage.jsx
import { useState, useEffect } from 'react';
import './TermsPage.css';

export default function TermsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [terms, setTerms] = useState({ title: '', content: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get('lang') === 'en' ? 'en' : 'sv';
  const isEnglish = lang === 'en';

  useEffect(() => {
    const fetchTerms = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://mini-app-backend-bdlo.onrender.com/api/terms?lang=${lang}`
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${res.status}: Failed to load terms`);
        }

        const data = await res.json();
        setTerms(data);
      } catch (err) {
        console.error('Error fetching terms:', err);
        setError(err.message || 'Could not load terms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [lang]);

  const backUrl = isEnglish ? '/en' : '/';
  const backButtonText = isEnglish ? 'Close and Go Back' : 'Stäng och Gå Tillbaka';
  const toggleLangUrl = isEnglish
    ? window.location.pathname
    : `${window.location.pathname}?lang=en`;

  const navLinks = [
    { text: isEnglish ? 'Home' : 'Hem', href: isEnglish ? '/en' : '/' },
    { text: isEnglish ? 'Order' : 'Beställ', href: isEnglish ? '/en/order' : '/order' },
    { text: isEnglish ? 'Our Customers' : 'Våra Kunder', href: isEnglish ? '/en/customers' : '/customers' },
    { text: isEnglish ? 'About us' : 'Om Oss', href: isEnglish ? '/en/about' : '/about' },
    { text: isEnglish ? 'Contact Us' : 'Kontakta Oss', href: isEnglish ? '/en/contact' : '/contact' },
    { text: isEnglish ? 'English 🇬🇧' : 'Svenska 🇸🇪', href: toggleLangUrl },
  ];

  return (
    <div className="terms-page">
      {/* Navbar */}
      <nav className="terms-navbar">
        <div className="nav-container">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="123 Fakturera"
            className="nav-logo"
          />

          {/* Hamburger Button */}
          <button
            className="hamburger"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Desktop Nav Links */}
          <div className="nav-links desktop-only">
            {navLinks.map((link, index) => (
              <a key={index} href={link.href}>
                {link.text}
              </a>
            ))}
          </div>

          {/* Mobile Nav Links */}
          {isMenuOpen && (
            <div className="nav-links mobile-menu">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="terms-container">
        <h1 className="terms-title">
          {terms.title || (isEnglish ? 'Terms' : 'Villkor')}
        </h1>

        <a href={backUrl} className="terms-back-button">
          {backButtonText}
        </a>

        {error ? (
          <div className="terms-error">{error}</div>
        ) : loading ? (
          <div className="terms-card">
            {isEnglish ? 'Loading terms...' : 'Laddar villkor...'}
          </div>
        ) : (
          <div className="terms-card">{terms.content}</div>
        )}
      </div>
    </div>
  );
}