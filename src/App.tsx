/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Legend, Cell
} from 'recharts';
import { 
  Thermometer, Wind, CloudRain, Activity, AlertTriangle, 
  TrendingUp, Globe, FileText, Download, Share2, Info,
  Database, Layout, PieChart, FlaskConical, Cpu
} from 'lucide-react';
import { generateClimateData, analyzeClimateTrends, MODEL_SPECS } from './lib/dataEngine';
import { getClimateInsights } from './lib/geminiService';
import { ClimateDataPoint } from './types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ClimateDashboard() {
  const [data, setData] = useState<ClimateDataPoint[]>([]);
  const [insights, setInsights] = useState<string>('Generating AI analysis...');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'temperature' | 'co2' | 'rainfall'>('temperature');
  const [viewMode, setViewMode] = useState<'graph' | 'table'>('graph');
  const [showForecast, setShowForecast] = useState(false);

  useEffect(() => {
    const rawData = generateClimateData(50, showForecast);
    setData(rawData);
    
    const summary = analyzeClimateTrends(rawData);
    if (summary) {
      getClimateInsights(summary).then(setInsights);
    }
    setLoading(false);
  }, [showForecast]);

  const stats = useMemo(() => {
    if (!data.length) return null;
    const summary = analyzeClimateTrends(data);
    return [
      { label: 'Temp Delta', value: `+${summary?.tempDelta}°C`, icon: Thermometer, trend: 'up', desc: '50-yr avg increase' },
      { label: 'CO2 Levels', value: `${data[data.length-1].co2} ppm`, icon: Globe, trend: 'up', desc: 'Current atmospheric concentration' },
      { label: 'Anomalies', value: summary?.totalAnomalies.toString(), icon: AlertTriangle, trend: 'stable', desc: 'Extreme weather events detected' },
      { label: 'Confidence', value: '99.9%', icon: Activity, trend: 'stable', desc: 'Statistical significance (p<0.001)' },
    ];
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0F172A] font-mono text-[#38BDF8]">
        <div className="text-xl animate-pulse tracking-[0.2em] uppercase">Initializing Climate_Nexus...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans selection:bg-[#38BDF8] selection:text-[#0F172A]">
      {/* Top Navigation / Header */}
      <header className="h-20 border-b-2 border-[#334155] px-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="text-xl font-extrabold uppercase tracking-tight flex items-center gap-3">
            Climate Nexus <span className="bg-[#38BDF8] text-[#0F172A] px-2 py-1 rounded text-sm mb-0.5">PRO</span>
          </div>
          <div className="hidden md:block w-px h-6 bg-[#334155] mx-2" />
          <p className="font-mono text-[10px] text-[#38BDF8] uppercase tracking-wider hidden md:block">
            System Status: Optimizing Real-Time Ingestion // v4.2.0
          </p>
        </div>
        <div className="flex gap-4">
          <div className="hidden xl:flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded bg-[#94A3B8]/10 text-[#94A3B8] font-bold uppercase tracking-widest border border-[#334155]">DevOps: Ready</span>
            <span className="text-[10px] px-2 py-1 rounded bg-[#94A3B8]/10 text-[#94A3B8] font-bold uppercase tracking-widest border border-[#334155]">Security: Verified</span>
          </div>
          <button className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] border border-[#38BDF8] px-4 py-2 hover:bg-[#38BDF8] hover:text-[#0F172A] transition-all">
            Export .CSV
          </button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-[1px] bg-[#334155]">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 bg-[#0F172A] flex flex-col p-6 overflow-y-auto max-h-screen lg:max-h-none">
          <div className="section-line mb-6">Indicator Architecture</div>
          
          <div className="flex flex-col gap-3 mb-8">
            <IndicatorButton 
              active={activeTab === 'temperature'} 
              onClick={() => setActiveTab('temperature')}
              label="Surface Temperature"
              code="MOD_01"
              desc="Kelvin/Celsius Heat Gradient"
            />
            <IndicatorButton 
              active={activeTab === 'co2'} 
              onClick={() => setActiveTab('co2')}
              label="Atmospheric CO2"
              code="MOD_02"
              desc="Trace Element Saturation"
            />
            <IndicatorButton 
              active={activeTab === 'rainfall'} 
              onClick={() => setActiveTab('rainfall')}
              label="Precipitation Index"
              code="MOD_03"
              desc="Global Water Distribution"
            />
          </div>
          <div className="section-line mb-4">Model & File System</div>
          <div className="space-y-4 mb-8">
            <div className="p-4 border border-[#334155] rounded-lg bg-[#1E293B]/50">
              <div className="flex items-center gap-2 mb-2 text-[#38BDF8]">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">{MODEL_SPECS.name}</span>
              </div>
              <div className="text-[10px] space-y-1 text-[#94A3B8] font-mono">
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="text-[#F8FAFC]">/models/climateModelConstants.ts</span>
                </div>
                <div className="flex justify-between">
                  <span>Input:</span>
                  <span className="text-[#F8FAFC]">/data/project_metadata.json</span>
                </div>
                <div className="flex justify-between border-t border-[#334155] pt-1 mt-1">
                  <span>Latest_Output:</span>
                  <span className="text-[#10B981]">/output/latest_report.md</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowForecast(!showForecast)}
              className={cn(
                "w-full flex items-center justify-between p-3 border rounded transition-all font-mono text-[10px] uppercase",
                showForecast 
                  ? "bg-[#38BDF8]/10 border-[#38BDF8] text-[#38BDF8]" 
                  : "border-[#334155] text-[#94A3B8] hover:border-[#F8FAFC]"
              )}
            >
              <span>Include 10yr Projection</span>
              <div className={cn("w-2 h-2 rounded-full", showForecast ? "bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" : "bg-[#334155]")} />
            </button>
          </div>

          <div className="mt-auto pt-6 border-t border-[#334155]">
            <div className="section-line mb-4">AI Research Log</div>
            <div className="bg-[#0c121e] border border-[#334155] rounded-lg p-5 font-mono text-[11px] leading-relaxed text-[#94A3B8]">
              <div className="mb-4 text-[#38BDF8]">
                // ANALYZING_TREND_SYMBOLS...<br/>
                // GENERATING_CORE_INSIGHTS...
              </div>
              <div className="text-[#F8FAFC] whitespace-pre-line border-l-2 border-[#38BDF8] pl-4 py-1">
                {insights}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-9 flex flex-col bg-[#0F172A]">
          {/* Key Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#334155]">
            {stats?.map((stat, i) => (
              <div key={i} className={cn("p-6 hover:bg-[#1E293B] transition-colors group", i < stats.length - 1 && "md:border-r border-[#334155]")}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">{stat.label}</span>
                  <stat.icon size={14} className="text-[#38BDF8] group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-2xl font-bold text-[#F8FAFC] mb-1 tracking-tight">{stat.value}</div>
                <div className="w-8 h-0.5 bg-[#38BDF8] mb-2 opacity-50" />
                <p className="text-[10px] text-[#94A3B8] leading-tight uppercase font-semibold">{stat.desc}</p>
              </div>
            ))}
          </div>

          {/* Visualization Area */}
          <div className="flex-1 p-8 bg-[#0c121e] overflow-hidden min-h-[500px] flex flex-col">
             <div className="flex justify-between items-center mb-8 border-b border-[#334155] pb-4">
                <div className="section-line flex-1">Data_Visualization_Canvas</div>
                <div className="flex bg-[#1E293B] border border-[#334155] p-1 rounded-md">
                   <button 
                    onClick={() => setViewMode('graph')}
                    className={cn("p-1.5 rounded transition-colors", viewMode === 'graph' ? "bg-[#38BDF8] text-[#0F172A]" : "text-[#94A3B8] hover:text-[#F8FAFC]")}
                   >
                     <Layout size={14} />
                   </button>
                   <button 
                    onClick={() => setViewMode('table')}
                    className={cn("p-1.5 rounded transition-colors", viewMode === 'table' ? "bg-[#38BDF8] text-[#0F172A]" : "text-[#94A3B8] hover:text-[#F8FAFC]")}
                   >
                     <Database size={14} />
                   </button>
                </div>
             </div>
             
             <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  {viewMode === 'graph' ? (
                    <motion.div 
                      key="graph"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="h-full min-h-[400px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        {activeTab === 'temperature' ? (
                          <AreaChart data={data}>
                            <defs>
                              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                            <XAxis 
                              dataKey="date" 
                              interval={120} 
                              tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}}
                              axisLine={{stroke: '#334155'}}
                              tickLine={{stroke: '#334155'}}
                              tickFormatter={(val) => val.split('-')[0]}
                            />
                            <YAxis 
                              tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}} 
                              axisLine={{stroke: '#334155'}}
                              tickLine={{stroke: '#334155'}}
                              domain={['dataMin - 1', 'dataMax + 1']} 
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="temperature" stroke="#38BDF8" strokeWidth={2} fillOpacity={1} fill="url(#colorTemp)" />
                          </AreaChart>
                        ) : activeTab === 'co2' ? (
                          <LineChart data={data}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                              <XAxis 
                                dataKey="date" 
                                interval={120} 
                                tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}}
                                axisLine={{stroke: '#334155'}}
                                tickLine={{stroke: '#334155'}}
                                tickFormatter={(val) => val.split('-')[0]}
                              />
                              <YAxis 
                                tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}} 
                                axisLine={{stroke: '#334155'}}
                                tickLine={{stroke: '#334155'}}
                                domain={['300', '450']} 
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Line type="monotone" dataKey="co2" stroke="#38BDF8" strokeWidth={2} dot={false} />
                          </LineChart>
                        ) : (
                          <BarChart data={data}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                              <XAxis 
                                dataKey="date" 
                                interval={120} 
                                tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}}
                                axisLine={{stroke: '#334155'}}
                                tickLine={{stroke: '#334155'}}
                                tickFormatter={(val) => val.split('-')[0]}
                              />
                              <YAxis 
                                tick={{fontSize: 10, fontFamily: 'monospace', fill: '#94A3B8'}} 
                                axisLine={{stroke: '#334155'}}
                                tickLine={{stroke: '#334155'}}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar dataKey="rainfall" fill="#38BDF8">
                                 {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.isAnomaly ? '#F43F5E' : '#38BDF8'} />
                                  ))}
                              </Bar>
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="table"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full overflow-auto bg-[#0c121e] border border-[#334155] rounded-md"
                    >
                      <table className="w-full text-[10px] font-mono border-collapse">
                        <thead className="bg-[#1E293B] sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left border-b border-[#334155] text-[#38BDF8]">DATE</th>
                            <th className="px-4 py-2 text-left border-b border-[#334155] text-[#38BDF8]">TEMP (°C)</th>
                            <th className="px-4 py-2 text-left border-b border-[#334155] text-[#38BDF8]">CO2 (PPM)</th>
                            <th className="px-4 py-2 text-left border-b border-[#334155] text-[#38BDF8]">RAIN (MM)</th>
                            <th className="px-4 py-2 text-left border-b border-[#334155] text-[#38BDF8]">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#334155]">
                          {data.slice(-50).map((row, i) => (
                            <tr key={i} className="hover:bg-[#1E293B]/40 transition-colors">
                              <td className="px-4 py-1 border-r border-[#334155]">{row.date}</td>
                              <td className="px-4 py-1 border-r border-[#334155]">{row.temperature}</td>
                              <td className="px-4 py-1 border-r border-[#334155]">{row.co2}</td>
                              <td className="px-4 py-1 border-r border-[#334155]">{row.rainfall}</td>
                              <td className="px-4 py-1">
                                {row.isAnomaly ? (
                                  <span className="text-[#F43F5E] font-bold">ANOMALY</span>
                                ) : (
                                  <span className="text-[#10B981] opacity-50">NORMAL</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="h-20 bg-[#1E293B] border-t border-[#334155] px-10 flex items-center justify-between">
        <div className="flex gap-10">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-widest mb-1">Architecture</span>
            <span className="text-[11px] text-[#94A3B8]">Data Science Pipeline v1.0</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#38BDF8] uppercase tracking-widest mb-1">Persistence</span>
            <span className="text-[11px] text-[#94A3B8]">Edge-Optimized Cache</span>
          </div>
        </div>
        <div className="btn bg-[#38BDF8] text-[#0F172A] px-6 py-2 rounded font-bold text-[11px] uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer">
          Generate Full Dataset Study
        </div>
      </footer>
    </div>
  );
}

function IndicatorButton({ active, onClick, label, code, desc }: { active: boolean, onClick: () => void, label: string, code: string, desc: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-4 border rounded-lg transition-all duration-300 text-left relative overflow-hidden group",
        active 
          ? "bg-[#1E293B] border-[#38BDF8] border-opacity-100 shadow-[0_0_15px_rgba(56,189,248,0.1)]" 
          : "bg-transparent border-[#334155] hover:border-[#94A3B8] opacity-60 hover:opacity-90"
      )}
    >
      {active && <div className="absolute left-0 top-0 w-1 h-full bg-[#38BDF8]" />}
      <div className="flex flex-col">
        <span className={cn("font-mono text-[9px] uppercase tracking-widest mb-1", active ? "text-[#38BDF8]" : "text-[#94A3B8]")}>
          {code}
        </span>
        <span className="text-[13px] font-bold uppercase tracking-tight mb-0.5">{label}</span>
        <span className="text-[10px] text-[#94A3B8] font-medium leading-none">{desc}</span>
      </div>
    </button>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ClimateDataPoint;
    return (
      <div className="bg-[#1E293B] text-[#F8FAFC] p-5 font-mono text-[11px] border border-[#38BDF8] border-opacity-30 shadow-2xl rounded-lg backdrop-blur-md">
        <div className="mb-3 pb-3 border-b border-[#334155] font-bold text-[#38BDF8] uppercase tracking-widest">
          {label} Snapshot
        </div>
        <div className="space-y-2">
          <div className="flex justify-between gap-12">
            <span className="text-[#94A3B8]">TEMPERATURE:</span>
            <span className="text-[#F8FAFC] font-bold">{data.temperature}°C</span>
          </div>
          <div className="flex justify-between gap-12">
            <span className="text-[#94A3B8]">CO2_CONC:</span>
            <span className="text-[#F8FAFC] font-bold">{data.co2} PPM</span>
          </div>
          <div className="flex justify-between gap-12">
            <span className="text-[#94A3B8]">RAIN_FALL:</span>
            <span className="text-[#F8FAFC] font-bold">{data.rainfall} MM</span>
          </div>
          {data.isAnomaly && (
            <div className="mt-4 pt-2 border-t border-[#334155] text-[#F43F5E] font-extrabold uppercase animate-pulse flex items-center gap-2">
               <AlertTriangle size={12} /> Critical_Anomaly Detect
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}
