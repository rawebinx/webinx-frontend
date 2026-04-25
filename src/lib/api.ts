// src/lib/api.ts
// WebinX — Complete API Layer — ALL exports, NO missing symbols

// ─── Constants ────────────────────────────────────────────────────────────────

export const API_BASE =
  (import.meta as Record<string, unknown> & { env: Record<string, string> }).env.VITE_API_BASE ??
  'https://webinx-backend.onrender.com';

const CACHE_TTL = 60_000;
const FETCH_TIMEOUT = 20_000;
const MAX_RETRIES = 3;

const BLOCKED_HOSTS = new Set([
  'webinx.in', 'www.webinx.in', 'localhost',
  '127.0.0.1', 'example.com', 'example.org',
]);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WebinarEvent {
  id: number;
  slug: string;
  title: string;
  description: string;
  host_name: string;
  host_id?: number | null;
  host_slug?: string | null;
  host_is_verified?: boolean;
  event_url: string | null;
  registration_url: string | null;
  best_registration_url: string | null;
  has_registration: boolean;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  is_featured: boolean;
  is_sponsored: boolean;
  sponsor_name?: string | null;
  sponsor_url?: string | null;
  sponsor_cta?: string | null;
  sector_id?: number | null;
  sector_name?: string | null;
  sector_slug?: string | null;
  category_id?: number | null;
  category_name?: string | null;
  category_slug?: string | null;
  source_name?: string | null;
  tags: string[];
  relevance_score?: number | null;
  quality_score?: number | null;
  view_count: number;
  click_count: number;
  save_count: number;
  intent_label?: string | null;
  sub_sector?: string | null;
  thumbnail_url?: string | null;
  content_type: 'webinar' | 'podcast' | 'live_event';
  episode_number?: number | null;
  duration_minutes?: number | null;
  podcast_series?: string | null;
  spotify_url?: string | null;
  apple_podcasts_url?: string | null;
  venue_name?: string | null;
  venue_address?: string | null;
  venue_city?: string | null;
  is_online?: boolean;
  is_hybrid?: boolean;
  ticket_price_inr?: number | null;
  max_attendees?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface Host {
  id: number;
  name: string;
  slug: string;
  org_name?: string | null;
  bio?: string | null;
  website?: string | null;
  linkedin?: string | null;
  avatar_url?: string | null;
  is_verified: boolean;
  plan_tier?: 'free' | 'pro' | 'scale';
  event_count: number;
  total_views?: number;
  total_saves?: number;
  score?: number;
  rank?: number;
}

export interface PlatformStats {
  total_events: number;
  upcoming_events: number;
  this_week: number;
  sector_count: number;
  category_count: number;
  host_count: number;
}

export interface Sector {
  id: number;
  name: string;
  slug: string;
  event_count: number;
}

export interface EventsResponse {
  events: WebinarEvent[];
  total: number;
  limit: number;
  offset: number;
}

export interface WishlistDemand {
  topic: string;
  demand: number;
  sector_slug?: string | null;
}

export interface PipelineRun {
  id: number;
  run_at: string;
  events_added: number;
  events_updated: number;
  events_skipped: number;
  events_failed: number;
  duration_seconds: number;
  error_summary?: string | null;
}

export interface RewardClaim {
  id: number;
  host_name: string;
  host_email: string;
  mention_type: string;
  webinar_title: string;
  evidence_url: string;
  notes?: string;
  reward_tier: string;
  reward_days: number;
  status: string;
  created_at: string;
}

// ─── URL Guards ───────────────────────────────────────────────────────────────

export function safeExternalUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#' || trimmed === '/') return null;
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.has(hostname)) return null;
    for (const blocked of BLOCKED_HOSTS) {
      if (hostname.endsWith('.' + blocked)) return null;
    }
    return trimmed;
  } catch {
    return null;
  }
}

