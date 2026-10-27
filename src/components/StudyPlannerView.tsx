import React, { useState } from 'react';
import { Calendar, Plus, Check, Trash2, Clock, Filter, AlertCircle, Bell, BellRing, BellOff } from 'lucide-react';
import { StudyTask, SubjectCategory, UserProfile } from '../types';
import { useNotifications } from '../contexts/NotificationContext';

interface StudyPlannerViewProps {
  tasks: StudyTask[];
  onUpdateTasks: (tasks: StudyTask[]) => void;
  profile: UserProfile;
}

export const StudyPlannerView: React.FC<StudyPlannerViewProps> = ({
  tasks,
  onUpdateTasks,
  profile,
}) => {
  const { permission, requestPermission, setIsOpenModal: setIsOpenNotificationModal } = useNotifications();
  const [filterSubject, setFilterSubject] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectCategory>(profile.primarySubject);
  const [newDueDate, setNewDueDate] = useState('Today');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newReminderEnabled, setNewReminderEnabled] = useState(true);

  const handleToggle = (id: string) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    onUpdateTasks(updated);
  };

  const handleToggleReminder = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) {
        setIsOpenNotificationModal(true);
      }
    }
    const updated = tasks.map(t =>
      t.id === id ? { ...t, reminderEnabled: t.reminderEnabled === false ? true : !t.reminderEnabled } : t
    );
    onUpdateTasks(updated);
  };

  const handleDelete = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    onUpdateTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: StudyTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      subject: newSubject,
      dueDate: newDueDate,
      completed: false,
      priority: newPriority,
      createdAt: Date.now(),
      reminderEnabled: newReminderEnabled,
    };

    onUpdateTasks([newTask, ...tasks]);
    setNewTitle('');
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (filterSubject !== 'all' && t.subject !== filterSubject) return false;
    if (filterStatus === 'active' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    return true;
  });

  const subjects: SubjectCategory[] = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English & Languages',
    'History & Social Studies',
    'Economics & Commerce',
    'General Science',
    'Japanese',
    'Foundation & Olympiads',
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">
              <Calendar className="w-4 h-4" />
              <span>Study Planner & Checklist</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Stay Organized & Exam-Ready
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Track daily study priorities, assignment deadlines, and practice goals.
            </p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 clay-btn-primary font-bold text-xs flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Task</span>
          </button>
        </div>

        {/* Add Task Clay Modal / Form */}
        {showAddForm && (
          <form onSubmit={handleAddTask} className="clay-card p-6 rounded-3xl space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Create New Study Task
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                  Task Title or Study Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Organic Chemistry nomenclature rules & solve 10 questions"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 clay-input text-xs sm:text-sm outline-none text-slate-800 dark:text-slate-100"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                    Subject
                  </label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value as SubjectCategory)}
                    className="w-full px-3 py-2 clay-input text-xs outline-none text-slate-800 dark:text-slate-100 bg-transparent"
                  >
                    {subjects.map(s => (
                      <option key={s} value={s} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                    Due By
                  </label>
                  <input
                    type="text"
                    placeholder="Today / Friday / Nov 15"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 clay-input text-xs outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1 block">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={e => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="w-full px-3 py-2 clay-input text-xs outline-none text-slate-800 dark:text-slate-100 bg-transparent"
                  >
                    <option value="high" className="bg-white dark:bg-slate-900">High (Urgent)</option>
                    <option value="medium" className="bg-white dark:bg-slate-900">Medium</option>
                    <option value="low" className="bg-white dark:bg-slate-900">Low (Optional)</option>
                  </select>
                </div>
              </div>

              {/* Browser Notification Reminder Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-200/80 dark:border-violet-900/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Browser Deadline Reminder
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Send a browser notification when this task is due today
                    </div>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newReminderEnabled}
                    onChange={e => setNewReminderEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 clay-btn-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 clay-btn-primary text-xs font-bold"
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl clay-card-flat">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Status:</span>
            {(['all', 'active', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors ${
                  filterStatus === status
                    ? 'clay-btn-secondary text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Subject:</span>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="px-2.5 py-1 rounded-xl text-xs font-semibold clay-input outline-none text-slate-700 dark:text-slate-200"
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks list */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="clay-card p-12 text-center rounded-3xl space-y-3">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto opacity-60" />
              <div className="font-display font-bold text-base text-slate-800 dark:text-slate-200">
                No tasks match your filter
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your study goals above or switch your filter to see completed tasks.
              </p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`clay-card p-4 rounded-2xl flex items-center justify-between gap-4 transition-all ${
                  task.completed ? 'opacity-60 bg-slate-50 dark:bg-slate-900/40' : ''
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className={`w-6 h-6 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                    }`}
                  >
                    {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0">
                    <div
                      className={`text-sm font-semibold truncate ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        {task.subject}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                      {task.priority === 'high' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                          High Priority
                        </span>
                      )}
                      {task.reminderEnabled !== false && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center gap-1">
                          <Bell className="w-2.5 h-2.5" />
                          <span>Alert on</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={e => handleToggleReminder(task.id, e)}
                    className={`p-2 rounded-xl transition-colors ${
                      task.reminderEnabled !== false
                        ? 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 hover:bg-violet-100 dark:hover:bg-violet-900/40'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={
                      task.reminderEnabled !== false
                        ? 'Browser reminder active (click to mute)'
                        : 'Click to enable browser reminder'
                    }
                  >
                    {task.reminderEnabled !== false ? (
                      <BellRing className="w-4 h-4" />
                    ) : (
                      <BellOff className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
