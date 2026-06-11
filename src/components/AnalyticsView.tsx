import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadialBarChart,
  RadialBar
} from "recharts";
import { 
  TrendingUp, 
  Flame, 
  Calendar, 
  Award, 
  CheckSquare, 
  Sparkles, 
  Clock, 
  Target, 
  Code,
  Database,
  Tv,
  Coins
} from "lucide-react";
import { getZoho72WeekRoadmap, PHASES } from "../data/roadmapData";
import { DatabaseState } from "../types";

interface AnalyticsViewProps {
  state: DatabaseState;
  
  // Roadmap states
  completedWeeks: number[];
  completedGoals: string[];
  completedResources: string[];
  actualLeetcode: number;
  actualSql: number;
  actualProjects: number;
  actualMocks: number;
  currentWeek: number;
}

export default function AnalyticsView({
  state,
  completedWeeks,
  completedGoals,
  completedResources,
  actualLeetcode,
  actualSql,
  actualProjects,
  actualMocks,
  currentWeek,
}: AnalyticsViewProps) {
  
  const { studySessions } = state;
  const roadmap = getZoho72WeekRoadmap();
  
  // Current active week's target specifications
  const activeWeekData = roadmap.find(w => w.week === currentWeek) || roadmap[0];
  const targetLc = activeWeekData.targetMetrics.leetcode;
  const targetSql = activeWeekData.targetMetrics.sql;
  const targetMocks = activeWeekData.targetMetrics.mockInterviews;

  // 1. Overall Calculations
  const roadmapProgressPercent = Math.round((completedWeeks.length / 72) * 100);
  const completedWeeksCount = completedWeeks.length;
  const remainingWeeksCount = Math.max(0, 72 - completedWeeksCount);

  // 2. Phase-by-Phase Progress
  const phaseChartData = PHASES.map((p) => {
    const phaseWeeks = roadmap.filter((w) => w.phaseId === p.id);
    const phaseDone = phaseWeeks.filter((w) => completedWeeks.includes(w.week)).length;
    const progress = phaseWeeks.length > 0 ? Math.round((phaseDone / phaseWeeks.length) * 100) : 0;
    
    return {
      name: p.title.split(": ")[0], // "Phase 1" etc
      "Progress %": progress,
      "Weeks Completed": phaseDone,
      "Total Weeks": phaseWeeks.length,
      fill: p.color
    };
  });

  // 3. Targets vs Actual Stack (Dual Bar Chart)
  // We showcase current week benchmarks side-by-side with logged actual stats!
  const targetVsActualData = [
    {
      name: "LeetCode",
      Target: targetLc || 10,
      Logged: actualLeetcode
    },
    {
      name: "SQL Queries",
      Target: targetSql || 4,
      Logged: actualSql
    },
    {
      name: "Mock Tests",
      Target: targetMocks || 1,
      Logged: actualMocks
    }
  ];

  // 4. Combined Syllabus Checked Items Counter
  const totalGoalsCount = roadmap.reduce((acc, w) => acc + w.goals.length, 0);
  const totalCompletedGoals = completedGoals.length;
  const syllabusCoveragePercent = totalGoalsCount > 0 
    ? Math.round((totalCompletedGoals / totalGoalsCount) * 100) 
    : 0;

  // 5. Build consistency grid / heatmap (24 week block overview)
  // Let's draw 24 blocks. If a week number in that range is completed, it lights up.
  const heatmapBlocks = Array.from({ length: 72 }, (_, i) => {
    const weekNum = i + 1;
    const isDone = completedWeeks.includes(weekNum);
    const isCurrent = currentWeek === weekNum;

    return {
      week: weekNum,
      done: isDone,
      current: isCurrent
    };
  });

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* 1. HEADER */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <div className="w-1.5 h-6 bg-[#60A5FA] rounded-sm"></div>
          Syllabus Execution Analytics
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Review dynamic mathematical projections, target checklists progress, and consistency heatmap matrices calibrated for Sir's Zoho syllabus.
        </p>
      </div>

      {/* 2. OVERALL SCOREBOARD ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500 font-mono tracking-wider">Overall Roadmap Progress</span>
          <div className="mt-3">
            <span className="text-2xl lg:text-3.5xl font-black font-mono text-white leading-none">
              {roadmapProgressPercent}%
            </span>
            <span className="text-[10px] text-gray-500 block font-semibold font-mono mt-1">Active Weeks Complete</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500 font-mono tracking-wider">Completed Weeks</span>
          <div className="mt-3">
            <span className="text-2xl lg:text-3.5xl font-black font-mono text-emerald-400 leading-none">
              {completedWeeksCount} <span className="text-xs text-gray-500">/ 72</span>
            </span>
            <span className="text-[10px] text-gray-500 block font-semibold font-mono mt-1">Weekly targets met</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500 font-mono tracking-wider">Remaining Curriculum</span>
          <div className="mt-3">
            <span className="text-2xl lg:text-3.5xl font-black font-mono text-[#60A5FA] leading-none">
              {remainingWeeksCount} <span className="text-xs text-gray-500">weeks left</span>
            </span>
            <span className="text-[10px] text-gray-500 block font-semibold font-mono mt-1">Syllabus segments left</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] uppercase font-bold text-gray-500 font-mono tracking-wider">Total Syllabus Coverage</span>
          <div className="mt-3">
            <span className="text-2xl lg:text-3.5xl font-black font-mono text-violet-400 leading-none">
              {syllabusCoveragePercent}%
            </span>
            <span className="text-[10px] text-gray-500 block font-semibold font-mono mt-1">
              {totalCompletedGoals} of {totalGoalsCount} completed
            </span>
          </div>
        </div>

      </div>

      {/* 3. CHART AND HEATMAP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CHART 1: TARGET VS LOGGED PRACTICE (Dual bar chart) */}
        <div className="lg:col-span-7 bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <div>
              <span className="text-[9px] uppercase font-mono text-gray-500 font-bold">Week {currentWeek} metrics evaluation</span>
              <h3 className="text-sm font-bold text-white font-mono flex items-center pr-2 mt-0.5">
                <Target className="h-4.5 w-4.5 text-[#60A5FA] mr-1.5" /> Benchmarks vs Logged Practice
              </h3>
            </div>
            <span className="text-[9px] text-[#34D399] font-mono bg-[#34D399]/5 px-2 py-0.5 border border-[#34D399]/15 rounded font-bold">
              Current Week Frame
            </span>
          </div>

          <p className="text-xs text-gray-400 text-left">
            Comparing week {currentWeek} target guidelines with your actual logged problems in LeetCode, SQL challenges, and mock boards.
          </p>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={targetVsActualData} barGap={6}>
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: "12px" }}
                  labelStyle={{ color: "#9CA3AF", fontSize: "11px", fontWeight: "bold" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "11px", fontFamily: "monospace" }} />
                <Bar dataKey="Target" fill="#374151" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Logged" fill="#60A5FA" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: PHASE METRICS BAR CHART */}
        <div className="lg:col-span-5 bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F2937] pb-3">
            <div>
              <span className="text-[9px] uppercase font-mono text-gray-500 font-bold">Phase completeness metrics</span>
              <h3 className="text-sm font-bold text-white font-mono flex items-center pr-2 mt-0.5">
                <Award className="h-4.5 w-4.5 text-[#FBBF24] mr-1.5" /> Zoho Phase Progress %
              </h3>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-left">
            Proportional progress calculated directly according to syllabus weeks assigned for each phase frame.
          </p>

          <div className="space-y-4.5 pt-2">
            {phaseChartData.map((phase, pIdx) => {
              return (
                <div key={pIdx} className="space-y-1.5 text-left">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="font-bold text-white">{phase.name}</span>
                    <span className="text-gray-400">
                      <strong style={{ color: phase.fill }}>{phase["Progress %"]}%</strong> ({phase["Weeks Completed"]} / {phase["Total Weeks"]} weeks done)
                    </span>
                  </div>
                  <div className="h-2 bg-[#1C2534] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-700"
                      style={{ 
                        width: `${phase["Progress %"]}%`,
                        backgroundColor: phase.fill 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. SYLLABUS CONSISTENCY HEATMAP GRID */}
      <div className="bg-[#111827] border border-[#1F2937] p-6 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1F2937] pb-4 mb-4 text-left">
          <div>
            <span className="text-[9px] uppercase font-mono text-gray-500 font-bold">Continuous learning matrix</span>
            <h3 className="text-sm font-bold text-white font-mono flex items-center pr-2 mt-0.5">
              <Calendar className="h-4.5 w-4.5 text-[#34D399] mr-1.5" /> 72-Week Syllabus Consistency Heatmap
            </h3>
          </div>
          
          <div className="flex items-center space-x-3.5 font-mono text-[9px] text-gray-500">
            <div className="flex items-center space-x-1">
              <div className="w-2.5 h-2.5 rounded bg-[#111827] border border-[#1F2937]" />
              <span>Incomplete</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2.5 h-2.5 rounded bg-[#60A5FA]/20 border border-[#60A5FA]/40 animate-pulse" />
              <span>Current week</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2.5 h-2.5 rounded bg-[#34D399] border border-emerald-500/30" />
              <span>Complete (Verified)</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-left mb-5">
          A physical overview representing all 72 weeks of the Zoho placement preparation roadmap. Light-up tiles signal checked milestones. Reach Week 72 to obtain the clearance index.
        </p>

        {/* Heatmap Grid Wrapper */}
        <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-2">
          {heatmapBlocks.map((block) => {
            return (
              <div
                key={block.week}
                className={`aspect-square sm:p-1.5 p-1 rounded-lg border flex flex-col justify-between text-left transition-all ${
                  block.done 
                    ? "bg-[#34D399] border-emerald-500/25 text-[#0B1120]" 
                    : block.current
                      ? "bg-[#60A5FA]/10 border-[#60A5FA]/50 text-[#60A5FA] ring-[2px] ring-[#60A5FA]/20 animate-pulse"
                      : "bg-[#0B1120] border-[#1F2937] hover:border-gray-500 text-gray-500 hover:text-gray-300"
                }`}
                title={`Week ${block.week}: ${block.done ? "Completed" : block.current ? "Active Study WeekFocus" : "Not yet checked"}`}
              >
                <span className="text-[10px] font-bold font-mono">W{block.week}</span>
                <span className="text-[8px] uppercase tracking-wider font-semibold opacity-50 font-mono text-right block self-end">
                  {block.done ? "✓" : block.current ? "•" : ""}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-5 text-right font-mono text-[9px] text-gray-500 leading-relaxed">
          System telemetry calibrated on {studySessions.length} total active logged study sessions.
        </div>
      </div>

    </div>
  );
}
