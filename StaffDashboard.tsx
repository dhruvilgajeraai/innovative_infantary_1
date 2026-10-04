import React, { useState } from 'react';
import { 
  UserCheck, 
  Users, 
  Calendar, 
  CheckSquare, 
  Clock, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  Award,
  Search,
  Download,
  X
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StaffTask } from '../../types';

type StaffTab = 
  | 'dashboard' 
  | 'staff' 
  | 'coaches' 
  | 'schedules' 
  | 'attendance' 
  | 'tasks' 
  | 'performance' 
  | 'reports';

export const StaffDashboard: React.FC = () => {
  const { staff, tasks, updateTaskStatus, createTask } = useData();

  const [activeTab, setActiveTab] = useState<StaffTab>('dashboard');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(staff[0]?.name || 'Sarah Jenkins');
  const [newTaskPriority, setNewTaskPriority] = useState<any>('high');

  const onDutyCount = staff.filter(s => s.status === 'on_duty').length;
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const coaches = staff.filter(s => s.role.includes('Coach') || s.role.includes('Trainer'));

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    createTask({
      title: newTaskTitle,
      assignedTo: newTaskAssignee,
      priority: newTaskPriority,
      status: 'todo',
      dueDate: '2026-10-05'
    });
    setShowTaskModal(false);
    setNewTaskTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* 1. TOP SCI-FI IRON MAN HUD TELEMETRY BAR & GUIDANCE */}
      <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"
          style={{ boxShadow: '0 0 12px rgba(168, 85, 247, 0.6)' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span>STAFF &amp; ROSTERS // STAFF-001</span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-[11px] font-mono text-indigo-400">SHIFT OPERATIONS ACTIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-1">
              Staff Headcount, Coach Rosters &amp; Shift Tasks
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              <strong>Contextual Guidance (Rule 29 &amp; 55):</strong> Oversee certified sports trainers, facility shift workers, task boards, and attendance logs. Staff users can manage their personal passwords without altering authority accounts.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Shift Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRIC TELEMETRY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Staff On Duty Now</div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{onDutyCount} Active</div>
          <div className="text-[10px] text-slate-400">Desk, coaches &amp; maintenance</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Operational Tasks</div>
          <div className="text-2xl font-bold font-mono text-cyan-400">{pendingTasks} Pending</div>
          <div className="text-[10px] text-cyan-300">Court maintenance &amp; gear</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Total Staff Headcount</div>
          <div className="text-2xl font-bold font-mono text-white">{staff.length} Employees</div>
          <div className="text-[10px] text-slate-400">Full-time &amp; shift roster</div>
        </div>

        <div className="p-4 rounded-2xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-1">
          <div className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Attendance Reliability</div>
          <div className="text-2xl font-bold font-mono text-purple-400">97.8%</div>
          <div className="text-[10px] text-emerald-400 font-semibold">Exemplary shift audit</div>
        </div>
      </div>

      {/* 3. MENU TABS (RULE 29 SPECIFIED MENUS) */}
      <div className="flex border-b border-slate-800/80 pb-2 gap-1.5 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'staff', label: `Staff (${staff.length})` },
          { id: 'coaches', label: `Coaches (${coaches.length})` },
          { id: 'schedules', label: 'Schedules' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'tasks', label: `Tasks (${pendingTasks})` },
          { id: 'performance', label: 'Performance' },
          { id: 'reports', label: 'Reports' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as StaffTab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isActive
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: DASHBOARD & STAFF & COACHES */}
      {(activeTab === 'dashboard' || activeTab === 'staff' || activeTab === 'coaches') && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white">Staff Roster &amp; Operational Roles</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px] font-mono">
                <tr>
                  <th className="pb-3 px-3">Employee ID</th>
                  <th className="pb-3 px-3">Full Name</th>
                  <th className="pb-3 px-3">Role / Department</th>
                  <th className="pb-3 px-3">Shift Hours</th>
                  <th className="pb-3 px-3">Contact</th>
                  <th className="pb-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(activeTab === 'coaches' ? coaches : staff).map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">{s.id}</td>
                    <td className="py-3 px-3 font-bold text-white">{s.name}</td>
                    <td className="py-3 px-3 text-slate-300">{s.role}</td>
                    <td className="py-3 px-3 font-mono text-slate-400">{s.shift}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">{s.email}</td>
                    <td className="py-3 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        s.status === 'on_duty' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: TASKS */}
      {activeTab === 'tasks' && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-400" />
              <span>Shift Operations Task Board</span>
            </h4>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              + Create Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tasks.map(t => (
              <div key={t.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <span className="font-bold text-white">{t.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    t.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {t.priority}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">Assigned: {t.assignedTo} &bull; Due: {t.dueDate}</div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] uppercase font-mono text-cyan-400">{t.status}</span>
                  {t.status !== 'completed' && (
                    <button
                      onClick={() => updateTaskStatus(t.id, 'completed')}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold"
                    >
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: SCHEDULES & ATTENDANCE & PERFORMANCE & REPORTS */}
      {(['schedules', 'attendance', 'performance', 'reports'].includes(activeTab)) && (
        <div className="p-6 rounded-3xl backdrop-blur-xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <h4 className="text-sm font-bold text-white capitalize">{activeTab} Metrics &amp; Audit Log</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Weekly Shift Coverage</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>Morning Shift (06:00 - 14:00):</span><strong className="text-emerald-400">100% Staffed</strong></div>
                <div className="flex justify-between"><span>Evening Peak (14:00 - 22:00):</span><strong className="text-emerald-400">100% Staffed</strong></div>
                <div className="flex justify-between"><span>Weekend Coaching Roster:</span><strong className="text-cyan-400">Locked</strong></div>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Compliance &amp; Certifications</span>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between"><span>First-Aid Certifications:</span><strong className="text-emerald-400">100% Up-To-Date</strong></div>
                <div className="flex justify-between"><span>SafeGuard Training:</span><strong className="text-emerald-400">Verified</strong></div>
                <div className="flex justify-between"><span>Overtime Hours:</span><strong className="text-white">0.0 (Optimal)</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Create Shift Task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Laser-sweep Centre Clay Court #1"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Assign Employee</label>
                <select
                  value={newTaskAssignee}
                  onChange={e => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={e => setNewTaskPriority(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500 uppercase"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-glow-violet transition-all"
              >
                Assign Task
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
