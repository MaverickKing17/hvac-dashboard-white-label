import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, Settings, Zap, TrendingUp, CloudSun, 
  Activity, MapPin, CheckCircle2, AlertTriangle, ChevronRight, 
  BrainCircuit, Gauge, ShieldCheck, Globe
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [gridStress, setGridStress] = useState(68); // 2026 Grid Predictive Logic

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const wRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Toronto,ca&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`);
        setWeather(await wRes.json());
        const sRes = await fetch('https://connect.getseam.com/devices/list', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${import.meta.env.VITE_SEAM_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        const sData = await sRes.json();
        setDevices(sData.devices || []);
      } catch (err) { console.error("Sync Error", err); }
    };
    fetchLiveData();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-hidden">
      
      {/* 2. SPATIAL UI: SIDEBAR */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col fixed h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-blue-500/20">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">AMBIENT<span className="text-blue-500">TWIN</span></h1>
          </div>
          
          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Command Center" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={<Users size={18} />} label="Lead Pipeline" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
            <SidebarItem icon={<CreditCard size={18} />} label="Plans & ROI" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
            <SidebarItem icon={<Settings size={18} />} label="System Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Agentic Sync</span>
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">AI is currently scanning 12 units in <span className="text-white">North York</span> for capacitor degradation.</p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto relative">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        
        {activeTab === 'dashboard' && (
          <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
            {/* 1. AGENTIC TOP BAR */}
            <header className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter">GTA COMMAND</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-slate-500 text-sm flex items-center gap-1"><MapPin size={14}/> Toronto Grid Active</span>
                  <span className="text-emerald-500 text-sm font-bold flex items-center gap-1"><ShieldCheck size={14}/> IESO Verified</span>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="bg-slate-800/40 backdrop-blur-md border border-white/5 p-4 rounded-3xl flex items-center gap-4 shadow-2xl">
                   <div className="text-right">
                     <p className="text-[10px] font-bold text-slate-500 uppercase">Toronto Int'l (YYZ)</p>
                     <p className="text-xl font-black text-white">{weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°C</p>
                   </div>
                   <CloudSun className="text-yellow-400" size={32} />
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
              {/* 3. OUTCOME STATS */}
              <StatCard title="Grid Stress" value={`${gridStress}%`} trend="Increasing" icon={<Zap className="text-yellow-500"/>} />
              <StatCard title="Active Digital Twins" value={devices.length} trend="+2 this week" icon={<Globe className="text-blue-500"/>} />
              <StatCard title="Enbridge Pipeline" value="$14.2k" trend="Potential" icon={<TrendingUp className="text-emerald-500"/>} />
              <StatCard title="AI Diagnostic Hits" value="12" trend="Verified" icon={<BrainCircuit className="text-purple-500"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* PREDICTIVE MAINTENANCE LAYER */}
              <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg text-white">Agentic Diagnostics <span className="text-blue-500 text-sm ml-2">High Confidence</span></h3>
                  <button className="text-blue-500 text-xs font-bold hover:underline">View All Units</button>
                </div>
                
                <div className="space-y-4">
                  <AgenticAlert 
                    unit="Honeywell T6 Pro - Etobicoke" 
                    issue="Blower Motor Resistance" 
                    confidence="94%" 
                    action="Dispatch Tech: Order Part #8821" 
                  />
                  <AgenticAlert 
                    unit="Ecobee 3 - Scarborough" 
                    issue="Short Cycling Detected" 
                    confidence="88%" 
                    action="Remote Adjustment Applied" 
                  />
                </div>
              </div>

              {/* REBATE TRACKER */}
              <div className="bg-gradient-to-b from-slate-900/40 to-blue-900/10 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-8 shadow-2xl">
                <h3 className="font-bold text-lg text-white mb-6">Enbridge HER+ Pipeline</h3>
                <div className="space-y-6">
                  <RebateProgress label="Audit Phase" value={75} count="24" />
                  <RebateProgress label="Installation" value={40} count="12" />
                  <RebateProgress label="Grant Disbursed" value={15} count="5" />
                  <div className="mt-8 pt-8 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500 uppercase font-black mb-1 tracking-widest">Total Value Secured</p>
                    <p className="text-3xl font-black text-white">$42,500 <span className="text-sm text-emerald-500">CAD</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. PRICING: OUTCOME ORIENTED */}
        {activeTab === 'pricing' && (
          <div className="animate-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto">
             <div className="text-center mb-16">
               <h2 className="text-5xl font-black text-white mb-4 tracking-tighter">2026 FLEET TIERS</h2>
               <p className="text-slate-400">Localized for the Golden Horseshoe Utility Grid.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PriceCard 
                  tier="FIELD TECH" price="119" 
                  features={["50 Digital Twins", "Basic Diagnostics", "Mobile Field App"]}
                />
                <PriceCard 
                  tier="GTA GROWTH" price="319" featured
                  features={["500 Digital Twins", "Agentic AI Diagnostics", "Auto-Rebate Pre-fill", "Priority Grid Alerts"]}
                />
                <PriceCard 
                  tier="ENTERPRISE" price="CUSTOM" 
                  features={["Unlimited Fleet", "IESO Grid Response API", "White-label Portal", "24/7 Command Center"]}
                />
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- 2026 UI COMPONENTS ---

const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-200'}`}
  >
    {icon}
    <span className="font-bold text-sm tracking-tight">{label}</span>
  </div>
);

