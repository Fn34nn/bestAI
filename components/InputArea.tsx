import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

interface InputAreaProps {
  onSendMessage: (content: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="relative flex items-end w-full p-3 bg-[#40414f] rounded-xl border border-gray-900/50 shadow-md ring-offset-2 ring-transparent focus-within:ring-2 focus-within:ring-indigo-500/50 transition-shadow">
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Send a message..."
        rows={1}
        className="w-full max-h-[200px] py-[6px] pl-2 pr-10 bg-transparent text-white border-0 resize-none focus:ring-0 focus:outline-none placeholder:text-gray-400 scrollbar-thin scrollbar-thumb-gray-600"
        style={{ overflowY: input.length > 100 ? 'auto' : 'hidden' }}
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSend}
        disabled={!input.trim()}
        className={`
          absolute right-3 bottom-3 p-1 rounded-md transition-colors
          ${input.trim() ? 'bg-[#19c37d] text-white' : 'bg-transparent text-gray-500 cursor-not-allowed'}
        `}
      >
        <Send size={16} />
      </motion.button>
    </div>
  );
};