// This code replaces the placeholders for Lead Pipeline and System Config
// and integrates with your Supabase/Seam environment variables.

const LeadPipeline = ({ devices }: { devices: any[] }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-10 duration-700">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Market Pipeline</h2>
          <p className="text-slate-500 font-medium">AI-generated leads from connected thermostat fleet.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20">
          + Manual Lead Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* LEAD CARD 1: THE REBATE TARGET */}
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-emerald-500/50 transition-all group">
          <div className="flex justify-between mb-4">
            <span className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-2 py-1 rounded-full">ENBRIDGE ELIGIBLE</span>
            <span className="text-slate-500 text-[10px] font-bold">Ref: #GTA-9921</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Old Mill Residential</h3>
          <p className="text-xs text-slate-400 mb-6 flex items-center gap-1"><MapPin size={12}/> Etobicoke, ON</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-bold">System Health</span>
              <span className="text-orange-400 font-black">Degrading (62%)</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full w-[62%]"></div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-2xl mb-6">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">AI Opportunity</p>
            <p className="text-xs text-white leading-relaxed font-medium">Unit qualifies for <span className="text-emerald-400">$6,500 Grant</span>. Estimated ROI: 18 months.</p>
          </div>
          
          <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-white transition-colors">
            Contact Owner
          </button>
        </div>

        {/* LEAD CARD 2: THE EMERGENCY UPSELL */}
        <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all group">
          <div className="flex justify-between mb-4">
            <span className="bg-blue-500/10 text-blue-500 text-[10px] font-black px-2 py-1 rounded-full">PREDICTIVE FAIL</span>
            <span className="text-slate-500 text-[10px] font-bold">Ref: #GTA-1104</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-1">Leaside Modern</h3>
          <p className="text-xs text-slate-400 mb-6 flex items-center gap-1"><MapPin size={12}/> North York, ON</p>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 font-bold">API Diagnostic</span>
              <span className="text-blue-400 font-black">Igniter Latency High</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[88%]"></div>
            </div>
          </div>

          <button className="w-full py-4 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
            Open Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};

const SystemConfig = () => {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-700">
      <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Partner Branding</h2>
      <p className="text-slate-500 font-medium mb-12">Configure your white-label settings and GTA market defaults.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-8">
          <ConfigInput label="Shop Name" placeholder="Toronto HVAC Solutions" />
          <ConfigInput label="Seam API Key (Vercel Managed)" placeholder="••••••••••••••••" disabled />
          <ConfigInput label="Toronto Service Radius (km)" placeholder="50" />
        </div>

        <div className="space-y-8">
           <div className="bg-slate-900/40 border border-white/5 p-8 rounded-[2.5rem]">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Market ROI Logic</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold text-white uppercase block mb-3">Avg. GTA Truck Roll Cost (CAD)</label>
                  <input type="range" className="w-full accent-blue-500" min="150" max="450" defaultValue="250" />
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 mt-2">
                    <span>$150</span>
                    <span className="text-blue-500">$250</span>
                    <span>$450</span>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="mt-12 pt-12 border-t border-white/5">
        <button className="px-10 py-5 bg-blue-600 rounded-2xl text-white font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-500 transition-all">
          Sync Configuration
        </button>
      </div>
    </div>
  );
};

const ConfigInput = ({ label, placeholder, disabled = false }: any) => (
  <div>
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">{label}</label>
    <input 
      type="text" 
      disabled={disabled}
      className={`w-full bg-slate-900/50 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      placeholder={placeholder} 
    />
  </div>
);
