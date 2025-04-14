'use client';

import { useState } from 'react';
import '../styles/Home.css';

export default function Home() {
  const [query, setQuery] = useState('');

  return (
    <div className="container">
      <header className="header">
        <h1>What do you want to know?</h1>
      </header>

      <main>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Ask anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          
          <div className="actions">
            <span className="pro-badge">pro</span>
            
            <button className="deep-research">
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor">
                <path d="M6 10L10 6M10 6H7M10 6V9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Deep Research
            </button>
            
            <div className="action-icons">
              <button className="icon-button">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027c.81-1.652 2.568-2.978 4.616-3.01A5.534 5.534 0 0110 5c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5c0-.642.12-1.255.332-1.827z"/>
                </svg>
              </button>
              
              <button className="icon-button">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/>
                </svg>
              </button>
              
              <button className="icon-button mic">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <a href="#" className="pro">Pro</a>
        <a href="#">Enterprise</a>
        <a href="#">API</a>
        <a href="#">Blog</a>
        <a href="#">Careers</a>
        <a href="#">Store</a>
        <a href="#">Finance</a>
        <button className="language-selector">
          English
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor">
            <path d="M4 6l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </footer>
    </div>
  );
} 