/**
 * src/lib/api.ts — WebinX Frontend API Layer
 * Full TypeScript, async/await, in-memory caching, error handling.
 */

const API_BASE =
  (import.meta as any).env?.VITE_API_BASE ?? "https://webinx-backend.onrender.com";

const CACHE_TTL_MS = 60_000;

const _cache = new Map<string, { data: unknown; ts: number }>();

function cacheGet<T>(key: string): T | null {
  const entry = _cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    _cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function cacheSet(key: string, data: unknown): void {
  _cache.set(key, { data, ts: Date.now() });
}

// ── Types ──────────────────────────────────────────────────────────
export interface WebinarEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  host_name: string;
  start_time: string | null;
  end_time: string | null;
  event_url: string;
  registration_url: string;
  url: string;
  tags: string[];
  sub_sector: string;
  relevance_score: number;
  quality_score: number;
  is_featured: boolean;
  is_sponsored: boolean;
  sponsor_name: string;
  sponsor_url: string;
  sponsor_cta: string;
  intent_label: string;
  sector_name: string;
  sector_slug: string;
  category_name: string;
  category_slug: string;
  source_name: string;
  click_count: number;
  view_count: number;
}

export interface Sector {
  id: string;
  name: string;
  slug: string;
  event_count: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface PlatformStats {
  total_events: number;
  upcoming_events: number;
  this_week: number;
  sectors: number;
  categories: number;
  hosts: number;
}

export interface EventsFilter {
  sector?: string;
  q?: string;
  category?: string;
  limit?: number;
  offset?: number;
}

export interface LeadPayload {
  email: string;
  name?: string;
  event_slug?: string;
  utm_source?: string;
  utm_medium?: string;
}

// ── Normalize ──────────────────────────────────────────────────────
function normalizeEvent(e: Record<string, unknown>): WebinarEvent {
  return {
    id:               String(e.id ?? ""),
    slug:             String(e.slug ?? ""),
    title:            String(e.title ?? "Untitled"),
    description:      String(e.description ?? ""),
    host_name:        String(e.host_name ?? ""),
    start_time:       (e.start_time as string) ?? null,
    end_time:         (e.end_time as string) ?? null,
    event_url:        String(e.event_url ?? ""),
    registration_url: String(e.registration_url ?? ""),
    url:              String(e.url ?? e.registration_url ?? e.event_url ?? "#"),
    tags:             Array.isArray(e.tags) ? (e.tags as string[]) : [],
    sub_sector:       String(e.sub_sector ?? ""),
    relevance_score:  Number(e.relevance_score ?? 0),
    quality_score:    Number(e.quality_score ?? 0),
    is_featured:      Boolean(e.is_featured),
    is_sponsored:     Boolean(e.is_sponsored),
    sponsor_name:     String(e.sponsor_name ?? ""),
    sponsor_url:      String(e.sponsor_url ?? ""),
    sponsor_cta:      String(e.sponsor_cta ?? "Register Now"),
    intent_label:     String(e.intent_label ?? "learn"),
    sector_name:      String(e.sector_name ?? "General"),
    sector_slug:      String(e.sector_slug ?? ""),
    category_name:    String(e.category_name ?? ""),
    category_slug:    String(e.category_slug ?? ""),
    source_name:      String(e.source_name ?? ""),
    click_count:      Number(e.click_count ?? 0),
    view_count:       Number(e.view_count ?? 0),
  };
}

// ── Core fetch with retry + timeout ───────────────────────────────
async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  retries = 3
): Promise<T | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(options?.headers ?? {}),
        },
      });
      clearTimeout(timer);
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`[WebinX] ${path} → HTTP ${res.status}`, text.slice(0, 200));
        return null;
      }
      return (await res.json()) as T;
    } catch (err) {
      clearTimeout(timer);
      const isLast = attempt === retries - 1;
      if (!isLast) {
        await new Promise((r) => setTimeout(r, 1_000 * (attempt + 1)));
        console.warn(`[WebinX] ${path} attempt ${attempt + 1} failed, retrying…`);
        continue;
      }
      console.error(`[WebinX] ${path} failed after ${retries} attempts:`, err);
      return null;
    }
  }
  return null;
}

