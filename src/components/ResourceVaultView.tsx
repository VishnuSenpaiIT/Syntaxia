import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  ExternalLink, 
  CheckSquare, 
  Bookmark, 
  Sparkles, 
  Code2, 
  FolderGit, 
  Coins, 
  Cpu, 
  GitBranch, 
  Library,
  Flame,
  BookmarkPlus
} from "lucide-react";
import { getZoho72WeekRoadmap, CuratedResource } from "../data/roadmapData";
import { DatabaseState } from "../types";

interface ResourceVaultViewProps {
  state: DatabaseState;
  
  // Completed states managed in parent state context
  completedResources: string[];
  toggleResourceCompletion: (resKey: string) => void;
  onAddCustomResource: (newResObj: { name: string; category: string; link: string; purpose: string; priority: string; timePerWeek: number }) => void;
}

export default function ResourceVaultView({
  state,
  completedResources,
  toggleResourceCompletion,
  onAddCustomResource,
}: ResourceVaultViewProps) {
  
  const roadmap = getZoho72WeekRoadmap();

  // Extract all the pre-seeded resources from the 72-week roadmap dynamically!
  const preseededResources: (CuratedResource & { weekNum: number; resKey: string })[] = [];
  roadmap.forEach((week) => {
    week.resources.forEach((res, idx) => {
      preseededResources.push({
        ...res,
        weekNum: week.week,
        resKey: `${week.week}-${idx}`
      });
    });
  });

  // Load custom added resources from storage if we have them
  const [customResources, setCustomResources] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("syntaxia_custom_resources") || "[]");
    } catch {
      return [];
    }
  });

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Custom Form controls
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newLink, setNewLink] = useState("");
  const [newCategory, setNewCategory] = useState("Java");
  const [newPriority, setNewPriority] = useState("high");
  const [newHours, setNewHours] = useState(4);

  const categories = [
    { id: "all", label: "All Topics", icon: Library },
    { id: "Java", label: "Java Foundation", icon: Code2 },
    { id: "DSA", label: "DSA Practice", icon: GitBranch },
    { id: "SQL", label: "SQL & Tuning", icon: Coins },
    { id: "DBMS", label: "DBMS Internals", icon: Cpu },
    { id: "OS", label: "System Design & OS", icon: Cpu },
    { id: "OOP", label: "OOP & UML", icon: Code2 },
    { id: "Competitive Programming", label: "CP Challenges", icon: Flame },
    { id: "Projects", label: "Build (Projects)", icon: FolderGit },
    { id: "Interview Preparation", label: "Interview Prep", icon: Sparkles },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLink.trim()) return;

    const newRes = {
      name: newTitle,
      category: newCategory,
      link: newLink,
      purpose: newDesc || "Custom curated bookmark",
      priority: newPriority,
      timePerWeek: Number(newHours),
      weekNum: 0, // indicates custom reference
      resKey: `custom-${Date.now()}`
    };

    const updated = [newRes, ...customResources];
    setCustomResources(updated);
    localStorage.setItem("syntaxia_custom_resources", JSON.stringify(updated));
    onAddCustomResource(newRes);

    setNewTitle("");
    setNewDesc("");
    setNewLink("");
    setShowAddForm(false);
  };

  // Combine both standard and custom bookmarks
  const allCollection = [
    ...customResources,
    ...preseededResources
  ];

  // Perform multi-dimensional search & filtering
  const filteredCollection = allCollection.filter((res) => {
    const matchesSearch =
      res.name.toLowerCase().includes(search.toLowerCase()) ||
      res.purpose.toLowerCase().includes(search.toLowerCase()) ||
      res.category.toLowerCase().includes(search.toLowerCase());
    
    // Category mapping logic
    const matchesCategory = 
      selectedCategory === "all" || 
      res.category.toLowerCase().trim() === selectedCategory.toLowerCase().trim() ||
      (selectedCategory === "OS" && res.category.toLowerCase().includes("operating")) ||
      (selectedCategory === "DSA" && res.category.toLowerCase().includes("structure")) ||
      (selectedCategory === "OOP" && res.category.toLowerCase().includes("object"));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="w-1.5 h-6 bg-[#60A5FA] rounded-sm"></div>
            Zoho Curated Knowledge Bank
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Access, search, and target recommended reference guides categorised by core Zoho Round 2 & Round 3 exam rubrics.
          </p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-[#60A5FA] hover:bg-[#60A5FA]/95 text-[#0B1120] font-bold text-xs font-mono rounded-xl cursor-pointer shadow-lg hover:shadow-blue-500/10 transition-all self-start sm:self-center"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Bookmark Resource</span>
        </button>
      </div>

      {/* 2. SLIDEOUT FORM */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl"
        >
          <div className="flex items-center space-x-2 text-[#60A5FA] mb-2">
            <BookmarkPlus className="h-4.5 w-4.5" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-mono">
              Add Custom Study Bookmark Reference
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Resource Name *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Oracle Java SE Runtime memory optimization specs"
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#60A5FA] placeholder-gray-600"
              />
            </div>

            <div>
              <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Category Group
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#60A5FA]"
              >
                <option value="Java">Java</option>
                <option value="DSA">DSA</option>
                <option value="SQL">SQL</option>
                <option value="DBMS">DBMS</option>
                <option value="OS">OS</option>
                <option value="OOP">OOP</option>
                <option value="Competitive Programming">Competitive Programming</option>
                <option value="Projects">Projects</option>
                <option value="Interview Preparation">Interview Preparation</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Resource URL / Link *
              </label>
              <input
                type="url"
                required
                value={newLink}
                onChange={(e) => setNewLink(e.target.value)}
                placeholder="https://docs.oracle.com/javase/..."
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#60A5FA] placeholder-gray-650"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                  Priority
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60A5FA]"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                  Hours/Wk
                </label>
                <input
                  type="number"
                  min={1}
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#60A5FA]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[9px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
              Purpose & Highlights
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What details should Sir master from this resource..."
              rows={2}
              className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#60A5FA]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4.5 py-2 bg-[#60A5FA] hover:bg-[#60A5FA]/90 text-[#0B1120] text-xs font-bold font-mono rounded-xl cursor-pointer"
            >
              Add Bookmark
            </button>
          </div>
        </form>
      )}

      {/* 3. MULTI-CATEGORY QUICK PILLED SELECTOR & BAR SEARCH */}
      <div className="space-y-4">
        {/* Search Input bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search through Java GC specs, DSA patterns, SQL execution plans, schema design rules..."
            className="w-full bg-[#111827] border border-[#1F2937] rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#60A5FA] font-mono"
          />
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-gray-500" />
        </div>

        {/* Categories Scroller row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSel = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-mono font-semibold shrink-0 transition-all cursor-pointer border ${
                  isSel
                    ? "bg-[#1F2937] text-[#60A5FA] border-[#303e50] shadow-sm"
                    : "bg-[#111827] text-gray-450 hover:text-white border-transparent hover:bg-[#1F2937]/55"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. RESULTS CARDS GRID */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
            {filteredCollection.length} learning modules discovered
          </span>
          <span className="text-[10px] text-gray-400 font-mono">
            Checked: <strong className="text-[#34D399]">{completedResources.length} completed</strong>
          </span>
        </div>

        {filteredCollection.length === 0 ? (
          <div className="py-20 text-center bg-[#111827] border border-[#1F2937] rounded-2xl">
            <Bookmark className="h-8 w-8 text-gray-650 mx-auto opacity-30 mb-2" />
            <p className="text-xs text-gray-500 font-mono">No resource nodes match the filtering parameters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCollection.map((res, index) => {
              const isChecked = completedResources.includes(res.resKey);

              return (
                <div
                  key={res.resKey || index}
                  className={`bg-[#111827] border rounded-2xl p-4.5 flex flex-col justify-between transition-all ${
                    isChecked 
                      ? "border-emerald-500/20 bg-emerald-500/[0.01]" 
                      : "border-[#1F2937] hover:border-gray-700"
                  }`}
                >
                  <div className="space-y-2.5">
                    
                    {/* Top badging */}
                    <div className="flex items-center justify-between gap-1.5 flex-wrap">
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#34D399] font-mono bg-[#34D399]/5 px-2 py-0.5 rounded border border-[#34D399]/10">
                        {res.category}
                      </span>
                      
                      <div className="flex items-center space-x-1">
                        {res.weekNum > 0 ? (
                          <span className="text-[8px] font-mono bg-[#1F2937] text-gray-300 px-1.5 py-0.5 rounded">
                            Week {res.weekNum} Focus
                          </span>
                        ) : (
                          <span className="text-[8px] font-mono bg-[#60A5FA]/10 text-[#60A5FA] px-1.5 py-0.5 rounded font-bold">
                            Custom Bookmark
                          </span>
                        )}
                        <span className={`text-[8px] uppercase font-mono px-1 rounded ${
                          res.priority === "high" ? "bg-red-500/10 text-red-400" : "bg-gray-400/10 text-gray-400"
                        }`}>
                          {res.priority}
                        </span>
                      </div>
                    </div>

                    <h4 className={`text-sm font-bold truncate leading-snug text-left ${
                      isChecked ? "text-gray-500 line-through" : "text-white"
                    }`}>
                      {res.name}
                    </h4>

                    <p className="text-xs text-gray-450 text-left line-clamp-3 leading-relaxed font-sans min-h-[54px]">
                      {res.purpose}
                    </p>

                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-[#1F2937]/50 flex items-center justify-between">
                    <button
                      onClick={() => toggleResourceCompletion(res.resKey)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                        isChecked
                          ? "bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30"
                          : "bg-[#0B1120] hover:bg-[#111827] text-gray-400 border border-[#1F2937] hover:text-white"
                      }`}
                    >
                      <CheckSquare className="h-3 w-3" />
                      <span>{isChecked ? "Completed ✓" : "Mark Finished"}</span>
                    </button>

                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-[#1F2937] border border-[#1F2937] hover:border-gray-500 rounded-lg text-[#60A5FA] hover:text-white text-[10px] font-mono flex items-center gap-1 transition"
                    >
                      <span>Study Now</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
