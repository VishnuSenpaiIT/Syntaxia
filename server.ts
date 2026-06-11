import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { DatabaseState, Phase, Topic, Milestone, Resource, Task, StudySession, Note, Achievement } from "./src/types.js";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

app.use(express.json());

// --- DATABASE Persistence & Initialization ---

function getInitialDBState(): DatabaseState {
  const now = new Date();
  
  // Custom Date Helpers
  const formatOffsetDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split("T")[0];
  };

  const users = [
    {
      id: "1",
      name: "Srivishnu (Sir)",
      email: "vishnusenpaiit@gmail.com"
    }
  ];

  const phases: Phase[] = [
    {
      id: "phase-1",
      title: "Phase 1: Java Mastery & Aptitude Foundation",
      description: "Months 1–3 (Weeks 1–12): Java mastery + daily aptitude habit. Build a direct written round speed-advantage.",
      status: "in_progress",
      startDate: formatOffsetDate(-12),
      targetDate: formatOffsetDate(8),
      progress: 75
    },
    {
      id: "phase-2",
      title: "Phase 2: Full DSA & Core CS Subjects",
      description: "Months 4–9 (Weeks 13–36): Master full A–Z DSA (Striver) + DBMS (Gate Smashers) + OS + OOP Deep Dive. Solve 100+ LeetCode Mediums.",
      status: "in_progress",
      startDate: formatOffsetDate(-3),
      targetDate: formatOffsetDate(25),
      progress: 33
    },
    {
      id: "phase-3",
      title: "Phase 3: Competitive Coding & 3 Real Projects",
      description: "Months 10–13.5 (Weeks 37–54): Rated Codeforces/CodeChef sprints + build 3 high-quality Zoho-relevant Java/Spring REST backends.",
      status: "not_started",
      startDate: formatOffsetDate(10),
      targetDate: formatOffsetDate(30),
      progress: 0
    },
    {
      id: "phase-4",
      title: "Phase 4: Zoho Final Prep & Mock Simulations",
      description: "Months 14–18 (Weeks 55–72): Re-solve past Zoho machine coding (L3), Top 50 SQL, Pramp mock interviews, and earn Zoho Learn Certifications.",
      status: "not_started",
      startDate: formatOffsetDate(20),
      targetDate: formatOffsetDate(40),
      progress: 0
    }
  ];

  const topics: Topic[] = [
    // Phase 1 Topics (Java & Aptitude)
    { id: "topic-1-1", phaseId: "phase-1", title: "OOPs Design Principles & JVM Internals", description: "Inheritance, encapsulation, runtime polymorphism, virtual method dispatch, garbage collection heaps, and stack frames.", progress: 85, category: "Java" },
    { id: "topic-1-2", phaseId: "phase-1", title: "JDK Collections & Hashing Mechanics", description: "Deep dive into HashMap collision resolution treeification, ArrayList capacity growth formulas, LinkedList, and concurrent structures.", progress: 60, category: "Java" },
    { id: "topic-1-3", phaseId: "phase-1", title: "Java Multi-Threading & Exceptions", description: "Thread lifecycle, Runnable vs Thread, synchronized blocks, wait/notify, ReentrantLock, and customException pools.", progress: 10, category: "Java" },

    // Phase 2 Topics (DSA, DBMS, OS)
    { id: "topic-2-1", phaseId: "phase-2", title: "Arrays, Sorting, Two-Pointers & Binary Search", description: "Fast-slow pointers, sliding window, binary search variations, Dutch National Flag, and Merge Sort variants.", progress: 100, category: "DSA" },
    { id: "topic-2-2", phaseId: "phase-2", title: "Stack, Queue, Recursion & Linked Lists", description: "Custom singly & doubly linked lists, queue simulations using arrays, and monotonic stacks.", progress: 30, category: "DSA" },
    { id: "topic-2-3", phaseId: "phase-2", title: "Trees, Heaps, Graphs & DP", description: "Solving backtracking grids, BSTs, level BFS, Dijkstra, and tabulations.", progress: 10, category: "DSA" },
    { id: "topic-2-4", phaseId: "phase-2", title: "RDBMS Normalization & SQL Queries", description: "Decompositions, JOINS, GROUP BY, Window functions, and indexes optimization.", progress: 20, category: "DBMS" },
    { id: "topic-2-5", phaseId: "phase-2", title: "OS Scheduling, Threading & Page Memory", description: "Explain scheduling policies, virtual memory sizing, Bankers deadlock, and memory allocation segments.", progress: 20, category: "OS" },

    // Phase 3 Topics (Competitive & Projects)
    { id: "topic-3-1", phaseId: "phase-3", title: "REST Backend Project 1: Contacts Server", description: "Spring Boot CRUD routes, SQL database connection, JPA query drivers, and testing.", progress: 0, category: "Projects" },
    { id: "topic-3-2", phaseId: "phase-3", title: "REST Backend Project 2: Inventory Tracker", description: "Database schemas, models, complex updates sequences, and GitHub profiling.", progress: 0, category: "Projects" },
    { id: "topic-3-3", phaseId: "phase-3", title: "REST Backend Project 3: Showpiece Helpdesk", description: "Premium JWT security logins, API pagination, and server architectures.", progress: 0, category: "Projects" },

    // Phase 4 Topics (Zoho L3 & Simulations)
    { id: "topic-4-1", phaseId: "phase-4", title: "Railway Reservation System (L3)", description: "Manage berth counts (lower, middle, upper, RAC, waiting), booking priority, cancellations, chart configurations.", progress: 0, category: "Interview Preparation" },
    { id: "topic-4-2", phaseId: "phase-4", title: "Taxi Dispatching Booking (L3)", description: "Manage 4+ taxis, customer booking triggers, nearest distance coordinates calculation, revenue metrics tracker.", progress: 0, category: "Interview Preparation" },
    { id: "topic-4-3", phaseId: "phase-4", title: "Mocks, Resume Polish & Certifications", description: "Live Pramp peer-to-peer technical interview mock assessments and corporate culture STAR answers.", progress: 0, category: "Interview Preparation" }
  ];

  const milestones: Milestone[] = [
    { id: "ms-1", topicId: "topic-1-1", title: "SOLID Master", description: "Design an entire system satisfying all 5 SOLID pillars", status: "completed" },
    { id: "ms-2", topicId: "topic-1-2", title: "Custom HashMap Simulator", description: "Implement collision resolution on buckets", status: "pending" },
    { id: "ms-3", topicId: "topic-2-1", title: "Sliding Window Pro", description: "Solve 15 Sliding window questions on LC", status: "completed" },
    { id: "ms-4", topicId: "topic-4-1", title: "Railway Prototype", description: "Simulate ticket booking loop with RAC logic", status: "pending" }
  ];

  const resources: Resource[] = [
    { id: "res-1", topicId: "topic-1-1", title: "Oracle JVM Architecture Specifications", description: "Official reference manual for JVM memory structures, Heap allocation, and GC parameters.", link: "https://docs.oracle.com/javase/specs/jvms/se19/html/index.html", priority: "high", estimatedHours: 4, completed: true },
    { id: "res-2", topicId: "topic-1-1", title: "Refactoring Guru - Behavioral & Creational Patterns", description: "Visual explanation of Factory, Singleton, Observer, and Strategy patterns with Java code.", link: "https://refactoring.guru/design-patterns", priority: "medium", estimatedHours: 6, completed: true },
    { id: "res-3", topicId: "topic-1-2", title: "Deep-Dive HashMap Source Code Analysis", description: "A comprehensive look at bin treeification under JDK 8 collisions.", link: "https://openjdk.org/projects/jdk/", priority: "high", estimatedHours: 3, completed: false },
    { id: "res-4", topicId: "topic-2-1", title: "NeetCode 150 Core DSA Checklist", description: "A highly structured visual index of all major DSA patterns with detailed video solutions.", link: "https://neetcode.io/practice", priority: "high", estimatedHours: 12, completed: true },
    { id: "res-5", topicId: "topic-2-3", title: "Recursion & Backtracking Masterclass", description: "Intuitive strategies to solve complex recursion trees and state-pruning backtracking grids.", link: "https://leetcode.com/discuss/study-guide/1405817/backtracking-template", priority: "medium", estimatedHours: 5, completed: false },
    { id: "res-6", topicId: "topic-4-1", title: "Zoho Advanced Round Past Booking Prompts", description: "Historical description of ticket counters, waitlists, lower-berth quotas for senior citizens.", link: "https://www.geeksforgeeks.org/zoho-interview-experience/", priority: "high", estimatedHours: 8, completed: false }
  ];

  const tasks: Task[] = [
    { id: "task-1", phaseId: "phase-1", topicId: "topic-1-1", milestoneId: "ms-1", title: "Model Parking Lot Design in Java", description: "Define class hierarchies, abstract billing, and thread-safe spot allocations.", status: "completed", dueDate: formatOffsetDate(-8), completedAt: formatOffsetDate(-8) },
    { id: "task-2", phaseId: "phase-1", topicId: "topic-1-1", milestoneId: null, title: "Analyse GC pause benchmarks manually", description: "Compare G1 GC vs ZGC pause thresholds under massive Linked List loads.", status: "completed", dueDate: formatOffsetDate(-3), completedAt: formatOffsetDate(-4) },
    { id: "task-3", phaseId: "phase-1", topicId: "topic-1-2", milestoneId: "ms-2", title: "Build custom ArrayList with auto-resize", description: "Override add, delete, set, trimToSize and verify capacity doubling metrics.", status: "pending", dueDate: formatOffsetDate(2), completedAt: null },
    { id: "task-4", phaseId: "phase-2", topicId: "topic-2-1", milestoneId: "ms-3", title: "Solve 'Longest Substring Without Repeating Characters'", description: "Implement O(N) slider using analytical HashMap positions on Leetcode.", status: "completed", dueDate: formatOffsetDate(-1), completedAt: formatOffsetDate(-1) },
    { id: "task-5", phaseId: "phase-2", topicId: "topic-2-3", milestoneId: null, title: "Write dynamic N-Queens console print loop", description: "Verify backtrack branching limits by logging coordinate matrices.", status: "pending", dueDate: formatOffsetDate(5), completedAt: null },
    { id: "task-6", phaseId: "phase-4", topicId: "topic-4-1", milestoneId: "ms-4", title: "Implement booking RAC fallback priority array", description: "Write priority booking algorithm for senior citizens and females.", status: "pending", dueDate: formatOffsetDate(12), completedAt: null }
  ];

  // Pre-seed some study sessions for beautiful analytics graphs
  const studySessions: StudySession[] = [
    { id: "sess-1", topicId: "topic-1-1", date: formatOffsetDate(-7), hours: 2, minutes: 30, notes: "Exploration of Class loaders, Java Stack allocations and Heap segments. Set up standard garbage logger.", sessionType: "Java Warmup" },
    { id: "sess-2", topicId: "topic-2-5", date: formatOffsetDate(-6), hours: 1, minutes: 45, notes: "Solved work equivalence equations and relative downstream boat rates.", sessionType: "Aptitude Test" },
    { id: "sess-3", topicId: "topic-2-1", date: formatOffsetDate(-5), hours: 3, minutes: 15, notes: "Coded dynamic sliding window trackers. Solved 4 Medium issues related to subarray constraints.", sessionType: "DSA Practice" },
    { id: "sess-4", topicId: "topic-1-1", date: formatOffsetDate(-4), hours: 2, minutes: 0, notes: "Architected custom SOLID Parking Lot system. Designed interface separations for vehicle size constraints.", sessionType: "Java Warmup" },
    { id: "sess-5", topicId: "topic-1-2", date: formatOffsetDate(-3), hours: 1, minutes: 30, notes: "Diagrammed resize index hash treeification on JDK 8 hashmap structures.", sessionType: "Notes Review" },
    { id: "sess-6", topicId: "topic-2-1", date: formatOffsetDate(-2), hours: 2, minutes: 45, notes: "Investigated dutch-flag partitioning speed records under low auxiliary space conditions.", sessionType: "DSA Practice" },
    { id: "sess-7", topicId: "topic-1-3", date: formatOffsetDate(-1), hours: 1, minutes: 15, notes: "Completed matrix index circles and blood relative connections challenges.", sessionType: "Aptitude Test" },
    { id: "sess-8", topicId: "topic-1-1", date: formatOffsetDate(0), hours: 3, minutes: 0, notes: "Worked on simulated deadlock conditions and thread monitor locks.", sessionType: "Java Warmup" }
  ];

  const notes: Note[] = [
    {
      id: "note-1",
      title: "Java Memory Layout Explained",
      content: "## Java Memory Diagnostics\n\nTo troubleshoot stack-overflow vs heap leaks during Zoho advanced coding rounds:\n\n### 1. Stack Allocation\n- Stores call frames, local variables, primitives.\n- Highly performant. Bound directly to thread lifespans.\n- Uncontrolled recursive loops will trigger `java.lang.StackOverflowError`.\n\n### 2. Heap Allocation\n- Stores dynamic objects class instances, JDK assemblies (`HashMap`, `ArrayList`).\n- Managed dynamically by garbage collectors (e.g. G1 GC).\n- If memory references are leaked inside infinite lists: `java.lang.OutOfMemoryError: Java heap space`.",
      tags: ["Java", "JVM", "Memory"],
      topicId: "topic-1-1",
      createdAt: formatOffsetDate(-10),
      updatedAt: formatOffsetDate(-10)
    },
    {
      id: "note-2",
      title: "Optimized Sliding Window Concept",
      content: "## The Sliding Window Template\n\nUseful for solving substrings or subsegments with maximum lengths or coordinate checks inside O(N) speed limits.\n\n```java\nint left = 0;\nint right = 0;\nMap<Character, Integer> counts = new HashMap<>();\nint maxLength = 0;\n\nwhile (right < array.length) {\n    char c = array[right];\n    counts.put(c, counts.getOrDefault(c, 0) + 1);\n    \n    while (counts.get(c) > limit) { // Shrink barrier\n        char l = array[left];\n        counts.put(l, counts.get(l) - 1);\n        left++;\n    }\n    \n    maxLength = Math.max(maxLength, right - left + 1);\n    right++;\n}\n```",
      tags: ["DSA", "LeetCode", "TwoPointers"],
      topicId: "topic-2-1",
      createdAt: formatOffsetDate(-5),
      updatedAt: formatOffsetDate(-5)
    },
    {
      id: "note-3",
      title: "Zoho Past Round: Railway Reservation Breakdown",
      content: "## Zoho Railway Round Notes\n\n### Core Rules Required:\n1. **Total Berths**: 63 (e.g. Upper: 21, Middle: 21, Lower: 21).\n2. **RAC Count**: 18. **Waiting List (WL)**: 10.\n3. **Seat allocation logic**:\n   - Lower berth holds priority for Senior Citizens (>60 yrs) and Ladies.\n   - If lower is empty/vacated, dispatch to priority.\n   - If all berths full, book RAC (Side-lower seats shared by two persons).\n   - If RAC full, allocate WL.\n4. **Cancellation Rules**:\n   - WL cancellation pulls up next WL.\n   - RAC cancellation promotes next RAC to confirmed berth, next WL shifts to RAC.",
      tags: ["Interview Prep", "L3", "Railway"],
      topicId: "topic-4-1",
      createdAt: formatOffsetDate(-1),
      updatedAt: formatOffsetDate(-1)
    }
  ];

  const achievements: Achievement[] = [
    { id: "ach-1", title: "First Ascent", description: "Logged your very first active study session inside Syntaxia.", badge: "Flame", unlocked: true, unlockedAt: formatOffsetDate(-7), criteriaType: "session_count", criteriaValue: 1 },
    { id: "ach-2", title: "Streak Master", description: "Achieved a solid 5-day continuous learning streak.", badge: "Target", unlocked: true, unlockedAt: formatOffsetDate(-1), criteriaType: "streak", criteriaValue: 5 },
    { id: "ach-3", title: "Lorekeeper", description: "Wrote 3 high-quality markdown learning notes inside resource logs.", badge: "BookOpen", unlocked: true, unlockedAt: formatOffsetDate(-1), criteriaType: "notes_count", criteriaValue: 3 },
    { id: "ach-4", title: "L3 Prototype Builder", description: "Inaugurated preparation for Railway, Taxi Booking or Splitwise modules.", badge: "Award", unlocked: false, unlockedAt: null, criteriaType: "phase_count", criteriaValue: 4 },
    { id: "ach-5", title: "Grind Commenced", description: "Logged more than 15 hours of cumulative learning and coding.", badge: "BarChart3", unlocked: true, unlockedAt: formatOffsetDate(0), criteriaType: "hours_count", criteriaValue: 10 },
    { id: "ach-6", title: "SQL Legend", description: "Completed all DBMS SQL queries benchmarks on schema optimization.", badge: "Database", unlocked: false, unlockedAt: null, criteriaType: "tasks_count", criteriaValue: 5 }
  ];

  return {
    users,
    phases,
    topics,
    milestones,
    resources,
    tasks,
    studySessions,
    notes,
    achievements
  };
}

// Read database file
function loadDatabase(): DatabaseState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load local DB file, creating initial state", error);
  }
  const initialState = getInitialDBState();
  saveDatabase(initialState);
  return initialState;
}

// Save database file
function saveDatabase(state: DatabaseState): void {
  try {
    const parentDir = path.dirname(DB_FILE);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write state into local DB:", error);
  }
}

// Recalculates topic progress values and phase progress values whenever components shift
function triggerProgressRecalculations(state: DatabaseState): DatabaseState {
  // 1. Calculate Topic Progress
  // Topic progress is the ratio of completed tasks + completed resources belonging to this topic
  state.topics.forEach((topic) => {
    const topicTasks = state.tasks.filter((t) => t.topicId === topic.id);
    const topicResources = state.resources.filter((r) => r.topicId === topic.id);
    
    const totalItems = topicTasks.length + topicResources.length;
    if (totalItems === 0) {
      topic.progress = 0;
      return;
    }
    
    const completedItems = 
      topicTasks.filter((t) => t.status === "completed").length +
      topicResources.filter((r) => r.completed).length;
      
    topic.progress = Math.round((completedItems / totalItems) * 100);
  });

  // 2. Calculate Phase Progress
  // Phase progress is the average of progress of topics belonging to this phase
  state.phases.forEach((phase) => {
    const phaseTopics = state.topics.filter((t) => t.phaseId === phase.id);
    if (phaseTopics.length === 0) {
      phase.progress = 0;
      return;
    }
    const totalProgress = phaseTopics.reduce((acc, curr) => acc + curr.progress, 0);
    phase.progress = Math.round(totalProgress / phaseTopics.length);

    // Auto-update status if 100% completed
    if (phase.progress === 100 && phase.status !== "completed") {
      phase.status = "completed";
    } else if (phase.progress > 0 && phase.progress < 100 && phase.status === "not_started") {
      phase.status = "in_progress";
    }
  });

  return state;
}

