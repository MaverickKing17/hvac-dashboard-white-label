import { db } from "./db";
import {
  users, settings, leads, grants,
  type User, type InsertUser,
  type Settings, type InsertSettings,
  type Lead, type InsertLead,
  type Grant, type InsertGrant
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings>;

  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: number, lead: Partial<InsertLead>): Promise<Lead>;
  deleteLead(id: number): Promise<void>;

  getGrants(): Promise<Grant[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSettings(): Promise<Settings | undefined> {
    const [setting] = await db.select().from(settings).limit(1);
    return setting;
  }

  async updateSettings(partialSettings: Partial<InsertSettings>): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set(partialSettings)
        .where(eq(settings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(settings).values(partialSettings).returning();
      return created;
    }
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(insertLead).returning();
    return lead;
  }

  async updateLead(id: number, partialLead: Partial<InsertLead>): Promise<Lead> {
    const [updated] = await db
      .update(leads)
      .set(partialLead)
      .where(eq(leads.id, id))
      .returning();
    return updated;
  }

  async deleteLead(id: number): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getGrants(): Promise<Grant[]> {
    return await db.select().from(grants);
  }

  async seedData() {
    // Seed Settings
    const existingSettings = await this.getSettings();
    if (!existingSettings) {
      await db.insert(settings).values({
        companyName: "Toronto HVAC Solutions",
        truckRollCost: 250,
        energyWasteCost: 1200,
        currency: "CAD",
        theme: "navy"
      });
    }

    // Seed Leads
    const existingLeads = await this.getLeads();
    if (existingLeads.length === 0) {
      await db.insert(leads).values([
        {
          name: "Fairview Mall Complex",
          address: "1800 Sheppard Ave E, North York",
          territory: "Scarborough-South",
          unitModel: "Trane IntelliPak",
          riskScore: 85,
          predictedFailure: "Compressor Vibration",
          status: "New"
        },
        {
          name: "Vaughan Mills Retail",
          address: "1 Bass Pro Mills Dr, Vaughan",
          territory: "Vaughan-East",
          unitModel: "Carrier Weathermaster",
          riskScore: 45,
          predictedFailure: "Belt Tension",
          status: "Service Scheduled"
        },
        {
          name: "Etobicoke General Hospital",
          address: "101 Humber College Blvd, Etobicoke",
          territory: "Etobicoke-Central",
          unitModel: "Lennox Strategos",
          riskScore: 92,
          predictedFailure: "Refrigerant Leak",
          status: "Contacted"
        },
        {
          name: "RBC Plaza",
          address: "200 Bay St, Toronto",
          territory: "Downtown Core",
          unitModel: "Daikin Rebel",
          riskScore: 12,
          predictedFailure: "None",
          status: "New"
        }
      ]);
    }

    // Seed Grants
    const existingGrants = await this.getGrants();
    if (existingGrants.length === 0) {
      await db.insert(grants).values([
        {
          programName: "Enbridge Home Efficiency Rebate",
          description: "Rebates for high-efficiency furnace upgrades",
          eligibleCount: 142,
          activeCount: 28,
          avgGrantValue: 2400
        },
        {
          programName: "Canada Greener Homes Grant",
          description: "Federal grant for heat pump installation",
          eligibleCount: 89,
          activeCount: 15,
          avgGrantValue: 5000
        },
        {
          programName: "IESO Retrofit Program",
          description: "Commercial HVAC controls upgrade incentives",
          eligibleCount: 34,
          activeCount: 8,
          avgGrantValue: 12500
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