export function getBestRegistrationUrl(event: {
  registration_url?: string | null;
  event_url?: string | null;
}): string | null {
  return safeExternalUrl(event.registration_url) ?? safeExternalUrl(event.event_url) ?? null;
}

// ─── Normalizer ───────────────────────────────────────────────────────────────

export function normalizeEvent(raw: Record<string, unknown>): WebinarEvent {
  const tags: string[] = Array.isArray(raw.tags)
    ? (raw.tags as string[]).filter(Boolean)
    : typeof raw.tags === 'string'
    ? (() => { try { return JSON.parse(raw.tags as string); } catch { return []; } })()
    : [];

  const regUrl = safeExternalUrl(raw.registration_url as string);
  const evtUrl = safeExternalUrl(raw.event_url as string);
  const bestUrl = regUrl ?? evtUrl ?? null;

  return {
    id: Number(raw.id),
    slug: String(raw.slug ?? ''),
    title: String(raw.title ?? ''),
    description: String(raw.description ?? ''),
    host_name: String(raw.host_name ?? ''),
    host_id: raw.host_id != null ? Number(raw.host_id) : null,
    host_slug: raw.host_slug ? String(raw.host_slug) : null,
    host_is_verified: Boolean(raw.host_is_verified),
    event_url: evtUrl,
    registration_url: regUrl,
    best_registration_url: bestUrl,
    has_registration: bestUrl !== null,
    start_time: String(raw.start_time ?? ''),
    end_time: raw.end_time ? String(raw.end_time) : null,
    is_active: Boolean(raw.is_active ?? true),
    is_featured: Boolean(raw.is_featured),
    is_sponsored: Boolean(raw.is_sponsored),
    sponsor_name: raw.sponsor_name ? String(raw.sponsor_name) : null,
    sponsor_url: safeExternalUrl(raw.sponsor_url as string),
    sponsor_cta: raw.sponsor_cta ? String(raw.sponsor_cta) : null,
    sector_id: raw.sector_id != null ? Number(raw.sector_id) : null,
    sector_name: raw.sector_name ? String(raw.sector_name) : null,
    sector_slug: raw.sector_slug ? String(raw.sector_slug) : null,
    category_id: raw.category_id != null ? Number(raw.category_id) : null,
    category_name: raw.category_name ? String(raw.category_name) : null,
    category_slug: raw.category_slug ? String(raw.category_slug) : null,
    source_name: raw.source_name ? String(raw.source_name) : null,
    tags,
    relevance_score: raw.relevance_score != null ? Number(raw.relevance_score) : null,
    quality_score: raw.quality_score != null ? Number(raw.quality_score) : null,
    view_count: Number(raw.view_count ?? 0),
    click_count: Number(raw.click_count ?? 0),
    save_count: Number(raw.save_count ?? 0),
    intent_label: raw.intent_label ? String(raw.intent_label) : null,
    sub_sector: raw.sub_sector ? String(raw.sub_sector) : null,
    thumbnail_url: raw.thumbnail_url ? String(raw.thumbnail_url) : null,
    content_type: (['webinar', 'podcast', 'live_event'].includes(String(raw.content_type))
      ? String(raw.content_type) : 'webinar') as WebinarEvent['content_type'],
    episode_number: raw.episode_number != null ? Number(raw.episode_number) : null,
    duration_minutes: raw.duration_minutes != null ? Number(raw.duration_minutes) : null,
    podcast_series: raw.podcast_series ? String(raw.podcast_series) : null,
    spotify_url: safeExternalUrl(raw.spotify_url as string),
    apple_podcasts_url: safeExternalUrl(raw.apple_podcasts_url as string),
    venue_name: raw.venue_name ? String(raw.venue_name) : null,
    venue_address: raw.venue_address ? String(raw.venue_address) : null,
    venue_city: raw.venue_city ? String(raw.venue_city) : null,
    is_online: raw.is_online !== false,
    is_hybrid: Boolean(raw.is_hybrid),
    ticket_price_inr: raw.ticket_price_inr != null ? Number(raw.ticket_price_inr) : null,
    max_attendees: raw.max_attendees != null ? Number(raw.max_attendees) : null,
    created_at: raw.created_at ? String(raw.created_at) : undefined,
    updated_at: raw.updated_at ? String(raw.updated_at) : undefined,
  };
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const _cache = new Map<string, { data: unknown; ts: number }>();

function cacheGet<T>(key: string): T | null {
  const e = _cache.get(key);
  if (!e) return null;
  if (Date.now() - e.ts > CACHE_TTL) { _cache.delete(key); return null; }
  return e.data as T;
}

function cacheSet<T>(key: string, data: T): void {
  _cache.set(key, { data, ts: Date.now() });
}

export function cacheClear(prefix?: string): void {
  if (!prefix) { _cache.clear(); return; }
  for (const k of _cache.keys()) if (k.startsWith(prefix)) _cache.delete(k);
}

// ─── Core Fetch ───────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit, skipCache = false): Promise<T> {
  const url = `${API_BASE}${path}`;
  const cacheKey = `${options?.method ?? 'GET'}:${url}`;

  if (!skipCache && (!options?.method || options.method === 'GET')) {
    const cached = cacheGet<T>(cacheKey);
    if (cached !== null) return cached;
  }

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    try {
      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as T;
      if (!options?.method || options.method === 'GET') cacheSet(cacheKey, data);
      return data;
    } catch (err) {
      clearTimeout(timer);
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES - 1) await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  throw lastError ?? new Error('apiFetch failed');
}

