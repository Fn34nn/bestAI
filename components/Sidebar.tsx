import React from 'react';
import { Plus, MessageSquare, Trash2, Github } from 'lucide-react';
import { ChatSession } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onNewChat,
  onSelectSession,
  onDeleteSession,
}) => {
  return (
    <div className="flex flex-col h-full p-2">
      <button
        onClick={onNewChat}
        className="flex items-center gap-3 px-3 py-3 mb-4 text-sm text-white transition-colors border rounded-md border-white/20 hover:bg-gray-900 cursor-pointer"
      >
        <Plus size={16} />
        New chat
      </button>

      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
        <AnimatePresence initial={false}>
          {sessions.map((session) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                onClick={() => onSelectSession(session.id)}
                className={`
                  group flex items-center gap-3 px-3 py-3 text-sm text-gray-100 rounded-md cursor-pointer transition-colors relative
                  ${currentSessionId === session.id ? 'bg-[#343541]' : 'hover:bg-[#2A2B32]'}
                `}
              >
                <MessageSquare size={16} className="text-gray-400 shrink-0" />
                <div className="flex-1 truncate pr-6 select-none">
                  {session.title || 'New Chat'}
                </div>
                
                {/* Delete button only visible on hover or active */}
                {(currentSessionId === session.id) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pt-2 border-t border-white/20">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-3 px-3 py-3 text-sm text-gray-100 transition-colors rounded-md hover:bg-[#2A2B32]"
        >
            <Github size={16} />
            <span>View on GitHub</span>
        </a>
      </div>
    </div>
  );
};