import React, { useState } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  ListTodo, 
  Clock, 
  NotebookPen, 
  Award, 
  HelpCircle,
  RefreshCw,
  Search,
  Filter
} from "lucide-react";
import { PHASES, getZoho72WeekRoadmap, WeekData, MAJOR_MILESTONES } from "../data/roadmapData";
import { DatabaseState } from "../types";

interface RoadmapViewProps {
  state: DatabaseState;
  
  // States and modifiers passed from App.tsx
  currentWeek: number;
  setCurrentWeek: (w: number) => void;
  completedWeeks: number[];
  toggleWeekCompletion: (w: number) => void;
  completedGoals: string[];
  toggleGoalCompletion: (gId: string) => void;
  completedResources: string[];
  toggleResourceCompletion: (rId: string) => void;
  
  // Weekly personal notes integration
  weeklyNotes: Record<number, string>;
  setWeeklyNotes: (notes: Record<number, string>) => void;
  onResetAllProgress: () => void;
}

export default function RoadmapView({
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
  onResetAllProgress,
}: RoadmapViewProps) {
  
  const roadmap = getZoho72WeekRoadmap();
  
  // UI states
  const [activePhaseTab, setActivePhaseTab] = useState<string>("phase-1");
  const [expandedWeek, setExpandedWeek] = useState<number | null>(currentWeek);
  const [searchText, setSearchText] = useState<string>("");
  const [localResetting, setLocalResetting] = useState<boolean>(false);

  // Filter roadmap based on search text and active phase tab
  const filteredWeeks = roadmap.filter((w) => {
    // If searching, bypass phase-tabs block to search across all 72 weeks!
    if (searchText.trim() !== "") {
      return (
        w.title.toLowerCase().includes(searchText.toLowerCase()) ||
        w.objective.toLowerCase().includes(searchText.toLowerCase()) ||
        w.goals.some((g) => g.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    return w.phaseId === activePhaseTab;
  });

  const activePhase = PHASES.find(p => p.id === activePhaseTab) || PHASES[0];

  const handleResetClick = () => {
    const confirm = window.confirm(
      "Warning: This will reset all your checked weeks, weekly goals, and logged metrics back to startup defaults. Your custom personal notes in the Knowledge Base will be preserved. Proceed?"
    );
    if (!confirm) return;
    
    setLocalResetting(true);
    setTimeout(() => {
      onResetAllProgress();
      setLocalResetting(false);
    }, 800);
  };

  const handleNoteChange = (weekNum: number, value: string) => {
    const updated = { ...weeklyNotes, [weekNum]: value };
    setWeeklyNotes(updated);
  };

  return (
    <div className="space-y-6 text-left">
      
      {/* 1. ARCHITECT HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight leading-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#60A5FA] rounded-sm"></div>
            72-Week Zoho Placement Syllabus
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Visual pathway detailing the daily routines, milestone challenges, and resources necessary for Zoho mastery.
          </p>
        </div>

        <button
          onClick={handleResetClick}
          disabled={localResetting}
          className="flex items-center space-x-1.5 py-2 px-3 border border-red-500/20 bg-red-950/15 hover:bg-red-950/25 hover:border-red-500/40 text-[11px] text-red-400 font-semibold font-mono rounded-xl cursor-pointer disabled:opacity-50 transition-all self-start md:self-center"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${localResetting ? "animate-spin" : ""}`} />
          <span>{localResetting ? "Recompiling roadmap..." : "Reset Roadmap Progress"}</span>
        </button>
      </div>

      {/* 2. TAB CONTROLLER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-3 rounded-2xl">
        {/* Phase selection tabs */}
        <div className="flex flex-wrap gap-1.5">
          {PHASES.map((phase) => {
            const isTabActive = activePhaseTab === phase.id && searchText === "";
            
            // Calculate active phase weekly statistics
            const phaseWeeks = roadmap.filter(w => w.phaseId === phase.id);
            const phaseWeeksCompleted = phaseWeeks.filter(w => completedWeeks.includes(w.week)).length;
            const phaseProgress = Math.round((phaseWeeksCompleted / phaseWeeks.length) * 100);

            return (
              <button
                key={phase.id}
                onClick={() => {
                  setActivePhaseTab(phase.id);
                  setSearchText("");
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition-all text-left flex flex-col cursor-pointer ${
                  isTabActive
                    ? "bg-[#1F2937] text-white border border-[#303e50] shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-[#111827]/60 border border-transparent"
                }`}
              >
                <span className="text-[9px] uppercase tracking-wider text-gray-500">
                  Phase {phase.id.replace("phase-", "")} ({phase.weeksRange})
                </span>
                <span className="flex items-center gap-1.5 mt-0.5 mt-1 text-gray-300">
                  <span className={`w-1.5 h-1.5 rounded-full`} style={{ backgroundColor: phase.color }} />
                  {phase.title.slice(9, 28)}...
                  <span className="text-[10px] text-[#60A5FA] font-bold">({phaseProgress}%)</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search syllabus..."
            className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#60A5FA] placeholder-gray-500 font-mono"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* 3. ROADMAP ITERATIVE TIMELINE */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Active Phase sidebar overview panel (hidden on search) */}
        {searchText === "" && (
          <div className="xl:col-span-1 bg-[#111827] border border-[#1F2937] p-5 rounded-2xl h-fit space-y-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono block">
              Active Phase Details
            </span>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-white font-mono leading-tight flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: activePhase.color }} />
                {activePhase.title.split(": ")[1]}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {activePhase.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1F2937] space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Syllabus Scope:</span>
                <span className="text-white font-bold">Weeks {activePhase.weeksRange}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Theme Color:</span>
                <span className="font-bold uppercase text-[11px]" style={{ color: activePhase.color }}>
                  {activePhase.color}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phase Completion:</span>
                <span className="text-[#34D399] font-bold">
                  {Math.round((roadmap.filter(w => w.phaseId === activePhase.id && completedWeeks.includes(w.week)).length / 
                   roadmap.filter(w => w.phaseId === activePhase.id).length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main interactive weeks stack view */}
        <div className={searchText === "" ? "xl:col-span-3 space-y-3" : "xl:col-span-4 space-y-3"}>
          
          {filteredWeeks.length === 0 ? (
            <div className="py-16 text-center text-gray-500 font-mono text-xs bg-[#111827] border border-[#1F2937] rounded-2xl">
              No syllabus elements matched your lookup.
            </div>
          ) : (
            filteredWeeks.map((wData) => {
              const isOpen = expandedWeek === wData.week;
              const isWeekDone = completedWeeks.includes(wData.week);
              
              // Calculate weekly goal complete
              const weekGoals = wData.goals;
              const completedWeekGoals = weekGoals.filter((_, idx) => 
                completedGoals.includes(`${wData.week}-${idx}`)
              ).length;
              const goalsRatio = `${completedWeekGoals}/${weekGoals.length}`;

              return (
                <div 
                  key={wData.week}
                  className={`bg-[#111827] border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? "border-gray-700 shadow-xl" 
                      : isWeekDone 
                        ? "border-[#1F2937] opacity-80" 
                        : "border-[#1F2937] hover:border-gray-800"
                  }`}
                >
                  {/* WEEK HEADER COLLAPSIBLE TRIGGER */}
                  <div 
                    onClick={() => setExpandedWeek(isOpen ? null : wData.week)}
                    className="p-4 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                      {/* Check mark circles */}
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWeekCompletion(wData.week);
                        }}
                        className={`p-1.5 rounded-full border shrink-0 transition-colors cursor-pointer ${
                          isWeekDone 
                            ? "bg-[#34D399]/10 border-[#34D399] text-[#34D399]" 
                            : "bg-[#0B1120] border-[#1F2937] text-transparent hover:text-gray-500 hover:border-gray-500"
                        }`}
                        title="Mark week complete"
                      >
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[9px] uppercase font-bold font-mono tracking-widest text-gray-500">
                            WEEK {wData.week}
                          </span>
                          {wData.milestone && (
                            <span className="flex items-center gap-1 text-[8px] font-bold font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase shrink-0">
                              <Award className="h-2.5 w-2.5" /> Milestone Bound
                            </span>
                          )}
                          <span className="text-[10px] font-mono text-gray-400">
                            Goals: <strong className="text-[#60A5FA]">{goalsRatio}</strong>
                          </span>
                        </div>
                        <h4 className={`text-sm font-bold tracking-tight mt-1 truncate ${
                          isWeekDone ? "line-through text-gray-500" : "text-white"
                        }`}>
                          {wData.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 shrink-0">
                      <span className="hidden sm:inline text-[10px] font-mono text-gray-500">
                        {isOpen ? "Collapse Details" : "Expand Objective"}
                      </span>
                      {isOpen ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* WEEK EXPANDED CONTENT DRAWER */}
                  {isOpen && (
                    <div className="border-t border-[#1F2937] bg-[#0B1120]/60 p-5 space-y-6 md:p-6">
                      
                      {/* Objectives panel */}
                      <div className="p-3 bg-[#111827] border border-[#1F2937] rounded-xl text-left">
                        <span className="text-[9px] uppercase font-mono tracking-wider text-[#60A5FA] font-bold">Week Objective Scope</span>
                        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                          {wData.objective}
                        </p>
                      </div>

                      {/* Daily routines and Goals split grids */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Daily routines timeline timeline */}
                        <div className="space-y-3.5 text-left">
                          <h5 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-[#34D399]" /> Custom Daily Routine Setup
                          </h5>
                          
                          <div className="space-y-2 border-l-2 border-[#1F2937] pl-4 ml-2">
                            {wData.dailyRoutine.map((routine, rIdx) => {
                              const [time, desc] = routine.split(": ");
                              return (
                                <div key={rIdx} className="relative py-1">
                                  {/* Dot */}
                                  <div className="absolute top-2.5 left-[-21px] w-2 h-2 rounded-full bg-[#34D399] border-2 border-[#0B1120]" />
                                  <div className="font-mono text-xs">
                                    <strong className="text-[#34D399]">{time}</strong>
                                    <p className="text-gray-400 text-[11px] leading-relaxed mt-0.5">{desc || "Self-study prep segments"}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Checklist items */}
                        <div className="space-y-3.5 text-left">
                          <h5 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                            <ListTodo className="h-3.5 w-3.5 text-[#60A5FA]" /> Target Objectives Checklist
                          </h5>

                          <div className="space-y-2">
                            {wData.goals.map((goal, gIdx) => {
                              const gKey = `${wData.week}-${gIdx}`;
                              const isChecked = completedGoals.includes(gKey);

                              return (
                                <div
                                  key={gIdx}
                                  onClick={() => toggleGoalCompletion(gKey)}
                                  className={`p-3 bg-[#111827] border rounded-xl flex items-start gap-2.5 cursor-pointer hover:border-gray-600 transition-all ${
                                    isChecked 
                                      ? "opacity-60 border-[#1F2937]" 
                                      : "border-[#1F2937]"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    readOnly
                                    className="mt-0.5 rounded border-[#1F2937] bg-[#0B1120] text-[#60A5FA] cursor-pointer"
                                  />
                                  <span className={`text-xs ${isChecked ? "line-through text-gray-500" : "text-gray-350"}`}>
                                    {goal}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Curated Resources details list */}
                      <div className="space-y-3 pt-3 border-t border-[#1F2937]/50 text-left">
                        <h5 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-[#FBBF24]" /> Active reference Vault
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {wData.resources.map((res, rIdx) => {
                            const resKey = `${wData.week}-${rIdx}`;
                            const isResChecked = completedResources.includes(resKey);

                            return (
                              <div 
                                key={rIdx} 
                                className="p-3 bg-[#111827] border border-[#1F2937] rounded-xl flex flex-col justify-between hover:border-gray-700 transition"
                              >
                                <div>
                                  <div className="flex items-center justify-between gap-1.5 mb-1 bg-[#0B1120] px-2 py-1 rounded">
                                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#34D399]">
                                      {res.category}
                                    </span>
                                    <span className={`text-[8px] font-mono px-1 rounded uppercase ${
                                      res.priority === "high" ? "bg-red-500/10 text-red-400" : "bg-gray-400/10 text-gray-400"
                                    }`}>
                                      {res.priority}
                                    </span>
                                  </div>
                                  <h6 className="text-xs font-bold text-white leading-snug">{res.name}</h6>
                                  <p className="text-[11px] text-gray-400 leading-normal mt-1">{res.purpose}</p>
                                </div>

                                <div className="flex items-center justify-between gap-2.5 mt-3 pt-2.5 border-t border-[#1F2937]/50">
                                  <button
                                    onClick={() => toggleResourceCompletion(resKey)}
                                    className={`px-2 py-1 rounded text-[10px] font-bold font-mono transition ${
                                      isResChecked 
                                        ? "bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20" 
                                        : "bg-[#0B1120] hover:bg-[#111827] text-gray-400 border border-[#1F2937]"
                                    }`}
                                  >
                                    {isResChecked ? "Completed ✓" : "Mark Complete"}
                                  </button>
                                  <a
                                    href={res.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 hover:bg-[#1F2937] rounded text-[#60A5FA] flex items-center gap-0.5 text-[10px] font-mono leading-none"
                                  >
                                    <span>Learn Space</span>
                                    <ArrowUpRight className="h-3 w-3" />
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Personal Study Notes text journal box */}
                      <div className="space-y-2.5 pt-4 border-t border-[#1F2937] text-left">
                        <h5 className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                          <NotebookPen className="h-3.5 w-3.5 text-[#FBBF24]" /> Week Learning Journal Notes
                        </h5>
                        <p className="text-[10px] text-gray-500">
                          These notes sync with your browser local storage. Write summaries, record questions to review later, or save mock-test score benchmarks.
                        </p>
                        <textarea
                          value={weeklyNotes[wData.week] || ""}
                          onChange={(e) => handleNoteChange(wData.week, e.target.value)}
                          placeholder="Study diary notes... e.g., 'Coded Railway Reservation RAC queue booking checks. Ran 5 sample reservation datasets successfully.'"
                          rows={3}
                          className="w-full bg-[#111827] border border-[#1F2937] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#60A5FA] placeholder-gray-600 font-sans"
                        />
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}

        </div>

      </div>

    </div>
  );
}

// Inline ArrowUpRight component to prevent imports bloating
function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}
