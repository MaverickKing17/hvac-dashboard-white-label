import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BarChart3, 
  Thermometer, 
  Users, 
  CloudSun, 
  AlertTriangle, 
  Send,
  Wrench,
  Search
} from 'lucide-react';

// Define the shape of our device data for TypeScript
interface SeamDevice {
  device_id: string;
  device_type: string;
  properties: {
    name: string;
    online: boolean;
    manufacturer?: string;
  };
}

const App = () => {
  // --- STATE MANAGEMENT ---
  const [devices, setDevices] = useState<SeamDevice[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('fleet');

  // --- 1. FETCH SEAM DEVICES ---
  useEffect(() => {
    const getSeamFleet = async () => {
      try {
        const response = await fetch('https://connect.getseam.com/devices/list', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SEAM_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();
        setDevices(data.devices || []);
      } catch (err) {
        console.error("Seam fetch failed:", err);
      }
    };

    // --- 2. FETCH TORONTO WEATHER (GTA) ---
    const getGTAWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Toronto,ca&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Weather fetch failed:", err);
      }
      setLoading(false);
    };

    getSeamFleet();
    getGTAWeather();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="animate-spin h-10 w-10 text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Syncing GTA Service Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* SIDEBAR NAVIGATION */}
      <nav className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-blue-600 p-2 rounded-lg"><Activity size={24} /></div>
          <h1 className="text-xl font-bold tracking-tight">Toronto HVAC</h1>
        </div>
        
        <div className="space-y-4">
          <button onClick={() => setActiveTab('fleet')} className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'fleet' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
            <BarChart3 size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-400">
            <Users size={20} /> Client Manager
          </button>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800 text-slate-400">
            <Wrench size={20} /> Dispatcher
          </button>
        </div>

        <div className="absolute bottom-10 left-6 right-6 p-4 bg-slate-800 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 uppercase font-bold mb-1">Partner Tier</p>
          <p className="text-sm font-medium">Enterprise Suite</p>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="lg:ml-64 p-8">
        {/* HEADER SECTION */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Operational Overview</h2>
            <p className="text-slate-500">Service Coverage: GTA East & West</p>
          </div>

          {/* REAL WEATHER CARD */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <CloudSun className="text-orange-500" size={32} />
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">Toronto (YYZ)</p>
              <p className="text-xl font-bold">{weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°C</p>
            </div>
          </div>
        </header>

        {/* KEY PERFORMANCE INDICATORS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Active Fleet Units</p>
            <h3 className="text-4xl font-black text-blue-600">{devices.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Annual ROI Saved</p>
            <h3 className="text-4xl font-black text-emerald-600">$1,140</h3>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <p className="text-slate-500 text-sm font-medium mb-1">Open Alerts</p>
            <h3 className="text-4xl font-black text-rose-500">2</h3>
          </div>
        </div>

        {/* LIVE SEAM DEVICE FLEET */}
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Thermometer className="text-blue-600" /> Connected Managed Units
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.device_id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 transition group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-blue-50 p-3 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition">
                  <Activity size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${device.properties.online ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  {device.properties.online ? 'Live' : 'Offline'}
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900">{device.properties.name || "Unnamed Unit"}</h4>
              <p className="text-slate-400 text-sm mb-4">Location: Toronto Metropolitan Area</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-900 text-white text-xs font-bold py-3 rounded-xl hover:bg-blue-600 transition">
                  Diagnostics
                </button>
                <button className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition">
                  <Send size={16} className="text-slate-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;
