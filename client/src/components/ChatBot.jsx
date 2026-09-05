import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'

const RobotIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="50" y1="8" x2="50" y2="22" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <circle cx="50" cy="6" r="5" fill="white"/>
    <rect x="18" y="22" width="64" height="48" rx="12" fill="white" fillOpacity="0.95"/>
    <circle cx="35" cy="42" r="8" fill="#2563EB"/>
    <circle cx="65" cy="42" r="8" fill="#2563EB"/>
    <circle cx="37" cy="40" r="3" fill="white"/>
    <circle cx="67" cy="40" r="3" fill="white"/>
    <path d="M35 58 Q50 68 65 58" stroke="#2563EB" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
    <rect x="10" y="35" width="8" height="16" rx="4" fill="white" fillOpacity="0.8"/>
    <rect x="82" y="35" width="8" height="16" rx="4" fill="white" fillOpacity="0.8"/>
    <rect x="35" y="70" width="30" height="8" rx="4" fill="white" fillOpacity="0.6"/>
  </svg>
)

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m your Car Rental Assistant 🚗\nHow can I help you today?' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMessage = { role: 'user', text: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    try {
      const { data } = await axios.post('/api/chat/message', { message: input })
      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: 'Something went wrong. Please try again.' }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Connection error. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  const BotAvatar = () => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #2563EB, #1F58D8)' }}>
      <RobotIcon size={22} />
    </div>
  )

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 rounded-2xl overflow-hidden flex flex-col"
          style={{
            height: '520px',
            boxShadow: '0 20px 60px rgba(37, 99, 235, 0.15), 0 8px 25px rgba(0,0,0,0.12)',
            border: '1px solid rgba(37, 99, 235, 0.15)',
            animation: 'slideUp 0.3s ease'
          }}>

          {/* Header */}
          <div style={{ background: 'linear-gradient(135deg, #2563EB 0%, #1F58D8 100%)' }}
            className="px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
                style={{ animation: 'robotWave 2s ease infinite' }}>
                <RobotIcon size={26} />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">AI Assistant</p>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <p className="text-white/70 text-xs">Online</p>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && <BotAvatar />}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-white text-gray-700 border border-gray-100 rounded-bl-sm shadow-sm'}`}
                  style={msg.role === 'user' ? {
                    background: 'linear-gradient(135deg, #2563EB, #1F58D8)'
                  } : {}}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 justify-start">
                <BotAvatar />
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: '#2563EB', animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: '#2563EB', animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: '#2563EB', animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto">
            {['How to book?', 'Available cars', 'Pricing'].map((suggestion, i) => (
              <button key={i} onClick={() => setInput(suggestion)}
                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full border cursor-pointer transition-all"
                style={{ borderColor: '#2563EB', color: '#2563EB' }}
                onMouseEnter={e => { e.target.style.background = '#2563EB'; e.target.style.color = 'white' }}
                onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#2563EB' }}>
                {suggestion}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full text-sm outline-none transition-all"
              style={{ border: '1.5px solid #e5e7eb', background: '#f9fafb' }}
              onFocus={e => e.target.style.borderColor = '#2563EB'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
            <button onClick={sendMessage} disabled={loading}
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #2563EB, #1F58D8)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {!isOpen && (
        <div className="mb-3 flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-lg"
          style={{
            border: '1px solid rgba(37, 99, 235, 0.2)',
            animation: 'fadeInOut 4s ease infinite'
          }}>
          <span className="text-xs font-medium text-gray-600">Hello! Need help? 👋</span>
        </div>
      )}

      {/* Floating Button */}
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all"
        style={{
          background: 'linear-gradient(135deg, #2563EB, #1F58D8)',
          boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)',
        }}>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
          </svg>
        ) : (
          <div style={{ animation: 'robotWave 2s ease infinite' }}>
            <RobotIcon size={32} />
          </div>
        )}
      </button>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes robotWave {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.1); }
          75% { transform: rotate(10deg) scale(1.1); }
        }
        @keyframes fadeInOut {
          0%, 100% { opacity: 0; transform: translateX(10px); }
          20%, 80% { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export default ChatBot