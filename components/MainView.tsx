import React, { useState, useRef, useEffect } from 'react';
import { ViewState, Project } from '../types';
import { PROJECTS, SKILLS, USER_PROFILE, JOURNEY_ALBUMS } from '../constants';
import { Play, Clock, MoreHorizontal, Github, ExternalLink, Download, FileText, Linkedin, Facebook, Mail, Send, Heart, UserPlus, CheckCircle2, Disc, Layers, Award, Printer, Share2, Code, Palette, Copy, Search, Sparkles, X, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

import { useTheme } from '../ThemeContext';
import { sendMessageToGemini } from '../services/geminiService';

interface MainViewProps {
    view: ViewState;
    // Optional prop to switch view from within MainView (e.g. searching cards)
    onNavigate?: (view: ViewState) => void;
}

const MainView: React.FC<MainViewProps> = ({ view, onNavigate }) => {
    const [emailForm, setEmailForm] = useState({ subject: '', body: '', email: '' });
    const [emailError, setEmailError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    // Follow / Connect State
    const [isFollowing, setIsFollowing] = useState(false);
    const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
    const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
    const [isEmailSuccessModalOpen, setIsEmailSuccessModalOpen] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [aiResponse, setAiResponse] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Album State
    const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
    const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const { theme, toggleTheme } = useTheme();

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEmailSend = async () => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailForm.email || !emailRegex.test(emailForm.email)) {
            setEmailError('Please enter a valid email address.');
            return;
        }

        // Clear error
        setEmailError('');
        setIsSending(true);

        try {
            const formattedMessage = `
New Contact Inquiry from Portfolio

Sender: ${emailForm.email}
Subject: ${emailForm.subject}

Message:
${emailForm.body}

-----------------------------------
Sent via Rham's Portfolio
            `.trim();

            await emailjs.send(
                'service_u8xe0qr',
                'template_vvmcuct',
                {
                    from_email: emailForm.email,
                    subject: emailForm.subject,
                    message: formattedMessage
                },
                'DYbwVBHhZt2Xyx85S'
            );

            // Show success modal and reset form
            setIsEmailSuccessModalOpen(true);
            setEmailForm({ subject: '', body: '', email: '' });
        } catch (error) {
            console.error('Email sending failed:', error);
            alert('Failed to send email. Please try again later.');
        } finally {
            setIsSending(false);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Profile link copied to clipboard!");
        setIsMenuOpen(false);
    };

    const handlePrint = () => {
        window.print();
        setIsMenuOpen(false);
    };

    const handleSourceCode = () => {
        window.open("https://github.com/rhamconsigna", "_blank");
        setIsMenuOpen(false);
    };

    const handleFollowClick = () => {
        setIsFollowing(true);
        setIsFollowModalOpen(true);
    };

    const handleProjectClick = (project: Project) => {
        if (project.link) {
            window.open(project.link, '_blank');
        }
    };

    const handleDownloadCV = async () => {
        try {
            const response = await fetch('/Rham_Consigna_CV.pdf');
            const blobData = await response.blob();
            const blob = new Blob([blobData], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Rham_Consigna_CV.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleViewCV = () => {
        window.open('/Rham_Consigna_CV.pdf', '_blank');
    };

    const handleAiSearch = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            setIsAiLoading(true);
            setAiResponse(null);
            try {
                // We prompt Gemini to be brief and act as a search assistant
                const prompt = `User is searching for: "${searchQuery}" in the portfolio. Provide a brief, enthusiastic summary or answer about Rham's relation to this query (max 2 sentences).`;
                const response = await sendMessageToGemini(prompt);
                setAiResponse(response);
            } catch (error) {
                setAiResponse("I couldn't fetch a live insight, but check out the results below!");
            } finally {
                setIsAiLoading(false);
            }
        }
    };

    const Header = ({ title, subtitle, type = "Playlist", color = "from-neutral-800", image, backgroundImage }: { title: string, subtitle: string | React.ReactNode, type?: string, color?: string, image?: React.ReactNode, backgroundImage?: string }) => (
        <div
            className={`relative flex flex-col md:flex-row md:items-end gap-6 p-6 md:p-8 transition-colors duration-500 min-h-[340px] md:h-80 overflow-hidden`}
        >
            {backgroundImage ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-[50%_25%] md:bg-center z-0"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${color} to-[#121212] opacity-80 z-0`} />
                </>
            ) : (
                <div className={`absolute inset-0 bg-gradient-to-b ${color} to-[#121212] z-0`} />
            )}

            <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6 w-full">
                <div className="mx-auto md:mx-0 w-48 h-48 md:w-[232px] md:h-[232px] bg-[#282828] shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex items-center justify-center text-6xl shrink-0 group overflow-hidden rounded-md">
                    {image ? image : <span className="group-hover:scale-110 transition-transform duration-300">🎵</span>}
                </div>
                <div className="w-full text-center md:text-left mb-2">
                    <p className="text-xs md:text-sm font-bold uppercase tracking-normal text-white mb-1 md:mb-2">{type}</p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter mb-4 md:mb-6 whitespace-nowrap shadow-lg">{title}</h1>
                    <div className="text-[#b3b3b3] text-xs md:text-sm font-medium flex flex-wrap items-center justify-center md:justify-start gap-1">
                        {subtitle}
                    </div>
                </div>
            </div>
        </div>
    );

    const ActionButtons = () => (
        <div id="action-buttons" className="flex items-center justify-center md:justify-start gap-6 mb-8 relative">
            <button
                onClick={handleViewCV}
                className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 hover:brightness-105 transition shadow-lg text-black" style={{ backgroundColor: 'var(--accent)' }}>
                <Play size={24} fill="currentColor" />
            </button>
            <button
                onClick={handleFollowClick}
                className={`px-6 py-2 border rounded-full text-xs md:text-sm font-bold transition hover:scale-105 uppercase tracking-widest ${isFollowing
                    ? 'text-[var(--accent)] border-[var(--accent)]'
                    : 'border-[#727272] hover:border-white text-white'
                    }`}
                style={isFollowing ? { color: 'var(--accent)', borderColor: 'var(--accent)' } : {}}
            >
                {isFollowing ? 'Connected' : 'Follow'}
            </button>

            {/* Three Dot Menu */}
            <div className="relative" ref={menuRef}>
                <MoreHorizontal
                    className="text-[#b3b3b3] hover:text-white cursor-pointer"
                    size={28}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                />
                {isMenuOpen && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-56 bg-[#282828] rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={handleShare} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2">
                            <Share2 size={16} /> Share Profile
                        </button>
                        <button onClick={toggleTheme} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2">
                            <Palette size={16} /> Change Theme
                        </button>
                        <button onClick={handlePrint} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2">
                            <Printer size={16} /> Print Portfolio
                        </button>
                        <div className="h-[1px] bg-[#3E3E3E] my-1 mx-2"></div>
                        <button onClick={handleSourceCode} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2">
                            <Code size={16} /> Source Code
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderContent = () => {
        switch (view) {
            case ViewState.HOME:
                return (
                    <>
                        <Header
                            title={USER_PROFILE.name}
                            type="Software Developer"
                            subtitle={
                                <>
                                    <span className="text-white font-bold">Rham S. Consigna</span>
                                    <span className="hidden md:inline"> • 1,204,932 monthly listeners • </span>
                                    <span className="md:hidden"> • </span>
                                    <span className="text-white opacity-70">{USER_PROFILE.role}</span>
                                </>
                            }
                            color="from-[var(--accent)]"
                            backgroundImage="/header_bg.jpg"
                            image={<img src="/rham_profile.png" className="w-full h-full object-cover" />}
                        />
                        <div className="p-4 md:p-8 bg-gradient-to-b from-[#121212]/40 to-[#121212] min-h-[50vh]">
                            <ActionButtons />

                            <h2 className="text-xl md:text-2xl font-bold mb-4 text-white hover:underline cursor-pointer">Popular Releases</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
                                {PROJECTS.slice(0, 5).map(p => (
                                    <div
                                        key={p.id}
                                        className="bg-[#181818] hover:bg-[#282828] p-4 rounded-md transition duration-300 group cursor-pointer flex md:block items-center md:items-start gap-4 md:gap-0"
                                        onClick={() => handleProjectClick(p)}
                                    >
                                        <div className="mb-0 md:mb-4 relative shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.5)] w-16 h-16 md:w-full md:h-auto">
                                            <img src={p.image} alt={p.title} className="w-full h-full aspect-video object-cover object-top rounded-md" />
                                            <div className="absolute bottom-2 right-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl hidden md:block">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-black hover:scale-105" style={{ backgroundColor: 'var(--accent)' }}>
                                                    {p.link ? <ExternalLink size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white truncate text-base">{p.title}</h3>
                                            <p className="text-sm text-[#a7a7a7] line-clamp-2 mt-1 md:mt-2 leading-tight">{p.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                );

            case ViewState.SEARCH:
                // -- Search Logic --
                // 1. Filter Projects
                const filteredProjects = PROJECTS.filter(p =>
                    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
                );
                // 2. Filter Skills
                const filteredSkills = SKILLS.flatMap(cat => cat.skills).filter(s =>
                    s.toLowerCase().includes(searchQuery.toLowerCase())
                );
                // 3. Filter Awards
                const filteredAwards = USER_PROFILE.achievements.filter(a =>
                    a.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                    <div className="bg-[#121212] min-h-full p-4 md:p-8 pt-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Browse All</h2>

                        {/* Browse All Grid (Visible when no search query) */}
                        {!searchQuery && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                                {[
                                    { title: "Discography", color: "bg-purple-600", view: ViewState.PROJECTS, icon: Disc },
                                    { title: "Tech Stack", color: "bg-green-600", view: ViewState.STACK, icon: Layers },
                                    { title: "Awards", color: "bg-blue-600", view: ViewState.CERTIFICATES, icon: Award },
                                    { title: "About Rham", color: "bg-red-600", view: ViewState.ABOUT, icon: UserPlus },
                                    { title: "Contact", color: "bg-orange-600", view: ViewState.CONTACT, icon: Mail },
                                    { title: "CV", color: "bg-gray-600", view: ViewState.CV, icon: FileText },
                                ].map((cat, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => onNavigate?.(cat.view)}
                                        className={`${cat.color} aspect-square rounded-lg p-3 md:p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}
                                    >
                                        <h3 className="text-lg md:text-2xl font-bold text-white break-words max-w-[80%]">{cat.title}</h3>
                                        <cat.icon size={50} className="absolute -bottom-2 -right-4 rotate-[25deg] text-white/40 shadow-sm md:w-16 md:h-16" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Results View (Visible when typing) */}
                        {searchQuery && (
                            <div className="space-y-8 animate-in fade-in duration-300">

                                {/* AI Command Center Card */}
                                <div className="bg-gradient-to-r from-indigo-900 to-[#181818] p-4 md:p-6 rounded-xl border border-indigo-500/30">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                                            {isAiLoading ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Sparkles size={20} className="text-white" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base md:text-lg font-bold text-white mb-1">AI Insight</h3>
                                            <p className="text-[#e0e0e0] text-xs md:text-sm leading-relaxed">
                                                {aiResponse || "Press ENTER to ask Gemini AI for a deep dive on this topic..."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Results Sections */}
                                {filteredProjects.length > 0 && (
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-4">Songs (Projects)</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                            {filteredProjects.map(p => (
                                                <div key={p.id} onClick={() => handleProjectClick(p)} className="flex items-center gap-3 md:gap-4 bg-[#181818] hover:bg-[#282828] p-2 md:p-3 rounded-md transition cursor-pointer group">
                                                    <img src={p.image} className="w-10 h-10 md:w-12 md:h-12 rounded object-cover" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white font-bold truncate group-hover:underline text-sm md:text-base">{p.title}</div>
                                                        <div className="text-[#b3b3b3] text-xs md:text-sm truncate">{p.tags.join(", ")}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ... (Skills and Awards logic similar) ... */}
                                {/* Keeping it concise, the logic is fine, styling handles responsiveness */}
                                {filteredSkills.length > 0 && (
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-4">Skills</h3>
                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                            {filteredSkills.map((s, i) => (
                                                <span key={i} className="px-3 py-1.5 md:px-4 md:py-2 bg-[#282828] rounded-full text-white text-xs md:text-sm font-medium border border-transparent hover:border-white transition cursor-pointer">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {filteredAwards.length > 0 && (
                                    <div>
                                        <h3 className="text-lg md:text-xl font-bold text-white mb-4">Achievements</h3>
                                        <div className="space-y-2">
                                            {filteredAwards.map((a, i) => (
                                                <div key={i} className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition cursor-pointer text-sm md:text-base">
                                                    <Award size={18} style={{ color: 'var(--accent)' }} />
                                                    <span>{a}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case ViewState.ABOUT:
                return (
                    <>
                        <Header
                            title="Rham S. Consigna"
                            subtitle="1,042,392 Monthly Listeners"
                            type="Software Developer"
                            color="from-[var(--accent)]"
                            backgroundImage="/header_bg.jpg"
                            image={<img src="/rham_profile.png" className="w-full h-full object-cover" />}
                        />
                        <div className="p-4 md:p-8 bg-[#121212] min-h-screen">
                            <ActionButtons />

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                                <div className="col-span-2">
                                    <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-white">Biography</h2>
                                    <div className="text-[#b3b3b3] text-base md:text-lg leading-relaxed space-y-4 font-normal">
                                        <p className="text-white font-bold text-xl mb-2">
                                            Rham S. Consigna | Developer & Student Leader
                                        </p>
                                        <p>
                                            As the Vice President of ACES (STI Ortigas-Cainta), I lead with a vision to modernize the standard. I bridge the gap between concept and reality, specializing in building intelligent productivity tools and dynamic web applications.
                                        </p>
                                        <p>
                                            My stack is my toolkit: proficient in Java for logic, TypeScript for scale, and Modern Web Frameworks for experience. I build apps that don't just function—they perform.
                                        </p>
                                    </div>

                                    {/* Journey Albums Section */}
                                    <div className="mt-12">
                                        <h2 className="text-xl md:text-2xl font-bold mb-6 text-white">Journey</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {JOURNEY_ALBUMS.map((album) => (
                                                <div
                                                    key={album.id}
                                                    onClick={() => {
                                                        setSelectedAlbum(album);
                                                        setIsAlbumModalOpen(true);
                                                    }}
                                                    className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer group"
                                                >
                                                    <div className="relative mb-4 aspect-square shadow-lg">
                                                        <img src={album.cover} alt={album.title} className="w-full h-full object-cover rounded-md" />
                                                        <div className="absolute right-2 bottom-2 bg-[var(--accent)] rounded-full p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                                                            <Play fill="black" className="text-black" size={20} />
                                                        </div>
                                                    </div>
                                                    <h3 className="text-white font-bold truncate">{album.title}</h3>
                                                    <p className="text-[#b3b3b3] text-sm mt-1">{album.year}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* On Tour Section */}
                                <div className="space-y-4">
                                    <div className="bg-[#181818] p-4 md:p-6 rounded-lg hover:bg-[#282828] transition cursor-pointer">
                                        <h3 className="text-white font-bold mb-2">On Tour</h3>
                                        <p className="text-sm text-[#b3b3b3] mb-4">Upcoming Hackathons & Events</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="bg-[#2a2a2a] p-3 rounded flex items-center justify-between">
                                                <div>
                                                    <div className="font-bold text-white text-sm">Ollopa Corp. Internship</div>
                                                    <div className="text-xs text-[#b3b3b3]">(Not yet announced)</div>
                                                </div>
                                                <div className="text-xs font-bold text-white">DEC - 2026</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );

            case ViewState.PROJECTS:
                return (
                    <div className="bg-gradient-to-b from-[#2a2a2a] to-[#121212] min-h-full">
                        <Header
                            title="Discography"
                            type="Compilation"
                            subtitle={<><span className="font-bold text-white">Rham S. Consigna</span> • 5 songs, 1 hr 15 min</>}
                            color="from-[#555]"
                            image={<div className="w-full h-full bg-gradient-to-tr from-gray-800 to-black flex items-center justify-center"><Disc size={64} className="text-white md:w-20 md:h-20" /></div>}
                        />

                        <div className="p-4 md:p-8 pt-4 bg-[#121212]/20 backdrop-blur-3xl min-h-[50vh]">
                            <div className="flex items-center justify-center md:justify-start gap-6 mb-8">
                                <button
                                    onClick={handleViewCV}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 hover:brightness-105 transition shadow-lg text-black" style={{ backgroundColor: 'var(--accent)' }}>
                                    <Play size={24} fill="currentColor" />
                                </button>
                                <Heart size={28} style={{ color: 'var(--accent)' }} />
                                <Download size={24} className="text-[#b3b3b3] hover:text-white hidden md:block" />
                                <div className="relative" ref={menuRef}>
                                    <MoreHorizontal
                                        className="text-[#b3b3b3] hover:text-white cursor-pointer"
                                        size={24}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    />
                                    {isMenuOpen && (
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-56 bg-[#282828] rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                            {/* Menu Items (Same as before) */}
                                            <button onClick={handleShare} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Share2 size={16} /> Share Profile</button>
                                            <button onClick={toggleTheme} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Palette size={16} /> Change Theme</button>
                                            <button onClick={handlePrint} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Printer size={16} /> Print Portfolio</button>
                                            <div className="h-[1px] bg-[#3E3E3E] my-1 mx-2"></div>
                                            <button onClick={handleSourceCode} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Code size={16} /> Source Code</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                {/* Table Header - Hidden on mobile mostly */}
                                <div className="grid grid-cols-12 text-sm text-[#b3b3b3] border-b border-[#282828] pb-2 px-4 uppercase tracking-wider font-medium">
                                    <div className="col-span-2 md:col-span-1 text-center">#</div>
                                    <div className="col-span-8 md:col-span-6">Title</div>
                                    <div className="hidden md:block col-span-3">Role</div>
                                    <div className="hidden md:block col-span-2 text-right"><Clock size={16} className="inline" /></div>
                                    <div className="md:hidden col-span-2 text-right"></div>
                                </div>

                                {PROJECTS.map((project, idx) => (
                                    <div
                                        key={project.id}
                                        onClick={() => handleProjectClick(project)}
                                        className="grid grid-cols-12 items-center p-2 md:p-3 px-2 md:px-4 rounded-md hover:bg-[#2a2a2a] group transition-colors cursor-pointer"
                                    >
                                        <div className="col-span-2 md:col-span-1 text-[#b3b3b3] font-medium flex items-center justify-center text-base">
                                            <span className="md:group-hover:hidden">{idx + 1}</span>
                                            {project.link ? <ExternalLink size={16} className="hidden md:group-hover:block text-white" /> : <Play size={16} className="hidden md:group-hover:block text-white fill-white" />}
                                        </div>
                                        <div className="col-span-8 md:col-span-6 flex items-center gap-3 md:gap-4">
                                            <img src={project.image} className="w-10 h-10 rounded shadow object-cover shrink-0" alt="cover" />
                                            <div className="min-w-0">
                                                <div className="text-white font-medium text-sm md:text-base hover:underline cursor-pointer line-clamp-1">{project.title}</div>
                                                <div className="text-[#b3b3b3] text-xs flex gap-2 mt-0.5 group-hover:text-white transition-colors line-clamp-1">
                                                    {project.tags.join(", ")}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block col-span-3 text-[#b3b3b3] text-sm group-hover:text-white cursor-pointer transition-colors">
                                            {project.role || "Developer"}
                                        </div>
                                        <div className="col-span-2 flex justify-end gap-4 text-[#b3b3b3] md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Heart size={18} className="hover:text-white cursor-pointer" />
                                            <span className="hidden md:inline text-xs mt-0.5">3:42</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case ViewState.STACK:
                return (
                    <div className="bg-[#121212] min-h-full">
                        <Header
                            title="Your Library"
                            type="Collection"
                            subtitle={<><span className="font-bold text-white">Rham S. Consigna</span> • 4 playlists</>}
                            color="from-[#450a0a]"
                            image={<div className="w-full h-full bg-gradient-to-tr from-purple-800 to-black flex items-center justify-center"><Layers size={64} className="text-white md:w-20 md:h-20" /></div>}
                        />
                        <div className="p-4 md:p-8 pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {SKILLS.map((cat, i) => (
                                    <div key={i} className="bg-[#181818] p-4 md:p-5 rounded-lg hover:bg-[#282828] transition duration-300 group cursor-pointer shadow-lg flex sm:block gap-4 items-center">
                                        <div className="w-16 h-16 sm:w-full sm:aspect-square bg-[#333] rounded-md mb-0 sm:mb-4 flex items-center justify-center shadow-lg relative overflow-hidden shrink-0">
                                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/50"></div>
                                            <h3 className="text-xs sm:text-2xl font-bold text-white relative z-10 p-1 sm:p-4 text-center">{cat.name}</h3>
                                        </div>
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <h4 className="text-white font-bold truncate text-sm sm:text-base">{cat.name} Mix</h4>
                                            <p className="text-[#a7a7a7] text-xs sm:text-sm line-clamp-2">
                                                {cat.skills.join(", ")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case ViewState.CERTIFICATES:
                return (
                    <div className="bg-gradient-to-b from-yellow-800/40 to-[#121212] min-h-full">
                        <Header
                            title="Awards Hall"
                            type="Playlist"
                            subtitle={<><span className="font-bold text-white">Rham S. Consigna</span> • 3 certifications</>}
                            color="from-yellow-700"
                            image={<div className="w-full h-full bg-gradient-to-tr from-yellow-600 to-black flex items-center justify-center"><Award size={64} className="text-white md:w-20 md:h-20" /></div>}
                        />
                        <div className="p-4 md:p-8 pt-4">
                            <div className="flex items-center justify-center md:justify-start gap-6 mb-8">
                                <button
                                    onClick={handleViewCV}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 hover:brightness-105 transition shadow-lg text-black" style={{ backgroundColor: 'var(--accent)' }}>
                                    <Play size={24} fill="currentColor" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {USER_PROFILE.achievements.map((ach, i) => (
                                    <div key={i} className="flex items-center gap-4 md:gap-6 p-4 bg-[#181818]/60 rounded-md hover:bg-[#2a2a2a] transition cursor-pointer group border border-transparent hover:border-[#333]">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#282828] rounded flex items-center justify-center font-bold text-lg md:text-xl shadow-lg transition-colors shrink-0" style={{ color: 'var(--accent)' }}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base md:text-lg font-bold text-white group-hover:underline line-clamp-2">{ach}</h3>
                                            <p className="text-[#b3b3b3] text-xs md:text-sm group-hover:text-white transition-colors">2025 Season • Certified Hit</p>
                                        </div>
                                        <div className="text-[#b3b3b3] text-xs md:text-sm whitespace-nowrap">
                                            <CheckCircle2 className="inline mr-1 md:mr-2 w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--accent)' }} /> Verified
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case ViewState.CONTACT:
                // Reuse similar patterns for responsiveness
                return (
                    <div className="bg-gradient-to-b from-[#503e3e] to-[#121212] min-h-full pb-24 md:pb-12">
                        <Header
                            title="Contact Rham"
                            type="Public Playlist"
                            subtitle="3 links, 1 email address"
                            color="from-[#503e3e]"
                            image={
                                <div className="w-full h-full bg-[#1e1e1e] flex flex-col items-center justify-center relative">
                                    <Mail size={64} className="mb-2 z-10 md:w-20 md:h-20" style={{ color: 'var(--accent)' }} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <span className="z-10 text-white font-bold tracking-widest uppercase text-[10px] md:text-xs">Get In Touch</span>
                                </div>
                            }
                        />

                        <div className="p-4 md:p-8 pt-6">
                            {/* Action Bar */}
                            <div className="flex items-center justify-center md:justify-start gap-8 mb-8">
                                <button
                                    onClick={() => window.location.href = `mailto:rham12222006@gmail.com`}
                                    className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 hover:brightness-105 transition shadow-lg text-black"
                                    title="Send Email"
                                    style={{ backgroundColor: 'var(--accent)' }}
                                >
                                    <Play size={24} fill="currentColor" className="ml-1" />
                                </button>
                                <Heart size={32} style={{ color: 'var(--accent)' }} fill="var(--accent)" />

                                {/* 3 Dot Menu */}
                                <div className="relative" ref={menuRef}>
                                    <MoreHorizontal
                                        className="text-[#b3b3b3] hover:text-white cursor-pointer"
                                        size={32}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    />
                                    {isMenuOpen && (
                                        <div className="absolute top-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-0 w-56 bg-[#282828] rounded-md shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                                            <button onClick={handleShare} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Share2 size={16} /> Share Profile</button>
                                            <button onClick={toggleTheme} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Palette size={16} /> Change Theme</button>
                                            <button onClick={handlePrint} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Printer size={16} /> Print Portfolio</button>
                                            <div className="h-[1px] bg-[#3E3E3E] my-1 mx-2"></div>
                                            <button onClick={handleSourceCode} className="w-full text-left px-4 py-3 text-sm text-[#e0e0e0] hover:bg-[#3E3E3E] flex items-center gap-2"><Code size={16} /> Source Code</button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Socials as Tracks - Responsive Table */}
                            <div className="mb-12">
                                <div className="grid grid-cols-12 text-sm text-[#b3b3b3] border-b border-[#333] pb-2 px-4 uppercase tracking-wider font-medium mb-2">
                                    <div className="col-span-2 md:col-span-1 text-center">#</div>
                                    <div className="col-span-8 md:col-span-5">Network</div>
                                    <div className="hidden md:block col-span-4">Username</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                {[
                                    { icon: Facebook, label: "Facebook", user: "@rham.fb", link: "https://www.facebook.com/rham.consigna", color: "text-blue-500" },
                                    { icon: Linkedin, label: "LinkedIn", user: "/in/rham-dev", link: "https://www.linkedin.com/in/rham-consigna-ba405b38b", color: "text-blue-400" },
                                    { icon: Github, label: "GitHub", user: "@rham-code", link: "https://github.com/rhamconsigna", color: "text-white" }
                                ].map((social, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => window.open(social.link, '_blank')}
                                        className="grid grid-cols-12 items-center p-3 px-4 rounded-md hover:bg-[#2a2a2a] group transition-colors cursor-pointer"
                                    >
                                        <div className="col-span-2 md:col-span-1 text-[#b3b3b3] font-medium flex items-center justify-center text-base">
                                            <span className="md:group-hover:hidden">{idx + 1}</span>
                                            <Play size={14} className="hidden md:group-hover:block text-white fill-white" />
                                        </div>
                                        <div className="col-span-8 md:col-span-5 flex items-center gap-4">
                                            <div className="w-10 h-10 bg-[#333] rounded flex items-center justify-center">
                                                <social.icon size={20} className={`${social.color}`} />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium text-base hover:underline">{social.label}</div>
                                                <div className="text-[#b3b3b3] text-xs">Social Link</div>
                                            </div>
                                        </div>
                                        <div className="hidden md:block col-span-4 text-[#b3b3b3] text-sm group-hover:text-white">
                                            {social.user}
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <ExternalLink size={18} className="text-[#b3b3b3] group-hover:text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Email Form */}
                            <div className="mt-8">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 hover:underline cursor-pointer">Send a Message</h2>
                                <div className="bg-[#181818] rounded-lg p-4 md:p-6 hover:bg-[#202020] transition-colors max-w-2xl group">
                                    {/* ... (Existing form content, input widths handle responsiveness naturally) ... */}
                                    {/* Just reusing existing structure, flex/w-full handles it */}
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#333] flex items-center justify-center">
                                            <Mail size={24} className="text-white md:w-8 md:h-8" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] md:text-xs font-bold uppercase text-[#b3b3b3] mb-1">Direct Contact</p>
                                            <h3 className="text-lg md:text-xl font-bold text-white break-all">rham12222006@gmail.com</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-1">
                                            <input
                                                type="email"
                                                placeholder="Your Email"
                                                value={emailForm.email}
                                                onChange={(e) => {
                                                    setEmailForm({ ...emailForm, email: e.target.value });
                                                    if (emailError) setEmailError('');
                                                }}
                                                className={`w-full bg-[#2a2a2a] text-white border ${emailError ? 'border-red-500' : 'border-transparent'} focus:border-[#444] rounded p-3 outline-none transition-colors placeholder-[#727272] text-sm`}
                                            />
                                            {emailError && <span className="text-red-500 text-xs ml-1">{emailError}</span>}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            value={emailForm.subject}
                                            onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                            className="w-full bg-[#2a2a2a] text-white border border-transparent focus:border-[#444] rounded p-3 outline-none transition-colors placeholder-[#727272] text-sm"
                                        />
                                        <textarea
                                            rows={4}
                                            placeholder="Write your message here..."
                                            value={emailForm.body}
                                            onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                                            className="w-full bg-[#2a2a2a] text-white border border-transparent focus:border-[#444] rounded p-3 outline-none transition-colors placeholder-[#727272] text-sm resize-none"
                                        />
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleEmailSend}
                                                disabled={isSending}
                                                className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform text-sm tracking-widest uppercase flex items-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
                                            >
                                                {isSending ? (
                                                    <>
                                                        <Loader2 size={16} className="animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    "Send Email"
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case ViewState.CV:
                return (
                    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#333] to-[#121212] p-8 text-center">
                        {/* ... (CV View logic) ... */}
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-[#282828] rounded-full flex items-center justify-center mb-6 shadow-2xl relative group cursor-pointer">
                            <FileText size={60} className="md:w-20 md:h-20 group-hover:opacity-50 transition-opacity" style={{ color: 'var(--accent)' }} />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Download size={32} className="text-white md:w-10 md:h-10" />
                            </div>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Rham's CV</h2>
                        <p className="text-[#b3b3b3] mb-8 max-w-md font-medium text-sm md:text-base">
                            The complete professional history. <br /> Includes Education, Experience, and Skill breakdowns.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={handleDownloadCV}
                                className="text-black px-8 py-3 rounded-full font-bold tracking-widest hover:scale-105 transition hover:brightness-105 w-full md:w-auto"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                DOWNLOAD
                            </button>
                            <button
                                onClick={handleViewCV}
                                className="bg-transparent border border-[#727272] text-white px-8 py-3 rounded-full font-bold tracking-widest hover:scale-105 transition hover:border-white w-full md:w-auto"
                            >
                                PREVIEW
                            </button>
                        </div>
                        <p className="text-[10px] text-[#b3b3b3] mt-8 uppercase tracking-widest">Released 2025 • High Quality PDF</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex-1 bg-[#121212] overflow-y-auto relative custom-scrollbar pb-[60px] md:pb-0">
            {/* Sticky Top Bar */}
            <div id="top-bar" className="sticky top-0 z-30 h-16 bg-[#000000]/60 backdrop-blur-md px-4 md:px-8 flex items-center justify-between transition-colors">
                <div className="flex gap-4 items-center flex-1">
                    {/* Nav Arrows - Hidden on Mobile */}
                    <div className="hidden md:flex gap-2">
                        <div className="w-8 h-8 bg-[#000000]/70 rounded-full flex items-center justify-center cursor-pointer text-[#b3b3b3] hover:text-white" onClick={() => window.history.back()}>
                            &lt;
                        </div>
                        <div className="w-8 h-8 bg-[#000000]/70 rounded-full flex items-center justify-center cursor-pointer text-[#b3b3b3] hover:text-white" onClick={() => window.history.forward()}>
                            &gt;
                        </div>
                    </div>
                    {/* Search Input (Only shown in Search View) - Full width on mobile */}
                    {view === ViewState.SEARCH && (
                        <div className="relative max-w-sm w-full md:ml-4 group">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#121212] group-focus-within:text-black z-10" />
                            <input
                                type="text"
                                placeholder="What do you want to play?"
                                className="w-full bg-[#242424] text-white rounded-full py-2.5 pl-10 pr-4 text-base focus:outline-none focus:bg-white focus:text-black focus:ring-2 focus:ring-white transition-all placeholder-[#b3b3b3] group-focus-within:placeholder-black/70"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleAiSearch}
                            />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsPremiumModalOpen(true)}
                        className="bg-white text-black text-sm font-bold px-4 py-1.5 rounded-full hover:scale-105 transition hidden md:block">
                        Explore Premium
                    </button>
                    <div className="relative" ref={profileMenuRef}>
                        <div
                            className="w-8 h-8 bg-[#282828] rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 border-2 border-transparent hover:border-white transition p-1"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        >
                            <img src="/rham_profile.png" className="rounded-full w-full h-full object-cover" />
                        </div>

                        {isProfileMenuOpen && (
                            <div className="absolute right-0 top-10 w-48 bg-[#282828] rounded shadow-xl py-1 z-50 border border-[#333]">
                                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer" onClick={() => { onNavigate?.(ViewState.PROJECTS); setIsProfileMenuOpen(false); }}>Discography</div>
                                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer" onClick={() => { onNavigate?.(ViewState.STACK); setIsProfileMenuOpen(false); }}>Tech Stack</div>
                                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer" onClick={() => { onNavigate?.(ViewState.CERTIFICATES); setIsProfileMenuOpen(false); }}>Awards</div>
                                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer" onClick={() => { onNavigate?.(ViewState.ABOUT); setIsProfileMenuOpen(false); }}>About Rham</div>
                                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer" onClick={() => { onNavigate?.(ViewState.CONTACT); setIsProfileMenuOpen(false); }}>Contact</div>
                                <div className="h-[1px] bg-[#3E3E3E] my-1"></div>
                                <div className="px-4 py-2 hover:bg-[#3E3E3E] text-white text-sm cursor-pointer" onClick={() => { onNavigate?.(ViewState.CV); setIsProfileMenuOpen(false); }}>CV</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {renderContent()}
            <div className="h-24 md:h-24" /> {/* Spacer for bottom player */}

            {/* Follow Modal (Responsive) */}
            {/* ... (Existing modal is reasonably responsive due to fixed inset-0) ... */}
            {isFollowModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsFollowModalOpen(false)}>
                    <div className="bg-[#181818] border border-[#282828] p-6 rounded-xl shadow-2xl max-w-sm w-full transform scale-100 transition-all" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-[#282828] rounded-full mx-auto flex items-center justify-center mb-3 shadow-lg">
                                <UserPlus size={32} style={{ color: 'var(--accent)' }} />
                            </div>
                            <h3 className="text-xl font-bold text-white">Connect with Rham</h3>
                            <p className="text-[#b3b3b3] text-sm mt-1">Let's build something great together.</p>
                        </div>

                        <div className="space-y-3">
                            {/* ... (Links) ... */}
                            <a href="https://linkedin.com/in/rham-consigna-ba405b38b" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-lg bg-[#282828] hover:bg-[#333] border border-transparent hover:border-[#444] group transition-all">
                                <div className="flex items-center gap-3">
                                    <Linkedin size={20} className="text-[#0077b5]" />
                                    <span className="font-bold text-white">LinkedIn</span>
                                </div>
                                <ExternalLink size={16} className="text-[#b3b3b3] group-hover:text-white" />
                            </a>

                            <a href="https://github.com/rhamconsigna" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-lg bg-[#282828] hover:bg-[#333] border border-transparent hover:border-[#444] group transition-all">
                                <div className="flex items-center gap-3">
                                    <Github size={20} className="text-white" />
                                    <span className="font-bold text-white">GitHub</span>
                                </div>
                                <ExternalLink size={16} className="text-[#b3b3b3] group-hover:text-white" />
                            </a>

                            <a href="mailto:rham12222006@gmail.com" className="flex items-center justify-between p-4 rounded-lg bg-[#282828] hover:bg-[#333] border border-transparent hover:border-[#444] group transition-all">
                                <div className="flex items-center gap-3">
                                    <Mail size={20} className="text-red-500" />
                                    <span className="font-bold text-white">Email</span>
                                </div>
                                <ExternalLink size={16} className="text-[#b3b3b3] group-hover:text-white" />
                            </a>
                        </div>

                        <button
                            onClick={() => setIsFollowModalOpen(false)}
                            className="w-full mt-6 py-3 rounded-full font-bold text-sm tracking-widest text-black hover:scale-105 transition-transform"
                            style={{ backgroundColor: 'var(--accent)' }}
                        >
                            DONE
                        </button>
                    </div>
                </div>
            )}

            {/* Premium Modal */}
            {isPremiumModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsPremiumModalOpen(false)}>
                    <div className="bg-[#181818] border border-[#282828] p-8 rounded-xl shadow-2xl max-w-md w-full transform scale-100 transition-all relative overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Decorative Gradient */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Get Rham Premium</h2>
                            <p className="text-[#b3b3b3] text-lg">Why settle for basic?</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition">
                                <CheckCircle2 className="text-[var(--accent)] shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-base">Ad-free coding</h4>
                                    <p className="text-[#b3b3b3] text-sm">Clean and efficient code.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition">
                                <CheckCircle2 className="text-[var(--accent)] shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-base">Unlimited Skips</h4>
                                    <p className="text-[#b3b3b3] text-sm">Fast learner, skips the basics, straight to advanced topics.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition">
                                <CheckCircle2 className="text-[var(--accent)] shrink-0" size={24} />
                                <div>
                                    <h4 className="text-white font-bold text-base">High Quality Audio</h4>
                                    <p className="text-[#b3b3b3] text-sm">Clear communication skills.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    onNavigate?.(ViewState.CONTACT);
                                    setIsPremiumModalOpen(false);
                                }}
                                className="w-full py-3.5 rounded-full font-bold text-sm tracking-widest text-black hover:scale-105 transition-transform shadow-lg"
                                style={{ backgroundColor: 'var(--accent)' }}
                            >
                                CONTACT ME NOW
                            </button>
                            <button
                                onClick={() => {
                                    onNavigate?.(ViewState.CV);
                                    setIsPremiumModalOpen(false);
                                }}
                                className="w-full py-3.5 rounded-full font-bold text-sm tracking-widest text-white border border-[#727272] hover:border-white hover:scale-105 transition-all"
                            >
                                DOWNLOAD RESUME
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-[10px] text-[#b3b3b3] uppercase tracking-widest">Terms and conditions apply.</p>
                        </div>
                    </div>
                </div>
            )}
            {/* Album Story Modal */}
            {isAlbumModalOpen && selectedAlbum && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsAlbumModalOpen(false)}>
                    <div className="bg-[#181818] border border-[#282828] max-w-2xl w-full rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-visible" onClick={e => e.stopPropagation()}>
                        <div className="w-full md:w-1/2 h-56 md:h-auto relative shrink-0">
                            <img src={selectedAlbum.cover} alt={selectedAlbum.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent md:bg-gradient-to-r"></div>
                        </div>
                        <div className="p-6 md:p-8 flex flex-col justify-center w-full md:w-1/2">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-[var(--accent)] text-sm font-bold tracking-wider uppercase mb-1">Album Story</p>
                                    <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{selectedAlbum.title}</h2>
                                    <p className="text-[#b3b3b3] mt-1">{selectedAlbum.year}</p>
                                </div>
                                <button onClick={() => setIsAlbumModalOpen(false)} className="text-[#b3b3b3] hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="prose prose-invert">
                                <p className="text-[#e0e0e0] leading-relaxed text-lg">
                                    {selectedAlbum.story}
                                </p>
                            </div>
                            <div className="mt-8">
                                <button
                                    onClick={() => setIsAlbumModalOpen(false)}
                                    className="px-6 py-3 rounded-full font-bold text-black text-sm tracking-widest hover:scale-105 transition"
                                    style={{ backgroundColor: 'var(--accent)' }}
                                >
                                    CLOSE STORY
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Success Modal */}
            {isEmailSuccessModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsEmailSuccessModalOpen(false)}>
                    <div className="bg-[#181818] border border-[#282828] max-w-md w-full rounded-xl shadow-2xl p-8 text-center" onClick={e => e.stopPropagation()}>
                        <div className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <CheckCircle2 size={40} style={{ color: 'var(--accent)' }} />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
                        <p className="text-[#b3b3b3] mb-8 text-lg">
                            You've been successfully emailed rham.
                        </p>
                        <button
                            onClick={() => setIsEmailSuccessModalOpen(false)}
                            className="w-full py-3 rounded-full font-bold text-black text-sm tracking-widest hover:scale-105 transition"
                            style={{ backgroundColor: 'var(--accent)' }}
                        >
                            AWESOME
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainView;