import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Clock, BookOpen, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface IntroScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    title: "مرحباً بك في نِبْرَاس",
    desc: "التاريخ الإسلامي ليس مجرد نصوص، بل زمان ومكان. هنا ستعيش السيرة النبوية والتاريخ كأنك تراه.",
    icon: <Compass size={40} className="text-accent mb-4" />
  },
  {
    title: "الخريطة التفاعلية",
    desc: "شاهد اتساع رقعة الدولة الإسلامية وأماكن الغزوات والأحداث بانغماس كامل على الخريطة الجغرافية.",
    icon: <Compass size={40} className="text-emerald-500 mb-4" />
  },
  {
    title: "الخط الزمني (Timeline)",
    desc: "تتبع تسلسل الأحداث، اسحب في أسفل الشاشة لتسافر عبر الزمن من العهد المكي حتى الخلافة الراشدة.",
    icon: <Clock size={40} className="text-amber-500 mb-4" />
  },
  {
    title: "تأمل التفاصيل",
    desc: "اضغط على الحدث لتقرأ الآيات التي نزلت فيه، وتتعرف على الصحابة الذين شاركوا وصنعوا هذا التاريخ.",
    icon: <BookOpen size={40} className="text-blue-500 mb-4" />
  }
];

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<'logo' | 'choice' | 'guide'>('logo');
  const [slide, setSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const t = setTimeout(() => {
      if (isMounted) {
        setPhase('choice');
      }
    }, 2500);
    return () => {
      isMounted = false;
      clearTimeout(t);
    };
  }, []);

  const handleFinish = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div 
          key="intro-container"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-transparent overflow-hidden"
          dir="rtl"
        >
          {/* Sliding Doors */}
          <motion.div 
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-ink z-0 border-r border-accent/20"
            exit={{ x: "-100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.17, 1], delay: 0.2 }}
          />
          <motion.div 
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-ink z-0 border-l border-accent/20"
            exit={{ x: "100%" }}
            transition={{ duration: 1.2, ease: [0.77, 0, 0.17, 1], delay: 0.2 }}
          />
          
          <motion.div
            exit={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 opacity-20 pointer-events-none z-10" 
            style={{ backgroundImage: 'radial-gradient(circle at center, var(--color-accent) 0%, transparent 60%)' }} 
          />

          {phase === 'logo' && (
            <motion.div
              key="logo"
              initial={{ scale: 0.8, opacity: 0, filter: 'blur(10px)' }}
              animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(20px)' }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="text-center z-20"
            >
              <h1 className="text-7xl md:text-9xl font-bold text-parchment drop-shadow-[0_0_30px_rgba(212,175,55,0.4)] tracking-widest uppercase mb-4" style={{ fontFamily: "'Amiri', serif" }}>
                نِبْرَاس
              </h1>
            </motion.div>
          )}

          {phase === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="text-center z-20 p-6 max-w-lg"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-parchment mb-6 drop-shadow-md">مرحباً بك في رحلة عبر الزمن</h2>
              <p className="text-parchment/80 mb-10 text-lg leading-relaxed">هل تود التعرف على كيفية استخدام "نبراس" لاستكشاف التاريخ الإسلامي، أم تفضل البدء مباشرة؟</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => setPhase('guide')}
                  className="w-full sm:w-auto px-8 py-3 bg-accent text-parchment rounded-full font-bold text-lg hover:bg-accent/90 hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  الدليل التعريفي
                </button>
                <button 
                  onClick={handleFinish}
                  className="w-full sm:w-auto px-8 py-3 bg-transparent border border-parchment/30 text-parchment rounded-full font-bold hover:bg-parchment/10 transition-colors"
                >
                  الدخول للموقع
                </button>
              </div>
            </motion.div>
          )}

          {phase === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="z-20 w-full max-w-xl p-8 bg-parchment/10 backdrop-blur-md rounded-2xl border border-parchment/20 relative mx-4 text-center shadow-2xl"
            >
              <button onClick={handleFinish} className="absolute top-2 left-2 w-11 h-11 flex justify-center items-center text-parchment/50 hover:text-parchment transition shrink-0 rounded-full hover:bg-parchment/10">
                <X size={24} />
              </button>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center py-6"
                >
                  {slides[slide].icon}
                  <h3 className="text-2xl font-bold text-parchment mb-3">{slides[slide].title}</h3>
                  <p className="text-parchment/80 text-lg leading-relaxed max-w-md">{slides[slide].desc}</p>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-8">
                <div className="flex gap-2">
                  {slides.map((_, i) => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full ${i === slide ? 'bg-accent scale-125' : 'bg-parchment/30'} transition-all`} />
                  ))}
                </div>
                <div className="flex gap-3">
                  {slide > 0 && (
                    <button onClick={() => setSlide(s => s - 1)} className="w-11 h-11 flex justify-center items-center text-parchment/70 hover:text-parchment transition rounded-full hover:bg-parchment/10">
                      <ChevronRight size={24} />
                    </button>
                  )}
                  {slide < slides.length - 1 ? (
                    <button 
                      onClick={() => setSlide(s => s + 1)}
                      className="flex items-center gap-2 px-6 py-2 bg-accent/20 text-accent border border-accent/50 rounded-full hover:bg-accent hover:text-parchment transition-all font-bold"
                    >
                      التالي
                      <ChevronLeft size={18} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleFinish}
                      className="flex items-center gap-2 px-6 py-2 bg-accent text-parchment rounded-full hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold"
                    >
                      ابدأ الرحلة
                      <Play size={16} className="mr-1" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}