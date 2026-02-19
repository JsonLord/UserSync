import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Info, MessageSquare, BookOpen, LogOut, PanelLeftClose, MessageCircle, AlertTriangle, Trash2, Download, Save } from 'lucide-react';
import SimulationGraph from './SimulationGraph';
import { gradioService } from '../services/gradioService';

interface SimulationPageProps {
  onBack: () => void;
  onOpenConversation: (simId: string | null) => void;
  onOpenChat: (simId: string | null) => void;
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

const OutageNotification = () => (
  <div className="bg-red-900/80 border border-red-700/50 rounded-xl p-4 mt-4 cursor-default animate-pulse">
     <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
        <AlertTriangle size={16} className="text-red-400"/>
        <span>Service Alert</span>
     </div>
     <p className="text-red-200 text-xs leading-relaxed">
       LinkedIn data provider is experiencing an outage. Only X (Twitter) is available for now.
     </p>
  </div>
);

const SimulationPage: React.FC<SimulationPageProps> = ({ onBack, onOpenConversation, onOpenChat }) => {
  const [society, setSociety] = useState('NYT Readers');
  const [viewMode, setViewMode] = useState('Country');
  const [isBuilding, setIsBuilding] = useState(false);
  const [isAssembling, setIsAssembling] = useState(false);
  const [focusGroups, setFocusGroups] = useState<string[]>(['NYT Readers', 'Tech Founders EU', 'Gen Z Gamers', 'SaaS Investors']);
  const [simulations, setSimulations] = useState<any[]>([]);
  const [currentSimId, setCurrentSimId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const groups = await gradioService.listFocusGroups();
        if (groups && Array.isArray(groups) && groups.length > 0) {
          setFocusGroups(groups);
        }

        const sims = await gradioService.listSimulations();
        if (sims && Array.isArray(sims)) {
          setSimulations(sims);
          if (sims.length > 0 && !currentSimId) {
            setCurrentSimId(sims[0].id);
            setSociety(sims[0].name);
          }
        }
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to simulate rebuilding the graph when settings change
  const handleSettingChange = (setter: (val: string) => void, value: string) => {
    if (value === society || (value === viewMode && setter === setViewMode)) return; // No change
    
    setter(value);
    setIsBuilding(true);

    // If we changed the society, we might need to find the corresponding simulation ID
    if (setter === setSociety) {
       const sim = simulations.find(s => s.name === value);
       if (sim) setCurrentSimId(sim.id);
    }

    // Simulate network delay for transition effect
    setTimeout(() => {
        setIsBuilding(false);
    }, 800);
  };

  const handleAssembleNew = async () => {
    const context = prompt("Describe the audience for your new focus group:");
    if (!context) return;

    setIsAssembling(true);
    setIsBuilding(true);
    try {
      const result = await gradioService.identifyPersonas(context);
      const pickedCount = Array.isArray(result) ? result.length : 0;

      // Create simulation for this new group
      const simName = `Group ${simulations.length + 1}: ${context.substring(0, 20)}...`;
      const sim = await gradioService.generateSocialNetwork(simName, pickedCount, "scale_free");

      setSimulations(prev => [sim, ...prev]);
      setCurrentSimId(sim.id);
      setSociety(sim.name);

      if (confirm(`Identified ${pickedCount} personas. Would you like to save this focus group for future use?`)) {
        await gradioService.saveFocusGroup(simName, sim.id);
      }
    } catch (error) {
      console.error("Failed to assemble focus group:", error);
      alert("Failed to assemble focus group. Please try again.");
    } finally {
      setIsAssembling(false);
      setIsBuilding(false);
    }
  };

  const handleDeleteSimulation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this simulation?")) {
      try {
        await gradioService.deleteSimulation(id);
        setSimulations(prev => prev.filter(s => s.id !== id));
        if (currentSimId === id) {
          setCurrentSimId(null);
          setSociety('NYT Readers');
        }
      } catch (error) {
        console.error("Failed to delete simulation:", error);
      }
    }
  };

  const handleExportSimulation = async () => {
    if (!currentSimId) return;
    try {
      const result = await gradioService.exportSimulation(currentSimId);
      alert("Simulation exported successfully!");
      console.log("Export result:", result);
    } catch (error) {
      console.error("Failed to export simulation:", error);
    }
  };

