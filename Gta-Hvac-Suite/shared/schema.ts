import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("admin"),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").default("My HVAC Company"),
  logoUrl: text("logo_url"),
  theme: text("theme").default("navy"), // 'navy' or 'light'
  currency: text("currency").default("CAD"),
  truckRollCost: integer("truck_roll_cost").default(250),
  energyWasteCost: integer("energy_waste_cost").default(1200),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  territory: text("territory").notNull(), // 'Vaughan-East', 'Scarborough-South', 'Etobicoke-Central', 'Downtown Core'
  unitModel: text("unit_model"),
  riskScore: integer("risk_score").default(0),
  predictedFailure: text("predicted_failure"),
  status: text("status").default("New"), // 'New', 'Contacted', 'Service Scheduled'
  lastContact: timestamp("last_contact"),
});

export const grants = pgTable("grants", {
  id: serial("id").primaryKey(),
  programName: text("program_name").notNull(),
  description: text("description"),
  eligibleCount: integer("eligible_count").default(0),
  activeCount: integer("active_count").default(0),
  avgGrantValue: integer("avg_grant_value").default(0),
});

export const insertUserSchema = createInsertSchema(users);
export const insertSettingsSchema = createInsertSchema(settings);
export const insertLeadSchema = createInsertSchema(leads);
export const insertGrantSchema = createInsertSchema(grants);

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Grant = typeof grants.$inferSelect;
export type InsertGrant = z.infer<typeof insertGrantSchema>;

export const TERRITORIES = [
  "Vaughan-East",
  "Scarborough-South",
  "Etobicoke-Central",
  "Downtown Core",
] as const;