// ── Events ────────────────────────────────────────────────────────
export async function getEvents(
  filterOrSector: EventsFilter | string = {},
  legacyLimit = 24,
  legacyOffset = 0
): Promise<WebinarEvent[]> {
  const filter: EventsFilter =
    typeof filterOrSector === "string"
      ? { sector: filterOrSector, limit: legacyLimit, offset: legacyOffset }
      : filterOrSector;

  const params = new URLSearchParams();
  if (filter.sector)   params.set("sector",   filter.sector);
  if (filter.q)        params.set("q",        filter.q);
  if (filter.category) params.set("category", filter.category);
  params.set("limit",  String(filter.limit  ?? 24));
  params.set("offset", String(filter.offset ?? 0));

  const qs = params.toString();
  const cacheKey = `events:${qs}`;
  const cached = cacheGet<WebinarEvent[]>(cacheKey);
  if (cached) return cached;

  const data = await apiFetch<unknown[]>(`/api/events?${qs}`);
  if (!Array.isArray(data)) return [];

  const result = data
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .filter((e) => e.slug && e.title)
    .map(normalizeEvent);

  cacheSet(cacheKey, result);
  return result;
}

export async function getEventBySlug(slug: string): Promise<WebinarEvent | null> {
  if (!slug) return null;
  const cacheKey = `event:${slug}`;
  const cached = cacheGet<WebinarEvent>(cacheKey);
  if (cached) return cached;

  const data = await apiFetch<Record<string, unknown>>(
    `/api/events/${encodeURIComponent(slug)}`
  );
  if (!data?.title) return null;

  const result = normalizeEvent(data);
  cacheSet(cacheKey, result);
  return result;
}

// Trending: backend route now exists; frontend fallback kept as safety net
export async function getTrendingEvents(limit = 9): Promise<WebinarEvent[]> {
  const cacheKey = `trending:${limit}`;
  const cached = cacheGet<WebinarEvent[]>(cacheKey);
  if (cached) return cached;

  // Try proper endpoint first
  let data = await apiFetch<unknown[]>(`/api/events/trending?limit=${limit}`);

  // Fallback: if endpoint missing/broken, use /api/events sorted by relevance
  if (!Array.isArray(data) || data.length === 0) {
    data = await apiFetch<unknown[]>(`/api/events?limit=${limit * 2}`);
    if (!Array.isArray(data)) return [];
    const result = data
      .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
      .map(normalizeEvent)
      .sort((a, b) => b.relevance_score - a.relevance_score)
      .slice(0, limit);
    cacheSet(cacheKey, result);
    return result;
  }

  const result = data
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map(normalizeEvent);
  cacheSet(cacheKey, result);
  return result;
}

// Featured: backend route now exists; frontend fallback kept as safety net
export async function getFeaturedEvents(limit = 6): Promise<WebinarEvent[]> {
  const cacheKey = `featured:${limit}`;
  const cached = cacheGet<WebinarEvent[]>(cacheKey);
  if (cached) return cached;

  let data = await apiFetch<unknown[]>(`/api/events/featured?limit=${limit}`);

  if (!Array.isArray(data) || data.length === 0) {
    data = await apiFetch<unknown[]>(`/api/events?limit=${limit * 2}`);
    if (!Array.isArray(data)) return [];
    const result = data
      .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
      .map(normalizeEvent)
      .filter((e) => e.is_featured || e.relevance_score >= 2)
      .slice(0, limit);
    cacheSet(cacheKey, result);
    return result;
  }

  const result = data
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map(normalizeEvent);
  cacheSet(cacheKey, result);
  return result;
}