  const currentFilters = VIEW_FILTERS[viewMode] || VIEW_FILTERS['Country'];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white font-sans">
      {/* Sidebar */}
      <aside className="w-[300px] flex-shrink-0 border-r border-gray-800 flex flex-col bg-[#0a0a0a] z-20">
        {/* Header */}
        <div className="p-4 h-16 border-b border-gray-800 flex items-center justify-between">
           <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
              <div className="w-6 h-6 flex items-center justify-center font-bold text-white">Λ</div>
              <span className="font-semibold tracking-tight">SyncUsers</span>
           </div>
           <button className="text-gray-500 hover:text-white"><PanelLeftClose size={18}/></button>
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
                  {focusGroups.map(group => (
                    <option key={group}>{group}</option>
                  ))}
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
             onClick={handleAssembleNew}
             disabled={isAssembling}
             className="w-full flex items-center justify-between text-left text-sm text-gray-300 hover:text-white group py-2"
           >
              <span>Assemble new group</span>
              <Plus size={18} className="text-gray-500 group-hover:text-white" />
           </button>

           <button
             onClick={() => onOpenConversation(currentSimId)}
             className="w-full flex items-center justify-between text-left text-sm text-gray-300 hover:text-white group py-2"
           >
              <span>Create a new test</span>
              <Plus size={18} className="text-gray-500 group-hover:text-white" />
           </button>

           {/* Global Chat Button (Sidebar) */}
           <button 
             onClick={() => onOpenChat(currentSimId)}
             className="w-full flex items-center gap-3 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
           >
              <MessageCircle size={18} />
              <span className="font-medium text-sm">Open Global Chat</span>
           </button>

           {/* Outage Notification */}
           <OutageNotification />

           {/* History List */}
           <div className="space-y-1 pt-4">
             <label className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2 block">Recent Simulations</label>
             {simulations.length > 0 ? (
               simulations.slice(0, 5).map(sim => (
                 <div
                   key={sim.id}
                   onClick={() => handleSettingChange(setSociety, sim.name)}
                   className={`text-sm py-2 px-2 hover:bg-gray-800/50 rounded cursor-pointer flex items-center justify-between group ${currentSimId === sim.id ? 'text-teal-400 bg-gray-800/30' : 'text-gray-400'}`}
                 >
                   <span className="truncate">{sim.name}</span>
                   <button
                     onClick={(e) => handleDeleteSimulation(sim.id, e)}
                     className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-500 transition-opacity p-1"
                   >
                     <Trash2 size={14} />
                   </button>
                 </div>
               ))
             ) : (
               <div className="text-xs text-gray-600 italic px-2">No recent simulations</div>
             )}
           </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-800 p-4 space-y-1 bg-[#0a0a0a]">
           <div className="flex justify-between items-center py-2 text-sm text-gray-400 border-b border-gray-800 mb-2 pb-4">
              <span>Credits: 0</span>
              <Info size={14} className="cursor-help" />
           </div>

           <MenuItem icon={<Plus size={16}/>} label="Start Free Trial" highlight />
           <MenuItem icon={<Download size={16}/>} label="Export Simulation" onClick={handleExportSimulation} />
           <MenuItem icon={<MessageSquare size={16}/>} label="Leave Feedback" />
           <MenuItem icon={<BookOpen size={16}/>} label="Product Guide" />
           <MenuItem icon={<LogOut size={16}/>} label="Log Out" />
           
           <div className="pt-4 text-[10px] text-gray-600">Version 2.1</div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative bg-black">
         {/* Top Navigation Overlay */}
         <div className="absolute top-6 left-6 right-6 z-10 flex justify-center pointer-events-none">
             {/* Legend / Filter Chips */}
             <div className="flex flex-wrap justify-center gap-2 pointer-events-auto">
                {currentFilters.map((filter, idx) => (
                   <FilterChip key={idx} color={filter.color} label={filter.label} />
                ))}
             </div>
         </div>

         {/* Graph Container */}
         <div className="flex-1 w-full h-full">
            <SimulationGraph
              isBuilding={isBuilding}
              societyType={society}
              simulationId={currentSimId}
              onStartChat={() => onOpenChat(currentSimId)}
            />
         </div>

         {/* Floating Chat Button (Bottom) */}
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <button 
              onClick={() => onOpenChat(currentSimId)}
              className="flex items-center gap-2 bg-black/80 backdrop-blur-md border border-gray-700 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-gray-900 transition-all hover:scale-105"
            >
              <MessageCircle size={20} />
              <span className="font-medium">Open Simulation Chat</span>
            </button>
         </div>
      </main>
    </div>
  );
};

// Helper Components
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  highlight?: boolean;
  onClick?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, highlight = false, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-md text-sm transition-colors ${highlight ? 'text-teal-400 hover:bg-teal-950/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
  >
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