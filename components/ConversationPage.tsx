
import React, { useState } from 'react';
import { X, ClipboardList, Linkedin, Instagram, Mail, Layout, Edit3, Type, MonitorPlay, Lightbulb, Image, Plus } from 'lucide-react';
import Button from './ui/Button';

interface ConversationPageProps {
  onBack: () => void;
}

const ConversationPage: React.FC<ConversationPageProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState('Website Content');

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
                  <OptionItem icon={<ClipboardList />} label="Survey" />

                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Marketing Content</h3>
                  <OptionItem icon={<Edit3 />} label="Article" />
                  <OptionItem icon={<Layout />} label="Website Content" active />
                  <OptionItem icon={<MonitorPlay />} label="Advertisement" />
               </div>

               {/* Column 2 */}
               <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Social Media Posts</h3>
                  <OptionItem icon={<Linkedin />} label="LinkedIn Post" />
                  <OptionItem icon={<Instagram />} label="Instagram Post" />
                  <OptionItem icon={<X className="text-white" />} label="X Post" />
                  <OptionItem icon={<MonitorPlay />} label="TikTok Script" />
               </div>

               {/* Column 3 */}
               <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Communication</h3>
                  <OptionItem icon={<Mail />} label="Email Subject Line" />
                  <OptionItem icon={<Mail />} label="Email" />

                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-8 mb-4">Product</h3>
                  <OptionItem icon={<Lightbulb />} label="Product Proposition" />
               </div>

            </div>
         </div>

         {/* Bottom Input Area */}
         <div className="mt-8 p-6 bg-gray-900/30 border-t border-gray-800 flex-1 flex flex-col justify-end">
            <div className="max-w-4xl mx-auto w-full">
               <div className="bg-black border border-gray-700 rounded-2xl p-4 shadow-lg">
                  <textarea 
                    placeholder="Upload an image of your website, describe it, or write your website content here..."
                    className="w-full bg-transparent text-gray-300 placeholder-gray-600 resize-none focus:outline-none min-h-[80px]"
                  />
                  <div className="flex justify-between items-center mt-4">
                     <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="gap-2 text-xs border-gray-800 bg-gray-900 text-gray-300">
                           <Layout size={14} /> Website Content
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 text-xs border-gray-800 bg-gray-900 text-gray-300">
                           <Image size={14} /> Upload Images
                        </Button>
                     </div>
                     <div className="flex gap-3">
                        <Button variant="ghost" size="sm" className="text-xs text-teal-400 hover:text-teal-300">
                           Help Me Craft <span className="ml-1">✨</span>
                        </Button>
                        <Button variant="primary" size="sm" className="gap-2 bg-white text-black hover:bg-gray-200">
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

const OptionItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <div className={`flex items-center gap-4 group cursor-pointer p-2 rounded-lg transition-colors ${active ? 'bg-gray-800' : 'hover:bg-gray-900'}`}>
     <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
        {icon}
     </div>
     <span className={`text-sm font-medium ${active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{label}</span>
  </div>
);

export default ConversationPage;
