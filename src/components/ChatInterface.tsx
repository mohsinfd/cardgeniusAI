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
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get placeholders from user request scenarios
  const placeholders = userRequestScenarios.map(scenario => scenario.request);

  // Cycle through placeholders every 2 seconds only on landing page
  useEffect(() => {
    if (!showPlaceholder || messages.length > 0) return;
    
    console.log('Starting placeholder cycling');
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) => {
        const newIndex = prevIndex === placeholders.length - 1 ? 0 : prevIndex + 1;
        console.log('Cycling to placeholder:', newIndex, placeholders[newIndex]);
        return newIndex;
      });
    }, 2000);

    return () => {
      console.log('Clearing placeholder interval');
      clearInterval(interval);
    };
  }, [placeholders.length, showPlaceholder, messages.length]);

  const handleInputFocus = () => {
    console.log('Input focused, hiding placeholder');
    setShowPlaceholder(false);
  };

  const handleInputBlur = () => {
    if (messages.length === 0 && !input.trim()) {
      console.log('Input blurred, showing placeholder');
      setShowPlaceholder(true);
    }
  };

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
    setShowPlaceholder(false); // Keep placeholder hidden after first message
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
          {message.role === 'assistant' && message.spending_data && Object.keys(message.spending_data).length > 0 && (
            <div className="spending-data mt-2">
              <div className="font-semibold mb-2 text-blue-400">Spending Data:</div>
              {Object.entries(message.spending_data).map(([category, amount]) => (
                <div key={category} className="flex justify-between py-1">
                  <span className="text-gray-300">{category}:</span>
                  <span className={`font-medium ${amount === null ? 'text-gray-400' : 'text-green-400'}`}>
                    {amount === null ? 'Not specified' : `₹${amount}`}
                  </span>
                </div>
              ))}
            </div>
          )}
          {message.role === 'assistant' && message.follow_up_question && !message.content.includes(message.follow_up_question) && (
            <div className="follow-up-question mt-2">
              {message.follow_up_question}
            </div>
          )}
        </div>
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
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={showPlaceholder ? placeholders[currentPlaceholderIndex] : ''}
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
              <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}; 