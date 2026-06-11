export interface CuratedResource {
  name: string;
  purpose: string;
  priority: 'low' | 'medium' | 'high';
  timePerWeek: number; // in hours
  link: string;
  category: 'Java' | 'DSA' | 'SQL' | 'DBMS' | 'OS' | 'OOP' | 'Competitive Programming' | 'Projects' | 'Interview Preparation';
}

export interface WeekData {
  week: number;
  phaseId: string;
  title: string;
  objective: string;
  dailyRoutine: string[];
  goals: string[];
  milestone: string | null;
  targetMetrics: {
    leetcode: number; // problems to solve
    sql: number; // queries to write
    projectPercent: number; // progress on projects
    mockInterviews: number; // tests taken
  };
  resources: CuratedResource[];
}

export interface PhaseData {
  id: string;
  title: string;
  description: string;
  color: string; // HEX code for styling
  bgClass: string; // Tailwind background color mix
  borderClass: string; // Tailwind border
  textClass: string; // Tailwind text color
  weeksRange: string; // "1-12", "13-36", etc.
}

export const PHASES: PhaseData[] = [
  {
    id: "phase-1",
    title: "Phase 1: Java Mastery & Aptitude Foundation",
    description: "Months 1–3 (Weeks 1–12): Java mastery + daily aptitude habit. Build a direct written round speed-advantage.",
    color: "#60A5FA",
    bgClass: "bg-blue-500/10",
    borderClass: "border-blue-500/20",
    textClass: "text-[#60A5FA]",
    weeksRange: "1–12"
  },
  {
    id: "phase-2",
    title: "Phase 2: Full DSA & Core CS Subjects",
    description: "Months 4–9 (Weeks 13–36): Master full A–Z DSA (Striver) + DBMS (Gate Smashers) + OS + OOP Deep Dive. Solve 100+ LeetCode Mediums.",
    color: "#34D399",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/20",
    textClass: "text-[#34D399]",
    weeksRange: "13–36"
  },
  {
    id: "phase-3",
    title: "Phase 3: Competitive Coding & 3 Real Projects",
    description: "Months 10–13.5 (Weeks 37–54): Rated Codeforces/CodeChef sprints + build 3 high-quality Zoho-relevant Java/Spring REST backends.",
    color: "#FBBF24",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/20",
    textClass: "text-[#FBBF24]",
    weeksRange: "37–54"
  },
  {
    id: "phase-4",
    title: "Phase 4: Zoho Final Prep & Mock Simulations",
    description: "Months 14–18 (Weeks 55–72): Re-solve past Zoho machine coding (L3), Top 50 SQL, Pramp mock interviews, and earn Zoho Learn Certifications.",
    color: "#F87171",
    bgClass: "bg-red-500/10",
    borderClass: "border-red-500/20",
    textClass: "text-[#F87171]",
    weeksRange: "55–72"
  }
];

export const MAJOR_MILESTONES = [
  { week: 12, title: "Java + OOP Mastered", description: "Successfully finished Phase 1 with complete working Java console files and scored 65%+ on Aptitude mocks." },
  { week: 20, title: "50 LeetCode Problems", description: "First major DSA milestone! Write BS algorithms from memory with correct bounds." },
  { week: 28, title: "100 LeetCode Problems", description: "Coded solutions for complex recursion and backtracking maps." },
  { week: 31, title: "DBMS & SQL Mastered", description: "Able to write INNER, LEFT, RIGHT, and GROUP BY + HAVING queries cleanly." },
  { week: 33, title: "OS Concepts Solid", description: "Explain scheduling policies, virtual memory, and deadlocks verbally like a pro." },
  { week: 36, title: "GitHub Profile Live", description: "Constructed public repositories holding previous solutions. DSA folder pushed." },
  { week: 40, title: "Project 1 Complete", description: "Mini SaaS Contact Manager REST server implemented and documented successfully." },
  { week: 43, title: "200 LeetCode Problems", description: "Mastery of advanced pointer offsets, binary searches, and collections cycles." },
  { week: 43, title: "Project 2 Complete", description: "Full Inventory/Resource Task Tracker live with clean REST endpoints." },
  { week: 47, title: "Project 3 Complete", description: "Showpiece Spring Boot CRM App completed with Jwt, pagination, and multi-user charts." },
  { week: 47, title: "250 LeetCode Problems", description: "Comfortable resolving dynamic programming matrix routes." },
  { week: 48, title: "SQL Top 50 Done", description: "Mastered Top 50 SQL challenges on LeetCode database boards." },
  { week: 53, title: "300 LeetCode Problems", description: "Crossed 300 DSA coding challenges on LeetCode!" },
  { week: 59, title: "First Pramp Session", description: "Overcome interview anxiety! Practiced explaining complexity analyses under live constraints." },
  { week: 65, title: "Zoho Learn Certifications", description: "Gained competitive edge by holding formal badges from Zoho's active learning ecosystem." },
  { week: 62, title: "Full Simulation #1", description: "Completed an end-to-end Zoho written mock test with strict timers." },
  { week: 69, title: "Full Simulation #2", description: "Final Dress Rehearsal! Completed written, DSA, and SQL rounds inside 3 hours limit." },
  { week: 72, title: "Placement Drive Ready!", description: "Srivishnu (Sir) has successfully completed the 72-week OS roadmap! Stand out from 99% of candidates." }
];

