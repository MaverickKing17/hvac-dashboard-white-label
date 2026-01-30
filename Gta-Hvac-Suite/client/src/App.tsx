import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, CreditCard, Settings, Zap, TrendingUp, CloudSun, 
  Activity, MapPin, CheckCircle2, AlertTriangle, ChevronRight, 
  BrainCircuit, ShieldCheck, Globe, Thermometer, Server
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 2026 Grid Logic State
  const [truckRollCost, setTruckRollCost] = useState(250);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        // 1. Weather (Toronto Focus)
        const wRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Toronto,ca&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        setWeather(await wRes.json());

        // 2. Seam API (Honeywell/Nest/Ecobee)
        const sRes = await fetch('https://connect.getseam.com/devices/list', {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${import.meta.env.VITE_SEAM_API_KEY}`, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({}),
        });
        const sData = await sRes.json();
        setDevices(sData.devices || []);
      } catch (err) {
        console.error("Vercel Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveData();
  }, []);

  if (loading) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <BrainCircuit className="text-blue-500 animate-pulse" size={48} />
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 flex flex-col fixed h-full z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-2xl">
              <BrainCircuit className="text-white" size={24} />
            </div>
            <h1 className="text-xl font-black text-white">AMBIENT<span className="text-blue-500">TWIN</span></h1>
          </div>
          <nav className="space-y-1">
            <SidebarItem icon={<LayoutDashboard size={18} />} label="Command Center" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={<Users size={18} />} label="Lead Pipeline" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
            <SidebarItem icon={<CreditCard size={18} />} label="Plans & ROI" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
            <SidebarItem icon={<Settings size={18} />} label="System Config" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 p-10 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>
        
        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-700">
            <header className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">GTA Command</h2>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-2"><MapPin size={14}/> Active Service Area: Toronto/GTA</p>
              </div>
              <div className="bg-slate-800/40 p-4 rounded-3xl border border-white/5 flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500">PEARSON YYZ</p>
                  <p className="text-xl font-black text-white">{weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°C</p>
                </div>
                <CloudSun className="text-yellow-400" size={32} />
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
              <StatCard title="Active Twins" value={devices.length} icon={<Globe className="text-blue-500"/>} />
              <StatCard title="Grid Stress" value="62%" icon={<Zap className="text-yellow-500"/>} />
              <StatCard title="Rebate Funnel" value="$12.4k" icon={<TrendingUp className="text-emerald-500"/>} />
              <StatCard title="AI Diagnostic" value="9" icon={<Activity className="text-purple-500"/>} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4 bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5">
                <h3 className="font-bold text-white mb-4">Predictive Diagnostics (Seam API)</h3>
                {devices.map(d => (
                  <AgenticAlert key={d.device_id} unit={d.properties?.name || 'Unknown Unit'} status="Online" confidence="98%" />
                ))}
              </div>
              <div className="bg-blue-900/10 p-8 rounded-[2.5rem] border border-blue-500/20">
                <h3 className="font-bold text-white mb-6 uppercase text-sm tracking-widest">Enbridge HER+ Grant Pipeline</h3>
                <RebateProgress label="Audit Phase" value={70} count="18" />
                <RebateProgress label="Install" value={30} count="8" />
              </div>
            </div>
          </div>
        )}

        {/* LEAD PIPELINE VIEW */}
        {activeTab === 'leads' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-white mb-8 uppercase italic">AI Lead Generation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <LeadCard title="Etobicoke Residential" status="ENBRIDGE ELIGIBLE" impact="High Priority" />
              <LeadCard title="North York Condo" status="PREDICTIVE FAIL" impact="Medium Priority" />
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-3xl font-black text-white mb-8 uppercase italic">System Config</h2>
            <div className="max-w-xl space-y-6">
               <ConfigInput label="Shop Name" value="Toronto HVAC Solutions" />
               <ConfigInput label="Truck Roll Cost (CAD)" value={`$${truckRollCost}`} />
               <button className="bg-blue-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white">Save Configuration</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// HELPER COMPONENTS
const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-5 py-4 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}>
    {icon} <span className="font-bold text-sm tracking-tight">{label}</span>
  </div>
);

const StatCard = ({ title, value, icon }: any) => (
  <div className="bg-slate-900/40 p-6 rounded-[2rem] border border-white/5 shadow-xl">
    <div className="p-2 bg-slate-800 w-fit rounded-lg mb-4">{icon}</div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</p>
    <p className="text-3xl font-black text-white mt-1">{value}</p>
  </div>
);

const AgenticAlert = ({ unit, status, confidence }: any) => (
  <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-2xl border border-white/5">
    <div className="flex items-center gap-4">
      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
      <div>
        <p className="font-bold text-white text-sm">{unit}</p>
        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Status: {status}</p>
      </div>
    </div>
    <span className="text-xs font-bold text-blue-400 italic">AI Confidence: {confidence}</span>
  </div>
);

const RebateProgress = ({ label, value, count }: any) => (
  <div className="mb-6">
    <div className="flex justify-between text-[10px] font-black text-slate-400 mb-2 uppercase tracking-widest">
      <span>{label}</span>
      <span>{count} Units</span>
    </div>
    <div className="h-1.5 w-full bg-slate-800 rounded-full">
      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

const LeadCard = ({ title, status, impact }: any) => (
  <div className="bg-slate-900/40 p-8 rounded-[2.5rem] border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer">
    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-3 py-1 rounded-full mb-4 inline-block">{status}</span>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-xs text-slate-500 mb-6 font-medium italic">Impact Score: {impact}</p>
    <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest">Open Lead Profile</button>
  </div>
);

const ConfigInput = ({ label, value }: any) => (
  <div>
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{label}</label>
    <input type="text" readOnly value={value} className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none" />
  </div>
);

export default App;
