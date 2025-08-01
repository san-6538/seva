import { useState, useRef, useEffect } from 'react'
import { Send, X, Bot, User, MinusCircle } from 'lucide-react'
import { Button } from '../ui/Button'

const ChatbotWindow = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your medical assistant. I can help with first aid guidance and emergency procedures. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const emergencyResponses = {
    'heart attack': 'For suspected heart attack: 1. Call emergency services immediately. 2. Help the person sit comfortably. 3. Give aspirin if available and not allergic. 4. Perform CPR if person becomes unconscious.',
    'choking': 'For choking: 1. Encourage coughing if person can still breathe. 2. Perform back blows (5 sharp blows between shoulder blades). 3. If unsuccessful, perform abdominal thrusts (Heimlich maneuver). 4. Call emergency services.',
    'bleeding': 'For severe bleeding: 1. Apply direct pressure with clean cloth. 2. Elevate the wounded area above heart level if possible. 3. Don\'t remove embedded objects. 4. Call emergency services for severe bleeding.',
    'burn': 'For burns: 1. Cool the burn with running water for 20 minutes. 2. Remove jewelry before swelling. 3. Cover with sterile gauze. 4. Don\'t use ice or butter. Seek medical attention for severe burns.',
    'fracture': 'For suspected fracture: 1. Don\'t move the injured area. 2. Immobilize with splint if trained. 3. Apply ice wrapped in cloth. 4. Seek immediate medical attention.',
    'unconscious': 'For unconscious person: 1. Check responsiveness and breathing. 2. Call emergency services. 3. Place in recovery position if breathing. 4. Perform CPR if not breathing.',
    'default': 'I can help with first aid for: heart attacks, choking, bleeding, burns, fractures, and unconscious persons. Please describe your emergency or ask about specific first aid procedures.'
  }

  const generateBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()
    
    for (const [key, response] of Object.entries(emergencyResponses)) {
      if (lowerMessage.includes(key)) {
        return response
      }
    }
    
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return 'If this is a life-threatening emergency, please call emergency services (911/108) immediately. I can provide first aid guidance while you wait for help.'
    }
    
    return emergencyResponses.default
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Medical Assistant</h3>
            <p className="text-xs text-green-600 dark:text-green-400">Online</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%]`}>
              {message.sender === 'bot' && (
                <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full mt-1">
                  <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' 
                    ? 'text-blue-100' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {message.sender === 'user' && (
                <div className="p-1 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="p-1 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about first aid procedures..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatbotWindow
