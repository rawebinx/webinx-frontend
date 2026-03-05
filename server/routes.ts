import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";

const EXTERNAL_API = "https://webinx-backend.onrender.com/api";

async function fetchExternal(path: string) {
  const res = await fetch(`${EXTERNAL_API}${path}`, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`External API ${path} → ${res.status}`);
  return res.json();
}

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {
  app.get("/api/external/events", async (_req, res) => {
    try {
      const data = await fetchExternal("/events");
      res.json(data);
    } catch (err: any) {
      console.error("External /events failed:", err.message);
      res.status(502).json({ error: "Failed to fetch external events", detail: err.message });
    }
  });

  app.get("/api/external/events/:slug", async (req, res) => {
    try {
      const data = await fetchExternal(`/events/${req.params.slug}`);
      res.json(data);
    } catch (err: any) {
      res.status(502).json({ error: "Failed to fetch event", detail: err.message });
    }
  });

  app.get("/api/webinars", async (req, res) => {
    const { category, sector, date, search } = req.query;
    const webinars = await storage.getWebinars({
      category: category as string,
      sector: sector as string,
      date: date as string,
      search: search as string,
    });
    res.json(webinars);
  });

  app.get("/api/webinars/trending", async (_req, res) => {
    const webinars = await storage.getTrendingWebinars();
    res.json(webinars);
  });

  app.get("/api/webinars/upcoming", async (_req, res) => {
    const webinars = await storage.getUpcomingWebinars();
    res.json(webinars);
  });

  app.get("/api/webinars/:id", async (req, res) => {
    const webinar = await storage.getWebinar(req.params.id);
    if (!webinar) return res.status(404).json({ error: "Not found" });
    const regCount = await storage.getRegistrationCount(req.params.id);
    res.json({ ...webinar, registrationCount: regCount });
  });

  app.get("/api/hosts", async (_req, res) => {
    const hosts = await storage.getHosts();
    res.json(hosts);
  });

  app.get("/api/hosts/:id", async (req, res) => {
    const host = await storage.getHost(req.params.id);
    if (!host) return res.status(404).json({ error: "Not found" });
    res.json(host);
  });

  app.get("/api/hosts/:id/webinars", async (req, res) => {
    const webinars = await storage.getWebinarsByHost(req.params.id);
    res.json(webinars);
  });

  app.post("/api/webinars/:id/register", async (req, res) => {
    const parsed = insertRegistrationSchema.safeParse({
      ...req.body,
      webinarId: req.params.id,
    });
    if (!parsed.success) return res.status(400).json({ error: parsed.error });

    const existing = await storage.getRegistration(req.params.id, parsed.data.email);
    if (existing) return res.status(409).json({ error: "Already registered" });

    const reg = await storage.createRegistration(parsed.data);
    res.json(reg);
  });

  return httpServer;
}
