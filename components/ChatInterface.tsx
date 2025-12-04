import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, X, Music2 } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hey there! I'm Reum, Rham's AI Assistant. Welcome to the studio. Ask me anything about his projects, skills, or background!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(input);
      const botMsg: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="w-full md:w-[350px] flex flex-col h-full bg-[#121212] border-l border-[#282828] shadow-2xl z-40 transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-[#282828] flex items-center justify-between bg-[#121212]">
        <div className="flex items-center gap-2">
          <Music2 size={18} style={{ color: 'var(--accent)' }} />
          <h3 className="font-bold text-white text-base">Reum</h3>
        </div>
        <button onClick={onClose} className="text-[#b3b3b3] hover:text-white hover:bg-[#282828] p-1 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#121212]">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user'
                ? 'text-black font-medium rounded-br-none'
                : 'bg-[#282828] text-white rounded-bl-none'
                }`}
              style={msg.role === 'user' ? { backgroundColor: 'var(--accent)' } : {}}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#282828] rounded-2xl rounded-bl-none px-4 py-3 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#b3b3b3] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#b3b3b3] rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-[#b3b3b3] rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#121212] border-t border-[#282828] pb-safe-bottom">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask about Rham..."
            className="w-full bg-[#282828] text-white placeholder-[#727272] rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#555] transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-transparent hover:text-white text-[#b3b3b3] rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-[#b3b3b3] text-center mt-2 opacity-50">
          Powered by Gemini
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;