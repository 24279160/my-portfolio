import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { 
  Target, 
  Layers, 
  Users, 
  CheckCircle2,
  Search,
  Package,
  ShieldCheck,
  Building2,
  LayoutTemplate,
  TrendingUp,
  Cpu,
  Phone,
  Mail,
  Zap,
  Monitor,
  ClipboardList,
  BarChart3,
  Globe2,
  ArrowRight
} from 'lucide-react';

// --- 核心組件：優雅導航滑鼠 ---
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
        className="fixed w-12 h-12 text-[#FF8C42]"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ 
          rotate: isHovering ? 90 : 0,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 0.3
        }}
      >
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-current rounded-tl-sm" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-current rounded-tr-sm" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-current rounded-bl-sm" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-current rounded-br-sm" />
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
    let particles = Array.from({ length: 60 }).map(() => ({
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

// --- 互動卡片容器 ---
const TiltCard = ({ children, className = "" }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const onMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 35;
    const rotateY = (centerX - x) / 35;
    setRotate({ x: rotateX, y: rotateY });
  };
  const onMouseLeave = () => setRotate({ x: 0, y: 0 });
  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ perspective: '1000px' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- 磁吸互動標題組件 ---
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
    <div className="flex flex-col items-start mb-6 pointer-events-auto cursor-default overflow-visible text-left">
      <motion.h1 
        ref={h1Ref}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
        className="text-5xl md:text-[5.5rem] lg:text-[6.5rem] font-black leading-none tracking-tighter text-slate-900 select-none relative transition-colors duration-300"
        style={{ 
          color: isHovered ? '#FF8C42' : '#0f172a',
          textShadow: isHovered ? '0 0 30px rgba(255, 140, 66, 0.3)' : 'none'
        }}
      >
        HI I AM <span className="italic">REN.</span>
      </motion.h1>
      <p className="text-xl md:text-2xl font-black text-slate-400 mt-1 tracking-tight pointer-events-none opacity-100 max-w-2xl leading-tight">
        在不確定中做出合理決策，並持續優化
      </p>
    </div>
  );
};

// --- 頭像組件 ---
const ProfilePhoto = ({ mouse }) => {
  const [isHovered, setIsHovered] = useState(false);
  const avatarUrl = "https://lh3.googleusercontent.com/d/1TsRwo9QiibKwW7PNCBnhPbbizfDXVaH9";

  const floatTags = [
    { text: "產品策略", top: "-4%", left: "-6%", delay: 0 },
    { text: "數位內容規劃", top: "18%", right: "-12%", delay: 0.1 },
    { text: "專案溝通/整合", bottom: "12%", left: "-18%", delay: 0.2 },
    { text: "UIUX 設計", bottom: "-6%", right: "-2%", delay: 0.15 },
    { text: "SEO/數據分析", top: "45%", left: "-22%", delay: 0.25 },
    { text: "商業化包裝 (Package)", bottom: "40%", right: "-25%", delay: 0.3 }
  ];

  return (
    <div className="z-20 pointer-events-auto relative mt-8 md:mt-0 w-full flex justify-center md:block md:w-auto">
      <div style={{ perspective: '1200px' }} className="relative">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ 
            scale: 1.05,
            rotateY: 10,
            rotateX: -8
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className="relative cursor-none z-10"
        >
          <div className="relative w-64 h-64 md:w-[19rem] md:h-[19rem] rounded-[3.5rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.12)] border-[6px] border-white bg-slate-100 transition-all duration-500">
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
                initial={{ opacity: 0, scale: 0.7, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.7, y: 10 }}
                transition={{ duration: 0.3, delay: tag.delay }}
                className="absolute whitespace-nowrap bg-slate-950/90 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest z-30 shadow-xl"
                style={{ top: tag.top, bottom: tag.bottom, left: tag.left, right: tag.right, borderLeft: `3px solid ${idx % 2 === 0 ? '#FF8C42' : '#2dd4bf'}` }}
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

// --- 主程式組件 ---
const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [contentStoreIndex, setContentStoreIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const impactModules = [
    { label: "Search Success", value: "+20%", icon: Zap, desc: "重構搜尋邏輯與 IA，提升搜尋匹配效率。" },
    { label: "Operational Growth", value: "+10-25%", icon: TrendingUp, desc: "規劃核心營運模組，提升內容發現與轉換。" },
    { label: "System Delivery", value: "$40M", icon: Cpu, desc: "主導大型政府 XR 專案落地，管理開發與驗收。" }
  ];

  const reallusionBullets = [
    { icon: <Target className="text-orange-500" size={16} />, text: "負責歐美電商平台 (ActorCore / Content Store) 產品策略與商業化規劃。" },
    { icon: <Search className="text-orange-500" size={16} />, text: "分析長尾搜尋行為，定義 Deep Search 規格，提升成功率 20%。" },
    { icon: <Globe2 className="text-orange-500" size={16} />, text: "規劃平台核心功能，提升內容可發現性與效率約 15–25%。" },
    { icon: <Package className="text-orange-500" size={16} />, text: "建立商品化策略與 Package 組合，優化產品結構與轉換流程。" },
    { icon: <BarChart3 className="text-orange-500" size={16} />, text: "設計營運模組支援行銷活動，驅動流量轉換 (CTR 提升 10–15%)。" }
  ];

  const globalPowerBullets = [
    { icon: <Monitor className="text-teal-500" size={16} />, text: "參與 XR 模擬訓練系統從 0→1 開發與落地規劃。" },
    { icon: <LayoutTemplate className="text-teal-500" size={16} />, text: "規劃多端產品架構，設計完整使用流程與互動機制。" },
    { icon: <ClipboardList className="text-teal-500" size={16} />, text: "撰寫產品規格 (Spec / Flow / IA)，確保跨部門開發一致性。" },
    { icon: <ShieldCheck className="text-teal-500" size={16} />, text: "主導 4,000 萬級警署 XR 專案執行與驗收標準制定。" }
  ];

  const projects = [
    {
      id: 'actorcore',
      title: 'ActorCore 平台搜尋與 IA 重構',
      desc: '主導 3D 素材電商平台搜尋優化。分析自然語言搜尋行為，重定義 Deep Search 邏輯，並針對歐美市場規劃高轉化率架構。',
      results: ['搜尋成功率提升 20%', '優化商城推薦內容結構'],
      img: "https://lh3.googleusercontent.com/d/18StLx2sDg3Nidzgz5RQfp9HXxoacbkt7", 
      icon: Search,
      cta: "Explore IA Logic",
      skills: ['Deep Search', 'IA Optimization', 'Data Analysis']
    },
    {
      id: 'content-store',
      title: 'Content Store 商業化包裝',
      desc: '負責歐美平台 Package Strategy。設計營運模組與 Promotion Page，結合 Theme/Bundle 模型有效提升 CTR 與商業轉換。',
      results: ['CTR 提升約 10–15%', '客製化 Page 驅動流量轉換'],
      imgs: [
        "https://lh3.googleusercontent.com/d/1XpLnEY9YGr8Gueb5puhDOukYCKD5qENk", 
        "https://lh3.googleusercontent.com/d/1gDk9yxzt3LstIf14xt9HznBAiPlZL6o6"
      ],
      icon: Package,
      cta: "View Package Strategy",
      skills: ['Package Strategy', 'Commercialization', 'CTR Growth']
    },
    {
      id: 'police-xr',
      title: '警署 XR 模擬訓練系統 (0→1)',
      desc: '統籌 4,000 萬級標案。協作「Asian action movie stunt team」錄製 Stunts，打造具備 Stunning visual experiences 的場景驗收，包含「people being blown away」細節。',
      results: ['完成 4,000 萬標案驗收', '成功導入全台教學體系'],
      img: "https://lh3.googleusercontent.com/d/1OSnyyQldtfyGbqPS_d1fYWA2qpUVfzEG", 
      icon: ShieldCheck,
      cta: "Explore System Flow",
      skills: ['Prioritization', 'Asian Stunt Team', 'Stunts Capture']
    },
    {
      id: 'bus-plus',
      title: 'Bus+ APP 介面重構與優化',
      desc: '擔任 UI Designer 參與 B2C 產品優化。獨立完成 Design System 建置與 Prototype 製作，以服務設計思維驅動迭代。',
      results: ['目標受眾滿意度突破 80%', '建立可擴充的 UI 元件化規範'],
      img: "https://lh3.googleusercontent.com/d/1GtaMd0eyQrWN2OuGyNe9RmbilG5wvv1P", 
      icon: LayoutTemplate,
      cta: "Check Design System",
      skills: ['UI/UX Design', 'Design System', 'Prototyping']
    }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative cursor-none overflow-x-hidden">
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-[#FF8C42] z-[110] origin-left" style={{ scaleX }} />
      <CustomCursor />
      <NeuralMeshBackground mouse={mousePos} />
      
      <nav className="fixed w-full bg-white/75 backdrop-blur-xl z-[100] py-3 px-8 md:px-12 flex justify-between items-center border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="text-xl font-black tracking-tighter cursor-pointer flex items-center gap-2 pointer-events-auto" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 bg-[#FF8C42] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg">RH</div>
          <span className="font-bold uppercase tracking-widest text-sm">REN <span className="text-[#0f172a]">HAO</span></span>
        </div>
        <div className="hidden md:flex space-x-8 font-black text-[9px] tracking-widest uppercase items-center text-slate-500 pointer-events-auto">
          <button onClick={() => scrollTo('experience')} className="hover:text-[#FF8C42] transition-colors">EXPERIENCE</button>
          <button onClick={() => scrollTo('projects')} className="hover:text-[#FF8C42] transition-colors">PROJECTS</button>
          <button onClick={() => scrollTo('expertise')} className="hover:text-[#FF8C42] transition-colors">EXPERTISE</button>
          <button 
            onClick={() => scrollTo('about')} 
            className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-orange-500 transition-all text-[9px] font-black tracking-[0.2em] shadow-lg"
          >
             CONTACT ME
          </button>
        </div>
      </nav>

      <section id="hero" className="relative min-h-screen pt-20 pb-16 flex flex-col justify-center px-6 md:px-12 z-10 pointer-events-none text-left">
        <div className="max-w-[1300px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="w-full md:w-[60%] flex flex-col items-start">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[1.5px] w-10 bg-[#FF8C42]"></div>
              <div className="text-[#FF8C42] font-black text-[10px] tracking-[0.45em] uppercase">Commercialization Product Manager</div>
            </div>
            <MagneticHeadline mouse={mousePos} />
            <p className="text-lg text-gray-500 max-w-xl mb-10 font-medium leading-relaxed pointer-events-auto">
              專注於軟體產品商業化營運與體驗優化。我擅長將使用者洞察轉化為商業價值與 **stunning visual experiences** 的系統落地。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full pointer-events-auto mb-8 text-left">
              {impactModules.map((impact, i) => (
                <div key={i} className="flex flex-col h-full bg-slate-50/50 backdrop-blur-sm border border-slate-100 p-6 rounded-[2.5rem] hover:border-[#FF8C42]/40 transition-all group shadow-sm">
                  <div className="text-slate-300 mb-4 group-hover:text-[#FF8C42] transition-colors">
                    <impact.icon size={22} />
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">{impact.value}</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">{impact.label}</div>
                  <div className="text-xs text-slate-500 font-medium leading-relaxed mt-auto">{impact.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-[40%] flex justify-center md:justify-end">
            <ProfilePhoto mouse={mousePos} />
          </div>
        </div>
      </section>

      <section id="experience" className="py-20 px-6 md:px-12 relative z-10 bg-slate-50/50 text-left">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Career Path</h2>
            <div className="h-[2px] flex-grow bg-slate-200"></div>
          </div>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[11px] before:w-[2px] before:bg-gradient-to-b before:from-[#FF8C42] before:via-[#2dd4bf] before:to-transparent">
            
            <motion.div whileHover={{ x: 10 }} className="relative pl-16 group pointer-events-auto cursor-pointer">
              <div className="absolute left-0 top-3 w-5 h-5 rounded-full bg-white border-4 border-[#FF8C42] shadow-md group-hover:scale-125 transition-all" />
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:border-[#FF8C42]/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-slate-500 font-bold"><Building2 size={14} /><span className="text-[10px] tracking-widest uppercase">Global E-commerce & SaaS</span></div>
                    <h3 className="text-2xl font-black text-slate-900">甲尚科技 <span className="text-[#FF8C42] text-lg font-bold italic ml-2">Reallusion</span></h3>
                  </div>
                  <span className="text-[10px] font-black text-[#FF8C42] bg-orange-50 px-4 py-2 rounded-full border border-orange-100">2024.10 - Present</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-6 font-black uppercase tracking-wide">商品化經理 <span className="text-[10px] text-slate-400 font-medium border-l border-slate-300 pl-3 tracking-widest uppercase">Commercialization Product Manager</span></h4>
                <div className="grid grid-cols-1 gap-4">
                  {reallusionBullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="shrink-0 mt-1">{bullet.icon}</div>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{bullet.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ x: 10 }} className="relative pl-16 group pointer-events-auto cursor-pointer">
              <div className="absolute left-0 top-3 w-5 h-5 rounded-full bg-white border-4 border-[#2dd4bf] shadow-md group-hover:scale-125 transition-all" />
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:border-[#2dd4bf]/40 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 text-slate-400 font-bold"><Building2 size={14} /><span className="text-[10px] tracking-widest uppercase">B2B / B2G Integration</span></div>
                    <h3 className="text-2xl font-black text-slate-900">全球動力科技 <span className="text-[#2dd4bf] text-lg font-bold italic ml-2">Global Power</span></h3>
                  </div>
                  <span className="text-[10px] font-black text-[#2dd4bf] bg-teal-50 px-4 py-2 rounded-full border border-teal-100">2023.05 - 2024.10</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-6 font-black uppercase tracking-wide">產品設計師 <span className="text-[10px] text-slate-400 font-medium border-l border-slate-300 pl-3 ml-3 tracking-widest uppercase">Product Designer & Project Exec.</span></h4>
                <div className="grid grid-cols-1 gap-4">
                  {globalPowerBullets.map((bullet, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="shrink-0 mt-1">{bullet.icon}</div>
                      <p className="text-slate-600 text-sm leading-relaxed font-medium">{bullet.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="projects" className="py-20 px-6 md:px-12 relative z-10 text-left">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Major Missions</h2>
            <div className="h-[2px] flex-grow bg-slate-100"></div>
          </div>
          
          <div className="space-y-16 pointer-events-auto">
            {projects.map((project, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                className="bg-white p-8 md:p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group flex flex-col md:flex-row gap-10 items-start relative overflow-hidden text-left"
              >
                <TiltCard className="w-full md:w-[50%] aspect-[16/10] rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-200 relative group/img bg-slate-50 shrink-0">
                  {project.id === 'content-store' ? (
                    <div className="w-full h-full relative">
                      <AnimatePresence mode='wait'>
                        <motion.img
                          key={contentStoreIndex}
                          src={project.imgs[contentStoreIndex]}
                          initial={{ opacity: 0, scale: 1.05 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.6 }}
                          className="w-full h-full object-cover"
                        />
                      </AnimatePresence>
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                        <button 
                          onClick={() => setContentStoreIndex(0)}
                          className={`px-5 py-2 rounded-full text-[9px] font-black tracking-widest transition-all ${contentStoreIndex === 0 ? 'bg-[#FF8C42] text-white shadow-lg' : 'bg-white/90 text-slate-500 backdrop-blur hover:bg-white'}`}
                        >
                          ACTOR
                        </button>
                        <button 
                          onClick={() => setContentStoreIndex(1)}
                          className={`px-5 py-2 rounded-full text-[9px] font-black tracking-widest transition-all ${contentStoreIndex === 1 ? 'bg-[#FF8C42] text-white shadow-lg' : 'bg-white/90 text-slate-500 backdrop-blur hover:bg-white'}`}
                        >
                          MOTION
                        </button>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={project.img} 
                      alt={project.title} 
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-1000 ease-out" 
                    />
                  )}
                </TiltCard>
                
                <div className="flex-grow flex flex-col h-full py-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-[1.5px] bg-slate-200"></div>
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{project.id}</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-5 leading-tight group-hover:text-orange-500 transition-colors">{project.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium">{project.desc}</p>
                  
                  <div className="space-y-3 mb-8">
                    {project.results.map((r, i) => (
                      <div key={i} className="flex gap-3 text-slate-700 items-start">
                        <CheckCircle2 size={16} className="text-[#FF8C42] shrink-0 mt-0.5" />
                        <span className="text-[13px] font-bold leading-relaxed">{r}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* 按鈕與標籤平放優化 */}
                  <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <button className="flex items-center justify-center gap-2 bg-slate-950 text-white px-7 py-3.5 rounded-full font-black text-[10px] tracking-widest hover:bg-orange-500 transition-all shadow-xl group/btn shrink-0">
                      {project.cta} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex gap-2 flex-wrap">
                      {project.skills.map(s => (
                        <span key={s} className="text-[9px] font-black px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-slate-400 uppercase tracking-widest whitespace-nowrap">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="expertise" className="py-24 px-6 md:px-24 bg-white relative z-10 border-t border-slate-50 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-20">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Strategic Arsenal</h2>
            <div className="h-[2px] flex-grow bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-auto">
            {[
              { title: '商品化營運', icon: <Target size={30} />, desc: '精通 Commercialization 策略，有效規劃 Package 驅動轉換成長。' },
              { title: '產品優先級', icon: <Users size={30} />, desc: '具備強大 Prioritization 決策力，平衡技術限制與商業目標。' },
              { title: '體驗架構設計', icon: <Layers size={30} />, desc: '重構 Taxonomy 與 Theme/Tag 架構，提升內容發現效率。' },
              { title: '數據分析優化', icon: <BarChart3 size={30} />, desc: '分析用戶行為，持續優化產品體驗與商業成效。' }
            ].map((item, i) => (
              <div key={i} className="p-10 border border-slate-100 rounded-[3rem] bg-slate-50/50 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden transform hover:-translate-y-2 h-full shadow-sm">
                <div className="mb-6 text-slate-300 group-hover:text-accent group-hover:scale-110 transition-all w-fit relative z-10">
                  {item.icon}
                </div>
                <h4 className="text-xl font-black mb-4 text-slate-800 tracking-tight">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                <div className="absolute bottom-0 left-0 w-0 h-2 bg-[#FF8C42] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer id="about" className="py-32 px-6 bg-white text-center border-t border-slate-100 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-20 h-20 bg-slate-950 rounded-[1.8rem] mx-auto mb-12 flex items-center justify-center text-white font-black text-2xl shadow-2xl pointer-events-auto cursor-pointer"
          >
            RH
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-16 leading-tight tracking-tighter">
            期待能與願景團隊攜手打造<br />
            具備商業價值與 <span className="text-[#FF8C42] italic">stunning</span> 體驗的產品。
          </h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-10 md:gap-20 font-black pointer-events-auto">
            <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex flex-col items-center group cursor-pointer text-center">
              <span className="text-slate-300 uppercase tracking-widest text-[10px] mb-3">Call Me</span>
              <a href="tel:886-903832322" className="text-2xl text-slate-900 group-hover:text-[#FF8C42] transition-colors flex items-center gap-3">
                <div className="p-2.5 bg-orange-50 rounded-2xl"><Phone size={22} className="text-[#FF8C42]" /></div>
                0903-832-322
              </a>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.05, y: -5 }} className="flex flex-col items-center group cursor-pointer text-center">
              <span className="text-slate-300 uppercase tracking-widest text-[10px] mb-3">Email Me</span>
              <a href="mailto:a199b5c20@gmail.com" className="text-2xl text-slate-900 group-hover:text-[#2dd4bf] transition-colors flex items-center gap-3">
                <div className="p-2.5 bg-teal-50 rounded-2xl"><Mail size={22} className="text-[#2dd4bf]" /></div>
                a199b5c20@gmail.com
              </a>
            </motion.div>
          </div>
          
          <div className="mt-32 text-[10px] font-black text-slate-300 tracking-[0.9em] uppercase flex flex-col items-center gap-4">
            <div className="w-12 h-[1.5px] bg-slate-100"></div>
            © 2026 JEN-HAO ZHENG · PM PORTFOLIO V19.1 REFINED
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;