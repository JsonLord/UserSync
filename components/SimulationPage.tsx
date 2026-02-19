import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Info, MessageSquare, BookOpen, LogOut, PanelLeftClose, MessageCircle, AlertTriangle, Menu, PanelRightClose } from 'lucide-react';
import SimulationGraph from './SimulationGraph';

interface SimulationPageProps {
  onBack: () => void;
  onOpenConversation: () => void;
  onOpenChat: () => void;
  user?: any;
  onLogin?: () => void;
}

// Define the data structure for filters
const VIEW_FILTERS: Record<string, Array<{ label: string; color: string }>> = {
  'Country': [
    { label: "United States", color: "bg-blue-600" },
    { label: "United Kingdom", color: "bg-purple-600" },
    { label: "Netherlands", color: "bg-teal-600" },
    { label: "France", color: "bg-orange-600" },
    { label: "India", color: "bg-pink-600" }
  ],
  'Job Title': [
    { label: "Founder", color: "bg-indigo-500" },
    { label: "Product Manager", color: "bg-emerald-500" },
    { label: "Engineer", color: "bg-rose-500" },
    { label: "Investor", color: "bg-amber-500" },
    { label: "Designer", color: "bg-fuchsia-500" }
  ],
  'Sentiment': [
    { label: "Positive", color: "bg-green-500" },
    { label: "Neutral", color: "bg-gray-500" },
    { label: "Negative", color: "bg-red-500" },
    { label: "Mixed", color: "bg-yellow-500" }
  ],
  'Activity Level': [
    { label: "Power User", color: "bg-red-600" },
    { label: "Daily Active", color: "bg-orange-500" },
    { label: "Weekly Active", color: "bg-blue-500" },
    { label: "Lurker", color: "bg-slate-600" }
  ]
};

