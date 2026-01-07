import React from 'react';
import { Message } from '../types';
import { User, Bot, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: Message;
  isLast: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`
        w-full border-b border-black/10 dark:border-gray-900/50 text-gray-100
        ${isUser ? 'bg-[#343541]' : 'bg-[#444654]'}
      `}
    >
      <div className="max-w-3xl mx-auto flex gap-4 p-4 md:p-6 text-base">
        <div className="flex-shrink-0 flex flex-col relative items-end">
          <div className={`
            w-8 h-8 rounded-sm flex items-center justify-center
            ${isUser ? 'bg-indigo-500' : 'bg-[#10a37f]'}
          `}>
            {isUser ? <User size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden">
          <div className="prose prose-invert max-w-none leading-7 whitespace-pre-wrap">
            {message.content}
          </div>
        </div>

        {/* Action buttons (Copy) */}
        <div className="flex-shrink-0 flex flex-col items-end justify-start opacity-0 group-hover:opacity-100 transition-opacity">
           {/* We can use CSS group-hover on the parent div to show this. 
               However, mobile touch interaction might be tricky. 
               Let's make it always visible on mobile if needed, but for clean look: */}
        </div>
        
         {/* Simple copy button appearing on the right */}
         <button 
            onClick={handleCopy}
            className="self-start text-gray-400 hover:text-white transition-colors p-1"
            title="Copy text"
         >
            {copied ? <Check size={14} /> : <Copy size={14} />}
         </button>
      </div>
    </motion.div>
  );
};