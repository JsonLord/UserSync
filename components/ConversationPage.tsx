
import React, { useState } from 'react';
import { X, ClipboardList, Linkedin, Instagram, Mail, Layout, Edit3, Type, MonitorPlay, Lightbulb, Image, Plus, Sparkles, AlertCircle } from 'lucide-react';
import Button from './ui/Button';
import { gradioService } from '../services/gradioService';

interface ConversationPageProps {
  onBack: () => void;
  simulationId: string | null;
}

const ConversationPage: React.FC<ConversationPageProps> = ({ onBack, simulationId }) => {
  const [activeTab, setActiveTab] = useState('Website Content');
  const [contentText, setContentText] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'simulating' | 'success' | 'error'>('idle');

  const handleSimulate = async () => {
    if (!simulationId) {
      alert("No active focus group selected. Please go back and select or generate one.");
      return;
    }
    if (!contentText.trim()) {
      alert("Please enter some content to simulate.");
      return;
    }

    setIsSimulating(true);
    setStatus('simulating');
    try {
      await gradioService.startSimulationAsync(simulationId, contentText, activeTab);
      setStatus('success');
      // After success, maybe go back or show results?
      setTimeout(() => onBack(), 2000);
    } catch (error) {
      console.error("Simulation failed:", error);
      setStatus('error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center p-6 animate-in fade-in duration-300">
      {/* Background Mesh (Subtle) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-10 left-10 w-64 h-64 bg-purple-900/30 rounded-full blur-[100px]" />
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="bg-[#050505] border border-gray-800 w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh] relative z-10">
         
         {/* Close Button */}
         <button onClick={onBack} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
            <X size={24} />
         </button>

         <div className="p-10 pb-0">
            <h2 className="text-2xl font-semibold text-center mb-8">What would you like to simulate?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8 max-w-4xl mx-auto">
               
               {/* Column 1 */}
               <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Survey</h3>
                  <OptionItem icon={<ClipboardList />} label="Survey" active={activeTab === 'Survey'} onClick={() => setActiveTab('Survey')} />

                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Marketing Content</h3>
                  <OptionItem icon={<Edit3 />} label="Article" active={activeTab === 'Article'} onClick={() => setActiveTab('Article')} />
                  <OptionItem icon={<Layout />} label="Website Content" active={activeTab === 'Website Content'} onClick={() => setActiveTab('Website Content')} />
                  <OptionItem icon={<MonitorPlay />} label="Advertisement" active={activeTab === 'Advertisement'} onClick={() => setActiveTab('Advertisement')} />
               </div>

               {/* Column 2 */}
               <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Social Media Posts</h3>
                  <OptionItem icon={<Linkedin />} label="LinkedIn Post" active={activeTab === 'LinkedIn Post'} onClick={() => setActiveTab('LinkedIn Post')} />
                  <OptionItem icon={<Instagram />} label="Instagram Post" active={activeTab === 'Instagram Post'} onClick={() => setActiveTab('Instagram Post')} />
                  <OptionItem icon={<X className="text-white" />} label="X Post" active={activeTab === 'X Post'} onClick={() => setActiveTab('X Post')} />
                  <OptionItem icon={<MonitorPlay />} label="TikTok Script" active={activeTab === 'TikTok Script'} onClick={() => setActiveTab('TikTok Script')} />
               </div>

               {/* Column 3 */}
               <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Communication</h3>
                  <OptionItem icon={<Mail />} label="Email Subject Line" active={activeTab === 'Email Subject Line'} onClick={() => setActiveTab('Email Subject Line')} />
                  <OptionItem icon={<Mail />} label="Email" active={activeTab === 'Email'} onClick={() => setActiveTab('Email')} />

                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Product</h3>
                  <OptionItem icon={<Lightbulb />} label="Product Proposition" active={activeTab === 'Product Proposition'} onClick={() => setActiveTab('Product Proposition')} />
               </div>

            </div>
         </div>

         {/* Bottom Input Area */}
         <div className="mt-8 p-6 bg-gray-900/30 border-t border-gray-800 flex-1 flex flex-col justify-end relative">

            {status === 'simulating' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                 <div className="w-12 h-12 border-4 border-teal-900 border-t-teal-500 rounded-full animate-spin"></div>
                 <p className="text-teal-400 font-medium">Running Simulation...</p>
              </div>
            )}

            {status === 'success' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                 <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Sparkles className="text-green-500" />
                 </div>
                 <p className="text-green-400 font-medium">Simulation Started Successfully!</p>
              </div>
            )}

            {status === 'error' && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                 <AlertCircle className="text-red-500" size={48} />
                 <p className="text-red-400 font-medium">Simulation Failed. Please try again.</p>
                 <Button size="sm" onClick={() => setStatus('idle')}>Dismiss</Button>
              </div>
            )}

            <div className="max-w-4xl mx-auto w-full">
               <div className="bg-black border border-gray-700 rounded-2xl p-4 shadow-lg">
                  <textarea 
                    placeholder={`Describe your ${activeTab.toLowerCase()} here...`}
                    value={contentText}
                    onChange={(e) => setContentText(e.target.value)}
                    className="w-full bg-transparent text-gray-300 placeholder-gray-600 resize-none focus:outline-none min-h-[80px]"
                  />
                  <div className="flex justify-between items-center mt-4">
                     <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="gap-2 text-xs border-gray-800 bg-gray-900 text-gray-300">
                           <Layout size={14} /> {activeTab}
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-xs border-gray-800 bg-gray-900 text-gray-300">
                           <Image size={14} /> Upload Images
                        </Button>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="ghost" size="sm" className="text-xs text-teal-400 hover:text-teal-300">
                           Help Me Craft <span className="ml-1">✨</span>
                        </Button>
                        <Button
                           variant="primary"
                           size="sm"
                           className="gap-2 bg-white text-black hover:bg-gray-200"
                           onClick={handleSimulate}
                           disabled={isSimulating}
                        >
                           Simulate <span className="ml-1">⚡</span>
                        </Button>
                     </div>
                  </div>
               </div>
               
               <div className="flex justify-center mt-4">
                 <button className="text-gray-500 text-sm hover:text-white flex items-center gap-2">
                   <Plus size={14} /> Request a new context
                 </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const OptionItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 group cursor-pointer p-2 rounded-lg transition-colors ${active ? 'bg-gray-800' : 'hover:bg-gray-900'}`}
  >
     <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
        {icon}
     </div>
     <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
  </div>
);

export default ConversationPage;