// Check and dynamically unlock achievements based on user metrics
function triggerAchievementChecks(state: DatabaseState): DatabaseState {
  const totalSessions = state.studySessions.length;
  const totalNotes = state.notes.length;
  const totalCompletedTasks = state.tasks.filter(t => t.status === "completed").length;
  
  const totalHours = state.studySessions.reduce((acc, s) => acc + s.hours + (s.minutes / 60), 0);

  state.achievements.forEach(ach => {
    if (ach.unlocked) return;

    let shouldUnlock = false;
    if (ach.criteriaType === "session_count" && totalSessions >= ach.criteriaValue) {
      shouldUnlock = true;
    } else if (ach.criteriaType === "notes_count" && totalNotes >= ach.criteriaValue) {
      shouldUnlock = true;
    } else if (ach.criteriaType === "tasks_count" && totalCompletedTasks >= ach.criteriaValue) {
      shouldUnlock = true;
    } else if (ach.criteriaType === "hours_count" && totalHours >= ach.criteriaValue) {
      shouldUnlock = true;
    }

    if (shouldUnlock) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString().split("T")[0];
    }
  });

  return state;
}

// --- API Implementation ---

// Authentication Gate Endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  // Private Study OS admin check
  if (email === "admin@syntaxia.dev" && password === "syntaxia2026") {
    res.json({
      success: true,
      token: "syntaxia_secure_private_token_2026",
      user: {
        id: "1",
        name: "Srivishnu (Sir)",
        email: "vishnusenpaiit@gmail.com"
      }
    });
  } else {
    res.status(401).json({ error: "Invalid administrative credentials for your private OS." });
  }
});

