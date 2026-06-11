import React, { useState } from "react";
import { DatabaseState, Task, TaskStatusType } from "../types";
import { Calendar, Inbox, CheckSquare, Trash2, Plus, SlidersHorizontal, Archive, CircleDot, RefreshCw } from "lucide-react";

interface TaskTrackerViewProps {
  state: DatabaseState;
  onAddTask: (taskData: {
    phaseId: string;
    topicId: string;
    milestoneId: string | null;
    title: string;
    description: string;
    dueDate: string;
  }) => Promise<void>;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (taskId: string) => Promise<void>;
}

export default function TaskTrackerView({
  state,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TaskTrackerViewProps) {
  const { tasks, phases, topics, milestones } = state;
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<string>("all");
  
  // Creation form state
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [newPhaseId, setNewPhaseId] = useState(phases[0]?.id || "");
  const [newTopicId, setNewTopicId] = useState(topics[0]?.id || "");
  const [newMilestoneId, setNewMilestoneId] = useState<string>("none");

  // Filter topics based on selected phase in creation form
  const availableTopics = topics.filter((t) => t.phaseId === newPhaseId);
  const availableMilestones = milestones.filter((m) => m.topicId === newTopicId);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    await onAddTask({
      phaseId: newPhaseId,
      topicId: newTopicId,
      milestoneId: newMilestoneId === "none" ? null : newMilestoneId,
      title: newTitle,
      description: newDesc,
      dueDate: newDueDate,
    });

    // Clear form inputs
    setNewTitle("");
    setNewDesc("");
    setNewDueDate(new Date().toISOString().split("T")[0]);
    setNewMilestoneId("none");
    setShowForm(false);
  };

  const getStatusBadge = (status: TaskStatusType) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "skipped":
        return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "cancelled":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  // Filter algorithms
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
    const matchesPhase = selectedPhaseFilter === "all" || task.phaseId === selectedPhaseFilter;
    return matchesStatus && matchesPhase;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Milestone Task Tracker</h2>
          <p className="text-xs text-gray-400 mt-1">
            Log, delegate, and audit your daily schedule targets. Achieve milestone increments to boost overall rankings.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-xs font-mono rounded-xl cursor-pointer shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all self-start sm:self-center"
          id="toggle-add-task-form-btn"
        >
          <Plus className="h-4 w-4" />
          <span>Create Scheduled Task</span>
        </button>
      </div>

      {/* Pop Slider Task Form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl"
        >
          <div className="flex items-center space-x-2 text-blue-400">
            <Inbox className="h-4.5 w-4.5" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
              Schedule Micro Task Assignment
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Task Assignment Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Solve LC: Sliding window substring problem"
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white placeholder-gray-550 focus:outline-none focus:border-blue-500"
                id="task-title-input"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Target Due Date
              </label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                id="task-date-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
              Task Outline & Objective Description
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="State the step-by-step target criteria to accept this task as complete..."
              className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 h-20"
              id="task-desc-input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Target Pathway Phase
              </label>
              <select
                value={newPhaseId}
                onChange={(e) => {
                  setNewPhaseId(e.target.value);
                  const firstOfT = topics.find(t => t.phaseId === e.target.value);
                  setNewTopicId(firstOfT ? firstOfT.id : "");
                }}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                id="task-phase-select"
              >
                {phases.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Topic Unit Chapter
              </label>
              <select
                value={newTopicId}
                onChange={(e) => setNewTopicId(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                id="task-topic-select"
              >
                {availableTopics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Connected Milestone Target (Optional)
              </label>
              <select
                value={newMilestoneId}
                onChange={(e) => setNewMilestoneId(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                id="task-milestone-select"
              >
                <option value="none">No milestone link</option>
                {availableMilestones.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2 px-3.5 bg-transparent hover:bg-gray-800 text-xs text-gray-400 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl"
              id="submit-task-btn"
            >
              Confirm Scheduled Task
            </button>
          </div>
        </form>
      )}

      {/* Structured Filtering panels */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-gray-450 font-mono pr-1.5 flex items-center">
            <SlidersHorizontal className="h-3 w-3 mr-1" /> Status:
          </span>
          {(["all", "pending", "completed", "skipped", "cancelled"] as const).map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                selectedStatus === stat
                  ? "bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
              id={`filter-task-status-${stat}`}
            >
              {stat.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-mono shrink-0">Phase filter:</span>
          <select
            value={selectedPhaseFilter}
            onChange={(e) => setSelectedPhaseFilter(e.target.value)}
            className="bg-[#0B1120] border border-[#1F2937] rounded-xl text-xs text-gray-300 py-2 px-3.5 focus:outline-none max-w-sm"
          >
            <option value="all">All Syllabus Phases</option>
            {phases.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks listing list */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm font-mono border border-dashed border-[#1F2937] rounded-2xl">
            No active targets fit this selected filter classification.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const phase = phases.find((p) => p.id === task.phaseId);
            const topic = topics.find((t) => t.id === task.topicId);
            const milestone = milestones.find((m) => m.id === task.milestoneId);

            return (
              <div
                key={task.id}
                className="bg-[#111827] border border-[#1F2937] p-4.5 rounded-2xl hover:border-gray-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold font-mono border ${getStatusBadge(task.status)}`}>
                      {task.status}
                    </span>
                    {topic && (
                      <span className="text-[10px] text-gray-500 font-mono">
                        ({topic.category}) {topic.title}
                      </span>
                    )}
                    {milestone && (
                      <span className="px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[#60A5FA] text-[9px] font-mono rounded">
                        🏆 {milestone.title}
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-bold text-gray-100 ${task.status === "completed" ? "line-through text-gray-500" : ""}`}>
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-xs text-gray-400 font-sans max-w-2xl leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-2 text-[10.5px] text-gray-500 font-mono pt-1">
                    <Calendar className="h-3 w-3 text-gray-600" />
                    <span>Target deadline: {task.dueDate}</span>
                    {task.completedAt && (
                      <span className="text-emerald-500">
                        • Verified continuous completion on {task.completedAt}
                      </span>
                    )}
                  </div>
                </div>

                {/* Operations Control Toggling */}
                <div className="flex items-center space-x-2 self-end md:self-center">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => onUpdateTask(task.id, { status: "completed" })}
                      className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-lg font-mono cursor-pointer transition-colors"
                      id={`complete-task-${task.id}`}
                    >
                      Audit Accept
                    </button>
                  )}
                  
                  {task.status === "pending" && (
                    <button
                      onClick={() => onUpdateTask(task.id, { status: "skipped" })}
                      className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 hover:border-amber-500/30 text-amber-400 text-xs font-semibold rounded-lg font-mono cursor-pointer transition-colors"
                      id={`skip-task-${task.id}`}
                    >
                      Skip
                    </button>
                  )}

                  {task.status === "skipped" && (
                    <button
                      onClick={() => onUpdateTask(task.id, { status: "pending" })}
                      className="px-2.5 py-1.5 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/20 text-gray-400 text-xs font-semibold rounded-lg font-mono cursor-pointer transition-colors"
                      id={`restore-task-${task.id}`}
                    >
                      Re-push
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 hover:bg-red-500/10 text-gray-600 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    id={`delete-task-${task.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
