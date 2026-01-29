import { Sidebar } from "@/components/Sidebar";
import { useLeads, useCreateLead, useDeleteLead } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema, TERRITORIES } from "@shared/schema";
import { Plus, Search, Trash2, MapPin } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Schema for client-side form validation (can extend the base insert schema)
const formSchema = insertLeadSchema.extend({
  riskScore: z.coerce.number().min(0).max(100),
});

export default function Leads() {
  const { data: leads, isLoading } = useLeads();
  const { mutate: createLead, isPending: isCreating } = useCreateLead();
  const { mutate: deleteLead } = useDeleteLead();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      territory: "Downtown Core",
      unitModel: "",
      riskScore: 50,
      predictedFailure: "None",
      status: "New",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createLead(data, {
      onSuccess: () => {
        setIsDialogOpen(false);
        form.reset();
      },
    });
  };

  const filteredLeads = leads?.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl text-white mb-2">Lead Manager</h1>
            <p className="text-gray-400">Manage HVAC opportunities across the GTA.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg shadow-primary/25">
                <Plus className="w-4 h-4 mr-2" /> Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Customer Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-background border-white/10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="territory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Territory</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background border-white/10">
                                <SelectValue placeholder="Select territory" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-white/10 text-white">
                              {TERRITORIES.map((t) => (
                                <SelectItem key={t} value={t}>{t}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Yonge St" className="bg-background border-white/10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="unitModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit Model</FormLabel>
                          <FormControl>
                            <Input placeholder="Lennox XC21" className="bg-background border-white/10" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="riskScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Risk Score (0-100)</FormLabel>
                          <FormControl>
                            <Input type="number" className="bg-background border-white/10" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90 mt-4" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Create Lead"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input 
              placeholder="Search by name or address..." 
              className="pl-10 bg-card border-white/10 text-white focus:ring-primary/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-12 text-gray-500">Loading leads...</div>
          ) : filteredLeads?.map((lead) => (
            <div key={lead.id} className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    (lead.riskScore || 0) > 70 ? "bg-red-500" : (lead.riskScore || 0) > 40 ? "bg-yellow-500" : "bg-green-500"
                  )} />
                  <span className="text-xs font-medium text-gray-400 uppercase">{lead.status}</span>
                </div>
                <button 
                  onClick={() => deleteLead(lead.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="font-bold text-white text-lg truncate">{lead.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-gray-400 mt-1 mb-4">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{lead.address}</span>
              </div>

              <div className="bg-white/5 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Territory</span>
                  <span className="text-blue-300 font-medium">{lead.territory}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Unit</span>
                  <span className="text-gray-300">{lead.unitModel || "Unknown"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Risk Score</span>
                  <span className="text-white font-mono">{lead.riskScore}</span>
                </div>
              </div>
            </div>
          ))}
          
          {filteredLeads?.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-white/10 rounded-xl">
              <p className="text-gray-500">No leads found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
