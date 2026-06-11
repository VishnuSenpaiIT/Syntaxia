import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Route,
  BookOpen,
  CheckSquare,
  Clock,
  FileText,
  BarChart2,
  Trophy,
  Sparkles,
  Settings,
  LogOut,
  User,
  Activity,
  Menu,
  X,
  RefreshCw,
  FolderLock,
  Map,
} from "lucide-react";

import { DatabaseState, Phase, Resource, Task } from "./types";
import LoginGate from "./components/LoginGate";
import DashboardView from "./components/DashboardView";
import RoadmapView from "./components/RoadmapView";
import ResourceVaultView from "./components/ResourceVaultView";
import MilestoneTrackerView from "./components/MilestoneTrackerView";
import TaskTrackerView from "./components/TaskTrackerView";
import StudySessionsView from "./components/StudySessionsView";
import NotesView from "./components/NotesView";
import AnalyticsView from "./components/AnalyticsView";
import FullView from "./components/FullView";


export default function App() {
  // Auth Session state
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Active Screen Panel
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Master State database
  const [dbState, setDbState] = useState<DatabaseState | null>(null);
  const [loadingDb, setLoadingDb] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 72-Week Zoho tracker variables
  const [currentWeek, setCurrentWeek] = useState<number>(() => {
    return Number(localStorage.getItem("syntaxia_current_week") || "1");
  });
  const [completedWeeks, setCompletedWeeks] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("syntaxia_completed_weeks") || "[]");
    } catch {
      return [];
    }
  });
  const [completedGoals, setCompletedGoals] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("syntaxia_completed_goals") || "[]");
    } catch {
      return [];
    }
  });
  const [completedResources, setCompletedResources] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("syntaxia_completed_resources") || "[]");
    } catch {
      return [];
    }
  });
  const [weeklyNotes, setWeeklyNotes] = useState<Record<number, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem("syntaxia_weekly_notes") || "{}");
    } catch {
      return {};
    }
  });

  // Micro practice logs values
  const [actualLeetcode, setActualLeetcode] = useState<number>(() => {
    return Number(localStorage.getItem("syntaxia_actual_leetcode") || "12");
  });
  const [actualSql, setActualSql] = useState<number>(() => {
    return Number(localStorage.getItem("syntaxia_actual_sql") || "4");
  });
  const [actualProjects, setActualProjects] = useState<number>(() => {
    return Number(localStorage.getItem("syntaxia_actual_projects") || "1");
  });
  const [actualMocks, setActualMocks] = useState<number>(() => {
    return Number(localStorage.getItem("syntaxia_actual_mocks") || "0");
  });

  // Sync to Storage
  useEffect(() => {
    localStorage.setItem("syntaxia_current_week", String(currentWeek));
  }, [currentWeek]);

  useEffect(() => {
    localStorage.setItem("syntaxia_completed_weeks", JSON.stringify(completedWeeks));
  }, [completedWeeks]);

  useEffect(() => {
    localStorage.setItem("syntaxia_completed_goals", JSON.stringify(completedGoals));
  }, [completedGoals]);

  useEffect(() => {
    localStorage.setItem("syntaxia_completed_resources", JSON.stringify(completedResources));
  }, [completedResources]);

  useEffect(() => {
    localStorage.setItem("syntaxia_weekly_notes", JSON.stringify(weeklyNotes));
  }, [weeklyNotes]);

  useEffect(() => {
    localStorage.setItem("syntaxia_actual_leetcode", String(actualLeetcode));
  }, [actualLeetcode]);

  useEffect(() => {
    localStorage.setItem("syntaxia_actual_sql", String(actualSql));
  }, [actualSql]);

  useEffect(() => {
    localStorage.setItem("syntaxia_actual_projects", String(actualProjects));
  }, [actualProjects]);

  useEffect(() => {
    localStorage.setItem("syntaxia_actual_mocks", String(actualMocks));
  }, [actualMocks]);

  // Handle active checklist modifications
  const toggleWeekCompletion = (wNum: number) => {
    setCompletedWeeks((prev) =>
      prev.includes(wNum) ? prev.filter((x) => x !== wNum) : [...prev, wNum]
    );
  };

  const toggleGoalCompletion = (gKey: string) => {
    setCompletedGoals((prev) =>
      prev.includes(gKey) ? prev.filter((x) => x !== gKey) : [...prev, gKey]
    );
  };

  const toggleResourceCompletion = (resKey: string) => {
    setCompletedResources((prev) =>
      prev.includes(resKey) ? prev.filter((x) => x !== resKey) : [...prev, resKey]
    );
  };

  const handleResetAllProgress = async () => {
    // 1. Reset Database State on Server
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (res.ok) {
        await fetchState();
      }
    } catch (e) {
      console.error("Failed to reset backend database state:", e);
    }

    // 2. Clear all local storage keys
    localStorage.removeItem("syntaxia_current_week");
    localStorage.removeItem("syntaxia_completed_weeks");
    localStorage.removeItem("syntaxia_completed_goals");
    localStorage.removeItem("syntaxia_completed_resources");
    localStorage.removeItem("syntaxia_weekly_notes");
    localStorage.removeItem("syntaxia_actual_leetcode");
    localStorage.removeItem("syntaxia_actual_sql");
    localStorage.removeItem("syntaxia_actual_projects");
    localStorage.removeItem("syntaxia_actual_mocks");
    localStorage.removeItem("syntaxia_custom_resources");
    localStorage.removeItem("syntaxia_db_state");
    localStorage.removeItem("syntaxia_db_mutations");

    // 3. Reset all client-side states to starting defaults
    setCompletedWeeks([]);
    setCompletedGoals([]);
    setCompletedResources([]);
    setWeeklyNotes({});
    setActualLeetcode(12);
    setActualSql(4);
    setActualProjects(1);
    setActualMocks(0);
    setCurrentWeek(1);
  };

  const handleAddCustomResource = (newRes: any) => {
    // Custom callbacks hook if required
  };

  // Hydrate admin session from cache
  useEffect(() => {
    const cachedToken = localStorage.getItem("syntaxia_token");
    const cachedUser = localStorage.getItem("syntaxia_user");
    if (cachedToken && cachedUser) {
      setToken(cachedToken);
      setUser(JSON.parse(cachedUser));
    }
    setCheckingSession(false);
  }, []);

  // Fetch complete DB state — merges API seed data with any localStorage mutations
  // This makes the app fully work on Vercel (stateless serverless) and locally.
  const fetchState = async () => {
    setLoadingDb(true);
    setErr(null);
    try {
      const response = await fetch("/api/state");
      if (!response.ok) throw new Error("Server returned non-OK response.");
      const text = await response.text();
      // Guard against Vercel returning HTML on API miss
      if (text.trim().startsWith("<") || text.trim().startsWith("T")) {
        throw new Error("API returned HTML instead of JSON.");
      }
      const seedData: DatabaseState = JSON.parse(text);

      // Merge with any localStorage-persisted mutations
      const localMutations = localStorage.getItem("syntaxia_db_mutations");
      if (localMutations) {
        const mutations = JSON.parse(localMutations);
        // Overlay mutations on top of seed data
        const merged: DatabaseState = {
          ...seedData,
          notes: mutations.notes ?? seedData.notes,
          tasks: mutations.tasks ?? seedData.tasks,
          studySessions: mutations.studySessions ?? seedData.studySessions,
          resources: mutations.resources ?? seedData.resources,
          milestones: mutations.milestones ?? seedData.milestones,
        };
        setDbState(merged);
      } else {
        setDbState(seedData);
      }
    } catch (error: any) {
      console.warn("API fetch failed, using localStorage cache:", error.message);
      // Fallback: try cached state from localStorage
      const cached = localStorage.getItem("syntaxia_db_state");
      if (cached) {
        setDbState(JSON.parse(cached));
      } else {
        setErr("Could not load data. Please check your connection.");
      }
    } finally {
      setLoadingDb(false);
    }
  };

  // Persist dbState to localStorage whenever it changes (so Vercel mutations survive)
  useEffect(() => {
    if (dbState) {
      localStorage.setItem("syntaxia_db_state", JSON.stringify(dbState));
      // Also save mutable portions separately for merge on next load
      const mutations = {
        notes: dbState.notes,
        tasks: dbState.tasks,
        studySessions: dbState.studySessions,
        resources: dbState.resources,
        milestones: dbState.milestones,
      };
      localStorage.setItem("syntaxia_db_mutations", JSON.stringify(mutations));
    }
  }, [dbState]);

  // Pull state once authorized
  useEffect(() => {
    if (token) {
      fetchState();
    }
  }, [token]);

  // Auth logins Callback
  const handleLoginSuccess = (newToken: string, newUser: { name: string; email: string }) => {
    setToken(newToken);
    setUser(newUser);
  };

  // Clear Session Logout
  const handleLogout = () => {
    localStorage.removeItem("syntaxia_token");
    localStorage.removeItem("syntaxia_user");
    setToken(null);
    setUser(null);
    setActiveView("dashboard");
    setDbState(null);
  };

  // --- API STATE ALTERATIONS WRAPPER HANDLERS ---

  // Database seed reset
  const handleResetDatabase = async () => {
    try {
      const res = await fetch("/api/reset", { method: "POST" });
      if (!res.ok) throw new Error("Error performing hardware reset on database state.");
      await fetchState();
    } catch (e: any) {
      alert(e.message);
    }
  };

  // Update Phase
  const handleUpdatePhase = async (phaseId: string, updates: Partial<Phase>) => {
    try {
      const res = await fetch(`/api/phases/${phaseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Could not update phase settings.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Toggle sub-milestone completion
  const handleToggleMilestone = async (milestoneId: string) => {
    try {
      const res = await fetch(`/api/milestones/${milestoneId}/toggle`, {
        method: "PUT"
      });
      if (!res.ok) throw new Error("Could not toggle milestone status.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Log active study duration session
  const handleLogStudySession = async (sessionData: {
    topicId: string;
    hours: number;
    minutes: number;
    notes: string;
    sessionType: string;
    date: string;
  }) => {
    try {
      const res = await fetch("/api/study-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sessionData),
      });
      if (!res.ok) throw new Error("Could not record clock hours in study logs.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Delete Study Session log
  const handleDeleteStudySession = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/study-sessions/${sessionId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not prune study log.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Create Task
  const handleAddTask = async (taskData: {
    phaseId: string;
    topicId: string;
    milestoneId: string | null;
    title: string;
    description: string;
    dueDate: string;
  }) => {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
      if (!res.ok) throw new Error("Failed to register scheduled task.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Update Task parameters
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to alter specific task status.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Could not clear task assignment.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Insert Learning Reference
  const handleAddResource = async (rData: {
    topicId: string;
    title: string;
    description: string;
    link: string;
    priority: "low" | "medium" | "high";
    estimatedHours: number;
  }) => {
    try {
      const res = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rData),
      });
      if (!res.ok) throw new Error("Failed to index resource block.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Toggle library completed marks
  const handleToggleResource = async (resId: string) => {
    try {
      const res = await fetch(`/api/resources/${resId}/toggle`, { method: "PUT" });
      if (!res.ok) throw new Error("Failed to toggle resource complete.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Delete Reference
  const handleDeleteResource = async (resId: string) => {
    try {
      const res = await fetch(`/api/resources/${resId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to prune resource documentation references.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Write Note
  const handleAddNote = async (noteData: {
    title: string;
    content: string;
    tags: string[];
    topicId: string;
  }) => {
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteData),
      });
      if (!res.ok) throw new Error("Failed to write note card.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Update Note Content
  const handleUpdateNote = async (noteId: string, updates: Partial<{ title: string; content: string; tags: string[]; topicId: string }>) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to log edits to note metadata.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Delete note from vault
  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove note card.");
      await fetchState();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  // Fallback and loading gates
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center font-sans">
        <div className="text-center space-y-3 font-mono text-xs text-gray-500">
          <RefreshCw className="h-5 w-5 animate-spin mx-auto text-blue-500" />
          <p>Decrypting study session structures...</p>
        </div>
      </div>
    );
  }

  // Auth gate check
  if (!token) {
    return <LoginGate onLoginSuccess={handleLoginSuccess} />;
  }

  // Pre-hydration fallback view
  if (!dbState) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center font-sans">
        <div className="text-center space-y-4 font-mono text-xs text-gray-400">
          <Activity className="h-6 w-6 animate-pulse mx-auto text-[#34D399]" />
          <p>Connecting to secure databases state...</p>
          {err && <p className="text-red-400">Connection error: {err}</p>}
          <button
            onClick={fetchState}
            className="px-3.5 py-1.5 bg-[#111827] border border-[#1F2937] hover:border-gray-500 rounded text-xs text-gray-200 mt-2 hover:text-white transition cursor-pointer"
          >
            Retry Database Handshake
          </button>
        </div>
      </div>
    );
  }

  // Bottom tab items (5 primary for mobile)
  const primaryTabs = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    { id: "fullview", label: "Journey", icon: Map },
    { id: "roadmap", label: "Syllabus", icon: Route },
    { id: "analytics", label: "Stats", icon: BarChart2 },
    { id: "__more__", label: "More", icon: Menu },
  ];

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "fullview", label: "Full View Journey", icon: Map },
    { id: "roadmap", label: "Zoho Syllabus", icon: Route },
    { id: "resources", label: "Resource Vault", icon: BookOpen },
    { id: "milestones", label: "Milestones Track", icon: Trophy },
    { id: "analytics", label: "Syllabus Stats", icon: BarChart2 },
    { id: "notes", label: "Knowledge Base", icon: FileText },
  ];

  const moreItems = [
    { id: "resources", label: "Resource Vault", icon: BookOpen },
    { id: "milestones", label: "Milestones Track", icon: Trophy },
    { id: "notes", label: "Knowledge Base", icon: FileText },
    { id: "settings", label: "Config Panel", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0B1120] text-[#F9FAFB] flex flex-col font-sans selection:bg-[#60A5FA]/30">

      {/* ════ MOBILE BOTTOM SHEET (More) ════ */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-[#111827] border-t border-[#1F2937] rounded-t-3xl pb-[calc(64px+env(safe-area-inset-bottom))] pt-4 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 bg-gray-700 rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-3 mb-5 px-1">
              <div className="w-8 h-8 rounded-full bg-[#60A5FA] flex items-center justify-center font-bold text-xs text-[#0B1120] shrink-0">
                {user?.name ? user.name.substring(0, 2).toUpperCase() : "SR"}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{user?.name || "Srivishnu"}</p>
                <p className="text-xs text-gray-500 font-mono">Active Session</p>
              </div>
              {loadingDb && <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#60A5FA] ml-auto" />}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left border cursor-pointer ${
                      isActive
                        ? "bg-indigo-500/15 border-indigo-500/30 text-[#60A5FA]"
                        : "bg-[#0B1120] border-[#1F2937] text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-400 bg-red-950/20 border border-red-900/40 cursor-pointer"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="text-xs font-semibold">Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* ════ MOBILE TOP STATUS BAR ════ */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 bg-[#0B1120]/95 backdrop-blur-md border-b border-[#1F2937]"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)", paddingBottom: "10px" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-[#60A5FA] rounded-sm" />
          <span className="text-sm font-bold font-mono tracking-widest text-[#60A5FA]">SYNTAXIA</span>
          <span className="text-[10px] font-mono text-gray-500 ml-1">
            {navItems.find(n => n.id === activeView)?.label || ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {loadingDb && <RefreshCw className="h-3 w-3 animate-spin text-[#60A5FA]" />}
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            W{currentWeek}
          </span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ════ DESKTOP LEFT SIDEBAR ════ */}
        <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-[#0B1120] border-r border-[#1F2937] flex-col justify-between z-40">
          <div>
            {/* Branding */}
            <div className="p-6">
              <h1 className="text-xl font-bold tracking-tighter text-[#60A5FA] flex items-center gap-2">
                <div className="w-3 h-3 bg-[#60A5FA] rounded-sm" />
                SYNTAXIA
              </h1>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-semibold">Private Personal OS</p>
            </div>

            {/* Profile badge */}
            <div className="px-4 pb-4 border-b border-[#1F2937]/50">
              <div className="flex items-center gap-3 bg-[#111827] p-2 rounded-lg border border-[#1F2937]">
                <div className="w-8 h-8 rounded-full bg-[#60A5FA] flex items-center justify-center font-bold text-xs text-[#0B1120]">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : "SR"}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white leading-tight">{user?.name || "Admin"}</p>
                  <p className="text-[10px] text-gray-500 leading-none mt-1">Active Today</p>
                </div>
              </div>
            </div>

            {/* Navigation list */}
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[55vh]">
              {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-[#1F2937] text-[#60A5FA] border border-[#303e50]"
                        : "text-gray-400 hover:text-white hover:bg-[#111827] border border-transparent"
                    }`}
                    id={`side-nav-${item.id}`}
                  >
                    <IconComponent className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Desktop footer */}
          <div className="p-4 border-t border-[#1F2937] bg-[#0B1120]/15 space-y-2">
            <button
              onClick={() => setActiveView("settings")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                activeView === "settings"
                  ? "bg-[#1F2937] text-[#60A5FA] border border-[#303e50]"
                  : "text-gray-400 hover:text-white hover:bg-[#111827] border border-transparent"
              }`}
              id="side-nav-settings"
            >
              <Settings className="h-4 w-4 text-gray-500 shrink-0" />
              <span>Config Panel</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-950/15 transition-all text-left cursor-pointer border border-transparent"
              id="logout-btn"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out Session</span>
            </button>
          </div>
        </aside>

        {/* ════ MAIN CONTENT ════ */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0B1120] lg:ml-64">
          
          {/* Desktop top header */}
          <header className="hidden lg:flex h-16 border-b border-[#1F2937] items-center justify-between px-8 bg-[#0B1120] shrink-0">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-200">Welcome back, Architect.</span>
              <span className="text-[11px] text-gray-500">Build. Learn. Improve. Track.</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                <span className="text-xs font-mono text-[#60A5FA]">ZOHO_PREP_ENGINE_V1.0.4</span>
              </div>
              <div className="text-xs border border-[#1F2937] px-3 py-1 rounded-full text-gray-400 font-mono">
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          </header>

          {/* Scroll area — with padding for mobile top bar and bottom nav */}
          <div
            className="flex-1 overflow-y-auto relative"
            style={{
              paddingTop: "env(safe-area-inset-top)",
              paddingBottom: 0,
            }}
          >
            <div className="p-3 pt-16 lg:pt-0 lg:p-8 pb-0">
              {err && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-between">
                  <span>⚠️ {err}</span>
                  <button onClick={() => setErr(null)} className="text-[10px] uppercase font-mono font-bold underline cursor-pointer">Dismiss</button>
                </div>
              )}

              <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6" style={{ paddingBottom: "calc(80px + env(safe-area-inset-bottom))" }}>

                {activeView === "dashboard" && (
                  <DashboardView
                    state={dbState}
                    currentWeek={currentWeek}
                    setCurrentWeek={setCurrentWeek}
                    completedWeeks={completedWeeks}
                    toggleWeekCompletion={toggleWeekCompletion}
                    completedGoals={completedGoals}
                    toggleGoalCompletion={toggleGoalCompletion}
                    completedResources={completedResources}
                    toggleResourceCompletion={toggleResourceCompletion}
                    actualLeetcode={actualLeetcode}
                    setActualLeetcode={setActualLeetcode}
                    actualSql={actualSql}
                    setActualSql={setActualSql}
                    actualProjects={actualProjects}
                    setActualProjects={setActualProjects}
                    actualMocks={actualMocks}
                    setActualMocks={setActualMocks}
                    onNavigate={(v) => setActiveView(v)}
                  />
                )}

                {activeView === "fullview" && (
                  <FullView
                    state={dbState}
                    currentWeek={currentWeek}
                    setCurrentWeek={setCurrentWeek}
                    completedWeeks={completedWeeks}
                    toggleWeekCompletion={toggleWeekCompletion}
                    completedGoals={completedGoals}
                    toggleGoalCompletion={toggleGoalCompletion}
                    completedResources={completedResources}
                    toggleResourceCompletion={toggleResourceCompletion}
                    weeklyNotes={weeklyNotes}
                    setWeeklyNotes={setWeeklyNotes}
                    actualLeetcode={actualLeetcode}
                    actualSql={actualSql}
                    actualProjects={actualProjects}
                    actualMocks={actualMocks}
                  />
                )}

                {activeView === "roadmap" && (
                  <RoadmapView
                    state={dbState}
                    currentWeek={currentWeek}
                    setCurrentWeek={setCurrentWeek}
                    completedWeeks={completedWeeks}
                    toggleWeekCompletion={toggleWeekCompletion}
                    completedGoals={completedGoals}
                    toggleGoalCompletion={toggleGoalCompletion}
                    completedResources={completedResources}
                    toggleResourceCompletion={toggleResourceCompletion}
                    weeklyNotes={weeklyNotes}
                    setWeeklyNotes={setWeeklyNotes}
                    onResetAllProgress={handleResetAllProgress}
                  />
                )}

                {activeView === "resources" && (
                  <ResourceVaultView
                    state={dbState}
                    completedResources={completedResources}
                    toggleResourceCompletion={toggleResourceCompletion}
                    onAddCustomResource={handleAddCustomResource}
                  />
                )}

                {activeView === "milestones" && (
                  <MilestoneTrackerView
                    currentWeek={currentWeek}
                    completedWeeks={completedWeeks}
                  />
                )}

                {activeView === "notes" && (
                  <NotesView
                    state={dbState}
                    onAddNote={handleAddNote}
                    onUpdateNote={handleUpdateNote}
                    onDeleteNote={handleDeleteNote}
                  />
                )}

                {activeView === "analytics" && (
                  <AnalyticsView
                    state={dbState}
                    completedWeeks={completedWeeks}
                    completedGoals={completedGoals}
                    completedResources={completedResources}
                    actualLeetcode={actualLeetcode}
                    actualSql={actualSql}
                    actualProjects={actualProjects}
                    actualMocks={actualMocks}
                    currentWeek={currentWeek}
                  />
                )}

                {activeView === "settings" && (
                  <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 space-y-6 text-left">
                    <div>
                      <h2 className="text-xl font-bold text-white tracking-tight font-mono flex items-center">
                        <FolderLock className="h-5 w-5 text-[#60A5FA] mr-2" /> Application System Settings &amp; Scopes
                      </h2>
                      <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                        Overview of single-user container credentials and persistent storage configurations.
                      </p>
                    </div>

                    <div className="pt-3">
                      <div className="p-4 bg-[#0B1120] border border-[#1F2937] rounded-xl space-y-3.5 w-full">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#60A5FA] font-bold">
                          ADMINISTRATOR SESSION DETAILS
                        </span>
                        <div className="space-y-1.5 text-xs font-mono">
                          <p className="text-gray-400">Account Username: <strong className="text-white">Srivishnu (Sir)</strong></p>
                          <p className="text-gray-400">Security Email: <strong className="text-white">admin@syntaxia.dev</strong></p>
                          <p className="text-gray-400 font-mono">Node Database: <strong className="text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded leading-none text-[10px]">db.json (Active)</strong></p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#0B1120] border border-[#1F2937] rounded-xl space-y-2.5">
                      <h4 className="text-xs font-bold text-white font-mono flex items-center">
                        <Trophy className="h-4 w-4 text-[#60A5FA] mr-2" /> Zoho advanced interview evaluation directives
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans">
                        Zoho places massive emphasis on absolute working logic. In Round 2 (Advanced), your output is audited for completeness, class hierarchy partitioning (OOD), dynamic space allocations, and memory containment. Keep log study sessions updated to maintain streak achievements.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ════ MOBILE BOTTOM TAB BAR ════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1526]/95 backdrop-blur-xl border-t border-[#1F2937]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-center justify-around h-16">
          {primaryTabs.map((tab) => {
            const Icon = tab.icon;
            const isMore = tab.id === "__more__";
            const isActive = isMore ? mobileMenuOpen : activeView === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isMore) {
                    setMobileMenuOpen(!mobileMenuOpen);
                  } else {
                    setActiveView(tab.id);
                    setMobileMenuOpen(false);
                  }
                }}
                className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full relative cursor-pointer transition-all"
                id={`bottom-tab-${tab.id}`}
              >
                {/* Active glow dot */}
                {isActive && (
                  <span className="absolute top-1.5 w-5 h-0.5 rounded-full bg-[#60A5FA]" />
                )}
                <Icon
                  className={`h-5 w-5 transition-all ${
                    isActive ? "text-[#60A5FA] scale-110" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-[10px] font-medium transition-all ${
                    isActive ? "text-[#60A5FA] font-bold" : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
