import { Cloud, Sun, Thermometer, Zap } from "lucide-react";
import { useWeather } from "@/hooks/use-data";
import { Skeleton } from "@/components/ui/skeleton";

export function WeatherWidget() {
  const { data, isLoading } = useWeather();

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full rounded-xl bg-card/50" />;
  }

  if (!data) return null;

  return (
    <div className="glass-card rounded-xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="flex items-start justify-between relative z-10">
        <div>
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">
            Weather Response
          </h3>
          <p className="text-xs text-gray-500">Pearson Int'l (YYZ)</p>
        </div>
        <div className={data.temp > 25 ? "text-orange-400" : "text-blue-400"}>
          {data.temp > 20 ? <Sun className="w-6 h-6" /> : <Cloud className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-display font-bold text-white">
          {data.temp}°C
        </span>
        <span className="text-sm text-gray-400 mb-1.5">{data.condition}</span>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-gray-400">Grid Load</span>
          </div>
          <p className="text-sm font-semibold text-white">{data.gridLoad}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400">HVAC Impact</span>
          </div>
          <p className="text-sm font-semibold text-white">{data.hvacImpact}</p>
        </div>
      </div>
    </div>
  );
}
