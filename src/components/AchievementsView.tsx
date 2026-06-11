import { Achievement } from "../types";
import { Sparkles, Trophy, ShieldAlert, BadgeCheck, Flame, BookOpen, Target, Award, BarChart3, Database } from "lucide-react";

interface AchievementsViewProps {
  state: { achievements: Achievement[] };
}

export default function AchievementsView({ state }: AchievementsViewProps) {
  const { achievements } = state;

  // Map badge string to Lucide icon definitions cleanly
  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Flame":
        return Flame;
      case "Target":
        return Target;
      case "BookOpen":
        return BookOpen;
      case "Award":
        return Award;
      case "BarChart3":
        return BarChart3;
      case "Database":
        return Database;
      default:
        return Trophy;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const ratingPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header and Summary stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight font-mono">Curricular Achievement Badges</h2>
          <p className="text-xs text-gray-400">
            Gamify your interview preparations cycle. Unlocking trophies signifies concrete curriculum checkpoints.
          </p>
        </div>

        {/* Milestone gauge */}
        <div className="bg-[#111827] border border-[#1F2937] p-4.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-yellow-500/10 border border-yellow-505/20 text-yellow-400 rounded-xl">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">Trophy Rank</span>
              <p className="text-sm font-bold text-white mt-0.5">
                {unlockedCount} of {achievements.length} Unlocked
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold font-mono text-blue-400">{ratingPercent}%</span>
            <span className="text-[9px] text-gray-500 block uppercase font-mono tracking-widest mt-0.5">Rank Score</span>
          </div>
        </div>

      </div>

      {/* Grid of badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((ach) => {
          const IconComponent = getBadgeIcon(ach.badge);
          const isUnlocked = ach.unlocked;

          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border text-center transition-all relative flex flex-col items-center justify-between ${
                isUnlocked
                  ? "bg-gradient-to-b from-[#111827] to-[#1F2937]/20 border-yellow-500/20 shadow-lg shadow-yellow-500/2"
                  : "bg-[#111827] border-[#1F2937] opacity-60"
              }`}
            >
              <div className="flex flex-col items-center">
                {/* Badge Circle container */}
                <div className={`p-4 rounded-3xl mb-4 border transition-transform ${
                  isUnlocked
                    ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 scale-105"
                    : "bg-[#0B1120] border-[#1F2937] text-gray-600"
                }`}>
                  <IconComponent className="h-8 w-8" />
                </div>

                <h4 className={`text-sm font-bold tracking-tight ${isUnlocked ? "text-white" : "text-gray-400"}`}>
                  {ach.title}
                </h4>

                <p className="text-xs text-gray-400 mt-2 text-center max-w-xs leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Status flag bottom */}
              <div className="mt-5 pt-3 border-t border-[#1F2937]/50 w-full flex items-center justify-center space-x-1.5 text-[10px] font-mono uppercase tracking-wider">
                {isUnlocked ? (
                  <>
                    <BadgeCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Earned {ach.unlockedAt}</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-4 w-4 text-gray-600" />
                    <span className="text-gray-500">Locked Task</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