export async function getRelatedEvents(
  slug: string,
  sector: string,
  limit = 4
): Promise<WebinarEvent[]> {
  const params = new URLSearchParams({ slug, sector, limit: String(limit) });
  const data = await apiFetch<unknown[]>(`/api/related?${params}`);
  if (!Array.isArray(data)) return [];
  return data
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map(normalizeEvent);
}

export async function searchEvents(q: string, limit = 20): Promise<WebinarEvent[]> {
  if (!q || q.length < 2) return [];
  const params = new URLSearchParams({ q, limit: String(limit) });
  const data = await apiFetch<unknown[]>(`/api/search?${params}`);
  if (!Array.isArray(data)) return [];
  return data
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map(normalizeEvent);
}

export async function getSectors(): Promise<Sector[]> {
  const cached = cacheGet<Sector[]>("sectors");
  if (cached) return cached;
  const data = await apiFetch<Sector[]>("/api/sectors");
  const result = Array.isArray(data) ? data : [];
  cacheSet("sectors", result);
  return result;
}

export async function getCategories(): Promise<Category[]> {
  const cached = cacheGet<Category[]>("categories");
  if (cached) return cached;
  const data = await apiFetch<Category[]>("/api/categories");
  const result = Array.isArray(data) ? data : [];
  cacheSet("categories", result);
  return result;
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const fallback: PlatformStats = {
    total_events: 500, upcoming_events: 120,
    this_week: 30, sectors: 10, categories: 20, hosts: 200,
  };
  const cached = cacheGet<PlatformStats>("stats");
  if (cached) return cached;
  const data = await apiFetch<PlatformStats>("/api/stats");
  if (!data || typeof data !== "object") return fallback;
  const result: PlatformStats = {
    total_events:    Number(data.total_events    ?? fallback.total_events),
    upcoming_events: Number(data.upcoming_events ?? fallback.upcoming_events),
    this_week:       Number(data.this_week       ?? fallback.this_week),
    sectors:         Number(data.sectors         ?? fallback.sectors),
    categories:      Number(data.categories      ?? fallback.categories),
    hosts:           Number(data.hosts           ?? fallback.hosts),
  };
  cacheSet("stats", result);
  return result;
}

export async function getHost(slug: string) {
  return apiFetch<{ host: Record<string, unknown> }>(
    `/api/hosts/${encodeURIComponent(slug)}`
  );
}

export async function getHostEvents(slug: string): Promise<WebinarEvent[]> {
  const data = await apiFetch<{ events: unknown[] }>(
    `/api/hosts/${encodeURIComponent(slug)}/events`
  );
  if (!data?.events || !Array.isArray(data.events)) return [];
  return data.events
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map(normalizeEvent);
}

export async function captureLead(
  payload: LeadPayload
): Promise<{ status: "ok" | "error"; message: string }> {
  const data = await apiFetch<{ status: string; message: string }>("/api/leads", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data
    ? { status: "ok", message: data.message ?? "Subscribed!" }
    : { status: "error", message: "Failed to subscribe. Please try again." };
}

export async function trackSponsorClick(slug: string): Promise<string | null> {
  const data = await apiFetch<{ url: string }>(`/api/sponsor/click/${slug}`, {
    method: "POST",
  });
  return data?.url ?? null;
}

// ── Date utils ─────────────────────────────────────────────────────
export function formatEventDate(isoString: string | null | undefined): string {
  if (!isoString) return "Date TBA";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Date TBA";
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric", month: "short", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  } catch { return "Date TBA"; }
}

export function formatShortDate(isoString: string | null | undefined): string {
  if (!isoString) return "TBA";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "TBA";
    return d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata", day: "numeric", month: "short",
    });
  } catch { return "TBA"; }
}

export function isUpcoming(isoString: string | null | undefined): boolean {
  if (!isoString) return false;
  try { return new Date(isoString) >= new Date(); } catch { return false; }
}

export function daysUntil(isoString: string | null | undefined): number | null {
  if (!isoString) return null;
  try {
    const diff = new Date(isoString).getTime() - Date.now();
    if (diff < 0) return null;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch { return null; }
}
