/**
 * Shared Type Definitions for SYNTAXIA Personal Learning Operating System
 */

export type StatusType = 'not_started' | 'in_progress' | 'completed' | 'paused';
export type TaskStatusType = 'pending' | 'completed' | 'skipped' | 'cancelled';
export type PriorityType = 'low' | 'medium' | 'high';

export interface Phase {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  startDate: string;
  targetDate: string;
  progress: number; // 0 - 100
}

export interface Topic {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  progress: number; // 0 - 100
  category: string; // e.g. 'Java', 'DSA', 'DBMS', 'OS', 'Aptitude', 'System Design'
}

export interface Milestone {
  id: string;
  topicId: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
}

export interface Resource {
  id: string;
  topicId: string;
  title: string;
  description: string;
  link: string;
  priority: PriorityType;
  estimatedHours: number;
  completed: boolean;
}

export interface Task {
  id: string;
  phaseId: string;
  topicId: string;
  milestoneId: string | null;
  title: string;
  description: string;
  status: TaskStatusType;
  dueDate: string;
  completedAt: string | null;
}

export interface StudySession {
  id: string;
  topicId: string;
  date: string; // YYYY-MM-DD
  hours: number;
  minutes: number;
  notes: string;
  sessionType: string; // e.g. 'DSA Practice', 'Java Warmup', 'Mock Advanced Round', 'Aptitude Test', 'Notes Review'
}

export interface Note {
  id: string;
  title: string;
  content: string; // Markdown supported
  tags: string[];
  topicId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string; // lucide icon name or emoji representation
  unlocked: boolean;
  unlockedAt: string | null;
  criteriaType: string; // e.g. 'streak', 'dsa_count', 'session_count', 'hours_count'
  criteriaValue: number;
}

export interface DatabaseState {
  users: Array<{ id: string; name: string; email: string }>;
  phases: Phase[];
  topics: Topic[];
  milestones: Milestone[];
  resources: Resource[];
  tasks: Task[];
  studySessions: StudySession[];
  notes: Note[];
  achievements: Achievement[];
}
