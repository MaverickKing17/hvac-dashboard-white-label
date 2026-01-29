import { useGrants } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, TrendingUp } from "lucide-react";

export function GrantTracker() {
  const { data: grants, isLoading } = useGrants();

  if (isLoading) {
    return <Skeleton className="h-[300px] w-full rounded-xl bg-card/50" />;
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            Grant Eligibility
          </h3>
          <p className="text-xs text-gray-500 mt-1">Enbridge / Greener Homes</p>
        </div>
        <div className="bg-green-500/10 p-2 rounded-lg">
          <TrendingUp className="w-5 h-5 text-green-400" />
        </div>
      </div>

      <div className="space-y-4">
        {grants?.map((grant) => (
          <div
            key={grant.id}
            className="group relative overflow-hidden bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-4 border border-white/5"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white text-sm">{grant.programName}</h4>
              <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-0.5 rounded">
                ${grant.avgGrantValue?.toLocaleString()} avg
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Eligible Clients</p>
                <p className="text-lg font-bold text-white mt-0.5">
                  {grant.eligibleCount}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Active Applications</p>
                <p className="text-lg font-bold text-blue-400 mt-0.5">
                  {grant.activeCount}
                </p>
              </div>
            </div>

            {/* Progress bar visual */}
            <div className="mt-3 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-400"
                style={{ width: `${((grant.activeCount || 0) / (grant.eligibleCount || 1)) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 bg-blue-500/5 p-3 rounded-lg border border-blue-500/10">
        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <p>Auto-qualification enabled for Ontario region.</p>
      </div>
    </div>
  );
}
