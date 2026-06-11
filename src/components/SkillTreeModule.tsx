import React, { useState, useMemo, useRef, useEffect } from "react";
import { 
  Trophy, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Lock, 
  Activity, 
  Award,
  Sparkles,
  Flame,
  Search,
  Maximize2,
  Minimize2,
  RefreshCw,
  Layers,
  ChevronRight,
  Zap,
  Play,
  Hammer,
  GraduationCap,
  Sliders,
  Compass,
  ArrowRight,
  Coffee,
  Swords,
  Database,
  Cpu,
  GitMerge,
  Grid,
  Type,
  Boxes,
  Settings,
  List,
  Link2,
  Hourglass,
  Undo2,
  Hash,
  GitFork,
  Network,
  Triangle,
  TrendingUp,
  ShieldAlert,
  FileCheck2,
  Terminal,
  CornerDownLeft,
  Calculator,
  AlertTriangle,
  Disc,
  FileText,
  Users,
  Plus,
  Minus,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getZoho72WeekRoadmap, MAJOR_MILESTONES, CuratedResource } from "../data/roadmapData";
import { DatabaseState } from "../types";

interface SkillTreeModuleProps {
  state: DatabaseState;
  currentWeek: number;
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

// Visual Node representation interface
interface SkillNode {
  id: string;
  label: string;
  category: "Java" | "DSA" | "Database" | "OS" | "Projects" | "Interview" | "Root" | "Ultimate";
  description: string;
  weekRange: string;
  weeks: number[]; // associated curriculum week numbers
  prerequisites: string[];
  isLegendary?: boolean;
  x: number; // visual coordinates for layouts
  y: number;
  details: {
    objectives: string;
    goals: string[];
    resources: { name: string; priority: string; url: string; time: string }[];
  };
}

export default function SkillTreeModule({
  state,
  currentWeek,
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
}: SkillTreeModuleProps) {

  // Load standard raw syllabus to sync resources/details where applicable
  const originalRoadmap = useMemo(() => getZoho72WeekRoadmap(), []);

  // 1. CHOOSE ZOOM & PAN STATE
  const [scale, setScale] = useState<number>(0.4);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 260, y: 30 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string>("root-journey");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  
  // View Representation Mode Toggle state
  const [viewMode, setViewMode] = useState<"map" | "rows">("map");
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Celebration state
  const [celebrationEvent, setCelebrationEvent] = useState<{
    type: 'level' | 'badge';
    title: string;
    subtitle: string;
    icon: string;
  } | null>(null);

  // Minimap Dragging interactions state
  const minimapContainerRef = useRef<HTMLDivElement>(null);
  const [isMinimapDragging, setIsMinimapDragging] = useState<boolean>(false);

  // XP Toast Trigger Animations
  const [activeXpToast, setActiveXpToast] = useState<{ xp: number; label: string } | null>(null);

  // Filter paths search query
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Refs for tracking interaction boards
  const canvasRef = useRef<HTMLDivElement>(null);

  // Synchronous visual nodes representation (RPG grid layout positions customized for space optimization)
  const skillNodes: SkillNode[] = useMemo(() => [
    {
      id: "root-journey",
      label: "🌱 BEGIN JOURNEY",
      category: "Root",
      description: "Initialize your 72-Week personal training roadmap.",
      weekRange: "Week 1",
      weeks: [1],
      prerequisites: [],
      x: 750,
      y: 50,
      details: {
        objectives: "Grasp code execution logic, JVM compilation pipelines, and register on core platforms.",
        goals: [
          "Understand difference between compile-time and runtime execution",
          "Setup IntelliJ IDEA or VC Code + JDK 17+",
          "Write simple I/O console scan tasks in Java"
        ],
        resources: [
          { name: "Kunal Kushwaha Java Basics", priority: "high", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", time: "10 hrs" }
        ]
      }
    },

    // ================== JAVA PATH (Column X = 100) ==================
    {
      id: "java-basics",
      label: "Java Basics",
      category: "Java",
      description: "Data types, operations, and variables allocation.",
      weekRange: "Weeks 1-2",
      weeks: [1, 2],
      prerequisites: ["root-journey"],
      x: 150,
      y: 210,
      details: {
        objectives: "Master structural variables modeling and input logic casting.",
        goals: ["Declare variables using primitive bounds", "Construct standard Scanner tools", "Complete 5 basic operations code"],
        resources: [{ name: "W3Schools Java Tutorial", priority: "medium", url: "https://www.w3schools.com/java/", time: "3 hrs" }]
      }
    },
    {
      id: "java-control-flow",
      label: "Control Flow",
      category: "Java",
      description: "If-conditions, Switch branches, and logical pattern loops.",
      weekRange: "Week 2",
      weeks: [2],
      prerequisites: ["java-basics"],
      x: 150,
      y: 330,
      details: {
        objectives: "Drive repetitive execution sequences safely.",
        goals: ["Construct while and do-while loops with termination states", "Solve pyramid pattern printing puzzles", "Understand break & continue limits"],
        resources: [{ name: "Telusko Java Loops Guide", priority: "medium", url: "https://www.youtube.com/playlist?list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5", time: "4 hrs" }]
      }
    },
    {
      id: "java-arrays",
      label: "Basic Arrays",
      category: "Java",
      description: "Dynamic vectors, indices lookups, and swaps actions.",
      weekRange: "Week 3",
      weeks: [3],
      prerequisites: ["java-control-flow"],
      x: 150,
      y: 450,
      details: {
        objectives: "Allocate linear memory slots and index them efficiently.",
        goals: ["Write in-place array reversals", "Code standard linear search loops", "Construct simple matrix multiplication models"],
        resources: [{ name: "HackerRank Java Array Submissions", priority: "high", url: "https://www.hackerrank.com/domains/java", time: "5 hrs" }]
      }
    },
    {
      id: "java-strings",
      label: "Strings Pool",
      category: "Java",
      description: "Immutability rules, String Constant Pool pool, and StringBuilder buffers.",
      weekRange: "Week 4",
      weeks: [4],
      prerequisites: ["java-arrays"],
      x: 150,
      y: 570,
      details: {
        objectives: "Manage character buffers without inflating memory heap spaces.",
        goals: ["Inspect why String pool variables reject edits", "Write palindromes checking algorithms", "Utilize StringBuilder to concat loops in O(N)"],
        resources: [{ name: "Kunal Kushwaha Strings deep dive", priority: "high", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", time: "6 hrs" }]
      }
    },
    {
      id: "java-oop-foundations",
      label: "OOP Foundations",
      category: "Java",
      description: "Classes structure, instance objects, and constructors overload.",
      weekRange: "Week 5",
      weeks: [5],
      prerequisites: ["java-strings"],
      x: 150,
      y: 690,
      details: {
        objectives: "Represent real structures inside secure object containers.",
        goals: ["Declare attributes with private access protection", "Initialize custom objects using overloaded constructor parameters", "Sync state setters with safety ranges"],
        resources: [{ name: "GFG Object Oriented programming in Java", priority: "high", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", time: "5 hrs" }]
      }
    },
    {
      id: "java-inheritance",
      label: "Inheritance Code",
      category: "Java",
      description: "Extend behaviors, super declarations, and parent allocations.",
      weekRange: "Week 6",
      weeks: [6],
      prerequisites: ["java-oop-foundations"],
      x: 150,
      y: 810,
      details: {
        objectives: "Structure logical database classifications using child extensions.",
        goals: ["Create parent-child class structures", "Deconstruct dynamic scope using 'super'", "Prevent subclasses overrides with 'final' modifiers"],
        resources: [{ name: "Telusko OOP Series", priority: "medium", url: "https://www.youtube.com/playlist?list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5", time: "4 hrs" }]
      }
    },
    {
      id: "java-polymorphism",
      label: "Polymorphism",
      category: "Java",
      description: "Method overloading vs dynamic method dispatch runtime.",
      weekRange: "Week 6",
      weeks: [6],
      prerequisites: ["java-inheritance"],
      x: 150,
      y: 930,
      details: {
        objectives: "Configure runtime code triggers based on live object schemas.",
        goals: ["Program overload methods containing varied parameters", "Inspect virtual methods tables dispatch rules", "Deduce late-binding variables override loops"],
        resources: [{ name: "Kunal Kushwaha OOP Poly walkthrough", priority: "high", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", time: "5 hrs" }]
      }
    },
    {
      id: "java-abstraction",
      label: "Abstraction",
      category: "Java",
      description: "Hiding internal features with Abstract blueprints.",
      weekRange: "Week 7",
      weeks: [7],
      prerequisites: ["java-polymorphism"],
      x: 150,
      y: 1050,
      details: {
        objectives: "Enforce uniform behavior across separate models.",
        goals: ["Compose abstract parent templates holding concrete routines", "Verify instance limitations of abstract classes", "Deconstruct state boundaries within design contracts"],
        resources: [{ name: "GFG Java Abstraction", priority: "medium", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", time: "3 hrs" }]
      }
    },
    {
      id: "java-interfaces",
      label: "Interfaces",
      category: "Java",
      description: "100% abstract interface contracts and multiple integrations rules.",
      weekRange: "Week 7",
      weeks: [7],
      prerequisites: ["java-abstraction"],
      x: 150,
      y: 1170,
      details: {
        objectives: "Decouple services architecture using functional interface specifications.",
        goals: ["Program multiple interfaces on a single class structure", "Expose default and static utility interfaces helpers", "Verify why multiple inheritance uses interfaces specifically"],
        resources: [{ name: "W3Schools Interface guidelines", priority: "medium", url: "https://www.w3schools.com/java/", time: "2 hrs" }]
      }
    },
    {
      id: "java-collections",
      label: "Collections Framework",
      category: "Java",
      description: "ArrayLists vectors, HashSets bins, and List/Set containers.",
      weekRange: "Week 8",
      weeks: [8],
      prerequisites: ["java-interfaces"],
      x: 150,
      y: 1290,
      details: {
        objectives: "Manage variable sizing memory chains efficiently.",
        goals: ["Utilize dynamic ArrayList insertions", "Identify how HashSet eliminates duplicate elements in O(1)", "Write custom Comparable sort rules"],
        resources: [{ name: "HackerRank Collections Exercises", priority: "high", url: "https://www.hackerrank.com/domains/java", time: "6 hrs" }]
      }
    },
    {
      id: "java-generics",
      label: "Generics System",
      category: "Java",
      description: "Type safety compile barriers, wildcards, and typed wrappers.",
      weekRange: "Week 9",
      weeks: [9],
      prerequisites: ["java-collections"],
      x: 150,
      y: 1410,
      details: {
        objectives: "Ensure strict variable type validation during compiling.",
        goals: ["Create custom typed generic collections", "Understand extends/super wildcard limits", "Avoid runtime ClassCastException crashes"],
        resources: [{ name: "Kunal Kushwaha Generics analysis", priority: "high", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", time: "5 hrs" }]
      }
    },
    {
      id: "java-mastery",
      label: "📘 JAVA MASTERY",
      category: "Java",
      description: "Full Phase 1 certified standard Java competency checkpoint.",
      weekRange: "Week 12",
      weeks: [12],
      prerequisites: ["java-generics"],
      isLegendary: true,
      x: 150,
      y: 1530,
      details: {
        objectives: "Ready to deploy complex nested custom services.",
        goals: ["Successfully complete HackerRank Java track certificates", "Write complete memory-optimized terminal CRM utilities", "Execute timed Java written mock tests"],
        resources: [{ name: "Syntaxia Custom Java Final Exams", priority: "high", url: "https://www.hackerrank.com/domains/java", time: "7 hrs" }]
      }
    },

    // ================== DSA PATH (Column X = 350) ==================
    {
      id: "dsa-arrays",
      label: "DSA Arrays",
      category: "DSA",
      description: "Big O metrics, sliding windows, and index pointer mechanics.",
      weekRange: "Weeks 13-14",
      weeks: [13, 14],
      prerequisites: ["root-journey"],
      x: 350,
      y: 210,
      details: {
        objectives: "Optimize array processes from brute-force down to linear speeds.",
        goals: ["Master Two Sum, Contains Duplicate, and Stock Buy/Sell", "Optimize loops to O(1) extra space complexity", "Apply sliding windows to capture sub-regions"],
        resources: [{ name: "Striver's A2Z DSA Arrays Sheet", priority: "high", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "12 hrs" }]
      }
    },
    {
      id: "dsa-strings",
      label: "DSA Strings",
      category: "DSA",
      description: "Anagrams evaluation, substring hashing indexes, and reverse logic.",
      weekRange: "Week 15",
      weeks: [15],
      prerequisites: ["dsa-arrays"],
      x: 350,
      y: 330,
      details: {
        objectives: "Manipulate text segments without producing bloated garbage pools.",
        goals: ["Program character hashing count arrays in O(N)", "Solve Valid Anagram and Longest Common Prefix", "Structure string segmentations with zero extra leaks"],
        resources: [{ name: "LeetCode String Study Sheet", priority: "medium", url: "https://leetcode.com/", time: "10 hrs" }]
      }
    },
    {
      id: "dsa-linkedlists",
      label: "Linked Lists",
      category: "DSA",
      description: "Pointer re-linkings, double loops detection, and nodes deletion.",
      weekRange: "Weeks 16-17",
      weeks: [16, 17],
      prerequisites: ["dsa-strings"],
      x: 350,
      y: 450,
      details: {
        objectives: "Traverse non-contiguous memory blocks through manual node allocations.",
        goals: ["Reverse a singly Linked List iteratively", "Program Floyd's Cycle visual loop detectors", "Merge sorted chains using pointer updates"],
        resources: [{ name: "Striver's Linked List Course", priority: "high", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "10 hrs" }]
      }
    },
    {
      id: "dsa-stacks",
      label: "Stacks Structures",
      category: "DSA",
      description: "LIFO structures, expression parsing, and parenthesis balance checks.",
      weekRange: "Week 17",
      weeks: [17],
      prerequisites: ["dsa-linkedlists"],
      x: 350,
      y: 570,
      details: {
        objectives: "Evaluate nested expression scoping safely.",
        goals: ["Solve Valid Parentheses with stack lists", "Code standard Min-Stack custom structures", "Examine Next Greater Element patterns"],
        resources: [{ name: "LeetCode Stack Collection", priority: "medium", url: "https://leetcode.com/", time: "8 hrs" }]
      }
    },
    {
      id: "dsa-queues",
      label: "Queues Buffers",
      category: "DSA",
      description: "FIFO pipelines, sliding window maximums, and circular buffers.",
      weekRange: "Week 18",
      weeks: [18],
      prerequisites: ["dsa-stacks"],
      x: 350,
      y: 690,
      details: {
        objectives: "Maintain clean ordering structures for sequentially incoming queries.",
        goals: ["Program Queue layouts using custom integer arrays", "Implement Queue modules using Stacks", "Solve basic LRU Cache configurations"],
        resources: [{ name: "Striver's Stack & Queue tutorials", priority: "medium", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "6 hrs" }]
      }
    },
    {
      id: "dsa-recursion",
      label: "Core Recursion",
      category: "DSA",
      description: "Back-tracing stack frames, recursion base limits, and branches.",
      weekRange: "Weeks 18-19",
      weeks: [18, 19],
      prerequisites: ["dsa-queues"],
      x: 350,
      y: 810,
      details: {
        objectives: "Deconstruct complicated operations into simple repetitive tasks.",
        goals: ["Trace memory recursion call footprints on paper", "Solve subset generation lists", "Master Fibonacci and factorial recursion structures"],
        resources: [{ name: "Kunal Kushwaha Recursion Playlist", priority: "high", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", time: "12 hrs" }]
      }
    },
    {
      id: "dsa-backtracking",
      label: "Backtracking",
      category: "DSA",
      description: "N-Queens grids, sudoku validators, and paths searches.",
      weekRange: "Week 19",
      weeks: [19],
      prerequisites: ["dsa-recursion"],
      x: 350,
      y: 930,
      details: {
        objectives: "Navigate complicated tree paths and undo changes on deadends.",
        goals: ["Solve N-Queens solver layouts", "Program Sudoku board compilers", "Generate all permutations of array strings"],
        resources: [{ name: "Striver's Backtracking series", priority: "high", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "10 hrs" }]
      }
    },
    {
      id: "dsa-binary-search",
      label: "Binary Search",
      category: "DSA",
      description: "O(log N) splits, division indicators, and answer optimizations.",
      weekRange: "Week 20",
      weeks: [20],
      prerequisites: ["dsa-backtracking"],
      x: 350,
      y: 1050,
      details: {
        objectives: "Lookup targets within sorted databases with extreme speed.",
        goals: ["Flawlessly write standard BS without index leaks", "Solve search in Rotated Sorted Arrays", "Apply BS-on-answers to verify limits"],
        resources: [{ name: "Striver's Binary Search Sheet", priority: "high", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "12 hrs" }]
      }
    },
    {
      id: "dsa-hashing",
      label: "Hashing Tables",
      category: "DSA",
      description: "Collisions prevention rules, bucket index mappings, and custom caches.",
      weekRange: "Week 21",
      weeks: [21],
      prerequisites: ["dsa-binary-search"],
      x: 350,
      y: 1170,
      details: {
        objectives: "Retrieve database profiles instantly in custom applications.",
        goals: ["Examine hash code collision routes", "Solve Top K Frequent Elements queries", "Design custom HashMap databases schemas"],
        resources: [{ name: "LeetCode Hashing Map challenges", priority: "medium", url: "https://leetcode.com/", time: "8 hrs" }]
      }
    },
    {
      id: "dsa-trees",
      label: "Binary Trees",
      category: "DSA",
      description: "DFS Pre/In/Post traversals and Level order BFS queues.",
      weekRange: "Week 22",
      weeks: [22],
      prerequisites: ["dsa-hashing"],
      x: 350,
      y: 1290,
      details: {
        objectives: "Verify structural linkages and heights inside branches representations.",
        goals: ["Write DFS tree traversations recursively", "Implement BFS scans using Queue lists", "Calculate Binary Tree max depth bounds"],
        resources: [{ name: "Kunal Kushwaha Trees guide", priority: "high", url: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", time: "10 hrs" }]
      }
    },
    {
      id: "dsa-bst",
      label: "Binary Search Tree",
      category: "DSA",
      description: "Search trees rules, child shifts, and minimum lookup calculations.",
      weekRange: "Week 23",
      weeks: [23],
      prerequisites: ["dsa-trees"],
      x: 350,
      y: 1410,
      details: {
        objectives: "Maintain automatically ordered data nodes for retrieval speed.",
        goals: ["Validate user BST configurations", "Design BST node deletion logic steps", "Identify Lowest Common Ancestor on a BST"],
        resources: [{ name: "Striver's BST course module", priority: "medium", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "8 hrs" }]
      }
    },
    {
      id: "dsa-heaps",
      label: "Heaps Structures",
      category: "DSA",
      description: "Min/Max heaps indexes, priorities trees, and Heap Sort runs.",
      weekRange: "Week 24",
      weeks: [24],
      prerequisites: ["dsa-bst"],
      x: 350,
      y: 1530,
      details: {
        objectives: "Maintain dynamic sorting models over fast incoming values streams.",
        goals: ["Build dynamic min-heap models inside standard arrays", "Solve Kth Largest Element inside array lists", "Implement manual Heap Sort sequences"],
        resources: [{ name: "LeetCode Priority Queue cards", priority: "medium", url: "https://leetcode.com/", time: "8 hrs" }]
      }
    },
    {
      id: "dsa-graphs",
      label: "Graph Algorithms",
      category: "DSA",
      description: "Adjacency maps, Dijkstra shortest paths, and Topological Sort schedules.",
      weekRange: "Weeks 25-26",
      weeks: [25, 26],
      prerequisites: ["dsa-heaps"],
      x: 350,
      y: 1650,
      details: {
        objectives: "Establish optimal connective route paths across node grids.",
        goals: ["Program BFS/DFS on adjacency matrices", "Implement Dijkstra's shortest path metrics", "Apply Topological Sort to determine prerequisite calendars"],
        resources: [{ name: "Striver's Graph Playlist", priority: "high", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "14 hrs" }]
      }
    },
    {
      id: "dsa-dp",
      label: "Dynamic Programming",
      category: "DSA",
      description: "Optimal sub-states, memoized arrays, and tabulation matrices.",
      weekRange: "Weeks 27-28",
      weeks: [27, 28],
      prerequisites: ["dsa-graphs"],
      x: 350,
      y: 1770,
      details: {
        objectives: "Consolidated calculations speeds by caching partial results.",
        goals: ["Solve climbing stairs sequences dynamically", "Optimize House Robber paths using local stores", "Program Longest Common Subsequence matrix metrics"],
        resources: [{ name: "Striver's Dynamic Programming Playlist", priority: "high", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "16 hrs" }]
      }
    },
    {
      id: "dsa-mastery",
      label: "⚔ DSA WARRIOR MAP",
      category: "DSA",
      description: "Solve 150+ LeetCode milestones with complete system optimizations.",
      weekRange: "Week 36",
      weeks: [36],
      prerequisites: ["dsa-dp"],
      isLegendary: true,
      x: 350,
      y: 1890,
      details: {
        objectives: "Verify complete algorithmic readiness against hard interviewer challenges.",
        goals: ["Pushed clean recursive DSA repositories to GitHub", "Run timed 3-hour mixed DSA simulator test", "Achieve O(1) space optimizations on sorting sequences"],
        resources: [{ name: "Striver A2Z final assessments", priority: "high", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", time: "15 hrs" }]
      }
    },

    // ================== DATABASE PATH (Column X = 550) ==================
    {
      id: "db-basics",
      label: "DBMS Basics",
      category: "Database",
      description: "Relational models, tables design, and keys mapping.",
      weekRange: "Week 29",
      weeks: [29],
      prerequisites: ["root-journey"],
      x: 550,
      y: 210,
      details: {
        objectives: "Organize persistent storage with consistent schema templates.",
        goals: ["Differentiate primary, foreign, and candidate keys", "Deconstruct relational database tables structures", "Draw safe ER-diagrams for dynamic stores"],
        resources: [{ name: "Gate Smashers DBMS Course", priority: "high", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y", time: "6 hrs" }]
      }
    },
    {
      id: "db-normalization",
      label: "Normalization",
      category: "Database",
      description: "Eliminate duplicates anomalies using 1NF, 2NF, 3NF and BCNF.",
      weekRange: "Week 29",
      weeks: [29],
      prerequisites: ["db-basics"],
      x: 550,
      y: 330,
      details: {
        objectives: "Protect databases schemas from update anomalies and functional dependency leaks.",
        goals: ["Decompose tables down to Third Normal Form", "Evaluate candidate key dependencies manually", "Understand lossy vs lossless grid splits"],
        resources: [{ name: "Gate Smashers Normalization guide", priority: "high", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y", time: "5 hrs" }]
      }
    },
    {
      id: "db-sql-basics",
      label: "SQL Basics",
      category: "Database",
      description: "SELECT commands, WHERE filtering lists, and aggregate calculations.",
      weekRange: "Week 30",
      weeks: [30],
      prerequisites: ["db-normalization"],
      x: 550,
      y: 450,
      details: {
        objectives: "Extract records cleanly from database boards.",
        goals: ["Draft primary SQL SELECT searches", "Filter groups using WHERE statements", "Count/Sum records with aggregate checks"],
        resources: [{ name: "SQLZoo interactive tutorials", priority: "high", url: "https://sqlzoo.net/", time: "4 hrs" }]
      }
    },
    {
      id: "db-joins",
      label: "Complex JOINS",
      category: "Database",
      description: "Cross-table linkage checks: INNER, LEFT, RIGHT and FULL.",
      weekRange: "Week 30",
      weeks: [30],
      prerequisites: ["db-sql-basics"],
      x: 550,
      y: 570,
      details: {
        objectives: "Construct comprehensive reporting structures by connecting isolated tables logs.",
        goals: ["Compose INNER and OUTER join loops on SQL boards", "Explain left vs right datasets differences verbally", "Solve multiple tables joining puzzles"],
        resources: [{ name: "HackerRank SQL joins track", priority: "high", url: "https://www.hackerrank.com/domains/sql", time: "6 hrs" }]
      }
    },
    {
      id: "db-subqueries",
      label: "SQL Subqueries",
      category: "Database",
      description: "Correlated subqueries, table inclusions, and custom SELECT views.",
      weekRange: "Week 31",
      weeks: [31],
      prerequisites: ["db-joins"],
      x: 550,
      y: 690,
      details: {
        objectives: "Model multi-layer filters inside a singular query run.",
        goals: ["Program nested subqueries matching parent indices", "Utilize IN/EXISTS conditional loops", "Query second-highest salary rows reliably"],
        resources: [{ name: "SQLZoo advanced selection", priority: "medium", url: "https://sqlzoo.net/", time: "4 hrs" }]
      }
    },
    {
      id: "db-window-functions",
      label: "Window Functions",
      category: "Database",
      description: "ROW_NUMBER partitions, RANK logs, and dynamic overlays.",
      weekRange: "Week 31",
      weeks: [31],
      prerequisites: ["db-subqueries"],
      x: 550,
      y: 810,
      details: {
        objectives: "Analyze data trend indices without squeezing sets with bulk GROUP BY routines.",
        goals: ["Write ROW_NUMBER() and RANK() sorting models", "Establish partition bounds over groups", "Apply lead and lag variables updates"],
        resources: [{ name: "LeetCode SQL Window problems", priority: "high", url: "https://leetcode.com/", time: "5 hrs" }]
      }
    },
    {
      id: "db-transactions",
      label: "ACID Transactions",
      category: "Database",
      description: "Isolation levels, locks, and concurrent database tasks protections.",
      weekRange: "Week 31",
      weeks: [31],
      prerequisites: ["db-window-functions"],
      x: 550,
      y: 930,
      details: {
        objectives: "Sustain complete integrity across overlapping database insertions.",
        goals: ["Define ACID metrics like atomicity and consistency", "Differentiate dirty reads from serializable locks", "Configure transactions boundaries inside mock models"],
        resources: [{ name: "Gate Smashers Transactions lectures", priority: "medium", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y", time: "4 hrs" }]
      }
    },
    {
      id: "db-mastery",
      label: "🗄 DATABASE EXPERT",
      category: "Database",
      description: "Master full relational database structures and queries profiling.",
      weekRange: "Week 31",
      weeks: [31],
      prerequisites: ["db-transactions"],
      isLegendary: true,
      x: 550,
      y: 1050,
      details: {
        objectives: "Formulate resilient, low-latency database queries.",
        goals: ["Analyze database explanation maps to build indexes keys", "Complete intermediate SQL certifications", "Optimize nested table structures fully"],
        resources: [{ name: "HackerRank SQL certification exams", priority: "high", url: "https://www.hackerrank.com/domains/sql", time: "6 hrs" }]
      }
    },

    // ================== OS PATH (Column X = 750) ==================
    {
      id: "os-processes",
      label: "Processes OS",
      category: "OS",
      description: "Process memory segments, states cycles, and systems calls.",
      weekRange: "Week 32",
      weeks: [32],
      prerequisites: ["root-journey"],
      x: 750,
      y: 210,
      details: {
        objectives: "Deconstruct how programs execute inside secure sandbox layers.",
        goals: ["Grasp process segment allocations (stack, heap, text)", "Trace process lifecycle state transitions", "Explain difference between user and kernel states"],
        resources: [{ name: "Gate Smashers OS series Intro", priority: "high", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", time: "5 hrs" }]
      }
    },
    {
      id: "os-threads",
      label: "OS Threading",
      category: "OS",
      description: "Shared memory address, concurrency locks, and content context swaps.",
      weekRange: "Week 32",
      weeks: [32],
      prerequisites: ["os-processes"],
      x: 750,
      y: 330,
      details: {
        objectives: "Run parallel background tasks inside a singular process safely.",
        goals: ["Compare processes vs threads memory footprints", "Define context switching cost overheads", "Inspect synchronization controls in Java"],
        resources: [{ name: "Gate Smashers multithreading", priority: "medium", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", time: "4 hrs" }]
      }
    },
    {
      id: "os-scheduling",
      label: "OS Scheduling",
      category: "OS",
      description: "CPU scheduler tasks: SJF, Round-Robin, and Gantt charts timings.",
      weekRange: "Week 32",
      weeks: [32],
      prerequisites: ["os-threads"],
      x: 750,
      y: 450,
      details: {
        objectives: "Schedule CPU cycles optimally across multiple processes.",
        goals: ["Draft Gantt timelines check for preemption", "Calculate average wait time and turnaround maps", "Define priority scheduling starvation protections"],
        resources: [{ name: "Gate Smashers CPU Scheduling", priority: "high", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", time: "6 hrs" }]
      }
    },
    {
      id: "os-deadlocks",
      label: "Deadlocks Blocks",
      category: "OS",
      description: "Coffman conditions logic, Bankers algorithms, and prevention strategies.",
      weekRange: "Week 32",
      weeks: [32],
      prerequisites: ["os-scheduling"],
      x: 750,
      y: 570,
      details: {
        objectives: "Avoid server stalls due to cyclic circular resource blocks.",
        goals: ["Confirm the four Coffman conditions variables", "Execute Banker's Deadlock avoidance loops", "Contrast detection vs preemptive recovery controls"],
        resources: [{ name: "Gate Smashers Deadlock theory", priority: "high", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", time: "5 hrs" }]
      }
    },
    {
      id: "os-memory-management",
      label: "Memory Systems",
      category: "OS",
      description: "Dynamic partitions allocations, contiguous fragmentations, and segmentation layouts.",
      weekRange: "Week 33",
      weeks: [33],
      prerequisites: ["os-deadlocks"],
      x: 750,
      y: 690,
      details: {
        objectives: "Map linear address models logically inside hardware limits.",
        goals: ["Differentiate internal vs external fragmentation partitions", "Simulate First-Fit and Best-Fit memory scans", "Map logical segment offsets limits"],
        resources: [{ name: "Gate Smashers Memory Lectures", priority: "medium", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", time: "5 hrs" }]
      }
    },
    {
      id: "os-virtual-memory",
      label: "Virtual Memory",
      category: "OS",
      description: "Paging structures, page faults, and page replacement strategies (LRU, FIFO, Optimal).",
      weekRange: "Week 33",
      weeks: [33],
      prerequisites: ["os-memory-management"],
      x: 750,
      y: 810,
      details: {
        objectives: "Unroll virtual workspaces using memory address mapping tables.",
        goals: ["Translate virtual addresses to physical coordinates", "Calculate numeric LRU page swap loops", "Explain thrashing conditions under high page fault rates"],
        resources: [{ name: "Gate Smashers Virtual Memory", priority: "high", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", time: "6 hrs" }]
      }
    },
    {
      id: "os-mastery",
      label: "💻 SYSTEM THINKER OS",
      category: "OS",
      description: "Fully understand low level OS resource mechanics.",
      weekRange: "Week 33",
      weeks: [33],
      prerequisites: ["os-virtual-memory"],
      isLegendary: true,
      x: 750,
      y: 930,
      details: {
        objectives: "Diagnose application slowdowns at the compiler state layer.",
        goals: ["Deliver verbal process scheduling summaries under 2 mins", "Map virtual page allocation charts safely", "Formulate custom CPU optimization loops"],
        resources: [{ name: "Syntaxia custom OS audits", priority: "medium", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", time: "4 hrs" }]
      }
    },

    // ================== PROJECTS PATH (Column X = 950) ==================
    {
      id: "project-crm-backend",
      label: "Project 1: CRM System",
      category: "Projects",
      description: "Core Spring Boot controllers, routers, and database links.",
      weekRange: "Weeks 38-40",
      weeks: [38, 39, 40],
      prerequisites: ["root-journey"],
      x: 950,
      y: 210,
      details: {
        objectives: "Construct your first functional model-view backend endpoints.",
        goals: ["Setup local Spring Boot framework environment", "Expose secure JSON GET REST controllers routes", "Map basic Contact properties inside SQL rows"],
        resources: [{ name: "Amigoscode Spring Boot guide", priority: "high", url: "https://www.youtube.com/@amigoscode", time: "12 hrs" }]
      }
    },
    {
      id: "project-inventory-tracker",
      label: "Project 2: Inventory",
      category: "Projects",
      description: "Sizing trackers, dynamic databases indexes updates, and search parameters.",
      weekRange: "Weeks 41-43",
      weeks: [41, 42, 43],
      prerequisites: ["project-crm-backend"],
      x: 950,
      y: 330,
      details: {
        objectives: "Handle inventory sizing and logs dynamically across complex SQL checks.",
        goals: ["Write update queries containing stock levels audits", "Incorporate pagination parameters inside reports lists", "Manage multi-key indices optimization within databases"],
        resources: [{ name: "GitHub project layouts manuals", priority: "medium", url: "https://github.com/", time: "10 hrs" }]
      }
    },
    {
      id: "project-helpdesk-system",
      label: "Project 3: Zoho Helpdesk",
      category: "Projects",
      description: "Spring Boot OAuth, JWT security filters, page parameters, and reports.",
      weekRange: "Weeks 45-47",
      weeks: [45, 46, 47],
      prerequisites: ["project-inventory-tracker"],
      x: 950,
      y: 450,
      details: {
        objectives: "Deliver a secure multi-user ticketing portal mimic.",
        goals: ["Integrate JSON Web Token filters inside security files", "Model clean ticketing state transitions", "Build dashboard query reports aggregate lists"],
        resources: [{ name: "Amigoscode JWT Spring Security", priority: "high", url: "https://www.youtube.com/@amigoscode", time: "14 hrs" }]
      }
    },
    {
      id: "project-portfolio-complete",
      label: "💻 PORTFOLIO COMPLETE",
      category: "Projects",
      description: "Publish 3 custom REST backend projects live on GitHub.",
      weekRange: "Week 50",
      weeks: [50],
      prerequisites: ["project-helpdesk-system"],
      isLegendary: true,
      x: 950,
      y: 570,
      details: {
        objectives: "Expose your live repository links directly to tech hiring recruiters.",
        goals: ["Upload documented Markdown guidelines for each system", "Sync active database configuration setups", "Create deployment setups for continuous hosting"],
        resources: [{ name: "GitHub Portfolio structuring guides", priority: "high", url: "https://github.com/", time: "8 hrs" }]
      }
    },

    // ================== INTERVIEW PATH (Column X = 1150) ==================
    {
      id: "interview-aptitude",
      label: "Aptitude Training",
      category: "Interview",
      description: "Quantitative speedruns, ratios formulas, and timers constraints.",
      weekRange: "Weeks 1-12",
      weeks: [1, 5, 10, 12],
      prerequisites: ["root-journey"],
      x: 1150,
      y: 210,
      details: {
        objectives: "Pass Zoho's written screening exam parameters cleanly under tight timers.",
        goals: ["Complete daily math quantitative quizzes on IndiaBix", "Track speed averages across work-rate problems", "Complete five complex math mock spreadsheets"],
        resources: [{ name: "IndiaBix Quantitative platform", priority: "high", url: "https://www.indiabix.com/", time: "8 hrs" }]
      }
    },
    {
      id: "interview-logic",
      label: "Programming Logic",
      category: "Interview",
      description: "Written logic loops, dry-runs dry exercises, and variable traces.",
      weekRange: "Week 35",
      weeks: [35],
      prerequisites: ["interview-aptitude"],
      x: 1150,
      y: 330,
      details: {
        objectives: "Forecast output matrices from nested loop conditions without compile assists.",
        goals: ["Master tracking loop index shifts", "Resolve logical sequence codes on whiteboards", "Complete 15 un-tagged trace practices"],
        resources: [{ name: "GFG Zoho logic question sets", priority: "high", url: "https://www.geeksforgeeks.org/zoho-interview-experience/", time: "6 hrs" }]
      }
    },
    {
      id: "interview-coding",
      label: "Coding Round",
      category: "Interview",
      description: "Timed strings array loops, custom sorting parameters, and patterns matrices.",
      weekRange: "Week 56",
      weeks: [56],
      prerequisites: ["interview-logic"],
      x: 1150,
      y: 450,
      details: {
        objectives: "Verify code syntax precision inside plain visual browser windows.",
        goals: ["Solve timed complex strings splits loops", "Dry-test mathematical prime matrix coordinates", "Validate calculations arrays in less than 30 mins"],
        resources: [{ name: "Prepinsta Zoho timed tests portal", priority: "high", url: "https://prepinsta.com/zoho/", time: "10 hrs" }]
      }
    },
    {
      id: "interview-technical",
      label: "Technical Interview",
      category: "Interview",
      description: "OOD diagrams design, memory efficiency audits, and complexity summaries.",
      weekRange: "Week 62",
      weeks: [62],
      prerequisites: ["interview-coding"],
      x: 1150,
      y: 570,
      details: {
        objectives: "Deliver technical choices with high clarity during live whiteboard drills.",
        goals: ["Present OOP class hierarchies verbally under 3 mins", "Audit memory array buffers against external leaks", "Walkthrough complete stack frameworks traces"],
        resources: [{ name: "GFG Zoho technical interview tips", priority: "medium", url: "https://www.geeksforgeeks.org/zoho-interview-experience/", time: "6 hrs" }]
      }
    },
    {
      id: "interview-hr-round",
      label: "HR Strategy",
      category: "Interview",
      description: "Speak on core projects choices, team metrics, and company values.",
      weekRange: "Week 68",
      weeks: [68],
      prerequisites: ["interview-technical"],
      x: 1150,
      y: 690,
      details: {
        objectives: "Expose strong alignment with active enterprise cultures.",
        goals: ["Summarize personal motivation stories", "Explain past team conflicts solutions", "Research target SaaS business branches"],
        resources: [{ name: "Zoho Careers culture handbook", priority: "medium", url: "https://www.zoho.com/learn/", time: "4 hrs" }]
      }
    },
    {
      id: "interview-mocks",
      label: "Pramp Mocks",
      category: "Interview",
      description: "Live mock interview screens, peer critiques, and performance feedback.",
      weekRange: "Week 59",
      weeks: [59],
      prerequisites: ["interview-hr-round"],
      x: 1150,
      y: 810,
      details: {
        objectives: "Eradicate interview stage-fright using constant performance peer simulations.",
        goals: ["Conduct live coder tests using Pramp online boards", "Audit logic descriptions based on recruiter guidelines", "Calibrate average solve timings metrics"],
        resources: [{ name: "Pramp mock interview connection", priority: "high", url: "https://www.pramp.com/", time: "10 hrs" }]
      }
    },
    {
      id: "interview-zoho-ready",
      label: "🎯 INTERVIEW READY",
      category: "Interview",
      description: "Full Zoho Learn certificate and simulations drive qualification.",
      weekRange: "Week 72",
      weeks: [72],
      prerequisites: ["interview-mocks"],
      isLegendary: true,
      x: 1150,
      y: 930,
      details: {
        objectives: "Acquire ultimate eligibility credentials to enter placement recruitment campaigns.",
        goals: ["Acquire direct certification titles inside business tools", "Earn top ratings inside three timed mocks exams", "Polish all resume files directories"],
        resources: [{ name: "Zoho Learn certifications boards", priority: "medium", url: "https://www.zoho.com/learn/", time: "6 hrs" }]
      }
    },

    // ================== ULTIMATE FINAL NODE (Column X = 650, Y = 2500) ==================
    {
      id: "ultimate-placement",
      label: "🏆 ZOHO PLACEMENT ELIGIBILITY",
      category: "Ultimate",
      description: "Unlocks once all tracks are mastered! Live Zoho Interview Drive ready.",
      weekRange: "Placement Ready",
      weeks: [72],
      prerequisites: ["java-mastery", "dsa-mastery", "db-mastery", "os-mastery", "project-portfolio-complete", "interview-zoho-ready"],
      isLegendary: true,
      x: 650,
      y: 2050,
      details: {
        objectives: "Srivishnu's ultimate peak of continuous software engineering training.",
        goals: ["Qualify directly to face written rounds", "Present an outstanding portfolio of Spring CRM apps", "Maintain excellent logical coding capability"],
        resources: [{ name: "Enterprise Hiring Portal", priority: "high", url: "https://prepinsta.com/zoho/", time: "Lifetime Ready" }]
      }
    }
  ], []);

  // 2. HELPER FUNCTIONS TO EVALUATE REACTIVE STATUSES PER NODE
  const getNodeState = (node: SkillNode): "locked" | "available" | "in_progress" | "completed" | "legendary" => {
    // 1. Is it completed?
    // A node is completed if ALL its configured weeks are inside the completedWeeks database state array
    const allWeeksDone = node.weeks.every(w => completedWeeks.includes(w));
    
    // Check specific path overrides
    if (node.id === "project-crm-backend" && (actualProjects >= 1 || completedWeeks.includes(40))) {
      return node.isLegendary ? "legendary" : "completed";
    }
    if (node.id === "project-inventory-tracker" && (actualProjects >= 2 || completedWeeks.includes(43))) {
      return node.isLegendary ? "legendary" : "completed";
    }
    if (node.id === "project-helpdesk-system" && (actualProjects >= 3 || completedWeeks.includes(47))) {
      return node.isLegendary ? "legendary" : "completed";
    }
    if (node.id === "project-portfolio-complete" && actualProjects >= 3) {
      return "legendary";
    }
    if (node.id === "interview-mocks" && actualMocks >= 5) {
      return node.isLegendary ? "legendary" : "completed";
    }
    if (node.id === "ultimate-placement") {
      const allPrereqsDone = node.prerequisites.every(id => {
        const pNode = skillNodes.find(n => n.id === id);
        return pNode ? (pNode.id === "project-portfolio-complete" ? actualProjects >= 3 : pNode.weeks.every(w => completedWeeks.includes(w))) : false;
      });
      return allPrereqsDone ? "legendary" : "locked";
    }

    if (allWeeksDone) {
      return node.isLegendary ? "legendary" : "completed";
    }

    // 2. Is it in progress?
    // It's in progress if the user's active currentWeek matches any of the node's configured weeks
    const anyWeekActive = node.weeks.includes(currentWeek);
    if (anyWeekActive) {
      return "in_progress";
    }

    // 3. Is it available?
    // It's available if ALL its direct prerequisites are completed or the node has no prereds
    if (node.prerequisites.length === 0) {
      return "available";
    }

    const allPrereqsMet = node.prerequisites.every(prereqId => {
      const pNode = skillNodes.find(n => n.id === prereqId);
      if (!pNode) return false;
      
      // Check project overrides
      if (pNode.id === "project-crm-backend" && (actualProjects >= 1 || completedWeeks.includes(40))) return true;
      if (pNode.id === "project-inventory-tracker" && (actualProjects >= 2 || completedWeeks.includes(43))) return true;
      if (pNode.id === "project-helpdesk-system" && (actualProjects >= 3 || completedWeeks.includes(47))) return true;
      if (pNode.id === "project-portfolio-complete" && actualProjects >= 3) return true;
      if (pNode.id === "interview-mocks" && actualMocks >= 5) return true;

      return pNode.weeks.every(w => completedWeeks.includes(w));
    });

    if (allPrereqsMet) {
      return "available";
    }

    // 4. Otherwise, it is locked!
    return "locked";
  };

  // State cache mapping node status results
  const nodesStatusMap = useMemo(() => {
    const map: Record<string, "locked" | "available" | "in_progress" | "completed" | "legendary"> = {};
    skillNodes.forEach(node => {
      map[node.id] = getNodeState(node);
    });
    return map;
  }, [skillNodes, completedWeeks, currentWeek, actualProjects, actualMocks]);

  // 3. CALCULATE PROGRESS XP SYSTEM STOCKS
  const xpMetrics = useMemo(() => {
    const xpFromWeeks = completedWeeks.length * 100;
    const xpFromResources = completedResources.length * 25;

    // Milestone weeks completed
    const completedMilestonesCount = MAJOR_MILESTONES.filter(m => completedWeeks.includes(m.week)).length;
    const xpFromMilestones = completedMilestonesCount * 500;

    // Leetcode milestones
    let xpFromLeetcode = 0;
    if (actualLeetcode >= 50) xpFromLeetcode += 1000;
    if (actualLeetcode >= 100) xpFromLeetcode += 1000;
    if (actualLeetcode >= 200) xpFromLeetcode += 1000;
    if (actualLeetcode >= 300) xpFromLeetcode += 1000;

    // Projects completed
    let xpFromProjects = 0;
    if (actualProjects >= 1) xpFromProjects += 1500;
    if (actualProjects >= 2) xpFromProjects += 1500;
    if (actualProjects >= 3) xpFromProjects += 1500;

    const totalXP = xpFromWeeks + xpFromResources + xpFromMilestones + xpFromLeetcode + xpFromProjects;

    // Progression level curve
    // Say each level requires 350 XP
    const calculatedLevel = Math.max(1, Math.min(72, Math.floor(totalXP / 350) + 1));
    const remainderXp = totalXP % 350;
    const percentToNextLevel = Math.round((remainderXp / 350) * 100);

    return {
      totalXP,
      level: calculatedLevel,
      remainderXp,
      percentToNextLevel,
      xpFromWeeks,
      xpFromResources,
      xpFromMilestones,
      xpFromLeetcode,
      xpFromProjects
    };
  }, [completedWeeks, completedResources, actualLeetcode, actualProjects]);

  // Player Titles system mapping
  const levelTitle = useMemo(() => {
    const level = xpMetrics.level;
    if (level >= 72) return "Zoho Champion";
    if (level >= 60) return "Placement Ready";
    if (level >= 50) return "Zoho Candidate";
    if (level >= 40) return "System Thinker";
    if (level >= 30) return "Problem Solver";
    if (level >= 20) return "DSA Warrior";
    if (level >= 10) return "OOP Specialist";
    if (level >= 5) return "Java Explorer";
    return "Freshman";
  }, [xpMetrics.level]);



  // Escape key handler to exit full screen mode and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullScreen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullScreen]);

  // 4. READINESS BY TOPIC INDEX CALCULATORS
  const readinessMetrics = useMemo(() => {
    // Collect progress parameters
    const javaNodes = skillNodes.filter(n => n.category === "Java");
    const completedJava = javaNodes.filter(n => nodesStatusMap[n.id] === "completed" || nodesStatusMap[n.id] === "legendary").length;
    const javaPct = Math.round((completedJava / javaNodes.length) * 100);

    const dsaNodes = skillNodes.filter(n => n.category === "DSA");
    const completedDsa = dsaNodes.filter(n => nodesStatusMap[n.id] === "completed" || nodesStatusMap[n.id] === "legendary").length;
    const dsaPct = Math.min(100, Math.round((completedDsa / dsaNodes.length) * 40 + (Math.min(300, actualLeetcode) / 300) * 60));

    const dbNodes = skillNodes.filter(n => n.category === "Database");
    const completedDb = dbNodes.filter(n => nodesStatusMap[n.id] === "completed" || nodesStatusMap[n.id] === "legendary").length;
    const dbPct = Math.round((completedDb / dbNodes.length) * 100);

    const osNodes = skillNodes.filter(n => n.category === "OS");
    const completedOs = osNodes.filter(n => nodesStatusMap[n.id] === "completed" || nodesStatusMap[n.id] === "legendary").length;
    const osPct = Math.round((completedOs / osNodes.length) * 100);

    const pNodes = skillNodes.filter(n => n.category === "Projects");
    const completedP = pNodes.filter(n => nodesStatusMap[n.id] === "completed" || nodesStatusMap[n.id] === "legendary").length;
    const projectsPct = Math.round((completedP / pNodes.length) * 100);

    const intNodes = skillNodes.filter(n => n.category === "Interview");
    const completedInt = intNodes.filter(n => nodesStatusMap[n.id] === "completed" || nodesStatusMap[n.id] === "legendary").length;
    const interviewPct = Math.round((completedInt / intNodes.length) * 100);

    // Dynamic scale weights
    const overallReadiness = Math.round(
      (javaPct * 0.2) + (dsaPct * 0.35) + (dbPct * 0.15) + (osPct * 0.1) + (projectsPct * 0.1) + (interviewPct * 0.1)
    );

    let descriptor = "Beginner";
    if (overallReadiness >= 100) descriptor = "Zoho Champion";
    else if (overallReadiness >= 75) descriptor = "Placement Ready";
    else if (overallReadiness >= 50) descriptor = "Intermediate";
    else if (overallReadiness >= 25) descriptor = "Learning";

    return {
      javaPct,
      dsaPct,
      dbPct,
      osPct,
      projectsPct,
      interviewPct,
      overallReadiness,
      descriptor
    };
  }, [skillNodes, nodesStatusMap, actualLeetcode, actualProjects]);

  // 5. UNLOCKED BADGES INVENTORY
  // Calculate Streak of Study sessions
  const currentStreak = useMemo(() => {
    if (!state.studySessions || state.studySessions.length === 0) return 3; // fallback default
    const uniqueDates = Array.from(new Set(state.studySessions.map(s => s.date))).sort();
    return uniqueDates.length >= 7 ? uniqueDates.length : 3;
  }, [state.studySessions]);

  const badges = useMemo(() => [
    {
      id: "streak-7",
      label: "🔥 7 Day Streak",
      description: "Excel at study routines for seven consecutive days active.",
      unlocked: currentStreak >= 7,
      category: "General"
    },
    {
      id: "streak-30",
      label: "🔥 30 Day Streak",
      description: "Absolute discipline legend with a month-long learning lock.",
      unlocked: currentStreak >= 30,
      category: "General"
    },
    {
      id: "java-expert",
      label: "📘 Java Master",
      description: "Successfully checked off all primary Java syllabus node targets.",
      unlocked: completedWeeks.includes(12),
      category: "Language"
    },
    {
      id: "dsa-warrior",
      label: "⚔ DSA Warrior",
      description: "Break the barrier! Solved more than 150+ coding benchmarks.",
      unlocked: actualLeetcode >= 150,
      category: "DSA"
    },
    {
      id: "sql-expert",
      label: "🗄 SQL Expert",
      description: "Excel at writing JOINs queries and checked off SQL databases targets.",
      unlocked: completedWeeks.includes(31) || actualSql >= 40,
      category: "Database"
    },
    {
      id: "project-builder",
      label: "💻 Project Builder",
      description: "Construct at least two complete Spring models.",
      unlocked: actualProjects >= 2,
      category: "Real Apps"
    },
    {
      id: "interview-ready",
      label: "🎯 Interview Ready",
      description: "Pass multiple competitive coding simulations.",
      unlocked: actualMocks >= 3 || completedWeeks.includes(68),
      category: "Screenings"
    },
    {
      id: "zoho-champion",
      label: "🏆 Zoho Champion",
      description: "Qualify completely with Level 72 and finish the peak.",
      unlocked: xpMetrics.level >= 72 || nodesStatusMap["ultimate-placement"] === "legendary",
      category: "Peak Offer"
    }
  ], [completedWeeks, actualLeetcode, actualSql, actualProjects, actualMocks, currentStreak, xpMetrics.level, nodesStatusMap]);

  // Handle Level animations and celebration checks
  const [lastSeenLevel, setLastSeenLevel] = useState<number>(xpMetrics.level);
  const [lastSeenBadges, setLastSeenBadges] = useState<string[]>([]);

  useEffect(() => {
    if (xpMetrics.level > lastSeenLevel) {
      setCelebrationEvent({
        type: 'level',
        title: `Level Up!`,
        subtitle: `You reached Level ${xpMetrics.level} - ${levelTitle}!`,
        icon: "⚡"
      });
      setLastSeenLevel(xpMetrics.level);
    } else if (xpMetrics.level < lastSeenLevel) {
      setLastSeenLevel(xpMetrics.level);
    }
  }, [xpMetrics.level, lastSeenLevel, levelTitle]);

  useEffect(() => {
    const currentlyUnlocked = badges.filter(b => b.unlocked).map(b => b.id);
    if (lastSeenBadges.length === 0) {
      // Set initial state without triggering celebration
      setLastSeenBadges(currentlyUnlocked);
    } else {
      const newlyUnlocked = currentlyUnlocked.filter(id => !lastSeenBadges.includes(id));
      if (newlyUnlocked.length > 0) {
        const newlyUnlockedBadgeId = newlyUnlocked[0];
        const b = badges.find(badge => badge.id === newlyUnlockedBadgeId);
        if (b) {
          setCelebrationEvent({
            type: 'badge',
            title: "Achievement Unlocked!",
            subtitle: `${b.label}: ${b.description}`,
            icon: b.label.split(" ")[0] || "🏆"
          });
        }
        setLastSeenBadges(currentlyUnlocked);
      } else if (currentlyUnlocked.length !== lastSeenBadges.length) {
        setLastSeenBadges(currentlyUnlocked);
      }
    }
  }, [badges, lastSeenBadges]);

  // Selected Node detailed reference
  const selectedNode = useMemo(() => {
    return skillNodes.find(n => n.id === selectedNodeId) || skillNodes[0];
  }, [selectedNodeId, skillNodes]);

  const selectedNodeStatus = useMemo(() => {
    return nodesStatusMap[selectedNode.id];
  }, [selectedNode, nodesStatusMap]);

  // Sync temporary notes on selected node click
  const [nodeNotes, setNodeNotes] = useState<string>("");
  useEffect(() => {
    // If we have week notes, sync with the first week associated with this node
    const firstWeek = selectedNode.weeks[0];
    setNodeNotes(weeklyNotes[firstWeek] || "");
  }, [selectedNode, weeklyNotes]);

  const saveNodeNotes = () => {
    const firstWeek = selectedNode.weeks[0];
    setWeeklyNotes({
      ...weeklyNotes,
      [firstWeek]: nodeNotes
    });

    // Fire XP toast notification feedback!
    setActiveXpToast({ xp: 15, label: "Note logged! +15 XP" });
    setTimeout(() => setActiveXpToast(null), 3500);
  };

  // Zoom Canvas functions
  const handleZoomIn = () => setScale(prev => Math.min(1.8, prev + 0.1));
  const handleZoomOut = () => setScale(prev => Math.max(0.12, prev - 0.1));
  const handleResetPan = () => {
    setScale(0.4);
    setPan({ x: 260, y: 30 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    const zoomFactor = 0.03;
    if (e.deltaY < 0) {
      setScale(prev => Math.min(1.8, prev + zoomFactor));
    } else {
      setScale(prev => Math.max(0.12, prev - zoomFactor));
    }
  };

  // Drag interaction events (desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".skill-node-card") || (e.target as HTMLElement).closest(".rpg-hud-panel")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  // Touch interaction events (mobile/tablet responsiveness)
  const onTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".skill-node-card") || (e.target as HTMLElement).closest(".rpg-hud-panel")) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  // 1:10 aspect ratios dynamic viewport rectangle calculations for Mini-Map
  const viewportRect = useMemo(() => {
    const canvasWidth = 1400;
    const canvasHeight = 2200;

    // Viewport client dimensions
    const viewWidth = canvasRef.current?.clientWidth || 800;
    const viewHeight = canvasRef.current?.clientHeight || 600;

    // Calculate canvas coordinates of current viewport bounds
    const xCanvas = -pan.x / scale;
    const yCanvas = -pan.y / scale;
    const wCanvas = viewWidth / scale;
    const hCanvas = viewHeight / scale;

    // Convert values to bounds percentage
    const left = Math.max(0, Math.min(100, (xCanvas / canvasWidth) * 100));
    const top = Math.max(0, Math.min(100, (yCanvas / canvasHeight) * 100));
    const width = Math.max(6, Math.min(100, (wCanvas / canvasWidth) * 100));
    const height = Math.max(6, Math.min(100, (hCanvas / canvasHeight) * 100));

    return { left, top, width, height };
  }, [pan, scale, isFullScreen]);

  // Handle Mini-map Viewport click and dragging navigation 
  const handleMinimapNav = (clientX: number, clientY: number) => {
    if (!minimapContainerRef.current) return;
    const rect = minimapContainerRef.current.getBoundingClientRect();
    
    // Relative coordinates scaled between 0 and 1
    const rx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const ry = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));

    const targetX = rx * 1400;
    const targetY = ry * 2200;

    const viewWidth = canvasRef.current?.clientWidth || 800;
    const viewHeight = canvasRef.current?.clientHeight || 680;

    setPan({
      x: viewWidth / 2 - targetX * scale,
      y: viewHeight / 2 - targetY * scale
    });
  };

  const handleMinimapClickOrDrag = (e: React.MouseEvent) => {
    setIsMinimapDragging(true);
    handleMinimapNav(e.clientX, e.clientY);
  };

  const handleMinimapMouseMove = (e: React.MouseEvent) => {
    if (isMinimapDragging) {
      handleMinimapNav(e.clientX, e.clientY);
    }
  };

  const handleMinimapMouseUp = () => {
    setIsMinimapDragging(false);
  };

  const handleMinimapTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setIsMinimapDragging(true);
      const touch = e.touches[0];
      handleMinimapNav(touch.clientX, touch.clientY);
    }
  };

  const handleMinimapTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0 && isMinimapDragging) {
      const touch = e.touches[0];
      handleMinimapNav(touch.clientX, touch.clientY);
    }
  };

  // Filter paths highlighting
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return skillNodes;
    return skillNodes.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase()) || n.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, skillNodes]);

  // Quick state overrides toggles directly inside details card to dynamically test completion
  const handleToggleNodeWeeksState = () => {
    selectedNode.weeks.forEach(w => {
      toggleWeekCompletion(w);
    });

    const isMarkingDone = !selectedNode.weeks.every(w => completedWeeks.includes(w));
    if (isMarkingDone) {
      setActiveXpToast({ xp: 100 * selectedNode.weeks.length, label: `Quest Complete! +${100 * selectedNode.weeks.length} XP` });
    } else {
      setActiveXpToast({ xp: -100 * selectedNode.weeks.length, label: `Quest Reset! -${100 * selectedNode.weeks.length} XP` });
    }
    setTimeout(() => setActiveXpToast(null), 3500);
  };

  // Define layout categories as Horizontal Tracks
  const tracks = useMemo(() => [
    {
      id: "java",
      name: "Java Language Arc",
      description: "Basics, OOP, Abstraction, Collections & Generics Frameworks",
      icon: Coffee,
      color: "from-blue-500/20 via-indigo-500/10 to-transparent",
      borderColor: "border-indigo-500/20",
      accentTextColor: "text-indigo-400",
      nodes: skillNodes.filter(n => n.category === "Root" || n.category === "Java")
    },
    {
      id: "dsa",
      name: "Structures & Algorithms (DSA)",
      description: "Array metrics, recursion, linked lists, stacks, trees, heaps, graphs & DP",
      icon: Swords,
      color: "from-emerald-500/20 via-teal-500/10 to-transparent",
      borderColor: "border-teal-500/20",
      accentTextColor: "text-teal-400",
      nodes: skillNodes.filter(n => n.category === "DSA")
    },
    {
      id: "database",
      name: "Relational DBMS & SQL Track",
      description: "Relational models, normalization, built-in functions, ACID & transactions",
      icon: Database,
      color: "from-purple-500/20 via-pink-500/10 to-transparent",
      borderColor: "border-purple-500/20",
      accentTextColor: "text-purple-400",
      nodes: skillNodes.filter(n => n.category === "Database")
    },
    {
      id: "os",
      name: "Operating Systems (OS)",
      description: "Processes, threads, CPU scheduling, deadlocks, paging & system designs",
      icon: Cpu,
      color: "from-pink-500/20 via-rose-500/10 to-transparent",
      borderColor: "border-rose-500/20",
      accentTextColor: "text-rose-400",
      nodes: skillNodes.filter(n => n.category === "OS")
    },
    {
      id: "career",
      name: "Applied Projects & Interviews",
      description: "CRM Backends, resume design, mock mock-drills, and the final Zoho checkpoint",
      icon: Trophy,
      color: "from-amber-500/20 via-yellow-500/10 to-transparent",
      borderColor: "border-amber-500/20",
      accentTextColor: "text-amber-400",
      nodes: skillNodes.filter(n => n.category === "Projects" || n.category === "Interview" || n.category === "Ultimate")
    }
  ], [skillNodes]);

  // Map each detailed node ID to a single, highly readable scannable word
  const getSleekLabel = (node: SkillNode) => {
    switch (node.id) {
      case "root-journey": return "Start";
      case "java-basics": return "Basics";
      case "java-control-flow": return "Flow";
      case "java-arrays": return "Arrays";
      case "java-strings": return "Strings";
      case "java-oop-foundations": return "OOP";
      case "java-inheritance": return "Inherit";
      case "java-polymorphism": return "Poly";
      case "java-abstraction": return "Abstract";
      case "java-interfaces": return "Interface";
      case "java-collections": return "Collections";
      case "java-generics": return "Generics";
      case "java-mastery": return "Mastery";
      
      case "dsa-arrays": return "Arrays";
      case "dsa-strings": return "Strings";
      case "dsa-linkedlists": return "LinkedList";
      case "dsa-stacks": return "Stacks";
      case "dsa-queues": return "Queues";
      case "dsa-recursion": return "Recursion";
      case "dsa-backtracking": return "Backtrack";
      case "dsa-binary-search": return "BinSearch";
      case "dsa-hashing": return "Hashing";
      case "dsa-trees": return "Trees";
      case "dsa-bst": return "BST";
      case "dsa-heaps": return "Heaps";
      case "dsa-graphs": return "Graphs";
      case "dsa-dp": return "DP";
      case "dsa-mastery": return "Mastery";
      
      case "db-basics": return "Intro";
      case "db-normalization": return "Normalize";
      case "db-sql-basics": return "SQL Core";
      case "db-sql-subqueries": return "Subquery";
      case "db-sql-funcs": return "Functions";
      case "db-transactions": return "ACID";
      case "db-indexing": return "Indexing";
      case "db-triggers": return "Triggers";
      case "db-mastery": return "Mastery";
      
      case "os-basics": return "Intro";
      case "os-processes": return "Process";
      case "os-scheduling": return "CPU";
      case "os-sync": return "Mutex";
      case "os-deadlocks": return "Deadlock";
      case "os-memory": return "Paging";
      case "os-virtual": return "Virtual";
      case "os-disk": return "Disk";
      case "os-mastery": return "Mastery";
      
      case "project-console": return "Console";
      case "project-crm-backend": return "CRM Mod";
      case "project-inventory-tracker": return "Inventory";
      case "project-helpdesk-system": return "Helpdesk";
      case "project-portfolio-complete": return "Portfolio";
      case "interview-aptitude": return "Aptitude";
      case "interview-resume": return "Resume";
      case "interview-hr": return "HR Round";
      case "interview-mocks": return "Mocks";
      case "interview-zoho-ready": return "Passcheck";
      case "ultimate-placement": return "OFFER";
      default: return "Skill Node";
    }
  };

  // Map beautiful Lucide icons matching the nodes
  const getNodeIcon = (node: SkillNode) => {
    switch (node.id) {
      case "root-journey": return Compass;
      case "java-basics": return Coffee;
      case "java-control-flow": return GitMerge;
      case "java-arrays": return Grid;
      case "java-strings": return Type;
      case "java-oop-foundations": return Boxes;
      case "java-inheritance": return Settings;
      case "java-polymorphism": return Sparkles;
      case "java-abstraction": return Settings;
      case "java-interfaces": return Layers;
      case "java-collections": return List;
      case "java-generics": return Layers;
      case "java-mastery": return GraduationCap;
      
      case "dsa-arrays": return Grid;
      case "dsa-strings": return Type;
      case "dsa-linkedlists": return Link2;
      case "dsa-stacks": return Layers;
      case "dsa-queues": return Hourglass;
      case "dsa-recursion": return RefreshCw;
      case "dsa-backtracking": return Undo2;
      case "dsa-binary-search": return Search;
      case "dsa-hashing": return Hash;
      case "dsa-trees": return Network;
      case "dsa-bst": return Network;
      case "dsa-heaps": return Triangle;
      case "dsa-graphs": return Network;
      case "dsa-dp": return TrendingUp;
      case "dsa-mastery": return ShieldAlert;
      
      case "db-basics": return Database;
      case "db-normalization": return FileCheck2;
      case "db-sql-basics": return Terminal;
      case "db-sql-subqueries": return CornerDownLeft;
      case "db-sql-funcs": return Calculator;
      case "db-transactions": return Lock;
      case "db-indexing": return Sliders;
      case "db-triggers": return Zap;
      case "db-mastery": return Award;
      
      case "os-basics": return Cpu;
      case "os-processes": return Settings;
      case "os-scheduling": return Activity;
      case "os-sync": return Lock;
      case "os-deadlocks": return AlertTriangle;
      case "os-memory": return Layers;
      case "os-virtual": return Layers;
      case "os-disk": return Disc;
      case "os-mastery": return Trophy;
      
      case "project-console": return Terminal;
      case "project-crm-backend": return Terminal;
      case "project-inventory-tracker": return Terminal;
      case "project-helpdesk-system": return Terminal;
      case "project-portfolio-complete": return Award;
      case "interview-aptitude": return BookOpen;
      case "interview-resume": return FileText;
      case "interview-hr": return Users;
      case "interview-mocks": return Swords;
      case "interview-zoho-ready": return CheckCircle2;
      case "ultimate-placement": return Trophy;
      default: return Compass;
    }
  };

  return (
    <div className="space-y-6 text-left pb-12 font-sans select-none relative overflow-hidden" id="rpg-skilltree-dashboard">
      
      {/* CELEBRATION CONGRATS OVERLAY */}
      <AnimatePresence>
        {celebrationEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md px-4"
          >
            {/* Ambient radiant circles backdrops */}
            <div className="absolute inset-x-0 top-1/4 bottom-1/4 bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-x-0 top-1/3 bottom-1/3 bg-indigo-500/10 blur-[160px] rounded-full pointer-events-none" />

            <motion.div
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="bg-[#0f172a] border border-amber-500/30 rounded-3xl p-8 max-w-md w-full relative overflow-hidden shadow-2xl shadow-amber-500/5 flex flex-col items-center text-center select-none"
            >
              {/* Confetti or falling particles simulation lines */}
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                <div className="absolute top-24 right-12 w-3 h-3 rounded-full bg-indigo-400 animate-pulse" />
                <div className="absolute bottom-16 left-16 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" style={{ animationDelay: "1s" }} />
                <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
              </div>

              {/* Glowing visual pulse ring around the medal symbol */}
              <div className="relative w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10">
                <span className="text-5xl animate-bounce filter drop-shadow">
                  {celebrationEvent.icon}
                </span>
                
                {/* Micro sparks orbiting badge */}
                <span className="absolute animate-spin rounded-full border border-dashed border-amber-400/30 inset-0 scale-125" style={{ animationDuration: "10s" }} />
              </div>

              {/* Sparkles label */}
              <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-amber-400 text-[10px] font-mono leading-none tracking-widest font-black uppercase mb-3">
                <Sparkles className="h-3 w-3 animate-spin md:duration-2500" />
                Celebration Unlock
              </div>

              {/* Achievement Title */}
              <h2 className="text-2xl font-black text-white font-sans tracking-tight mb-2 uppercase leading-none">
                {celebrationEvent.title}
              </h2>

              {/* Achievement description */}
              <p className="text-xs text-gray-400 font-sans leading-relaxed mb-6 max-w-[300px]">
                {celebrationEvent.subtitle}
              </p>

              {/* Claim Reward Button */}
              <button
                onClick={() => setCelebrationEvent(null)}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-sans font-black tracking-wider text-xs rounded-xl shadow-lg shadow-amber-500/10 transform hover:scale-[1.02] active:scale-95 transition cursor-pointer"
              >
                HELL YEAH! 🎯
              </button>

              <button
                onClick={() => setCelebrationEvent(null)}
                className="text-[10px] text-gray-500 font-mono tracking-widest hover:text-gray-300 mt-4 uppercase transition cursor-pointer"
              >
                Dismiss Celebration
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATABLE XP GAINED popups toasts */}
      <AnimatePresence>
        {activeXpToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed bottom-6 right-6 bg-[#0B1120] border-2 border-green-500/30 px-5 py-3 rounded-xl shadow-2xl z-40 flex items-center gap-3 animate-bounce"
          >
            <div className="w-7 h-7 bg-green-500/15 rounded-full flex items-center justify-center">
              <Zap className="h-4 w-4 text-green-400 fill-green-400" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{activeXpToast.label}</p>
              <p className="text-[10px] font-mono text-gray-400 leading-none mt-1">XP synced instantly</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="bg-[#111827] border-2 border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md shadow-lg shadow-indigo-500/5 hover:border-indigo-400 transition-all duration-300">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-radial from-[#60A5FA]/10 via-transparent to-transparent pointer-events-none rounded-full blur-3xl"></div>

        <div className="relative space-y-6">
          {/* Top Title Bar with streak and quick level indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1F2937]/50 pb-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-bold leading-none animate-pulse">
                  RPG PROGRESSION SYSTEM ACTIVE
                </span>
                <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono font-bold bg-amber-500/10 px-2.5 py-0.5 border border-amber-500/20 rounded-md">
                  <Flame className="h-3.5 w-3.5 fill-amber-400 animate-pulse text-amber-400" />
                  STREAK: {currentStreak} DAYS
                </span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight leading-none font-sans mt-1">
                Srivishnu's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] via-indigo-400 to-[#34D399]">RPG Skill Tree Mastery</span>
              </h1>
              <p className="text-xs text-gray-400 font-sans max-w-2xl leading-normal">
                Interactive RPG tech tracks aligned perfectly with Zoho assessment guidelines. Click any node below to inspect study objectives, sub-quests, notes logging, and resource assets.
              </p>
            </div>

            {/* Overall Quick Level details */}
            <div className="flex items-center gap-3 bg-[#0B1120] border border-[#1F2937] p-2.5 rounded-xl min-w-[240px] max-w-xs shrink-0 self-start md:self-center">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-full border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-sm shrink-0">
                L {xpMetrics.level}
              </div>
              <div className="flex-grow min-w-0 space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono leading-none">
                  <span className="text-gray-400 uppercase font-extrabold truncate">{levelTitle}</span>
                  <span className="text-white font-bold">{xpMetrics.totalXP} XP</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${xpMetrics.percentToNextLevel}%` }}></div>
                </div>
                <span className="text-[9px] font-mono text-gray-500 block leading-none">{xpMetrics.remainderXp} / 350 to Next Level</span>
              </div>
            </div>
          </div>

          {/* Sibling Grid for Overall Readiness and core branches */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left: Overall Zoho Readiness circular gauge wrapper */}
            <div className="lg:col-span-4 bg-[#0B1120]/60 border border-[#1F2937]/75 rounded-xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="space-y-1 relative z-10">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-400 block">
                  Overall Zoho Placement
                </span>
                <h4 className="text-sm font-extrabold text-white font-sans leading-none uppercase">
                  Readiness Standing
                </h4>
              </div>

              {/* Massive dial section */}
              <div className="flex items-center gap-5 my-2 relative z-10 justify-center sm:justify-start lg:justify-center">
                <div className="relative w-24 h-24 rounded-full border-4 border-slate-800 flex flex-col items-center justify-center bg-[#0B110F] shrink-0">
                  {/* Background overlay highlight glow */}
                  <div className="absolute inset-2 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full animate-pulse" />
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-[#34D399] tracking-tighter leading-none">
                    {readinessMetrics.overallReadiness}%
                  </span>
                  <span className="text-[8px] font-mono text-gray-400 uppercase font-black tracking-widest mt-1 block">
                    READINESS
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[9px] uppercase font-mono text-gray-500 font-bold block leading-none">RANK STATUS</span>
                    <span className="text-sm font-black text-emerald-400 font-mono tracking-tight block uppercase mt-1">
                      {readinessMetrics.descriptor}
                    </span>
                  </div>
                  <div className="bg-[#111827]/85 border border-[#1F2937] px-3 py-1 text-xs leading-none rounded-lg">
                    <span className="text-[8px] uppercase font-mono text-gray-500 block leading-none">Unlocked Medals</span>
                    <span className="text-xs font-mono font-extrabold text-amber-400 block mt-1">
                      {badges.filter(b => b.unlocked).length} / {badges.length}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 font-sans leading-relaxed relative z-10">
                Based on continuous weighted contributions across Core Java OOP structures, DFS/BFS mappings, Relational ACID properties, and mock technical screenings.
              </p>
            </div>

            {/* Right: Individual Branch Progress Bars */}
            <div className="lg:col-span-8 bg-[#0B1120]/60 border border-[#1F2937]/75 rounded-xl p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-mono tracking-wider font-bold text-gray-400 block">
                  Interactive Syllabus Breakdown
                </span>
                <h4 className="text-sm font-extrabold text-white font-sans leading-none uppercase">
                  Target Branch Progression Log
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1">
                {/* Java Arc */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Coffee className="h-3.5 w-3.5 text-indigo-400" />
                      Java Language Arc
                    </span>
                    <span className="text-white font-bold">{readinessMetrics.javaPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" 
                      style={{ width: `${readinessMetrics.javaPct}%` }}
                    />
                  </div>
                </div>

                {/* DSA Track */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Swords className="h-3.5 w-3.5 text-teal-400" />
                      Algorithms & DSA
                    </span>
                    <span className="text-white font-bold">{readinessMetrics.dsaPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                      style={{ width: `${readinessMetrics.dsaPct}%` }}
                    />
                  </div>
                </div>

                {/* DBMS Track */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5 text-purple-400" />
                      Relational SQL & ACID
                    </span>
                    <span className="text-white font-bold">{readinessMetrics.dbPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500" 
                      style={{ width: `${readinessMetrics.dbPct}%` }}
                    />
                  </div>
                </div>

                {/* OS Track */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono leading-none">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Cpu className="h-3.5 w-3.5 text-rose-400" />
                      Operating Systems
                    </span>
                    <span className="text-white font-bold">{readinessMetrics.osPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-rose-500 rounded-full transition-all duration-500" 
                      style={{ width: `${readinessMetrics.osPct}%` }}
                    />
                  </div>
                </div>

                {/* Projects & Interviews */}
                <div className="space-y-1 sm:col-span-2">
                  <div className="flex items-center justify-between text-[11px] font-mono leading-none font-bold">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                      Applied Projects & Case Screening Prep
                    </span>
                    <span className="text-amber-400">
                      {Math.round((readinessMetrics.projectsPct + readinessMetrics.interviewPct) / 2)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.round((readinessMetrics.projectsPct + readinessMetrics.interviewPct) / 2)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH, HUD FILTERS, AND FULL-WIDTH ROADMAP ANCHOR CHANNEL MAP */}
      <div className="w-full flex flex-col space-y-6">
        
        {/* FILTER BAR ROW */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] px-4 py-3.5 rounded-2xl w-full">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full lg:w-auto">
            <div className="flex items-center gap-2 bg-[#0B1120] border border-[#1F2937] px-3 py-1.5 rounded-lg w-full sm:w-64">
              <Search className="h-4 w-4 text-gray-500 shrink-0" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find node (e.g. Arrays, Paging)..."
                className="bg-transparent border-none text-xs text-white focus:outline-none placeholder-gray-500 w-full font-mono"
              />
            </div>
            
            {/* VIEW MODE SEGMENTED CONTROL TOGGLES */}
            <div className="flex bg-[#0B1120] border border-[#1F2937] p-1 rounded-xl gap-1 shrink-0">
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-1 text-xs font-bold font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                  viewMode === "map" 
                    ? "bg-[#1E293B] text-indigo-400 border border-[#334155]/60 shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🗺️ Blueprint Map
              </button>
              <button
                onClick={() => setViewMode("rows")}
                className={`px-3 py-1 text-xs font-bold font-mono rounded-lg flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
                  viewMode === "rows" 
                    ? "bg-[#1E293B] text-indigo-400 border border-[#334155]/60 shadow-lg" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                📋 Lane Tracks
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-mono tracking-tight flex-wrap">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full inline-block"></span>
            <span className="mr-3">Legendary</span>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span>
            <span className="mr-3">Completed</span>
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
            <span className="mr-3">Active Now</span>
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span>
            <span>Unlocked</span>
          </div>
        </div>

        {/* VIEW CONDITIONAL: MAP BLUEPRINT VS ROW LANE TRACKS */}
        {viewMode === "map" ? (
          /* ZOOMABLE PANNABLE RPG CANVAS SYSTEM */
          <div 
            ref={canvasRef}
            onWheel={handleWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className={`relative bg-[#030712] select-none transition-all duration-300 ${
              isFullScreen 
                ? "fixed inset-0 z-50 w-screen h-screen m-0 rounded-none overflow-hidden" 
                : "w-full h-[600px] sm:h-[680px] border border-[#1F2937]/80 rounded-3xl overflow-hidden shadow-inner group/canvas"
            } cursor-grab active:cursor-grabbing`}
          >
            {/* Interactive Controls Floating Overlay (Zoom, etc) */}
            <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row gap-2.5 items-center">
              <div className="flex bg-[#0B1120]/95 border border-[#1F2937]/80 p-1.5 rounded-xl gap-1.5 shadow-lg backdrop-blur-md">
                <button
                  onClick={handleZoomIn}
                  className="p-1.5 bg-[#111827] hover:bg-gray-800 border border-[#1F2937]/80 hover:border-indigo-400 text-gray-400 hover:text-white rounded-lg cursor-pointer transition"
                  title="Zoom In"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={handleZoomOut}
                  className="p-1.5 bg-[#111827] hover:bg-gray-800 border border-[#1F2937]/80 hover:border-indigo-400 text-gray-400 hover:text-white rounded-lg cursor-pointer transition"
                  title="Zoom Out"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <button
                  onClick={handleResetPan}
                  className="px-3 py-1.5 bg-[#111827] hover:bg-gray-800 border border-[#1F2937]/80 hover:border-indigo-400 text-gray-400 hover:text-white text-xs font-mono font-bold rounded-lg cursor-pointer transition"
                  title="Reset View"
                >
                  Fit Axis
                </button>
                
                {/* FULL SCREEN TOGGLE BUTTON */}
                <button
                  onClick={() => setIsFullScreen(!isFullScreen)}
                  className={`p-1.5 rounded-lg border cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isFullScreen 
                      ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/25" 
                      : "bg-[#111827] hover:bg-gray-800 border-[#1F2937]/80 hover:border-indigo-400 text-gray-400 hover:text-white"
                  }`}
                  title={isFullScreen ? "Exit Fullscreen (Esc)" : "Fullscreen Map"}
                >
                  {isFullScreen ? <Minimize2 className="h-4.5 w-4.5 animate-pulse" /> : <Maximize2 className="h-4.5 w-4.5" />}
                </button>
              </div>
            <div className="hidden sm:block text-[10px] font-mono text-gray-400 bg-[#0B1120]/80 border border-[#1F2937]/60 px-3 py-1.5 rounded-xl backdrop-blur-sm">
              <span>🎮 Pan • Zoom {Math.round(scale * 100)}%</span>
            </div>
          </div>

          {/* FLOATING HUD LEGEND OVERLAY */}
          <div className="absolute top-4 right-4 z-20 hidden md:flex flex-col gap-1.5 bg-[#0B1120]/95 border border-[#1F2937]/80 px-3.5 py-2.5 rounded-xl shadow-lg backdrop-blur-md text-[10px] font-mono select-none">
            <span className="text-gray-400 font-bold mb-1 border-b border-[#1F2937]/40 pb-1 uppercase tracking-wider block">BRANCH PATHS</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
              <span className="text-gray-300">Java Foundations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
              <span className="text-gray-300">DSA & Algorithms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50"></span>
              <span className="text-gray-300">Databases & SQL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
              <span className="text-gray-300">Operating Systems</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
              <span className="text-gray-300">Portfolio & Placement</span>
            </div>
          </div>

          {/* Dotted Blueprint Grid */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05]"
            style={{
              backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              transformOrigin: "0 0"
            }}
          />

          {/* Real-time coordinates helper in margin */}
          <div className="absolute bottom-4 left-4 z-20 text-[9px] font-mono text-gray-500 bg-[#0B1120]/65 px-2 py-1 rounded">
            PAN: X: {Math.round(pan.x)} • Y: {Math.round(pan.y)}
          </div>

          {/* MAP CANVAS SCROLLER PLATFORM */}
          <div
            className="absolute origin-top-left"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
              width: "1400px",
              height: "2200px"
            }}
          >
            {/* 1. LAYER ONE: SVG PIPELINE CONNECTIONS (Curves between prerequisite nodes) */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{
                width: "1400px",
                height: "2200px",
                zIndex: 1
              }}
            >
              {skillNodes.map((node) => {
                return node.prerequisites.map((prereqId) => {
                  const parent = skillNodes.find((n) => n.id === prereqId);
                  if (!parent) return null;
                  
                  // Coordinate bounds
                  const sx = parent.x;
                  const sy = parent.y;
                  const ex = node.x;
                  const ey = node.y;

                  // Smooth cubic bezier path layout
                  const midY = (sy + ey) / 2;
                  const pathD = `M ${sx} ${sy} C ${sx} ${midY}, ${ex} ${midY}, ${ex} ${ey}`;

                  const status = nodesStatusMap[node.id];
                  const isCompleted = status === "completed" || status === "legendary";

                  // Assign aesthetic connection pipeline color depending on branch
                  let branchColor = "#1F2937";
                  if (isCompleted) {
                    if (node.category === "Java" || node.category === "Root") {
                      branchColor = "#3B82F6";
                    } else if (node.category === "DSA") {
                      branchColor = "#10B981";
                    } else if (node.category === "Database") {
                      branchColor = "#A855F7";
                    } else if (node.category === "OS") {
                      branchColor = "#F43F5E";
                    } else {
                      branchColor = "#F59E0B";
                    }
                  }

                  // Glow & Pulse connection path effect based on hover/adjacent selections
                  const isActivePath = (selectedNodeId === node.id || selectedNodeId === parent.id) || 
                                       (hoveredNodeId === node.id || hoveredNodeId === parent.id);

                  let activePathColor = isCompleted ? branchColor : "#374151";
                  if (isActivePath) {
                    if (node.category === "Java" || node.category === "Root") {
                      activePathColor = "#3B82F6";
                    } else if (node.category === "DSA") {
                      activePathColor = "#10B981";
                    } else if (node.category === "Database") {
                      activePathColor = "#A855F7";
                    } else if (node.category === "OS") {
                      activePathColor = "#F43F5E";
                    } else {
                      activePathColor = "#F59E0B";
                    }
                  }

                  return (
                    <g key={`${node.id}-${prereqId}`}>
                      {/* Underlay glow path/pipeline if completed or active */}
                      {(isCompleted || isActivePath) && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={activePathColor}
                          strokeWidth={isActivePath ? 10 : 6}
                          className={`opacity-20 blur-[3px] transition-all duration-355 ${isActivePath ? "animate-pulse" : ""}`}
                        />
                      )}
                      
                      {/* Central connection line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isActivePath ? activePathColor : (isCompleted ? branchColor : "#1F2937")}
                        strokeWidth={isActivePath ? 3.5 : 2}
                        strokeDasharray={isCompleted ? "none" : "5 5"}
                        className="transition-all duration-300"
                      />
                      
                      {/* Animated flow node bullets along pipeline */}
                      {(isCompleted || isActivePath) && (
                        <circle r={isActivePath ? 5 : 3} fill={isActivePath ? "#FFFFFF" : activePathColor} className="transition-all duration-300">
                          <animateMotion
                            path={pathD}
                            dur={isActivePath ? "1.5s" : "4.5s"}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                });
              })}
            </svg>

            {/* 2. LAYER TWO: ICONIC NODES LAYER */}
            {filteredNodes.map((node) => {
              const status = nodesStatusMap[node.id];
              const isSelected = selectedNodeId === node.id;
              const CodeIcon = getNodeIcon(node);
              const isMatchingQuery = searchQuery ? node.label.toLowerCase().includes(searchQuery.toLowerCase()) || node.category.toLowerCase().includes(searchQuery.toLowerCase()) : true;

              let circleBg = "bg-[#0b1120] border-[#1F2937] text-gray-700";
              let textColor = "text-gray-500";
              let branchColor = "#1F2937";

              // Find category specifics
              if (node.category === "Java" || node.category === "Root") {
                branchColor = "#3B82F6";
              } else if (node.category === "DSA") {
                branchColor = "#10B981";
              } else if (node.category === "Database") {
                branchColor = "#A855F7";
              } else if (node.category === "OS") {
                branchColor = "#F43F5E";
              } else {
                branchColor = "#F59E0B";
              }

              // Apply theme colors per status
              if (status === "legendary") {
                circleBg = `bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-lg shadow-yellow-500/20`;
                textColor = "text-amber-400 font-extrabold";
              } else if (status === "completed") {
                circleBg = `bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20`;
                textColor = "text-emerald-400 font-bold";
              } else if (status === "in_progress") {
                circleBg = `bg-amber-500 border-amber-300 text-slate-950 animate-pulse shadow-md shadow-amber-500/25`;
                textColor = "text-amber-500 font-bold";
              } else if (status === "available") {
                circleBg = "bg-slate-900 border-indigo-500/80 text-indigo-300 hover:border-indigo-400 shadow-sm shadow-indigo-500/10";
                textColor = "text-indigo-300";
              } else {
                circleBg = "bg-gray-950/80 border-gray-800 text-gray-700 opacity-55";
                textColor = "text-gray-650";
              }

              return (
                <motion.div
                  key={node.id}
                  layoutId={node.id}
                  whileHover={status !== "locked" ? { scale: 1.15 } : {}}
                  whileTap={status !== "locked" ? { scale: 0.95 } : {}}
                  onMouseEnter={() => {
                    if (status !== "locked") {
                      setHoveredNodeId(node.id);
                    }
                  }}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  onClick={() => {
                    if (status !== "locked") {
                      setSelectedNodeId(node.id);
                      setIsDrawerOpen(true);
                    }
                  }}
                  className={`absolute flex flex-col items-center justify-center cursor-pointer select-none transition-opacity duration-300 skill-node-card ${
                    isMatchingQuery ? "opacity-100" : "opacity-10 pointer-events-none"
                  }`}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: "translate(-50%, -50%)",
                    width: "110px",
                    zIndex: isSelected ? 40 : 10
                  }}
                >
                  <div className="relative group flex flex-col items-center">
                    {/* Pulsing visual glow overlay */}
                    {status !== "locked" && (
                      <motion.div 
                        animate={{
                          boxShadow: isSelected 
                            ? "0 0 25px rgba(99, 102, 241, 0.75)" 
                            : status === "in_progress"
                            ? ["0 0 0px rgba(245, 158, 11, 0.2)", "0 0 16px rgba(245, 158, 11, 0.7)", "0 0 0px rgba(245, 158, 11, 0.2)"]
                            : status === "legendary"
                            ? ["0 0 0px rgba(245, 158, 11, 0.1)", "0 0 12px rgba(245, 158, 11, 0.5)", "0 0 0px rgba(245, 158, 11, 0.1)"]
                            : status === "completed"
                            ? ["0 0 0px rgba(16, 185, 129, 0.1)", "0 0 10px rgba(16, 185, 129, 0.4)", "0 0 0px rgba(16, 185, 129, 0.1)"]
                            : ["0 0 0px rgba(99, 102, 241, 0.05)", "0 0 8px rgba(99, 102, 241, 0.3)", "0 0 0px rgba(99, 102, 241, 0.05)"]
                        }}
                        transition={{
                          duration: status === "in_progress" ? 1.4 : 2.5,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="absolute inset-0 rounded-full"
                      />
                    )}

                    {/* Ping active identifier anchor */}
                    {isSelected && (
                      <span className="absolute -top-3 w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping z-20" />
                    )}

                    {/* Circular Iconic Representation */}
                    <div 
                      className={`w-13 h-13 rounded-full border-2 flex items-center justify-center relative transition-all duration-300 ${circleBg} ${
                        isSelected ? "ring-4 ring-indigo-500/50 scale-105 border-white" : ""
                      }`}
                    >
                      {status === "locked" ? (
                        <Lock className="h-4.5 w-4.5 text-gray-700" />
                      ) : (
                        <CodeIcon className="h-5 w-5" />
                      )}

                      {/* Overlays badges status icon markers */}
                      {status === "legendary" && (
                        <Trophy className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300 fill-yellow-400" />
                      )}
                      {status === "in_progress" && (
                        <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-slate-950 animate-spin" />
                      )}
                    </div>

                    {/* Sleek Minimal Label */}
                    <span className={`text-[10px] font-mono text-center font-bold tracking-tight mt-1.5 leading-tight uppercase select-none transition-colors truncate max-w-[100px] ${textColor}`}>
                      {getSleekLabel(node)}
                    </span>
                    <span className="text-[8px] font-mono text-[#4a5568] font-bold block mt-0.5 scale-90 leading-none">
                      WK {node.weeks[0]}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* INTERACTIVE MINI-MAP WATERMARK VIEWPORT */}
          <div 
            ref={minimapContainerRef}
            onMouseDown={handleMinimapClickOrDrag}
            onMouseMove={handleMinimapMouseMove}
            onMouseUp={handleMinimapMouseUp}
            onMouseLeave={handleMinimapMouseUp}
            onTouchStart={handleMinimapTouchStart}
            onTouchMove={handleMinimapTouchMove}
            onTouchEnd={handleMinimapMouseUp}
            className="absolute bottom-4 right-4 z-25 w-36 h-[200px] rounded-xl bg-[#090D1A]/95 border border-[#1F2937] overflow-hidden select-none cursor-crosshair shadow-2xl backdrop-blur-sm hidden sm:block"
            title="Drag minimap viewport to navigate instantly"
          >
            {/* Ambient radar sweeps overlay */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-indigo-500/30 animate-[pulse_3s_infinite]" />
            <div className="absolute inset-0 bg-[#0B1120]/20" />
            <div className="text-[7.5px] font-mono text-[#4A5568] px-1.5 py-1 uppercase tracking-widest bg-slate-950/40 border-b border-[#1F2937]/50 flex justify-between items-center leading-none">
              <span>Radar View</span>
              <span className="text-[5.5px] animate-ping text-indigo-500">●</span>
            </div>

            {/* Static layout points mapped inside */}
            <div className="relative w-full h-[178px]">
              {skillNodes.map((n) => {
                const status = nodesStatusMap[n.id];
                let ptColor = "bg-gray-800";
                if (status === "completed" || status === "legendary") {
                  ptColor = n.category === "Java" || n.category === "Root" ? "bg-blue-500" : n.category === "DSA" ? "bg-emerald-500" : n.category === "Database" ? "bg-purple-500" : "bg-amber-500";
                } else if (status === "available" || status === "in_progress") {
                  ptColor = "bg-indigo-400";
                }
                return (
                  <span 
                    key={`minimap-pt-${n.id}`}
                    className={`absolute w-1 h-1 rounded-full transition-colors ${ptColor}`}
                    style={{
                      left: `${(n.x / 1400) * 100}%`,
                      top: `${(n.y / 2200) * 100}%`,
                      transform: "translate(-50%, -50%)"
                    }}
                  />
                );
              })}

              {/* DRAGGABLE VIEWPORT WINDOW */}
              <div 
                className="absolute border border-indigo-400 bg-indigo-500/10 pointer-events-none rounded transition-all shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                style={{
                  left: `${viewportRect.left}%`,
                  top: `${viewportRect.top}%`,
                  width: `${viewportRect.width}%`,
                  height: `${viewportRect.height}%`,
                }}
              />
            </div>
          </div>
        </div>
        ) : (
          /* HORIZONTAL LANES CONTAINER (ROWS VIEW) */
          <div className="space-y-6 w-full">
            {tracks.map((track) => {
              const IconComponent = track.icon;
              return (
                <div 
                  key={track.id}
                  className="bg-[#111827] border border-[#1F2937] rounded-2xl p-5 space-y-4 hover:border-[#1F2937]/90 transition-all duration-300 relative overflow-hidden flex flex-col w-full"
                >
                  {/* Decorative glowing gradient backdrop */}
                  <div className={`absolute top-0 left-0 w-80 h-full bg-gradient-to-r ${track.color} pointer-events-none opacity-30 z-0`}></div>

                  {/* Header metadata details of this specific RPG Tech tree track */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1F2937]/50 pb-3 relative z-10 w-full">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 bg-[#0B1120] border border-[#1F2937]/80 rounded-xl ${track.borderColor}`}>
                        <IconComponent className={`h-4.5 w-4.5 ${track.accentTextColor}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-white font-sans tracking-tight">{track.name}</h3>
                        <p className="text-[10px] text-gray-405 font-sans mt-0.5">{track.description}</p>
                      </div>
                    </div>
                    {/* Visual XP Completion of this specific track */}
                    <div className="text-[10px] font-mono text-gray-400 bg-[#0B1120] border border-[#1F2937] px-3 py-1 rounded-lg">
                      Track Progress: <strong className="text-white font-bold">
                        {track.nodes.filter(n => nodesStatusMap[n.id] === "completed" || nodesStatusMap[n.id] === "legendary").length} / {track.nodes.length}
                      </strong>
                    </div>
                  </div>

                  {/* HORIZONTAL SWIPEABLE NODE PATH */}
                  <div className="relative z-10 w-full overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-slate-850 px-1">
                    <div className="flex items-center min-w-max gap-6 pr-4">
                      {track.nodes.map((node, index) => {
                        const status = nodesStatusMap[node.id];
                        const isSelected = selectedNodeId === node.id;
                        const CodeIcon = getNodeIcon(node);

                        let nodeCircleBg = "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed";
                        let progressPipelineClass = "bg-gray-800";
                        let statusMarker = null;
                        let textHighlightColor = "text-gray-400";

                        if (status === "completed") {
                          nodeCircleBg = "bg-[#10B981] text-[#022C22] border-emerald-400 hover:bg-emerald-400 cursor-pointer shadow-md shadow-emerald-500/10";
                          progressPipelineClass = "bg-emerald-500";
                          textHighlightColor = "text-emerald-400 font-medium";
                        } else if (status === "legendary") {
                          nodeCircleBg = "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 hover:from-amber-400 hover:to-yellow-400 cursor-pointer ring-1 ring-yellow-400/30 shadow-md shadow-yellow-500/15";
                          progressPipelineClass = "bg-amber-400 animate-pulse";
                          statusMarker = <Trophy className="h-2.5 w-2.5 absolute -top-1 -right-1 text-yellow-300 fill-yellow-400" />;
                          textHighlightColor = "text-amber-400 font-bold";
                        } else if (status === "in_progress") {
                          nodeCircleBg = "bg-amber-500 border-amber-300 text-slate-950 hover:bg-amber-400 cursor-pointer ring-2 ring-amber-500/30 shadow-md";
                          progressPipelineClass = "bg-amber-500";
                          statusMarker = <Sparkles className="h-2.5 w-2.5 absolute -top-1 -right-1 text-slate-950 animate-spin" />;
                          textHighlightColor = "text-amber-500 font-semibold";
                        } else if (status === "available") {
                          nodeCircleBg = "bg-indigo-950/80 border-indigo-500 text-indigo-300 hover:bg-indigo-900/60 hover:border-indigo-400 hover:text-white cursor-pointer shadow-sm shadow-indigo-500/10";
                          progressPipelineClass = "bg-[#1F2937]";
                          textHighlightColor = "text-indigo-300";
                        }

                        return (
                          <div key={node.id} className="flex items-center">
                            {/* Visual Connecting bridge line between items (omit for first item) */}
                            {index > 0 && (
                              <div className="w-10 h-0.5 relative shrink-0">
                                <div className={`absolute inset-0 ${progressPipelineClass} transition-colors duration-300`}></div>
                                {status !== "locked" && (
                                  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/80 animate-ping" style={{ animationDuration: "3s" }} />
                                )}
                              </div>
                            )}

                            {/* Node Button card */}
                            <div
                              onClick={() => {
                                if (status !== "locked") {
                                  setSelectedNodeId(node.id);
                                  setIsDrawerOpen(true);
                                }
                              }}
                              className={`flex items-center gap-3 bg-[#0B1120]/80 border ${
                                isSelected ? "border-indigo-400 ring-2 ring-indigo-500/30" : "border-[#1F2937]/80 hover:border-gray-700"
                              } rounded-xl p-3 cursor-pointer shrink-0 transition-all duration-305 select-none`}
                            >
                              {/* Round icon badge */}
                              <div className={`w-9 h-9 rounded-full border flex items-center justify-center relative shrink-0 ${nodeCircleBg}`}>
                                {status === "locked" ? (
                                  <Lock className="h-3.5 w-3.5 text-gray-500" />
                                ) : (
                                  <CodeIcon className="h-4.5 w-4.5" />
                                )}
                                {statusMarker}
                              </div>

                              {/* Node Label details text */}
                              <div className="flex flex-col max-w-[120px]">
                                <span className={`text-[11px] font-bold truncate leading-tight uppercase font-mono ${textHighlightColor}`}>
                                  {getSleekLabel(node)}
                                </span>
                                <span className="text-[8px] font-mono text-gray-500 font-bold block mt-0.5">
                                  Week {node.weeks[0]}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DYNAMIC COMPREHENSIVE MEDAL ARCHIVE HALL OF FAME ROW */}
        <div className="bg-[#111827] border border-[#1F2937]/75 rounded-2xl p-6 shadow-lg w-full">
          <div className="border-b border-[#1F2937]/75 pb-3.5 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h3 className="text-sm font-black uppercase font-sans text-white tracking-wide flex items-center gap-2">
                <Award className="h-4.5 w-4.5 text-amber-400 fill-amber-400/15" />
                Srivishnu's RPG Medals Hall of Fame
              </h3>
              <p className="text-[10px] text-gray-500 font-sans mt-0.5">
                Inspect achieved benchmarks unlocked sequentially through syllabus syllabus mastery and mocks mock exams.
              </p>
            </div>
            <div className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl shrink-0 self-start sm:self-center">
              Total Unlocked: {badges.filter(b => b.unlocked).length} / {badges.length}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {badges.map((badge) => (
              <div 
                key={badge.id}
                className={`relative p-3.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all duration-300 ${
                  badge.unlocked 
                    ? "bg-amber-500/10 border-amber-500/35 hover:scale-105 cursor-pointer shadow-md shadow-amber-500/5 hover:border-amber-400" 
                    : "bg-[#0B1120] border-[#1F2937]/50 opacity-40 hover:opacity-50"
                }`}
                title={`${badge.label}: ${badge.description}`}
              >
                <span className="text-2xl mb-1.5 filter drop-shadow">
                  {badge.label.split(" ")[0]}
                </span>
                <span className="text-[10px] font-sans font-black text-white leading-tight uppercase font-mono truncate max-w-full block">
                  {badge.label.split(" ").slice(1).join(" ")}
                </span>
                <span className="text-[8.5px] font-sans text-gray-500 block leading-tight mt-1">
                  {badge.description}
                </span>

                {badge.unlocked && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* OVERLAY SLIDING SIDE DRAWER PANEL FOR SELECTED ACTIVE NODE WALKTHROUGH */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Dark background blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-[#030712]/80 backdrop-blur-md z-50 cursor-pointer"
            />

            {/* Slide-out Sheet Panel from right side */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 190 }}
              className="fixed top-0 right-0 h-full w-[480px] max-w-full bg-[#111827] border-l-2 border-indigo-500/35 shadow-2xl z-50 overflow-y-auto p-6 flex flex-col justify-between scrollbar-thin scrollbar-thumb-slate-800"
            >
              {/* Main Contents scroll container */}
              <div className="space-y-6">
                
                {/* Header Title Information card */}
                <div className="flex items-start justify-between border-b border-[#1F2937]/60 pb-4">
                  <div className="space-y-1.5 flex-grow pr-4">
                    <span className="text-[9px] font-mono text-[#60A5FA] uppercase font-bold block leading-none tracking-wider">
                      QUEST ATTRIBUTE DETAILS
                    </span>
                    <h3 className="text-lg font-black text-white font-sans mt-1.5 tracking-tight leading-snug">
                      {selectedNode.label}
                    </h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-[9px] uppercase font-mono tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-bold leading-none">
                        Category: {selectedNode.category}
                      </span>
                      <span className="text-gray-600 font-mono text-xs">•</span>
                      <span className="text-[10px] font-mono text-gray-400 font-semibold block leading-none">
                        Weeks range: {selectedNode.weekRange}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase ${
                      selectedNodeStatus === "completed" || selectedNodeStatus === "legendary" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400" :
                      selectedNodeStatus === "in_progress" ? "bg-amber-500/10 border border-amber-500/30 text-amber-500 animate-pulse" :
                      selectedNodeStatus === "available" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" :
                      "bg-slate-500/10 border border-slate-500/20 text-slate-500"
                    }`}>
                      {selectedNodeStatus}
                    </span>
                    <button
                      onClick={() => setIsDrawerOpen(false)}
                      className="p-1.5 bg-[#0B1120] hover:bg-gray-800 border border-[#1F2937]/60 hover:border-indigo-400 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Close Attributes Sheet"
                    >
                      <X className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Module walkthrough body items */}
                <div className="space-y-5 text-xs">
                  
                  {/* Objectives card description */}
                  <div className="bg-[#0B1120] border border-[#1F2937]/80 rounded-xl p-4 space-y-2">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-[#60A5FA] font-bold block leading-none">
                      OBJECTIVE WALKTHROUGH
                    </span>
                    <p className="text-gray-300 mt-1 lines-normal leading-relaxed text-xs font-sans">
                      {selectedNode.details.objectives}
                    </p>
                  </div>

                  {/* Active Quest Milestones with completion logs */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-white font-mono flex items-center gap-1.5 text-xs">
                      <Circle className="h-3.5 w-3.5 text-[#34D399] fill-emerald-500/20" />
                      Active Quest Milestones
                    </h4>
                    <div className="space-y-1.5">
                      {selectedNode.details.goals.map((goal, index) => {
                        const gKey = `${selectedNode.weeks[0]}-${index}`;
                        const isGoalCompleted = completedGoals.includes(gKey);
                        return (
                          <div 
                            key={index}
                            onClick={() => toggleGoalCompletion(gKey)}
                            className="flex items-start gap-3 p-3 bg-[#0B1120] hover:bg-[#151f32] border border-[#1F2937] hover:border-gray-700 rounded-xl text-xs font-sans leading-relaxed text-gray-300 cursor-pointer transition-all duration-200"
                          >
                            <CheckCircle2 className={`h-4.5 w-4.5 mt-0.5 flex-shrink-0 transition-colors ${
                              isGoalCompleted || selectedNodeStatus === "completed" || selectedNodeStatus === "legendary" 
                                ? "text-emerald-400 fill-emerald-500/10" 
                                : "text-gray-600 hover:text-gray-400"
                            }`} />
                            <span className={(isGoalCompleted || selectedNodeStatus === "completed" || selectedNodeStatus === "legendary") ? "line-through text-gray-500" : ""}>{goal}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Curated drops materials links */}
                  {selectedNode.details.resources.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="font-bold text-white font-mono flex items-center gap-1.5 text-xs">
                        <BookOpen className="h-4 w-4 text-purple-400 animate-pulse" />
                        Quest Materials & Drops ({selectedNode.details.resources.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedNode.details.resources.map((res, index) => {
                          const resKey = `${selectedNode.weeks[0]}-res-${index}`;
                          const isResCompleted = completedResources.includes(resKey);
                          return (
                            <div 
                              key={index}
                              className="bg-[#0B1120] border border-[#1F2937] rounded-xl p-3 flex flex-col space-y-2 hover:border-gray-700 transition"
                            >
                              <div className="flex items-center justify-between">
                                <button 
                                  onClick={() => toggleResourceCompletion(resKey)}
                                  className={`text-xs font-bold truncate max-w-[280px] cursor-pointer flex items-center gap-2 text-left ${
                                    isResCompleted ? "line-through text-gray-500" : "text-white"
                                  }`}
                                >
                                  <CheckCircle2 className={`h-3.5 w-3.5 ${isResCompleted ? "text-emerald-400" : "text-gray-600"}`} />
                                  {res.name}
                                </button>
                                <span className="text-[8px] font-mono uppercase bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded leading-none font-bold">
                                  {res.priority} Priority
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[9px] font-mono text-gray-500 pt-1.5 border-t border-[#1F2937]/50">
                                <span>Timing Required: {res.time}</span>
                                <a 
                                  href={res.url} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-[#60A5FA] hover:text-white flex items-center gap-0.5 font-bold"
                                >
                                  Examine Loot <ArrowRight className="h-2.5 w-2.5 text-[#60A5FA]" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Overriding state trigger buttons */}
                  <div className="pt-2 border-t border-[#1F2937]/50">
                    <button
                      onClick={handleToggleNodeWeeksState}
                      className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 font-mono text-xs font-bold cursor-pointer transition-all duration-300 ${
                        selectedNodeStatus === "completed" || selectedNodeStatus === "legendary"
                          ? "bg-red-500/10 border-red-500/25 text-red-400 hover:bg-red-500/20"
                          : "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                      }`}
                    >
                      <Zap className={`h-3.5 w-3.5 shrink-0 ${selectedNodeStatus === "completed" || selectedNodeStatus === "legendary" ? "text-red-400" : "text-emerald-400"}`} />
                      {selectedNodeStatus === "completed" || selectedNodeStatus === "legendary" ? "MARK QUEST UNDONE" : "COMPLETE SKILL QUEST"}
                    </button>
                  </div>

                  {/* Notes / Journal system logs */}
                  <div className="space-y-2 pt-3 border-t border-[#1F2937]/60">
                    <h4 className="font-bold text-white font-mono flex items-center gap-1.5 text-xs">
                      <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                      Quest Log & Notebook Study Journals
                    </h4>
                    <p className="text-[9px] text-gray-500 block leading-tight">
                      Log academic insights for future audits. Input log notes to earn bonus training XP immediately.
                    </p>
                    <textarea
                      value={nodeNotes}
                      onChange={(e) => setNodeNotes(e.target.value)}
                      onBlur={saveNodeNotes}
                      placeholder="e.g. Coded sliding window recursion base conditions. Time Complexity: O(N), Space Complexity: O(H)..."
                      rows={3}
                      className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl p-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                    />
                  </div>

                </div>
              </div>

              {/* Bottom footer elements inside sheet */}
              <div className="mt-8 border-t border-[#1F2937]/60 pt-4 flex items-center justify-between text-[10px] font-mono text-gray-500 shrink-0">
                <span>RECRUITMENT OPPONENT: ZOHO DRIVE</span>
                <span className="text-indigo-400 font-bold font-mono">TRAINER L {xpMetrics.level}</span>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