// ─── Events ───────────────────────────────────────────────────────────────────

export async function getEvents(params?: {
  q?: string; sector?: string; category?: string; content_type?: string;
  limit?: number; offset?: number; upcoming_only?: boolean;
}): Promise<EventsResponse> {
  const sp = new URLSearchParams();
  if (params?.q) sp.set('q', params.q);
  if (params?.sector) sp.set('sector', params.sector);
  if (params?.category) sp.set('category', params.category);
  if (params?.content_type) sp.set('content_type', params.content_type);
  if (params?.limit != null) sp.set('limit', String(params.limit));
  if (params?.offset != null) sp.set('offset', String(params.offset));
  if (params?.upcoming_only) sp.set('upcoming_only', 'true');
  const qs = sp.toString() ? `?${sp}` : '';
  const raw = await apiFetch<{ events: unknown[]; total: number; limit: number; offset: number }>(`/api/events${qs}`);
  return { events: raw.events.map(e => normalizeEvent(e as Record<string, unknown>)), total: raw.total, limit: raw.limit, offset: raw.offset };
}

export async function getEventBySlug(slug: string): Promise<WebinarEvent> {
  const raw = await apiFetch<Record<string, unknown>>(`/api/events/${slug}`, undefined, true);
  return normalizeEvent(raw);
}

export async function getFeaturedEvents(): Promise<WebinarEvent[]> {
  const raw = await apiFetch<{ events: unknown[] }>('/api/events/featured');
  return raw.events.map(e => normalizeEvent(e as Record<string, unknown>));
}

export async function getTrendingEvents(): Promise<WebinarEvent[]> {
  const raw = await apiFetch<{ events: unknown[] }>('/api/events/trending');
  return raw.events.map(e => normalizeEvent(e as Record<string, unknown>));
}

export async function getRelatedEvents(slug: string, sectorSlug?: string): Promise<WebinarEvent[]> {
  const qs = sectorSlug ? `?sector=${sectorSlug}&exclude=${slug}` : `?exclude=${slug}`;
  const raw = await apiFetch<{ events: unknown[] }>(`/api/related${qs}`);
  return raw.events.map(e => normalizeEvent(e as Record<string, unknown>));
}

export async function searchEvents(q: string): Promise<WebinarEvent[]> {
  const raw = await apiFetch<{ events: unknown[] }>(`/api/search?q=${encodeURIComponent(q)}`);
  return raw.events.map(e => normalizeEvent(e as Record<string, unknown>));
}

