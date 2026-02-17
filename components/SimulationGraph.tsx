import React, { useEffect, useRef, useState } from 'react';
import Plotly from 'plotly.js';
import { X, Linkedin, Globe, MapPin, User, Briefcase, Users, Sparkles } from 'lucide-react';
import Button from './ui/Button';

import { gradioService } from '../services/gradioService';

interface SimulationGraphProps {
  isBuilding: boolean;
  societyType: string;
  simulationId: string | null;
  onStartChat?: () => void;
}

const SimulationGraph: React.FC<SimulationGraphProps> = ({ isBuilding, societyType, simulationId, onStartChat }) => {
  const graphDiv = useRef<HTMLDivElement>(null);
  const [selectedProfile, setSelectedProfile] = useState<{ x: number, y: number, data: any } | null>(null);
  const [isLoadingPersona, setIsLoadingPersona] = useState(false);

  // Close popup if building starts
  useEffect(() => {
    if (isBuilding) setSelectedProfile(null);
  }, [isBuilding]);

  useEffect(() => {
    if (!graphDiv.current || isBuilding) return;

    const fetchAndRenderGraph = async () => {
      let nodes: any[] = [];
      let edgeX: (number | null)[] = [];
      let edgeY: (number | null)[] = [];
      const isTech = societyType.includes('Tech') || societyType.includes('Founders');

      try {
        if (simulationId) {
          const graphData = await gradioService.getNetworkGraph(simulationId);
          if (graphData && graphData.nodes) {
             // Assign random positions if not present
             nodes = graphData.nodes.map((n: any) => ({
                ...n,
                x: n.x ?? Math.random(),
                y: n.y ?? Math.random(),
                connections: 0
             }));

             if (graphData.edges) {
                graphData.edges.forEach((edge: any) => {
                   const source = nodes.find(n => n.name === edge.source || n.id === edge.source);
                   const target = nodes.find(n => n.name === edge.target || n.id === edge.target);
                   if (source && target) {
                      source.connections++;
                      target.connections++;
                      edgeX.push(source.x, target.x, null);
                      edgeY.push(source.y, target.y, null);
                   }
                });
             }
          }
        }
      } catch (error) {
        console.error("Failed to fetch real graph:", error);
      }

      // Fallback to random if failed or no ID
      if (nodes.length === 0) {
        const N = isTech ? 120 : 80;
        const radius = isTech ? 0.18 : 0.22;
        
        for (let i = 0; i < N; i++) {
          nodes.push({
            name: `Persona ${i}`,
            x: Math.random(),
            y: Math.random(),
            connections: 0,
            role: isTech ? ['Founder', 'CTO', 'Product Lead', 'VC'][Math.floor(Math.random() * 4)] : ['Journalist', 'Reader', 'Editor', 'Subscriber'][Math.floor(Math.random() * 4)],
            location: ['New York, USA', 'London, UK', 'Berlin, DE', 'Paris, FR'][Math.floor(Math.random() * 4)]
          });
        }

        for (let i = 0; i < N; i++) {
          for (let j = i + 1; j < N; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
              nodes[i].connections++;
              nodes[j].connections++;
              edgeX.push(nodes[i].x, nodes[j].x, null);
              edgeY.push(nodes[i].y, nodes[j].y, null);
            }
          }
        }
      }

    const nodeX = nodes.map(n => n.x);
    const nodeY = nodes.map(n => n.y);
    const nodeColor = nodes.map(n => n.connections); 

    // --- Plotly Config ---
    const edgeTrace = {
      x: edgeX,
      y: edgeY,
      mode: 'lines',
      line: { width: 0.5, color: '#4b5563' },
      hoverinfo: 'none',
      type: 'scatter'
    };

    const nodeTrace = {
      x: nodeX,
      y: nodeY,
      mode: 'markers',
      hoverinfo: 'none', 
      marker: {
        showscale: false,
        colorscale: isTech ? 'Electric' : 'Viridis',
        color: nodeColor,
        size: 10,
        line: { width: 0 }
      },
      type: 'scatter'
    };

    const layout = {
      showlegend: false,
      hovermode: 'closest',
      margin: { b: 0, l: 0, r: 0, t: 0 },
      xaxis: { showgrid: false, zeroline: false, showticklabels: false, range: [-0.05, 1.05], fixedrange: true },
      yaxis: { showgrid: false, zeroline: false, showticklabels: false, range: [-0.05, 1.05], fixedrange: true },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      autosize: true,
      dragmode: false 
    };

    const config = { 
      staticPlot: false, 
      displayModeBar: false, 
      responsive: true 
    };

    // @ts-ignore
    Plotly.newPlot(graphDiv.current, [edgeTrace, nodeTrace], layout, config).then((gd) => {
      // @ts-ignore
      gd.on('plotly_click', async (data) => {
        const point = data.points[0];
        if (point) {
           const nodeIndex = point.pointNumber;
           const nodeData = nodes[nodeIndex];
           
           setSelectedProfile({
               x: point.x, 
               y: point.y,
               data: nodeData
           });

           // Fetch real persona data if available
           if (simulationId && nodeData.name) {
              setIsLoadingPersona(true);
              try {
                const fullData = await gradioService.getPersona(simulationId, nodeData.name);
                setSelectedProfile(prev => prev ? { ...prev, data: { ...prev.data, ...fullData } } : null);
              } catch (error) {
                console.error("Failed to fetch persona details:", error);
              } finally {
                setIsLoadingPersona(false);
              }
           }
        }
      });
    });
    };

    fetchAndRenderGraph();

  }, [isBuilding, societyType, simulationId]);

  return (
    <div className="relative w-full h-full bg-black">
      {/* Loading Overlay */}
      {isBuilding && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
           <div className="w-16 h-16 border-4 border-teal-900 border-t-teal-500 rounded-full animate-spin mb-4"></div>
           <p className="text-teal-400 font-mono animate-pulse">Constructing Focus Group Graph...</p>
        </div>
      )}

      {/* The Graph */}
      <div ref={graphDiv} className="w-full h-full" />

      {/* Profile Popup */}
      {selectedProfile && !isBuilding && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-40 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 flex justify-between items-start">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    {selectedProfile.data.role?.[0] || selectedProfile.data.name?.[0] || '?'}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{selectedProfile.data.name || selectedProfile.data.role}</h3>
                    <p className="text-gray-400 text-xs">{selectedProfile.data.occupation || selectedProfile.data.role || 'Community Member'}</p>
                  </div>
               </div>
               <button 
                 onClick={() => setSelectedProfile(null)}
                 className="text-gray-500 hover:text-white"
               >
                 <X size={16} />
               </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4 relative">
               {isLoadingPersona && (
                 <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <Sparkles size={20} className="text-teal-400 animate-spin" />
                 </div>
               )}
               <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Built from</span>
                  <Linkedin size={14} className="text-[#0077b5]" />
                  <Globe size={14} className="text-gray-300" />
               </div>

               <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300">
                    <MapPin size={12} /> {selectedProfile.data.location || 'Unknown'}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300">
                    <User size={12} /> {selectedProfile.data.age_group || 'Millennial'}
                  </div>
                   <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300">
                    <Briefcase size={12} /> {selectedProfile.data.level || 'Mid Level'}
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-300">
                    <Users size={12} /> {selectedProfile.data.interests?.[0] || 'Creative & Design'}
                  </div>
               </div>

               {selectedProfile.data.description && (
                 <p className="text-xs text-gray-400 line-clamp-3 italic">
                   "{selectedProfile.data.description}"
                 </p>
               )}
            </div>

            {/* Footer */}
            <div className="p-4 pt-0">
               <Button 
                 className="w-full text-sm py-2"
                 onClick={onStartChat}
               >
                 Start Conversation
               </Button>
            </div>
        </div>
      )}
    </div>
  );
};

export default SimulationGraph;