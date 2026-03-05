import { randomUUID } from "crypto";
import type {
  Host, Webinar, Registration, WebinarWithHost,
  InsertHost, InsertWebinar, InsertRegistration,
} from "@shared/schema";

export interface IStorage {
  getHosts(): Promise<Host[]>;
  getHost(id: string): Promise<Host | undefined>;
  createHost(host: InsertHost): Promise<Host>;

  getWebinars(filters?: { category?: string; sector?: string; date?: string; search?: string }): Promise<WebinarWithHost[]>;
  getWebinar(id: string): Promise<WebinarWithHost | undefined>;
  getTrendingWebinars(): Promise<WebinarWithHost[]>;
  getUpcomingWebinars(): Promise<WebinarWithHost[]>;
  getWebinarsByHost(hostId: string): Promise<WebinarWithHost[]>;
  createWebinar(webinar: InsertWebinar): Promise<Webinar>;

  getRegistration(webinarId: string, email: string): Promise<Registration | undefined>;
  createRegistration(reg: InsertRegistration): Promise<Registration>;
  getRegistrationCount(webinarId: string): Promise<number>;
}

export class MemStorage implements IStorage {
  private hosts: Map<string, Host> = new Map();
  private webinars: Map<string, Webinar> = new Map();
  private registrations: Map<string, Registration> = new Map();

  private resolveWithHost(webinar: Webinar): WebinarWithHost {
    const host = this.hosts.get(webinar.hostId)!;
    return { ...webinar, host };
  }

  async getHosts(): Promise<Host[]> {
    return Array.from(this.hosts.values());
  }

  async getHost(id: string): Promise<Host | undefined> {
    return this.hosts.get(id);
  }

  async createHost(insertHost: InsertHost): Promise<Host> {
    const id = randomUUID();
    const host: Host = { ...insertHost, id, website: insertHost.website ?? null };
    this.hosts.set(id, host);
    return host;
  }

