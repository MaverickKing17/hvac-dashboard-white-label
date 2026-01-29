import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "$1,000",
      description: "Essential digital twin capabilities for small teams.",
      features: [
        "Basic Digital Twin Models",
        "5 User Accounts",
        "Standard Support",
        "Weekly Reports"
      ],
      cta: "Get Started",
      highlight: false
    },
    {
      name: "GTA Enterprise Implementation",
      price: "$3,000",
      description: "Full compliance & optimization suite for Toronto HVAC.",
      features: [
        "All Starter Features",
        "GTA Regulatory Compliance Suite",
        "Grid Peak-Shaving Integration",
        "Enbridge Rebate Auto-Filing",
        "Priority 24/7 Support",
        "Advanced Risk Analytics"
      ],
      cta: "Contact Sales",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$10,000",
      description: "Custom solutions for large-scale operations.",
      features: [
        "Everything in GTA Enterprise",
        "Custom API Integration",
        "Dedicated Account Manager",
        "On-premise Deployment Option",
        "White-label Branding",
        "Unlimited Users"
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="text-center max-w-2xl mx-auto mb-16 pt-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-gray-400 text-lg">
            Choose the plan that fits your HVAC business needs. All plans include our core digital twin technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name}
              className={cn(
                "rounded-2xl p-8 relative transition-all duration-300",
                tier.highlight 
                  ? "bg-gradient-to-b from-blue-900/40 to-[#0b1120] border-2 border-primary shadow-2xl shadow-primary/20 scale-105 z-10" 
                  : "bg-card border border-white/10 hover:border-white/20"
              )}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Recommended
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-display font-bold text-white">{tier.price}</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-gray-400 text-sm mb-8 h-10">{tier.description}</p>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className={cn("w-5 h-5 flex-shrink-0", tier.highlight ? "text-primary" : "text-gray-500")} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={cn(
                  "w-full h-12 text-base font-semibold",
                  tier.highlight 
                    ? "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" 
                    : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center border-t border-white/5 pt-10">
          <p className="text-gray-500">
            Prices are in CAD. Need a custom quote? <span className="text-primary cursor-pointer hover:underline">Contact our sales team.</span>
          </p>
        </div>
      </main>
    </div>
  );
}
