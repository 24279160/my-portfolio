import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Play, 
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
  MousePointer2,
  Building2,
  Activity,
  Monitor,
  ClipboardList,
  BarChart3,
  Globe2,
  ArrowRight,
  Mail,
  Phone,
  Download,
  FileText,
  PenTool,
  Navigation,
  Zap,
  TrendingUp,
  Cpu,
  LayoutTemplate
} from 'lucide-react';

// --- 核心組件：優雅導覽滑鼠 ---
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 35, stiffness: 280, mass: 0.5 };
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
          scale: isHovering ? 1.4 : 1,
          opacity: isHovering ? 0.7 : 0.25
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

// --- 進度條：科技光軌 ---
const AestheticProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-[110] bg-slate-100/30 backdrop-blur-sm pointer-events-none">
      <motion.div 
        className="absolute top-0 left-0 bottom-0 origin-left bg-gradient-to-r from-[#FF8C42]/50 to-[#FF8C42]" 
        style={{ scaleX, width: '100%' }} 
      >
        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_12px_4px_rgba(255,140,66,0.8)]" 
          style={{ transform: 'translateX(50%)' }}
        ></div>
      </motion.div>
    </div>
  );
};

// --- 背景組件：神經脈動背景 ---
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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; 
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
        if (dist < 380) {
          const force = (380 - dist) / 380;
          p.vx += dx * 0.00015 * force;
          p.vy += dy * 0.00015 * force;
          particles.slice(i + 1, i + 12).forEach(p2 => {
            const d2 = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
            if (d2 < 110) {
              ctx.strokeStyle = `rgba(255, 140, 66, ${0.15 * (1 - d2/110) * (1 - dist/380)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
            }
          });
        }
        p.vx *= 0.94; p.vy *= 0.94;
        p.x += p.vx; p.y += p.vy;
        ctx.fillStyle = dist < 250 ? 'rgba(255, 140, 66, 0.3)' : 'rgba(255, 140, 66, 0.15)';
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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

// --- 互動卡片容器 (專案使用) ---
const TiltCard = ({ children, className = "" }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const onMouseMove = (e) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const glowX = (x / box.width) * 100;
    const glowY = (y / box.height) * 100;
    setGlow({ x: glowX, y: glowY });
    const centerX = box.width / 2;
    const centerY = box.height / 2;
    const rotateX = (y - centerY) / 45;
    const rotateY = (centerX - x) / 45;
    setRotate({ x: rotateX, y: rotateY });
  };

  const onMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      animate={{ rotateX: rotate.x, rotateY: rotate.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 25 }}
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
      className={`relative group ${className}`}
    >
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]"
        style={{ background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(255, 140, 66, 0.12) 0%, transparent 60%)` }}
      />
      {children}
    </motion.div>
  );
};

