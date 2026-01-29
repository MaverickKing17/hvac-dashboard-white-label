import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register object storage routes
  registerObjectStorageRoutes(app);

  // Settings Routes
  app.get(api.settings.get.path, async (req, res) => {
    const settings = await storage.getSettings();
    // If no settings exist yet (before seed), return defaults or 404 handled by storage?
    // Storage seedData should run on start, so this should exist.
    if (!settings) {
       // Should trigger seed? or just return default structure
       const defaults = { 
         companyName: "Toronto HVAC Solutions",
         truckRollCost: 250, 
         energyWasteCost: 1200,
         currency: "CAD",
         theme: "navy"
       };
       return res.json(defaults);
    }
    res.json(settings);
  });

  app.patch(api.settings.update.path, async (req, res) => {
    try {
      const input = api.settings.update.input.parse(req.body);
      const updated = await storage.updateSettings(input);
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Leads Routes
  app.get(api.leads.list.path, async (req, res) => {
    const leads = await storage.getLeads();
    res.json(leads);
  });

  app.post(api.leads.create.path, async (req, res) => {
    try {
      const input = api.leads.create.input.parse(req.body);
      const lead = await storage.createLead(input);
      res.status(201).json(lead);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.leads.update.path, async (req, res) => {
    try {
      const input = api.leads.update.input.parse(req.body);
      const lead = await storage.updateLead(Number(req.params.id), input);
      res.json(lead);
    } catch (err) {
      // Handle not found?
      throw err;
    }
  });

  app.delete(api.leads.delete.path, async (req, res) => {
    await storage.deleteLead(Number(req.params.id));
    res.status(204).send();
  });

  // Grants Routes
  app.get(api.grants.list.path, async (req, res) => {
    const grants = await storage.getGrants();
    res.json(grants);
  });

  // Weather Route (Mocked for YYZ)
  app.get(api.weather.get.path, async (req, res) => {
    // Mock data based on YYZ (Toronto Pearson)
    // Simulate some variation based on time if we wanted, but static mock is fine for MVP
    res.json({
      temp: -2, // Celsius
      condition: "Partly Cloudy",
      gridLoad: "Moderate",
      hvacImpact: "Heating Demand High"
    });
  });

  // Seed Data
  await storage.seedData();

  return httpServer;
}
