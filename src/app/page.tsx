'use client';

import { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';

const PLACEHOLDER_TEXTS = [
  "I spend 5k on dining monthly and want maximum cashback",
  "Looking for a travel card with good airport lounge access",
  "Need a card with low interest rate and no annual fee",
  "Want a card that gives best rewards on online shopping",
  "I travel internationally often, need forex benefits"
];

export default function Home() {
  const [query, setQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const [currentPlaceholder, setCurrentPlaceholder] = useState(PLACEHOLDER_TEXTS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const placeholderInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Apply theme class to body
    document.body.className = isDarkMode ? 'dark-theme' : 'light-theme';
  }, [isDarkMode]);

  // Rotating placeholder effect
  useEffect(() => {
    let currentIndex = 0;
    placeholderInterval.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % PLACEHOLDER_TEXTS.length;
      setCurrentPlaceholder(PLACEHOLDER_TEXTS[currentIndex]);
    }, 3000);

    return () => {
      if (placeholderInterval.current) {
        clearInterval(placeholderInterval.current);
      }
    };
  }, []);

  // Auto-resize textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="container">
      <header className="app-header">
        <div className="logo-container">
          <svg className="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#cardGradient)" />
            <rect x="4" y="8" width="4" height="3" rx="0.5" fill="white" opacity="0.8" />
            <path d="M4 14h16" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <path d="M4 17h16" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <defs>
              <linearGradient id="cardGradient" x1="2" y1="4" x2="22" y2="20">
                <stop offset="0%" stopColor="#0066FF" />
                <stop offset="100%" stopColor="#00CC66" />
              </linearGradient>
            </defs>
          </svg>
          <span className="logo-text">CardGenius.AI</span>
        </div>
        <div className="header-actions">
          <button 
            className="theme-toggle"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="main-content">
        <h1 className="main-title">CardGenius.AI will find you the best credit card</h1>
        <div className="search-container">
          <div className="search-input-wrapper">
            <textarea
              ref={textareaRef}
              className="search-input"
              placeholder={currentPlaceholder}
              value={query}
              onChange={handleInput}
              rows={1}
              onFocus={() => {
                if (placeholderInterval.current) {
                  clearInterval(placeholderInterval.current);
                }
              }}
            />
          </div>
          <div className="actions">
            <button className="send-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>CardGenius is a proprietary product of BankKaro © 2025</p>
      </footer>
    </div>
  );
} 