// --- ★ 優化：加入明顯的量子網格與游離粒子特效 ---
const MetricCard = ({ impact }) => {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col h-full bg-slate-50/40 backdrop-blur-sm border border-slate-100 p-6 md:p-8 rounded-[2.5rem] hover:border-[#FF8C42]/50 transition-all duration-500 group shadow-sm overflow-hidden pointer-events-auto"
    >
      {/* 互動特效容器 */}
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        
        {/* 1. 柔和追蹤光暈 */}
        <div 
          className="absolute inset-0 transition-opacity duration-300"
          style={{ background: `radial-gradient(circle 280px at ${mousePos.x}px ${mousePos.y}px, rgba(255,140,66,0.15), transparent 80%)` }}
        />
        
        {/* 2. 科技感量子網格 (Grid) */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `linear-gradient(rgba(255,140,66,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,140,66,0.4) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            WebkitMaskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
            maskImage: `radial-gradient(circle 180px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
          }}
        />

        {/* 3. 游離量子粒子 (Particles) */}
        <div 
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
            maskImage: `radial-gradient(circle 220px at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_3px_rgba(255,140,66,0.9)]"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ 
                y: [0, -60, 0], 
                x: [0, (Math.random() - 0.5) * 40, 0],
                opacity: [0, 1, 0], 
                scale: [0, 1.5, 0] 
              }}
              transition={{ 
                duration: 2 + Math.random() * 3, 
                repeat: Infinity, 
                ease: "easeInOut", 
                delay: Math.random() * 2 
              }}
            />
          ))}
        </div>
      </div>
      
      {/* 卡片內容 */}
      <div className="relative z-10 text-slate-300 mb-5 group-hover:text-[#FF8C42] transition-colors duration-300 group-hover:scale-110 transform origin-left w-fit">
        <impact.icon size={32} strokeWidth={2.5} />
      </div>
      <div className="relative z-10 text-4xl font-black text-slate-900 mb-2 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{impact.value}</div>
      <div className="relative z-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{impact.label}</div>
      <div className="relative z-10 text-xs text-slate-500 font-medium leading-relaxed mt-auto">{impact.desc}</div>
    </div>
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
        x: Math.max(-10, Math.min(10, dx * 0.05)),
        y: Math.max(-6, Math.min(6, dy * 0.05))
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
          textShadow: isHovered ? '0 0 30px rgba(255, 140, 66, 0.2)' : 'none'
        }}
      >
        HI, I AM <span className="italic">REN.</span>
      </motion.h1>
    </div>
  );
};

// --- 頭像組件 (★優化：動態漂浮標籤) ---
const ProfilePhoto = ({ mouse }) => {
  const [isHovered, setIsHovered] = useState(false);
  const avatarUrl = "https://lh3.googleusercontent.com/d/1TsRwo9QiibKwW7PNCBnhPbbizfDXVaH9";

  const floatTags = [
    { text: "產品策略規劃", top: "-4%", left: "-6%", delay: 0 },
    { text: "數位內容營運", top: "18%", right: "-12%", delay: 0.1 },
    { text: "專案協同管理", bottom: "12%", left: "-18%", delay: 0.2 },
    { text: "UIUX 體驗設計", bottom: "-6%", right: "-2%", delay: 0.15 },
    { text: "SEO 與數據分析", top: "45%", left: "-22%", delay: 0.25 },
    { text: "商業化 Package 策略", bottom: "40%", right: "-25%", delay: 0.3 }
  ];

  return (
    <div className="z-20 pointer-events-auto relative mt-8 md:mt-0 w-full flex justify-center md:block md:w-auto">
      <div style={{ perspective: '1200px' }} className="relative">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.04, rotateY: 6, rotateX: -4 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="relative cursor-none z-10"
        >
          <div className="relative w-64 h-64 md:w-[19rem] md:h-[19rem] rounded-[3.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[6px] border-white bg-slate-100">
            <img src={avatarUrl} alt="Profile" className={`w-full h-full object-cover transition-transform duration-[1200ms] ${isHovered ? 'scale-108' : ''}`} />
          </div>
          
          <AnimatePresence>
            {isHovered && floatTags.map((tag, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: tag.delay, ease: "easeOut" }}
                className="absolute z-30 pointer-events-none"
                style={{ top: tag.top, bottom: tag.bottom, left: tag.left, right: tag.right }}
              >
                {/* 漂浮動畫層 */}
                <motion.div
                  animate={{ 
                    y: [-6, 6, -6], 
                    x: [-4, 4, -4],
                    rotate: [-2, 2, -2]
                  }}
                  transition={{ 
                    duration: 4 + (idx % 3), 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="whitespace-nowrap bg-slate-900/80 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-[10px] font-black tracking-widest shadow-xl"
                  style={{ borderLeft: `3px solid ${idx % 2 === 0 ? '#FF8C42' : '#2dd4bf'}` }}
                >
                  {tag.text}
                </motion.div>
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
  const [hoveredContact, setHoveredContact] = useState(null);
  
  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const impactMetrics = [
    { label: "Search Success", value: "+20%", icon: Zap, desc: "重構搜尋邏輯與 IA，提升搜尋匹配效率。" },
    { label: "Operational Growth", value: "+10-25%", icon: TrendingUp, desc: "規劃核心營運模組，提升內容發現與轉換。" },
    { label: "System Delivery", value: "$40M", icon: Cpu, desc: "主導大型政府 XR 專案落地，管理開發與驗收。" }
  ];

  // ★優化：Icon 放大 (size={28}) 且加粗 (strokeWidth={2.2})
  const reallusionBullets = [
    { icon: <Target size={28} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "商業策略", text: <>負責歐美電商平台 (ActorCore / Content Store) 之產品策略與商業化規劃，涵蓋搜尋體驗優化、資訊架構設計與內容轉換流程。</> },
    { icon: <Search size={28} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "體驗重構", text: <>分析使用者長尾搜尋行為，定義 Deep Search 產品規格。提升搜尋成功率 <span className="font-black text-slate-900 border-b-[2px] border-orange-200">20%</span> 並降低搜尋摩擦。</> },
    { icon: <Globe2 size={28} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "架構優化", text: <>規劃平台核心功能（搜尋、分類、推薦），提升內容可發現性與使用效率約 <span className="font-black text-slate-900 border-b-[2px] border-orange-200">15–25%</span>。</> },
    { icon: <Package size={28} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "定價包裝", text: <>建立商品化策略（Theme / Bundle / Motion 組合），優化產品結構與轉換流程。</> },
    { icon: <BarChart3 size={28} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "營運增長", text: <>設計營運模組（Promotion / Offer Page），支援行銷活動與流量轉換 (CTR 提升約 <span className="font-black text-slate-900 border-b-[2px] border-orange-200">10–15%</span>)。</> },
    { icon: <Users size={28} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "跨國協作", text: <>與海外團隊（內容製作 / 業務 / 行銷）協作，推動產品落地與全球市場策略。</> }
  ];

  const globalPowerBullets = [
    { icon: <Monitor size={28} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "0到1開發", text: <>參與 XR 模擬訓練系統（Web / Tablet / VR）之產品規劃與設計，推動產品從 0→1 開發與落地。</> },
    { icon: <LayoutTemplate size={28} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "多端架構", text: <>規劃多端產品架構，設計完整使用流程與互動機制。</> },
    { icon: <ClipboardList size={28} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "規格撰寫", text: <>撰寫產品規格 (Spec / Flow / IA)，確保跨部門開發一致性。</> },
    { icon: <ShieldCheck size={28} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "專案交付", text: <>參與政府專案執行，主導 <span className="font-black text-slate-900 border-b-[2px] border-teal-200">4,000 萬級</span>專案，確保產品符合實際應用場景與驗收標準。</> }
  ];

  const projects = [
    {
      id: 'actorcore',
      title: 'ActorCore 平台搜尋與 IA 重構',
      desc: '主導 3D 素材電商平台搜尋優化。分析自然語言搜尋行為，重定義 Deep Search 邏輯，並針對歐美市場規劃高轉化率架構。',
      results: ['搜尋成功率提升 20%', '優化商城推薦內容結構'],
      img: "https://lh3.googleusercontent.com/d/18StLx2sDg3Nidzgz5RQfp9HXxoacbkt7", 
      icon: Search,
      isFlagship: true,
      pmDeliverables: ['Deep Search PRD', 'Information Architecture', 'Data Tracking'],
      highlightMetric: '+20% Success',
      buttons: [
        { label: "查看商城連結", url: "https://actorcore.reallusion.com/3d-motion", icon: <ArrowRight size={14} /> }
      ],
      skills: ['Deep Search', 'IA Optimization', 'Data Analysis']
    },
    {
      id: 'content-store',
      title: 'Content Store 商業化包裝策略',
      desc: '負責歐美平台 Package Strategy。設計營運模組與 Promotion Page，結合 Theme/Bundle 模型有效提升 CTR 與商業轉換。',
      results: ['CTR 提升約 10–15%', '客製化 Page 驅動流量轉換'],
      img: "https://lh3.googleusercontent.com/d/1onA8n6Ydj4qu3SYtZi57ciEXgktuxICE", 
      icon: Package,
      isFlagship: true,
      pmDeliverables: ['Pricing Matrix', 'Promotion Flow', 'Bundling Strategy'],
      highlightMetric: '+15% CTR',
      buttons: [
        { label: "查看商城連結", url: "https://www.reallusion.com/contentstore/category/iclone/animation/motion?nav=Top", icon: <ArrowRight size={14} /> }
      ],
      skills: ['Package Strategy', 'Commercialization', 'CTR Growth']
    },
    {
      id: 'police-xr',
      title: '警署 XR 模擬訓練系統 (0→1)',
      desc: '統籌 4,000 萬級標案。協作 Asian action movie stunt team 錄製高標準 Stunts，打造具備沉浸感與真實性的場景驗收，包含 people being blown away 等精確細節。',
      results: ['完成 4,000 萬標案驗收', '成功導入全台教學體系'],
      img: "https://lh3.googleusercontent.com/d/1OSnyyQldtfyGbqPS_d1fYWA2qpUVfzEG", 
      icon: ShieldCheck,
      isFlagship: false,
      pmDeliverables: ['System Flow Chart', 'Acceptance Criteria', 'Cross-dept Sync'],
      highlightMetric: '$40M Delivered',
      buttons: [
        { label: "查看展示影片", url: "https://youtu.be/VFtLeFSkq-Y", icon: <Play size={14} fill="currentColor" /> }
      ],
      skills: ['Prioritization', 'Asian Stunt Team', 'Stunts Capture']
    },
    {
      id: 'bus-plus',
      title: 'Bus+ APP 介面重構與優化',
      desc: '擔任 UI Designer 參與 B2C 產品優化。獨立完成 Design System 建置與 Prototype 製作，以服務設計思維驅動迭代。',
      results: ['目標受眾滿意度突破 80%', '建立可擴充的 UI 元件化規範'],
      img: "https://lh3.googleusercontent.com/d/1GtaMd0eyQrWN2OuGyNe9RmbilG5wvv1P", 
      icon: LayoutTemplate,
      isFlagship: false,
      pmDeliverables: ['Design System', 'User Research', 'Interactive Prototype'],
      highlightMetric: '>80% Satisfaction',
      buttons: [
        { label: "專案介紹", url: "https://canva.link/ekmxli49aegakvj", icon: <FileText size={14} /> },
        { label: "Figma", url: "https://www.figma.com/design/Zqj906uj1rMQpcvOwg24LE/BUS+_3/31--UI?node-id=138-1498&t=oLKIHKC0WNmUW8xu-1", icon: <PenTool size={14} /> },
        { label: "互動原型", url: "https://www.figma.com/proto/Zqj906uj1rMQpcvOwg24LE/BUS+_3/31--UI?page-id=138:1498&node-id=710-73139&viewport=-9828,1631,0.35&t=KCyPi9RaQar0iP42-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=710:73139&show-proto-sidebar=1", icon: <Navigation size={14} /> }
      ],
      skills: ['UI/UX Design', 'Design System', 'Prototyping']
    }
  ];

  const contactOptions = [
    {
      id: 'mail',
      title: 'Email 聯絡',
      label: 'Send Email',
      value: 'a199b5c20@gmail.com',
      icon: Mail,
      desc: '點擊發送電子郵件至 a199b5c20@gmail.com，討論產品經理相關職務合作。',
      color: '#FF8C42'
    },
    {
      id: 'phone',
      title: '電話聯繫',
      label: 'Call Now',
      value: '0903832322',
      icon: Phone,
      desc: '直接撥打 0903-832-322 與我聯繫，進行更即時的溝通與對齊。',
      color: '#2dd4bf'
    },
    {
      id: 'download',
      title: '個人檔案',
      label: '下載CV',
      value: 'https://drive.google.com/drive/folders/1msoTXlaDAHxeuLLGlMHz4HpXpikqDt3M?usp=drive_link',
      icon: Download,
      desc: '下載我的完整履歷與過往專案詳細文件，了解更多專業實戰細節。',
      color: '#64748b'
    }
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative cursor-none overflow-x-hidden">
      <AestheticProgressBar />
      <CustomCursor />
      <NeuralMeshBackground mouse={mousePos} />
      
      <nav className="fixed w-full bg-white/70 backdrop-blur-xl z-[100] py-4 px-8 md:px-12 flex justify-between items-center border-b border-gray-100 shadow-sm mt-1.5">
        <div className="text-xl font-black tracking-tighter cursor-pointer flex items-center gap-2 pointer-events-auto" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-8 h-8 bg-[#FF8C42] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md">RH</div>
          <span className="font-bold uppercase tracking-widest text-sm text-slate-900">REN <span className="text-slate-600">HAO</span></span>
        </div>
        <div className="hidden md:flex space-x-10 font-bold text-[10px] tracking-widest uppercase items-center text-slate-500 pointer-events-auto">
          <button onClick={() => scrollTo('experience')} className="hover:text-[#FF8C42] transition-colors">EXPERIENCE</button>
          <button onClick={() => scrollTo('projects')} className="hover:text-[#FF8C42] transition-colors">PROJECTS</button>
          <button onClick={() => scrollTo('expertise')} className="hover:text-[#FF8C42] transition-colors">SKILLS</button>
          <button onClick={() => scrollTo('about')} className="border border-slate-200 text-slate-800 px-6 py-2 rounded-full hover:border-[#FF8C42] hover:text-[#FF8C42] transition-all text-[10px] font-black tracking-widest">CONTACT ME</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen pt-20 pb-12 flex flex-col justify-center px-6 md:px-12 z-10 pointer-events-none text-left">
        <div className="max-w-[1300px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-[60%] flex flex-col items-start">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[1px] w-10 bg-[#FF8C42]"></div>
              <div className="text-[#FF8C42] font-black text-[10px] tracking-[0.4em] uppercase">Commercialization Product Manager</div>
            </div>
            <MagneticHeadline mouse={mousePos} />
            
            {/* ★優化：專業精煉版自我介紹文案 */}
            <div className="text-slate-500 font-medium leading-relaxed pointer-events-auto space-y-5 mb-10 max-w-2xl text-[15px] md:text-base">
              <p>
                你好，我是具備產品策略與歐美平台營運經驗的 PM，於 Reallusion 負責素材電商 ActorCore 與 Content Store 之產品優化與市場策略。工作內容涵蓋搜尋體驗優化、商城推薦內容結構規劃（Theme / Tag），以及與歐美開發者協作商品化頁面規劃。透過使用者行為分析，我持續優化內容匹配與整體瀏覽體驗，提升使用者查找效率與平台轉換表現。
              </p>
              <p>
                過去我也具備 0→1 XR 跨平臺系統建置經驗，能將使用者研究洞察轉化為產品功能規劃與優先順序決策，並在技術限制與商業目標之間取得平衡，推動產品落地與成長。也曾參與 Bus+ APP 產品介面優化專案，累積 B2C 產品優化能力。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full pointer-events-auto mb-8">
              {impactMetrics.map((impact, i) => (
                <MetricCard key={i} impact={impact} />
              ))}
            </div>
          </div>
          <div className="w-full md:w-[40%] flex justify-center md:justify-end">
            <ProfilePhoto mouse={mousePos} />
          </div>
        </div>
      </section>

      {/* Career Path Section */}
      <section id="experience" className="py-24 px-6 md:px-12 relative z-10 bg-slate-50/50 text-left">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 text-left">Career Path</h2>
            <div className="h-[2px] flex-grow bg-slate-200"></div>
          </div>
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[11px] before:w-[1.5px] before:bg-gradient-to-b before:from-[#FF8C42] before:via-[#2dd4bf] before:to-transparent">
            
            <motion.div whileHover={{ x: 8 }} className="relative pl-16 group pointer-events-auto">
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full bg-white border-4 border-[#FF8C42] group-hover:scale-125 transition-all" />
              <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-[#FF8C42]/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-3 text-left">
                  <div>
                    {/* ★優化：加大公司建築 Icon */}
                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold"><Building2 size={24} /><span className="text-xs tracking-widest uppercase">Global E-commerce & SaaS</span></div>
                    <h3 className="text-2xl font-black text-slate-900">甲尚科技 <span className="text-[#FF8C42] text-lg font-bold italic ml-2">Reallusion</span></h3>
                  </div>
                  <span className="text-[10px] font-black text-[#FF8C42] bg-orange-50 px-4 py-2 rounded-full border border-orange-100">2024.10 - Present</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-8 font-black uppercase tracking-wide text-left">
                  商品化經理 <span className="text-[10px] text-slate-400 font-medium border-l border-slate-200 pl-3 ml-2 tracking-widest uppercase">Commercialization Product Manager</span>
                </h4>
                
                <div className="flex flex-col gap-4 text-left">
                  {reallusionBullets.map((bullet, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8 items-center bg-slate-50/40 p-5 md:p-6 rounded-[1.5rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/item cursor-default border border-transparent hover:border-orange-100/80">
                      <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-28 space-y-3 border-b md:border-b-0 md:border-r border-slate-200/60 pb-4 md:pb-0 md:pr-6">
                        {/* ★優化：加大 Bullet Icon 容器 */}
                        <div className="p-4 bg-orange-50 rounded-2xl shadow-sm text-[#FF8C42] group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-300">
                          {bullet.icon}
                        </div>
                        <span className="text-[11px] font-black tracking-widest text-[#FF8C42] text-center whitespace-nowrap">
                          {bullet.tag}
                        </span>
                      </div>
                      <div className="flex-1 text-slate-600 text-[13px] md:text-sm leading-relaxed font-medium">
                        {bullet.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div whileHover={{ x: 8 }} className="relative pl-16 group pointer-events-auto">
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full bg-white border-4 border-[#2dd4bf] group-hover:scale-125 transition-all" />
              <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-sm border border-slate-100 hover:border-[#2dd4bf]/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left">
                  <div>
                    {/* ★優化：加大公司建築 Icon */}
                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold"><Building2 size={24} /><span className="text-xs tracking-widest uppercase">B2B / B2G Integration</span></div>
                    <h3 className="text-2xl font-black text-slate-900">全球動力科技 <span className="text-[#2dd4bf] text-lg font-bold italic ml-2">Global Power</span></h3>
                  </div>
                  <span className="text-[10px] font-black text-[#2dd4bf] bg-teal-50 px-4 py-2 rounded-full border border-teal-100">2023.05 - 2024.10</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-8 font-black uppercase tracking-wide text-left">
                  產品設計師 <span className="text-[10px] text-slate-400 font-medium border-l border-slate-300 pl-3 ml-2 tracking-widest uppercase">Product Designer & Project Exec.</span>
                </h4>
                
                <div className="flex flex-col gap-4 text-left">
                  {globalPowerBullets.map((bullet, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-4 md:gap-8 items-center bg-slate-50/40 p-5 md:p-6 rounded-[1.5rem] hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group/item cursor-default border border-transparent hover:border-teal-100/80">
                      <div className="flex flex-col items-center justify-center shrink-0 w-full md:w-28 space-y-3 border-b md:border-b-0 md:border-r border-slate-200/60 pb-4 md:pb-0 md:pr-6">
                        {/* ★優化：加大 Bullet Icon 容器 */}
                        <div className="p-4 bg-teal-50 rounded-2xl shadow-sm text-[#2dd4bf] group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-300">
                          {bullet.icon}
                        </div>
                        <span className="text-[11px] font-black tracking-widest text-[#2dd4bf] text-center whitespace-nowrap">
                          {bullet.tag}
                        </span>
                      </div>
                      <div className="flex-1 text-slate-600 text-[13px] md:text-sm leading-relaxed font-medium">
                        {bullet.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Projects Showcase */}
      <section id="projects" className="py-24 px-6 md:px-12 relative z-10 text-left">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center gap-6 mb-16 text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Project Showcase</h2>
            <div className="h-[1px] flex-grow bg-slate-100"></div>
          </div>
          
          <div className="space-y-16 pointer-events-auto">
            {projects.map((project, idx) => (
              <TiltCard 
                key={idx} 
                className={`bg-white p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden text-left cursor-default
                  ${project.isFlagship ? 'rounded-[4rem]' : 'rounded-[3.5rem]'}
                `}
              >
                <div className={`w-full md:w-[48%] rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200 relative shrink-0 ${project.isFlagship ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                  <motion.img src={project.img} alt={project.title} whileHover={{ scale: 1.1, rotate: -1 }} transition={{ duration: 1.5, ease: "easeOut" }} className="w-full h-full object-cover" />
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/50 z-30"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse"></div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Business Impact</span>
                    </div>
                    <div className={`font-black ${project.isFlagship ? 'text-xl' : 'text-lg'} text-slate-900 tracking-tight`}>
                      {project.highlightMetric}
                    </div>
                  </motion.div>
                </div>
                
                <div className="flex-grow flex flex-col h-full py-2 relative z-20">
                  <div className="flex items-center gap-3 mb-4 text-left">
                    <div className={`w-8 h-[2px] ${project.isFlagship ? 'bg-[#FF8C42]' : 'bg-slate-300'} group-hover:w-12 transition-all duration-500`}></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      {project.isFlagship ? <span className="text-[#FF8C42] bg-orange-50 px-2 py-1 rounded-md">FLAGSHIP INITIATIVE</span> : project.id}
                    </span>
                  </div>

                  <h3 className={`font-black text-slate-900 mb-5 leading-tight group-hover:text-[#FF8C42] transition-colors text-left ${project.isFlagship ? 'text-3xl' : 'text-2xl'}`}>
                    {project.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm mb-6 leading-relaxed font-medium text-left">
                    {project.desc}
                  </p>

                  <div className="mb-6 border-b border-slate-50 pb-5">
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Activity size={12} className="text-slate-400" /> PM Deliverables
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {project.pmDeliverables.map(d => (
                        <span key={d} className="text-[10px] font-bold text-slate-600 bg-slate-100/80 border border-slate-200 px-2.5 py-1.5 rounded-lg">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-8">
                    {project.results.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -5 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex gap-3 text-slate-700 items-start">
                        <CheckCircle2 size={16} className={`${project.isFlagship ? 'text-[#FF8C42]' : 'text-slate-400'} shrink-0 mt-0.5`} />
                        <span className="text-[13px] font-bold leading-relaxed">{r}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-auto pt-8 border-t border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                    <div className="flex gap-3 flex-wrap">
                      {project.buttons.map((btn, bIdx) => (
                        <motion.a 
                          key={bIdx}
                          href={btn.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black text-[10px] tracking-widest transition-all
                            ${bIdx === 0 
                              ? 'bg-gradient-to-r from-[#FF8C42] to-orange-400 text-white shadow-[0_8px_20px_rgba(255,140,66,0.25)] hover:shadow-[0_12px_25px_rgba(255,140,66,0.4)] border border-transparent' 
                              : 'bg-orange-50 text-[#FF8C42] border border-orange-200 hover:bg-[#FF8C42] hover:text-white hover:border-transparent shadow-sm'}`}
                        >
                          {btn.icon} {btn.label}
                        </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Skills */}
      <section id="expertise" className="py-24 px-6 md:px-24 bg-white relative z-10 border-t border-slate-50 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-6 mb-20 text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Professional Skills</h2>
            <div className="h-[1px] flex-grow bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-auto">
            {[
              { title: '商品化營運規劃', icon: <Target size={28} />, desc: '具備 Commercialization 完整策略能力，能有效規劃 Package 並驅動業務增長。' },
              { title: '產品優化與管理', icon: <Users size={28} />, desc: '具備明確的 Prioritization 決策邏輯，能在開發限制中最大化產品價值。' },
              { title: '資訊架構優化', icon: <Layers size={28} />, desc: '擅長重構系統 Taxonomy 與 IA 架構，優化內容發現效率與搜尋體驗。' },
              { title: '數據驅動決策', icon: <BarChart3 size={28} />, desc: '分析使用者行為與銷售數據，持續優化產品轉化流程與用戶留存。' }
            ].map((item, i) => (
              <div key={i} className="p-10 border border-slate-50 rounded-[3rem] bg-slate-50/30 hover:bg-white hover:shadow-2xl transition-all group relative overflow-hidden transform hover:-translate-y-2 shadow-sm text-left">
                <div className="mb-6 text-slate-300 group-hover:text-[#FF8C42] group-hover:scale-110 transition-all w-fit">{item.icon}</div>
                <h4 className="text-xl font-black mb-4 text-slate-800 tracking-tight text-left">{item.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium text-left">{item.desc}</p>
                <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[#FF8C42] group-hover:w-full transition-all duration-600 ease-out"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Resources Footer */}
      <footer id="about" className="py-32 px-6 bg-white border-t border-slate-100 relative overflow-hidden text-center">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-slate-50 rounded-full border border-slate-100 mb-6">
               <span className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase text-center">Professional Network</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight tracking-tighter text-center">聯絡資訊與資源</h2>
            <p className="text-slate-400 font-medium text-center">點擊下方卡片展開詳細聯絡資訊，期待與您的團隊共同創造價值。</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-24 pointer-events-auto">
            {contactOptions.map((opt) => (
              <motion.a
                layout key={opt.id}
                href={opt.id === 'mail' ? `mailto:${opt.value}` : opt.id === 'phone' ? `tel:${opt.value}` : opt.value}
                target={opt.id === 'download' ? "_blank" : "_self"}
                onMouseEnter={() => setHoveredContact(opt.id)}
                onMouseLeave={() => setHoveredContact(null)}
                animate={{ flex: hoveredContact === opt.id ? 2.2 : 1, opacity: hoveredContact && hoveredContact !== opt.id ? 0.45 : 1, filter: hoveredContact && hoveredContact !== opt.id ? 'blur(3px)' : 'blur(0px)' }}
                transition={{ type: 'spring', stiffness: 140, damping: 25 }}
                className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden relative group cursor-pointer text-left"
              >
                <div className="absolute -top-4 -right-4 w-32 h-32 opacity-5 group-hover:opacity-15 transition-opacity" style={{ color: opt.color }}><opt.icon size={110} strokeWidth={1} /></div>
                <div className="relative z-10 flex flex-col h-full text-left">
                  <div className="flex items-center gap-4 mb-8 text-left">
                    <div className="p-4 rounded-[1.5rem] bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all" style={{ color: opt.color }}><opt.icon size={26} /></div>
                    <div>
                       <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 text-left">{opt.title}</div>
                       <div className="text-xl font-black text-slate-900 text-left">{opt.label}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-400 mb-8 leading-relaxed max-w-xs group-hover:text-slate-600 transition-colors text-left">{opt.desc}</div>
                  <div className="mt-auto text-left">
                    <div className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: opt.color }}>詳細資訊</div>
                    <div className="text-[15px] font-black text-slate-800 text-left">{opt.id === 'download' ? "前往履歷雲端資料夾" : opt.value}</div>
                  </div>
                  <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-100 translate-x-3 group-hover:translate-x-0 transition-all duration-500"><ArrowRight size={22} style={{ color: opt.color }} /></div>
                </div>
              </motion.a>
            ))}
          </div>
          <div className="mt-32 text-[10px] font-black text-slate-300 tracking-[0.9em] uppercase flex flex-col items-center gap-4">
            <div className="w-12 h-[1px] bg-slate-200"></div>
            © 2026 JEN-HAO ZHENG · PM PORTFOLIO V30.0 QUANTUM UPGRADE
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;