import React, { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { Message, ChatSession } from './types';
import { Menu } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Mock initial data
const INITIAL_SESSION: ChatSession = {
  id: '1',
  title: 'New Chat',
  messages: [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: 'Hello! This is a demo of a modern, minimalist chat interface. Feel free to type anything to chat with yourself or test the UI animations.',
      timestamp: Date.now()
    }
  ],
  createdAt: Date.now(),
};

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([INITIAL_SESSION]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(INITIAL_SESSION.id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsiveness
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setSessions(prev => prev.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...session.messages, newMessage],
          // Update title if it's the first user message
          title: session.messages.length <= 1 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : session.title
        };
      }
      return session;
    }));
  };

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    if (isMobile) setIsSidebarOpen(false);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (filtered.length === 0) {
        // Always keep one session
        return [{
            id: Date.now().toString(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
        }];
      }
      return filtered;
    });
    // If we deleted the current session, switch to the first one
    if (id === currentSessionId) {
       // We need to access the calculated 'filtered' from above, but since we are inside a functional update,
       // we can't easily see the result immediately for the second state update.
       // Instead, we just let the render cycle handle the fallback in `currentSession` logic or use an effect.
       // However, strictly, let's just set it to the first available in the next render cycle if not found.
    }
  };
  
  // Effect to ensure currentSessionId is valid
  useEffect(() => {
      if (!sessions.find(s => s.id === currentSessionId)) {
          if (sessions.length > 0) {
              setCurrentSessionId(sessions[0].id);
          }
      }
  }, [sessions, currentSessionId]);

  return (
    <div className="flex h-full bg-[#343541] overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="absolute inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`
              fixed md:relative z-30 h-full w-[260px] flex-shrink-0 
              bg-[#202123] border-r border-white/10
            `}
          >
            <Sidebar 
              sessions={sessions}
              currentSessionId={currentSessionId}
              onNewChat={handleNewChat}
              onSelectSession={handleSelectSession}
              onDeleteSession={handleDeleteSession}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Header (Mobile / Toggle) */}
        <div className="sticky top-0 z-10 flex items-center p-2 text-gray-200 bg-[#343541] md:hidden">
            <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-md transition-colors"
            >
                <Menu size={24} />
            </button>
            <span className="ml-4 font-medium truncate">{currentSession.title}</span>
        </div>

        {/* Desktop Toggle (Floating) - Optional, but keeps UI clean to hide it */}
         {!isMobile && !isSidebarOpen && (
            <div className="absolute top-2 left-2 z-10">
                 <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-3 text-white/50 hover:text-white bg-transparent hover:bg-white/5 rounded-md transition-all"
                    title="Open Sidebar"
                >
                    <Menu size={20} />
                </button>
            </div>
         )}
          {/* Desktop Close Sidebar Button - inside sidebar typically, but we can put it here if sidebar is open */}
          {!isMobile && isSidebarOpen && (
             <div className="absolute top-2 left-2 z-10 md:hidden"> 
                {/* Handled by mobile header, this block is just a placeholder logic check */}
             </div>
          )}


        <ChatArea 
          messages={currentSession.messages} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
}