import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ChevronRight, 
  Target, 
  Layers, 
  Users, 
  CheckCircle2,
  Search,
  Package,
  ShieldCheck,
  Building2,
  Layout,
  TrendingUp,
  Cpu,
  Globe,
  Phone,
  Mail,
  Play,
  X,
  User,
  ExternalLink,
  Figma,
  Navigation,
  Zap
} from 'lucide-react';

// --- 核心組件：優雅對焦導航滑鼠 ---
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 28, stiffness: 220, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('.pointer-events-auto')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      <motion.div
        className="fixed w-1.5 h-1.5 bg-[#FF8C42] rounded-full"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="fixed w-10 h-10 text-[#FF8C42]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ 
          rotate: isHovering ? 45 : 0,
          scale: isHovering ? 1.4 : 1,
          opacity: isHovering ? 0.7 : 0.25
        }}
      >
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-current rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-current rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current rounded-br-sm" />
      </motion.div>
    </div>
  );
};

// --- 背景組件：靜謐脈動背景 ---
const NeuralMeshBackground = ({ mouse }) => {
  const canvasRef = useRef(null);
  const anchors = useMemo(() => [
    { x: 0.15, y: 0.2 }, { x: 0.85, y: 0.25 },
    { x: 0.5, y: 0.5 }, { x: 0.2, y: 0.8 }, { x: 0.8, y: 0.75 }
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0, vy: 0,
      size: Math.random() * 1.5 + 0.8,
      targetIdx: Math.floor(Math.random() * anchors.length)
    }));
    let animationId;
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        const anchor = anchors[p.targetIdx];
        const ax = anchor.x * canvas.width;
        const ay = anchor.y * canvas.height;
        p.vx += (ax - p.x) * 0.00008;
        p.vy += (ay - p.y) * 0.00008;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 300) {
          const force = (300 - dist) / 300;
          p.vx += dx * 0.00015 * force;
          p.vy += dy * 0.00015 * force;
          particles.slice(i + 1, i + 12).forEach(p2 => {
            const d2 = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
            if (d2 < 110) {
              ctx.strokeStyle = `rgba(255, 140, 66, ${0.1 * (1 - d2/110) * (1 - dist/300)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          });
        }
        p.vx *= 0.96; p.vy *= 0.96;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = dist < 250 ? 'rgba(255, 140, 66, 0.25)' : 'rgba(255, 140, 66, 0.12)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    handleResize(); animate();
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationId); };
  }, [mouse, anchors]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-50" />;
};

// --- 磁吸流光標題組件 ---
const MagneticHeadline = ({ mouse }) => {
  const h1Ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isHovered && h1Ref.current) {
      const rect = h1Ref.current.getBoundingClientRect();
      const h1CenterX = rect.left + rect.width / 2;
      const h1CenterY = rect.top + rect.height / 2;
      const dx = mouse.x - h1CenterX;
      const dy = mouse.y - h1CenterY;
      setOffset({
        x: Math.max(-12, Math.min(12, dx * 0.08)),
        y: Math.max(-8, Math.min(8, dy * 0.08))
      });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, [mouse, isHovered]);

  return (
    <div className="flex flex-col items-start mb-8 pointer-events-auto cursor-default overflow-visible">
      <motion.h1 
        ref={h1Ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
        className="text-5xl md:text-[6.5rem] lg:text-[7.5rem] font-black leading-none tracking-tighter text-slate-900 select-none relative transition-colors duration-300"
        style={{ 
          color: isHovered ? '#FF8C42' : '#0f172a',
          textShadow: isHovered ? '0 0 40px rgba(255, 140, 66, 0.35)' : 'none'
        }}
      >
        HI I AM <span className="italic">REN.</span>
      </motion.h1>
      <p className="text-xl md:text-2xl font-black text-slate-400 mt-2 uppercase tracking-widest pointer-events-none opacity-100">
        Bridging Design Thinking with Commercial Growth
      </p>
    </div>
  );
};

// --- 頭像組件：連結妳的真人照片 ---
const ProfilePhoto = ({ mouse }) => {
  const [center, setCenter] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const photoRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if(photoRef.current) {
        const rect = photoRef.current.getBoundingClientRect();
        setCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }
    };
    window.addEventListener('resize', handleResize);
    setTimeout(handleResize, 100); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dx = mouse.x - center.x;
  const dy = mouse.y - center.y;
  const distance = Math.sqrt(dx*dx + dy*dy);
  const isNear = distance < 300; 
  const pullX = isNear ? Math.max(-8, Math.min(8, dx * 0.03)) : 0;
  const pullY = isNear ? Math.max(-8, Math.min(8, dy * 0.03)) : 0;

  const avatarUrl = "https://lh3.googleusercontent.com/d/1TsRwo9QiibKwW7PNCBnhPbbizfDXVaH9";

  const floatTags = [
    { text: "產品策略", top: "-4%", left: "-6%", delay: 0 },
    { text: "數位內容規劃", top: "18%", right: "-12%", delay: 0.1 },
    { text: "專案溝通/整合管理", bottom: "12%", left: "-18%", delay: 0.2 },
    { text: "UIUX", bottom: "-6%", right: "-2%", delay: 0.15 }
  ];

  return (
    <div className="z-20 pointer-events-auto relative mt-8 md:mt-0">
      <div style={{ perspective: '1000px' }} ref={photoRef} className="relative">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={{ x: pullX, y: pullY, scale: isHovered ? 1.05 : 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="relative cursor-none"
        >
          <div className={`relative w-64 h-64 md:w-[22rem] md:h-[22rem] rounded-[3.5rem] overflow-hidden shadow-2xl border-[6px] border-white bg-slate-100 transition-all duration-500 ${isHovered ? 'shadow-[#FF8C42]/30' : ''}`}>
            <img 
              src={avatarUrl} 
              alt="Jen-Hao Cheng Profile" 
              className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : ''}`}
            />
          </div>

          <AnimatePresence>
            {isHovered && floatTags.map((tag, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: tag.delay }}
                className="absolute whitespace-nowrap bg-slate-900/85 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-[11px] font-bold tracking-widest z-30 shadow-lg"
                style={{ top: tag.top, bottom: tag.bottom, left: tag.left, right: tag.right, borderLeft: `2.5px solid ${idx % 2 === 0 ? '#FF8C42' : '#2dd4bf'}` }}
              >
                {tag.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const impactModules = [
    { label: "Search Success", value: "+20%", icon: Zap, desc: "規劃自然語言搜尋（Deep Search）介面與功能，提升搜尋匹配度。" },
    { label: "Conversion Rate", value: "+10-15%", icon: TrendingUp, desc: "與高層規劃商品化策略 Landing Page，有效帶動銷售轉換。" },
    { label: "XR System", value: "$40M", icon: Cpu, desc: "主導 0→1 大型政府 XR 訓練專案落地，管理跨部門開發規格。" }
  ];

  const projects = [
    {
      id: 'actorcore',
      title: 'ActorCore 平台搜尋重構與營運',
      desc: '主導素材電商平台搜尋體驗優化。透過使用者行為分析，規劃自然語言搜尋（Deep Search）功能，並針對歐美市場創作者需求，規劃高轉化率之 **Package** 商品化頁面。',
      results: ['搜尋成功率提升 20%，解決使用者搜尋摩擦', '優化商城推薦內容結構（Theme / Tag）'],
      icon: Search, 
      skills: ['Keyword Analysis', 'Commercialization', 'IA Optimization'],
      ctas: [{ label: 'WATCH DEMO', url: 'https://youtu.be/AM50tAZAT8s', icon: <Play size={14} fill="currentColor" /> }]
    },
    {
      id: 'police-xr',
      title: '警署 XR 模擬訓練系統 (0→1)',
      desc: '統籌 4,000 萬級政府專案。與 **Asian action movie stunt team** 合作錄製高標準 **Stunts**，精確捕捉細節（如：people being blown away），打造具備 **Stunning visual experiences** 的系統場景。',
      results: ['完成 4,000 萬標案驗收，成功導入全台教學體系', '成功將研究洞察轉化為優先級決策'],
      icon: ShieldCheck, 
      skills: ['Prioritization', 'Cross-Dept Synergy', 'XR Implementation'],
      ctas: [{ label: 'WATCH DEMO', url: 'https://youtu.be/VFtLeFSkq-Y', icon: <Play size={14} fill="currentColor" /> }]
    },
    {
      id: 'bus-plus',
      title: 'Bus+ APP 介面重構與優化',
      desc: '擔任 UI Designer 參與 B2C 產品優化專案。獨立完成全台知名公車動態 APP 之 Design System 建置與 Prototype 製作，以服務設計思維驅動產品迭代。',
      results: ['目標受眾滿意度突破 80%', '建立可擴充的 UI 元件化規範'],
      icon: Layout, 
      skills: ['UI/UX Design', 'Design System', 'Prototyping'],
      ctas: [
        { label: 'FIGMA MOCKUP', url: 'https://www.figma.com/design/Zqj906uj1rMQpcvOwg24LE/BUS%2B_3%2F31--UI?node-id=138-1498', icon: <Figma size={14} /> },
        { label: 'PROTOTYPE', url: 'https://www.figma.com/proto/Zqj906uj1rMQpcvOwg24LE/BUS--UI?page-id=138%3A1498&node-id=710-73139', icon: <Navigation size={14} /> }
      ]
    }
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative cursor-none overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#FF8C42] z-[110] origin-left" style={{ scaleX }} />
      
      <CustomCursor />
      <NeuralMeshBackground mouse={mousePos} />
      
      <nav className="fixed w-full bg-white/75 backdrop-blur-xl z-[100] py-4 px-8 md:px-12 flex justify-between items-center border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="text-xl font-black tracking-tighter cursor-pointer flex items-center gap-2 pointer-events-auto" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 bg-[#FF8C42] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg shadow-orange-500/20">RH</div>
          <span className="font-bold">REN <span className="text-[#0f172a]">HAO</span></span>
        </div>
        <div className="hidden md:flex space-x-10 font-black text-[10px] tracking-widest uppercase items-center text-slate-500 pointer-events-auto">
          <button onClick={() => scrollTo('experience')} className="hover:text-[#FF8C42] transition-colors">EXPERIENCE</button>
          <button onClick={() => scrollTo('projects')} className="hover:text-[#FF8C42] transition-colors">PROJECTS</button>
          <button onClick={() => scrollTo('expertise')} className="hover:text-[#FF8C42] transition-colors">EXPERTISE</button>
        </div>
      </nav>

      <section id="hero" className="relative min-h-screen pt-32 pb-20 flex flex-col justify-center px-6 md:px-12 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="w-full md:w-[60%] text-left flex flex-col items-start">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8 bg-[#FF8C42]"></div>
              <div className="text-[#FF8C42] font-black text-[10px] tracking-[0.4em] uppercase">Commercialization Product Manager</div>
            </div>
            
            <MagneticHeadline mouse={mousePos} />

            <p className="text-lg text-gray-500 max-w-2xl mb-12 font-medium leading-relaxed pointer-events-auto">
              專注於軟體產品商業化營運與數據驅動體驗優化。我擅長在不確定中建立邏輯架構，並透過跨領域協作與歐美平台營運經驗，將使用者洞察轉化為具備商業價值與 **Stunning visual experiences** 的系統落地。
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pointer-events-auto mb-10">
              {impactModules.map((impact, i) => (
                <div key={i} className="flex flex-col h-full bg-slate-50/50 backdrop-blur-sm border border-slate-100 p-7 rounded-[2.5rem] hover:border-[#FF8C42]/30 transition-all group cursor-default min-h-[180px]">
                  <div className="text-slate-300 mb-4 group-hover:text-[#FF8C42] transition-colors">
                    <impact.icon size={22} />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{impact.value}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{impact.label}</div>
                  <div className="text-sm md:text-base text-slate-500 font-medium leading-relaxed mt-auto">{impact.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6 pointer-events-auto">
              <button onClick={() => scrollTo('projects')} className="group bg-[#1e293b] text-white font-black py-4 px-10 rounded-full hover:bg-[#FF8C42] transition-all flex items-center gap-2 text-sm shadow-2xl shadow-orange-500/10">
                VIEW MISSIONS <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-[40%] flex justify-center md:justify-end">
            <ProfilePhoto mouse={mousePos} />
          </div>
        </div>
      </section>

      <section id="experience" className="py-24 px-6 md:px-24 relative z-10 bg-slate-50/50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Career Path</h2>
            <div className="h-[2px] flex-grow bg-slate-200"></div>
          </div>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[11px] before:w-[2px] before:bg-gradient-to-b before:from-[#FF8C42] before:via-[#2dd4bf] before:to-transparent">
            <motion.div whileHover={{ x: 10 }} className="relative pl-16 group pointer-events-auto cursor-pointer">
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white border-4 border-[#FF8C42] shadow-md transition-all" />
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-[#FF8C42]/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-slate-500 font-bold"><Building2 size={14} /><span className="text-xs tracking-widest uppercase">Global E-commerce & SaaS</span></div>
                    <h3 className="text-2xl font-black text-slate-900">甲尚科技 <span className="text-[#FF8C42] text-lg font-bold italic">Reallusion</span></h3>
                  </div>
                  <span className="text-xs font-black text-[#FF8C42] bg-orange-50 px-4 py-2 rounded-full border border-orange-100">2024.10 - Present</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 font-black">商品化經理 <span className="text-xs text-slate-400 font-medium border-l border-slate-300 pl-2 ml-2">Commercialization Product Manager</span></h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">主導數位內容商店 (Content Store) 與 ActorCore 平台搜尋體驗優化。負責與高層及歐美創作者協作商品化策略 Landing Page，透過深度分析使用者搜尋行為，提升內容匹配效率。</p>
              </div>
            </motion.div>
            <motion.div whileHover={{ x: 10 }} className="relative pl-16 group pointer-events-auto cursor-pointer">
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white border-4 border-[#2dd4bf] shadow-md transition-all" />
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:border-[#2dd4bf]/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-slate-400 font-bold"><Building2 size={14} /><span className="text-xs tracking-widest uppercase">B2B / B2G Integration</span></div>
                    <h3 className="text-2xl font-black text-slate-900">環球動力 <span className="text-[#2dd4bf] text-lg font-bold italic">Global Power</span></h3>
                  </div>
                  <span className="text-xs font-black text-[#2dd4bf] bg-teal-50 px-4 py-2 rounded-full border border-teal-100">2023.05 - 2024.10</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 font-black">產品設計師 <span className="text-xs text-slate-400 font-medium border-l border-slate-300 pl-2 ml-2">Product Designer & Project Exec.</span></h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">統籌 0-1 XR 模擬訓練系統建置。在時程與技術限制下精準做出 **Prioritization** 決策，並與 **Asian action movie stunt team** 協作完成高標準內容專案驗收。</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-24 px-6 md:px-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Major Missions</h2>
            <div className="h-[2px] flex-grow bg-slate-100"></div>
          </div>
          <div className="space-y-32">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-16 pointer-events-auto bg-slate-50/30 p-8 rounded-[4rem] border border-slate-100`}
              >
                <div className="w-full md:w-1/2 aspect-video bg-white rounded-[3rem] shadow-lg overflow-hidden border border-slate-200 relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  <div className="w-full h-full flex flex-col items-center justify-center p-12 transition-transform group-hover:scale-105">
                    <project.icon size={56} className="text-[#FF8C42] opacity-40 mb-4" />
                    <div className="text-center">
                      <p className="text-2xl font-black text-slate-800 uppercase tracking-[0.2em]">{project.id}</p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 text-left">
                  <h3 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{project.title}</h3>
                  <p className="text-slate-500 text-base mb-8 leading-relaxed font-medium">{project.desc}</p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-8">
                    {project.results.map((r, i) => (
                      <div key={i} className="flex gap-3 text-slate-700 items-start bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <CheckCircle2 size={18} className="text-[#FF8C42] shrink-0 mt-0.5" />
                        <span className="text-sm font-bold">{r}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2 flex-wrap">
                      {project.skills.map(s => <span key={s} className="text-[10px] font-black px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-400 uppercase tracking-widest">{s}</span>)}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      {project.ctas.map((cta, i) => (
                        <a 
                          key={i}
                          href={cta.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-[#FF8C42] text-white font-black py-3 px-8 rounded-full flex items-center gap-2 text-[10px] shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
                        >
                          {cta.icon} {cta.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="py-32 px-6 md:px-24 bg-white relative z-10 border-t border-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Strategic Arsenal</h2>
            <div className="h-[2px] flex-grow bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-auto">
            {[
              { title: '商品化營運', icon: <Target size={32} />, desc: '精通 Commercialization 策略，能有效規劃 Package 驅動營收成長。' },
              { title: '產品優先級', icon: <Users size={32} />, desc: '在 4,000 萬級專案中，展現強大 Prioritization 決策力，平衡技術限制與目標。' },
              { title: '體驗架構設計', icon: <Layers size={32} />, desc: '具備重構 Taxonomy 與 Theme/Tag 架構能力，提升內容可發現性。' },
              { title: '服務設計思維', icon: <Cpu size={32} />, desc: '運用 User-Centered 方法論，將用戶痛點轉化為 Stunning 的解決方案。' }
            ].map((item, i) => (
              <div key={i} className="p-10 border border-slate-100 rounded-[3rem] bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2 h-full min-h-[220px]">
                <div className="mb-6 text-slate-300 group-hover:text-[#FF8C42] transition-all duration-500">{item.icon}</div>
                <h4 className="text-xl font-black mb-4 text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                <div className="absolute bottom-0 left-0 w-0 h-2 bg-[#FF8C42] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="about" className="py-32 px-6 bg-white text-center border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl mx-auto mb-10 flex items-center justify-center text-white font-black text-xl shadow-2xl transition-transform hover:scale-110 pointer-events-auto cursor-pointer">
            RH
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 leading-tight tracking-tighter pointer-events-none opacity-100">
            期待能與願景團隊攜手打造<br />
            具備商業價值與 <span className="text-[#FF8C42]">Stunning</span> 體驗的產品。
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 font-black pointer-events-auto">
            <div className="flex flex-col items-center">
              <span className="text-slate-300 uppercase tracking-widest text-[10px] mb-2">Call Me</span>
              <a href="tel:886-903832322" className="text-xl text-slate-800 hover:text-[#FF8C42] transition-colors flex items-center gap-2">
                <Phone size={18} className="text-[#FF8C42]" /> 0903-832-322
              </a>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-300 uppercase tracking-widest text-[10px] mb-2">Email Me</span>
              <a href="mailto:a199b5c20@gmail.com" className="text-xl text-slate-800 hover:text-[#FF8C42] transition-colors flex items-center gap-2">
                <Mail size={18} className="text-[#FF8C42]" /> a199b5c20@gmail.com
              </a>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-slate-300 uppercase tracking-widest text-[10px] mb-2">Location</span>
              <span className="text-xl text-slate-800 font-black flex items-center gap-2"><Globe size={18} className="text-[#FF8C42]" />Xizhi District</span>
            </div>
          </div>
          <div className="mt-24 text-[10px] font-black text-slate-300 tracking-[0.8em] uppercase">© 2026 JEN-HAO ZHENG · PM PORTFOLIO V15.7 FINAL</div>
        </div>
      </footer>
    </div>
  );
};

export default App;