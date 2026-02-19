import React, { useState } from 'react';
import { gradioService } from '../services/gradioService';
import { Sparkles, Send, Copy, Check, Layout, BarChart3 } from 'lucide-react';

const ContentEngine: React.FC = () => {
  const [originalContent, setOriginalContent] = useState('');
  const [numVariants, setNumVariants] = useState(5);
  const [variants, setVariants] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!originalContent) return;
    setIsGenerating(true);
    try {
      const result = await gradioService.generateVariants(originalContent, numVariants);
      setVariants(result);
    } catch (error) {
      console.error("Failed to generate variants:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-gray-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-black text-xl">
              Λ
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Content Engine</h1>
              <p className="text-gray-500 text-sm">Generate and optimize content variants using AI</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm hover:bg-gray-800 transition-colors">
              <Layout size={16} />
              <span>Dashboard</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm hover:bg-gray-800 transition-colors">
              <BarChart3 size={16} />
              <span>Analytics</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="md:col-span-1 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Original Content</label>
              <textarea
                value={originalContent}
                onChange={(e) => setOriginalContent(e.target.value)}
                placeholder="Paste your original content here..."
                className="w-full h-48 bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-sm focus:outline-none focus:border-teal-500 transition-colors resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Number of Variants</label>
              <input
                type="number"
                value={numVariants}
                onChange={(e) => setNumVariants(parseInt(e.target.value))}
                min={1}
                max={10}
                className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl p-4 text-sm focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !originalContent}
              className="w-full py-4 bg-teal-500 hover:bg-teal-400 disabled:bg-gray-800 disabled:text-gray-500 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="animate-spin" size={18} />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Generate Variants</span>
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Content Variants</label>
              <span className="text-xs text-gray-600">{variants.length} results</span>
            </div>

            {variants.length > 0 ? (
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={index} className="bg-[#0a0a0a] border border-gray-800 rounded-xl p-6 group hover:border-teal-500/50 transition-all animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold text-teal-500 px-2 py-1 bg-teal-500/10 rounded">Variant {index + 1}</span>
                      <button
                        onClick={() => copyToClipboard(variant.text || variant, index)}
                        className="text-gray-500 hover:text-white transition-colors p-1"
                      >
                        {copiedIndex === index ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                      </button>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {variant.text || variant}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[400px] border-2 border-dashed border-gray-900 rounded-2xl flex flex-col items-center justify-center text-gray-600 space-y-4">
                <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <div className="text-center">
                  <p className="font-medium">No variants generated yet</p>
                  <p className="text-sm">Enter your content and click generate to see variations.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEngine;