const CANONICAL_RESOURCES = {
  // Phase 1
  kunalJava: { name: "Kunal Kushwaha — Java Full Course", purpose: "Best free Java course from scratch — OOP to advanced", priority: "high" as const, timePerWeek: 10, link: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ", category: "Java" as const },
  teluskoJava: { name: "Telusko — Java Beginner Tutorial", purpose: "Quick visual supplement for Java concepts", priority: "medium" as const, timePerWeek: 3, link: "https://www.youtube.com/playlist?list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5", category: "Java" as const },
  w3sJava: { name: "W3Schools Java", purpose: "Quick syntax reference — keep open while coding", priority: "medium" as const, timePerWeek: 2, link: "https://www.w3schools.com/java/", category: "Java" as const },
  hrJava: { name: "HackerRank — Java Domain", purpose: "Test Java as you learn — immediate feedback", priority: "high" as const, timePerWeek: 5, link: "https://www.hackerrank.com/domains/java", category: "Java" as const },
  indiaBixApt: { name: "IndiaBix — Aptitude", purpose: "Daily aptitude drill — Zoho written round tests this", priority: "high" as const, timePerWeek: 3, link: "https://www.indiabix.com/", category: "Interview Preparation" as const },
  gfgApt: { name: "GeeksForGeeks — Aptitude", purpose: "Extra aptitude question bank with explanations", priority: "medium" as const, timePerWeek: 2, link: "https://www.geeksforgeeks.org/aptitude-questions-and-answers/", category: "Interview Preparation" as const },
  gfgOopJava: { name: "GeeksForGeeks — OOP in Java", purpose: "Deep OOP theory — Zoho technical interviews go deep", priority: "high" as const, timePerWeek: 2, link: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/", category: "OOP" as const },

  // Phase 2
  striverDsaPlaylist: { name: "take U forward — Striver's DSA Playlist", purpose: "Gold standard free DSA course — follow as primary guide", priority: "high" as const, timePerWeek: 8, link: "https://www.youtube.com/@takeUforward", category: "DSA" as const },
  striverDsaSheet: { name: "Striver's A2Z DSA Sheet", purpose: "455-problem structured sheet — use as daily checklist", priority: "high" as const, timePerWeek: 14, link: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/", category: "DSA" as const },
  leetcode: { name: "LeetCode", purpose: "1 problem/day minimum — target 150+ Easy & Medium", priority: "high" as const, timePerWeek: 10, link: "https://leetcode.com/", category: "DSA" as const },
  gfgDsa: { name: "GeeksForGeeks — DSA", purpose: "Theory + extra problems per topic", priority: "medium" as const, timePerWeek: 2, link: "https://www.geeksforgeeks.org/data-structures/", category: "DSA" as const },
  gateSmDBMS: { name: "Gate Smashers — DBMS Full Course", purpose: "Complete DBMS — normalization, transactions, indexing", priority: "high" as const, timePerWeek: 3, link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBuCdJgiOkT2Y", category: "DBMS" as const },
  sqlZoo: { name: "SQLZoo — Interactive SQL", purpose: "Run SQL in browser instantly — best way to start SQL", priority: "high" as const, timePerWeek: 2, link: "https://sqlzoo.net/", category: "SQL" as const },
  hrSql: { name: "HackerRank — SQL Domain", purpose: "SQL problem sets — Zoho tests SQL directly", priority: "high" as const, timePerWeek: 3, link: "https://www.hackerrank.com/domains/sql", category: "SQL" as const },
  gateSmOS: { name: "Gate Smashers — OS Full Course", purpose: "Processes, threading, memory, scheduling", priority: "high" as const, timePerWeek: 3, link: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p", category: "OS" as const },

  // Phase 3
  codeforces: { name: "Codeforces", purpose: "Weekly rated contests to sharpen speed", priority: "high" as const, timePerWeek: 5, link: "https://codeforces.com/", category: "Competitive Programming" as const },
  codechef: { name: "CodeChef", purpose: "Monthly contests + Learning Hub + competitive rating", priority: "high" as const, timePerWeek: 4, link: "https://www.codechef.com/", category: "Competitive Programming" as const },
  github: { name: "GitHub", purpose: "Host all 3 projects — interviewers check this", priority: "high" as const, timePerWeek: 5, link: "https://github.com/", category: "Projects" as const },
  fccWeb: { name: "freeCodeCamp", purpose: "Web fundamentals needed to build and deploy projects", priority: "medium" as const, timePerWeek: 5, link: "https://www.freecodecamp.org/", category: "Projects" as const },
  amigoscodeSpring: { name: "Amigoscode — Spring Boot Full Course", purpose: "Build Java backend projects — directly relevant to Zoho stack", priority: "high" as const, timePerWeek: 5, link: "https://www.youtube.com/@amigoscode", category: "Projects" as const },

  // Phase 4
  gfgZohoExp: { name: "GeeksForGeeks — Zoho Interview Experiences", purpose: "Real interview stories — understand what is actually asked", priority: "high" as const, timePerWeek: 2, link: "https://www.geeksforgeeks.org/zoho-interview-experience/", category: "Interview Preparation" as const },
  prepinstaZoho: { name: "Prepinsta — Zoho Complete Prep", purpose: "Zoho previous papers, pattern analysis, mock tests", priority: "high" as const, timePerWeek: 4, link: "https://prepinsta.com/zoho/", category: "Interview Preparation" as const },
  lcTopSql50: { name: "LeetCode — Top SQL 50", purpose: "Curated 50 SQL problems for Zoho written round", priority: "high" as const, timePerWeek: 3, link: "https://leetcode.com/studyplan/top-sql-50/", category: "SQL" as const },
  interviewBit: { name: "InterviewBit", purpose: "Company-specific prep, timed assessments", priority: "high" as const, timePerWeek: 3, link: "https://www.interviewbit.com/", category: "Interview Preparation" as const },
  pramp: { name: "Pramp — Free Mock Interviews", purpose: "Real-time mock interviews with peers — remove stage fear", priority: "high" as const, timePerWeek: 3, link: "https://www.pramp.com/", category: "Interview Preparation" as const },
  zohoLearn: { name: "Zoho Learn — Free Certifications", purpose: "Zoho's own platform — certifications show real initiative", priority: "medium" as const, timePerWeek: 2, link: "https://www.zoho.com/learn/", category: "Interview Preparation" as const }
};

export function getZoho72WeekRoadmap(): WeekData[] {
  const roadmap: WeekData[] = [];

  for (let w = 1; w <= 72; w++) {
    let phaseId = "phase-1";
    if (w >= 13 && w <= 36) phaseId = "phase-2";
    else if (w >= 37 && w <= 54) phaseId = "phase-3";
    else if (w >= 55) phaseId = "phase-4";

    let title = "";
    let objective = "";
    let dailyRoutine = [
      "Morning (1 hr): LeetCode / DSA / Striver Sheet problems",
      "Evening (1 hr): Core subject study rotation (Java / DBMS / OS / OOP)",
      "Night (30 min): Aptitude speedrun on IndiaBix platform"
    ];
    let goals: string[] = [];
    let resources: CuratedResource[] = [];

    // Default metric models
    let lcTarget = 0;
    let sqlTarget = 0;
    let projPercent = 0;
    let mockTarget = 0;

    // --- PHASE 1 ---
    if (phaseId === "phase-1") {
      lcTarget = 0;
      sqlTarget = 0;
      projPercent = Math.round((w / 12) * 100);
      mockTarget = w >= 10 ? 1 : 0;
      
      const resPh1 = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.hrJava, CANONICAL_RESOURCES.indiaBixApt];

      if (w === 1) {
        title = "Week 1 — Java Setup & Basics";
        objective = "Understand compile-time vs clean execution in Java, compile variables, data types, and simple I/O scan codes.";
        goals = [
          "Install IntelliJ IDEA or VS Code + JDK 17+",
          "Understand data types, primitives, and type casting",
          "Write simple I/O console commands using Scanner",
          "Solve 3 programs on paper before typing them in IDE"
        ];
        resources = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.w3sJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 2) {
        title = "Week 2 — Control Flow & Loops";
        objective = "Master conditional statements, ternary selectors, loops constructs, break, and continue sequences.";
        goals = [
          "Master all loop structures (for, while, do-while)",
          "Write standard pattern printing loops (pyramid, diamond)",
          "Complete first 5 HackerRank Java Easy exercises",
          "Explain block variable scopes rules out loud"
        ];
        resources = [...resPh1, CANONICAL_RESOURCES.w3sJava];
      } else if (w === 3) {
        title = "Week 3 — Methods & Arrays";
        objective = "Construct modular functions, pass reference values, declare arrays, and model matrix multiplication algorithms.";
        goals = [
          "Write functions with logical parameters and returned values",
          "Deduce pass-by-value boundaries inside Java",
          "Trigger array reversals, sort arrays, and linear searches",
          "Write matrix multiplication structures using nested loops"
        ];
        resources = resPh1;
      } else if (w === 4) {
        title = "Week 4 — Strings Deep Dive";
        objective = "Study String structures, String Constant Pool, garbage memory limits, and fast StringBuilder allocations.";
        goals = [
          "Grasp difference between String Pool and Heap",
          "Know key String methods (substring, charAt, indexOf) by heart",
          "Write string algorithms: Palindrome, Anagram, Reverse Words",
          "Finish HackerRank Java Strings section fully"
        ];
        resources = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.teluskoJava, CANONICAL_RESOURCES.hrJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 5) {
        title = "Week 5 — OOP Part 1: Classes & Objects";
        objective = "Model modular systems using OOP classes, instance objects, nested structures, and overloaded constructors.";
        goals = [
          "Create custom classes with default and parameterized constructors",
          "Understand access modifiers (private, default, protected, public)",
          "Model a functional BankAccount class with safe state setters",
          "Execute constructor chain overrides using 'this' keyword"
        ];
        resources = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 6) {
        title = "Week 6 — OOP Part 2: Inheritance & Polymorphism";
        objective = "Represent real-world models using inheritance, dynamic types resolution, virtual methods dispatch, and overloading.";
        goals = [
          "Construct a 3-tier subclass hierarchy chain",
          "Inspect runtime vs compile-time polymorphism dispatch rules",
          "Deduce exactly how 'super' registers constructor triggers",
          "Draft OOP summaries from memory on whiteboards"
        ];
        resources = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.teluskoJava, CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 7) {
        title = "Week 7 — OOP Part 3: Interfaces & Abstraction";
        objective = "Segregate behaviors using abstract templates and interfaces. Avoid tight coupling in Java hierarchies.";
        goals = [
          "Know interface vs abstract class design trade-offs",
          "Implement multiple interfaces inside a singular class",
          "Design abstract database adapters with static methods",
          "Explain why multiple inheritance is interface-restricted in Java"
        ];
        resources = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 8) {
        title = "Week 8 — Exception Handling & Collections";
        objective = "Write resilient routines using try-catch blocks, customize exception trees, and explore standard lists.";
        goals = [
          "Differentiate Checked vs Unchecked exceptions",
          "Write custom exception class handling runtime crashes",
          "Perform loops and edits on ArrayList and HashSet instances",
          "Grasp try-with-resources memory leak protections"
        ];
        resources = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.hrJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 9) {
        title = "Week 9 — Advanced Collections & Generics";
        objective = "Construct priority queues, maps tables, comparative structures, and secure types compile safety.";
        goals = [
          "Contrast HashMap vs TreeMap speed lookups",
          "Instantiate PriorityQueue min-heaps with Comparators",
          "Create custom typed generic containers",
          "Build a functional Phonebook database using HashMap lookup"
        ];
        resources = [CANONICAL_RESOURCES.kunalJava, CANONICAL_RESOURCES.hrJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 10) {
        title = "Week 10 — 30 Days of Code: Part 1";
        objective = "Immerse in daily timed competitive coding challenges to structure logic speed under rules constraints.";
        goals = [
          "Solve HackerRank 30 Days of Code (Days 0–15)",
          "Form SOLID design logic mappings",
          "Log first full 1-hour aptitude mock speed test",
          "Acknowledge performance score gaps on math variables"
        ];
        resources = [CANONICAL_RESOURCES.hrJava, CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 11) {
        title = "Week 11 — 30 Days of Code: Part 2";
        objective = "Finalize competitive code sprint and master the interview OOP explanation pitch.";
        goals = [
          "Successfully complete 30 Days of Code (Days 16–30)",
          "Recite explanations for the 4 major pillars under 2 minutes",
          "Resolve weak arithmetic areas inside IndiaBix quizzes",
          "Formulate custom cheat sheets from memory"
        ];
        resources = [CANONICAL_RESOURCES.hrJava, CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 12) {
        title = "Week 12 — Phase 1 Review & Mock Test";
        objective = "Execute complete timed audits checking basic written programming and core Java requirements.";
        goals = [
          "Score 15/20 on timed HackerRank programming challenges",
          "Achieve 65%+ on cumulative quantitative aptitude mocks",
          "Finalize private OOP flash cards review",
          "Register LeetCode account to initiate DSA next week"
        ];
        resources = [CANONICAL_RESOURCES.hrJava, CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.indiaBixApt];
      }
    }

    // --- PHASE 2 ---
    else if (phaseId === "phase-2") {
      lcTarget = 5 + Math.round((w - 12) * 5.5);
      sqlTarget = w >= 29 ? Math.round((w - 28) * 4) : 0;
      projPercent = 0;
      mockTarget = w >= 35 ? 1 : 0;

      const resPh2 = [CANONICAL_RESOURCES.striverDsaPlaylist, CANONICAL_RESOURCES.striverDsaSheet, CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.indiaBixApt];

      if (w === 13) {
        title = "Week 13 — DSA Start: Arrays Basics";
        objective = "Set up algorithmic optimization habits. Analyze complexity notations and solve basic arrays partitions.";
        goals = [
          "Grasp Big O notation and time vs space optimization limits",
          "Solve 10 Striver A2Z Sheet basic Array practices",
          "Complete LeetCode Easy: Two Sum, Contains Duplicate, Stock Buy/Sell",
          "Maintain daily 20-minute IndiaBix aptitude exercises"
        ];
        resources = resPh2;
      } else if (w === 14) {
        title = "Week 14 — Arrays Advanced: Two Pointers & Sorting";
        objective = "Deconstruct nested loops using fast-slow index bounds and implement recursive sorting engines.";
        goals = [
          "Optimize nested checks down to a single O(N) index scan",
          "Solve Sort Colors, Move Zeroes, and 3Sum on LeetCode",
          "Implement quick sort and merge sort manually in Java",
          "Differentiate in-place sorting from safe thread allocations"
        ];
        resources = resPh2;
      } else if (w === 15) {
        title = "Week 15 — Strings in DSA";
        objective = "Perform character conversions and evaluate dictionary matches without using heavy allocations.";
        goals = [
          "Grasp custom byte structures for char hashing arrays",
          "Solve LeetCode: Valid Anagram, Longest Common Prefix, Reverse Words",
          "Optimize string loops memory footprints using StringBuilder",
          "Maintain LeetCode submissions streak"
        ];
        resources = resPh2;
      } else if (w === 16) {
        title = "Week 16 — Linked Lists Part 1";
        objective = "Mutate node pointers and reverse singly and doubly chains in memory.";
        goals = [
          "Implement custom LinkedList class nodes insertion and deletion",
          "Reverse a Linked List with iterative and recursive pointer swaps",
          "Trace stack frames recursive behaviors on copy logs",
          "Solve LeetCode: Reverse LinkedList, Middle of LinkedList"
        ];
        resources = resPh2;
      } else if (w === 17) {
        title = "Week 17 — Linked Lists Part 2 + Stacks";
        objective = "Find circles within graphs using fast/slow pointers, and parse expression scopes with stack buffers.";
        goals = [
          "Program Floyd's Cycle Detection loop cleanly",
          "Solve LeetCode: Merge Sorted Lists, Valid Parentheses, Min Stack",
          "Code custom stack buffer arrays with size checks",
          "Aptitude: Solve Time-Work equations on IndiaBix"
        ];
        resources = resPh2;
      } else if (w === 18) {
        title = "Week 18 — Queues & Recursion Intro";
        objective = "Manage linear queues, circular arrays, and write basic recursive functions.";
        goals = [
          "Code custom queue buffer array lists",
          "Solve Queue using stacks on LeetCode",
          "Write basic recursive programs: Factorial, Fib, binary search",
          "Solve 10 IndiaBix Quant work sections problems"
        ];
        resources = resPh2;
      } else if (w === 19) {
        title = "Week 19 — Recursion & Backtracking";
        objective = "Structure recursive solution spaces, log execution paths, and evaluate candidates.";
        goals = [
          "Understand backtrack stack limits and stack trace printouts",
          "Solve LeetCode: Subsets, Permutations, Letter Combinations of Phone Number",
          "Draw recursive branching trees on paper before coding",
          "Solve 10 IndiaBix Percentage challenges"
        ];
        resources = resPh2;
      } else if (w === 20) {
        title = "Week 20 — Binary Search";
        objective = "Master O(log N) divide-and-conquer indexes partitions and BS-on-answers strategies.";
        goals = [
          "Write binary search standard structures flawlessly from memory",
          "Solve LeetCode: Binary Search, Search in Rotated Sorted Array, Find Peak Element",
          "Grasp bounds evaluation for bs-on-answer problems",
          "🎯 Reached 50 LeetCode problems solved"
        ];
        resources = resPh2;
      } else if (w === 21) {
        title = "Week 21 — Hashing & HashMaps";
        objective = "Model fast lookup caches, count repeats, and understand keys index distributions.";
        goals = [
          "Implement collision resolution strategies on whiteboards",
          "Solve LeetCode: Group Anagrams, Top K Frequent Elements, LRU Cache",
          "Design thread-safe HashMap prototypes using monitor locks",
          "Quant: Simple and Compound Interest calculations"
        ];
        resources = resPh2;
      } else if (w === 22) {
        title = "Week 22 — Binary Trees Part 1";
        objective = "Traverse hierarchical graphs using recursive DFS and iterative level BFS queues.";
        goals = [
          "Write Inorder, Preorder, and Postorder traversals recursively",
          "Code level-order tree prints using queue lists",
          "Solve LeetCode: Max Depth of Binary Tree, Same Tree, Invert Tree",
          "Draw tree layers before creating node objects in Java"
        ];
        resources = resPh2;
      } else if (w === 23) {
        title = "Week 23 — Binary Search Trees";
        objective = "Exploit BST sorting characteristics to perform extremely fast insertions, queries, and deletions.";
        goals = [
          "Write node insertion logic for valid binary search trees",
          "Solve LeetCode: Validate BST, Kth Smallest Element in a BST, LCA of BST",
          "Construct balanced trees from sorted array lists",
          "Maintain daily aptitude learning habit"
        ];
        resources = resPh2;
      } else if (w === 24) {
        title = "Week 24 — Heaps & Priority Queue";
        objective = "Maintain dynamic sorted lists using heap arrays and extract top-K items quickly.";
        goals = [
          "Code heap sort from scratch using array indexing",
          "Solve LeetCode: Kth Largest Element in an Array, Merge K Sorted Lists",
          "Grasp min-heap and max-heap tree node shifts",
          "Solve 10 logical seating arrangements problems"
        ];
        resources = resPh2;
      } else if (w === 25) {
        title = "Week 25 — Graphs Part 1: BFS & DFS";
        objective = "Parse node components, represent graphs as adjacency lists, and find components.";
        goals = [
          "Design graph models using adjacency lists Map maps",
          "Write BFS and DFS search traversals",
          "Solve LeetCode: Number of Islands, Flood Fill, Clone Graph",
          "Identify cyclic structures inside undirected graphs"
        ];
        resources = resPh2;
      } else if (w === 26) {
        title = "Week 26 — Graphs Part 2: Shortest Paths";
        objective = "Solve graph route optimizations using Dijkstra's shortest paths and Topological Sort calendars.";
        goals = [
          "Implement Dijkstra's shortest path algorithm using PriorityQueue",
          "Solve LeetCode: Course Schedule (Topological Sort), Network Delay Time",
          "Grasp Bellman-Ford negative cycle checks rules",
          "Aptitude: Solve 10 blood relations arrangement questions"
        ];
        resources = resPh2;
      } else if (w === 27) {
        title = "Week 27 — Dynamic Programming Part 1";
        objective = "Eliminate recalculations of recursive sub-questions using memoized vectors and tabulation.";
        goals = [
          "Acknowledge overlapping sub-problems and optimal substructures",
          "Solve LeetCode: Climbing Stairs, House Robber, Coin Change",
          "Convert recursive algorithms to O(N) memoized structures",
          "Complete first 10 Striver DP Sheet exercises"
        ];
        resources = resPh2;
      } else if (w === 28) {
        title = "Week 28 — Dynamic Programming Part 2";
        objective = "Solve complex subsegment problems like Longest Common Subsequence and Edit Distance.";
        goals = [
          "Solve LeetCode: Longest Common Subsequence, Edit Distance, Palindrome Partitioning",
          "Draft DP state transitions equations on paper",
          "🎯 Reached 100 LeetCode problems solved",
          "Complete Phase 2 dsa goals checkpoint"
        ];
        resources = resPh2;
      } else if (w === 29) {
        title = "Week 29 — DBMS: Concepts & Normalization";
        objective = "Study tables, mapping rules, primary keys, and structural decompositions.";
        goals = [
          "Master Database Normalization principles (1NF, 2NF, 3NF, BCNF)",
          "Examine normal form rules to block update anomalies",
          "Design ER diagram layouts for standard retail models",
          "Start SQLZoo SELECT basics and aggregate operations"
        ];
        resources = [CANONICAL_RESOURCES.gateSmDBMS, CANONICAL_RESOURCES.sqlZoo, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 30) {
        title = "Week 30 — SQL Core: JOINs & GROUP BY";
        objective = "Learn cross-table JOINs, filtering with GROUP BY + HAVING, and sorting records.";
        goals = [
          "Write INNER, LEFT, RIGHT, and FULL joins fluently",
          "Compare filtering with WHERE vs aggregates filtering using HAVING",
          "Solve 10 HackerRank SQL Easy database challenges",
          "Query second-highest employee salaries correctly"
        ];
        resources = [CANONICAL_RESOURCES.gateSmDBMS, CANONICAL_RESOURCES.sqlZoo, CANONICAL_RESOURCES.hrSql, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 31) {
        title = "Week 31 — SQL Advanced: Subqueries";
        objective = "Learn nested subqueries, aggregations, windowing functions, and indexing database files.";
        goals = [
          "Write correlated subqueries linking external tables",
          "Utilize RANK(), ROW_NUMBER(), LEAD(), and LAG()",
          "Master indexing concepts and query explanation lookups",
          "Solve 10 HackerRank SQL Medium challenges"
        ];
        resources = [CANONICAL_RESOURCES.gateSmDBMS, CANONICAL_RESOURCES.sqlZoo, CANONICAL_RESOURCES.hrSql, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 32) {
        title = "Week 32 — OS: Processes & CPU Scheduling";
        objective = "Understand program processes, multi-threading CPU contexts, and scheduling policies.";
        goals = [
          "Explain difference between a process and thread clearly",
          "Manually calculate SJF, Round-Robin, and Priority schedulers timing",
          "Define context switching costs on processor memory registers",
          "Examine the 4 Coffman deadlock requirements"
        ];
        resources = [CANONICAL_RESOURCES.gateSmOS, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 33) {
        title = "Week 33 — OS: Memory Management & Deadlock";
        objective = "Grasp virtual memory paging, segmentation overlays, page swaps, page thrashing, and Bankers deadlock avoiders.";
        goals = [
          "Calculate LRU, FIFO, and Optimal page replacements numerical exercises",
          "Explain virtual paging lookup conversions using TLB vectors",
          "Implement Banker's Deadlock Avoidance algorithm rules in Java",
          "Aptitude: Solve 10 ratio questions on IndiaBix"
        ];
        resources = [CANONICAL_RESOURCES.gateSmOS, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 34) {
        title = "Week 34 — OOP Deep Revision & Design Patterns";
        objective = "Apply robust SOLID principles and examine Singleton, Factory, and Strategy object-creation frameworks.";
        goals = [
          "Write code prototypes cleanly representing all 5 SOLID principles",
          "Code Singleton and Factory object creation patterns from memory",
          "Explain JVM dynamic classloading behaviors under interfaces",
          "Solve 3 LeetCode Medium challenges to maintain streak"
        ];
        resources = [CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.indiaBixApt];
      } else if (w === 35) {
        title = "Week 35 — DSA Mixed Sprint";
        objective = "Prepare for coding round conditions by solving un-tagged medium arrays and trees challenges.";
        goals = [
          "Solve 15 un-tagged LeetCode Medium challenges",
          "Do not check code clues or discussion threads for first 30 minutes",
          "Optimize space complexity from O(N) to O(1) auxiliary vectors",
          "Score 80%+ on timed written dry-run simulations"
        ];
        resources = [CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.striverDsaSheet];
      } else if (w === 36) {
        title = "Week 36 — Phase 2 Full Mock Test";
        objective = "Test core DSA, SQL, and logical written skills against simulated placement drive exams.";
        goals = [
          "Complete full 3-hour Zoho-style written and programming mock",
          "Solve at least 2 out of 3 hard DSA questions within limits",
          "Earn full green marks on 1-hour timed database mock",
          "✅ Pushed code solutions folder to public GitHub profiling repo"
        ];
        resources = [CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.hrSql, CANONICAL_RESOURCES.indiaBixApt];
      }
    }

    // --- PHASE 3 ---
    else if (phaseId === "phase-3") {
      lcTarget = 135 + Math.round((w - 36) * 6.5);
      sqlTarget = 50;
      projPercent = Math.round(((w - 36) / 18) * 100);
      mockTarget = Math.floor((w - 36) / 6);

      const resPh3 = [CANONICAL_RESOURCES.codeforces, CANONICAL_RESOURCES.codechef, CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.amigoscodeSpring, CANONICAL_RESOURCES.leetcode];

      if (w === 37) {
        title = "Week 37 — GitHub Setup + LeetCode Medium Sprint";
        objective = "Initialize your engineering profile. Create clean markdown README manuals for your solutions.";
        goals = [
          "Publish live GitHub profiling files with rich descriptions",
          "Commit daily code solutions utilizing terminal git logs",
          "Solve 10 LeetCode Medium issues focusing on your weakest dsa topic",
          "Research specs of Project 1: REST CRM Contact Manager"
        ];
        resources = resPh3;
      } else if (w === 38) {
        title = "Week 38 — Project 1: Design & Backend Setup";
        objective = "Initialize Spring Boot and establish controllers routing mapping rules.";
        goals = [
          "Generate Spring Boot backend framework on localhost",
          "Expose dynamic REST endpoint GET /api/contacts JSON checks",
          "Establish SQL schema for local testing tables",
          "Solve 5 LeetCode Medium issues to keep streak"
        ];
        resources = [CANONICAL_RESOURCES.amigoscodeSpring, CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.leetcode];
      } else if (w === 39) {
        title = "Week 39 — Project 1 Development + First Contest";
        objective = "Code database interfaces and execute your first Codeforces Div 3 rated speed contest.";
        goals = [
          "Connect backend server to database via JPA repository drivers",
          "Write contact updates CRUD commands with safety rules",
          "Participate in first Codeforces Div 3 rated competition",
          "Trace code complexity optimizations during competitive runs"
        ];
        resources = resPh3;
      } else if (w === 40) {
        title = "Week 40 — Project 1 Polish + CodeChef";
        objective = "Finish CRUD endpoints, write API tests, and execute CodeChef long challenge tests.";
        goals = [
          "✅ First full SaaS REST Project complete and pushed to GitHub!",
          "Write complete JSON API testing scripts manually",
          "Participate constructively in CodeChef monthly challenges",
          "Maintain daily aptitude workouts loop"
        ];
        resources = resPh3;
      } else if (w === 41) {
        title = "Week 41 — Project 2 Start + Competitive Push";
        objective = "Start a web based inventory dashboard or tasks manager linked to database.";
        goals = [
          "Define scope of Project 2: Inventory Task Tracker manager",
          "Draw class associations map and database schema columns",
          "Register and compete in Codeforces Div 3 contests",
          "Refine code execution speed on Medium binary searches"
        ];
        resources = resPh3;
      } else if (w === 42) {
        title = "Week 42 — LeetCode Hard Intro + Project 2 Build";
        objective = "Attempt extremely complex graphs and structures on LeetCode hard boards.";
        goals = [
          "Analyze 5 LeetCode Hard problems with drawings",
          "Avoid using solutions hints for the first 45 minutes",
          "Implement core database updates inside Project 2",
          "Push active daily commits to Project 2 on GitHub"
        ];
        resources = resPh3;
      } else if (w === 43) {
        title = "Week 43 — Project 2 Completion + LeetCode 200";
        objective = "Overhaul inventory managers security boundaries and scale DSA counts past 200.";
        goals = [
          "🎯 Successfully solved 200 coding challenges on LeetCode!",
          "✅ Project 2 completely finished and documented on GitHub",
          "Earn standard competitive ratings on Codeforces profile",
          "Solve 10 IndiaBix Quant challenges on speed"
        ];
        resources = resPh3;
      } else if (w === 44) {
        title = "Week 44 — DSA Revision: Fix Weak Areas";
        objective = "Review notes log, identify weakest dsa topics, and execute drills.";
        goals = [
          "Re-watch Striver videos for your weakest DSA topic",
          "Solve 10 LeetCode problems strictly from that sector",
          "Complete Codeforces Div 3 weekend competitive sprints",
          "Aptitude: Solve 10 seating arrangement puzzles"
        ];
        resources = resPh3;
      } else if (w === 45) {
        title = "Week 45 — Project 3 Start: Showpiece App";
        objective = "Architect a Spring Boot Helpdesk CRM server serving JWT authorization and pagination.";
        goals = [
          "Map requirements of Project 3: Showpiece Helpdesk CRM",
          "Document complete server design, database tables, and API routes in README",
          "Write security filters holding JSON web token validation code",
          "Solve 5 LeetCode problems to maintain streak"
        ];
        resources = [CANONICAL_RESOURCES.amigoscodeSpring, CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.leetcode];
      } else if (w === 46) {
        title = "Week 46 — Project 3 Build + SQL Revision";
        objective = "Build CRM databases queries and resolve SQL challenges on LeetCode database tracker.";
        goals = [
          "Solve first 20 problems inside LeetCode Top SQL 50 list",
          "Write complex multi-table JOINs inside Project 3",
          "Push daily functional code updates to GitHub profile",
          "Participate in CodeChef rated monthly challenges"
        ];
        resources = [CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.lcTopSql50, CANONICAL_RESOURCES.codechef];
      } else if (w === 47) {
        title = "Week 47 — Project 3 Completion + LeetCode 250";
        objective = "Finalize JWT security filters, API pagination, and scale DSA counts past 250.";
        goals = [
          "🎯 Successfully solved 250 coding challenges on LeetCode!",
          "✅ Project 3 completely finished, packaged, and live on GitHub!",
          "Verify OAuth or JWT token exchanges safely",
          "Solve 5 LeetCode Medium/Hard challenges under timed constraints"
        ];
        resources = resPh3;
      } else if (w === 48) {
        title = "Week 48 — DSA + SQL Consolidation";
        objective = "Finish LeetCode Top SQL 50 problems and review database schemas optimized models.";
        goals = [
          "✅ LeetCode Top SQL 50 study plan completely checked!",
          "Solve 10 LeetCode Hard challenges focusing on tree traversations",
          "Compete in Codeforces Div 2 rated sprint contests",
          "Verify SQL performance profiles of past queries"
        ];
        resources = [CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.lcTopSql50, CANONICAL_RESOURCES.codeforces];
      } else if (w === 49) {
        title = "Week 49 — Advanced Competitive Coding";
        objective = "Focus entirely on hard-tier graphs routing and DP partition states.";
        goals = [
          "Solve 10 LeetCode Hard problems on Trees, Dijkstra, or DP",
          "Log competitive rating growth on Codeforces profiles",
          "Complete a rated contest on CodeChef",
          "Re-solve weak SQL aggregate query sets"
        ];
        resources = resPh3;
      } else if (w === 50) {
        title = "Week 50 — Resume Building + GitHub Polish";
        objective = "Write high-converting resume profiles describing your 3 custom working backends.";
        goals = [
          "Draft direct, professional 1-page resume centered on SaaS projects",
          "Generate clear visual diagrams for all 3 backends in README profiles",
          "Complete 10 LeetCode challenges to maintain streak",
          "Audit code repository security checks"
        ];
        resources = [CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.lcTopSql50];
      } else if (w === 51) {
        title = "Week 51 — Phase 3 Mock Test";
        objective = "Simulate mock interview conditions and solve problems without IDE compilation helps.";
        goals = [
          "Complete full 3-hour mock test on DSA problems",
          "Solve each challenge using raw web browser windows",
          "Explain logic in clear verbal paragraphs",
          "Quant: Complete timed Speed-Distance math exam"
        ];
        resources = resPh3;
      } else if (w === 52) {
        title = "Week 52 — Bridge Week: Start Zoho Research";
        objective = "Connect competitive skills to actual historic Zoho hiring criteria.";
        goals = [
          "Browse and analyze 10 historical Zoho candidates interview notes",
          "Map complete list of Zoho target written challenges",
          "Complete 10 LeetCode Medium challenges to keep streak",
          "Refine candidate profile formatting"
        ];
        resources = [CANONICAL_RESOURCES.gfgZohoExp, CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.leetcode];
      } else if (w === 53) {
        title = "Week 53 — Project Explanation Practice";
        objective = "Deliver pitch walkthroughs of all 3 backends clearly in under 5 minutes.";
        goals = [
          "🎯 Successfully solved 300 coding challenges on LeetCode!",
          "Deliver walkthrough of Project 1, 2, and 3 out loud without references",
          "Remove all filler hesitation sounds (um, uh, like) from your speech",
          "Draft design architecture notes for L3 machine coding round"
        ];
        resources = [CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.prepinstaZoho];
      } else if (w === 54) {
        title = "Week 54 — Phase 3 Complete";
        objective = "Verify competitive benchmarks and execute the final transition to Phase 4.";
        goals = [
          "Confirm all projects code is working on GitHub",
          "Achieve a stable green ranking across competitive platforms",
          "Solve 10 LeetCode Hard problems for extreme confidence",
          "✅ Successfully finished Phase 3 core objectives"
        ];
        resources = resPh3;
      }
    }

    // --- PHASE 4 ---
    else {
      lcTarget = 300 + Math.round((w - 54) * 4);
      sqlTarget = 50;
      projPercent = 100;
      mockTarget = 1 + (w - 54);

      const resPh4 = [CANONICAL_RESOURCES.gfgZohoExp, CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.lcTopSql50, CANONICAL_RESOURCES.interviewBit, CANONICAL_RESOURCES.pramp, CANONICAL_RESOURCES.zohoLearn];

      if (w === 55) {
        title = "Week 55 — Zoho Company Deep-Dive";
        objective = "Research Zoho product ecosystems, written criteria ranges, and review historical success stories.";
        goals = [
          "Read and examine 20 Zoho developer hiring experiences",
          "Study Zoho SaaS product lines (CRM, Books, Creator)",
          "Identify top 15 most repeated topic parameters in interviews",
          "Draft initial L3 CLI menu scanner utility functions"
        ];
        resources = [CANONICAL_RESOURCES.gfgZohoExp, CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.interviewBit];
      } else if (w === 56) {
        title = "Week 56 — Prepinsta Zoho Mocks: Week 1";
        objective = "Test quantitative, verbal, and logical arranges under exam bounds.";
        goals = [
          "Execute full-length Prepinsta written round simulation test",
          "Quant: Focus on composite work ratios and speed matrices",
          "Review all incorrect replies in mock logs",
          "Maintain daily LeetCode medium practice"
        ];
        resources = [CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.indiaBixApt, CANONICAL_RESOURCES.leetcode];
      } else if (w === 57) {
        title = "Week 57 — SQL Final Blitz";
        objective = "Drill complex joins and aggregates query sets down to speed thresholds.";
        goals = [
          "Re-solve all LeetCode Top SQL 50 under 5 minutes per query",
          "Handle window functions (RANK, ROW_NUMBER) and recursive CTEs fluently",
          "Solve Zoho historic SQL challenges with nested lookups",
          "Practice dry-running queries on scratchpads"
        ];
        resources = [CANONICAL_RESOURCES.lcTopSql50, CANONICAL_RESOURCES.hrSql, CANONICAL_RESOURCES.prepinstaZoho];
      } else if (w === 58) {
        title = "Week 58 — InterviewBit Deep Dive";
        objective = "Complete company-targeted Java, OOPs, and DSA assessments.";
        goals = [
          "Complete 20 advanced Java and collections problems on InterviewBit",
          "Verify execution performance metrics under tight timers",
          "Schedule your first live Pramp peer interview session",
          "Analyze timing graphs of search lookups"
        ];
        resources = [CANONICAL_RESOURCES.interviewBit, CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.pramp];
      } else if (w === 59) {
        title = "Week 59 — Mock Interview Week: Remove Stage Fear";
        objective = "Explain algorithm complexities verbally inside live peer-to-peer interviews.";
        goals = [
          "Successfully complete 3 live Pramp technical mock interview sessions",
          "Review and absorb constructive feedback on communication styles",
          "Record yourself solving a problem, criticizing filler word counts",
          "Grasp verbal strategy description techniques"
        ];
        resources = [CANONICAL_RESOURCES.pramp, CANONICAL_RESOURCES.gfgZohoExp, CANONICAL_RESOURCES.leetcode];
      } else if (w === 60) {
        title = "Week 60 — Project Polish & Resume Finalization";
        objective = "Refine details on your projects README folders and lock in resume.";
        goals = [
          "Add functional setup files, diagrams, and video scripts inside READMEs",
          "Complete and export final developer resume centerpiece description",
          "Deliver walkthrough pitch of all 3 backends clearly",
          "Earn first Zoho Learn active product certification"
        ];
        resources = [CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.zohoLearn, CANONICAL_RESOURCES.gfgZohoExp];
      } else if (w === 61) {
        title = "Week 61 — Core CS Final Revision";
        objective = "Review normalizations, transaction isolate configurations, paged memory pages, and thread sync clocks.";
        goals = [
          "Create concise 1-page summary guides for DBMS, OS, and OOPs",
          "Grasp ACID profiles and transactions isolated locks",
          "Explain virtual paged paging memory layouts clearly",
          "Solve 5 LeetCode challenges on multithreading monitor blocks"
        ];
        resources = [CANONICAL_RESOURCES.gateSmDBMS, CANONICAL_RESOURCES.gateSmOS, CANONICAL_RESOURCES.gfgOopJava];
      } else if (w === 62) {
        title = "Week 62 — Full Zoho Simulation #1";
        objective = "Practice solving multi-round questions under tight exam constraints.";
        goals = [
          "Complete a strict 3-hour Zoho-style simulation (Aptitude + SQL + 2 DSA)",
          "Dry-run your algorithms manually without IDE compilers",
          "Review and note areas of delay or logical bottlenecks",
          "Maintain weekly LeetCode consistency checks"
        ];
        resources = [CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.indiaBixApt, CANONICAL_RESOURCES.leetcode];
      } else if (w === 63) {
        title = "Week 63 — Technical Interview Deep Prep";
        objective = "Drill answers to Java virtual dispatcher methods and concurrent memory structures.";
        goals = [
          "Review and answer top 20 Zoho Java OOP interview questions",
          "Whiteboard normalization processes from transactional anomalies",
          "Solve 10 LeetCode Medium issues focusing on core structures",
          "Dry-run JVM garbage collector execution phases"
        ];
        resources = [CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.gfgZohoExp];
      } else if (w === 64) {
        title = "Week 64 — Behavioral & HR Round Prep";
        objective = "Write clear solutions explanations based on STAR behavioral formulas.";
        goals = [
          "Prepare 10 STAR format behavior answers (Situation, Task, Action, Result)",
          "Examine Zoho corporate core culture values and SaaS mission structures",
          "Formulate genuine and exciting answer to 'Why Zoho?' question",
          "Log continuous daily LeetCode algorithms streak"
        ];
        resources = [CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.zohoLearn, CANONICAL_RESOURCES.leetcode];
      } else if (w === 65) {
        title = "Week 65 — Zoho Learn Certifications";
        objective = "Pass Zoho Learn product suite certifications to stand out from other applicants.";
        goals = [
          "Pass 2 product certifications on Zoho Learn environment",
          "Establish high credibility on SaaS design layouts",
          "Review Top 50 SQL challenges on LeetCode",
          "🎯 Total LeetCode counts cross 350 solved!"
        ];
        resources = [CANONICAL_RESOURCES.zohoLearn, CANONICAL_RESOURCES.lcTopSql50, CANONICAL_RESOURCES.leetcode];
      } else if (w === 66) {
        title = "Week 66 — Mock Interview Sprint";
        objective = "Drill mock sessions daily to smooth delivery logic and speed up answers.";
        goals = [
          "Complete 4 live Pramp technical mock interview sessions",
          "Explain runtime and space storage complexity limits clearly",
          "Deliver custom algorithms solutions using pure whiteboards",
          "Identify and patch remaining logical bottlenecks"
        ];
        resources = [CANONICAL_RESOURCES.pramp, CANONICAL_RESOURCES.interviewBit, CANONICAL_RESOURCES.leetcode];
      } else if (w === 67) {
        title = "Week 67 — All-Topics Comprehensive Revision";
        objective = "Rotate across your compiled memory templates and notebooks to secure fluency.";
        goals = [
          "Execute daily 2-hour loops checking Java, OOP, SQL, DBMS, and OS",
          "Ensure zero unfamiliar parameters or logic panic spaces exist",
          "Speak code descriptions aloud during everyday exercises",
          "Examine solution structures of historically hardest problems"
        ];
        resources = [CANONICAL_RESOURCES.striverDsaSheet, CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.lcTopSql50];
      } else if (w === 68) {
        title = "Week 68 — DSA Hard Final Push";
        objective = "Audit complex dynamic partitions and cyclic graphs traversations.";
        goals = [
          "Solve 10 LeetCode Hard problems on Trees, Graphs, or DP",
          "Optimize complex recursive branches down to tabulations",
          "Deduce logical complexity models for your records",
          "Maintain a steady high-speed code completion"
        ];
        resources = [CANONICAL_RESOURCES.leetcode, CANONICAL_RESOURCES.striverDsaSheet, CANONICAL_RESOURCES.codeforces];
      } else if (w === 69) {
        title = "Week 69 — Full Zoho Simulation #2";
        objective = "Complete the final comprehensive exam simulation checking technical correctness.";
        goals = [
          "Score 85%+ on quantitative aptitude, verbal, and logical mock",
          "Write clean, working, and optimal answers to 3 programming challenges",
          "Execute custom SQL command queries within strict speed limits",
          "Complete 2 final Pramp mock interviews with top ratings"
        ];
        resources = [CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.indiaBixApt, CANONICAL_RESOURCES.pramp];
      } else if (w === 70) {
        title = "Week 70 — Project Explanation Marathon";
        objective = "Practice answering hard transactional and structural queries regarding your portfolios.";
        goals = [
          "Dry-run Spring Boot JWT validation mechanics on paper",
          "Explain normalizations decisions and indexes structures",
          "Answer modular improvement questions for each system",
          "Walkthrough all repos files and setups files on GitHub"
        ];
        resources = [CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.gfgZohoExp, CANONICAL_RESOURCES.leetcode];
      } else if (w === 71) {
        title = "Week 71 — Light Revision & Mental Prep";
        objective = "Keep operations slow. Review private notebooks, flashcards, rest, and sleep well.";
        goals = [
          "Avoid studying completely new data domains or challenges",
          "Re-solve 5 of your favorite problems for a clean confidence boost",
          "Review private notes summary on whiteboards",
          "Maintain a healthy 8-hour sleep sequence"
        ];
        resources = [CANONICAL_RESOURCES.gfgOopJava, CANONICAL_RESOURCES.zohoLearn, CANONICAL_RESOURCES.leetcode];
      } else {
        title = "Week 72 — 🏆 Placement Week: You Are Ready!";
        objective = "Secure the best Zoho package! Srivishnu (Sir) has successfully completed the 72-week OS roadmap!";
        goals = [
          "Go into the drive composed, fully confident, and clear-minded",
          "Remember that Sir has done more work than 99% of candidates!",
          "Commuricate code decisions politely, structural details cleanly",
          "🎯 Land and deliver the best placement package! You earned this, Sir!"
        ];
        resources = [CANONICAL_RESOURCES.github, CANONICAL_RESOURCES.prepinstaZoho, CANONICAL_RESOURCES.leetcode];
      }
    }

    roadmap.push({
      week: w,
      phaseId,
      title,
      objective,
      dailyRoutine,
      goals,
      milestone: w === 12 || w === 20 || w === 28 || w === 31 || w === 33 || w === 36 || w === 40 || w === 43 || w === 47 || w === 48 || w === 53 || w === 59 || w === 65 || w === 62 || w === 69 || w === 72
        ? MAJOR_MILESTONES.find(m => m.week === w)?.title || null
        : null,
      targetMetrics: {
        leetcode: lcTarget,
        sql: sqlTarget,
        projectPercent: projPercent,
        mockInterviews: mockTarget
      },
      resources
    });
  }

  return roadmap;
}
