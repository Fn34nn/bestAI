import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { InputArea } from './InputArea';
import { Bot } from 'lucide-react';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({ messages, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full max-w-full">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-100 p-4">
          <div className="bg-white/10 p-4 rounded-full mb-6">
            <Bot size={48} className="text-white" />
          </div>
          <h1 className="text-4xl font-semibold mb-8 text-center">MonoChat</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
            <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-center mb-2">
                    <span className="text-lg font-medium">Examples</span>
                </div>
                <button onClick={() => onSendMessage("Explain quantum computing in simple terms")} className="bg-white/5 hover:bg-white/10 p-3 rounded-lg text-sm text-center transition-colors">
                    "Explain quantum computing in simple terms"
                </button>
                <button onClick={() => onSendMessage("Got any creative ideas for a 10 year old's birthday?")} className="bg-white/5 hover:bg-white/10 p-3 rounded-lg text-sm text-center transition-colors">
                    "Got any creative ideas for a 10 year old's birthday?"
                </button>
            </div>
            <div className="flex flex-col gap-3 p-4">
                 <div className="flex items-center justify-center mb-2">
                    <span className="text-lg font-medium">Capabilities</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-sm text-center">
                    Clean, minimal UI for distraction-free writing
                </div>
                 <div className="bg-white/5 p-3 rounded-lg text-sm text-center">
                    Smooth animations powered by Framer Motion
                </div>
            </div>
             <div className="flex flex-col gap-3 p-4">
                 <div className="flex items-center justify-center mb-2">
                    <span className="text-lg font-medium">Limitations</span>
                </div>
                <div className="bg-white/5 p-3 rounded-lg text-sm text-center">
                    Currently just a local echo/self-chat (API ready)
                </div>
                 <div className="bg-white/5 p-3 rounded-lg text-sm text-center">
                   Messages are not persisted permanently
                </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-600">
          <div className="flex flex-col pb-32 pt-4">
            {messages.map((msg, index) => (
              <MessageBubble 
                key={msg.id} 
                message={msg} 
                isLast={index === messages.length - 1} 
              />
            ))}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#343541] via-[#343541] to-transparent pt-10 pb-6 px-4">
        <div className="max-w-3xl mx-auto">
            <InputArea onSendMessage={onSendMessage} />
            <div className="text-center text-xs text-white/40 mt-3 font-light">
                MonoChat v1.0. Designed for simplicity.
            </div>
        </div>
      </div>
    </div>
  );
};