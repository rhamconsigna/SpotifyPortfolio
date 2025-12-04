import React from 'react';
import { Home, Search, Layers, Disc, Award, FileText, Music, Mail, Plus, ArrowRight } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItemClass = (view: ViewState | null, isActive: boolean) =>
    `flex items-center gap-4 px-4 py-3 rounded-md transition-all cursor-pointer text-sm font-bold ${isActive
      ? 'text-white'
      : 'text-[#b3b3b3] hover:text-white'
    }`;

  return (
    <div className="w-[280px] bg-black flex flex-col h-full gap-2 p-2">
      {/* Top Block: Navigation */}
      <div className="bg-[#121212] rounded-lg p-4 space-y-1">
        <div
          onClick={() => setView(ViewState.HOME)}
          className="flex items-center gap-1 mb-5 px-2 cursor-pointer"
        >
          <Music size={28} style={{ color: 'var(--accent)' }} />
          <span className="font-bold text-xl text-white tracking-tighter ml-1">Rhamify</span>
        </div>

        <div
          onClick={() => setView(ViewState.HOME)}
          className={navItemClass(ViewState.HOME, currentView === ViewState.HOME)}
        >
          <Home size={24} />
          <span>Home</span>
        </div>
        <div
          onClick={() => setView(ViewState.SEARCH)}
          className={navItemClass(ViewState.SEARCH, currentView === ViewState.SEARCH)}
        >
          <Search size={24} />
          <span>Search</span>
        </div>
      </div>

      {/* Bottom Block: Library */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="p-4 shadow-md z-10">
          <div className="flex items-center justify-between group cursor-pointer text-[#b3b3b3] hover:text-white transition-colors">
            <div className="flex items-center gap-2" onClick={() => setView(ViewState.STACK)}>
              <Layers size={24} className="text-[#b3b3b3] group-hover:text-white transition-colors" />
              <span className="font-bold text-base">Your Library</span>
            </div>
            <div className="flex items-center gap-4">
              <Plus size={20} className="hover:bg-[#282828] rounded-full p-0.5" />
              <ArrowRight size={20} className="hover:bg-[#282828] rounded-full p-0.5" />
            </div>
          </div>

          {/* Tags / Filters */}
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
            <span onClick={() => setView(ViewState.STACK)} className="bg-[#282828] hover:bg-[#333] px-3 py-1 rounded-full text-xs font-bold text-white cursor-pointer whitespace-nowrap transition-colors">
              Stacks
            </span>
            <span onClick={() => setView(ViewState.PROJECTS)} className="bg-[#282828] hover:bg-[#333] px-3 py-1 rounded-full text-xs font-bold text-white cursor-pointer whitespace-nowrap transition-colors">
              Projects
            </span>
            <span onClick={() => setView(ViewState.CONTACT)} className="bg-[#282828] hover:bg-[#333] px-3 py-1 rounded-full text-xs font-bold text-white cursor-pointer whitespace-nowrap transition-colors">
              Artists
            </span>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {/* About */}
          <div
            onClick={() => setView(ViewState.ABOUT)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#1f1f1f] ${currentView === ViewState.ABOUT ? 'bg-[#282828]' : ''}`}
          >
            <img src="/rham_profile.png" className="w-12 h-12 rounded-full object-cover" alt="Profile" />
            <div className="flex flex-col">
              <span className="text-sm font-bold" style={{ color: currentView === ViewState.ABOUT ? 'var(--accent)' : 'white' }}>Rham S. Consigna</span>
              <span className="text-xs text-[#b3b3b3]">Software Developer</span>
            </div>
          </div>

          {/* Tech Stack */}
          <div
            onClick={() => setView(ViewState.STACK)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#1f1f1f] ${currentView === ViewState.STACK ? 'bg-[#282828]' : ''}`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-800 to-purple-900 rounded-md flex items-center justify-center">
              <Layers size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold" style={{ color: currentView === ViewState.STACK ? 'var(--accent)' : 'white' }}>Tech Stack</span>
              <span className="text-xs text-[#b3b3b3]">Playlist • Rham</span>
            </div>
          </div>

          {/* Projects */}
          <div
            onClick={() => setView(ViewState.PROJECTS)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#1f1f1f] ${currentView === ViewState.PROJECTS ? 'bg-[#282828]' : ''}`}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-800 to-black rounded-md flex items-center justify-center">
              <Disc size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold" style={{ color: currentView === ViewState.PROJECTS ? 'var(--accent)' : 'white' }}>Discography</span>
              <span className="text-xs text-[#b3b3b3]">Playlist • Rham</span>
            </div>
          </div>

          {/* Awards */}
          <div
            onClick={() => setView(ViewState.CERTIFICATES)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#1f1f1f] ${currentView === ViewState.CERTIFICATES ? 'bg-[#282828]' : ''}`}
          >
            <div className="w-12 h-12 bg-[#333] rounded-md flex items-center justify-center">
              <Award size={20} className="text-yellow-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold" style={{ color: currentView === ViewState.CERTIFICATES ? 'var(--accent)' : 'white' }}>Awards</span>
              <span className="text-xs text-[#b3b3b3]">Folder</span>
            </div>
          </div>

          {/* CV */}
          <div
            onClick={() => setView(ViewState.CV)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#1f1f1f] ${currentView === ViewState.CV ? 'bg-[#282828]' : ''}`}
          >
            <div className="w-12 h-12 bg-[#333] rounded-md flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold" style={{ color: currentView === ViewState.CV ? 'var(--accent)' : 'white' }}>Curriculum Vitae</span>
              <span className="text-xs text-[#b3b3b3]">Document</span>
            </div>
          </div>

          {/* Contact Me */}
          <div
            onClick={() => setView(ViewState.CONTACT)}
            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-[#1f1f1f] ${currentView === ViewState.CONTACT ? 'bg-[#282828]' : ''}`}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--accent), black)' }}>
              <Mail size={20} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold" style={{ color: currentView === ViewState.CONTACT ? 'var(--accent)' : 'white' }}>Contact Me</span>
              <span className="text-xs text-[#b3b3b3]">Software Developer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;