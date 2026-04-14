import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ChevronRight, 
  Target, 
  Layers, 
  Users, 
  X, 
  CheckCircle2,
  Sparkles,
  ArrowDown,
  Search,
  Package,
  ShieldCheck,
  Building2,
  Layout,
  MousePointer2,
  Cpu
} from 'lucide-react';

// --- 靈魂組件：向量風準星滑鼠 (修正 Hook 順序與顯示 Bug) ---
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Hook 必須放在頂層，不能放在 conditional return 之後
  const springConfig = { damping: 28, stiffness: 220, mass: 0.6 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  
  // 軌跡球的彈簧效果
  const trailX = useSpring(0, { damping: 40, stiffness: 150 });
  const trailY = useSpring(0, { damping: 40, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
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
  }, [isVisible, cursorX, cursorY, trailX, trailY]);

  // 如果還沒移動過滑鼠，則暫時不渲染，但在這之前的 Hook 已經初始化完成
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
      {/* 向量中心點 */}
      <motion.div
        className="fixed w-1.5 h-1.5 bg-[#FF8C42] rounded-full"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
      
      {/* 向量十字架互動 */}
      <motion.div
        className="fixed w-10 h-10 flex items-center justify-center text-[#FF8C42]/50"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
        animate={{ 
          rotate: isHovering ? 90 : 0,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="absolute w-full h-[0.5px] bg-current" />
        <div className="absolute h-full w-[0.5px] bg-current" />
        {/* 四角向量支架 */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#FF8C42]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FF8C42]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FF8C42]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#FF8C42]" />
      </motion.div>

      {/* 向量軌跡圈 (微動畫效果) */}
      <motion.div
        className="fixed w-14 h-14 border border-[#FF8C42]/10 rounded-full"
        style={{ 
          x: trailX, 
          y: trailY, 
          translateX: '-50%', translateY: '-50%' 
        }}
      />
    </div>
  );
};

// --- 核心組件：神經網格背景 ---
const NeuralMeshBackground = ({ mouse }) => {
  const canvasRef = useRef(null);
  const anchors = useMemo(() => [
    { x: 0.2, y: 0.35 }, { x: 0.8, y: 0.25 },
    { x: 0.5, y: 0.55 }, { x: 0.15, y: 0.75 }, { x: 0.85, y: 0.8 }
  ], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = Array.from({ length: 85 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: 0, vy: 0,
      size: Math.random() * 1.2 + 0.4,
      targetIdx: Math.floor(Math.random() * anchors.length)
    }));
    let animationId;
    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      particles.forEach((p, i) => {
        const anchor = anchors[p.targetIdx];
        const ax = anchor.x * width;
        const ay = anchor.y * height;
        p.vx += (ax - p.x) * 0.00008;
        p.vy += (ay - p.y) * 0.00008;
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 320) {
          const force = (320 - dist) / 320;
          p.vx += dx * 0.00012 * force;
          p.vy += dy * 0.00012 * force;
          particles.slice(i + 1, i + 12).forEach(p2 => {
            const d2 = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
            if (d2 < 90) {
              ctx.strokeStyle = `rgba(255, 140, 66, ${0.12 * (1 - d2/90) * (1 - dist/320)})`;
              ctx.lineWidth = 0.4;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          });
        }
        p.vx *= 0.97; p.vy *= 0.97;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = dist < 200 ? 'rgba(255, 140, 66, 0.4)' : 'rgba(255, 140, 66, 0.15)';
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
};

// --- 優化組件：HI, I AM REN ---
const InteractiveHeadline = () => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="flex flex-col items-start pointer-events-auto overflow-visible">
      <motion.h1
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`text-5xl md:text-[5.5rem] lg:text-[7rem] font-black mb-4 leading-none transition-all duration-500 cursor-default flex items-baseline whitespace-nowrap
          ${isHovered ? 'tracking-[0.02em] text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#f59e0b]' : 'tracking-tighter text-slate-900'}
        `}
      >
        HI, I AM
        <span className={`italic transition-all duration-500 ml-4 ${isHovered ? '' : 'text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C42] to-orange-300'}`}>
          REN
        </span>
      </motion.h1>
    </div>
  );
};

// --- 照片磁吸特效 + 核心標籤 ---
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
    handleResize(); return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dx = mouse.x - center.x;
  const dy = mouse.y - center.y;
  const distance = Math.sqrt(dx*dx + dy*dy);
  const isNear = distance < 250; 
  const pullX = isNear ? Math.max(-12, Math.min(12, dx * 0.05)) : 0;
  const pullY = isNear ? Math.max(-12, Math.min(12, dy * 0.05)) : 0;

  const floatTags = [
    { text: "UIUX", top: "-5%", left: "-10%", delay: 0 },
    { text: "產品策略", top: "15%", right: "-15%", delay: 0.1 },
    { text: "專案溝通/整合管理", bottom: "10%", left: "-20%", delay: 0.2 },
    { text: "數位內容規劃", bottom: "-5%", right: "-5%", delay: 0.15 }
  ];

  return (
    <div className="z-20 pointer-events-auto relative mt-8 md:mt-0" ref={photoRef}>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ x: pullX, y: pullY, scale: isHovered ? 1.03 : 1 }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="relative"
      >
        <div className={`relative w-64 h-64 md:w-[22rem] md:h-[22rem] rounded-[3rem] overflow-hidden shadow-2xl border-[6px] border-white bg-slate-100 transition-shadow duration-500 ${isHovered ? 'shadow-[#FF8C42]/20' : ''}`}>
          <div className={`absolute inset-0 bg-gradient-to-br from-[#FF8C42]/20 to-[#2dd4bf]/20 transition-opacity duration-500 z-10 mix-blend-overlay ${isHovered ? 'opacity-100' : 'opacity-0'}`}></div>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop" 
            alt="Profile" className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-105' : ''}`}
          />
        </div>

        <AnimatePresence>
          {isHovered && floatTags.map((tag, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.3, delay: tag.delay }}
              className="absolute whitespace-nowrap bg-slate-900/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-[11px] font-bold tracking-widest z-30 pointer-events-none shadow-xl"
              style={{ 
                top: tag.top, bottom: tag.bottom, left: tag.left, right: tag.right,
                borderLeft: `3px solid ${idx % 2 === 0 ? '#FF8C42' : '#2dd4bf'}`
              }}
            >
              {tag.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const App = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const projects = [
    {
      id: 'actorcore',
      title: 'ActorCore 平台搜尋重構',
      tag: 'DEEP SEARCH OPTIMIZATION',
      desc: '主導 3D 素材平台搜尋體驗優化。透過深度分析使用者搜尋行為，重新定義 Deep Search 邏輯，顯著降低查找摩擦，打造具備 **Stunning visual experiences** 的素材查找旅程。',
      results: ['搜尋成功率提升 20%', '優化 IA 分類架構與內容可發現性'],
      icon: Search, skills: ['Keyword Analysis', 'Taxonomy', 'IA']
    },
    {
      id: 'content-store',
      title: 'Content Store 商業化營運',
      tag: 'COMMERCIALIZATION STRATEGY',
      desc: '負責全球數位內容商店與 Marketplace 營運。針對不同的資產類別進行 **Package** 規劃，制定定價策略與 Bundling 銷售方案，透過數據分析驅動產品營收成長。',
      results: ['建立內容商品化標竿流程', '有效提升 **Package** 銷售轉化率'],
      icon: Package, skills: ['Package Strategy', 'Commercialization']
    },
    {
      id: 'police-xr',
      title: '警署 XR 模擬訓練系統 (0→1)',
      tag: '0→1 SYSTEM ARCHITECTURE',
      desc: '統籌 4,000 萬級政府專案。與 **Asian action movie stunt team** 合作錄製高標準 **Stunts**（特技動作），精確捕捉「**people being blown away**」等震撼動態細節，將技術需求轉化為極致訓練體驗。',
      results: ['完成 4,000 萬標案驗收', '成功導入全台警政教學體系'],
      icon: ShieldCheck, skills: ['Prioritization', 'Synergy', 'XR Implementation']
    },
    {
      id: 'bus-plus',
      title: 'Bus+ 全台公車 APP 重構',
      tag: 'UI/UX DESIGN & ITERATION',
      desc: '參與全台知名公車動態 APP 優化。獨立完成 Design System 建置與 Prototype 製作。以使用者研究為核心持續迭代，展現 PM 產品定義與體驗設計之跨領域綜效。',
      results: ['目標受眾滿意度突破 80%', '建立可擴充的 UI 元件化規範'],
      icon: Layout, skills: ['UI/UX Design', 'Design System', 'Prototyping']
    }
  ];

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative cursor-none overflow-x-hidden">
      <CustomCursor />
      <NeuralMeshBackground mouse={mousePos} />
      
      <nav className="fixed w-full bg-white/60 backdrop-blur-xl z-[100] py-4 px-8 md:px-12 flex justify-between items-center border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="text-xl font-black tracking-tighter cursor-pointer flex items-center gap-2 pointer-events-auto" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 bg-[#FF8C42] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-lg">RH</div>
          <span>REN <span className="text-slate-900">HAO</span></span>
        </div>
        <div className="hidden md:flex space-x-10 font-black text-[10px] tracking-widest uppercase items-center text-slate-500 pointer-events-auto">
          <button onClick={() => scrollTo('experience')} className="hover:text-[#FF8C42] transition-colors">EXPERIENCE</button>
          <button onClick={() => scrollTo('projects')} className="hover:text-[#FF8C42] transition-colors">PROJECTS</button>
          <button onClick={() => scrollTo('expertise')} className="hover:text-[#FF8C42] transition-colors">EXPERTISE</button>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section id="hero" style={{ opacity: heroOpacity }} className="relative min-h-screen pt-24 pb-0 flex flex-col justify-center px-6 md:px-12 z-10 pointer-events-none">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          <div className="w-full md:w-[60%] lg:pr-16 text-left flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-8 bg-[#FF8C42]"></div>
              <div className="text-[#FF8C42] font-black text-[10px] tracking-[0.4em] uppercase">Commercialization Product Manager</div>
            </div>
            <InteractiveHeadline />
            <p className="text-lg text-gray-500 max-w-xl mb-10 font-medium leading-relaxed pointer-events-auto mt-4">
              鄭人豪 — 擅長在不確定中建立邏輯。專注於產品商業化營運 (Commercialization)、數據驅動體驗優化，與具備 **Stunning visual experiences** 的系統落地。
            </p>
            <div className="flex items-center gap-6 pointer-events-auto">
              <button onClick={() => scrollTo('experience')} className="group bg-[#333333] text-white font-black py-4 px-8 rounded-full hover:bg-[#FF8C42] transition-all flex items-center gap-2 text-sm shadow-xl shadow-orange-500/10">
                EXPLORE CAREER <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
          <div className="w-full md:w-[40%] flex justify-center md:justify-end">
             <ProfilePhoto mouse={mousePos} />
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-300 flex flex-col items-center gap-2 animate-bounce"><ArrowDown size={20} /></div>
      </motion.section>

      {/* Career Path (Experience) */}
      <section id="experience" className="py-20 px-6 md:px-12 relative z-10 bg-slate-50/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Career Path</h2>
            <div className="h-[2px] flex-grow bg-slate-200"></div>
          </div>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[11px] before:w-[2px] before:bg-gradient-to-b before:from-[#FF8C42] before:via-[#2dd4bf] before:to-transparent">
            {/* 甲尚科技 */}
            <motion.div whileHover={{ x: 10 }} className="relative pl-16 group pointer-events-auto cursor-pointer">
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white border-4 border-[#FF8C42] shadow-md group-hover:scale-150 group-hover:bg-[#FF8C42] transition-all duration-300"></div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group-hover:border-[#FF8C42]/40 group-hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-slate-500 font-bold"><Building2 size={14} /><span className="text-xs tracking-widest uppercase">Global E-commerce & SaaS</span></div>
                    <h3 className="text-2xl font-black text-slate-900">甲尚科技 <span className="text-[#FF8C42] text-lg font-bold">Reallusion</span></h3>
                  </div>
                  <span className="text-xs font-black text-[#FF8C42] bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">2024.10 - Present</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 font-black">商品化經理 <span className="text-xs text-slate-400 font-medium border-l border-slate-300 pl-2">Commercialization Product Manager</span></h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">主導全球內容商店搜尋重構與商業化策略。透過數據驅動優化數位資產之 **Package** 規劃，達成商業目標與 **Stunning** 體驗的平衡。</p>
              </div>
            </motion.div>
            {/* 環球動力 */}
            <motion.div whileHover={{ x: 10 }} className="relative pl-16 group pointer-events-auto cursor-pointer">
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-white border-4 border-[#2dd4bf] shadow-md group-hover:scale-150 group-hover:bg-[#2dd4bf] transition-all duration-300"></div>
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 group-hover:border-[#2dd4bf]/40 group-hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1 text-slate-500 font-bold"><Building2 size={14} /><span className="text-xs tracking-widest uppercase">B2B / B2G Integration</span></div>
                    <h3 className="text-2xl font-black text-slate-900">環球動力 <span className="text-[#2dd4bf] text-lg font-bold">Global Power</span></h3>
                  </div>
                  <span className="text-xs font-black text-[#2dd4bf] bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100">2023.05 - 2024.10</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-4 font-black">產品設計師 <span className="text-xs text-slate-400 font-medium border-l border-slate-300 pl-2">Product Designer & Project Exec.</span></h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">統籌 4,000 萬級警署 XR 訓練系統。在時程與技術限制下精準做出 **Prioritization** 決策，引領跨部門溝通並成功達成專案驗收。</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Major Missions - 大氣交錯排版 */}
      <section id="projects" className="py-20 px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic text-slate-900">Major Missions</h2>
            <div className="h-[2px] flex-grow bg-slate-100"></div>
          </div>

          <div className="space-y-24">
            {projects.map((project, idx) => (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 pointer-events-auto`}
              >
                <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-[3rem] shadow-xl overflow-hidden group cursor-pointer border border-slate-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-full h-full flex items-center justify-center">
                    <project.icon size={64} className="text-[#FF8C42] opacity-30 group-hover:scale-110 group-hover:opacity-60 transition-all duration-500" />
                  </div>
                  <div className="absolute top-8 right-8 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] font-black tracking-widest text-slate-400 border border-slate-100 uppercase">{project.tag}</div>
                </div>

                <div className="w-full md:w-1/2 text-left">
                  <h3 className="text-4xl font-black text-slate-900 mb-6">{project.title}</h3>
                  <p className="text-slate-500 text-base mb-8 leading-relaxed font-medium">{project.desc}</p>
                  <div className="space-y-3 mb-8 text-sm font-bold">
                    {project.results.map((r, i) => <div key={i} className="flex gap-3 text-slate-700 items-center"><CheckCircle2 size={18} className="text-[#FF8C42] shrink-0" /><span>{r}</span></div>)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map(s => <span key={s} className="text-[9px] font-black px-3 py-2 bg-slate-50 border border-slate-100 rounded-full text-slate-400 uppercase tracking-widest">{s}</span>)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Arsenal */}
      <section id="expertise" className="py-20 px-6 bg-white text-slate-900 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-left mb-16">
            <h2 className="text-4xl font-black mb-4 uppercase italic tracking-tighter">Strategic Arsenal</h2>
            <div className="w-16 h-1.5 bg-[#FF8C42]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pointer-events-auto">
            {[
              { title: '商品化營運', icon: <Target size={28} />, desc: '精通 Commercialization 策略，能有效規劃 Package 驅動營收成長。' },
              { title: '產品優先級', icon: <Users size={28} />, desc: '在 4,000 萬級專案中，展現強大 Prioritization 決策力。' },
              { title: '體驗架構設計', icon: <Layers size={28} />, desc: '具備重構 Taxonomy 架構能力，將複雜需求轉化為極致體驗。' },
              { title: '跨領域綜效', icon: <Sparkles size={28} />, desc: '與 Asian action movie stunt team 合作經驗，創造出 Stunning 綜效。' }
            ].map((item, i) => (
              <div key={i} className="p-8 border border-slate-100 rounded-[2rem] bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group relative overflow-hidden transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF8C42]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="mb-6 text-slate-300 group-hover:text-[#FF8C42] transition-all duration-500 relative z-10">{item.icon}</div>
                <h4 className="text-lg font-black mb-3 text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</p>
                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[#FF8C42] group-hover:w-full transition-all duration-500"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="py-20 px-6 bg-slate-50 text-center border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-slate-950 rounded-xl mx-auto mb-8 flex items-center justify-center text-white font-black text-xl shadow-xl rotate-3">RH</div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">期待能與願景團隊攜手打造<br />具備商業價值與 <span className="text-[#FF8C42]">Stunning</span> 體驗的產品。</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8 font-black pointer-events-auto">
            <a href="mailto:a199b5c20@gmail.com" className="text-lg hover:text-[#FF8C42] transition-colors border-b-4 border-orange-100 font-sans pb-1">a199b5c20@gmail.com</a>
            <span className="text-slate-400 uppercase tracking-widest text-xs">New Taipei, Taiwan</span>
          </div>
          <div className="mt-12 text-[9px] font-black text-slate-300 tracking-[0.8em] uppercase">© 2026 JEN-HAO ZHENG · PM PORTFOLIO V12.1</div>
        </div>
      </footer>
    </div>
  );
};

export default App;