'use client'

import { useState } from 'react'

interface SpendingData {
  monthly: Record<string, number>
  annual: Record<string, number>
  quarterly: Record<string, number>
}

interface ApiResponse {
  spending_data: SpendingData
  follow_up_messages: string[]
  confidence: string
  error?: string
  details?: string
}

export default function TestPage() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `HTTP error! status: ${res.status}`)
      }

      setResponse(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process request'
      setError(errorMessage)
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">CardGenius Test Interface</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex flex-col space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your spending details..."
              className="w-full h-32 p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Submit'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        )}

        {response && (
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Spending Data</h2>
              <pre className="text-gray-300 overflow-x-auto">
                {JSON.stringify(response.spending_data, null, 2)}
              </pre>
            </div>

            {response.follow_up_messages && response.follow_up_messages.length > 0 && (
              <div className="bg-yellow-500/10 p-6 rounded-lg">
                <h2 className="text-xl font-semibold text-yellow-400 mb-4">Follow-up Messages</h2>
                <ul className="list-disc list-inside text-yellow-300">
                  {response.follow_up_messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Confidence</h2>
              <p className="text-gray-300">Level: {response.confidence}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 