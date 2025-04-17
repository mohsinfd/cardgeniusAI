import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { userRequestScenarios } from '../data/user-request-scenarios';
import { SpendingData } from '../types/spending';
import { Message } from '@/types/message';
import Image from 'next/image';
import { CardRecommendation as CardGeniusCardRecommendation } from '@/types/cardgenius';

interface ChatInterfaceProps {
  className?: string;
}

interface RecommendationsResponse {
  recommendations: CardGeniusCardRecommendation[];
  summary: {
    total_savings_yearly: number;
    roi: number;
  };
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  console.log(messages,' MMMMM ');
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [accumulatedSpending, setAccumulatedSpending] = useState<SpendingData>({
    amazon_spends: null,
    flipkart_spends: null,
    dining_or_going_out: null,
    fuel: null,
    other_online: null
  });
  const [recommendations, setRecommendations] = useState<any>(null);
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
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Step 1: Call chat API to get OpenAI response
      const chatResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          context: messages.slice(-5),
          accumulatedSpending,
        }),
      });

      if (!chatResponse.ok) {
        throw new Error('Failed to get response from chat API');
      }

      const chatData = await chatResponse.json();
      console.log('Chat API Response:', chatData);

      // Step 2: If ready for recommendations, call CardGenius API
      let recommendations = null;
      if (chatData.ready_for_recommendations) {
        const cardResponse = await fetch('/api/card-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spending_data: chatData.spending_data,
          }),
        });

        if (!cardResponse.ok) {
          throw new Error('Failed to get card recommendations');
        }

        const cardData = await cardResponse.json();
        console.log('CardGenius API Response:', cardData);
        recommendations = cardData.savings;
      }

      // Create assistant message with both chat response and recommendations
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: chatData.content,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        spending_data: chatData.spending_data,
        follow_up_question: chatData.follow_up_question,
        recommendations: recommendations
      };

      setMessages(prev => [...prev, assistantMessage]);
      setAccumulatedSpending(chatData.spending_data);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, there was an error processing your request. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString(),
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

  const CardRecommendationDisplay = ({ recommendations }: { recommendations: CardGeniusCardRecommendation[] }) => {
    // Take only the first 5 cards
    const topCards = recommendations.slice(0, 5);

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topCards.map((card, index) => (
            <div
              key={card.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 flex-shrink-0 relative">
                  <img
                    src={card.image}
                    alt={card.card_name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/64';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {card.card_name}
                  </h3>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Joining Fee:</span> ₹{card.joining_fees}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Annual Savings:</span> ₹{card.total_savings_yearly.toLocaleString()}
                    </p>
                    {card.welcomeBenefits.length > 0 && (
                      <p className="text-sm text-green-600">
                        <span className="font-medium">Welcome Benefit:</span> ₹{card.welcomeBenefits[0].cash_value.toLocaleString()}
                      </p>
                    )}
                  </div>
                  {card.ck_store_url && (
                    <a
                      href={card.ck_store_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-800"
                    >
                      Apply Now →
                    </a>
                  )}
                </div>
              </div>
              {card.product_usps?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700">Key Benefits:</h4>
                  <ul className="mt-1 space-y-1">
                    {card.product_usps?.slice(0, 2).map((usp, idx) => (
                      <li key={idx} className="text-xs text-gray-600">
                        • {usp.header}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const RecommendationsSummary = ({ recommendations }: { recommendations: CardGeniusCardRecommendation[] }) => {
    if (!recommendations || recommendations.length === 0) return null;

    // Sort cards by total savings
    const sortedCards = [...recommendations].sort(
      (a, b) => (b.total_savings_yearly || 0) - (a.total_savings_yearly || 0)
    );

    return (
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold text-white mb-4">Best Card Options</h3>
        <div className="space-y-4">
          {sortedCards.map((card, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium">{card.card_name}</p>
                <p className="text-gray-400 text-sm">Joining Fee: ₹{card.joining_fees}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">₹{(card.total_savings_yearly || 0).toLocaleString()}</p>
                <p className="text-gray-400 text-sm">Annual Savings</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMessage = (message: Message) => {
    return (
      <div
        key={message.id}
        className={`flex ${
          message.role === 'user' ? 'justify-end' : 'justify-start'
        } mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-lg p-4 ${
            message.role === 'user'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.recommendations && (
            <CardRecommendationDisplay recommendations={message.recommendations} />
          )}
          {message.follow_up_question && (
            <div className="mt-2 text-sm text-gray-600">
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
            key={message.timestamp}
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