  async getWebinars(filters?: { category?: string; sector?: string; date?: string; search?: string }): Promise<WebinarWithHost[]> {
    let list = Array.from(this.webinars.values());

    if (filters?.category && filters.category !== "All") {
      list = list.filter(w => w.category === filters.category);
    }
    if (filters?.sector && filters.sector !== "All") {
      list = list.filter(w => w.sector === filters.sector);
    }
    if (filters?.date) {
      const now = new Date();
      if (filters.date === "today") {
        const today = now.toISOString().split("T")[0];
        list = list.filter(w => w.date.startsWith(today));
      } else if (filters.date === "this_week") {
        const week = new Date(now);
        week.setDate(now.getDate() + 7);
        list = list.filter(w => new Date(w.date) <= week);
      } else if (filters.date === "this_month") {
        const month = new Date(now);
        month.setMonth(now.getMonth() + 1);
        list = list.filter(w => new Date(w.date) <= month);
      }
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return list.map(w => this.resolveWithHost(w));
  }

  async getWebinar(id: string): Promise<WebinarWithHost | undefined> {
    const w = this.webinars.get(id);
    if (!w) return undefined;
    return this.resolveWithHost(w);
  }

  async getTrendingWebinars(): Promise<WebinarWithHost[]> {
    return Array.from(this.webinars.values())
      .filter(w => w.isTrending)
      .sort((a, b) => b.attendees - a.attendees)
      .map(w => this.resolveWithHost(w));
  }

  async getUpcomingWebinars(): Promise<WebinarWithHost[]> {
    const now = new Date();
    return Array.from(this.webinars.values())
      .filter(w => w.isUpcoming && new Date(w.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 8)
      .map(w => this.resolveWithHost(w));
  }

  async getWebinarsByHost(hostId: string): Promise<WebinarWithHost[]> {
    return Array.from(this.webinars.values())
      .filter(w => w.hostId === hostId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(w => this.resolveWithHost(w));
  }

  async createWebinar(insertWebinar: InsertWebinar): Promise<Webinar> {
    const id = randomUUID();
    const webinar: Webinar = {
      ...insertWebinar,
      id,
      attendees: insertWebinar.attendees ?? 0,
      maxAttendees: insertWebinar.maxAttendees ?? 500,
      isTrending: insertWebinar.isTrending ?? false,
      isUpcoming: insertWebinar.isUpcoming ?? true,
      isFree: insertWebinar.isFree ?? true,
      price: insertWebinar.price ?? 0,
      tags: insertWebinar.tags ?? [],
    };
    this.webinars.set(id, webinar);
    return webinar;
  }

  async getRegistration(webinarId: string, email: string): Promise<Registration | undefined> {
    return Array.from(this.registrations.values()).find(
      r => r.webinarId === webinarId && r.email === email
    );
  }

  async createRegistration(reg: InsertRegistration): Promise<Registration> {
    const id = randomUUID();
    const registration: Registration = {
      ...reg,
      id,
      registeredAt: new Date().toISOString(),
    };
    this.registrations.set(id, registration);
    return registration;
  }

  async getRegistrationCount(webinarId: string): Promise<number> {
    return Array.from(this.registrations.values()).filter(r => r.webinarId === webinarId).length;
  }
}

export const storage = new MemStorage();

async function seed() {
  const existing = await storage.getHosts();
  if (existing.length > 0) return;

  const h1 = await storage.createHost({
    name: "Dr. Sarah Chen",
    bio: "AI researcher and former Google Brain engineer with 12 years of experience building large-scale machine learning systems. Author of 'Practical Deep Learning' and regular keynote speaker at NeurIPS.",
    avatar: "/images/host-sarah.jpg",
    company: "OpenMind Labs",
    role: "Chief AI Officer",
    expertise: ["Machine Learning", "LLMs", "Computer Vision"],
    followers: 48200,
    website: "https://sarahchen.ai",
  });

  const h2 = await storage.createHost({
    name: "Marcus Rivera",
    bio: "Serial entrepreneur and growth strategist who has scaled 4 startups from zero to exit. Partner at Velocity Ventures and Forbes 30 Under 30 alumnus. Specializes in go-to-market strategy and B2B SaaS.",
    avatar: "/images/host-marcus.jpg",
    company: "Velocity Ventures",
    role: "Partner & Growth Strategist",
    expertise: ["SaaS Growth", "GTM Strategy", "Fundraising"],
    followers: 31500,
    website: "https://marcusrivera.co",
  });

  const h3 = await storage.createHost({
    name: "Priya Nair",
    bio: "UX designer and design systems architect with experience at Figma, Shopify, and Airbnb. Creator of the DesignTokens open-source library with 12k GitHub stars. Speaker at Config and Awwwards.",
    avatar: "/images/host-priya.jpg",
    company: "DesignCraft Studio",
    role: "Principal Designer",
    expertise: ["UX Design", "Design Systems", "Figma"],
    followers: 22800,
    website: "https://priyanair.design",
  });

  const h4 = await storage.createHost({
    name: "James Okonkwo",
    bio: "Former Goldman Sachs VP and fintech founder. Built and sold two fintech companies. Now helping finance teams leverage AI and automation to reduce overhead and improve forecasting accuracy.",
    avatar: "/images/host-james.jpg",
    company: "FinFlow Advisors",
    role: "CEO & Fintech Advisor",
    expertise: ["FinTech", "Financial Modeling", "AI in Finance"],
    followers: 19400,
    website: "https://jamesokonkwo.com",
  });

  const h5 = await storage.createHost({
    name: "Aisha Thompson",
    bio: "Marketing thought leader, author of 'Zero to Viral', and founder of Growth Lab. Has led marketing at 3 unicorn startups. Expert in content-led growth, community building, and performance marketing.",
    avatar: "/images/host-aisha.jpg",
    company: "Growth Lab",
    role: "Founder & CMO",
    expertise: ["Content Marketing", "Community Growth", "Brand Strategy"],
    followers: 56700,
    website: "https://aishaT.marketing",
  });

  const now = new Date();
  const d = (daysFromNow: number, hour = 14): string => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() + daysFromNow);
    dt.setHours(hour, 0, 0, 0);
    return dt.toISOString();
  };

  await storage.createWebinar({
    title: "Building Production-Ready LLM Applications in 2026",
    description: "Dive deep into the architecture patterns, evaluation strategies, and deployment best practices for large language model applications. We'll cover RAG pipelines, fine-tuning trade-offs, cost optimization, and real-world case studies from companies that have successfully shipped LLM products to millions of users.",
    hostId: h1.id,
    category: "AI & Machine Learning",
    sector: "SaaS",
    date: d(2),
    duration: 90,
    attendees: 3240,
    maxAttendees: 5000,
    imageUrl: "/images/webinar-llm.jpg",
    isTrending: true,
    isUpcoming: true,
    isFree: true,
    price: 0,
    tags: ["LLMs", "Production", "RAG", "Architecture"],
  });

  await storage.createWebinar({
    title: "From 0 to $1M ARR: A SaaS Playbook",
    description: "Marcus shares the exact growth playbook he's used across 4 successful SaaS startups to hit the first million in ARR. Topics include ICP definition, pricing strategy, sales motion, and the metrics that actually matter at each growth stage.",
    hostId: h2.id,
    category: "Entrepreneurship",
    sector: "SaaS",
    date: d(3),
    duration: 60,
    attendees: 2180,
    maxAttendees: 3000,
    imageUrl: "/images/webinar-saas.jpg",
    isTrending: true,
    isUpcoming: true,
    isFree: true,
    price: 0,
    tags: ["SaaS", "Growth", "ARR", "Startup"],
  });

  await storage.createWebinar({
    title: "Design Systems at Scale: Lessons from the Trenches",
    description: "Building a design system that scales across multiple product teams is one of the hardest challenges in modern product organizations. Priya covers governance models, token architecture, versioning strategies, and how to get engineers to actually use the components you build.",
    hostId: h3.id,
    category: "Design",
    sector: "SaaS",
    date: d(5),
    duration: 75,
    attendees: 1560,
    maxAttendees: 2000,
    imageUrl: "/images/webinar-design.jpg",
    isTrending: true,
    isUpcoming: true,
    isFree: false,
    price: 29,
    tags: ["Design Systems", "Tokens", "Figma", "Components"],
  });

  await storage.createWebinar({
    title: "AI-Powered Financial Forecasting for CFOs",
    description: "Learn how leading finance teams are using machine learning to improve forecast accuracy by 40-60%. James walks through practical implementations using tools your team already has, including Excel add-ins, Python notebooks, and enterprise BI platforms.",
    hostId: h4.id,
    category: "Finance",
    sector: "Finance",
    date: d(7),
    duration: 60,
    attendees: 980,
    maxAttendees: 1500,
    imageUrl: "/images/webinar-finance.jpg",
    isTrending: false,
    isUpcoming: true,
    isFree: false,
    price: 49,
    tags: ["Finance", "AI", "Forecasting", "CFO"],
  });

  await storage.createWebinar({
    title: "Content-Led Growth: Building a Community That Sells for You",
    description: "The best marketing in 2026 doesn't feel like marketing. Aisha breaks down the exact framework she uses to build brand communities that generate 40% of pipeline for her clients. Includes case studies, content calendars, and the metrics you should obsess over.",
    hostId: h5.id,
    category: "Marketing",
    sector: "SaaS",
    date: d(4),
    duration: 60,
    attendees: 4100,
    maxAttendees: 5000,
    imageUrl: "/images/webinar-marketing.jpg",
    isTrending: true,
    isUpcoming: true,
    isFree: true,
    price: 0,
    tags: ["Content", "Community", "Growth", "B2B"],
  });

  await storage.createWebinar({
    title: "Mastering Multi-Agent AI Systems",
    description: "Go beyond simple chatbots and learn to architect multi-agent systems that collaborate to solve complex problems. Dr. Chen covers orchestration patterns, memory architectures, tool use, and debugging strategies for autonomous AI workflows.",
    hostId: h1.id,
    category: "AI & Machine Learning",
    sector: "SaaS",
    date: d(10),
    duration: 120,
    attendees: 2890,
    maxAttendees: 4000,
    imageUrl: "/images/webinar-agents.jpg",
    isTrending: true,
    isUpcoming: true,
    isFree: true,
    price: 0,
    tags: ["AI Agents", "LLMs", "Automation", "Architecture"],
  });

  await storage.createWebinar({
    title: "Raising Your Series A in a Tough Market",
    description: "The fundraising landscape has changed dramatically. Marcus shares what investors are actually looking for in 2026, how to craft a compelling narrative, and the common mistakes that kill term sheets. Includes a live Q&A with two active seed-stage investors.",
    hostId: h2.id,
    category: "Entrepreneurship",
    sector: "SaaS",
    date: d(14),
    duration: 90,
    attendees: 1750,
    maxAttendees: 2500,
    imageUrl: "/images/webinar-fundraising.jpg",
    isTrending: false,
    isUpcoming: true,
    isFree: true,
    price: 0,
    tags: ["Fundraising", "Series A", "VC", "Pitch"],
  });

  await storage.createWebinar({
    title: "Product Marketing Fundamentals for PMMs",
    description: "Whether you're a new PMM or a seasoned marketer transitioning into product marketing, this webinar covers everything: positioning, messaging, launch playbooks, and how to build a win-loss program that actually informs your roadmap.",
    hostId: h5.id,
    category: "Marketing",
    sector: "SaaS",
    date: d(6),
    duration: 75,
    attendees: 1320,
    maxAttendees: 2000,
    imageUrl: "/images/webinar-pmm.jpg",
    isTrending: false,
    isUpcoming: true,
    isFree: false,
    price: 39,
    tags: ["PMM", "Positioning", "Launch", "Messaging"],
  });

  await storage.createWebinar({
    title: "Leadership in the Age of Remote & Hybrid Teams",
    description: "Managing distributed teams requires a fundamentally different playbook. Aisha shares research-backed frameworks for building trust, maintaining accountability, and fostering a culture of belonging when your team spans multiple time zones and working styles.",
    hostId: h5.id,
    category: "Leadership",
    sector: "SaaS",
    date: d(12),
    duration: 60,
    attendees: 2200,
    maxAttendees: 3000,
    imageUrl: "/images/webinar-leadership.jpg",
    isTrending: false,
    isUpcoming: true,
    isFree: true,
    price: 0,
    tags: ["Leadership", "Remote Work", "Culture", "Management"],
  });

  await storage.createWebinar({
    title: "Data-Driven UX: Combining Analytics with User Research",
    description: "Stop guessing what users want. Priya shows how to build a mixed-methods research practice that combines quantitative analytics (Mixpanel, Amplitude) with qualitative research (interviews, usability testing) to make design decisions with confidence.",
    hostId: h3.id,
    category: "Design",
    sector: "SaaS",
    date: d(9),
    duration: 60,
    attendees: 890,
    maxAttendees: 1500,
    imageUrl: "/images/webinar-ux.jpg",
    isTrending: false,
    isUpcoming: true,
    isFree: false,
    price: 29,
    tags: ["UX Research", "Analytics", "Data", "Design"],
  });
}

seed().catch(console.error);
