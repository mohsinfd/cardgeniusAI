import React from 'react';
import { ChatInterface } from './components/ChatInterface';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>CardGenius AI</h1>
      </header>
      <main className="App-main">
        <ChatInterface className="w-full max-w-4xl mx-auto" />
      </main>
    </div>
  );
}

export default App; 