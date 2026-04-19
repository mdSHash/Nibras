import React, { useState } from "react";
import { EventItem } from "../data";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Info,
  BookOpen,
  Quote,
  Shield,
  Flag,
  Maximize2,
  Minimize2,
  Type,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import QuranRef from "./QuranRef";

interface EventPanelProps {
  event: EventItem | null;
  onClose: () => void;
  onCompanionClick?: (name: string) => void;
  onQuranClick?: (ref: string) => void;
}

const getEraTheme = (era?: string) => {
  if (!era) return { color: "#8b7355", title: "" }; // Default accent
  if (
    era.includes("المكي") ||
    era.includes("المدني") ||
    era.includes("الوحي") ||
    era.includes("البعثة")
  )
    return { color: "#10b981", title: "عهد النبوة" }; // Emerald / Prophet ﷺ
  if (era.includes("أبي بكر"))
    return { color: "#fbbf24", title: "خلافة الصديق" }; // Amber / Abu Bakr
  if (era.includes("عمر")) return { color: "#ef4444", title: "خلافة الفاروق" }; // Red / Umar
  if (era.includes("عثمان"))
    return { color: "#06b6d4", title: "خلافة ذو النورين" }; // Cyan / Uthman
  if (era.includes("علي"))
    return { color: "#818cf8", title: "خلافة الإمام علي" }; // Indigo / Ali
  return { color: "#8b7355", title: "" }; // Default accent
};

const getRuler = (era?: string) => {
  if (!era) return "";
  if (
    era.includes("المكي") ||
    era.includes("المدني") ||
    era.includes("الوحي") ||
    era.includes("البعثة")
  )
    return "النبي محمد ﷺ";
  if (era.includes("أبي بكر")) return "أبو بكر الصديق";
  if (era.includes("عمر")) return "عمر بن الخطاب";
  if (era.includes("عثمان")) return "عثمان بن عفان";
  if (era.includes("علي")) return "علي بن أبي طالب";
  return "";
};

