import { useState, useEffect } from 'react';
import { 
  CarFront, Settings2, Clock3, Lock, 
  AlertCircle, UsersRound, Plus, GripVertical, Trash2, Sigma, Ghost
} from 'lucide-react';
import { Member, HistoryEvent } from './types';

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

const DEFAULT_MEMBERS: Member[] = [
  { id: generateId(), name: 'সলেমান', count: 5, order: 1 },
  { id: generateId(), name: 'হাসান', count: 5, order: 2 },
  { id: generateId(), name: 'আরিফ', count: 5, order: 3 },
  { id: generateId(), name: 'লিটন', count: 5, order: 4 },
  { id: generateId(), name: 'নাহিদ', count: 5, order: 5 },
  { id: generateId(), name: 'রনি', count: 5, order: 6 },
];

export default function App() {
  const [members, setMembers] = useState<Member[]>([]);
  const [history, setHistory] = useState<HistoryEvent[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [showLogin, setShowLogin] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editMembers, setEditMembers] = useState<Member[]>([]);

  useEffect(() => {
    const savedMembers = localStorage.getItem('car_app_members');
    const savedHistory = localStorage.getItem('car_app_history');

    if (savedMembers) {
      setMembers(JSON.parse(savedMembers));
    } else {
      setMembers(DEFAULT_MEMBERS);
    }

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('car_app_members', JSON.stringify(members));
      localStorage.setItem('car_app_history', JSON.stringify(history));
    }
  }, [members, history, isLoaded]);

  const handlePlus = (id: string) => {
    if (!isAdmin) {
      setShowLogin(true);
      return;
    }

    setMembers(prev => prev.map(m => {
      if (m.id === id) {
        const newCount = m.count + 1;
        
        // Add to history
        const newHistoryItem: HistoryEvent = {
          id: generateId(),
          memberName: m.name,
          amountAdded: 1,
          newTotal: newCount,
          timestamp: Date.now()
        };
        
        setHistory(h => [newHistoryItem, ...h].slice(0, 50));
        
        return { ...m, count: newCount };
      }
      return m;
    }));
  };

  const handleEditClick = () => {
    if (!isAdmin) {
      setShowLogin(true);
    } else {
      setEditMembers(JSON.parse(JSON.stringify(members)));
      setShowEdit(true);
    }
  };

  const verifyLogin = () => {
    if (loginPassword === '123456') {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const closeLoginModal = () => {
    setShowLogin(false);
    setLoginPassword('');
    setLoginError(false);
  };

  const logout = () => {
    setIsAdmin(false);
    setShowEdit(false);
  };

  const handleSaveEdit = () => {
    setMembers(editMembers.map((m, idx) => ({ ...m, order: idx + 1 })));
    setShowEdit(false);
  };

  const addNewEditMember = () => {
    setEditMembers([...editMembers, { id: generateId(), name: '', count: 0, order: editMembers.length + 1 }]);
  };

  const removeEditMember = (id: string) => {
    setEditMembers(editMembers.filter(m => m.id !== id));
  };

  const updateEditMember = (id: string, field: keyof Member, value: any) => {
    setEditMembers(editMembers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  if (!isLoaded) return null;

  return (
    <div className="max-w-md mx-auto min-h-screen relative pb-24 bg-gray-50/50 border-x border-gray-100 shadow-sm">
      {/* Sticky Header */}
      <header className="bg-white/85 backdrop-blur-md sticky top-0 z-30 px-6 py-5 border-b border-gray-200/50 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-rose-100 p-2 rounded-xl text-rose-600">
            <CarFront className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mt-1">গাড়ির হিসাব</h1>
        </div>
        <button 
          onClick={handleEditClick}
          className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            isAdmin 
              ? 'bg-gray-900 text-white hover:bg-black shadow-md' 
              : 'text-rose-600 bg-rose-50 hover:bg-rose-100'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>{isAdmin ? 'Admin' : 'Edit'}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Member List */}
        <div className="space-y-3">
          {members.map(m => (
            <div key={m.id} className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(225,29,72,0.1)] p-4 flex items-center justify-between gap-4 transition-transform hover:scale-[1.01]">
              <div className="flex-1 min-w-0">
                <h3 className="text-[20px] font-semibold text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
                  {m.name}
                </h3>
              </div>
              
              <div className="bg-gray-100 border border-gray-200 text-gray-800 text-3xl min-w-[80px] h-14 flex items-center justify-center rounded-xl font-bold font-mono">
                {m.count}
              </div>
              
              <button 
                onClick={() => handlePlus(m.id)} 
                className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl w-14 h-14 flex items-center justify-center shadow-lg shadow-rose-200 active:scale-90 transition-all select-none shrink-0"
                aria-label={`Increase count for ${m.name}`}
              >
                <Plus className="w-7 h-7" />
              </button>
            </div>
          ))}
        </div>

        {/* History Section */}
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-gray-400" />
              History
            </h2>
            <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-bold">
              {history.length}
            </span>
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-400 flex flex-col items-center">
              <Ghost className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <ul className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {history.map(h => {
                const date = new Date(h.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                
                return (
                  <li key={h.id} className="flex gap-4 items-start relative before:absolute before:left-[11px] before:top-8 before:bottom-[-24px] before:w-[2px] last:before:hidden before:bg-gray-100">
                    <div className="w-6 h-6 rounded-full bg-rose-100 border-4 border-white shadow-sm flex items-center justify-center z-10 shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <p className="text-[15px] text-gray-800 font-medium">
                          <span className="font-bold text-gray-900">{h.memberName}</span>{' '}
                          <span className="text-gray-500">increased</span>
                        </p>
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-md">+{h.amountAdded}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1.5">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          <Sigma className="w-3.5 h-3.5 text-gray-400" />
                          New total: <strong className="text-gray-800">{h.newTotal}</strong>
                        </span>
                        <span className="text-xs text-gray-400 font-medium">{dateStr}, {timeStr}</span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-3xl shadow-2xl p-7 w-full max-w-sm">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Admin Access</h3>
            <p className="text-gray-500 mb-6 text-sm">Enter password to make changes to the data.</p>
            
            <input 
              type="password" 
              placeholder="Password" 
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifyLogin()}
              autoFocus
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 mb-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all font-medium"
            />
            {loginError && (
              <p className="text-rose-500 text-sm mb-4 font-medium flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> Incorrect password.
              </p>
            )}
            
            <div className="flex gap-3 mt-6">
              <button onClick={closeLoginModal} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors">Cancel</button>
              <button 
                onClick={verifyLogin} 
                className="flex-1 py-3.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 shadow-md shadow-rose-200 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Data Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-gray-900/60 z-50 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl sm:rounded-3xl">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UsersRound className="w-5 h-5 text-rose-500" />
                Manage Data
              </h3>
              <button onClick={logout} className="text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">Logout</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
              {editMembers.map((m) => (
                <div key={m.id} className="flex gap-3 items-center bg-white p-3 rounded-2xl border border-gray-200 shadow-sm transition-all focus-within:border-rose-300 focus-within:ring-2 focus-within:ring-rose-100">
                  <div className="flex flex-col items-center justify-center w-6 cursor-ns-resize text-gray-300">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="text" 
                      value={m.name} 
                      onChange={e => updateEditMember(m.id, 'name', e.target.value)}
                      className="flex-1 w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl font-medium focus:bg-white focus:outline-none transition-colors" 
                      placeholder="Name" 
                    />
                    <input 
                      type="number" 
                      value={m.count}
                      onChange={e => updateEditMember(m.id, 'count', parseInt(e.target.value) || 0)} 
                      className="w-20 bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-center font-bold focus:bg-white focus:outline-none transition-colors" 
                      placeholder="0" 
                    />
                  </div>
                  <button 
                    onClick={() => removeEditMember(m.id)} 
                    className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" 
                    title="Remove"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-5 bg-white border-t border-gray-100">
              <button 
                onClick={addNewEditMember} 
                className="w-full py-3 mb-4 border-2 border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl font-semibold active:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Member
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowEdit(false)} 
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveEdit} 
                  className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