// Load state
app.get("/api/state", (req, res) => {
  const state = loadDatabase();
  res.json(state);
});

// Create study session
app.post("/api/study-sessions", (req, res) => {
  const state = loadDatabase();
  const sessionData = req.body;
  const newSession: StudySession = {
    id: `sess-${Date.now()}`,
    topicId: sessionData.topicId,
    date: sessionData.date || new Date().toISOString().split("T")[0],
    hours: Number(sessionData.hours || 0),
    minutes: Number(sessionData.minutes || 0),
    notes: sessionData.notes || "",
    sessionType: sessionData.sessionType || "Study Session"
  };

  state.studySessions.push(newSession);
  
  // Progress & achievement triggers
  const stateAfterProgress = triggerProgressRecalculations(state);
  const stateChecked = triggerAchievementChecks(stateAfterProgress);
  
  saveDatabase(stateChecked);
  res.status(201).json(newSession);
});

// Delete study session
app.delete("/api/study-sessions/:id", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  state.studySessions = state.studySessions.filter(s => s.id !== id);
  saveDatabase(state);
  res.json({ success: true });
});

// Create tasks
app.post("/api/tasks", (req, res) => {
  const state = loadDatabase();
  const taskData = req.body;
  
  const newTask: Task = {
    id: `task-${Date.now()}`,
    phaseId: taskData.phaseId || "phase-1",
    topicId: taskData.topicId,
    milestoneId: taskData.milestoneId || null,
    title: taskData.title,
    description: taskData.description || "",
    status: taskData.status || "pending",
    dueDate: taskData.dueDate || new Date().toISOString().split("T")[0],
    completedAt: taskData.status === "completed" ? new Date().toISOString().split("T")[0] : null
  };

  state.tasks.push(newTask);
  
  // Recalculately progress
  const adjustedState = triggerProgressRecalculations(state);
  const checkedState = triggerAchievementChecks(adjustedState);
  saveDatabase(checkedState);
  
  res.status(201).json(newTask);
});

