import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  Thermometer, 
  Users, 
  CloudSun, 
  Send,
  Wrench,
  LayoutDashboard,
  Settings,
  Bell
} from 'lucide-react';

const App = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Seam API Fetch
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

        // Toronto Weather Fetch
        const weatherRes = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Toronto,ca&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const weatherData = await weatherRes.json();
        setWeather(weatherData);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-900 text-white italic">
      Loading Ambient Twin Intelligence...
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200">
      {/* SIDEBAR FROM YOUR HTML DESIGN */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-700 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg"><Activity className="text-white" /></div>
          <span className="text-xl font-bold tracking-tight text-white">Ambient Twin</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Overview" active />
          <NavItem icon={<Thermometer size={20}/>} label="Device Fleet" />
          <NavItem icon={<Users size={20}/>} label="Client Portals" />
          <NavItem icon={<Wrench size={20}/>} label="Maintenance" />
        </nav>

        <div className="p-4 mt-auto border-t border-slate-700">
          <NavItem icon={<Settings size={20}/>} label="Settings" />
        </div>
      </aside>

      {/* MAIN DASHBOARD AREA */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* TOP NAVIGATION BAR */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-white tracking-tight">SaaS Deployment <span className="text-blue-500">Overview</span></h2>
          <div className="flex items-center gap-6">
            {/* REAL TORONTO WEATHER CARD */}
            <div className="bg-[#1e293b] px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-3">
              <CloudSun className="text-yellow-400" />
              <span className="font-semibold text-white">{weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°C</span>
            </div>
            <div className="relative p-2 bg-[#1e293b] rounded-full border border-slate-700">
              <Bell size={20} />
              <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-[#0f172a]"></div>
            </div>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <MetricCard title="Connected Devices" value={devices.length} color="text-blue-400" />
          <MetricCard title="System Efficiency" value="94.2%" color="text-emerald-400" />
          <MetricCard title="Monthly ROI" value="$1,140" color="text-purple-400" />
        </div>

        {/* DEVICE LIST (MAPPED FROM SEAM API) */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6">
          <h3 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">Active Service Fleet</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {devices.map((device) => (
              <div key={device.device_id} className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-blue-500 transition">
                <div>
                  <p className="font-bold text-white">{device.properties.name}</p>
                  <p className="text-xs text-slate-500">ID: {device.device_id.substring(0, 8)}...</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${device.properties.online ? 'bg-green-500 animate-pulse' : 'bg-slate-600'}`}></span>
                  <button className="p-2 bg-[#1e293b] rounded-lg hover:bg-blue-600 transition">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- HELPER COMPONENTS TO MATCH YOUR HTML DESIGN ---
const NavItem = ({ icon, label, active = false }: any) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition ${active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-[#334155] hover:text-white'}`}>
    {icon}
    <span className="font-medium">{label}</span>
  </div>
);

const MetricCard = ({ title, value, color }: any) => (
  <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700">
    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">{title}</p>
    <p className={`text-4xl font-black ${color}`}>{value}</p>
  </div>
);

export default App;