export async function aiSearch(q: string): Promise<WebinarEvent[]> {
  const raw = await apiFetch<{ events: unknown[] }>('/api/search/ai', {
    method: 'POST', body: JSON.stringify({ query: q }),
  }, true);
  return raw.events.map(e => normalizeEvent(e as Record<string, unknown>));
}

export async function submitEventForm(data: Record<string, unknown>): Promise<{ status: string; slug?: string }> {
  return apiFetch('/api/events/submit', { method: 'POST', body: JSON.stringify(data) }, true);
}

// ─── Stats + Sectors ──────────────────────────────────────────────────────────

export async function getStats(): Promise<PlatformStats> {
  // Backend may return sectors/hosts OR sector_count/host_count — handle both
  const raw = await apiFetch<Record<string, unknown>>('/api/stats');
  return {
    total_events:    Number(raw.total_events    ?? raw.total       ?? 0),
    upcoming_events: Number(raw.upcoming_events ?? raw.upcoming    ?? 0),
    this_week:       Number(raw.this_week       ?? 0),
    sector_count:    Number(raw.sector_count    ?? raw.sectors     ?? 0),
    category_count:  Number(raw.category_count  ?? raw.categories  ?? 0),
    host_count:      Number(raw.host_count      ?? raw.hosts       ?? 0),
  };
}

export async function getSectors(): Promise<Sector[]> {
  const raw = await apiFetch<{ sectors: unknown[] }>('/api/sectors');
  return raw.sectors as Sector[];
}

export async function getCategories(): Promise<Array<{ id: number; name: string; slug: string }>> {
  const raw = await apiFetch<{ categories: unknown[] }>('/api/categories');
  return raw.categories as Array<{ id: number; name: string; slug: string }>;
}

// ─── Hosts ────────────────────────────────────────────────────────────────────

export async function getHosts(): Promise<Host[]> {
  const raw = await apiFetch<{ hosts: unknown[] }>('/api/hosts');
  return raw.hosts as Host[];
}

export async function getHostBySlug(slug: string): Promise<Host> {
  return apiFetch<Host>(`/api/hosts/${slug}`);
}

export async function getHostEvents(slug: string): Promise<WebinarEvent[]> {
  const raw = await apiFetch<{ events: unknown[] }>(`/api/hosts/${slug}/events`);
  return raw.events.map(e => normalizeEvent(e as Record<string, unknown>));
}

export async function getLeaderboard(): Promise<Host[]> {
  const raw = await apiFetch<{ hosts: unknown[] }>('/api/hosts/leaderboard');
  return raw.hosts as Host[];
}

// ─── City ─────────────────────────────────────────────────────────────────────

export async function getCityEvents(city: string): Promise<WebinarEvent[]> {
  const raw = await apiFetch<{ events: unknown[] }>(`/api/cities/${encodeURIComponent(city)}`);
  return raw.events.map(e => normalizeEvent(e as Record<string, unknown>));
}

// ─── Leads + Alerts ───────────────────────────────────────────────────────────

export async function submitLead(data: {
  email: string; name?: string; event_slug?: string; utm_source?: string; utm_medium?: string;
}): Promise<{ status: string }> {
  return apiFetch('/api/leads', { method: 'POST', body: JSON.stringify(data) }, true);
}

