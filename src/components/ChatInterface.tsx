import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userRequestScenarios } from '../data/user-request-scenarios';

interface SpendingData {
  [key: string]: number | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  spending_data?: SpendingData;
  follow_up_question?: string;
}

interface ChatInterfaceProps {
  className?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get placeholders from user request scenarios
  const placeholders = userRequestScenarios.map(scenario => scenario.request);

  // Cycle through placeholders every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) => 
        prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [placeholders.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const startTime = performance.now();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          context: messages,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const apiTime = performance.now() - startTime;
      console.log(`API Response Time: ${apiTime.toFixed(2)}ms`);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        spending_data: data.spending_data,
        follow_up_question: data.follow_up_question
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const renderMessage = (message: Message) => {
    return (
      <div className="space-y-2">
        <div className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}>
          {message.content}
        </div>
        
        {message.spending_data && Object.keys(message.spending_data).length > 0 && (
          <div className="bg-gray-800/50 p-3 rounded-lg text-sm border border-gray-700">
            <div className="font-semibold mb-2 text-blue-400">Spending Data:</div>
            {Object.entries(message.spending_data).map(([category, amount]) => (
              amount !== null && (
                <div key={category} className="flex justify-between py-1">
                  <span className="text-gray-300">{category}:</span>
                  <span className="font-medium text-blue-400">₹{amount}</span>
                </div>
              )
            ))}
          </div>
        )}
        
        {message.follow_up_question && (
          <div className="bg-blue-500/10 p-3 rounded-lg text-sm text-blue-400 border border-blue-500/20">
            {message.follow_up_question}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`chat-container ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {renderMessage(message)}
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="search-container">
        <div className="search-input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholders[currentPlaceholderIndex]}
            className="search-input"
            rows={1}
            data-expanded={input.length > 0}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="send-button"
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}; 