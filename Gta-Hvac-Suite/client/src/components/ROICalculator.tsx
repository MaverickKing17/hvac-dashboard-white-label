import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { DollarSign, Truck, Zap } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";

export function ROICalculator() {
  const { data: settings } = useSettings();
  const [truckRollCost, setTruckRollCost] = useState(250);
  const [energyWaste, setEnergyWaste] = useState(1200);

  // Update defaults when settings load
  useEffect(() => {
    if (settings) {
      setTruckRollCost(settings.truckRollCost || 250);
      setEnergyWaste(settings.energyWasteCost || 1200);
    }
  }, [settings]);

  // Simple calculation logic
  const truckRollSavings = truckRollCost * 12 * 0.3; // Assume 30% fewer rolls
  const energySavings = energyWaste * 0.2; // Assume 20% efficiency gain
  const totalSavings = truckRollSavings + energySavings;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
          ROI Interactive Calculator
        </h3>
        <p className="text-xs text-gray-500 mt-1">Estimate savings with digital twin tech</p>
      </div>

      <div className="space-y-8">
        {/* Truck Roll Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Truck Roll Cost (CAD)</span>
            </div>
            <span className="text-sm font-mono font-bold text-white">${truckRollCost}</span>
          </div>
          <Slider
            value={[truckRollCost]}
            onValueChange={(vals) => setTruckRollCost(vals[0])}
            max={500}
            step={10}
            className="w-full"
          />
        </div>

        {/* Energy Waste Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Annual Energy Waste (CAD)</span>
            </div>
            <span className="text-sm font-mono font-bold text-white">${energyWaste}</span>
          </div>
          <Slider
            value={[energyWaste]}
            onValueChange={(vals) => setEnergyWaste(vals[0])}
            max={3000}
            step={50}
            className="w-full"
          />
        </div>

        {/* Results Card */}
        <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-5 border border-primary/20 mt-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 text-center">
            <p className="text-sm text-blue-200 font-medium mb-1">Potential Annual Savings</p>
            <div className="text-4xl font-display font-bold text-white mb-2">
              ${totalSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <div className="text-xs text-blue-300/80 px-4">
              Based on 30% fewer truck rolls & 20% efficiency gain per household
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
