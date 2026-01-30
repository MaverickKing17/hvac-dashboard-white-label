import React, { useState, useEffect } from 'react';
import { 
  Activity, LayoutDashboard, Thermometer, Users, Wrench, 
  Settings, CloudSun, Bell, Send, ShieldCheck
} from 'lucide-react';

const App = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Seam Devices
        const seamRes = await fetch('https://connect.getseam.com/devices/list', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SEAM_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const seamData = await seamRes.json();
        // Filters for your Honeywell devices seen in the screenshot
        setDevices(seamData.devices || []);

        // 2. Fetch GTA Weather
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Toronto,ca&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
      } catch (err) {
        console.error("Dashboard Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#0f172a] text-blue-400 font-mono italic">
      <Activity className="animate-spin mr-3" /> Initializing Ambient Twin...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-300 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#1e293b] border-r border-slate-800 flex flex-col">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
            <Activity className="text-white" size={24} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">Ambient Twin</span>
        </div>
        
        <nav className="flex-1 px-6 space-y-2">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
          <NavItem icon={<Thermometer size={20}/>} label="Device Fleet" />
          <NavItem icon={<Users size={20}/>} label="Client Portals" />
          <NavItem icon={<Wrench size={20}/>} label="Maintenance" />
        </nav>

        <div className="p-6 border-t border-slate-800">
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-white tracking-tight">
              SaaS Deployment <span className="text-blue-500">Overview</span>
            </h2>
            <p className="text-slate-500 mt-1 font-medium">Enterprise Monitoring Dashboard v1.0.4</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-[#1e293b] px-5 py-3 rounded-2xl border border-slate-800 flex items-center gap-3 shadow-xl">
              <CloudSun className="text-yellow-400" size={24} />
              <span className="font-bold text-white text-lg">
                {weather?.main?.temp ? Math.round(weather.main.temp) : '-14'}°C
              </span>
            </div>
            <button className="relative p-3 bg-[#1e293b] rounded-2xl border border-slate-800 hover:border-blue-500 transition">
              <Bell size={22} className="text-slate-400" />
              <div className="absolute top-2 right-2 h-2.5 w-2.5 bg-blue-500 rounded-full border-2 border-[#0f172a]"></div>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <MetricCard title="Connected Devices" value={devices.length} color="text-blue-500" />
          <MetricCard title="System Efficiency" value="94.2%" color="text-emerald-500" />
          <MetricCard title="Monthly ROI" value="$1,140" color="text-purple-500" />
        </div>

        {/* ACTIVE FLEET SECTION */}
        <div className="bg-[#1e293b] rounded-[2rem] border border-slate-800 p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-[0.2em]">Active Service Fleet</h3>
            <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20 font-bold">
              {devices.length} Units Online
            </span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {devices.length > 0 ? devices.map((device) => (
              <div key={device.device_id} className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 flex justify-between items-center hover:border-blue-600 transition-all duration-300 group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl group-hover:bg-blue-600/10 transition">
                    <Thermometer className="text-blue-500" size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{device.properties.name}</p>
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <p className="text-xs text-slate-500 font-medium">Model: {device.device_type.split('_').join(' ').toUpperCase()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`h-2.5 w-2.5 rounded-full ${device.properties.online ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></span>
                  <button className="p-3 bg-[#1e293b] rounded-xl hover:bg-blue-600 hover:text-white transition shadow-lg">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-10 text-center text-slate-600 italic border-2 border-dashed border-slate-800 rounded-2xl">
                No active devices found. Check Seam Sandbox connection.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200'}`}>
    {icon}
    <span className="font-bold text-[0.95rem]">{label}</span>
  </div>
);

const MetricCard = ({ title, value, color }: any) => (
  <div className="bg-[#1e293b] p-8 rounded-[2rem] border border-slate-800 shadow-xl hover:translate-y-[-4px] transition-transform">
    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.15em] mb-3">{title}</p>
    <p className={`text-5xl font-black tracking-tighter ${color}`}>{value}</p>
  </div>
);

export default App;
