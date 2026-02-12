import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import {
  Trophy,
  Map,
  Target,
  Plus,
  Search,
  Trash2,
  ShieldAlert,
  Scan,
  ChevronRight,
  Hexagon,
  Activity,
  AlertTriangle,
  Smartphone,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';

// --- Types ---
type LeaderboardEntry = {
  id: string;
  team_name: string;
  year: string;
  department: string;
  time_taken: number; // in seconds
};

const DEPARTMENTS = ['CM', 'ECS', 'AIDS', 'IT', 'CS', 'VLSI', 'ENTC', 'ACT'];
const YEARS = ['FY', 'SY', 'TY', 'BTech'];

// --- Utility: Format Time (HH:MM:SS) ---
const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(h.toString().padStart(2, '0'));
  parts.push(m.toString().padStart(2, '0'));
  parts.push(s.toString().padStart(2, '0'));

  return parts.join(':');
};

// --- Components ---

const BackgroundGrid = () => (
  <div className="fixed inset-0 z-[-1] bg-[#0B0F19] overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
    <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-indigo-900/20 to-transparent blur-3xl" />
  </div>
);

const StatCard = ({ icon: Icon, label, value, colorClass }: any) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md group"
  >
    <div className={`absolute top-0 right-0 p-32 rounded-full ${colorClass} opacity-[0.03] blur-2xl group-hover:opacity-10 transition-all duration-500`} />
    <div className="flex items-center gap-4 relative z-10">
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-20 border border-white/5`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
        <p className="text-3xl font-bold text-white font-mono">{value}</p>
      </div>
    </div>
  </motion.div>
);

// --- Page: Leaderboard ---
const LeaderboardPage = ({ entries }: { entries: LeaderboardEntry[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  const filteredEntries = entries.filter(e =>
    (filterDept === 'All' || e.department === filterDept) &&
    (e.team_name.toLowerCase().includes(searchTerm.toLowerCase()))
  ).sort((a, b) => a.time_taken - b.time_taken);

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-700">
      <header className="mb-12 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          ACTIVE MISSION STATUS
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-400 mb-4 tracking-tight drop-shadow-2xl font-outfit">
          AR TREASURE HUNT
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Locate targets, decode clues, and conquer the SAKEC leaderboard.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard icon={Trophy} label="Record Time" value={formatTime(entries[0]?.time_taken || 0)} colorClass="bg-amber-500" />
        <StatCard icon={Target} label="Active Squads" value={entries.length} colorClass="bg-cyan-500" />
        <StatCard icon={Activity} label="Avg. Pace" value={formatTime(Math.floor(entries.reduce((acc, curr) => acc + curr.time_taken, 0) / (entries.length || 1)))} colorClass="bg-purple-500" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0F1623]/80 backdrop-blur-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-wrap gap-4 items-center justify-between bg-white/5">
          <div className="relative flex-1 min-w-[250px] group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              placeholder="Search squad frequency..."
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 outline-none transition-all placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative min-w-[180px]">
            <select
              className="w-full appearance-none bg-black/20 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all cursor-pointer"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="All">All Sectors</option>
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <ChevronRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-12 gap-4 px-8 py-4 bg-black/20 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-white/5">
          <div className="col-span-1 text-center">Rank</div>
          <div className="col-span-4">Squad Name</div>
          <div className="col-span-3">Sector (Dept)</div>
          <div className="col-span-2">Class</div>
          <div className="col-span-2 text-right">Mission Time</div>
        </div>

        <div className="divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative md:grid grid-cols-12 gap-4 items-center px-6 md:px-8 py-5 hover:bg-white/[0.03] transition-colors"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="col-span-1 flex justify-center mb-2 md:mb-0">
                  <div className={`
                    w-10 h-10 flex items-center justify-center rounded-lg font-bold font-mono text-lg border
                    ${index === 0 ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                      index === 1 ? 'bg-slate-300/20 text-slate-300 border-slate-300/50' :
                        index === 2 ? 'bg-orange-700/20 text-orange-400 border-orange-700/50' :
                          'text-slate-500 border-transparent bg-slate-800/50'}
                  `}>
                    {index + 1}
                  </div>
                </div>

                <div className="col-span-4 mb-1 md:mb-0">
                  <div className="font-bold text-white text-lg flex items-center gap-3">
                    <Hexagon className={`w-3 h-3 ${index < 3 ? 'text-cyan-400' : 'text-slate-600'}`} />
                    {entry.team_name}
                  </div>
                </div>

                <div className="col-span-3 text-slate-400 text-sm mb-1 md:mb-0 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                  {entry.department}
                </div>

                <div className="col-span-2 text-slate-500 text-sm font-mono mb-1 md:mb-0">
                  [{entry.year}]
                </div>

                <div className="col-span-2 text-right">
                  <span className="inline-block px-3 py-1 rounded bg-indigo-500/10 text-indigo-300 font-mono font-bold border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/40 transition-all">
                    {formatTime(entry.time_taken)}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEntries.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              <Scan className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No signals detected matching query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Page: Admin ---
const AdminPage = ({ entries, onAdd, onDelete }: { entries: LeaderboardEntry[], onAdd: (e: Omit<LeaderboardEntry, 'id'>) => void, onDelete: (id: string) => void }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [newEntry, setNewEntry] = useState({
    team_name: '',
    year: 'FY',
    department: 'CSE',
    hours: '',
    minutes: '',
    seconds: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'adminpassword001') setIsAdmin(true);
    else alert('Access Denied');
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalSeconds = (parseInt(newEntry.hours || '0') * 3600) +
      (parseInt(newEntry.minutes || '0') * 60) +
      parseInt(newEntry.seconds || '0');

    const entryToAdd: Omit<LeaderboardEntry, 'id'> = {
      team_name: newEntry.team_name,
      year: newEntry.year,
      department: newEntry.department,
      time_taken: totalSeconds
    };
    await onAdd(entryToAdd);
    setNewEntry({ team_name: '', year: 'FY', department: 'CSE', hours: '', minutes: '', seconds: '' });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md p-8 rounded-3xl bg-[#0F1623] border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-500" />
            Admin Access
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Access Key"
              className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all placeholder:text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full bg-white text-black hover:bg-slate-200 py-3 rounded-xl font-bold transition-all transform active:scale-95">
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Command Center</h2>
          <p className="text-slate-400">Manage hunt records and validate times.</p>
        </div>
        <Link to="/" className="mt-4 md:mt-0 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-colors border border-white/10">
          Exit to Leaderboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-fit p-6 rounded-2xl bg-[#0F1623] border border-white/10">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="text-cyan-400" /> New Record
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Squad Name</label>
              <input
                required
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500 outline-none"
                value={newEntry.team_name}
                onChange={e => setNewEntry({ ...newEntry, team_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Year</label>
                <select
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500 outline-none"
                  value={newEntry.year}
                  onChange={e => setNewEntry({ ...newEntry, year: e.target.value })}
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Sector</label>
                <select
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500 outline-none"
                  value={newEntry.department}
                  onChange={e => setNewEntry({ ...newEntry, department: e.target.value })}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Duration</label>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="HH"
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500 outline-none text-center"
                    value={newEntry.hours}
                    onChange={e => setNewEntry({ ...newEntry, hours: e.target.value })}
                  />
                  <span className="absolute right-2 top-2 text-slate-600 text-[10px]">hr</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="MM"
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500 outline-none text-center"
                    value={newEntry.minutes}
                    onChange={e => setNewEntry({ ...newEntry, minutes: e.target.value })}
                  />
                  <span className="absolute right-2 top-2 text-slate-600 text-[10px]">min</span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="SS"
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-white focus:border-cyan-500 outline-none text-center"
                    value={newEntry.seconds}
                    onChange={e => setNewEntry({ ...newEntry, seconds: e.target.value })}
                  />
                  <span className="absolute right-2 top-2 text-slate-600 text-[10px]">sec</span>
                </div>
              </div>
            </div>
            <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-cyan-900/20 mt-4">
              Submit Log
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 rounded-2xl bg-[#0F1623] border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white">Database Entries</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/20 text-slate-500 text-xs uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Squad</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {entries.map(e => (
                  <tr key={e.id} className="hover:bg-white/[0.02] text-sm">
                    <td className="px-6 py-4 font-bold text-white">{e.team_name}</td>
                    <td className="px-6 py-4 text-slate-400">{e.year} <span className="text-slate-600 mx-2">|</span> {e.department}</td>
                    <td className="px-6 py-4 font-mono text-cyan-400">{formatTime(e.time_taken)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onDelete(e.id)}
                        className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Page: Rules ---
const RulesPage = () => {
  const rules = [
    {
      id: 1,
      title: "Game Area",
      description: "The entire game takes place within the college premises. Participants must not leave the college, enter any classrooms, or access any offices. All hints are hidden within the ground floor (foyer area) and corridors across the seven floors.",
      icon: Map
    },
    {
      id: 2,
      title: "Unique Hints",
      description: "Each hint is unique and not repeated anywhere in the game.",
      icon: Target
    },
    {
      id: 3,
      title: "Hint Scanning & Team Leader",
      description: "Only the team leader will be allowed to use the Snapchat filter (provided before the game starts) to scan hints.",
      icon: Scan
    },
    {
      id: 4,
      title: "Smartphone Restriction",
      description: "Other than the team leader, no team member is allowed to use their smartphone during the game.",
      icon: Smartphone
    },
    {
      id: 5,
      title: "Team Unity",
      description: "Teams must stay together throughout the hunt. Splitting up is not allowed.",
      icon: Users
    },
    {
      id: 6,
      title: "Movement Restrictions",
      description: "Lifts are not allowed. All teams must use the stairs to move between floors.",
      icon: Activity
    },
    {
      id: 7,
      title: "Scanning Hints",
      description: "Once a team finds a hint, they must scan it properly using the filter to reveal the next clue. Ensure the scan is clear—zoom in/out, and adjust angles if necessary.",
      icon: Scan
    },
    {
      id: 8,
      title: "Winning Criteria",
      description: "The team that completes the hunt in the shortest time wins. Each group will have a volunteer tracking their time from start to finish.",
      icon: Trophy
    },
    {
      id: 9,
      title: "Rule Violation",
      description: "Any team found violating these rules will be disqualified from the game.",
      icon: ShieldAlert
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6"
        >
          <ShieldAlert className="w-4 h-4" />
          PROTOCOL BRIEFING
        </motion.div>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight font-outfit uppercase">
          MISSION <span className="text-cyan-400">RULES</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Attention Participants: Strictly adhere to the following directives to ensure mission success.
        </p>
      </header>

      <div className="grid gap-6">
        {rules.map((rule, idx) => (
          <motion.div
            key={rule.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0F1623]/80 backdrop-blur-xl p-6 hover:border-cyan-500/30 transition-all"
          >
            <div className="flex gap-6 items-start relative z-10">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <rule.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-cyan-500 font-mono font-bold text-sm">0{rule.id}</span>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors font-outfit">{rule.title}</h3>
                </div>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">
                  {rule.description}
                </p>
              </div>
            </div>
            {/* Background design element */}
            <div className="absolute top-[-20%] right-[-5%] w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h4 className="text-xl font-bold text-white mb-2 font-outfit">FINAL WARNING</h4>
        <p className="text-slate-400">
          Any breach of these protocols will result in immediate disqualification.
          Fair play is essential for a successful hunt.
        </p>
      </div>
    </div>
  );
};

// --- App Root ---
function App() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Fetch initial data and setup real-time subscription
  useEffect(() => {
    const client = supabase;
    if (!client) {
      setLoading(false);
      return;
    }

    fetchEntries();

    // Subscribe to real-time changes
    const channel = client
      .channel('leaderboard_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard' },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, []);

  const fetchEntries = async () => {
    const client = supabase;
    if (!client) return;

    const { data, error } = await client
      .from('leaderboard')
      .select('*')
      .order('time_taken', { ascending: true });

    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      setEntries(data || []);
    }
    setLoading(false);
  };

  const addEntry = async (entry: Omit<LeaderboardEntry, 'id'>) => {
    const client = supabase;
    if (!client) return;

    const { error } = await client
      .from('leaderboard')
      .insert([entry]);

    if (error) {
      alert('Error adding entry: ' + error.message);
    } else {
      // Manually refetch to ensure immediate update in the UI
      fetchEntries();
    }
  };

  const deleteEntry = async (id: string) => {
    const client = supabase;
    if (!client) return;

    const { error } = await client
      .from('leaderboard')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Error deleting entry: ' + error.message);
    } else {
      // Manually refetch to ensure immediate update in the UI
      fetchEntries();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4 text-center">
        <div className="max-w-md p-8 rounded-3xl bg-[#0F1623] border border-red-500/20 shadow-2xl">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4 font-outfit">Configuration Required</h2>
          <p className="text-slate-400 mb-6">
            The Supabase URL and Anon Key are missing. If you are on Vercel, please add
            <code className="text-cyan-400 px-2 py-1 bg-black/30 rounded mx-1">VITE_SUPABASE_URL</code> and
            <code className="text-cyan-400 px-2 py-1 bg-black/30 rounded mx-1">VITE_SUPABASE_ANON_KEY</code>
            to your Project Settings and then Environment Variables.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            I've Added Them, Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <BackgroundGrid />

      <nav className="border-b border-white/10 bg-[#0F1623]/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="container max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl tracking-tight text-white group font-outfit">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur rounded-lg opacity-20 group-hover:opacity-40 transition-opacity" />
              <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-900 to-slate-900 border border-white/10 flex items-center justify-center">
                <Map className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <span>AR <span className="text-cyan-400">HUNT</span></span>
          </Link>
          <div className="flex gap-2 md:gap-4 items-center">
            <Link to="/rules" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all text-center ${location.pathname === '/rules' ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              Rules
            </Link>
            {isHome && (
              <Link to="/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all text-center">
                Admin Center
              </Link>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<LeaderboardPage entries={entries} />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/admin" element={<AdminPage entries={entries} onAdd={addEntry} onDelete={deleteEntry} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}