export async function submitAlert(data: {
  email: string; event_slug?: string; topic_query?: string;
}): Promise<{ status: string }> {
  return apiFetch('/api/alerts', { method: 'POST', body: JSON.stringify(data) }, true);
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────

export async function toggleWishlist(
  action: 'save' | 'remove',
  data: { email?: string; event_slug: string; session_id?: string }
): Promise<{ status: string }> {
  return apiFetch('/api/wishlist', {
    method: action === 'save' ? 'POST' : 'DELETE',
    body: JSON.stringify(data),
  }, true);
}

export async function getWishlistDemand(): Promise<WishlistDemand[]> {
  const raw = await apiFetch<{ topics: unknown[] }>('/api/wishlist/demand');
  return raw.topics as WishlistDemand[];
}

export async function saveWishlistTopic(data: {
  email: string; topic_query: string; sector_slug?: string;
}): Promise<{ status: string }> {
  return apiFetch('/api/wishlist/topic', { method: 'POST', body: JSON.stringify(data) }, true);
}

// ─── Sponsor ──────────────────────────────────────────────────────────────────

export async function trackSponsorClick(slug: string): Promise<{ redirect_url: string | null }> {
  return apiFetch(`/api/sponsor/click/${slug}`, { method: 'POST' }, true);
}

// ─── Rewards ─────────────────────────────────────────────────────────────────

export async function claimReward(data: {
  host_name: string; host_email: string; mention_type: string;
  webinar_title: string; evidence_url: string; notes?: string;
}): Promise<{ status: string }> {
  return apiFetch('/api/rewards/claim', { method: 'POST', body: JSON.stringify(data) }, true);
}

// ─── Razorpay ─────────────────────────────────────────────────────────────────

export async function createRazorpayOrder(data: {
  event_slug: string; host_email: string; plan: string;
}): Promise<{ order_id: string; amount: number; currency: string; key_id: string }> {
  return apiFetch('/api/razorpay/create-order', { method: 'POST', body: JSON.stringify(data) }, true);
}

export async function verifyRazorpayPayment(data: {
  razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
}): Promise<{ status: string }> {
  return apiFetch('/api/razorpay/verify', { method: 'POST', body: JSON.stringify(data) }, true);
}

// ─── AI Host Tools ────────────────────────────────────────────────────────────

export async function optimizeTitle(data: { title: string; sector?: string }): Promise<{ titles: string[] }> {
  return apiFetch('/api/tools/optimize-title', { method: 'POST', body: JSON.stringify(data) }, true);
}

export async function enhanceDescription(data: { notes: string; sector?: string }): Promise<{ description: string }> {
  return apiFetch('/api/tools/enhance-description', { method: 'POST', body: JSON.stringify(data) }, true);
}

export async function generateContent(data: {
  title: string; description?: string; type: 'summary' | 'takeaways' | 'blog_intro' | 'meta_desc';
}): Promise<{ content: string }> {
  return apiFetch('/api/tools/generate-content', { method: 'POST', body: JSON.stringify(data) }, true);
}

// ─── Trending Topics ──────────────────────────────────────────────────────────

export async function getTrendingTopics(): Promise<WishlistDemand[]> {
  const raw = await apiFetch<{ topics: unknown[] }>('/api/trending-topics');
  return raw.topics as WishlistDemand[];
}

// ─── Certificate ─────────────────────────────────────────────────────────────

export async function getCertificate(slug: string): Promise<Record<string, unknown>> {
  return apiFetch(`/api/certificate/${slug}`);
}

// ─── Embed ────────────────────────────────────────────────────────────────────

export async function getEmbedData(hostSlug: string): Promise<Record<string, unknown>> {
  return apiFetch(`/api/embed/${hostSlug}`);
}

// ─── Pipeline ─────────────────────────────────────────────────────────────────

export async function getPipelineStatus(): Promise<PipelineRun[]> {
  const raw = await apiFetch<{ runs: unknown[] }>('/api/pipeline/status');
  return raw.runs as PipelineRun[];
}

// ─── Admin ────────────────────────────────────────────────────────────────────

function adminHeaders(password: string): Record<string, string> {
  return { 'X-Admin-Key': password };
}

export async function getAdminStats(password: string): Promise<Record<string, unknown>> {
  return apiFetch('/api/admin/stats', { headers: adminHeaders(password) }, true);
}

export async function getAdminLeads(password: string): Promise<unknown[]> {
  const raw = await apiFetch<{ leads: unknown[] }>('/api/admin/leads', { headers: adminHeaders(password) }, true);
  return raw.leads;
}

export async function getAdminRewards(password: string): Promise<RewardClaim[]> {
  const raw = await apiFetch<{ rewards: unknown[] }>('/api/admin/rewards', { headers: adminHeaders(password) }, true);
  return raw.rewards as RewardClaim[];
}

export async function approveReward(id: number, password: string): Promise<{ status: string }> {
  return apiFetch(`/api/admin/rewards/${id}/approve`, { method: 'POST', headers: adminHeaders(password) }, true);
}

export async function rejectReward(id: number, password: string): Promise<{ status: string }> {
  return apiFetch(`/api/admin/rewards/${id}/reject`, { method: 'POST', headers: adminHeaders(password) }, true);
}

// ─── Wishlist localStorage ────────────────────────────────────────────────────

const WISHLIST_KEY = 'webinx_wishlist';
const SESSION_KEY = 'webinx_session_id';

export function getSessionId(): string {
  let sid = localStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export function getLocalWishlist(): string[] {
  try { return JSON.parse(localStorage.getItem(WISHLIST_KEY) ?? '[]'); } catch { return []; }
}

export function saveLocalWishlist(slugs: string[]): void {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(slugs));
}

export function isWishlisted(slug: string): boolean {
  return getLocalWishlist().includes(slug);
}

export function toggleLocalWishlist(slug: string): boolean {
  const list = getLocalWishlist();
  const idx = list.indexOf(slug);
  saveLocalWishlist(idx === -1 ? [...list, slug] : list.filter(s => s !== slug));
  return idx === -1;
}

/** Fetch full WebinarEvent objects for all wishlisted slugs */
export async function getWishlistEvents(): Promise<WebinarEvent[]> {
  const slugs = getLocalWishlist();
  if (slugs.length === 0) return [];
  const results = await Promise.allSettled(slugs.map(s => getEventBySlug(s)));
  return results.filter((r): r is PromiseFulfilledResult<WebinarEvent> => r.status === 'fulfilled').map(r => r.value);
}

/** Returns local wishlist slugs (kept for backwards-compat) */
export function getWishlist(): string[] {
  return getLocalWishlist();
}

/** Sync wishlist with backend using email */
export async function syncWishlistEmail(email: string): Promise<{ status: string }> {
  const slugs = getLocalWishlist();
  const session_id = getSessionId();
  const results = await Promise.allSettled(
    slugs.map(slug => toggleWishlist('save', { email, event_slug: slug, session_id }))
  );
  const failed = results.filter(r => r.status === 'rejected').length;
  return { status: failed === 0 ? 'ok' : `synced_with_${failed}_errors` };
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

const IST = 'Asia/Kolkata';

export function formatEventDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      timeZone: IST, day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  } catch { return iso; }
}

