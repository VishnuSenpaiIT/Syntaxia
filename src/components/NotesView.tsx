import React, { useState } from "react";
import { DatabaseState, Note } from "../types";
import { Search, Plus, Trash2, Edit3, BookOpen, Eye, Code, Tag, Link } from "lucide-react";

interface NotesViewProps {
  state: DatabaseState;
  onAddNote: (noteData: {
    title: string;
    content: string;
    tags: string[];
    topicId: string;
  }) => Promise<void>;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
}

// Simple Markdown Parser implemented directly to remain compliant and lightning fast
function MiniMarkdownRenderer({ text }: { text: string }) {
  if (!text) return <p className="text-gray-500 italic text-xs">Empty content</p>;

  const lines = text.split("\n");
  let inCodeBlock = false;
  let codeContent : string[] = [];
  let codeLang = "";

  const elements: React.JSX.Element[] = [];

  lines.forEach((line, i) => {
    // Code block check
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // Close code block
        elements.push(
          <pre key={`code-${i}`} className="my-3 p-4 bg-[#0B1120] border border-[#1F2937] rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
            <div className="text-[9px] uppercase tracking-wider text-gray-500 mb-1 border-b border-[#1F2937]/50 pb-1 font-mono">
              {codeLang || "code"}
            </div>
            <code>{codeContent.join("\n")}</code>
          </pre>
        );
        codeContent = [];
        inCodeBlock = false;
      } else {
        // Open code block
        inCodeBlock = true;
        codeLang = line.replace("```", "").trim();
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Normal markdown parsing
    const trimmed = line.trim();
    if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={i} className="text-base font-bold text-white tracking-tight mt-4 mb-2 font-mono">{trimmed.replace("## ", "")}</h2>);
    } else if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={i} className="text-sm font-bold text-gray-200 mt-3 mb-1.5 font-mono">{trimmed.replace("### ", "")}</h3>);
    } else if (trimmed.startsWith("- ")) {
      elements.push(
        <ul key={i} className="list-disc pl-5 my-1 text-xs text-gray-350 space-y-1">
          <li className="leading-relaxed">{trimmed.replace("- ", "")}</li>
        </ul>
      );
    } else if (trimmed.startsWith("1. ")) {
      elements.push(
        <ol key={i} className="list-decimal pl-5 my-1 text-xs text-gray-350 space-y-1">
          <li className="leading-relaxed">{trimmed.slice(3)}</li>
        </ol>
      );
    } else if (trimmed === "") {
      elements.push(<div key={i} className="h-2" />);
    } else {
      // Bold syntax helper
      let processedText : any = trimmed;
      if (trimmed.includes("**")) {
        const parts = trimmed.split("**");
        processedText = parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="font-bold text-white">{part}</strong> : part);
      }
      elements.push(<p key={i} className="text-xs text-gray-350 leading-relaxed my-1">{processedText}</p>);
    }
  });

  return <div className="space-y-1 overflow-y-auto max-h-[450px] pr-2">{elements}</div>;
}

