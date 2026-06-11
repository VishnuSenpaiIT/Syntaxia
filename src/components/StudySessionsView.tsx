import React, { useState } from "react";
import { DatabaseState, StudySession } from "../types";
import { Hourglass, Plus, Calendar, BookOpen, Clock, Trash2, SlidersHorizontal, Sparkles } from "lucide-react";

interface StudySessionsViewProps {
  state: DatabaseState;
  onLogSession: (sessionData: {
    topicId: string;
    hours: number;
    minutes: number;
    notes: string;
    sessionType: string;
    date: string;
  }) => Promise<void>;
  onDeleteSession: (sessionId: string) => Promise<void>;
}

export default function StudySessionsView({
  state,
  onLogSession,
  onDeleteSession,
}: StudySessionsViewProps) {
  const { studySessions, topics } = state;
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTopicIdFilter, setSelectedTopicIdFilter] = useState("all");

  // Form State
  const [topicId, setTopicId] = useState(topics[0]?.id || "");
  const [hours, setHours] = useState(1);
  const [minutes, setMinutes] = useState(30);
  const [notes, setNotes] = useState("");
  const [sessionType, setSessionType] = useState("DSA Practice");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topicId) return;

    await onLogSession({
      topicId,
      hours: Number(hours),
      minutes: Number(minutes),
      notes,
      sessionType,
      date,
    });

    // Clear and collapse
    setNotes("");
    setHours(1);
    setMinutes(30);
    setDate(new Date().toISOString().split("T")[0]);
    setShowAddForm(false);
  };

  // Metrics summaries
  const totalHoursCalculated = studySessions.reduce((acc, s) => acc + s.hours + (s.minutes / 60), 0);
  const totalSessionsCount = studySessions.length;

  const filteredSessions = studySessions.filter((s) => {
    return selectedTopicIdFilter === "all" || s.topicId === selectedTopicIdFilter;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Block with quick statistic blocks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Focus Session Logger</h2>
          <p className="text-xs text-gray-400 mt-1">
            Track and verify cumulative learning durations. Correlate study patterns to syllabus topics.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-xs font-mono rounded-xl cursor-pointer shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all self-start sm:self-center"
          id="toggle-add-session-form-btn"
        >
          <Plus className="h-4 w-4" />
          <span>Log Dynamic Study Clock</span>
        </button>
      </div>

      {/* Aggregate Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
              Cumulative Hours Studied
            </span>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {totalHoursCalculated.toFixed(1)} hrs
            </p>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl flex items-center space-x-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-gray-400">
              Total Logged Entries
            </span>
            <p className="text-2xl font-bold font-mono text-white mt-1">
              {totalSessionsCount} sessions
            </p>
          </div>
        </div>
      </div>

      {/* Log Session Form */}
      {showAddForm && (
        <form
          onSubmit={handleCreate}
          className="bg-[#111827] border border-[#1F2937] p-5 rounded-2xl space-y-4 shadow-xl"
        >
          <div className="flex items-center space-x-2 text-blue-400">
            <Hourglass className="h-4.5 w-4.5" />
            <h3 className="text-sm font-bold uppercase tracking-wider font-mono">
              Initialize New Study Log entry
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Target Topic Chapter
              </label>
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                id="session-topic-select"
              >
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    ({t.category}) {t.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Session Type / Mode
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                id="session-type-select"
              >
                <option value="DSA Practice">DSA Practice</option>
                <option value="Java Warmup">Java Warmup</option>
                <option value="DBMS Normalization">DBMS Normalization</option>
                <option value="Mock Advanced Round">Mock Advanced Programming Round (L2)</option>
                <option value="Aptitude Test">Aptitude Test Mock</option>
                <option value="Notes Review">Learning Note Creation</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Date Completed
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                id="session-date-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Study Hours Tracked
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                id="session-hours-input"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
                Study Minutes Tracked
              </label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                id="session-minutes-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
              Reflective Summary / Conceptual Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record any concepts learned, formulas solved or code design patterns implemented during this timeframe..."
              className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 h-20"
              id="session-notes-input"
            />
          </div>

          <div className="flex justify-end space-x-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="py-2 px-3.5 bg-transparent hover:bg-gray-800 text-xs text-gray-400 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl"
              id="submit-session-btn"
            >
              Verify & Commit Hours
            </button>
          </div>
        </form>
      )}

      {/* Filter panel */}
      <div className="flex items-center space-x-3 bg-[#111827] border border-[#1F2937] p-4 rounded-xl">
        <SlidersHorizontal className="h-4 w-4 text-gray-500" />
        <span className="text-xs text-gray-450 font-mono">Topic Filter:</span>
        <select
          value={selectedTopicIdFilter}
          onChange={(e) => setSelectedTopicIdFilter(e.target.value)}
          className="bg-[#0B1120] border border-[#1F2937] rounded-xl text-xs text-gray-300 py-2 px-3.5 focus:outline-none max-w-sm"
        >
          <option value="all">Display All Topic Logs</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              ({t.category}) {t.title}
            </option>
          ))}
        </select>
      </div>

      {/* Sessions history table list */}
      <div className="space-y-3.5">
        {filteredSessions.length === 0 ? (
          <div className="py-12 text-center text-gray-500 text-sm font-mono border border-[#1F2937] rounded-2xl">
            No study sessions matching the filter criteria.
          </div>
        ) : (
          filteredSessions
            .map((session) => {
              const topic = topics.find((t) => t.id === session.topicId);

              return (
                <div
                  key={session.id}
                  className="bg-[#111827] border border-[#1F2937] p-4.5 rounded-2xl flex items-start justify-between gap-4 hover:border-gray-700 transition"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[#60A5FA] text-[10px] font-mono rounded">
                        {session.sessionType}
                      </span>
                      {topic && (
                        <span className="text-[10px] text-gray-500 font-mono">
                          Topic: {topic.title}
                        </span>
                      )}
                    </div>

                    {session.notes ? (
                      <p className="text-xs text-gray-200 leading-relaxed font-sans mt-2 pr-3">
                        {session.notes}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 italic font-sans mt-2">
                        No focal summary logged for this study timeframe.
                      </p>
                    )}

                    <div className="flex items-center space-x-3 text-[10.5px] text-gray-500 font-mono pt-2">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 text-gray-600 mr-1" />
                        {session.date}
                      </span>
                      <span>•</span>
                      <strong className="text-blue-400">
                        {session.hours} hrs {session.minutes} mins
                      </strong>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 hover:bg-red-500/10 text-gray-600 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    id={`delete-session-${session.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })
        )}
      </div>

    </div>
  );
}
