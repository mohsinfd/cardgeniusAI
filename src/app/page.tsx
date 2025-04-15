'use client';

import { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';
import { userRequestScenarios } from '../data/user-request-scenarios';

// Verify we have enough test cases
console.log('Number of test cases:', userRequestScenarios.length);

export default function Home() {
  const [query, setQuery] = useState('');
  const [currentPlaceholder, setCurrentPlaceholder] = useState(userRequestScenarios[0].request);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const placeholderInterval = useRef<NodeJS.Timeout>();
  const currentIndexRef = useRef(0);

  // Handle textarea auto-resize
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
      
      // Add data-expanded attribute if content is scrollable
      const isExpanded = textarea.scrollHeight > 200;
      textarea.setAttribute('data-expanded', String(isExpanded));
      if (isExpanded) {
        textarea.style.height = '200px';
      }
    };

    // Initial adjustment
    adjustHeight();

    // Add resize observer to handle window resizing
    const resizeObserver = new ResizeObserver(adjustHeight);
    resizeObserver.observe(textarea);

    return () => resizeObserver.disconnect();
  }, [query]); // Re-run when query changes

  // Handle placeholder rotation
  useEffect(() => {
    const rotatePlaceholder = () => {
      currentIndexRef.current = (currentIndexRef.current + 1) % userRequestScenarios.length;
      setCurrentPlaceholder(userRequestScenarios[currentIndexRef.current].request);
    };

    // Start the rotation
    placeholderInterval.current = setInterval(rotatePlaceholder, 3000);

    return () => {
      if (placeholderInterval.current) {
        clearInterval(placeholderInterval.current);
      }
    };
  }, []); // Only run on mount

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFocus = () => {
    if (placeholderInterval.current) {
      clearInterval(placeholderInterval.current);
    }
  };

  const handleBlur = () => {
    if (!query) {
      const rotatePlaceholder = () => {
        currentIndexRef.current = (currentIndexRef.current + 1) % userRequestScenarios.length;
        setCurrentPlaceholder(userRequestScenarios[currentIndexRef.current].request);
      };
      placeholderInterval.current = setInterval(rotatePlaceholder, 3000);
    }
  };

  return (
    <div className="container">
      <header className="app-header">
        <div className="logo-container">
          <svg className="logo" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="200%" y2="0%">
                <stop offset="0%" stopColor="#0066FF" />
                <stop offset="50%" stopColor="#00CC66" />
                <stop offset="100%" stopColor="#0066FF" />
              </linearGradient>
            </defs>
            <rect x="2" y="4" width="20" height="16" rx="2" fill="url(#shimmerGradient)" />
            <path d="M6 8h12M6 12h8M6 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="logo-text">CardGenius.AI</span>
        </div>
      </header>

      <main className="main-content">
        <h1 className="main-title">
          <span className="brand-text">CardGenius.AI</span>
          <span className="regular-text"> will find you the best credit card</span>
        </h1>
        <form onSubmit={handleSubmit} className="search-container">
          <div className="search-input-wrapper">
            <textarea
              ref={textareaRef}
              className="search-input"
              placeholder={currentPlaceholder}
              value={query}
              onChange={handleInput}
              rows={1}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
            <button type="submit" className="send-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </main>

      <footer className="footer">
        <p>CardGenius is a proprietary product of BankKaro © 2025</p>
      </footer>
    </div>
  );
} 