export default function EventPanel({
  event,
  onClose,
  onCompanionClick,
  onQuranClick,
}: EventPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(window.innerWidth < 640);
  const [fontSizeStep, setFontSizeStep] = useState(0);

  React.useEffect(() => {
    if (event && window.innerWidth < 640) {
      setIsMinimized(true);
      setIsExpanded(false);
    } else {
      setIsMinimized(false);
      setIsExpanded(false);
    }
  }, [event?.id]);

  const increaseFont = () => setFontSizeStep((prev) => Math.min(prev + 1, 4));
  const decreaseFont = () => setFontSizeStep((prev) => Math.max(prev - 1, 0));

  const fs = (base: number) => ({ fontSize: `${base + fontSizeStep * 2}px` });

  const eraTheme = getEraTheme(event?.era);
  const ruler = getRuler(event?.era);

  return (
    <AnimatePresence>
      {event && (
        <div
          style={{ zIndex: 600 }}
          className="absolute inset-0 pointer-events-none sm:z-[600] flex justify-center items-end sm:items-start sm:justify-end"
        >
          <motion.div
            initial={{ y: "150%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "150%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`pointer-events-auto z-[800] sm:z-[600] fixed left-2 right-2 sm:left-auto sm:right-0 sm:rounded-none rounded-2xl bg-panel-bg shadow-[0_-5px_25px_rgba(0,0,0,0.3)] sm:shadow-[-5px_0_15px_rgba(0,0,0,0.1)] flex flex-col transition-all duration-300 ease-in-out border border-border-dark/20 sm:border-t-0 sm:border-y-0 sm:border-r-0 sm:border-l-2
            ${
              isMinimized
                ? "bottom-[120px] sm:bottom-[120px] top-auto h-[60px] overflow-hidden"
                : isExpanded
                  ? "top-[75px] bottom-[120px] sm:top-[80px] sm:bottom-[120px] sm:w-[600px] lg:w-[800px]"
                  : "bottom-[120px] top-auto max-h-[40vh] sm:top-[80px] sm:bottom-[120px] sm:max-h-none sm:h-auto sm:w-[380px]"
            }`}
            dir="rtl"
          >
            {/* Islamic Top Decoration border colored by Era Theme */}
            <div
              className="w-full h-3 shrink-0 opacity-90 transition-colors"
              style={{
                backgroundColor: eraTheme.color,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)",
              }}
            ></div>
            {/* Scrollable Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              <div className="p-2 sm:p-3 sticky top-0 bg-panel-bg/95 backdrop-blur-md z-20 border-b border-border-dark/10 flex items-center justify-between shadow-sm shrink-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={onClose}
                    className="p-1.5 text-ink/60 hover:text-ink hover:bg-ink/10 rounded-full transition bg-ink/5"
                    title="إغلاق"
                  >
                    <X size={20} className="sm:w-5 sm:h-5" />
                  </button>
                  {/* Title inside header on mobile when minimized */}
                  {isMinimized && (
                    <button
                      onClick={() => setIsMinimized(false)}
                      className="font-bold sm:hidden truncate px-2 text-right max-w-[200px]"
                      style={{ color: eraTheme.color, fontSize: "14px" }}
                    >
                      {event.title}
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1.5 bg-ink/5 p-1 rounded-lg">
                  <button
                    onClick={increaseFont}
                    className="hidden sm:inline-flex p-1.5 hover:bg-accent/20 rounded transition"
                    style={{ color: eraTheme.color }}
                    title="تكبير الخط"
                  >
                    <Type size={18} />{" "}
                    <span className="text-[12px] font-bold inline-block -ml-1">
                      +
                    </span>
                  </button>
                  <div
                    className="hidden sm:block w-px h-4 mx-1 border-r"
                    style={{ borderColor: `${eraTheme.color}40` }}
                  ></div>
                  <button
                    onClick={decreaseFont}
                    className="hidden sm:inline-flex p-1.5 hover:bg-accent/20 rounded transition"
                    style={{ color: eraTheme.color }}
                    title="تصغير الخط"
                  >
                    <Type size={14} />{" "}
                    <span className="text-[12px] font-bold inline-block -ml-1">
                      -
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsMinimized(!isMinimized);
                      if (isExpanded) setIsExpanded(false);
                    }}
                    className="p-1 sm:hidden flex items-center gap-1 hover:bg-accent/10 rounded transition font-bold"
                    style={{ color: eraTheme.color }}
                    title={isMinimized ? "إظهار التفاصيل" : "إخفاء التفاصيل"}
                  >
                    {isMinimized ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setIsExpanded(!isExpanded);
                      setIsMinimized(false);
                    }}
                    className="p-1 flex items-center gap-1 hover:bg-accent/10 rounded transition font-bold"
                    style={{ color: eraTheme.color }}
                    title={isExpanded ? "تصغير النافذة" : "توسيع النافذة"}
                  >
                    {isExpanded ? (
                      <Minimize2
                        size={20}
                        className="sm:w-[18px] sm:h-[18px]"
                      />
                    ) : (
                      <Maximize2
                        size={20}
                        className="sm:w-[18px] sm:h-[18px]"
                      />
                    )}
                    <span className="hidden sm:inline text-[12px]">
                      {isExpanded ? "تصغير" : "توسيع"}
                    </span>
                  </button>
                </div>
              </div>
              <div className={`${isMinimized ? "hidden" : "block"}`}>
                {/* Header */}
                <div className="px-4 sm:px-6 pt-3 pb-2 relative">
                  <div>
                    <div
                      className="flex items-center gap-1 opacity-90 font-bold"
                      style={{ ...fs(13), color: eraTheme.color }}
                    >
                      <span>{event.category} &rsaquo;</span>
                      <span>{event.era}</span>
                    </div>
                    <h2
                      className="font-bold border-b pb-3 mb-2 mt-2 leading-tight transition-colors flex flex-col gap-2"
                      style={{
                        ...fs(24),
                        color: eraTheme.color,
                        borderColor: eraTheme.color,
                      }}
                    >
                      <span>{event.title}</span>
                      {ruler && (
                        <span
                          className="text-[13px] font-bold opacity-80 flex items-center gap-1.5"
                          style={{ color: eraTheme.color }}
                        >
                          <Shield size={14} />
                          الحاكم في هذا العهد: {ruler}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                <div className="px-4 sm:px-6 pb-6 space-y-6 mt-2">
                  {/* Description */}
                  <section>
                    <p
                      className="text-ink leading-[1.85] text-justify font-medium"
                      style={fs(15)}
                    >
                      {event.details.full_description}
                    </p>
                  </section>

                  {/* Course of Events (Steps) */}
                  {event.details.course_of_events &&
                    event.details.course_of_events.length > 0 && (
                      <section className="bg-ink/5 p-5 rounded-lg border border-border-dark/10 relative overflow-hidden shadow-inner">
                        {/* Decorative corners */}
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent opacity-20"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-accent opacity-20"></div>

                        <h3
                          className="flex items-center gap-2 text-battle-red font-bold mb-4"
                          style={fs(16)}
                        >
                          <Flag size={18} className="shrink-0" /> تسلسل الأحداث
                        </h3>
                        <div className="space-y-4">
                          {event.details.course_of_events.map((step, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div
                                className="w-7 h-7 shrink-0 rounded-full bg-accent text-parchment flex justify-center items-center font-bold shadow-sm"
                                style={fs(12)}
                              >
                                {idx + 1}
                              </div>
                              <p
                                className="text-ink/80 leading-relaxed pt-0.5"
                                style={fs(14)}
                              >
                                {step}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                  {/* Meta Grid */}
                  <div
                    className={`grid ${isExpanded ? "grid-cols-4" : "grid-cols-2"} gap-3`}
                  >
                    <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                      <span
                        className="block text-accent font-bold mb-1"
                        style={fs(12)}
                      >
                        التاريخ الهجري
                      </span>
                      <span style={fs(13)}>{event.date.hijri_relative}</span>
                    </div>
                    <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                      <span
                        className="block text-accent font-bold mb-1"
                        style={fs(12)}
                      >
                        التاريخ الميلادي
                      </span>
                      <span style={fs(13)}>{event.date.gregorian} م</span>
                    </div>
                    {event.details.army_size && (
                      <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                        <span
                          className="block text-accent font-bold mb-1"
                          style={fs(12)}
                        >
                          جيش المسلمين
                        </span>
                        <span style={fs(13)}>{event.details.army_size}</span>
                      </div>
                    )}
                    {event.details.enemy_army_size && (
                      <div className="bg-card-bg p-3 rounded-lg border border-border-dark/10 shadow-sm">
                        <span
                          className="block text-accent font-bold mb-1"
                          style={fs(12)}
                        >
                          العدو
                        </span>
                        <span style={fs(13)}>
                          {event.details.enemy_army_size}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Companions and Roles */}
                  {event.details.companion_roles &&
                    event.details.companion_roles.length > 0 && (
                      <section className="mt-8 border-t border-border-dark/20 pt-6">
                        <h3
                          className="flex items-center gap-2 text-accent font-bold mb-4"
                          style={fs(16)}
                        >
                          <Shield size={18} className="shrink-0" /> أدوار
                          الصحابة والشخصيات البارزة
                        </h3>
                        <div
                          className={`grid ${isExpanded ? "grid-cols-2" : "grid-cols-1"} gap-3`}
                        >
                          {event.details.companion_roles.map((comp, idx) => (
                            <div
                              key={idx}
                              className="bg-card-bg p-4 rounded-xl border border-border-dark/10 flex flex-col gap-2 transition-colors hover:border-accent/40 shadow-sm group"
                            >
                              <button
                                onClick={() =>
                                  onCompanionClick &&
                                  onCompanionClick(comp.name)
                                }
                                className="font-bold text-islamic-green group-hover:text-accent w-fit text-right"
                                style={fs(15)}
                              >
                                {comp.name}
                              </button>
                              <p
                                className="text-ink/80 leading-relaxed"
                                style={fs(13)}
                              >
                                {comp.role_in_event}
                              </p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                  {/* Other Key Figures */}
                  {event.entities?.key_figures &&
                    event.entities.key_figures.length > 0 && (
                      <section className="mt-5">
                        <span
                          className="block text-accent font-bold mb-3"
                          style={fs(14)}
                        >
                          شخصيات أخرى
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {event.entities.key_figures.map((fig, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                onCompanionClick && onCompanionClick(fig)
                              }
                              className="bg-ink/5 text-ink outline-none hover:bg-accent hover:text-parchment border border-border-dark/20 px-3 py-1.5 rounded-full transition-colors"
                              style={fs(13)}
                            >
                              {fig}
                            </button>
                          ))}
                        </div>
                      </section>
                    )}

                  {/* Map Location fallback to meta item layout */}
                  <div className="bg-card-bg p-4 rounded-lg border border-border-dark/10 mt-6 flex items-start gap-3 shadow-sm">
                    <MapPin
                      size={20}
                      className="text-battle-red shrink-0 mt-0.5"
                    />
                    <div>
                      <span
                        className="block text-accent font-bold mb-1"
                        style={fs(14)}
                      >
                        الموقع الجغرافي للحدث
                      </span>
                      <p className="text-ink/80 leading-relaxed" style={fs(14)}>
                        {event.location.name}
                      </p>
                    </div>
                  </div>

                  {/* References */}
                  {event.entities?.quran_refs?.length ||
                  event.entities?.hadith_refs?.length ||
                  event.entities?.sources?.length ? (
                    <section className="bg-ink text-parchment p-6 rounded-xl shadow-inner mt-6 border border-border-dark/50 relative overflow-hidden">
                      {/* Decorative Pattern background inside references */}
                      <div
                        className="absolute inset-0 opacity-5 pointer-events-none"
                        style={{
                          backgroundImage:
                            "radial-gradient(#8b6b4a 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                        }}
                      ></div>

                      <h3
                        className="flex items-center gap-2 font-bold mb-5 text-accent border-b border-parchment/10 pb-3"
                        style={fs(16)}
                      >
                        <BookOpen size={18} /> المصادر الإسلامية الموثقة
                      </h3>
                      <div className="space-y-6 relative z-10">
                        {event.entities?.quran_refs?.length ? (
                          <div>
                            <span
                              className="block text-parchment/60 font-bold mb-3 uppercase tracking-wider"
                              style={fs(12)}
                            >
                              آيات قرآنية نزلت في الحدث
                            </span>
                            {event.entities.quran_refs.map((ref, idx) => (
                              <div key={`q-${idx}`} style={fs(13)}>
                                <QuranRef
                                  reference={ref}
                                  onClick={onQuranClick}
                                />
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {event.entities?.hadith_refs?.length ? (
                          <div>
                            <span
                              className="block text-parchment/60 font-bold mb-2 uppercase tracking-wider"
                              style={fs(12)}
                            >
                              أحاديث نبوية دالة
                            </span>
                            {event.entities.hadith_refs.map((ref, idx) => (
                              <div
                                key={`h-${idx}`}
                                className="text-parchment italic flex items-start gap-2 mb-2"
                              >
                                <Quote
                                  size={14}
                                  className="shrink-0 mt-1 text-accent opacity-50"
                                />
                                <span style={fs(13)}>{ref}</span>
                              </div>
                            ))}
                          </div>
                        ) : null}

                        {event.entities?.sources?.length ? (
                          <div>
                            <span
                              className="block text-parchment/60 font-bold mb-3 uppercase tracking-wider"
                              style={fs(12)}
                            >
                              سيرة وتاريخ (أهل السنة والجماعة)
                            </span>
                            {event.entities.sources.map((src, idx) => (
                              <div
                                key={`s-${idx}`}
                                className="flex items-start gap-2 mb-3"
                              >
                                <span
                                  className="text-accent mt-0.5"
                                  style={fs(14)}
                                >
                                  •
                                </span>
                                <a
                                  href={`https://shamela.ws/search?q=${encodeURIComponent(src.split(" - ")[0])}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-parchment/80 hover:text-accent underline underline-offset-4 decoration-accent/30 transition-colors"
                                  title="البحث عن المصدر في المكتبة الشاملة"
                                  style={fs(13)}
                                >
                                  {src}
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </section>
                  ) : null}

                  {/* Padding at bottom for scroll */}
                  <div className="h-6"></div>
                </div>
              </div>{" "}
              {/* Closes the isMinimized block */}
            </div>{" "}
            {/* Closes flex-1 */}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
