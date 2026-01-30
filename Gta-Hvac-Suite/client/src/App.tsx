import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  Zap, 
  TrendingUp, 
  CloudSun, 
  Activity,
  MapPin,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

// --- DATA TYPES ---
interface Lead {
  id: string;
  name: string;
  address: string;
  territory: string;
  unit: string;
  riskScore: number;
  status: 'New' | 'Scheduled' | 'Contacted';
}

const App = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [weather, setWeather] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);
  
  // ROI Calculator State
  const [truckRollCost, setTruckRollCost] = useState(250);
  const [energyWaste, setEnergyWaste] = useState(1200);

  // Leads Data (Hardcoded for Demo)
  const leads: Lead[] = [
    { id: '1', name: 'Fairview Mall Complex', address: '1800 Sheppard Ave E, North York', territory: 'Scarborough-South', unit: 'Trane IntelliPak', riskScore: 85, status: 'New' },
    { id: '2', name: 'Vaughan Mills Retail', address: '1 Bass Pro Mills Dr, Vaughan', territory: 'Vaughan-East', unit: 'Carrier Weathermaster', riskScore: 45, status: 'Scheduled' },
    { id: '3', name: 'RBC Plaza', address: '200 Bay St, Toronto', territory: 'Downtown Core', unit: 'Daikin Rebel', riskScore: 12, status: 'Contacted' },
  ];

  // --- API FETCHING ---
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        // 1. Weather
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Toronto,ca&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        setWeather(await weatherRes.json());

        // 2. Seam Devices
        const seamRes = await fetch('https://connect.getseam.com/devices/list', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SEAM_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const seamData = await seamRes.json();
        setDevices(seamData.devices || []);
      } catch (err) {
        console.error("API Sync Error", err);
      }
    };
    fetchLiveData();
  }, []);

  // --- CALCULATIONS ---
  const potentialSavings = Math.round((truckRollCost * 2) + (energyWaste * 0.20)); // Demo Logic

  // --- COMPONENT RENDER ---
  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-72 bg-[#0f172a] border-r border-slate-800 flex flex-col fixed h-full z-10">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="text-white" size={20} />
            </div>
            <div>
              <h1 className="font-bold text-white leading-none">Toronto HVAC</h1>
              <span className="text-[10px] text-blue-400 font-bold tracking-wider uppercase">Solutions</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono pl-1">GTA-HVAC EDITION</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={<Users size={18} />} label="Lead Manager" active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
          <SidebarItem icon={<CreditCard size={18} />} label="Pricing & Plans" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
          <SidebarItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        {/* SYSTEM STATUS FOOTER */}
        <div className="p-4 m-4 bg-[#1e293b] rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-2 w-2 rounded-full ${devices.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            <span className="text-xs font-bold text-slate-300">System Online</span>
          </div>
          <p className="text-[10px] text-slate-500">Connected to GTA Grid (IESO)</p>
          <p className="text-[10px] text-slate-500">Latency: 12ms</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-8 overflow-y-auto">
        
        {/* VIEW: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Operational Overview</h2>
                <p className="text-slate-400 mt-2">Welcome back. Here's your GTA market performance.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-medium text-emerald-400">Grid Status: Normal</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 1. WEATHER RESPONSE CARD */}
              <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                  <CloudSun size={100} />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Weather Response</h3>
                <p className="text-sm text-slate-400 mb-1">Pearson Int'l (YYZ)</p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-white">
                    {weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°C
                  </span>
                  <span className="text-slate-400">{weather?.weather?.[0]?.main || 'Partly Cloudy'}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#1e293b] p-3 rounded-lg border border-slate-700">
                    <Zap size={16} className="text-yellow-500 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase">Grid Load</p>
                    <p className="text-sm font-bold text-white">Moderate</p>
                  </div>
                  <div className="bg-[#1e293b] p-3 rounded-lg border border-slate-700">
                    <Thermometer size={16} className="text-rose-500 mb-2" />
                    <p className="text-[10px] text-slate-400 uppercase">HVAC Impact</p>
                    <p className="text-sm font-bold text-white">High</p>
                  </div>
                </div>
              </div>

              {/* 2. GRANT ELIGIBILITY CARD */}
              <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Grant Eligibility</h3>
                    <p className="text-xs text-slate-500 mt-1">Enbridge / Greener Homes</p>
                  </div>
                  <TrendingUp className="text-emerald-500" size={20} />
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-[#1e293b] rounded-xl border border-slate-700">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-sm text-white">Enbridge Home Efficiency</span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">$2,400 avg</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Eligible Clients: <strong className="text-white">142</strong></span>
                      <span>Active Apps: <strong className="text-blue-400">28</strong></span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#1e293b] rounded-xl border border-slate-700">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-sm text-white">Canada Greener Homes</span>
                      <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">$5,000 avg</span>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Eligible Clients: <strong className="text-white">89</strong></span>
                      <span>Active Apps: <strong className="text-blue-400">15</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. ROI INTERACTIVE CALCULATOR */}
              <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ROI Interactive Calculator</h3>
                <p className="text-xs text-slate-500 mb-6">Estimate savings with digital twin tech</p>

                <div className="space-y-6 mb-8">
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300">Truck Roll Cost (CAD)</span>
                      <span className="font-bold text-white">${truckRollCost}</span>
                    </div>
                    <input 
                      type="range" min="100" max="500" value={truckRollCost} 
                      onChange={(e) => setTruckRollCost(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-300">Annual Energy Waste (CAD)</span>
                      <span className="font-bold text-white">${energyWaste}</span>
                    </div>
                    <input 
                      type="range" min="500" max="5000" step="100" value={energyWaste} 
                      onChange={(e) => setEnergyWaste(Number(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-auto bg-blue-600/10 border border-blue-500/20 p-6 rounded-xl text-center">
                  <p className="text-xs text-blue-300 font-bold uppercase mb-1">Potential Annual Savings</p>
                  <p className="text-4xl font-black text-white tracking-tight">${potentialSavings.toLocaleString()}</p>
                  <p className="text-[10px] text-blue-400 mt-2 px-4 leading-relaxed">
                    Based on 30% fewer truck rolls & 20% efficiency gain per household.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: LEAD MANAGER */}
        {activeTab === 'leads' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-8 flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">Lead Manager</h2>
                <p className="text-slate-400">Manage HVAC opportunities across the GTA.</p>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition">
                + Add Lead
              </button>
            </header>

            <div className="relative mb-6">
              <input type="text" placeholder="Search by name or address..." className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-600 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 hover:border-blue-500/50 transition group cursor-pointer">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={`h-2 w-2 rounded-full ${lead.status === 'New' ? 'bg-red-500' : lead.status === 'Scheduled' ? 'bg-yellow-500' : 'bg-emerald-500'}`}></span>
                    <span className="text-[10px] font-bold uppercase text-slate-400">{lead.status}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{lead.name}</h3>
                  <div className="flex items-start gap-2 text-xs text-slate-400 mb-4">
                    <MapPin size={12} className="mt-0.5" />
                    {lead.address}
                  </div>
                  
                  <div className="space-y-2 bg-[#1e293b] p-3 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Territory</span>
                      <span className="text-blue-400 font-medium">{lead.territory}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Unit</span>
                      <span className="text-slate-300">{lead.unit}</span>
                    </div>
                    <div className="flex justify-between text-xs items-center">
                      <span className="text-slate-500">Risk Score</span>
                      <span className={`font-bold ${lead.riskScore > 80 ? 'text-red-400' : 'text-emerald-400'}`}>{lead.riskScore}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl animate-in fade-in duration-500">
             <header className="mb-10">
                <h2 className="text-3xl font-bold text-white">Settings</h2>
                <p className="text-slate-400">Manage your white-label branding and localized configurations.</p>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Branding Form */}
                <div className="bg-[#0f172a] p-8 rounded-2xl border border-slate-800">
                  <h3 className="font-bold text-white mb-6">Partner Branding</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Company Name</label>
                      <input type="text" value="Toronto HVAC Solutions" className="w-full bg-[#1e293b] border border-slate-700 rounded-lg p-3 text-white text-sm" />
                      <p className="text-[10px] text-slate-500 mt-2">Displayed in the sidebar and reports.</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Company Logo</label>
                      <div className="flex gap-4">
                        <div className="h-16 w-16 bg-[#1e293b] rounded-lg border border-slate-700 flex items-center justify-center text-[10px] text-slate-500">No Logo</div>
                        <button className="flex-1 border border-dashed border-slate-600 rounded-lg text-slate-400 text-sm hover:border-blue-500 hover:text-blue-500 transition">Upload Logo</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme Preview */}
                <div className="bg-[#0f172a] p-8 rounded-2xl border border-slate-800">
                  <h3 className="font-bold text-white mb-2">Theme Preview</h3>
                  <p className="text-xs text-slate-500 mb-6">Your current theme is set to <span className="text-white font-medium">Neutral Enterprise (Dark Navy)</span>.</p>
                  
                  <div className="space-y-3">
                    <div className="h-10 bg-blue-600 rounded-lg w-full"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-20 bg-[#1e293b] rounded-lg border border-slate-700"></div>
                      <div className="h-20 bg-[#1e293b] rounded-lg border border-slate-700"></div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )}

      </main>
    </div>
  );
};

// HELPER: Sidebar Item
const SidebarItem = ({ icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
  >
    {React.cloneElement(icon, { size: 18, className: active ? 'text-white' : 'text-slate-400 group-hover:text-slate-200' })}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

// HELPER: Thermometer (re-defined to avoid import errors if lucide version varies)
const Thermometer = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
);

export default App;
