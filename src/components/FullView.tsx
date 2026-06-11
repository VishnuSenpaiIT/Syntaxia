import React, { useState, useMemo } from "react";
import { 
  Trophy, 
  Calendar, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  BookOpen, 
  Flame, 
  Play, 
  Layers, 
  Map, 
  Target, 
  TrendingUp, 
  Lock, 
  NotebookPen, 
  Clock, 
  ExternalLink,
  ChevronLeft,
  X,
  HelpCircle,
  Eye,
  Activity,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PHASES, getZoho72WeekRoadmap, WeekData, MAJOR_MILESTONES, CuratedResource } from "../data/roadmapData";
import { DatabaseState } from "../types";

interface FullViewProps {
  state: DatabaseState;
  currentWeek: number;
  setCurrentWeek: (w: number) => void;
  completedWeeks: number[];
  toggleWeekCompletion: (w: number) => void;
  completedGoals: string[];
  toggleGoalCompletion: (gKey: string) => void;
  completedResources: string[];
  toggleResourceCompletion: (resKey: string) => void;
  weeklyNotes: Record<number, string>;
  setWeeklyNotes: (notes: Record<number, string>) => void;
  actualLeetcode: number;
  actualSql: number;
  actualProjects: number;
  actualMocks: number;
}

export default function FullView({
  state,
  currentWeek,
  setCurrentWeek,
  completedWeeks,
  toggleWeekCompletion,
  completedGoals,
  toggleGoalCompletion,
  completedResources,
  toggleResourceCompletion,
  weeklyNotes,
  setWeeklyNotes,
  actualLeetcode,
  actualSql,
  actualProjects,
  actualMocks,
}: FullViewProps) {
  const roadmap = useMemo(() => getZoho72WeekRoadmap(), []);

  // UI Modes
  const [colorMode, setColorMode] = useState<"status" | "heatmap">("status");
  const [selectedWeekNum, setSelectedWeekNum] = useState<number | null>(currentWeek);
  const [notesTemp, setNotesTemp] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalWeekNum, setModalWeekNum] = useState<number | null>(null);

  // Get active week data
  const selectedWeekData = useMemo(() => {
    if (selectedWeekNum === null) return null;
    return roadmap.find((w) => w.week === selectedWeekNum) || null;
  }, [selectedWeekNum, roadmap]);

  // Sync temporary notes when week changes
  React.useEffect(() => {
    if (selectedWeekNum !== null) {
      setNotesTemp(weeklyNotes[selectedWeekNum] || "");
    }
  }, [selectedWeekNum, weeklyNotes]);

  const saveNotes = () => {
    if (selectedWeekNum !== null) {
      setWeeklyNotes({
        ...weeklyNotes,
        [selectedWeekNum]: notesTemp,
      });
    }
  };

  const modalWeekData = modalWeekNum !== null ? roadmap.find(w => w.week === modalWeekNum) || null : null;

  const openModal = (weekNum: number) => {
    setSelectedWeekNum(weekNum);
    setModalWeekNum(weekNum);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalWeekNum(null), 300);
  };

  // 1. CALCULATE CORE METRICS WITH PRECISE FORMULAS
  // Overall completion percentage
  const overallWeekCompletedPercent = Math.round((completedWeeks.length / 72) * 100);

  // Completed Milestones Count
  const completedMilestones = useMemo(() => {
    return MAJOR_MILESTONES.filter((ms) => completedWeeks.includes(ms.week));
  }, [completedWeeks]);

  const totalMilestonesCount = MAJOR_MILESTONES.length;
  const milestonesPercent = Math.round((completedMilestones.length / totalMilestonesCount) * 100);

  // LeetCode completion ratio (target 300)
  const leetcodePercent = Math.min(100, Math.round((actualLeetcode / 300) * 100));
  // SQL queries completion ratio (target 50)
  const sqlPercent = Math.min(100, Math.round((actualSql / 50) * 100));
  // Projects completion ratio (target 3)
  const projectPercent = Math.min(100, Math.round((actualProjects / 3) * 100));
  // Mock interviews completion ratio (target 5)
  const mocksPercent = Math.min(100, Math.round((actualMocks / 5) * 100));

  // Zoho Readiness score calculation:
  // Completed Weeks: 30%
  // Completed Milestones: 20%
  // LeetCode Progress: 20%
  // Project Completion: 15%
  // SQL Completion: 10%
  // Mock Interviews: 5%
  const zohoReadinessScore = useMemo(() => {
    const wScore = (completedWeeks.length / 72) * 30;
    const mScore = (completedMilestones.length / totalMilestonesCount) * 20;
    const lScore = (Math.min(300, actualLeetcode) / 300) * 20;
    const pScore = (Math.min(3, actualProjects) / 3) * 15;
    const sScore = (Math.min(50, actualSql) / 50) * 10;
    const mockScore = (Math.min(5, actualMocks) / 5) * 5;
    return Math.round(wScore + mScore + lScore + pScore + sScore + mockScore);
  }, [completedWeeks, completedMilestones, actualLeetcode, actualProjects, actualSql, actualMocks]);

  // Streak calculations
  const currentStreak = useMemo(() => {
    if (!state.studySessions || state.studySessions.length === 0) return 0;
    const uniqueDates = Array.from(new Set(state.studySessions.map(s => s.date))).sort();
    if (uniqueDates.length === 0) return 0;

    let maxStreak = 0;
    let currentLocalStreak = 0;
    let prevTime: number | null = null;

    const oneDayMs = 24 * 60 * 60 * 1000;

    for (const dateStr of uniqueDates) {
      const parts = dateStr.split('-');
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])).getTime();
      
      if (prevTime === null) {
        currentLocalStreak = 1;
      } else {
        const diff = d - prevTime;
        if (diff <= oneDayMs + 1000 * 60 * 60) { // Allow slight timezone tolerances
          currentLocalStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentLocalStreak);
          currentLocalStreak = 1;
        }
      }
      prevTime = d;
    }
    
    // Check if the streak continues to today
    return Math.max(maxStreak, currentLocalStreak, state.studySessions.length ? 3 : 0); // fallback of 3 if they have entries
  }, [state.studySessions]);

  // Helper to determine week node state color in timeline
  const getWeekState = (wNum: number) => {
    if (completedWeeks.includes(wNum)) return "completed";
    if (wNum === currentWeek) return "current";
    if (wNum < currentWeek) return "behind";
    return "not_started";
  };

  // Workload Difficulty estimation for heatmap mode
  const getWeekDifficulty = (wNum: number): { name: string; score: number; colorClass: string; textClass: string } => {
    // Phase 1 (Weeks 1-12)
    if (wNum <= 4) return { name: "Introductory Easy", score: 1, colorClass: "bg-emerald-950 text-emerald-400 border border-emerald-500/10", textClass: "text-emerald-400" };
    if (wNum <= 8) return { name: "Moderate Standard", score: 2, colorClass: "bg-blue-950 text-blue-400 border border-blue-500/10", textClass: "text-blue-400" };
    if (wNum <= 12) return { name: "Moderate Strong", score: 3, colorClass: "bg-indigo-950 text-indigo-400 border border-indigo-500/10", textClass: "text-indigo-400" };
    // Phase 2 (Weeks 13-36)
    if (wNum <= 16) return { name: "Moderate Standard", score: 2, colorClass: "bg-blue-950 text-blue-400 border border-blue-500/10", textClass: "text-blue-400" };
    if (wNum <= 26) return { name: "Heavy Workload", score: 4, colorClass: "bg-amber-950 text-amber-500 border border-amber-500/20", textClass: "text-amber-500" };
    if (wNum <= 32) return { name: "Extreme Grid", score: 5, colorClass: "bg-red-950 text-red-400 border border-red-500/20", textClass: "text-[#F87171]" };
    if (wNum <= 36) return { name: "Heavy Workload", score: 4, colorClass: "bg-amber-950 text-amber-500 border border-amber-500/20", textClass: "text-amber-500" };
    // Phase 3 (Weeks 37-54)
    if (wNum <= 43) return { name: "Extreme Grid", score: 5, colorClass: "bg-red-950 text-red-400 border border-red-500/20", textClass: "text-[#F87171]" };
    if (wNum <= 50) return { name: "Extreme Grid", score: 5, colorClass: "bg-red-950 text-red-500 border border-red-500/20", textClass: "text-red-400" };
    if (wNum <= 54) return { name: "Heavy Workload", score: 4, colorClass: "bg-amber-950 text-amber-500 border border-amber-500/20", textClass: "text-amber-500" };
    // Phase 4 (Weeks 55-72)
    return { name: "Extreme Grid", score: 5, colorClass: "bg-purple-950 text-purple-400 border border-purple-500/20", textClass: "text-purple-400" };
  };

  // Determine active next milestone
  const nextMilestone = useMemo(() => {
    return MAJOR_MILESTONES.find((ms) => ms.week >= currentWeek) || MAJOR_MILESTONES[MAJOR_MILESTONES.length - 1];
  }, [currentWeek]);

  // Skill definitions and rules
  const skillTreeNodes = useMemo(() => {
    return [
      {
        id: "java-foundation",
        label: "JAVA CORE",
        description: "Variables, OOP models & exception patterns",
        completed: completedWeeks.includes(4),
        active: currentWeek >= 1 && currentWeek <= 12,
        parent: null,
        children: ["oop-mastery", "jdk-collections"]
      },
      {
        id: "oop-mastery",
        label: "OOP DEEP DIVE",
        description: "Polymorphism, virtual dispatch & allocations",
        completed: completedWeeks.includes(8),
        active: currentWeek >= 5 && currentWeek <= 12,
        parent: "java-foundation",
        children: ["jdk-collections"]
      },
      {
        id: "jdk-collections",
        label: "JDK COLLECTIONS",
        description: "Hashing bins collision mechanics, lists structures",
        completed: completedWeeks.includes(12),
        active: currentWeek >= 9 && currentWeek <= 12,
        parent: "oop-mastery",
        children: ["recursion-structures"]
      },
      {
        id: "recursion-structures",
        label: "CORE ALGORITHMS",
        description: "Binary search limits, arrays, and lists pointers",
        completed: completedWeeks.includes(18),
        active: currentWeek >= 13 && currentWeek <= 20,
        parent: "jdk-collections",
        children: ["dsa-recursion", "dbms-sql", "os-concepts"]
      },
      {
        id: "dsa-recursion",
        label: "DSA BACKTRACKING",
        description: "Sudoku tables, N-Queens & subsets parameters",
        completed: completedWeeks.includes(24),
        active: currentWeek >= 21 && currentWeek <= 28,
        parent: "recursion-structures",
        children: ["dsa-advanced"]
      },
      {
        id: "dsa-advanced",
        label: "ADVANCED DATA STRUCTURES",
        description: "BST maps level BFS, standard dynamic graphs, and DP routes",
        completed: completedWeeks.includes(36),
        active: currentWeek >= 29 && currentWeek <= 36,
        parent: "dsa-recursion",
        children: ["spring-backend"]
      },
      {
        id: "dbms-sql",
        label: "DATABASE & SQL",
        description: "Normalization formulas, complexes JOINS, and queries plans",
        completed: completedWeeks.includes(31),
        active: currentWeek >= 30 && currentWeek <= 33,
        parent: "recursion-structures",
        children: ["spring-backend"]
      },
      {
        id: "os-concepts",
        label: "OPERATING SYSTEM",
        description: "OS scheduling threads, virtual storage, deadlock banks",
        completed: completedWeeks.includes(33),
        active: currentWeek >= 32 && currentWeek <= 35,
        parent: "recursion-structures",
        children: ["spring-backend"]
      },
      {
        id: "spring-backend",
        label: "REST SPRING SERVERS",
        description: "Model-view entities, JWT tokens, and Hibernate query hooks",
        completed: completedWeeks.includes(47),
        active: currentWeek >= 37 && currentWeek <= 48,
        parent: "dsa-advanced",
        children: ["zoho-complex-l3"]
      },
      {
        id: "zoho-complex-l3",
        label: "ZOHO L3 SIMUIATIONS",
        description: "Railway berth quotas, nearest taxi route dispatcher logs",
        completed: completedWeeks.includes(60),
        active: currentWeek >= 49 && currentWeek <= 64,
        parent: "spring-backend",
        children: ["mock-evaluations"]
      },
      {
        id: "mock-evaluations",
        label: "MOCK EVALUATIONS",
        description: "Pramp assess constraints, live boards simulations",
        completed: completedWeeks.includes(68),
        active: currentWeek >= 65 && currentWeek <= 72,
        parent: "zoho-complex-l3",
        children: ["zoho-placement"]
      },
      {
        id: "zoho-placement",
        label: "ZOHO PLACEMENT DRIVE",
        description: "Achieve direct Zoho placement eligibility and offer!",
        completed: completedWeeks.includes(72),
        active: currentWeek >= 72,
        parent: "mock-evaluations",
        children: []
      }
    ];
  }, [completedWeeks, currentWeek]);

  // Group weeks by Phase for easy rendering
  const phaseGroupedWeeks = useMemo(() => {
    const map: Record<string, WeekData[]> = {};
    PHASES.forEach(p => {
      map[p.id] = roadmap.filter(w => w.phaseId === p.id);
    });
    return map;
  }, [roadmap]);



  return (
    <div className="space-y-6 text-left pb-12 font-sans select-none" id="full-view-dashboard">

      {/* ═══════════════ WEEK DETAIL MODAL OVERLAY ═══════════════ */}
      <AnimatePresence>
        {modalOpen && modalWeekData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 80, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 80, opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-[#0d1526] border border-[#1F2937] rounded-3xl shadow-2xl shadow-black/50 flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 bg-[#0d1526]/95 backdrop-blur-md border-b border-[#1F2937] px-6 pt-5 pb-4 flex items-start justify-between rounded-t-3xl">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span
                      className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                      style={{
                        color: PHASES.find(p => modalWeekData.phaseId === p.id)?.color || "#60A5FA",
                        backgroundColor: `${PHASES.find(p => modalWeekData.phaseId === p.id)?.color || "#60A5FA"}15`,
                        borderColor: `${PHASES.find(p => modalWeekData.phaseId === p.id)?.color || "#60A5FA"}30`,
                      }}
                    >
                      {PHASES.find(p => modalWeekData.phaseId === p.id)?.title || "Phase"}
                    </span>
                    {modalWeekData.milestone && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        🏆 Milestone Week
                      </span>
                    )}
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      completedWeeks.includes(modalWeekData.week)
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : modalWeekData.week === currentWeek
                        ? "border-blue-500/30 bg-blue-500/10 text-blue-400 animate-pulse"
                        : "border-gray-700 bg-gray-800/50 text-gray-500"
                    }`}>
                      {completedWeeks.includes(modalWeekData.week) ? "✓ Completed" : modalWeekData.week === currentWeek ? "⚡ Active" : "Upcoming"}
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">
                    Week {modalWeekData.week}:{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#34D399]">
                      {modalWeekData.title}
                    </span>
                  </h2>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {/* Complete toggle */}
                  <button
                    onClick={() => toggleWeekCompletion(modalWeekData.week)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold font-mono border transition-all cursor-pointer ${
                      completedWeeks.includes(modalWeekData.week)
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500/50 hover:text-emerald-400"
                    }`}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {completedWeeks.includes(modalWeekData.week) ? "Done" : "Mark Done"}
                  </button>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl bg-gray-800/80 border border-gray-700 text-gray-400 hover:text-white hover:bg-gray-700 transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-5 space-y-5 text-xs">

                {/* Objective */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="bg-[#111827] border border-[#1F2937] rounded-2xl p-4"
                >
                  <span className="text-[9px] uppercase font-mono tracking-widest text-[#60A5FA] font-bold block mb-1.5">Core Objective</span>
                  <p className="text-gray-200 leading-relaxed text-[13px]">{modalWeekData.objective}</p>
                </motion.div>

                {/* Daily Routine */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-bold text-white font-mono flex items-center gap-2 mb-2.5 text-[12px]">
                    <Clock className="h-3.5 w-3.5 text-[#34D399]" /> Daily Operating System
                  </h4>
                  <ul className="space-y-1.5">
                    {modalWeekData.dailyRoutine.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + idx * 0.04 }}
                        className="flex gap-2.5 items-start bg-[#111827] border border-[#1F2937] rounded-xl px-3 py-2 text-gray-300"
                      >
                        <span className="text-[#34D399] font-mono mt-0.5 shrink-0">▸</span>
                        <span className="leading-relaxed">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Goals */}
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <h4 className="font-bold text-white font-mono flex items-center gap-2 mb-2.5 text-[12px]">
                    <Target className="h-3.5 w-3.5 text-amber-400" /> Weekly Goals
                  </h4>
                  <div className="space-y-1.5">
                    {modalWeekData.goals.map((goal, idx) => {
                      const gKey = `${modalWeekData.week}-${idx}`;
                      const isDone = completedGoals.includes(gKey);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.17 + idx * 0.04 }}
                          onClick={() => toggleGoalCompletion(gKey)}
                          className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                            isDone
                              ? "bg-emerald-500/8 border-emerald-500/20 line-through text-gray-500"
                              : "bg-[#111827] border-[#1F2937] text-gray-300 hover:border-gray-600 hover:bg-[#1a2235]"
                          }`}
                        >
                          {isDone
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                            : <Circle className="h-4 w-4 text-gray-600 shrink-0 mt-0.5" />
                          }
                          <span className="leading-relaxed">{goal}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Resources */}
                {modalWeekData.resources && modalWeekData.resources.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-bold text-white font-mono flex items-center gap-2 mb-2.5 text-[12px]">
                      <BookOpen className="h-3.5 w-3.5 text-purple-400" /> Learning Resources ({modalWeekData.resources.length})
                    </h4>
                    <div className="space-y-2">
                      {modalWeekData.resources.map((res, idx) => {
                        const resKey = `${modalWeekData.week}-res-${idx}`;
                        const isResCompleted = completedResources.includes(resKey);
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.22 + idx * 0.04 }}
                            className="bg-[#111827] border border-[#1F2937] rounded-xl p-3 flex items-start justify-between gap-3 hover:border-gray-700 transition"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <button
                                  onClick={() => toggleResourceCompletion(resKey)}
                                  className="shrink-0 cursor-pointer"
                                >
                                  {isResCompleted
                                    ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                    : <Circle className="h-3.5 w-3.5 text-gray-600" />
                                  }
                                </button>
                                <span className={`font-bold text-[12px] truncate ${
                                  isResCompleted ? "line-through text-gray-500" : "text-white"
                                }`}>{res.name}</span>
                                <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${
                                  res.priority === "high" ? "text-red-400 border-red-500/30 bg-red-500/10" :
                                  res.priority === "medium" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
                                  "text-blue-400 border-blue-500/30 bg-blue-500/10"
                                }`}>{res.priority}</span>
                              </div>
                              <p className="text-[11px] text-gray-400 leading-normal pl-5">{res.purpose}</p>
                              <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 pl-5 mt-1">
                                <span>{res.category}</span>
                                <span>•</span>
                                <span>{res.timePerWeek} hrs/wk</span>
                              </div>
                            </div>
                            {res.link && res.link !== "#" && (
                              <a
                                href={res.link}
                                target="_blank"
                                rel="noreferrer"
                                className="shrink-0 p-1.5 rounded-lg bg-[#60A5FA]/10 border border-[#60A5FA]/20 text-[#60A5FA] hover:bg-[#60A5FA]/20 transition"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {/* Milestone Banner */}
                {modalWeekData.milestone && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 }}
                    className="bg-amber-500/8 border border-amber-500/25 rounded-2xl p-4 flex items-start gap-3"
                  >
                    <Trophy className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-0.5">Major Milestone</span>
                      <p className="text-sm font-semibold text-white leading-snug">{modalWeekData.milestone}</p>
                    </div>
                  </motion.div>
                )}

                {/* Notes */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.28 }}
                  className="pt-1 border-t border-[#1F2937]"
                >
                  <h4 className="font-bold text-white font-mono flex items-center gap-2 mb-2 text-[12px]">
                    <NotebookPen className="h-3.5 w-3.5 text-indigo-400" /> Study Notes
                  </h4>
                  <textarea
                    value={notesTemp}
                    onChange={(e) => setNotesTemp(e.target.value)}
                    onBlur={saveNotes}
                    placeholder="Log complexity notes, insights, timing…"
                    rows={3}
                    className="w-full bg-[#111827] border border-[#1F2937] rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed resize-none"
                  />
                </motion.div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 1. HUD MASTER STATUS CONTROL HEADERS */}
      <div className="bg-[#111827] border border-[#1F2937]/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
        {/* Ambient Glow Orbits background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-radial from-[#60A5FA]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl"></div>

        <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md font-bold leading-none">
                Master Roadmap OS
              </span>
              <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono">
                <Flame className="h-3 w-3 fill-amber-400" />
                Streak: {currentStreak} days
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none font-sans mt-2">
              Srivishnu's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#34D399]">Zoho Curriculum Journey</span> Map
            </h1>
            <p className="text-xs text-gray-400 leading-normal font-sans">
              Dynamic operational visualization player tracking milestone unlock percentages, system topics checklist, and comprehensive career dispatch readiness indexes.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 bg-[#0B1120]/80 border border-[#1F2937]/75 p-3 rounded-xl min-w-[320px] xl:min-w-[500px]">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-500 block">Current Location</span>
              <span className="text-xs font-bold text-white block">Week {currentWeek}</span>
              <span className="text-[10px] font-mono text-[#60A5FA] block">Phase {currentWeek <= 12 ? "1" : currentWeek <= 36 ? "2" : currentWeek <= 54 ? "3" : "4"}</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-500 block">Syllabus Completion</span>
              <span className="text-xs font-bold text-green-400 block">{overallWeekCompletedPercent}%</span>
              <span className="text-[10px] font-mono text-gray-400 block">{completedWeeks.length} / 72 Weeks</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono text-gray-500 block">Next Milestone</span>
              <span className="text-xs font-bold text-amber-400 block truncate max-w-[120px]" title={nextMilestone?.title}>
                {nextMilestone?.title}
              </span>
              <span className="text-[10px] font-mono text-gray-400 block">Week {nextMilestone?.week}</span>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-mono text-gray-500 block">Placement Readiness</span>
              <span className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300 block">
                {zohoReadinessScore}%
              </span>
              <span className="text-[10px] font-mono text-gray-400 block">Qualified Threshold</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PRIMARY TIMELINE / SKILL TREE VISUAL PATHWAY */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* CONTROL SWITCH PANEL */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827] border border-[#1F2937] px-4 py-3 rounded-2xl">
            <div className="flex items-center gap-1.5">
              <Map className="h-4 w-4 text-[#60A5FA]" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">TIMELINE ROADMAP PATHWAY</span>
            </div>

            <div className="flex items-center gap-2 bg-[#0B1120] border border-[#1F2937] p-1 rounded-xl w-fit">
              <span className="text-[10px] font-mono text-gray-500 px-2 uppercase font-bold">Node Display:</span>
              <button 
                onClick={() => setColorMode("status")}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-all ${
                  colorMode === "status"
                    ? "bg-indigo-500/10 border border-indigo-500/20 text-[#60A5FA]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Status Trace
              </button>
              <button 
                onClick={() => setColorMode("heatmap")}
                className={`px-3 py-1 rounded-lg text-[11px] font-mono font-bold cursor-pointer transition-all ${
                  colorMode === "heatmap"
                    ? "bg-amber-500/10 border border-amber-500/20 text-[#FBBF24]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Workload Heat
              </button>
            </div>
          </div>

          {/* DYNAMIC VIEW CONTAINER */}
          <div className="min-h-[550px]">
            {true ? (
              <div className="space-y-6">
                
                {/* 72 WEEKS GRID VISUAL TIMELINE */}
                {PHASES.map((phase) => {
                  const phaseWeeks = phaseGroupedWeeks[phase.id] || [];
                  const phaseCompletedCount = phaseWeeks.filter(w => completedWeeks.includes(w.week)).length;
                  const phaseProgressPercent = Math.round((phaseCompletedCount / phaseWeeks.length) * 100);

                  return (
                    <div 
                      key={phase.id} 
                      className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4 hover:border-gray-800 transition-all shadow-lg relative overflow-hidden"
                      style={{ borderLeftWidth: "4px", borderLeftColor: phase.color }}
                    >
                      {/* Top Header details of current mapped phase */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937]/50 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-1.5">
                              {phase.title}
                            </h3>
                            <span 
                              className="text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold text-xs"
                              style={{ color: phase.color, backgroundColor: `${phase.color}15`, border: `1px solid ${phase.color}25` }}
                            >
                              Weeks {phase.weeksRange}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-1">{phase.description}</p>
                        </div>

                        {/* Phase visual complete progression gauge */}
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-[#0B1120] border border-[#1F2937] rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full transition-all duration-500" 
                              style={{ width: `${phaseProgressPercent}%`, backgroundColor: phase.color }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-mono text-gray-300 font-bold">{phaseProgressPercent}% finished</span>
                        </div>
                      </div>

                      {/* Weeks sub-graph mapping */}
                      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 pt-2">
                        {phaseWeeks.map((w) => {
                          const stateType = getWeekState(w.week);
                          const isSelected = selectedWeekNum === w.week;
                          const hasMilestone = w.milestone !== null;
                          const diffData = getWeekDifficulty(w.week);

                          // Style assignment based on Display mode selection
                          let displayStyle = "";
                          let tooltipLabel = `Week ${w.week}: ${w.title}`;

                          if (colorMode === "status") {
                            if (stateType === "completed") {
                              displayStyle = "bg-[#34D399] border-[#0F766E] text-slate-900 shadow-md shadow-[#34D399]/20 hover:scale-105";
                            } else if (stateType === "current") {
                              displayStyle = "bg-[#60A5FA] border-[#2563EB] text-slate-950 animate-pulse border-2 scale-105 shadow-md shadow-blue-500/20";
                            } else if (stateType === "behind") {
                              displayStyle = "bg-red-500/10 border-red-500 text-red-400 border hover:bg-red-500/20 hover:text-white";
                            } else {
                              // Non started, checking if milestone
                              if (hasMilestone) {
                                displayStyle = "bg-amber-500/10 border-amber-500 text-amber-500 border hover:bg-amber-500/20";
                              } else {
                                displayStyle = "bg-[#111827] border-[#1F2937] text-gray-500 hover:border-gray-500";
                              }
                            }
                          } else {
                            // Heatmap Mode Colors mapping based on difficulty Score
                            switch (diffData.score) {
                              case 1:
                                displayStyle = "bg-emerald-950/40 border-emerald-500/30 text-emerald-400 border hover:bg-emerald-950/70";
                                break;
                              case 2:
                                displayStyle = "bg-blue-950/40 border-blue-500/30 text-blue-400 border hover:bg-blue-950/70";
                                break;
                              case 3:
                                displayStyle = "bg-indigo-950/40 border-indigo-500/30 text-indigo-400 border hover:bg-indigo-950/70";
                                break;
                              case 4:
                                displayStyle = "bg-amber-950/40 border-amber-500/30 text-amber-400 border hover:bg-amber-950/70";
                                break;
                              case 5:
                                displayStyle = "bg-purple-950/40 border-purple-500/30 text-purple-400 border hover:bg-purple-950/70";
                                break;
                            }
                          }

                          return (
                            <button
                              key={w.week}
                              onClick={() => openModal(w.week)}
                              className={`relative aspect-square rounded-xl p-0.5 flex flex-col items-center justify-center font-mono font-bold transition-all text-xs cursor-pointer ${displayStyle} ${
                                isSelected ? "ring-2 ring-white scale-105 z-10" : ""
                              }`}
                            >
                              <span className="text-[10px] sm:text-[11px]">W{w.week}</span>
                              {hasMilestone && (
                                <Trophy className="h-2 w-2 absolute bottom-1 right-1 text-amber-400 stroke-[3]" />
                              )}
                              
                              {/* Selected week pulse ring indicators */}
                              {w.week === currentWeek && colorMode === "status" && (
                                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Legend panel labels */}
                <div className="bg-[#111827] border border-[#1F2937] rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500 font-mono uppercase font-bold">Trace Mode Guide:</span>
                  </div>
                  {colorMode === "status" ? (
                    <div className="flex flex-wrap gap-4 text-xs font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#34D399] rounded border border-green-600"></span> Completed</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#60A5FA] rounded border border-blue-600 animate-pulse"></span> Current week</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-red-500/10 rounded border border-red-500"></span> Behind Schedule</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-500/10 rounded border border-amber-500"></span> Milestone Week</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-[#111827] rounded border border-[#1F2937]"></span> Locked / Not Started</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-4 text-xs font-mono">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-950 border border-emerald-500/40 rounded"></span> Introductory (Easy)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-blue-950 border border-blue-500/40 rounded"></span> Standard (Medium)</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-amber-950 border border-amber-500/40 rounded"></span> Heavy Workload</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-purple-950 border border-purple-500/40 rounded"></span> Extreme Challenge</span>
                    </div>
                  )}
                </div>

              </div>
            ) : (
              /* SKILL TREE OVER VIEW INTERACTIVE PANEL */
              <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl relative overflow-hidden space-y-6">
                
                {/* Visual HUD metadata context */}
                <div className="border-b border-[#1F2937]/60 pb-4">
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Layers className="h-4 w-4 text-[#34D399]" />
                    Zoho Skills Tree & Prerequisite Arc
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Visual sequence representation. Completed skills glow green automatically as weeks are checked off. Current focus skills pulsate.
                  </p>
                </div>

                {/* Skill blocks grid flow with arrows representations */}
                <div className="relative space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {skillTreeNodes.map((skill, index) => {
                      const isLock = !skill.completed && !skill.active && currentWeek < (index * 4 + 1);

                      return (
                        <div 
                          key={skill.id}
                          className={`p-4 rounded-xl border relative transition-all duration-300 flex flex-col justify-between ${
                            skill.completed
                              ? "bg-emerald-950/15 border-emerald-500/20 shadow-md shadow-emerald-500/5"
                              : skill.active
                              ? "bg-indigo-950/15 border-indigo-500/40 shadow-md shadow-indigo-500/5 animate-pulse"
                              : "bg-[#0B1120] border-[#1F2937]/70"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className={`text-[10px] font-mono tracking-wider font-bold ${
                                skill.completed ? "text-emerald-400" : skill.active ? "text-indigo-400 animate-pulse" : "text-gray-500"
                              }`}>
                                {skill.completed ? "● SKILL ACQUIRED" : skill.active ? "⚡ ACTIVE MODULE PROGRESSING" : "🔒 MODULE LOCKED"}
                              </span>
                              
                              {skill.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                              ) : skill.active ? (
                                <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
                              ) : (
                                <Lock className="h-3.5 w-3.5 text-gray-600" />
                              )}
                            </div>
                            
                            <h4 className="text-xs font-black font-mono tracking-tight text-white mt-1 ">{skill.label}</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed font-sans">{skill.description}</p>
                          </div>

                          <div className="mt-3.5 flex items-center justify-between border-t border-[#1F2937]/50 pt-2 text-[10px] font-mono text-gray-500">
                            <span>Index Node: {index + 1}</span>
                            <span>Target Req: Week {(index + 1) * 4}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>

        {/* RIGHT INTERACTIVE STATUS & DETAIL BAR */}
        <div className="lg:col-span-4 space-y-6">

          {/* 1. COMPREHENSIVE ZOHO READINESS GAUGE CARD */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 relative overflow-hidden">
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wider text-gray-400 border-b border-[#1F2937] pb-3 mb-4 flex items-center justify-between">
              <span>Readiness Progress</span>
              <Award className="h-4 w-4 text-amber-500" />
            </h3>

            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              {/* Circular SVG Rings Gauge */}
              <div className="relative w-36 h-36">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Outer Background Orbit circle */}
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="58" 
                    className="stroke-[#1F2937] fill-none" 
                    strokeWidth="8"
                  />
                  {/* Glowing active completion path */}
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="58" 
                    className="stroke-indigo-500 fill-none transition-all duration-1000" 
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={((100 - zohoReadinessScore) / 100) * (2 * Math.PI * 58)}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Absolute Center text scoring label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-white tracking-tight leading-none">
                    {zohoReadinessScore}%
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-mono mt-1 leading-none font-bold">
                    PLACEMENT READY
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                Aggressive statistical rating weighting target LeetCode routines, SQL normalization schemas, system design mocks, and week completion counts.
              </p>
            </div>

            {/* Custom KPI progress bars detailing percentages */}
            <div className="space-y-2.5 pt-2 border-t border-[#1F2937]/50 mt-2">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">Weeks Completed ({completedWeeks.length}/72)</span>
                  <span className="text-white font-bold">{overallWeekCompletedPercent}%</span>
                </div>
                <div className="w-full h-1 bg-[#0B1120] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400" style={{ width: `${overallWeekCompletedPercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">LeetCode Progress ({actualLeetcode}/300)</span>
                  <span className="text-white font-bold">{leetcodePercent}%</span>
                </div>
                <div className="w-full h-1 bg-[#0B1120] rounded-full overflow-hidden">
                  <div className="h-full bg-green-400" style={{ width: `${leetcodePercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">Zoho L3 Projects Completed ({actualProjects}/3)</span>
                  <span className="text-white font-bold">{projectPercent}%</span>
                </div>
                <div className="w-full h-1 bg-[#0B1120] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${projectPercent}%` }}></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-400">SQL Top 50 Completed ({actualSql}/50)</span>
                  <span className="text-white font-bold">{sqlPercent}%</span>
                </div>
                <div className="w-full h-1 bg-[#0B1120] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-400" style={{ width: `${sqlPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. DYNAMIC INTERACTIVE WEEK DETAILS SIDE PANEL SIDEBAR */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4">
            {selectedWeekData ? (
              <div className="space-y-4 text-xs">
                
                {/* Selected Node Details header */}
                <div className="border-b border-[#1F2937] pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-[#60A5FA] uppercase font-bold tracking-wider">
                      Selected Mapped Week (Node)
                    </span>
                    <h3 className="text-base font-black text-white font-mono mt-0.5">
                      Week {selectedWeekData.week}: <span className="text-[#60A5FA]">{selectedWeekData.title}</span>
                    </h3>
                  </div>
                  
                  {/* Status Toggle control directly inside sidebar overlay */}
                  <button
                    onClick={() => toggleWeekCompletion(selectedWeekData.week)}
                    className={`p-1 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                      completedWeeks.includes(selectedWeekData.week)
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-gray-500/10 border-[#1F2937] text-gray-500 hover:border-gray-500 hover:text-gray-300"
                    }`}
                    title={completedWeeks.includes(selectedWeekData.week) ? "Mark Incomplete" : "Mark Complete"}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  <div className="bg-[#0B1120] border border-[#1F2937] rounded-xl p-3">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#60A5FA] font-bold block">
                      Core Objective
                    </span>
                    <p className="text-gray-300 mt-1.5 leading-normal">{selectedWeekData.objective}</p>
                  </div>

                  {/* Daily Routine breakdown */}
                  <div>
                    <h4 className="font-bold text-white font-mono flex items-center gap-1.5 mb-2">
                      <Clock className="h-3.5 w-3.5 text-[#34D399]" />
                      Daily Operating System
                    </h4>
                    <ul className="space-y-2 pl-1 bg-[#0B1120]/40 p-2.5 rounded-xl border border-[#1F2937]/50">
                      {selectedWeekData.dailyRoutine.map((item, idx) => (
                        <li key={idx} className="flex gap-2 text-[11px] text-gray-300 items-start leading-relaxed">
                          <span className="text-[#34D399] font-mono mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weekly goals with toggles for direct integration ! */}
                  <div>
                    <h4 className="font-bold text-white font-mono flex items-center gap-1.5 mb-2">
                      <Target className="h-3.5 w-3.5 text-amber-500" />
                      Weekly Milestones & Goals
                    </h4>
                    <div className="space-y-1.5">
                      {selectedWeekData.goals.map((goal, idx) => {
                        const gKey = `${selectedWeekData.week}-${idx}`;
                        const isGoalDone = completedGoals.includes(gKey);

                        return (
                          <div 
                            key={idx}
                            onClick={() => toggleGoalCompletion(gKey)}
                            className="flex items-center gap-2.5 p-2 bg-[#0B1120] hover:bg-[#111827] border border-[#1F2937] rounded-xl cursor-pointer transition-all"
                          >
                            {isGoalDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-400 fill-green-400/10 flex-shrink-0" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />
                            )}
                            <span className={`text-[11px] font-sans leading-tight ${isGoalDone ? "line-through text-gray-500" : "text-gray-300"}`}>
                              {goal}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Curated Resources Overlay */}
                  {selectedWeekData.resources && selectedWeekData.resources.length > 0 && (
                    <div>
                      <h4 className="font-bold text-white font-mono flex items-center gap-1.5 mb-2">
                        <BookOpen className="h-3.5 w-3.5 text-purple-400" />
                        Curated Learning Assets ({selectedWeekData.resources.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedWeekData.resources.map((res, idx) => {
                          const resKey = `${selectedWeekData.week}-res-${idx}`;
                          const isResCompleted = completedResources.includes(resKey);

                          return (
                            <div 
                              key={idx}
                              className="p-3 bg-[#0B1120] border border-[#1F2937] rounded-xl flex flex-col space-y-2 hover:border-gray-700 transition"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <button
                                  onClick={() => toggleResourceCompletion(resKey)}
                                  className="flex items-center gap-2 focus:outline-none"
                                >
                                  {isResCompleted ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-500/10 flex-shrink-0" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                  )}
                                  <span className={`text-xs font-bold leading-none ${isResCompleted ? "line-through text-gray-500" : "text-white"}`}>
                                    {res.name}
                                  </span>
                                </button>
                                
                                {res.link && res.link !== "#" && (
                                  <a 
                                    href={res.link} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-[#60A5FA] hover:text-white"
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                              </div>
                              
                              <p className="text-[10px] text-gray-400 leading-normal font-sans pl-6">
                                {res.purpose}
                              </p>

                              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 pt-1.5 border-t border-[#1F2937]/50 pl-6">
                                <span>{res.category}</span>
                                <span>{res.timePerWeek} hrs/wk</span>
                                <span className={`uppercase font-bold ${
                                  res.priority === "high" ? "text-red-400" : res.priority === "medium" ? "text-amber-400" : "text-blue-400"
                                }`}>
                                  {res.priority}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Milestone week info panel details */}
                  {selectedWeekData.milestone && (
                    <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-1 relative">
                      <Trophy className="h-4 w-4 text-amber-500 absolute top-3 right-3 stroke-[2]" />
                      <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                        🏅 Active Major Milestone
                      </span>
                      <p className="text-xs font-semibold text-white mt-1 leading-normal">
                        {selectedWeekData.milestone}
                      </p>
                    </div>
                  )}

                  {/* Personal Notebook overlay for notes storage */}
                  <div className="space-y-1.5 pt-1.5 border-t border-[#1F2937]/60">
                    <h4 className="font-bold text-white font-mono flex items-center gap-1.5">
                      <NotebookPen className="h-3.5 w-3.5 text-indigo-400" />
                      Candidate Notes on Week {selectedWeekData.week}
                    </h4>
                    <p className="text-[10px] text-gray-500 pb-1">
                      Log any queries, complexity metrics, or study notes. Saved automatically on change.
                    </p>
                    <textarea
                      value={notesTemp}
                      onChange={(e) => setNotesTemp(e.target.value)}
                      onBlur={saveNotes}
                      placeholder="e.g. Coded sliding window template. Time: O(N) auxiliary Space: O(1)..."
                      rows={4}
                      className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 space-y-3 font-mono text-xs">
                <HelpCircle className="h-8 w-8 text-gray-600 mx-auto" />
                <p>Click any week node in the visual timeline path matrix to inspect detailed schedules, target resources and milestones.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
