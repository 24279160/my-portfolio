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
  LayoutTemplate,
  CheckCircle
} from 'lucide-react';

/**
 * ============================================================================
 * SOFTWARE PRODUCT MANAGER PORTFOLIO - REN HAO ZHENG (V20.6)
 * ----------------------------------------------------------------------------
 * 更新日誌：
 * 1. 根據 UX 建議，將 ImageCarousel 的控制點 (Dots) 完全移出圖片容器外 (下方)。
 * 2. 徹底解決點擊被 Hover 動畫吞噬/干擾的問題，確保 100% 可點擊。
 * 3. 調整控制點在淺色背景下的高質感配色 (灰色 -> 品牌橘)。
 * ============================================================================
 */

// --- ★ 智慧設備偵測 Hook ---
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const match = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(match);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return isMobile;
};

// --- 背景特效 1：環境漸層流光球 ---
const AmbientBlobs = ({ isMobile }) => {
  const blurClass = isMobile ? "blur-[60px]" : "blur-[120px]";
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 mix-blend-multiply">
      <motion.div 
        animate={isMobile ? { x: 0, y: 0 } : { x: [0, 60, -20, 0], y: [0, 30, -50, 0] }} 
        transition={isMobile ? {} : { duration: 20, repeat: Infinity, ease: "easeInOut" }} 
        className={`absolute -top-[10%] -left-[10%] w-[45vw] h-[45vw] rounded-full bg-[#2dd4bf]/10 ${blurClass}`} 
      />
      <motion.div 
        animate={isMobile ? { x: 0, y: 0 } : { x: [0, -50, 30, 0], y: [0, 60, -20, 0] }} 
        transition={isMobile ? {} : { duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
        className={`absolute top-[20%] -right-[10%] w-[40vw] h-[55vw] rounded-full bg-[#FF8C42]/10 ${blurClass}`} 
      />
      <motion.div 
        animate={isMobile ? { x: 0, y: 0 } : { x: [0, 40, -40, 0], y: [0, -40, 30, 0] }} 
        transition={isMobile ? {} : { duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }} 
        className={`absolute -bottom-[20%] left-[20%] w-[55vw] h-[40vw] rounded-full bg-[#94a3b8]/15 ${blurClass}`} 
      />
    </div>
  );
};

// --- 核心組件：優雅導覽滑鼠 ---
const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const springConfig = { damping: 45, stiffness: 280, mass: 0.6 };
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
          scale: isHovering ? 1.2 : 1,
          opacity: isHovering ? 0.6 : 0.2
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
              ctx.strokeStyle = `rgba(255, 140, 66, ${0.12 * (1 - d2/110) * (1 - dist/380)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath(); 
              ctx.moveTo(p.x, p.y); 
              ctx.lineTo(p2.x, p2.y); 
              ctx.stroke();
            }
          });
        }
        
        p.vx *= 0.94; p.vy *= 0.94;
        p.x += p.vx; p.y += p.vy;
        
        ctx.fillStyle = dist < 250 ? 'rgba(255, 140, 66, 0.3)' : 'rgba(255, 140, 66, 0.15)';
        ctx.beginPath(); 
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); 
        ctx.fill();
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); 
    animate();
    
    return () => { 
      window.removeEventListener('resize', handleResize); 
      cancelAnimationFrame(animationId); 
    };
  }, [mouse, anchors]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-60" />;
};

// --- ★ 專案圖片輪播組件 (V20.6：控制點移至外部，防干擾機制) ---
const ImageCarousel = ({ images, isFlagship, highlightMetric }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [images, index]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-5">
      {/* 圖片展示主體 (懸浮互動保留於此容器內) */}
      <div className={`w-full rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200 relative bg-slate-100 ${isFlagship ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        
        {/* 這裡統一管理 Hover 的縮放，不會因為換圖而重置 */}
        <motion.div whileHover={{ scale: 1.15, rotate: -1.5 }} transition={{ duration: 1.2, ease: "easeOut" }} className="w-full h-full relative origin-center">
          <AnimatePresence>
            <motion.img
              key={index}
              src={images[index]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          </AnimatePresence>
        </motion.div>

        {/* 業務指標 */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/50 z-30 pointer-events-none"
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse"></div>
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Impact</span>
          </div>
          <div className={`font-black ${isFlagship ? 'text-xl' : 'text-lg'} text-slate-900 tracking-tight`}>
            {highlightMetric}
          </div>
        </motion.div>
      </div>
      
      {/* 底部進度指示器 Dots - 放置於圖片外側，絕對安全不干擾 */}
      <div className="flex justify-center items-center gap-2.5 w-full h-3 relative z-40 pointer-events-auto">
        {images.map((_, idx) => (
          <button 
            key={idx} 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIndex(idx);
            }}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm cursor-pointer border ${
              idx === index 
                ? 'w-8 bg-[#FF8C42] border-[#FF8C42]' 
                : 'w-2 bg-slate-200 border-slate-300 hover:bg-slate-300 hover:scale-125'
            }`} 
            aria-label={`Switch to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// --- 互動卡片容器 ---
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
    const rotateX = (y - centerY) / 90;
    const rotateY = (centerX - x) / 90;
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

// --- 趣味閃躲標籤元件 ---
const PlayfulDodgeTag = ({ text, tag, color, colorClass = "" }) => {
  const displayText = text || tag;
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleHover = () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 4 + Math.random() * 6; 
    setPos({ 
      x: Math.cos(angle) * distance, 
      y: Math.sin(angle) * distance - 2 
    });
    setRotation((Math.random() - 0.5) * 4); 
    setIsHovered(true);
  };

  const handleLeave = () => {
    setPos({ x: 0, y: 0 });
    setRotation(0);
    setIsHovered(false);
  };

  const dynamicStyle = color ? {
    backgroundColor: isHovered ? color : '#ffffff',
    color: isHovered ? '#ffffff' : '#64748b',
    borderColor: isHovered ? color : '#e2e8f0',
  } : {};

  const baseColorClass = colorClass || (color ? "" : "bg-white border-slate-200 text-slate-400 hover:border-[#FF8C42] hover:text-[#FF8C42]");

  return (
    <motion.span
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      animate={{
        x: pos.x,
        y: pos.y,
        rotate: rotation,
        scale: isHovered ? 1.05 : 1,
        ...dynamicStyle
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`text-xs md:text-[13px] font-black px-3 py-1.5 border rounded-full uppercase tracking-widest cursor-pointer inline-block z-10 relative shadow-sm transition-colors duration-300 ${baseColorClass} ${isHovered ? 'shadow-md z-20' : ''}`}
    >
      {displayText}
    </motion.span>
  );
};

// --- ActorCore 雙生模組化整合卡片 ---
const CombinedProjectCard = ({ project }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeData = project.subProjects[activeIndex];

  return (
    <TiltCard className="bg-white p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden text-left cursor-default rounded-[4rem]">
      
      {/* 圖片區塊 */}
      <div className="w-full md:w-[48%] flex flex-col shrink-0 relative z-30 pointer-events-auto">
        <div className="w-full rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200 relative aspect-[4/3] bg-slate-100">
          <motion.div whileHover={{ scale: 1.15, rotate: -1.5 }} transition={{ duration: 1.2, ease: "easeOut" }} className="w-full h-full relative origin-center">
            <AnimatePresence>
              <motion.img
                key={activeData.img}
                src={activeData.img}
                alt={activeData.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
            </AnimatePresence>
          </motion.div>
          <motion.div 
            key={activeData.highlightMetric}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/50 z-30 pointer-events-none"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse"></div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Impact</span>
            </div>
            <div className="font-black text-xl text-slate-900 tracking-tight">
              {activeData.highlightMetric}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* 內容區塊 */}
      <div className="flex-grow flex flex-col h-full py-2 relative z-20 w-full">
        
        {/* 頂部：標籤與切換按鈕 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-[2px] transition-all duration-500 bg-[#FF8C42]"></div>
            <span className="text-xs font-black uppercase tracking-[0.3em]">
              <span className="px-2 py-1 rounded-md bg-orange-50 text-[#FF8C42]">
                {project.tagLabel}
              </span>
            </span>
          </div>

          {/* 切換 Tab (模塊右側 Button) */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full shadow-inner border border-slate-200/50 w-fit">
            {project.subProjects.map((sub, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`relative px-4 py-2 rounded-full text-[11px] md:text-xs font-black tracking-widest uppercase transition-all duration-300 z-10 ${activeIndex === idx ? 'text-[#FF8C42]' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {activeIndex === idx && (
                  <motion.div
                    layoutId="activeCombinedTab"
                    className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.08)] -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{sub.tabLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 動態內容切換 */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeData.id} 
            initial={{ opacity: 0, x: 10 }} 
            animate={{ opacity: 1, x: 0 }} 
            exit={{ opacity: 0, x: -10 }} 
            transition={{ duration: 0.3 }} 
            className="flex flex-col h-full flex-grow"
          >
            <h3 className="font-black text-slate-900 mb-2 leading-tight hover:text-[#FF8C42] transition-colors text-left text-3xl">
              {activeData.title}
            </h3>
            
            {activeData.role && (
              <div className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-1.5">
                <Users size={14} className="text-[#FF8C42]" /> Role: {activeData.role}
              </div>
            )}
            
            <div className="flex flex-col gap-4 mb-6">
              {activeData.problem && (
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[13px] font-black text-slate-900 mb-2 flex items-center gap-1.5">
                    <Target size={14} className="text-[#FF8C42]" /> Problem / Background
                  </h4>
                  <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                    {activeData.problem}
                  </p>
                </div>
              )}
              {activeData.solution && (
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-[13px] font-black text-slate-900 mb-2 flex items-center gap-1.5">
                    <Layers size={14} className="text-[#2dd4bf]" /> Solution / Action
                  </h4>
                  <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                    {activeData.solution}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-6 border-b border-slate-50 pb-5">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Activity size={12} className="text-slate-400" /> Strategic Tags
              </div>
              <div className="flex gap-2 flex-wrap relative min-h-[40px] items-start">
                {activeData.pmDeliverables.map(d => (
                  <PlayfulDodgeTag key={d} tag={d} color="#FF8C42" />
                ))}
              </div>
            </div>
            
            <div className="space-y-3 mb-8">
              <h4 className="text-[13px] font-black text-slate-900 mb-3 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#FF8C42]" /> Impact / Result
              </h4>
              {activeData.results.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="flex gap-3 text-slate-700 items-start bg-white">
                  <CheckCircle2 size={16} className="text-[#FF8C42] shrink-0 mt-0.5" />
                  <span className="text-[13px] font-bold leading-relaxed">{r}</span>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
              <div className="flex gap-3 flex-wrap">
                {activeData.buttons.map((btn, bIdx) => (
                  <motion.a 
                    key={bIdx}
                    href={btn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black text-xs md:text-[13px] tracking-widest transition-all bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-800 hover:text-slate-900 shadow-sm hover:shadow-md"
                  >
                    {btn.icon} {btn.label}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </TiltCard>
  );
};

// --- 數據卡片 ---
const MetricCard = ({ impact, className = "" }) => {
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
      className={`relative flex flex-col h-full bg-slate-50/40 backdrop-blur-sm border border-slate-100 p-5 md:p-6 lg:p-7 rounded-[2rem] hover:border-[#FF8C42]/30 transition-all duration-500 group shadow-sm overflow-hidden pointer-events-auto ${className}`}
    >
      <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden rounded-[2rem]">
        <div 
          className="absolute inset-0 transition-opacity duration-300 mix-blend-screen"
          style={{ background: `radial-gradient(circle 260px at ${mousePos.x}px ${mousePos.y}px, rgba(255,140,66,0.18), transparent 70%)` }}
        />
        <div 
          className="absolute -inset-20 bg-gradient-to-br from-[#FF8C42]/0 via-[#FF8C42]/10 to-[#2dd4bf]/10 blur-3xl animate-pulse" 
          style={{ animationDuration: '4s' }}
        />
      </div>
      
      <div className="relative z-10 text-slate-300 mb-3 md:mb-4 group-hover:text-[#FF8C42] transition-colors duration-300 group-hover:scale-110 transform origin-left w-fit">
        <impact.icon size={28} strokeWidth={2.5} />
      </div>
      <div className="relative z-10 text-2xl lg:text-3xl font-black text-slate-900 mb-1 md:mb-2 tracking-tighter group-hover:translate-x-1 transition-transform duration-300 whitespace-nowrap">
        {impact.value}
      </div>
      <div className="relative z-10 text-xs font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3 leading-tight">
        {impact.label}
      </div>
      <div className="relative z-10 text-xs md:text-sm text-slate-500 font-medium leading-relaxed mt-auto break-words">
        {impact.desc}
      </div>
    </div>
  );
};

// --- 磁吸互動標題 ---
const MagneticHeadline = ({ mouse }) => {
  const h1Ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  
  const emojisList = ['✨', '🚀', '💡', '💻', '💙', '👀', '🎉', '🔥', '🌟', '💪', '🎯', '🪄'];
  const [bursts, setBursts] = useState([]);

  useEffect(() => {
    if (isHovered && h1Ref.current) {
      const rect = h1Ref.current.getBoundingClientRect();
      const h1CenterX = rect.left + rect.width / 2;
      const h1CenterY = rect.top + rect.height / 2;
      const dx = mouse.x - h1CenterX;
      const dy = mouse.y - h1CenterY;
      setOffset({
        x: Math.max(-8, Math.min(8, dx * 0.03)),
        y: Math.max(-4, Math.min(4, dy * 0.03))
      });
    } else {
      setOffset({ x: 0, y: 0 });
    }
  }, [mouse, isHovered]);

  useEffect(() => {
    if (isHovered) {
      const resetTimer = setTimeout(() => {
        setIsHovered(false);
      }, 3500);
      return () => clearTimeout(resetTimer);
    }
  }, [isHovered]);

  const triggerEmojiBurst = () => {
    setIsHovered(true);
    const newBursts = Array.from({ length: 9 }).map((_, i) => ({
      id: Date.now() + i,
      emoji: emojisList[Math.floor(Math.random() * emojisList.length)],
      angle: (i * (Math.PI * 2)) / 9 + (Math.random() - 0.5) * 0.5, 
      distance: 70 + Math.random() * 80, 
    }));
    setBursts(newBursts);
  };

  return (
    <div className="flex flex-col items-start mb-6 pointer-events-auto cursor-default overflow-visible text-left relative">
      <motion.h1 
        ref={h1Ref}
        onMouseEnter={triggerEmojiBurst}
        onMouseLeave={() => {}}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', stiffness: 220, damping: 25 }}
        className="text-5xl md:text-[5.5rem] lg:text-[6.5rem] font-black leading-none tracking-tighter text-slate-900 select-none relative transition-colors duration-300 flex items-center flex-wrap gap-x-4"
        style={{ 
          color: isHovered ? '#FF8C42' : '#0f172a',
          textShadow: isHovered ? '0 0 30px rgba(255, 140, 66, 0.2)' : 'none'
        }}
      >
        <span>HI, I AM <span className="italic">REN.</span></span>
        <motion.div
          animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-1.5 text-sm md:text-base text-[#FF8C42] font-black tracking-widest uppercase bg-orange-50 px-4 py-2 rounded-full border-2 border-orange-200 shadow-sm animate-bounce pointer-events-none mt-2 md:mt-0"
        >
          <MousePointer2 size={16} /> ✨ Hover Me
        </motion.div>

        <AnimatePresence>
          {isHovered && bursts.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
              animate={{
                opacity: [0, 1, 0],
                x: Math.cos(item.angle) * item.distance,
                y: Math.sin(item.angle) * item.distance,
                scale: [0.5, 1.8, 1],
                rotate: (Math.random() - 0.5) * 90
              }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl md:text-5xl pointer-events-none z-50 drop-shadow-md"
            >
              {item.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.h1>
    </div>
  );
};

// --- 常項漂浮標籤 ---
const ProfileDodgeTag = ({ tag, idx, isMobile }) => {
  const [dodgePos, setDodgePos] = useState({ x: 0, y: 0 });

  const handleHover = () => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * 20; 
    setDodgePos({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance
    });
    setTimeout(() => {
      setDodgePos({ x: 0, y: 0 });
    }, 2000);
  };

  const mobileScatterMult = isMobile ? 0.8 : 1; 

  return (
    <motion.div
      className="absolute z-30 pointer-events-auto"
      style={{ 
        top: `calc(${tag.top} * ${mobileScatterMult})`, 
        bottom: `calc(${tag.bottom} * ${mobileScatterMult})`, 
        left: `calc(${tag.left} * ${mobileScatterMult})`, 
        right: `calc(${tag.right} * ${mobileScatterMult})` 
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, x: dodgePos.x, y: dodgePos.y }}
      transition={{ 
        x: { type: "spring", stiffness: 120, damping: 15 },
        y: { type: "spring", stiffness: 120, damping: 15 },
        opacity: { duration: 0.6, delay: tag.delay }
      }}
      onMouseEnter={handleHover}
    >
      <motion.div
        animate={{ 
          y: [-8, 8, -8], 
          x: [-4, 4, -4],
          rotate: [-3, 3, -3]
        }}
        transition={{ 
          duration: 5 + (idx % 3), 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="whitespace-nowrap bg-white/85 backdrop-blur-xl border border-white/90 text-slate-800 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full text-[10px] md:text-[13px] font-black tracking-widest shadow-[0_8px_32px_rgba(0,0,0,0.12)] cursor-default transition-shadow hover:shadow-[0_12px_40px_rgba(0,0,0,0.2)]"
        style={{ borderLeft: `4px solid ${idx % 2 === 0 ? '#FF8C42' : '#2dd4bf'}` }}
      >
        {tag.text}
      </motion.div>
    </motion.div>
  );
};

// --- 頭像組件 ---
const ProfilePhoto = ({ isMobile }) => {
  const [isHovered, setIsHovered] = useState(false);
  const avatarUrl = "https://lh3.googleusercontent.com/d/1TsRwo9QiibKwW7PNCBnhPbbizfDXVaH9";

  const floatTags = [
    { text: "產品策略規劃", top: "-10%", left: "0%", delay: 0.1 },        
    { text: "數位內容營運", top: "10%", right: "-20%", delay: 0.2 },
    { text: "專案協同管理", bottom: "10%", left: "-5%", delay: 0.3 },      
    { text: "UIUX 體驗設計", bottom: "-10%", right: "-12%", delay: 0.4 },
    { text: "SEO 與數據分析", top: "45%", left: "-8%", delay: 0.5 },       
    { text: "Package 商業策略", bottom: "40%", right: "-28%", delay: 0.6 },
    { text: "Vibe Coding", top: "25%", left: "-10%", delay: 0.7 }
  ];

  return (
    <div className="z-20 pointer-events-auto relative mt-16 md:mt-0 w-full flex justify-center md:block md:w-auto">
      <div style={{ perspective: '1200px' }} className="relative">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ scale: 1.04, rotateY: 6, rotateX: -4 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="relative cursor-none z-10"
        >
          <div className="relative w-56 h-56 md:w-[26rem] md:h-[26rem] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-[4px] md:border-[6px] border-white bg-slate-100 mx-auto">
            <img src={avatarUrl} alt="Profile" className={`w-full h-full object-cover transition-transform duration-[1200ms] ${isHovered ? 'scale-105' : ''}`} />
          </div>
          
          <AnimatePresence>
            {floatTags.map((tag, idx) => (
              <ProfileDodgeTag key={idx} tag={tag} idx={idx} isMobile={isMobile} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

// --- 主程式組件 ---
const App = () => {
  const isMobile = useIsMobile();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [hoveredContact, setHoveredContact] = useState(null);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  
  useEffect(() => {
    const shareImageUrl = "https://lh3.googleusercontent.com/d/1EMGkWw1l7WfzJJ8bp7jx2oXG9P-FrR0i";
    document.title = "Ren Hao Zheng | Software Product Manager Portfolio";
    const setMeta = (property, content) => {
      let meta = document.querySelector(`meta[property='${property}']`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    setMeta('og:title', '鄭人豪 | 軟體專案經理 作品集');
    setMeta('og:description', '橫跨 UI/UX 背景，專注於軟體產品商業化與 4,000 萬大型專案落地的產品導向型 PM。');
    setMeta('og:image', shareImageUrl);
    setMeta('og:image:secure_url', shareImageUrl);
    setMeta('og:image:type', 'image/png');
    setMeta('og:image:width', '1200');
    setMeta('og:image:height', '630');
    setMeta('og:type', 'website');
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  const impactMetrics = [
    { label: "Search Success", value: "+20%", icon: Zap, desc: "重構搜尋邏輯與 IA，提升搜尋匹配效率。" },
    { label: "Operational Growth", value: "+10-25%", icon: TrendingUp, desc: "規劃核心營運模組，提升內容發現與轉換。" },
    { label: "System Delivery", value: "$40M", icon: Cpu, desc: "主導大型政府 XR 專案落地，管理開發與驗收。" }
  ];

  const reallusionBullets = [
    { icon: <Target size={18} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "商業策略", text: <>負責歐美電商平台 (ActorCore / Content Store) 之產品策略與商業化規劃，涵蓋搜尋體驗優化、資訊架構設計與內容轉換流程。</> },
    { icon: <Search size={18} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "體驗重構", text: <>分析使用者長尾搜尋行為，定義 Deep Search 產品規格。提升搜尋成功率 <span className="font-black text-slate-900 border-b-[2px] border-orange-200">20%</span> 並降低搜尋摩擦。</> },
    { icon: <Globe2 size={18} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "架構優化", text: <>規劃平台核心功能（搜尋、分類、推薦），提升內容可發現性與使用效率約 <span className="font-black text-slate-900 border-b-[2px] border-orange-200">15–25%</span>。</> },
    { icon: <Package size={18} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "定價包裝", text: <>建立商品化策略（Theme / Bundle / Motion 組合），優化產品結構與轉換流程。</> },
    { icon: <BarChart3 size={18} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "營運增長", text: <>設計營運模組 (Promotion / Offer Page)，支援行銷活動與流量轉換 (CTR 提升約 <span className="font-black text-slate-900 border-b-[2px] border-orange-200">10–15%</span>)。</> },
    { icon: <Users size={18} strokeWidth={2.2} className="text-[#FF8C42]" />, tag: "跨國協作", text: <>與海外團隊（內容製作 / 業務 / 行銷）協作，推動產品落地與全球市場策略。</> }
  ];

  const globalPowerBullets = [
    { icon: <Monitor size={18} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "0到1開發", text: <>參與 XR 模擬訓練系統（Web / Tablet / VR）之產品規劃與設計，推動產品從 0→1 開發與落地。</> },
    { icon: <LayoutTemplate size={18} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "多端架構", text: <>規劃多端產品架構，設計完整使用流程與互動機制。</> },
    { icon: <ClipboardList size={18} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "規格撰寫", text: <>撰寫產品規格 (Spec / Flow / IA)，確保跨部門開發一致性。</> },
    { icon: <ShieldCheck size={18} strokeWidth={2.2} className="text-[#2dd4bf]" />, tag: "專案交付", text: <>參與政府專案執行，主導 <span className="font-black text-slate-900 border-b-[2px] border-teal-200">4,000 萬級</span>專案，確保產品符合實際應用場景與驗收標準。</> }
  ];

  // ★ 核心專案區塊
  const projects = [
    {
      isCombined: true,
      tagLabel: 'ACTORCORE PROJECT',
      tagColor: '#FF8C42',
      tagBg: 'bg-orange-50',
      subProjects: [
        {
          id: 'actorcore-deep-search',
          title: 'Deep Search：意圖導向的搜尋體驗重構',
          tabLabel: 'Deep Search 搜尋重構',
          role: 'Content PM',
          problem: '發現平台既有的「關鍵字比對」無法處理用戶「描述句查找」的真實意圖，導致搜尋挫折感高、用戶查找成本大，流失潛在轉換。',
          solution: '主導自然語言搜尋 (Deep Search) 專案。分析使用者行為以重定義搜尋邏輯，與前後端團隊密切協作，重構從「搜尋建議」到「結果排序」的完整發現流程。',
          results: [
            '搜尋成功率顯著提升約 20%，大幅降低使用者決策成本。',
            '優化商城推薦內容結構，點擊率 (CTR) 提升約 20%。'
          ],
          img: "https://lh3.googleusercontent.com/d/18StLx2sDg3Nidzgz5RQfp9HXxoacbkt7",
          icon: Search,
          pmDeliverables: ['產品策略', '數據分析', '跨部門協作', '營運優化'],
          highlightMetric: '+20% Success',
          buttons: [
            { label: "查看商城", url: "https://actorcore.reallusion.com/3d-motion", icon: <ArrowRight size={14} /> },
            { label: "Deep Search 展示影片", url: "https://youtu.be/AM50tAZAT8s", icon: <Play size={14} fill="currentColor" /> }
          ]
        },
        {
          id: 'actorcore-module',
          title: '首頁營運模組化與轉換優化策略',
          tabLabel: 'Theme 營運模組化',
          role: 'Content PM',
          problem: '平台內容原先偏向單純的「素材陳列」，缺乏明確的主題分類導流，難以有效承接行銷活動與商業目標。',
          solution: '建立 Theme Special 營運模組，將單一素材包裝為「主題化解決方案」。規劃五大優惠分類，建立可快速替換的活動版型，打通從曝光到結帳的轉換漏斗。',
          results: [
            '促銷頁面轉換率 (Conversion Rate) 成功提升約 10-15%，增強行銷團隊營運彈性。',
            '建立多個主題商品線，大幅提升產品結構清晰度。'
          ],
          img: "https://lh3.googleusercontent.com/d/1kSLZMTtsJ7_8KpGYdkoy8LOXVNkDM_j9",
          icon: Package,
          pmDeliverables: ['產品策略', '數據分析', '跨部門協作', '營運優化'],
          highlightMetric: '+15% CVR',
          buttons: [
            { label: "查看商城", url: "https://www.reallusion.com/contentstore/category/iclone/animation/motion?nav=Top", icon: <ArrowRight size={14} /> }
          ]
        }
      ]
    },
    {
      id: 'superhero',
      title: 'Content Store 商品化策略',
      role: 'Project Manager / Content PM',
      problem: '商城需要具備高商業價值的旗艦型內容產品，以提升整體客單價，並建立品牌的技術護城河。',
      solution: '識別「高品質風格化動作」的市場缺口，主導開發規格與專案標準化流程 (SOP)。透過精準的內容包裝與跨部門協作，將設計力轉化為實質的商品化策略。',
      results: [
        '成功帶動該系列商品蟬聯商城銷售排行榜前三名，創造長尾營收。',
        '使用者內容理解時間下降（估算 20%）。',
        '商品頁轉換率提升（約 10–15%）',
      ],
      images: [
        "https://lh3.googleusercontent.com/d/1g_rcviph46Hh_fzLNZRv5MAFI-NtjbIF",
        "https://lh3.googleusercontent.com/d/11v9GiF7YCbyLUDYbkMiKpx7F72PlHF17",
        "https://lh3.googleusercontent.com/d/14jXThIInjc5XE4krE0o-V4njuUgQmmtq",
        "https://lh3.googleusercontent.com/d/1UJqsUxols3CZBErceDvCEl-4ZhEXeQvA"
      ],
      icon: Target,
      isFlagship: false,
      pmDeliverables: ['產品策略', '數據分析', '跨部門協作', '營運優化'],
      highlightMetric: 'Top 3 Sales',
      tagLabel: 'CONTENT LINE PROJECT',
      tagColor: '#2dd4bf',
      tagBg: 'bg-teal-50',
      buttons: [
        { label: "查看商城", url: "https://www.reallusion.com/contentstore/featured/superhero-motion", icon: <ArrowRight size={14} /> }
      ]
    },
    {
      id: 'police-xr',
      title: '警署 XR 模擬訓練系統 (0→1)',
      role: 'Project Manager / Product Designer',
      problem: '傳統缺乏高還原度的實境場景，且政府標案需求複雜，需在嚴格時程與技術限制下產出高擬真系統。',
      solution: '統籌 4,000 萬級標案。協作 Asian action movie stunt team 錄製高標準 Stunts，打造具備沉浸感與真實性的場景驗收細節。',
      results: [
        '完成 4,000 萬標案驗收，成功導入全台教學體系。',
        '建立可擴展 XR 訓練產品架構（支援多場景應用）',
      ],
      img: "https://lh3.googleusercontent.com/d/1OSnyyQldtfyGbqPS_d1fYWA2qpUVfzEG", 
      icon: ShieldCheck,
      isFlagship: false,
      pmDeliverables: ['專案管理', '跨部門協作', '營運優化'],
      highlightMetric: '$40M Delivered',
      tagLabel: 'GLOBAL POWER PROJECT',
      tagColor: '#64748b',
      tagBg: 'bg-slate-100',
      buttons: [
        { label: "新聞報導實錄", url: "https://youtu.be/VFtLeFSkq-Y", icon: <Play size={14} fill="currentColor" /> },
        { label: "KOL 實機展示", url: "https://youtu.be/o4sykcmklbo?t=2006", icon: <Play size={14} fill="currentColor" /> }
      ]
    },
    {
      id: 'bus-plus',
      title: 'Bus+ APP 介面重構與優化',
      role: 'UI/UX Designer',
      problem: '原 APP 介面缺乏一致性的設計規範，且部分操作流程對使用者不夠直覺，導致學習成本較高。',
      solution: '獨立完成 Design System 建置與 Prototype 製作，以服務設計思維驅動迭代，重新梳理核心使用流程。',
      results: [
        '目標受眾滿意度突破 80%。',
        '建立可擴充的 UI 元件化規範，大幅提升後續開發效率。',
        '使用流程簡化（降低查詢步驟）。',
      ],
      img: "https://lh3.googleusercontent.com/d/1GtaMd0eyQrWN2OuGyNe9RmbilG5wvv1P",
      icon: LayoutTemplate,
      isFlagship: false,
      pmDeliverables: ['體驗設計', '資訊架構', '流程優化'],
      highlightMetric: '>80% Satisfaction',
      tagLabel: 'CO-OP SIDE PROJECT',
      tagColor: '#94a3b8',
      tagBg: 'bg-slate-100',
      buttons: [
        { label: "專案介紹", url: "https://canva.link/ekmxli49aegakvj", icon: <FileText size={14} /> },
        { label: "Mockup", url: "https://www.figma.com/design/Zqj906uj1rMQpcvOwg24LE/BUS%2B_3%2F31--UI?node-id=138-1498&t=oLKIHKC0WNmUW8xu-1", icon: <PenTool size={14} /> },
        { label: "互動原型", url: "https://www.figma.com/proto/Zqj906uj1rMQpcvOwg24LE/BUS%2B_3%2F31--UI?page-id=138%3A1498&node-id=710-73139&viewport=-9828%2C1631%2C0.35&t=KCyPi9RaQar0iP42-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=710%3A73139&show-proto-sidebar=1", icon: <Navigation size={14} /> }
      ]
    }
  ];

  const skillsData = [
    {
      id: 'strategy',
      title: '產品策略與商業化規劃',
      icon: Target,
      color: '#FF8C42',
      bullets: [
        '分析使用者意圖，主導搜尋體驗與內容結構重構。',
        '撰寫產品需求文件 (PRD)，與開發團隊共同推進落地。',
        '規劃數位內容商品化策略，設計高轉換導購流程。',
        '執行數據分析與 SEO 優化，驅動平台自然流量成長。'
      ],
      tags: ['#產品策略', '#數據分析', '#搜尋優化', '#商業化', '#PRD撰寫']
    },
    {
      id: 'management',
      title: '專案管理與技術轉譯',
      icon: Users,
      color: '#2dd4bf',
      bullets: [
        '具備技術轉譯能力，縮小業務與開發間的認知偏差。',
        '主導大型政府標案進度，管理 4,000 萬級專案時程。',
        '協調跨部門資源 (設計、工程、營運)，確保專案高品質交付。',
        '平衡多方 Stakeholders 需求，制定精準開發優先順序。'
      ],
      tags: ['#專案管理', '#技術轉譯', '#資源協調', '#時程控管', '#標案管理']
    },
    {
      id: 'design',
      title: '體驗思維與流程優化',
      icon: LayoutTemplate,
      color: '#64748b', 
      bullets: [
        '以服務設計思維規劃 User Flow 與 IA 資訊架構。',
        '優化產品 UI/UX，提升使用者操作效率與留存率。',
        '執行易用性測試 (Usability Testing)，根據數據持續迭代。',
        '熟悉 Figma 等工具，支援產品設計與跨部門視覺溝通。'
      ],
      tags: ['#體驗設計', '#資訊架構', '#流程優化', '#Figma', '#設計系統']
    }
  ];

  const contactOptions = [
    {
      id: 'mail',
      title: 'Email 聯絡',
      label: 'Send Email',
      value: 'a199b5c20@gmail.com',
      icon: Mail,
      desc: '點擊發送電子郵件至 a199b5c20@gmail.com，討論軟體專案管理相關職務合作。',
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
    <div className="min-h-screen bg-white text-slate-800 font-sans relative overflow-x-hidden" style={{ cursor: isMobile ? 'auto' : 'none' }}>
      
      {/* 全域特效組件 */}
      <AestheticProgressBar />
      {!isMobile && <CustomCursor />}
      <AmbientBlobs isMobile={isMobile} />
      {!isMobile && <NeuralMeshBackground mouse={mousePos} />}
      
      {/* 導覽列 */}
      <nav className="fixed w-full bg-white/70 backdrop-blur-xl z-[100] py-4 px-8 md:px-12 flex justify-between items-center border-b border-gray-100 shadow-sm mt-1.5">
        <div 
          className="text-xl font-black tracking-tighter cursor-pointer flex items-center gap-2 pointer-events-auto group" 
          onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        >
          <div className="w-8 h-8 bg-[#FF8C42] rounded-lg flex items-center justify-center text-white font-black text-xs shadow-md transition-transform duration-300 group-hover:scale-110">
            RH
          </div>
          <span className="font-bold uppercase tracking-widest text-sm text-slate-900 transition-all duration-300 group-hover:tracking-[0.2em] group-hover:text-[#FF8C42]">
            REN <span className="text-slate-600 group-hover:text-[#FF8C42]">HAO</span>
          </span>
        </div>
        <div className="hidden md:flex space-x-10 font-bold text-xs tracking-widest uppercase items-center text-slate-500 pointer-events-auto">
          <button onClick={() => scrollTo('experience')} className="hover:text-[#FF8C42] transition-colors">EXPERIENCE</button>
          <button onClick={() => scrollTo('projects')} className="hover:text-[#FF8C42] transition-colors">PROJECTS</button>
          <button onClick={() => scrollTo('expertise')} className="hover:text-[#FF8C42] transition-colors">SKILLS</button>
          <button onClick={() => scrollTo('about')} className="border border-slate-200 text-slate-800 px-6 py-2 rounded-full hover:border-[#FF8C42] hover:text-[#FF8C42] transition-all text-xs font-black tracking-widest">CONTACT ME</button>
        </div>
      </nav>

      {/* Hero 區塊 */}
      <section id="hero" className="relative min-h-screen pt-24 pb-12 flex flex-col justify-center px-6 md:px-12 z-10 pointer-events-none text-left">
        <div className="max-w-[1300px] mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
          
          <div className="w-full md:w-[50%] flex flex-col items-start mt-8 md:mt-0">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[1px] w-10 bg-[#FF8C42]"></div>
              <div className="text-[#FF8C42] font-black text-xs tracking-[0.3em] uppercase">Content PM | 資源整合與策略型 PM</div>
            </div>
            
            <MagneticHeadline mouse={mousePos} />
            
            <div className="text-slate-500 font-medium leading-relaxed pointer-events-auto space-y-5 mb-8 max-w-2xl text-[15px] md:text-base">
              <p>
                你好，我是具備產品策略與歐美平台營運經驗的軟體專案經理。曾於 Reallusion 負責兩大素材電商之產品優化與商業化策略。我擅長透過數據分析重構搜尋體驗，並與全球開發團隊協作，確保產品交付品質。 過去我也擁有 0→1 XR 跨平台系統的建置經驗，主導政府大型標案落地。我致力於在技術限制與商業目標間精準決策，並曾主導 Bus+ App 使用體驗優化專案，具備跨領域團隊管理與 UI/UX 深度研究能力。
              </p>
            </div>

            <div className="flex gap-4 mb-10 pointer-events-auto">
              <button 
                onClick={() => scrollTo('experience')} 
                className="bg-gradient-to-r from-[#FF8C42] to-orange-400 text-white px-8 py-3.5 rounded-full font-black text-sm tracking-widest shadow-[0_8px_20px_rgba(255,140,66,0.3)] hover:shadow-[0_12px_25px_rgba(255,140,66,0.4)] hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                深入了解我 <ArrowDown size={16} />
              </button>
            </div>
            
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 w-full pointer-events-auto mb-8 pb-4 snap-x hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
              {impactMetrics.map((impact, i) => (
                <MetricCard 
                  key={i} 
                  impact={impact} 
                  className="min-w-[85%] sm:min-w-[45%] md:min-w-0 snap-center shrink-0" 
                />
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-[50%] flex justify-center md:justify-end mt-4 md:mt-0">
            <ProfilePhoto isMobile={isMobile} />
          </div>

        </div>
      </section>

      {/* Experience 區塊 */}
      <section id="experience" className="py-16 md:py-24 px-5 md:px-12 relative z-10 bg-slate-50/50 text-left">
        <div className="max-w-[1100px] mx-auto">
          
          <div className="flex items-center gap-6 mb-12 md:mb-16">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900 text-left">Career Path</h2>
            <div className="h-[2px] flex-grow bg-slate-200"></div>
          </div>
          
          <div className="space-y-8 md:space-y-10 relative before:absolute before:inset-0 before:ml-[11px] before:w-[1.5px] before:bg-gradient-to-b before:from-[#FF8C42] before:via-[#2dd4bf] before:to-transparent">
            
            {/* Reallusion Experience */}
            <motion.div whileHover={isMobile ? {} : { x: 8 }} className="relative pl-10 md:pl-16 group pointer-events-auto">
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full bg-white border-4 border-[#FF8C42] group-hover:scale-125 transition-all" />
              <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#FF8C42]/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-3 text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold">
                      <Building2 size={16} />
                      <span className="text-xs tracking-widest uppercase">Global E-commerce & SaaS</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">甲尚科技 <span className="text-[#FF8C42] text-lg font-bold italic ml-2">Reallusion</span></h3>
                  </div>
                  <span className="text-xs font-black text-[#FF8C42] bg-orange-50 px-4 py-2 rounded-full border border-orange-100 w-fit">2024.10 - Present</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-6 font-black uppercase tracking-wide text-left flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                  軟體產品經理 <span className="text-xs text-slate-400 font-medium md:border-l md:border-slate-200 md:pl-3 tracking-widest uppercase">Content Product Manager</span>
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 text-left">
                  {reallusionBullets.map((bullet, idx) => (
                    <div key={idx} className="flex flex-row gap-3 md:gap-4 items-start bg-slate-50/40 p-4 rounded-[1.25rem] hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group/item cursor-default border border-transparent hover:border-orange-100/80 h-full">
                      <div className="shrink-0 pt-0.5">
                        <div className="p-2 bg-orange-50 rounded-xl shadow-sm group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-300">
                          {bullet.icon}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-xs font-black tracking-widest text-[#FF8C42] mb-1.5 uppercase">
                          {bullet.tag}
                        </span>
                        <div className="text-slate-600 text-[13px] md:text-sm leading-relaxed font-medium">
                          {bullet.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Global Power Experience */}
            <motion.div whileHover={isMobile ? {} : { x: 8 }} className="relative pl-10 md:pl-16 group pointer-events-auto">
              <div className="absolute left-0 top-3 w-4 h-4 rounded-full bg-white border-4 border-[#2dd4bf] group-hover:scale-125 transition-all" />
              <div className="bg-white p-5 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 hover:border-[#2dd4bf]/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-3 text-left">
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-slate-400 font-bold">
                      <Building2 size={16} />
                      <span className="text-xs tracking-widest uppercase">B2B / B2G Integration</span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900">全球動力科技 <span className="text-[#2dd4bf] text-lg font-bold italic ml-2">Global Power</span></h3>
                  </div>
                  <span className="text-xs font-black text-[#2dd4bf] bg-teal-50 px-4 py-2 rounded-full border border-teal-100 w-fit">2023.05 - 2024.10</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 mb-6 font-black uppercase tracking-wide text-left flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                  專案經理 <span className="text-xs text-slate-400 font-medium md:border-l md:border-slate-300 md:pl-3 tracking-widest uppercase">Project Manager</span>
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 text-left">
                  {globalPowerBullets.map((bullet, idx) => (
                    <div key={idx} className="flex flex-row gap-3 md:gap-4 items-start bg-slate-50/40 p-4 rounded-[1.25rem] hover:bg-white hover:shadow-md hover:-translate-y-1 transition-all duration-300 group/item cursor-default border border-transparent hover:border-teal-100/80 h-full">
                      <div className="shrink-0 pt-0.5">
                        <div className="p-2 bg-teal-50 rounded-xl shadow-sm group-hover/item:scale-110 group-hover/item:-rotate-6 transition-transform duration-300">
                          {bullet.icon}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col">
                        <span className="text-xs font-black tracking-widest text-[#2dd4bf] mb-1.5 uppercase">
                          {bullet.tag}
                        </span>
                        <div className="text-slate-600 text-[13px] md:text-sm leading-relaxed font-medium">
                          {bullet.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Projects 區塊 */}
      <section id="projects" className="py-24 px-6 md:px-12 relative z-10 text-left">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="flex items-center gap-6 mb-16 text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Flagship Quests</h2>
            <div className="h-[1px] flex-grow bg-slate-100"></div>
          </div>
          
          <div className="space-y-16 pointer-events-auto">
            {projects.map((project, idx) => {
              
              // 渲染：ActorCore 雙生切換模組
              if (project.isCombined) {
                return <CombinedProjectCard key={idx} project={project} />;
              }

              // 一般專案卡片渲染
              return (
                <TiltCard 
                  key={idx} 
                  className={`bg-white p-8 md:p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col md:flex-row gap-10 items-start relative overflow-hidden text-left cursor-default
                    ${project.isFlagship ? 'rounded-[4rem]' : 'rounded-[3.5rem]'}
                  `}
                >
                  
                  {/* 專案媒體區塊 (支援輪播或單圖) */}
                  <div className="w-full md:w-[48%] flex flex-col gap-4 shrink-0 relative z-30 pointer-events-auto">
                    {project.images ? (
                      <ImageCarousel images={project.images} isFlagship={project.isFlagship} highlightMetric={project.highlightMetric} />
                    ) : (
                      <div className={`w-full rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200 relative bg-slate-100 ${project.isFlagship ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
                        
                        <motion.div whileHover={{ scale: 1.15, rotate: -1.5 }} transition={{ duration: 1.2, ease: "easeOut" }} className="w-full h-full relative origin-center">
                          <img src={project.img} alt={project.title} className="w-full h-full object-cover" />
                        </motion.div>
                        
                        <motion.div 
                          initial={{ opacity: 0, y: 15 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border border-white/50 z-30 pointer-events-none"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF8C42] animate-pulse"></div>
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Business Impact</span>
                          </div>
                          <div className={`font-black ${project.isFlagship ? 'text-xl' : 'text-lg'} text-slate-900 tracking-tight`}>
                            {project.highlightMetric}
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </div>
                  
                  {/* 專案內容 */}
                  <div className="flex-grow flex flex-col h-full py-2 relative z-20">
                    <div className="flex items-center gap-3 mb-4 text-left">
                      <div className={`w-8 h-[2px] transition-all duration-500`} style={{ backgroundColor: project.tagColor || '#cbd5e1' }}></div>
                      <span className="text-xs font-black uppercase tracking-[0.3em]">
                        <span className={`px-2 py-1 rounded-md ${project.tagBg}`} style={{ color: project.tagColor }}>
                          {project.tagLabel}
                        </span>
                      </span>
                    </div>

                    <h3 className={`font-black text-slate-900 mb-2 leading-tight group-hover:text-[#FF8C42] transition-colors text-left ${project.isFlagship ? 'text-3xl' : 'text-2xl'}`}>
                      {project.title}
                    </h3>
                    
                    {project.role && (
                      <div className="text-xs font-black text-slate-400 mb-6 uppercase tracking-widest flex items-center gap-1.5">
                        <Users size={14} className={project.isFlagship ? "text-[#FF8C42]" : "text-[#2dd4bf]"} /> Role: {project.role}
                      </div>
                    )}
                    
                    <div className="flex flex-col gap-4 mb-6">
                      {project.problem && (
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <h4 className="text-[13px] font-black text-slate-900 mb-2 flex items-center gap-1.5">
                            <Target size={14} className="text-[#FF8C42]" /> Problem / Background
                          </h4>
                          <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                            {project.problem}
                          </p>
                        </div>
                      )}
                      {project.solution && (
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                          <h4 className="text-[13px] font-black text-slate-900 mb-2 flex items-center gap-1.5">
                            <Layers size={14} className="text-[#2dd4bf]" /> Solution / Action
                          </h4>
                          <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
                            {project.solution}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mb-6 border-b border-slate-50 pb-5">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <Activity size={12} className="text-slate-400" /> Strategic Tags
                      </div>
                      <div className="flex gap-2 flex-wrap relative min-h-[40px] items-start">
                        {project.pmDeliverables.map(d => (
                          <PlayfulDodgeTag key={d} tag={d} color={project.isFlagship ? '#FF8C42' : '#2dd4bf'} />
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-8">
                      <h4 className="text-[13px] font-black text-slate-900 mb-3 flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-[#FF8C42]" /> Impact / Result
                      </h4>
                      {project.results.map((r, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -5 }} 
                          whileInView={{ opacity: 1, x: 0 }} 
                          transition={{ delay: 0.2 + i * 0.1 }} 
                          className="flex gap-3 text-slate-700 items-start bg-white"
                        >
                          <CheckCircle2 size={16} className={`${project.isFlagship ? 'text-[#FF8C42]' : 'text-slate-400'} shrink-0 mt-0.5`} />
                          <span className="text-[13px] font-bold leading-relaxed">{r}</span>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                      <div className="flex gap-3 flex-wrap">
                        {project.buttons.map((btn, bIdx) => (
                          <motion.a 
                            key={bIdx}
                            href={btn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-black text-xs md:text-[13px] tracking-widest transition-all bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-800 hover:text-slate-900 shadow-sm hover:shadow-md"
                          >
                            {btn.icon} {btn.label}
                          </motion.a>
                        ))}
                      </div>
                    </div>

                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills 區塊 */}
      <section id="expertise" className="py-24 px-6 md:px-12 bg-white relative z-10 border-t border-slate-50 text-left">
        <div className="max-w-[1200px] mx-auto">
          
          <div className="flex items-center gap-6 mb-20 text-left">
            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">Strategic Arsenal</h2>
            <div className="h-[1px] flex-grow bg-slate-200"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pointer-events-auto">
            {skillsData.map((skill, index) => (
              <div 
                key={skill.id}
                onMouseEnter={() => setHoveredSkill(skill.id)}
                onMouseLeave={() => setHoveredSkill(null)}
                className="flex flex-col bg-slate-50/40 border border-slate-100 p-8 md:p-10 rounded-[3rem] shadow-sm hover:shadow-2xl hover:bg-white transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div 
                    className="p-4 rounded-2xl bg-white shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    style={{ color: skill.color }}
                  >
                    <skill.icon size={32} strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 leading-tight">
                    {skill.title}
                  </h3>
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {skill.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={18} className="shrink-0 mt-0.5" style={{ color: skill.color, opacity: 0.8 }} />
                      <span className="text-sm font-medium text-slate-600 leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 mt-auto pt-6 border-t border-slate-200/60 relative min-h-[80px]">
                  {skill.tags.map((tag, tagIndex) => (
                    <PlayfulDodgeTag key={tagIndex} tag={tag} color={skill.color} />
                  ))}
                </div>

                <div 
                  className="absolute bottom-0 left-0 h-1.5 w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-[3rem]"
                  style={{ backgroundColor: skill.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer 區塊 */}
      <footer id="about" className="py-32 px-6 bg-white/40 backdrop-blur-xl border-t border-slate-100/50 relative overflow-hidden text-center z-10">
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 bg-slate-50 rounded-full border border-slate-100 mb-6">
               <span className="text-xs font-black text-slate-400 tracking-[0.4em] uppercase text-center">Professional Network</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 leading-tight tracking-tighter text-center">聯絡資訊</h2>
            <p className="text-slate-400 font-medium text-center">期待與您的團隊攜手合作，共同創造產品價值。</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 mb-24 pointer-events-auto">
            {contactOptions.map((opt) => (
              <motion.a
                layout 
                key={opt.id}
                href={opt.id === 'mail' ? `mailto:${opt.value}` : opt.id === 'phone' ? `tel:${opt.value}` : opt.value}
                target={opt.id === 'download' ? "_blank" : "_self"}
                onMouseEnter={() => setHoveredContact(opt.id)}
                onMouseLeave={() => setHoveredContact(null)}
                animate={{ 
                  flex: hoveredContact === opt.id ? 2.2 : 1, 
                  opacity: hoveredContact && hoveredContact !== opt.id ? 0.45 : 1, 
                  filter: hoveredContact && hoveredContact !== opt.id ? 'blur(3px)' : 'blur(0px)' 
                }}
                transition={{ type: 'spring', stiffness: 140, damping: 25 }}
                className="bg-white/60 backdrop-blur-lg p-10 rounded-[3.5rem] border border-white/60 shadow-lg hover:shadow-2xl transition-all overflow-hidden relative group cursor-pointer text-left"
              >
                <motion.div 
                  className="absolute -top-6 -right-6 w-32 h-32 opacity-05" 
                  style={{ color: opt.color }}
                  animate={hoveredContact === opt.id ? { rotate: 15, scale: 1.2, opacity: 0.15 } : { rotate: 0, scale: 1, opacity: 0.05 }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                >
                  <opt.icon size={130} strokeWidth={1} />
                </motion.div>

                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
                  style={{ background: `radial-gradient(circle at 80% 20%, ${opt.color}22 0%, transparent 60%)` }}
                />

                <div className="relative z-10 flex flex-col h-full text-left">
                  <div className="flex items-center gap-4 mb-8 text-left">
                    <motion.div 
                      className="p-4 rounded-[1.5rem] bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all" 
                      style={{ color: opt.color }}
                      animate={hoveredContact === opt.id ? { y: [0, -8, 0] } : { y: 0 }}
                      transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                    >
                      <opt.icon size={26} />
                    </motion.div>
                    <div>
                       <div className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1 text-left">{opt.title}</div>
                       <div className="text-xl font-black text-slate-900 text-left">{opt.label}</div>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-400 mb-8 leading-relaxed max-w-xs group-hover:text-slate-600 transition-colors text-left">{opt.desc}</div>
                  <div className="mt-auto text-left">
                    
                    <div className="text-[15px] font-black text-slate-800 text-left">{opt.id === 'download' ? "前往履歷雲端資料夾" : opt.value}</div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
          
          <div className="mt-32 text-xs font-black text-slate-300 tracking-[0.9em] uppercase flex flex-col items-center gap-4">
            <div className="w-12 h-[1px] bg-slate-200"></div>
            © 2026 REN HAO ZHENG · STRATEGIC PM PORTFOLIO V20.6
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default App;