export function formatShortDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      timeZone: IST, day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return iso; }
}

export function getCountdownLabel(iso: string): string | null {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const mins = Math.floor((diff % 3_600_000) / 60_000);
  if (days > 0) return `in ${days}d ${hours}h`;
  if (hours > 0) return `in ${hours}h ${mins}m`;
  return `in ${mins}m`;
}

export function buildCalendarUrl(event: WebinarEvent): string {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace('.000', '');
  const start = fmt(event.start_time);
  const end = event.end_time ? fmt(event.end_time) : start;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.description?.slice(0, 300) ?? '')}&location=${encodeURIComponent(event.best_registration_url ?? '')}`;
}

// ─── Sector Config ────────────────────────────────────────────────────────────

export interface SectorConfig {
  slug: string; name: string; emoji: string;
  color: string; bg: string; border: string;
}

export const SECTOR_CONFIG: Record<string, SectorConfig> = {
  ai:         { slug: 'ai',         name: 'AI',          emoji: '🤖', color: '#6366f1', bg: '#eef2ff', border: '#6366f1' },
  technology: { slug: 'technology', name: 'IT & SaaS',   emoji: '☁️', color: '#3b82f6', bg: '#eff6ff', border: '#3b82f6' },
  finance:    { slug: 'finance',    name: 'Finance',     emoji: '💹', color: '#10b981', bg: '#ecfdf5', border: '#10b981' },
  marketing:  { slug: 'marketing',  name: 'Marketing',   emoji: '📣', color: '#f97316', bg: '#fff7ed', border: '#f97316' },
  startup:    { slug: 'startup',    name: 'Startup',     emoji: '🚀', color: '#8b5cf6', bg: '#f5f3ff', border: '#8b5cf6' },
  hr:         { slug: 'hr',         name: 'HR',          emoji: '🤝', color: '#f43f5e', bg: '#fff1f2', border: '#f43f5e' },
  healthcare: { slug: 'healthcare', name: 'Healthcare',  emoji: '🏥', color: '#14b8a6', bg: '#f0fdfa', border: '#14b8a6' },
  education:  { slug: 'education',  name: 'Education',   emoji: '📚', color: '#f59e0b', bg: '#fffbeb', border: '#f59e0b' },
  general:    { slug: 'general',    name: 'General',     emoji: '📋', color: '#6b7280', bg: '#f9fafb', border: '#d1d5db' },
};

export function getSectorConfig(slugOrName?: string | null): SectorConfig {
  if (!slugOrName) return SECTOR_CONFIG.general;
  const key = slugOrName.toLowerCase().replace(/[\s-]+/g, '_');
  return SECTOR_CONFIG[key] ?? SECTOR_CONFIG.general;
}

// ─── Platform Detection ───────────────────────────────────────────────────────

export type PlatformType = 'zoom' | 'gmeet' | 'teams' | 'youtube' | 'webex' | 'other';

export function detectPlatform(url: string | null | undefined): PlatformType {
  if (!url) return 'other';
  const u = url.toLowerCase();
  if (u.includes('zoom.us')) return 'zoom';
  if (u.includes('meet.google')) return 'gmeet';
  if (u.includes('teams.microsoft') || u.includes('teams.live')) return 'teams';
  if (u.includes('youtube.com') || u.includes('youtu.be')) return 'youtube';
  if (u.includes('webex.com')) return 'webex';
  return 'other';
}

export const PLATFORM_LABELS: Record<PlatformType, string> = {
  zoom: 'Zoom', gmeet: 'Google Meet', teams: 'Teams',
  youtube: 'YouTube', webex: 'Webex', other: 'Online',
};

// ─── ALL backwards-compat aliases (never remove these) ───────────────────────

export const getPlatformStats    = getStats;
export const captureLead         = submitLead;
export const addAlert            = submitAlert;
export const subscribeAlert      = submitAlert;
export const getHost             = getHostBySlug;
export const submitEvent         = submitEventForm;
export const submitWebinar       = submitEventForm;
export const addWishlistTopic    = saveWishlistTopic;
export const getWishlistTopics   = getWishlistDemand;
export const claimMentionReward  = claimReward;
export const createOrder         = createRazorpayOrder;
export const verifyPayment       = verifyRazorpayPayment;
export const saveWishlistItem    = (d: { email?: string; event_slug: string; session_id?: string }) =>
  toggleWishlist('save', d);
export const removeWishlistItem  = (d: { email?: string; event_slug: string; session_id?: string }) =>
  toggleWishlist('remove', d);

// ─── Utility helpers (used by embed, seo, and other pages) ───────────────────

export function isUpcoming(isoDate: string): boolean {
  return new Date(isoDate).getTime() > Date.now();
}

export function isPast(isoDate: string): boolean {
  return new Date(isoDate).getTime() <= Date.now();
}

export function isThisWeek(isoDate: string): boolean {
  const diff = new Date(isoDate).getTime() - Date.now();
  return diff > 0 && diff < 7 * 86_400_000;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen).trimEnd() + '…';
}
