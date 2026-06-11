import React from "react";
import { 
  ArrowUpRight, 
  Flame, 
  CheckSquare, 
  Sparkles, 
  BookMarked, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Target, 
  Code, 
  FolderGit, 
  Database, 
  Tv, 
  HelpCircle,
  TrendingUp,
  Clock
} from "lucide-react";
import { PHASES, getZoho72WeekRoadmap, WeekData, MAJOR_MILESTONES } from "../data/roadmapData";
import { DatabaseState } from "../types";

interface DashboardViewProps {
  state: DatabaseState;
  
  // 72-Week local tracker controls
  currentWeek: number;
  setCurrentWeek: (w: number) => void;
  completedWeeks: number[];
  toggleWeekCompletion: (w: number) => void;
  completedGoals: string[];
  toggleGoalCompletion: (gId: string) => void;
  completedResources: string[];
  toggleResourceCompletion: (rId: string) => void;
  
  // Custom logged actual metrics
  actualLeetcode: number;
  setActualLeetcode: (n: number) => void;
  actualSql: number;
  setActualSql: (n: number) => void;
  actualProjects: number;
  setActualProjects: (n: number) => void;
  actualMocks: number;
  setActualMocks: (n: number) => void;
  
  // Navigation
  onNavigate: (view: string) => void;
}