// Update task status (completing/failing)
app.put("/api/tasks/:id", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  const updates = req.body;

  const taskIndex = state.tasks.findIndex(t => t.id === id);
  if (taskIndex !== -1) {
    state.tasks[taskIndex] = {
      ...state.tasks[taskIndex],
      ...updates,
      completedAt: updates.status === "completed" ? new Date().toISOString().split("T")[0] : null
    };

    const adjustedState = triggerProgressRecalculations(state);
    const checkedState = triggerAchievementChecks(adjustedState);
    saveDatabase(checkedState);
    res.json(state.tasks[taskIndex]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  state.tasks = state.tasks.filter(t => t.id !== id);
  const adjustedState = triggerProgressRecalculations(state);
  saveDatabase(adjustedState);
  res.json({ success: true });
});

// Toggle Resource Completed status
app.put("/api/resources/:id/toggle", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  const resIndex = state.resources.findIndex(r => r.id === id);
  if (resIndex !== -1) {
    state.resources[resIndex].completed = !state.resources[resIndex].completed;
    const adjustedState = triggerProgressRecalculations(state);
    saveDatabase(adjustedState);
    res.json(state.resources[resIndex]);
  } else {
    res.status(404).json({ error: "Resource not found" });
  }
});

// Add Resource
app.post("/api/resources", (req, res) => {
  const state = loadDatabase();
  const rData = req.body;
  const newRes: Resource = {
    id: `res-${Date.now()}`,
    topicId: rData.topicId,
    title: rData.title,
    description: rData.description || "",
    link: rData.link || "#",
    priority: rData.priority || "medium",
    estimatedHours: Number(rData.estimatedHours || 1),
    completed: false
  };

  state.resources.push(newRes);
  const adjustedState = triggerProgressRecalculations(state);
  saveDatabase(adjustedState);
  res.status(201).json(newRes);
});