const SimulationPage: React.FC<SimulationPageProps> = ({ onBack, onOpenConversation, onOpenChat, user, onLogin }) => {
  const [society, setSociety] = useState('User Group 1');
  const [viewMode, setViewMode] = useState('Job Title');
  const [isBuilding, setIsBuilding] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(window.innerWidth > 1200);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(window.innerWidth > 768);

  // Handle window resize for mobile responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsLeftPanelOpen(false);
        setIsRightPanelOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to simulate rebuilding the graph when settings change
  const handleSettingChange = (setter: (val: string) => void, value: string) => {
    if (value === society || (value === viewMode && setter === setViewMode)) return; // No change
    
    setter(value);
    setIsBuilding(true);
    // Simulate network delay
    setTimeout(() => {
        setIsBuilding(false);
    }, 1500);
  };

  const currentFilters = VIEW_FILTERS[viewMode] || VIEW_FILTERS['Country'];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans relative">
      {/* Sidebar */}
      <aside className={`fixed md:relative w-[300px] h-full flex-shrink-0 border-r border-gray-800 flex flex-col bg-[#0a0a0a] z-40 transition-all duration-300 ${isLeftPanelOpen ? 'translate-x-0' : '-translate-x-full md:-ml-[300px]'}`}>
        {/* Header */}
        <div className="p-4 h-16 border-b border-gray-800 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
              <div className="w-6 h-6 flex items-center justify-center font-bold text-white">Λ</div>
              <span className="font-semibold tracking-tight">SyncUsers</span>
           </div>
           <button
             onClick={() => setIsLeftPanelOpen(false)}
             className="text-gray-500 hover:text-white"
           >
             <PanelLeftClose size={18}/>
           </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
           
           {/* Current Focus Group Control */}
           <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Current Focus Group</label>
              <div className="relative group">
                <select 
                  value={society}
                  onChange={(e) => handleSettingChange(setSociety, e.target.value)}
                  className="w-full appearance-none bg-[#111] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option>User Group 1</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
              </div>
           </div>

           {/* Current View Control */}
           <div className="space-y-2">
              <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">Current View</label>
              <div className="relative">
                <select 
                  value={viewMode}
                  onChange={(e) => handleSettingChange(setViewMode, e.target.value)}
                  className="w-full appearance-none bg-[#111] border border-gray-700 text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option>Country</option>
                  <option>Job Title</option>
                  <option>Sentiment</option>
                  <option>Activity Level</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
              </div>
           </div>

           <div className="h-px bg-gray-800 my-4" />

           {/* Actions */}
           <button 
             onClick={onOpenConversation}
             className="w-full flex items-center justify-between text-left text-sm text-gray-300 hover:text-white group py-2"
           >
              <span>Create a new test</span>
              <Plus size={18} className="text-gray-500 group-hover:text-white" />
           </button>

           {/* Global Chat Button (Sidebar) */}
           <button 
             onClick={onOpenChat}
             className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
           >
              <MessageCircle size={18} />
              <span className="font-medium text-sm">Open Global Chat</span>
           </button>

           {/* Setup Warning */}
           <div className="bg-amber-900/30 border border-amber-700/50 rounded-xl p-4 mt-4">
              <div className="flex items-center gap-2 text-amber-200 font-bold text-xs mb-1">
                 <AlertTriangle size={14}/>
                 <span>Action Required</span>
              </div>
              <p className="text-amber-200/70 text-[10px] leading-relaxed">
                Assemble a new group and create a new test before using the chat features.
              </p>
           </div>

           {/* History List */}
           <div className="space-y-1 pt-4">
             <label className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 block">Recent Tests</label>
             <div className="text-sm text-gray-400 py-2 px-2 hover:bg-gray-800/50 rounded cursor-pointer truncate">
               Sustainable Luxury Narrative
             </div>
             <div className="text-sm text-gray-400 py-2 px-2 hover:bg-gray-800/50 rounded cursor-pointer truncate">
               Radical Transparency Voice
             </div>
             <div className="text-sm text-gray-400 py-2 px-2 hover:bg-gray-800/50 rounded cursor-pointer truncate">
               Gen-Z Greenwash Perception
             </div>
           </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 space-y-1 bg-[#0a0a0a]">
           {user ? (
             <div className="flex items-center gap-3 py-3 border-b border-gray-800 mb-2">
                {user.avatarUrl && <img src={user.avatarUrl} alt={user.preferred_username} className="w-8 h-8 rounded-full border border-gray-700" />}
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-200">{user.preferred_username}</span>
                  <span className="text-[10px] text-gray-500">Credits: 0</span>
                </div>
             </div>
           ) : (
             <div className="py-2 border-b border-gray-800 mb-2">
                <button
                  onClick={onLogin}
                  className="w-full py-2 bg-white text-black rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                >
                  Sign in with Hugging Face
                </button>
             </div>
           )}

           <MenuItem icon={<Plus size={16}/>} label="Start Free Trial" highlight />
           <MenuItem icon={<MessageSquare size={16}/>} label="Leave Feedback" />
           <MenuItem icon={<BookOpen size={16}/>} label="Product Guide" />
           <MenuItem icon={<LogOut size={16}/>} label="Log Out" />
           
           <div className="pt-4 text-[10px] text-gray-600">Version 2.1</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-black overflow-hidden">
         {/* Top Navigation Overlay */}
         <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center pointer-events-none">
             {/* Left Toggle (when sidebar closed) */}
             <button
               onClick={() => setIsLeftPanelOpen(true)}
               className={`pointer-events-auto p-2 bg-gray-900/80 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-opacity ${isLeftPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
             >
                <Menu size={20} />
             </button>

             {/* Right Toggle (when output closed) */}
             <button
               onClick={() => setIsRightPanelOpen(true)}
               className={`pointer-events-auto p-2 bg-gray-900/80 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-opacity ml-auto ${isRightPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
             >
                <PanelRightClose size={20} className="rotate-180" />
             </button>
         </div>

         <div className="absolute top-6 left-6 right-6 z-10 flex justify-center pointer-events-none">
             {/* Legend / Filter Chips */}
             <div className="flex flex-wrap justify-center gap-2 pointer-events-auto max-w-[60%]">
                {currentFilters.map((filter, idx) => (
                   <FilterChip key={idx} color={filter.color} label={filter.label} />
                ))}
             </div>
         </div>

         {/* Graph Container */}
         <div className="flex-1 w-full h-full">
            <SimulationGraph isBuilding={isBuilding} societyType={society} onStartChat={onOpenChat} />
         </div>

         {/* Floating Chat Button (Bottom) */}
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <button 
              onClick={onOpenChat}
              className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-gray-700 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-gray-900 transition-all hover:scale-105"
            >
              <MessageCircle size={20} />
              <span className="font-medium">Open Simulation Chat</span>
            </button>
         </div>
      </main>

      {/* Right Sidebar (Output) */}
      <aside className={`fixed right-0 md:relative w-[300px] h-full flex-shrink-0 border-l border-gray-800 flex flex-col bg-[#0a0a0a] z-40 transition-all duration-300 ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full md:-mr-[300px]'}`}>
        <div className="p-4 h-16 border-b border-gray-800 flex items-center justify-between">
           <span className="font-semibold tracking-tight uppercase text-xs text-gray-500">Output</span>
           <button onClick={() => setIsRightPanelOpen(false)} className="text-gray-500 hover:text-white"><PanelRightClose size={18}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
           <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-2">Simulation Results</p>
              <div className="text-sm text-gray-400 italic text-center py-8">
                Results will appear here after running a simulation.
              </div>
           </div>
        </div>
      </aside>
    </div>
  );
};

// Helper Components
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, highlight = false }) => (
  <button className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-md text-sm transition-colors ${highlight ? 'text-teal-400 hover:bg-teal-950/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
    {icon}
    <span>{label}</span>
  </button>
);

interface FilterChipProps {
  color: string;
  label: string;
}

const FilterChip: React.FC<FilterChipProps> = ({ color, label }) => (
  <button className="flex items-center gap-2 bg-gray-900/80 backdrop-blur border border-gray-700 rounded-full pl-2 pr-4 py-1.5 hover:border-gray-500 transition-colors">
     <span className={`w-2.5 h-2.5 rounded-full ${color}`}></span>
     <span className="text-xs font-medium text-gray-300">{label}</span>
  </button>
);

export default SimulationPage;