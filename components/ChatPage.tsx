
import React, { useState } from 'react';
import { X, ClipboardList, Linkedin, Instagram, Mail, Layout, Edit3, MonitorPlay, Lightbulb, Image, Plus, Sparkles, Zap, AlertCircle, Video, Megaphone, Link as LinkIcon } from 'lucide-react';

// --- Types ---
interface ChatPageProps {
  onBack: () => void;
}

// --- Sub-components (Modular Structure) ---

const ChatButton: React.FC<{ label: string; primary?: boolean; icon?: React.ReactNode; onClick?: () => void; className?: string }> = ({ label, primary, icon, onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 whitespace-nowrap
      ${primary 
        ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
        : 'bg-gray-900 border border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-600'
      } ${className}`}
  >
    {icon}
    {primary && <Zap size={14} className="fill-black" />}
    {label}
  </button>
);

const CategoryCard: React.FC<{ title: string; options: { label: string; icon: React.ReactNode }[] }> = ({ title, options }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">{title}</h3>
    <div className="space-y-1">
      {options.map((option) => (
        <div key={option.label} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-900/80 cursor-pointer border border-transparent hover:border-gray-800 transition-all duration-200">
          <div className="text-gray-500 group-hover:text-white transition-colors w-5 flex justify-center">
            {option.icon}
          </div>
          <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200">{option.label}</span>
        </div>
      ))}
    </div>
  </div>
);

const ChatInput: React.FC<{ onSimulate: () => void }> = ({ onSimulate }) => {
  const [message, setMessage] = useState('');

  return (
    <div className="border-t border-gray-800 pt-6 mt-4 bg-[#0a0a0a] px-6 pb-8 md:pb-10 absolute bottom-0 left-0 right-0 z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
      <div className="max-w-5xl mx-auto space-y-4">
        <textarea
          className="w-full h-24 bg-black border border-gray-800 text-gray-200 placeholder-gray-600 p-4 rounded-2xl resize-none focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-all text-sm leading-relaxed"
          placeholder="Paste your website link here"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <div className="flex flex-col gap-2">
                <ChatButton label="Website Link for UX Testing" icon={<LinkIcon size={14} />} />
            </div>
            <ChatButton label="Upload Images" icon={<Image size={14} />} className="h-fit" />
          </div>
          <div className="flex gap-3 items-center mt-auto">
             <button className="hidden md:flex text-xs text-gray-500 hover:text-white transition-colors items-center gap-1 mr-2">
                Help Me Craft <Sparkles size={12} />
             </button>
            <ChatButton label="Simulate" primary onClick={onSimulate} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const [showNotification, setShowNotification] = useState(false);

  const handleSimulate = () => {
    setShowNotification(true);
    // Auto-hide after 10 seconds, but arguably for this UX it should persist until user acknowledges
    setTimeout(() => setShowNotification(false), 10000); 
  };

  const categories = {
    'Survey': [
      { label: 'Survey', icon: <ClipboardList size={18} /> }
    ],
    'Marketing Content': [
      { label: 'Article', icon: <Edit3 size={18} /> },
      { label: 'Website Link', icon: <Layout size={18} /> },
      { label: 'Advertisement', icon: <Megaphone size={18} /> }
    ],
    'Social Media Posts': [
      { label: 'LinkedIn Post', icon: <Linkedin size={18} /> },
      { label: 'Instagram Post', icon: <Instagram size={18} /> },
      { label: 'X Post', icon: <X size={18} /> },
      { label: 'TikTok Script', icon: <Video size={18} /> }
    ],
    'Communication': [
      { label: 'Email Subject Line', icon: <Mail size={18} /> },
      { label: 'Email', icon: <Mail size={18} /> }
    ],
    'Product': [
      { label: 'Product Proposition', icon: <Lightbulb size={18} /> }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] text-white flex flex-col animate-in fade-in duration-300">
      
      {/* Header / Nav */}
      <div className="flex items-center justify-between px-6 py-4 md:px-8 md:py-6 border-b border-gray-800/50 bg-[#050505] z-10 relative">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-gray-800 rounded-lg text-white font-bold">Λ</div>
            <h2 className="text-xl font-medium tracking-tight">New Simulation</h2>
         </div>
         <button onClick={onBack} className="p-2 text-gray-500 hover:text-white hover:bg-gray-900 rounded-full transition-colors">
            <X size={24} />
         </button>
      </div>

      {/* Notification Banner */}
      {showNotification && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg animate-in slide-in-from-top-4 fade-in duration-500">
            <div className="bg-[#0f1f15] backdrop-blur-xl border border-green-500/20 text-green-100 px-6 py-5 rounded-2xl shadow-2xl flex items-start gap-4 ring-1 ring-green-500/10">
              <div className="p-1.5 bg-green-500/20 rounded-full mt-0.5 shrink-0">
                <AlertCircle size={18} className="text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-green-300 mb-1">Simulation Initiated</h4>
                <p className="text-sm text-green-200/70 leading-relaxed">
                  The simulation has started. This process can take up to <strong className="text-white">30 minutes</strong>. The results will be sent to this chat automatically when ready.
                </p>
              </div>
              <button onClick={() => setShowNotification(false)} className="text-green-400 hover:text-white ml-auto p-1">
                <X size={16} />
              </button>
            </div>
        </div>
      )}

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 pb-80"> {/* Large bottom padding for fixed input */}
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-semibold text-center mb-12 mt-4 md:mt-8">What would you like to simulate?</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
             {/* Column 1 */}
             <div className="space-y-12">
               <CategoryCard title="Survey" options={categories['Survey']} />
               <CategoryCard title="Marketing Content" options={categories['Marketing Content']} />
             </div>

             {/* Column 2 */}
             <div className="space-y-12">
               <CategoryCard title="Social Media Posts" options={categories['Social Media Posts']} />
             </div>

             {/* Column 3 */}
             <div className="space-y-12">
                <CategoryCard title="Communication" options={categories['Communication']} />
                <CategoryCard title="Product" options={categories['Product']} />
             </div>
          </div>

          <div className="flex justify-center mt-16 mb-8">
             <button className="flex items-center gap-2 text-gray-500 hover:text-gray-300 transition-colors text-sm px-4 py-2 hover:bg-gray-900 rounded-lg">
                <Plus size={16} />
                Request a new context
             </button>
          </div>
        </div>
      </div>

      {/* Input Footer */}
      <ChatInput onSimulate={handleSimulate} />
    </div>
  );
};

export default ChatPage;
