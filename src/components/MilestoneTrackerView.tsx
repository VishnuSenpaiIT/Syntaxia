import React from "react";
import { 
  Trophy, 
  Lock, 
  Unlock, 
  CheckCircle, 
  Hourglass, 
  Award, 
  Sparkles, 
  Target, 
  ShieldAlert, 
  Code,
  Milestone
} from "lucide-react";
import { MAJOR_MILESTONES, getZoho72WeekRoadmap, PHASES } from "../data/roadmapData";

interface MilestoneTrackerViewProps {
  currentWeek: number;
  completedWeeks: number[];
}

export default function MilestoneTrackerView({
  currentWeek,
  completedWeeks,
}: MilestoneTrackerViewProps) {
  
  const roadmap = getZoho72WeekRoadmap();

  // Helper to determine milestone state
  const getMilestoneState = (milestoneWeek: number) => {
    // 1. If Vishnu has completed the week of the milestone, or current week is greater
    if (completedWeeks.includes(milestoneWeek) || currentWeek > milestoneWeek) {
      return { status: "completed", label: "Mastered & Complete", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", icon: CheckCircle };
    }
    // 2. If Vishnu is currently on or before the week of the milestone but has it active
    if (currentWeek === milestoneWeek || (currentWeek < milestoneWeek && currentWeek + 4 >= milestoneWeek)) {
      return { status: "active", label: "Active Threshold Focus", color: "text-[#60A5FA] border-blue-500/25 bg-blue-500/5", icon: Hourglass };
    }
    // 3. Locked
    return { status: "locked", label: "Locked Target", color: "text-gray-500 border-[#1F2937] bg-[#111827]/40", icon: Lock };
  };

  const totalMilestonesCount = MAJOR_MILESTONES.length;
  const completedMilestonesCount = MAJOR_MILESTONES.filter(m => 
    completedWeeks.includes(m.week) || currentWeek > m.week
  ).length;

  const progressPercent = Math.round((completedMilestonesCount / totalMilestonesCount) * 100);

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* HEADER WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-amber-500 rounded-sm"></div>
            Zoho Major Milestones Cockpit
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Track your advancement progress through the 8 foundational engineering gateways. Milestones unlock dynamically as you check off weekly syllabus requirements.
          </p>
        </div>

        {/* Milestone summary score card */}
        <div className="bg-[#111827] border border-[#1F2937] p-4.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl">
              <Trophy className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-500 font-bold">Gateways Mastered</span>
              <p className="text-sm font-bold text-white mt-0.5 font-mono">
                {completedMilestonesCount} of 8 Solved
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-amber-400">{progressPercent}%</span>
            <span className="text-[8px] text-gray-500 block uppercase font-mono tracking-widest mt-0.5">Clearing Ratio</span>
          </div>
        </div>
      </div>

      {/* TIMELINE TRACK */}
      <div className="relative">
        {/* Line tracking background (hidden on narrow screens, visible on wider) */}
        <div className="absolute left-[34px] top-10 bottom-10 w-[2px] bg-[#1F2937] hidden md:block" />

        <div className="space-y-4">
          {MAJOR_MILESTONES.map((m, idx) => {
            const state = getMilestoneState(m.week);
            const StateIcon = state.icon;

            // Find matching phase for color coding
            const matchingWeek = roadmap.find(w => w.week === m.week);
            const matchingPhase = PHASES.find(p => p.id === matchingWeek?.phaseId) || PHASES[0];

            return (
              <div 
                key={idx}
                className="flex flex-col md:flex-row gap-5 items-stretch relative group pl-0 md:pl-2"
              >
                {/* Timeline circle node */}
                <div className={`hidden md:flex h-12 w-12 rounded-2xl border items-center justify-center shrink-0 z-10 transition-all ${
                  state.status === "completed" 
                    ? "bg-[#34D399]/10 border-[#34D399] text-[#34D399]" 
                    : state.status === "active"
                      ? "bg-[#60A5FA]/10 border-[#60A5FA] text-[#60A5FA] scale-105 shadow-md shadow-blue-500/5 animate-pulse"
                      : "bg-[#111827] border-[#1F2937] text-gray-600"
                }`}>
                  <StateIcon className="h-5 w-5" />
                </div>

                {/* Milestone main body card container */}
                <div className={`p-5 rounded-2xl border flex-1 text-left relative transition-all flex flex-col md:flex-row justify-between gap-4 ${
                  state.status === "completed"
                    ? "bg-[#111827] border-[#34D399]/15 shadow-sm shadow-[#34D399]/1"
                    : state.status === "active"
                      ? "bg-gradient-to-r from-blue-500/[0.03] to-transparent bg-[#111827] border-blue-500/25"
                      : "bg-[#111827] border-[#1F2937] opacity-60"
                }`}>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold font-mono text-gray-400 bg-[#0B1120] border border-[#1F2937] px-2 py-0.5 rounded uppercase">
                        GATE {idx + 1}
                      </span>
                      <span className="text-[9px] font-mono font-bold uppercase py-0.5 px-2 rounded-full" style={{ backgroundColor: `${matchingPhase.color}15`, color: matchingPhase.color }}>
                        WEEK {m.week} THRESHOLD
                      </span>
                      <span className={`text-[9px] font-mono leading-none lowercase px-2.5 py-1 rounded w-fit capitalize font-bold ${state.color}`}>
                        {state.label}
                      </span>
                    </div>

                    <h3 className={`text-base font-bold tracking-tight ${
                      state.status === "locked" ? "text-gray-400" : "text-white"
                    }`}>
                      {m.title}
                    </h3>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-2xl">
                      {m.description}
                    </p>

                    {/* Progress details of weeks leading here */}
                    {state.status === "active" && (
                      <div className="pt-3.5 flex flex-col space-y-1.5 font-mono text-[10px]">
                        <div className="flex justify-between text-gray-400">
                          <span>Weeks completion pace to this threshold:</span>
                          <span className="text-[#60A5FA] font-bold">
                            {completedWeeks.filter(wNum => wNum <= m.week).length} of {m.week} Weeks Complete
                          </span>
                        </div>
                        <div className="h-1 bg-[#1F2937] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#60A5FA]" 
                            style={{ width: `${(completedWeeks.filter(wNum => wNum <= m.week).length / m.week) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Curricular feedback banner side */}
                  <div className="md:w-56 shrink-0 flex flex-col justify-end text-left md:text-right border-t md:border-t-0 md:border-l border-[#1F2937] pt-4 md:pt-0 md:pl-5 font-mono text-[11px] gap-2.5 min-h-[90px]">
                    <div className="space-y-1">
                      <span className="text-gray-500 block uppercase font-bold text-[8px] tracking-wider">Evaluation Focus</span>
                      <span className="text-gray-200 block font-bold leading-none">
                        {idx === 0 && "Core Java Class Loading"}
                        {idx === 1 && "Matrix, Recursion, Time"}
                        {idx === 2 && "Transactional Joins (ACID)"}
                        {idx === 3 && "Fast Graph & Trie structures"}
                        {idx === 4 && "Execution Index Tuners"}
                        {idx === 5 && "Full Compiler Logic Round 3"}
                        {idx === 6 && "Design Pattern Audits"}
                        {idx === 7 && "Zoho Placement Board Panel"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-500 block uppercase font-bold text-[8px] tracking-wider">L3 Engineering Rating</span>
                      <span className={`block font-extrabold ${
                        state.status === "completed" ? "text-emerald-400" : "text-gray-500"
                      }`}>
                        {state.status === "completed" ? "✓ ACCREDITATION PASSED" : "PENDING EVALUATION"}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
