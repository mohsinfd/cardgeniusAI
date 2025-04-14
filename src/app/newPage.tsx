// This file will be moved to the project root app directory.

'use client'

import { useState } from 'react'
import ChatInterface from '@/components/ChatInterface'
import { Message } from '@/types/chat'

export default function NewPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([])

  const handleMessageSubmit = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: messages.map(m => m.content),
          unansweredQuestions: followUpQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      
      // Add user message
      setMessages(prev => [...prev, { role: 'user', content: message }])
      
      // Add assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      
      // Update follow-up questions
      if (data.follow_up_messages && data.follow_up_messages.length > 0) {
        setFollowUpQuestions(data.follow_up_messages)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-[75%] max-w-4xl mx-auto px-4 py-8">
        {/* Follow-up Questions Box */}
        {followUpQuestions.length > 0 && (
          <div className="mb-6 max-h-40 overflow-y-auto bg-gray-50 rounded-lg p-4 shadow-sm">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Follow-up Questions:</h3>
            <ul className="space-y-2">
              {followUpQuestions.map((question, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chat Interface */}
        <div className="w-full">
          <ChatInterface
            onMessageSubmit={handleMessageSubmit}
            messages={messages}
            isLoading={isLoading}
          />
        </div>
      </div>
    </main>
  )
} 