// Delete Resource
app.delete("/api/resources/:id", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  state.resources = state.resources.filter(r => r.id !== id);
  const adjustedState = triggerProgressRecalculations(state);
  saveDatabase(adjustedState);
  res.json({ success: true });
});

// Toggle Milestone
app.put("/api/milestones/:id/toggle", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  const msIndex = state.milestones.findIndex(m => m.id === id);
  if (msIndex !== -1) {
    state.milestones[msIndex].status = state.milestones[msIndex].status === "completed" ? "pending" : "completed";
    saveDatabase(state);
    res.json(state.milestones[msIndex]);
  } else {
    res.status(404).json({ error: "Milestone not found" });
  }
});

// Create note
app.post("/api/notes", (req, res) => {
  const state = loadDatabase();
  const noteData = req.body;
  const newNote: Note = {
    id: `note-${Date.now()}`,
    title: noteData.title,
    content: noteData.content || "",
    tags: noteData.tags || [],
    topicId: noteData.topicId,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0]
  };

  state.notes.push(newNote);
  const checkedState = triggerAchievementChecks(state);
  saveDatabase(checkedState);
  res.status(201).json(newNote);
});

// Update note
app.put("/api/notes/:id", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  const updates = req.body;
  const idx = state.notes.findIndex(n => n.id === id);
  if (idx !== -1) {
    state.notes[idx] = {
      ...state.notes[idx],
      ...updates,
      updatedAt: new Date().toISOString().split("T")[0]
    };
    saveDatabase(state);
    res.json(state.notes[idx]);
  } else {
    res.status(404).json({ error: "Note not found" });
  }
});

// Delete note
app.delete("/api/notes/:id", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  state.notes = state.notes.filter(n => n.id !== id);
  saveDatabase(state);
  res.json({ success: true });
});

// Dynamic Phase target setter or manager
app.put("/api/phases/:id", (req, res) => {
  const state = loadDatabase();
  const { id } = req.params;
  const updates = req.body;
  const idx = state.phases.findIndex(p => p.id === id);
  if (idx !== -1) {
    state.phases[idx] = {
      ...state.phases[idx],
      ...updates
    };
    saveDatabase(state);
    res.json(state.phases[idx]);
  } else {
    res.status(404).json({ error: "Phase not found" });
  }
});

// Reset or Reseed entire roadmap
app.post("/api/reset", (req, res) => {
  const initialState = getInitialDBState();
  saveDatabase(initialState);
  res.json({ success: true, message: "Roadmap has been successfully re-seeded from source Zoho blueprint." });
});



// --- Vite & Static Asset Handling Integration ---

async function startServer() {
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYNTAXIA] Single-user learning OS running on port ${PORT}`);
  });
}

startServer();