const StatCard = ({ title, value, trend, icon }: any) => (
  <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] shadow-xl">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-slate-800 rounded-xl">{icon}</div>
      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{trend}</span>
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
    <p className="text-3xl font-black text-white mt-1">{value}</p>
  </div>
);

const AgenticAlert = ({ unit, issue, confidence, action }: any) => (
  <div className="flex items-center justify-between p-5 bg-slate-800/30 rounded-2xl border border-white/5 hover:border-blue-500/50 transition cursor-pointer group">
    <div className="flex items-center gap-5">
      <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center border border-white/5 group-hover:bg-blue-600 transition">
        <Activity size={20} className="text-blue-500 group-hover:text-white" />
      </div>
      <div>
        <h4 className="font-bold text-white text-sm">{unit}</h4>
        <p className="text-xs text-slate-400">{issue} • <span className="text-blue-400 font-bold">{confidence} Conf.</span></p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[10px] font-black text-slate-500 uppercase mb-1">AI Recommendation</p>
      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
        {action} <ChevronRight size={14} />
      </div>
    </div>
  </div>
);

const RebateProgress = ({ label, value, count }: any) => (
  <div>
    <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-tighter">
      <span className="text-slate-300">{label}</span>
      <span className="text-blue-400">{count} Units</span>
    </div>
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const PriceCard = ({ tier, price, features, featured = false }: any) => (
  <div className={`p-10 rounded-[3rem] border transition-all duration-500 flex flex-col ${featured ? 'bg-blue-600 border-blue-400 scale-105 shadow-2xl shadow-blue-600/40 text-white' : 'bg-slate-900/40 border-white/5 text-slate-300 hover:border-white/20'}`}>
    <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4">{tier}</h3>
    <div className="mb-10">
      <span className="text-6xl font-black tracking-tighter">${price}</span>
      {price !== 'CUSTOM' && <span className="text-sm font-bold opacity-60"> /MO</span>}
    </div>
    <div className="space-y-4 mb-12 flex-1">
      {features.map((f: string) => (
        <div key={f} className="flex items-center gap-3 text-sm font-medium italic">
          <CheckCircle2 size={16} className={featured ? 'text-blue-200' : 'text-blue-500'} /> {f}
        </div>
      ))}
    </div>
    <button className={`py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition ${featured ? 'bg-white text-blue-600 hover:bg-slate-100' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
      Deploy Instance
    </button>
  </div>
);

export default App;
