import { Sidebar } from "@/components/Sidebar";
import { WeatherWidget } from "@/components/WeatherWidget";
import { GrantTracker } from "@/components/GrantTracker";
import { ROICalculator } from "@/components/ROICalculator";
import { useLeads } from "@/hooks/use-leads";
import { Link } from "wouter";
import { ArrowRight, Activity, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { data: leads, isLoading } = useLeads();

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-white mb-2">Operational Overview</h1>
            <p className="text-gray-400">Welcome back. Here's your GTA market performance.</p>
          </div>
          <div className="flex gap-4">
            <div className="glass-card px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
              <span className="text-sm font-medium text-white">Grid Status: Normal</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <WeatherWidget />
          <GrantTracker />
          <ROICalculator />
        </div>

        <section className="glass-card rounded-xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">Recent Leads (GTA)</h2>
            <Link href="/leads">
              <div className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 cursor-pointer transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-medium">Customer</th>
                  <th className="p-4 font-medium">Territory</th>
                  <th className="p-4 font-medium">Risk Score</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Last Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Loading data...</td>
                  </tr>
                ) : leads?.slice(0, 5).map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.unitModel}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {lead.territory}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full",
                              (lead.riskScore || 0) > 70 ? "bg-red-500" : (lead.riskScore || 0) > 40 ? "bg-yellow-500" : "bg-green-500"
                            )}
                            style={{ width: `${lead.riskScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono text-gray-300">{lead.riskScore}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn(
                        "text-xs font-medium px-2 py-1 rounded-full",
                        lead.status === "New" ? "bg-blue-500/20 text-blue-400" :
                        lead.status === "Contacted" ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-green-500/20 text-green-400"
                      )}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-400 font-mono">
                      {lead.lastContact ? format(new Date(lead.lastContact), "MMM d, HH:mm") : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
