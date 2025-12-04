import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainView from './components/MainView';
import Player from './components/Player';
import ChatInterface from './components/ChatInterface';
import { ViewState } from './types';
import { MessageCircle, Home, Search, Layers } from 'lucide-react';
import { ThemeProvider, useTheme } from './ThemeContext';

const AppContent = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.HOME);
  const [isChatOpen, setIsChatOpen] = useState(false); // Default closed on mobile, logic handles desktop
  const [isPlayerFullScreen, setIsPlayerFullScreen] = useState(false);
  const { theme } = useTheme();

  // Update CSS variable when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'classic') {
      root.style.setProperty('--accent', '#1DB954'); // Spotify Green
    } else {
      root.style.setProperty('--accent', '#ec4899'); // Sakura Pink
    }
  }, [theme]);

  // Auto-open chat on desktop only
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsChatOpen(true);
    }
  }, []);

  const MobileNavItem = ({ icon: Icon, label, view }: { icon: any, label: string, view: ViewState }) => (
    <div
      onClick={() => {
        setView(view);
        setIsPlayerFullScreen(false);
      }}
      className="flex flex-col items-center justify-center gap-1 cursor-pointer"
    >
      <Icon
        size={24}
        className={currentView === view ? 'text-white' : 'text-[#b3b3b3]'}
      />
      <span className={`text-[10px] ${currentView === view ? 'text-white' : 'text-[#b3b3b3]'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-black text-white overflow-hidden">
      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Desktop Only) */}
        <div id="sidebar" className="hidden md:block h-full">
          <Sidebar currentView={currentView} setView={setView} />
        </div>

        {/* Center Content (Dynamic) */}
        <div id="main-view" className="flex-1 flex flex-col overflow-hidden relative">
          <MainView view={currentView} onNavigate={setView} />

          {/* Floating Chat Button (Mobile Only / When Closed) */}
          {!isChatOpen && (
            <div className="absolute bottom-6 right-6 z-40 md:top-4 md:right-8 md:bottom-auto">
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-[#282828] hover:bg-[#3E3E3E] p-3 rounded-full shadow-lg transition-all group border border-[#333]"
                title="Open AI Assistant"
              >
                <MessageCircle className="text-[var(--accent)] group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Right Sidebar (AI Chat) */}
        {/* On mobile: Fixed inset-0 (full screen). On Desktop: Static sidebar */}
        <div
          id="chat-interface"
          className={`
            z-50 transition-transform duration-300
            ${isChatOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0 md:hidden'}
            ${isChatOpen ? 'fixed inset-0 md:static md:block' : 'hidden'}
          `}
        >
          <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </div>
      </div>

      {/* Bottom Player Bar */}
      <div id="player" className="z-40">
        <Player isFullScreen={isPlayerFullScreen} onToggleFullScreen={setIsPlayerFullScreen} />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden h-[60px] bg-black/95 backdrop-blur-md border-t border-[#282828] flex items-center justify-around px-4 pb-safe z-50">
        <MobileNavItem icon={Home} label="Home" view={ViewState.HOME} />
        <MobileNavItem icon={Search} label="Search" view={ViewState.SEARCH} />
        <MobileNavItem icon={Layers} label="Library" view={ViewState.STACK} />
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;