export default function DashboardView({
  state,
  currentWeek,
  setCurrentWeek,
  completedWeeks,
  toggleWeekCompletion,
  completedGoals,
  toggleGoalCompletion,
  completedResources,
  toggleResourceCompletion,
  actualLeetcode,
  setActualLeetcode,
  actualSql,
  setActualSql,
  actualProjects,
  setActualProjects,
  actualMocks,
  setActualMocks,
  onNavigate,
}: DashboardViewProps) {
  
  const roadmap = getZoho72WeekRoadmap();
  const activeWeekData = roadmap.find(w => w.week === currentWeek) || roadmap[0];
  const activePhase = PHASES.find(p => p.id === activeWeekData.phaseId) || PHASES[0];

  // Calculated Overall Completion
  // Each week represents progress.
  const weekProgressPercent = Math.round((completedWeeks.length / 72) * 100);

  // Weekly Checklist Completion
  const weeklyGoalsCount = activeWeekData.goals.length;
  const completedWeeklyGoalsCount = activeWeekData.goals.filter((_, idx) => 
    completedGoals.includes(`${currentWeek}-${idx}`)
  ).length;
  const weeklyCompletionPercent = weeklyGoalsCount > 0 
    ? Math.round((completedWeeklyGoalsCount / weeklyGoalsCount) * 100) 
    : 0;

  // Streak simulation (continuous learning streak)
  const streakCount = completedWeeks.length > 0 ? 5 + completedWeeks.length * 2 : 3;

  // Upcoming Milestones mapping
  const nextMilestone = MAJOR_MILESTONES.find(m => m.week >= currentWeek) || MAJOR_MILESTONES[MAJOR_MILESTONES.length - 1];

  // Schedule Health evaluation (LeetCode comparison & SQL comparison)
  const targetLc = activeWeekData.targetMetrics.leetcode;
  const targetSql = activeWeekData.targetMetrics.sql;
  const targetProj = activeWeekData.targetMetrics.projectPercent;
  const targetMocks = activeWeekData.targetMetrics.mockInterviews;

  const isBehind = 
    actualLeetcode < targetLc || 
    actualSql < targetSql || 
    (targetMocks > 0 && actualMocks < targetMocks);

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* PERSONALIZED WELCOME BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-[#0F172A] to-[#1E1B4B] border border-[#312E81]/60 px-5 py-4 rounded-2xl shadow-indigo-500/5 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-[#60A5FA]/10 p-2 rounded-xl text-[#60A5FA] border border-[#60A5FA]/20">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5 font-sans">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-indigo-300 font-extrabold">Srivishnu (Sir)</span>!
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Your technical concierge stands ready. Active study routine calibrated and in perfect operation.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#1F2937]/50 border border-[#374151] px-3.5 py-1.5 rounded-xl text-xs font-mono text-gray-300">
          <Clock className="h-4 w-4 text-[#60A5FA]" />
          <span>72-Week Master Protocol</span>
        </div>
      </div>
      
      {/* 1. HERO OPERATING SYSTEM PANEL */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden" id="hero-dashboard">
        {/* Background Decorative Rings */}
        <div className="absolute top-[-40%] right-[-10%] w-[350px] h-[350px] rounded-full bg-[#60A5FA]/5 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider font-mono border ${activePhase.bgClass} ${activePhase.borderClass} ${activePhase.textClass}`}>
                {activePhase.title.split(":")[0]}
              </span>
              <span className="text-[10px] bg-[#1F2937] border border-[#374151] font-mono font-semibold px-2 py-0.5 rounded-full text-gray-400">
                WEEKS {activePhase.weeksRange}
              </span>
            </div>
            
            <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {activeWeekData.title}
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
              {activeWeekData.objective}
            </p>
          </div>

          {/* Quick Metrics stats cards */}
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            {/* Week Selector Button Stepper */}
            <div className="bg-[#0B1120] border border-[#1F2937] rounded-xl p-3 flex flex-col justify-center items-center font-mono">
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-10">Select Active Week</span>
              <div className="flex items-center space-x-2.5">
                <button 
                  onClick={() => currentWeek > 1 && setCurrentWeek(currentWeek - 1)}
                  disabled={currentWeek <= 1}
                  className="p-1 px-2.5 bg-[#1F2937] border border-[#374151] hover:bg-[#374151] text-white rounded-lg transition-all cursor-pointer disabled:opacity-30"
                  title="Previous Week"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="text-center px-1.5">
                  <span className="text-3xl font-bold font-mono text-white tracking-tighter leading-none block">
                    {currentWeek}
                  </span>
                  <span className="text-[8px] text-[#60A5FA] font-bold tracking-widest uppercase">of 72</span>
                </div>
                <button 
                  onClick={() => currentWeek < 72 && setCurrentWeek(currentWeek + 1)}
                  disabled={currentWeek >= 72}
                  className="p-1 px-2.5 bg-[#1F2937] border border-[#374151] hover:bg-[#374151] text-white rounded-lg transition-all cursor-pointer disabled:opacity-30"
                  title="Next Week"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Streak count */}
            <div className="bg-[#0B1120] border border-[#1F2937] rounded-xl p-3 px-4.5 text-center min-w-[100px] flex flex-col justify-between">
              <span className="text-[9px] uppercase tracking-widest text-[#FBBF24] font-bold font-mono block">Streak</span>
              <div className="flex items-center justify-center space-x-1.5 mt-2">
                <Flame className="h-5 w-5 text-[#FBBF24] animate-pulse" />
                <span className="text-2xl font-black font-mono text-[#FBBF24] tracking-tight">{streakCount}d</span>
              </div>
              <span className="text-[8px] text-gray-500 font-mono mt-1">Study Streak</span>
            </div>

            {/* Completion Circular Ring */}
            <div className="bg-[#0B1120] border border-[#1F2937] rounded-xl p-3 px-4 flex items-center space-x-3.5 h-[84px]">
              <div className="relative flex items-center justify-center h-14 w-14">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    className="stroke-[#1F2937] fill-transparent"
                    strokeWidth="4.5"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r="23"
                    className="stroke-[#60A5FA] fill-transparent transition-all duration-700"
                    strokeWidth="4.5"
                    strokeDasharray={144.5}
                    strokeDashoffset={144.5 - (144.5 * weekProgressPercent) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs leading-none font-bold font-mono text-white">
                  {weekProgressPercent}%
                </span>
              </div>
              <div className="text-left font-mono">
                <span className="text-[8px] text-gray-500 uppercase font-bold tracking-widest">Total Program</span>
                <span className="text-xs font-bold text-gray-200 block mt-0.5 leading-tight">72-Week OS</span>
                <span className="text-[9px] text-[#34D399] block mt-0.5 font-semibold">
                  {completedWeeks.length} / 72 Complete
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 2. TWO-COLUMN INTERACTIVE CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE WEEK GOALS & LECTURE VAULT */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Week Checklist Core */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#1F2937]">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">Weekly Targets</span>
                <h3 className="text-base font-bold text-white font-mono flex items-center gap-1.5 mt-0.5">
                  <CheckSquare className="h-4 w-4 text-[#60A5FA]" /> Daily Routine Tasks
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-[#60A5FA] bg-[#60A5FA]/10 px-2 py-0.5 border border-[#60A5FA]/20 rounded">
                {weeklyCompletionPercent}% Week Done
              </span>
            </div>

            {/* Progress bar info */}
            <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden mb-5">
              <div 
                className="h-full bg-gradient-to-r from-[#60A5FA] to-[#34D399] transition-all duration-500"
                style={{ width: `${weeklyCompletionPercent}%` }}
              />
            </div>

            {/* List of week goals */}
            <div className="space-y-2.5">
              {activeWeekData.goals.map((goal, idx) => {
                const goalId = `${currentWeek}-${idx}`;
                const isChecked = completedGoals.includes(goalId);

                return (
                  <div
                    key={idx}
                    onClick={() => toggleGoalCompletion(goalId)}
                    className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition-all ${
                      isChecked
                        ? "bg-[#0B1120]/45 border-[#1F2937] opacity-60 text-gray-500"
                        : "bg-[#0B1120] border-[#1F2937] hover:border-gray-700 text-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      readOnly
                      className="mt-0.5 rounded border-[#1F2937] bg-[#111827] text-[#60A5FA] focus:ring-0 cursor-pointer h-4 w-4 shrink-0"
                    />
                    <div className="space-y-0.5 leading-tight">
                      <p className={`text-xs font-semibold ${isChecked ? "line-through text-gray-500" : ""}`}>
                        {goal}
                      </p>
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">Target item {idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Set week marked completion checkbox */}
            <div className="mt-6 pt-4 border-t border-[#1F2937] flex items-center justify-between">
              <div className="text-left">
                <p className="text-xs font-semibold text-white">Prism Evaluation Badge</p>
                <p className="text-[10px] text-gray-500">Has the overall objective of Week {currentWeek} been solved?</p>
              </div>

              <button
                onClick={() => toggleWeekCompletion(currentWeek)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                  completedWeeks.includes(currentWeek)
                    ? "bg-[#34D399] hover:bg-[#34D399]/90 text-[#0B1120]"
                    : "bg-[#1F2937] border border-[#374151] text-gray-300 hover:text-white hover:bg-[#2e3b4d]"
                }`}
              >
                <span>{completedWeeks.includes(currentWeek) ? "Week Complete ✓" : "Mark Week Complete"}</span>
              </button>
            </div>

          </div>

          {/* Curated Resources block */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 text-left">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">Reference Library</span>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-1.5 mt-0.5 mb-4">
              <BookMarked className="h-4 w-4 text-[#60A5FA]" /> Structured Weekly Resources
            </h3>

            <div className="space-y-3">
              {activeWeekData.resources.map((res, idx) => {
                const resKey = `${currentWeek}-${idx}`;
                const isResChecked = completedResources.includes(resKey);

                return (
                  <div
                    key={idx}
                    className="p-4 bg-[#0B1120] border border-[#1F2937] rounded-xl flex items-start justify-between gap-3 relative hover:border-[#1F2937]/80 group"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div 
                        onClick={() => toggleResourceCompletion(resKey)}
                        className={`mt-1 p-1 rounded border cursor-pointer shrink-0 transition-colors ${
                          isResChecked 
                            ? "bg-[#60A5FA]/10 border-[#60A5FA] text-[#60A5FA]" 
                            : "bg-[#111827] border-[#1F2937] text-transparent hover:text-gray-500 hover:border-gray-500"
                        }`}
                      >
                        <CheckSquare className="h-3 w-3" />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono tracking-widest text-[#34D399] uppercase bg-[#34D399]/5 border border-[#34D399]/10 rounded px-1.5 py-0.5">
                            {res.category}
                          </span>
                          <span className={`text-[8px] font-mono uppercase px-1 rounded ${
                            res.priority === "high" ? "bg-red-500/10 text-red-400" : "bg-gray-700/20 text-gray-400"
                          }`}>
                            {res.priority} Priority
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-200 truncate leading-snug">
                          {res.name}
                        </h4>
                        <p className="text-[11px] text-gray-450 leading-relaxed font-sans">
                          {res.purpose}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          Estimated Study: <strong className="text-gray-300">{res.timePerWeek} hours</strong>
                        </p>
                      </div>
                    </div>

                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5. bg-[#111827] border border-[#1F2937] hover:border-gray-500 rounded text-gray-400 hover:text-white transition cursor-pointer self-start shrink-0"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate("resources")}
              className="mt-4 w-full py-2.5 bg-[#0B1120] border border-[#1F2937] hover:border-gray-500 text-xs font-semibold text-gray-300 hover:text-white tracking-wide rounded-xl font-mono text-center block"
            >
              Enter Full Curated Resource Library
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: TARGET VS ACTUAL CONTROLLER & DYNAMIC METRIC GAUGES */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Operating Health state widget */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 relative text-left">
            <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">Schedule Diagnostics</span>
            <div className="flex items-center space-x-3.5 mt-1">
              <div className={`p-2 rounded-xl border ${
                isBehind 
                  ? "bg-red-500/10 border-red-500/20 text-red-400" 
                  : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              }`}>
                <AlertCircle className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  {isBehind ? "Diagnostic: Behind Target" : "Diagnostic: On Track"}
                </h4>
                <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                  {isBehind 
                    ? "Your logged LeetCode, Project, or SQL hours are currently below the required metrics defined for Week " + currentWeek + ". Log more practice sessions to align!"
                    : "Excellent consistency! Your active totals satisfy or exceed target criteria guidelines calibrated for this placement milestone."
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Interactive actual metrics tuner */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 space-y-4">
            <div className="border-b border-[#1F2937] pb-3 text-left">
              <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold font-mono">Prism Counters</span>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-1.5 mt-0.5">
                <Target className="h-4 w-4 text-[#60A5FA]" /> Roadmap Target Metrics
              </h3>
            </div>

            <div className="space-y-4">
              
              {/* LeetCode Tracker card */}
              <div className="p-3.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-left">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Code className="h-4 w-4 text-[#60A5FA]" />
                    <span className="text-xs font-bold text-gray-200">LeetCode Progress</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">{actualLeetcode}</span>
                    <span className="text-[10px] text-gray-500 font-mono"> / {targetLc || "—"} Target</span>
                  </div>
                </div>
                {/* Horizontal simple progress */}
                <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-[#60A5FA] transition-all" 
                    style={{ width: `${Math.min(100, targetLc > 0 ? (actualLeetcode / targetLc) * 100 : 100)}%` }}
                  />
                </div>
                {/* Manual Increments Buttons */}
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-mono text-gray-500">Log new problems:</span>
                  <div className="flex items-center space-x-1.5">
                    <button 
                      onClick={() => setActualLeetcode(Math.max(0, actualLeetcode - 1))}
                      className="p-1 px-2.5 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-gray-400 hover:text-white text-[10px] font-mono leading-none rounded cursor-pointer"
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => setActualLeetcode(actualLeetcode + 1)}
                      className="p-1 px-2.5 bg-[#1F2937] hover:bg-[#34D399] border border-[#374151] text-gray-250 hover:text-white text-[10px] font-mono leading-none rounded cursor-pointer"
                    >
                      +1
                    </button>
                    <button 
                      onClick={() => setActualLeetcode(actualLeetcode + 5)}
                      className="p-1 px-2.5 bg-[#60A5FA] hover:bg-[#60A5FA]/80 text-[#0B1120] text-[10px] font-bold font-mono leading-none rounded cursor-pointer"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>

              {/* SQL queries tracker */}
              <div className="p-3.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-left">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4 text-[#34D399]" />
                    <span className="text-xs font-bold text-gray-200">SQL Tuning Queries</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">{actualSql}</span>
                    <span className="text-[10px] text-gray-500 font-mono"> / {targetSql || "—"} Target</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-[#34D399]" 
                    style={{ width: `${Math.min(100, targetSql > 0 ? (actualSql / targetSql) * 100 : 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-mono text-gray-500">Log queries written:</span>
                  <div className="flex items-center space-x-1.5">
                    <button 
                      onClick={() => setActualSql(Math.max(0, actualSql - 1))}
                      className="p-1 px-2.5 bg-[#111827] hover:bg-[#1F2937] border border-[#1F2937] text-gray-400 hover:text-white text-[10px] font-mono leading-none rounded cursor-pointer"
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => setActualSql(actualSql + 1)}
                      className="p-1 px-2.5 bg-[#1F2937] hover:bg-[#34D399] border border-[#374151] text-gray-250 hover:text-white text-[10px] font-mono leading-none rounded cursor-pointer"
                    >
                      +1
                    </button>
                    <button 
                      onClick={() => setActualSql(actualSql + 5)}
                      className="p-1 px-2.5 bg-[#34D399] hover:bg-[#34D399]/80 text-[#0B1120] text-[10px] font-bold font-mono leading-none rounded cursor-pointer"
                    >
                      +5
                    </button>
                  </div>
                </div>
              </div>

              {/* L3 machine code projects */}
              <div className="p-3.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-left">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <FolderGit className="h-4 w-4 text-[#FBBF24]" />
                    <span className="text-xs font-bold text-gray-200">L3 Projects Commenced</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">{actualProjects}</span>
                    <span className="text-[10px] text-gray-500 font-mono"> / 6 Mastered</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-[#FBBF24]" 
                    style={{ width: `${Math.min(100, (actualProjects / 6) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-mono text-gray-500">Custom builds progress:</span>
                  <div className="flex items-center space-x-1.5">
                    <button 
                      onClick={() => setActualProjects(Math.max(0, actualProjects - 1))}
                      className="p-1 px-2 bg-[#111827] border border-[#1F2937] text-gray-500 hover:text-white text-[10px] rounded"
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => setActualProjects(Math.min(6, actualProjects + 1))}
                      className="p-1 px-2.5 bg-[#FBBF24] text-[#0B1120] hover:bg-[#FBBF24]/85 text-[10px] rounded font-bold"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              </div>

              {/* Mock Interviews tracker card */}
              <div className="p-3.5 bg-[#0B1120] border border-[#1F2937] rounded-xl text-left">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center space-x-2">
                    <Tv className="h-4 w-4 text-[#F87171]" />
                    <span className="text-xs font-bold text-gray-200">Mock Interviews Grid</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white">{actualMocks}</span>
                    <span className="text-[10px] text-gray-500 font-mono"> / {targetMocks || "—"} Target</span>
                  </div>
                </div>
                <div className="h-1.5 bg-[#1F2937] rounded-full overflow-hidden mb-3">
                  <div 
                    className="h-full bg-[#F87171]" 
                    style={{ width: `${Math.min(100, targetMocks > 0 ? (actualMocks / targetMocks) * 100 : 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-mono text-gray-500">Record mock trials:</span>
                  <div className="flex items-center space-x-1.5">
                    <button 
                      onClick={() => setActualMocks(Math.max(0, actualMocks - 1))}
                      className="p-1 px-2 bg-[#111827] border border-[#1F2937] text-gray-500 hover:text-white text-[10px] rounded"
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => setActualMocks(actualMocks + 1)}
                      className="p-1 px-2.5 bg-[#F87171] text-white hover:bg-[#F87171]/85 text-[10px] rounded font-mono font-semibold"
                    >
                      +1 Log
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* NEXT MILESTONE CARD INDICATOR */}
          <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 text-left relative overflow-hidden group">
            {/* Ambient indicator lines */}
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-[#60A5FA]`} />

            <div className="flex justify-between items-start">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#60A5FA] font-bold">Next Major Roadmap Threshold</span>
              <span className="text-xs bg-[#1F2937] border border-[#374151] px-2 py-0.5 rounded font-mono text-[#60A5FA]">
                Week {nextMilestone.week}
              </span>
            </div>

            <h4 className="text-base font-bold text-white mt-3 flex items-center gap-1.5 leading-snug">
              📌 {nextMilestone.title}
            </h4>
            <p className="text-xs text-gray-450 mt-1.5 leading-relaxed font-sans">
              {nextMilestone.description}
            </p>

            <div className="mt-4 pt-3.5 border-t border-[#1F2937] flex items-center justify-between">
              <span className="text-[10px] text-gray-500 font-mono">Distance to Milestone:</span>
              <span className="text-xs font-bold text-white font-mono bg-[#0B1120] border border-[#1F2937] px-2 py-1 rounded">
                {nextMilestone.week >= currentWeek 
                  ? `${nextMilestone.week - currentWeek} weeks remaining` 
                  : "Completed ✓"
                }
              </span>
            </div>
            
            <button
              onClick={() => onNavigate("milestones")}
              className="mt-4 w-full py-2 bg-[#0B1120] border border-[#1F2937] hover:border-gray-500 text-[10px] tracking-wider uppercase font-bold text-[#60A5FA] hover:text-[#60A5FA]/80 rounded-lg text-center"
            >
              Examine Complete Milestones Grid
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