export default function NotesView({
  state,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: NotesViewProps) {
  const { notes, topics } = state;
  
  const [search, setSearch] = useState("");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  
  // Editorial and creation controllers
  const [isEditing, setIsEditing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Note Form State
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formTopicId, setFormTopicId] = useState(topics[0]?.id || "");
  const [formTagsString, setFormTagsString] = useState("");

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const parsedTags = formTagsString
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    await onAddNote({
      title: formTitle,
      content: formContent,
      tags: parsedTags,
      topicId: formTopicId,
    });

    setFormTitle("");
    setFormContent("");
    setFormTagsString("");
    setShowAddModal(false);
  };

  const handleUpdate = async () => {
    if (!activeNote) return;
    const tagsArray = formTagsString.split(",").map(t => t.trim()).filter(t => t.length > 0);
    await onUpdateNote(activeNote.id, {
      title: formTitle,
      content: formContent,
      tags: tagsArray,
      topicId: formTopicId
    });
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    if (!activeNote) return;
    setFormTitle(activeNote.title);
    setFormContent(activeNote.content);
    setFormTopicId(activeNote.topicId);
    setFormTagsString(activeNote.tags.join(", "));
    setIsEditing(true);
  };

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Personal Notes & Knowledge Base</h2>
          <p className="text-xs text-gray-400 mt-1">
            Maintain high-retention notes formatted in clean markdown scripts detailing complex subtopics.
          </p>
        </div>
        <button
          onClick={() => {
            setFormTitle("");
            setFormContent("");
            setFormTagsString("");
            setFormTopicId(topics[0]?.id || "");
            setShowAddModal(true);
          }}
          className="flex items-center space-x-1.5 py-2.5 px-4 bg-blue-600 hover:bg-blue-500 font-semibold text-white text-xs font-mono rounded-xl cursor-pointer shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] transition-all self-start sm:self-center"
          id="toggle-add-note-form-btn"
        >
          <Plus className="h-4 w-4" />
          <span>Write Markdown Card</span>
        </button>
      </div>

      {/* Editor Modal Overlay for creation */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[#111827] border border-[#1F2937] w-full max-w-4xl rounded-2xl flex flex-col max-h-[85vh] shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-[#1F2937] flex justify-between items-center bg-[#0B1120]/50">
              <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-blue-400">
                Write Markdown Note
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-white text-sm"
              >
                Close (Esc)
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#1F2937] overflow-hidden">
              {/* Writer Field Left */}
              <div className="md:w-1/2 p-5 space-y-4 overflow-y-auto">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1">
                      Note Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. HashMap Collision Treeification"
                      className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1">
                        Curriculum Topic
                      </label>
                      <select
                        value={formTopicId}
                        onChange={(e) => setFormTopicId(e.target.value)}
                        className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {topics.map((t) => (
                          <option key={t.id} value={t.id}>
                            ({t.category}) {t.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1">
                        Tags (Commas delimiter)
                      </label>
                      <input
                        type="text"
                        value={formTagsString}
                        onChange={(e) => setFormTagsString(e.target.value)}
                        placeholder="Java, Memory, GC"
                        className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col h-72">
                  <label className="block text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1">
                    Markdown content (Use ## for headers, - for lists, ``` for code blocks)
                  </label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Type notes here..."
                    className="w-full flex-1 bg-[#0B1120] border border-[#1F2937] rounded-xl p-3 text-xs text-white font-mono placeholder-gray-650 focus:outline-none focus:border-blue-500 resize-none h-60"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-xl shadow-lg"
                  id="confirm-create-note-btn"
                >
                  Save Note to Vault
                </button>
              </div>

              {/* Previewer Pane Right */}
              <div className="md:w-1/2 p-5 bg-[#0B1120]/45 overflow-y-auto flex flex-col">
                <span className="text-[10px] uppercase font-mono text-gray-500 tracking-wider mb-2 flex items-center">
                  <Eye className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Live Markdown Rendering
                </span>
                <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-xl flex-1 max-h-[420px] overflow-y-auto">
                  <h1 className="text-lg font-bold text-white tracking-tight border-b border-[#1F2937] pb-2 mb-3 font-mono">
                    {formTitle || "Note Title Placeholder"}
                  </h1>
                  <MiniMarkdownRenderer text={formContent} />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main split notes navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Notes list catalog with Search bars */}
        <div className="lg:col-span-4 space-y-4 bg-[#111827] border border-[#1F2937] p-4.5 rounded-2xl max-h-[80vh] overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or tags..."
              className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-2 pt-2">
            {filteredNotes.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-xs font-mono">
                No archived notes available.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId;

                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setActiveNoteId(note.id);
                      setIsEditing(false);
                    }}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isActive
                        ? "bg-blue-500/10 border-blue-500/40 text-blue-400 shadow"
                        : "bg-[#0B1120]/80 border-[#1F2937] hover:border-gray-700"
                    }`}
                  >
                    <h4 className="text-xs font-bold text-gray-200 line-clamp-1">{note.title}</h4>
                    <span className="text-[10px] text-gray-500 font-mono block mt-1">{note.createdAt}</span>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.slice(0, 3).map((tg) => (
                        <span key={tg} className="px-1.5 py-0.5 bg-[#111827] text-[9px] text-gray-400 font-mono rounded">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active full Note Viewer/Editor */}
        <div className="lg:col-span-8 bg-[#111827] border border-[#1F2937] rounded-2xl overflow-hidden min-h-[500px] flex flex-col justify-between">
          
          {activeNote ? (
            <div className="flex-1 flex flex-col">
              {/* Header section with delete and edit triggers */}
              <div className="p-4 bg-[#0B1120]/40 border-b border-[#1F2937] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <BookOpen className="h-4.5 w-4.5 text-blue-400" />
                  <span className="text-xs text-gray-400 font-mono">Knowledge view mode</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleStartEdit}
                    disabled={isEditing}
                    className="p-1.5 hover:bg-gray-800 text-gray-400 hover:text-white rounded-lg transition-colors border border-transparent"
                    id="edit-note-btn"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm("Delete note permanently?")) {
                        await onDeleteNote(activeNote.id);
                        setActiveNoteId(notes[0]?.id || null);
                      }
                    }}
                    className="p-1.5 hover:bg-red-500/10 text-gray-600 hover:text-red-400 rounded-lg transition-colors border border-transparent"
                    id="delete-note-btn"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {isEditing ? (
                /* Edit Mode Pane split */
                <div className="flex-1 p-5 space-y-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-sm text-white"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={formTopicId}
                        onChange={(e) => setFormTopicId(e.target.value)}
                        className="bg-[#0B1120] border border-[#1F2937] rounded-xl px-2 py-2 text-xs text-white"
                      >
                        {topics.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={formTagsString}
                        onChange={e => setFormTagsString(e.target.value)}
                        placeholder="Tags comma separated"
                        className="bg-[#0B1120] border border-[#1F2937] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <textarea
                      value={formContent}
                      onChange={e => setFormContent(e.target.value)}
                      className="w-full bg-[#0B1120] border border-[#1F2937] rounded-xl p-3 text-xs text-white font-mono h-64 resize-none"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="py-1.5 px-3 bg-transparent text-gray-400 text-xs font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="py-1.5 px-3.5 bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* Viewer Mode */
                <div className="p-6 space-y-4 flex-1">
                  <div className="border-b border-[#1F2937]/50 pb-3">
                    <h1 className="text-xl font-bold text-white tracking-tight font-mono">{activeNote.title}</h1>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {activeNote.tags.map((tg) => (
                        <span key={tg} className="px-2 py-0.5 bg-[#0B1120] text-[10px] text-gray-400 font-mono rounded">
                          #{tg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none pt-2">
                    <MiniMarkdownRenderer text={activeNote.content} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center space-y-3 flex-1">
              <BookOpen className="h-8 w-8 text-gray-600" />
              <p className="text-xs font-mono">No active note selected. Choose or write one from the catalog sidebar!</p>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
