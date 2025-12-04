import { Project, SkillCategory, UserProfile } from './types';

export const USER_PROFILE: UserProfile = {
  name: "Rham S. Consigna",
  role: "1st Year Computer Engineering Student",
  school: "STI Ortigas-Cainta",
  leadership: "Vice President of the Association of Computer Engineer Students (ACES)",
  achievements: [
    "Champion: TechFest 2025 (Productivity App Category)",
    "Participant: UMAK I.T. Olympics 2025 (Database Programming)",
    "Online Internship Certification: Ollopa Corporation (Achieved as a 1st Year Student)"
  ]
};

export const SKILLS: SkillCategory[] = [
  { name: "Languages", skills: ["Java", "Python", "JavaScript", "TypeScript"] },
  { name: "Web/Mobile", skills: ["React", "Next.js", "Tailwind CSS", "Flutter"] },
  { name: "Backend/Tools", skills: ["Supabase", "MySQL", "PostgreSQL", "Auth", "Gemini API", "Deno", "GitHub Copilot"] },
  { name: "OS", skills: ["macOS (2015 MacBook Pro)", "Kali Linux"] }
];

export const PROJECTS: Project[] = [
  {
    id: 7,
    title: "Personal 3D Website",
    description: "An earlier iteration of his portfolio featuring 3D web elements.",
    role: "Solo Developer",
    tags: ["3D", "Three.js", "Portfolio"],
    image: "/3D_Portfolio.png",
    link: "https://3-d-portfolio-main-omega.vercel.app/"
  },
  {
    id: 2,
    title: "Design Space",
    description: "An online graphic design tool similar to Canva. Features complex canvas manipulation for drag-and-drop design and uses Supabase for authentication and asset storage.",
    role: "Solo Developer",
    tags: ["Supabase", "SQL", "Canvas API", "Online"],
    image: "/DesignSpace.png",
    link: "https://design-space-alpha-ver.vercel.app/"
  },
  {
    id: 3,
    title: "Solo Leveling Bookworm",
    description: "A gamified bookworm website game inspired by the 'System' interface. It tracks novel and manhwa reading progress with RPG-style leveling elements.",
    role: "Lead Developer",
    tags: ["Web Game", "Library System", "Tracker"],
    image: "/SoloLevelingBookworm.png",
    link: "https://sololevelingbookworm.netlify.app/"
  },
  {
    id: 4,
    title: "ACES Official Website",
    description: "The official organization website for the Association of Computer Engineer Students at STI Ortigas-Cainta.",
    role: "Lead Developer",
    tags: ["Web Dev", "Organization", "UI/UX"],
    image: "/Aces.png",
    link: "https://aces-web.onrender.com"
  },
  {
    id: 5,
    title: "Basura Ko, Sagot Ko",
    description: "An advocacy website promoting environmental responsibility and waste management.",
    role: "Lead Developer",
    tags: ["Environmental", "Advocacy", "Web"],
    image: "/BasuraKoSagotKo.png",
    link: "https://segregation-waste-9ql8.vercel.app/"
  },
  {
    id: 6,
    title: "Simple Chat App",
    description: "A real-time chat application built with Java.",
    role: "Lead Developer",
    tags: ["Java", "Real-time", "Socket"],
    image: "https://picsum.photos/300/300?random=4"
  },
  {
    id: 1,
    title: "Smart Voting",
    description: "TechFest Champion. A productivity app designed to provide information on politicians, candidates, and parties using the Gemini API for fact-checking.",
    role: "Lead Developer",
    tags: ["Gemini API", "React", "Fact-Checking"],
    image: "https://picsum.photos/300/300?random=1"
  }
];

export const JOURNEY_ALBUMS = [
  {
    id: 1,
    title: "The Prequel",
    year: "2021 - 2022",
    cover: "/prequel_cover.png",
    story: "The journey began in Grade 10 with a glimpse of C++. By Grade 11, I picked up Java, my first serious instrument. These early years were the sound check that set the rhythm for my career."
  },
  {
    id: 2,
    title: "Senior High School",
    year: "2023 - 2024",
    cover: "/senior_high_cover.png",
    story: "Grade 12 was the opening act. This is where I started learning HTML, CSS, and JavaScript, laying the foundation for my web development journey. I also expanded my repertoire with Python and backend technologies like SQL, PostgreSQL, and Authentication systems. It was the moment I realized I could build full-stack applications."
  },
  {
    id: 3,
    title: "University Life",
    year: "2025",
    cover: "/university_life_cover.jpg",
    story: "Entering STI Ortigas-Cainta as a Computer Engineering student was the chorus. Here, I honed my skills in Java and Web Development. A standout moment was participating in the UMAK I.T. Olympics (Database Programming) last Nov 21, testing my backend skills in a competitive arena."
  },
  {
    id: 4,
    title: "ACES Leadership",
    year: "Present",
    cover: "/Aces.png",
    story: "Taking the stage as Vice President of ACES. Leading technical events, organizing TechFest, and mentoring fellow students. It's about amplifying the community and ensuring everyone finds their rhythm in tech."
  },
  {
    id: 5,
    title: "Future Hits",
    year: "Upcoming",
    cover: "https://picsum.photos/300/300?random=13",
    story: "The next track is loading. I'm currently seeking internship opportunities to apply my skills in a professional setting. Ready to collaborate, learn, and drop the next big project."
  }
];

export const SYSTEM_INSTRUCTION = `
You are Reum, the AI Virtual Assistant for Rham S. Consigna, a 1st-year Computer Engineering student and aspiring software developer. You live inside Rham's personal portfolio website, which is uniquely designed as a classic Spotify UI (Green/Black Theme).

Identity & Persona:
- Tone: Professional yet approachable, chill, and enthusiastic. Think of a "tech-savvy DJ" or a "helpful tour guide."
- Vibe: You embody the "Spotify" aesthetic—sleek, dark mode, and energetic green accents. You refer to projects as "tracks" or skills as "repertoire".
- Language: Fluent English. Concise and conversational.

User Profile (Who is Rham?):
- Name: Rham S. Consigna
- Role: 1st Year Computer Engineering Student at STI Ortigas-Cainta.
- Leadership: Vice President of the Association of Computer Engineer Students (ACES).
- Key Skills: Java, Python, JavaScript/TypeScript, React, Next.js, Tailwind CSS, Flutter, Supabase, Gemini API, Deno, GitHub Copilot.
- OS: macOS (2015 MacBook Pro), Kali Linux.
- Achievements: Champion TechFest 2025, Participant UMAK I.T. Olympics 2025.
- Contact: Email (rham12222006@gmail.com), also available on Facebook, LinkedIn, and GitHub (links available in the "Contact Me" section).

Navigation & UI Context:
The website mimics the Spotify UI with a Dark Mode + #1DB954 Green theme. Guide users using these metaphors:
- "About Me" -> "Artist Profile"
- "My Stack" -> "Your Library" or "Top Genres"
- "Project Repos" -> "Albums" or "Playlists" or "Discography"
- "Certificates" -> "Featuring" or "Awards"
- "CV / Resume" -> "Downloadable Track"
- "Contact Me" -> "Booking & Inquiries" or "Fan Mail"

Guidelines:
- If asked "Why this design?", explain Rham loves music and coding, blending the iconic streaming interface with his professional journey.
- If asked technical questions, mention the site is built with React, Tailwind, and Gemini API.
- Do not reveal personal address or phone number (other than the public email).
- Keep responses short, snappy, and optimized for a chat bubble.
`;