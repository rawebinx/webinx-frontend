import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  CalendarDays,
  TrendingUp,
  LayoutGrid,
  List,
  Loader2,
  Frown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { apiFetch } from '../api';
import WebinarCard from '../components/webinar-card';

interface WebinarEvent {
  id: number | string;
  slug: string;
  title: string;
  host_name?: string;
  start_time?: string;
  sector_slug?: string;
  sector_name?: string;
  event_url?: string;
  registration_url?: string;
  is_featured?: boolean;
  is_verified?: boolean;
  is_sponsored?: boolean;
  sponsor_url?: string;
  sponsor_cta?: string;
  view_count?: number;
  save_count?: number;
  tags?: string[];
  thumbnail_url?: string;
  duration_minutes?: number;
}
interface Sector { id: number | string; name: string; slug: string; event_count?: number; }

/* ─────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────── */
interface FilterState {
  q: string;
  sector: string;
  category: string;
  upcomingOnly: boolean;
  sort: 'relevance' | 'date' | 'trending';
}

const DEFAULT_FILTERS: FilterState = {
  q: '',
  sector: '',
  category: '',
  upcomingOnly: false,
  sort: 'relevance',
};

const PAGE_SIZE = 12;

const SECTOR_COLORS: Record<string, string> = {
  ai: '#6366f1', technology: '#3b82f6', finance: '#10b981',
  marketing: '#f97316', startup: '#8b5cf6', hr: '#f43f5e',
  healthcare: '#14b8a6', education: '#f59e0b',
};

const SECTOR_ICONS: Record<string, string> = {
  ai: '🤖', technology: '💻', finance: '💹', marketing: '📣',
  startup: '🚀', hr: '🤝', healthcare: '🏥', education: '🎓',
};

/* ─────────────────────────────────────────────────────
   Parse query string helper
───────────────────────────────────────────────────── */
function parseSearch(search: string): Partial<FilterState> {
  const p = new URLSearchParams(search.replace(/^\?/, ''));
  return {
    q: p.get('q') ?? '',
    sector: p.get('sector') ?? '',
  };
}

/* ─────────────────────────────────────────────────────
   Skeleton row of cards
───────────────────────────────────────────────────── */
function SkeletonCards({ count = 6 }: { count?: number }): JSX.Element {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="wx-card overflow-hidden">
          <div className="skeleton" style={{ aspectRatio: '16/9', borderRadius: 0 }} />
          <div className="p-4 space-y-3">
            <div className="skeleton h-3 w-1/3 rounded-full" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-4/5" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-8 w-full rounded-lg mt-4" />
          </div>
        </div>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Empty state
───────────────────────────────────────────────────── */
function EmptyState({ query, onClear }: { query: string; onClear: () => void }): JSX.Element {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
        style={{ background: 'var(--wx-teal-pale)', color: 'var(--wx-teal)' }}
      >
        <Frown size={28} strokeWidth={1.5} />
      </div>
      <h3 className="font-semibold text-base mb-2" style={{ color: 'var(--wx-ink)' }}>
        No events found{query ? ` for "${query}"` : ''}
      </h3>
      <p className="text-sm mb-6" style={{ color: 'var(--wx-muted)', maxWidth: 320 }}>
        Try adjusting your filters, or use AI search for smarter results.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={onClear}
          className="text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          style={{ border: '1.5px solid var(--wx-teal)', color: 'var(--wx-teal)', background: 'transparent', cursor: 'pointer' }}
        >
          Clear filters
        </button>
        <a
          href="/ai-search"
          className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg"
          style={{ background: 'var(--wx-teal)', color: '#fff', textDecoration: 'none' }}
        >
          <Sparkles size={14} />
          Try AI Search
          <ArrowRight size={13} />
        </a>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Filter chip
───────────────────────────────────────────────────── */
function FilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}): JSX.Element {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{
        background: 'var(--wx-teal-pale)',
        color: 'var(--wx-teal)',
        border: '1px solid rgba(13,79,107,0.15)',
      }}
    >
      {label}
      <button
        onClick={onRemove}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', display: 'flex' }}
        aria-label={`Remove ${label} filter`}
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   Main page
───────────────────────────────────────────────────── */
export default function WebinarsPage(): JSX.Element {
  const [locationPath] = useLocation();
  const searchString = typeof window !== 'undefined' ? window.location.search : '';

  /* Filters */
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    ...parseSearch(searchString),
  }));
  const [inputValue, setInputValue] = useState<string>(filters.q);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  /* Data */
  const [events, setEvents] = useState<WebinarEvent[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /* Sectors */
  const [sectors, setSectors] = useState<Sector[]>([]);

  /* View */
  const [gridView, setGridView] = useState<true | false>(true);

  /* Debounce ref */
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Load sectors once */
  useEffect(() => {
    apiFetch('/api/sectors')
      .then((res) => setSectors(res as Sector[]))
      .catch(() => {});
  }, []);

  /* Build API params */
  const buildParams = useCallback(
    (f: FilterState, off: number): URLSearchParams => {
      const p = new URLSearchParams();
      if (f.q) p.set('q', f.q);
      if (f.sector) p.set('sector', f.sector);
      if (f.category) p.set('category', f.category);
      if (f.upcomingOnly) p.set('upcoming', 'true');
      if (f.sort === 'trending') p.set('sort', 'trending');
      p.set('limit', String(PAGE_SIZE));
      p.set('offset', String(off));
      return p;
    },
    [],
  );

  /* Fetch */
  const fetchEvents = useCallback(
    async (f: FilterState, off: number, append = false): Promise<void> => {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const endpoint = f.sort === 'trending' ? '/api/events/trending' : '/api/events';
        const params = buildParams(f, off);
        const res = await apiFetch(`${endpoint}?${params.toString()}`) as {
          events?: WebinarEvent[];
          total?: number;
        };
        const incoming = res.events ?? [];
        const newTotal = res.total ?? incoming.length;

        setEvents((prev) => (append ? [...prev, ...incoming] : incoming));
        setTotal(newTotal);
        setOffset(off + incoming.length);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [buildParams],
  );

  /* Refetch when filters change */
  useEffect(() => {
    setEvents([]);
    setOffset(0);
    void fetchEvents(filters, 0, false);
  }, [filters, fetchEvents]);

  /* Sync URL params on mount */
  useEffect(() => {
    const parsed = parseSearch(window.location.search);
    if (parsed.q || parsed.sector) {
      setFilters((f) => ({ ...f, ...parsed }));
      setInputValue(parsed.q ?? '');
    }
  }, []);

  /* Search with debounce */
  const handleSearchChange = useCallback((value: string): void => {
    setInputValue(value);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      setFilters((f) => ({ ...f, q: value }));
    }, 380);
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault();
      if (searchDebounce.current) clearTimeout(searchDebounce.current);
      setFilters((f) => ({ ...f, q: inputValue }));
    },
    [inputValue],
  );

  const clearFilters = useCallback((): void => {
    setFilters(DEFAULT_FILTERS);
    setInputValue('');
  }, []);

  const loadMore = useCallback((): void => {
    void fetchEvents(filters, offset, true);
  }, [fetchEvents, filters, offset]);

  /* Active filter chips */
  const activeChips = useMemo<{ label: string; clear: () => void }[]>(() => {
    const chips: { label: string; clear: () => void }[] = [];
    if (filters.q) chips.push({ label: `"${filters.q}"`, clear: () => setFilters((f) => ({ ...f, q: '' })) });
    if (filters.sector) {
      const sec = sectors.find((s) => s.slug === filters.sector);
      chips.push({
        label: sec?.name ?? filters.sector,
        clear: () => setFilters((f) => ({ ...f, sector: '' })),
      });
    }
    if (filters.upcomingOnly) chips.push({ label: 'Upcoming only', clear: () => setFilters((f) => ({ ...f, upcomingOnly: false })) });
    return chips;
  }, [filters, sectors]);

  const hasMore = events.length < total;

  /* ── Render ── */
  return (
    <>
      <Helmet>
        <title>
          {filters.q
            ? `"${filters.q}" — Webinars | WeBinX`
            : filters.sector
            ? `${filters.sector} Webinars | WeBinX`
            : "Webinars \u00B7 India's Best Knowledge Events | WeBinX"}
        </title>
        <meta
          name="description"
          content="Browse hundreds of free webinars, online courses and knowledge events across AI, finance, marketing, startups and more. India's largest webinar directory."
        />
        <link rel="canonical" href="https://webinx.in/webinars" />
        <meta property="og:title" content="Webinars | WeBinX" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="has-bottom-nav">
        {/* ─── Page header ─── */}
        <div
          className="sticky top-16 z-40 w-full"
          style={{
            background: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--wx-border)',
          }}
        >
          <div className="wx-container py-3">
            {/* Search + controls row */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              {/* Search input */}
              <div
                className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl"
                style={{
                  background: 'var(--wx-surface)',
                  border: '1.5px solid var(--wx-border)',
                  minWidth: 0,
                }}
              >
                <Search size={15} style={{ color: 'var(--wx-muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search webinars, topics, hosts…"
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: 'var(--wx-ink)', fontFamily: 'var(--font-sans)', minWidth: 0 }}
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => { setInputValue(''); setFilters((f) => ({ ...f, q: '' })); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--wx-muted)', display: 'flex' }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative hidden sm:block">
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as FilterState['sort'] }))}
                  className="appearance-none pl-3 pr-8 py-2 rounded-xl text-sm font-medium cursor-pointer outline-none"
                  style={{
                    background: 'var(--wx-surface)',
                    border: '1.5px solid var(--wx-border)',
                    color: 'var(--wx-ink)',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <option value="relevance">Relevant</option>
                  <option value="date">Latest</option>
                  <option value="trending">Trending</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--wx-muted)' }} />
              </div>

              {/* Upcoming toggle */}
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, upcomingOnly: !f.upcomingOnly }))}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: filters.upcomingOnly ? 'var(--wx-teal-pale)' : 'var(--wx-surface)',
                  border: `1.5px solid ${filters.upcomingOnly ? 'rgba(13,79,107,0.25)' : 'var(--wx-border)'}`,
                  color: filters.upcomingOnly ? 'var(--wx-teal)' : 'var(--wx-muted)',
                  cursor: 'pointer',
                }}
              >
                <CalendarDays size={14} />
                <span className="hidden md:inline">Upcoming</span>
              </button>

              {/* Filter toggle (mobile) */}
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium sm:hidden"
                style={{
                  background: showFilters ? 'var(--wx-teal-pale)' : 'var(--wx-surface)',
                  border: `1.5px solid ${showFilters ? 'rgba(13,79,107,0.25)' : 'var(--wx-border)'}`,
                  color: showFilters ? 'var(--wx-teal)' : 'var(--wx-muted)',
                  cursor: 'pointer',
                }}
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeChips.length > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ background: 'var(--wx-teal)', color: '#fff', fontSize: 9 }}
                  >
                    {activeChips.length}
                  </span>
                )}
              </button>

              {/* Grid/List toggle */}
              <div
                className="hidden sm:flex items-center gap-0.5 p-1 rounded-xl"
                style={{ background: 'var(--wx-surface)', border: '1.5px solid var(--wx-border)' }}
              >
                <button
                  type="button"
                  onClick={() => setGridView(true)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: gridView ? 'var(--wx-white)' : 'transparent',
                    color: gridView ? 'var(--wx-teal)' : 'var(--wx-muted)',
                    boxShadow: gridView ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setGridView(false)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{
                    background: !gridView ? 'var(--wx-white)' : 'transparent',
                    color: !gridView ? 'var(--wx-teal)' : 'var(--wx-muted)',
                    boxShadow: !gridView ? 'var(--shadow-sm)' : 'none',
                    cursor: 'pointer',
                    border: 'none',
                  }}
                >
                  <List size={15} />
                </button>
              </div>
            </form>

            {/* Sector pills (desktop) */}
            <div className="hidden sm:flex items-center gap-2 mt-2.5 overflow-x-auto pb-0.5 scroll-smooth">
              <button
                type="button"
                onClick={() => setFilters((f) => ({ ...f, sector: '' }))}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: !filters.sector ? 'var(--wx-teal)' : 'var(--wx-surface)',
                  color: !filters.sector ? '#fff' : 'var(--wx-muted)',
                  border: `1.5px solid ${!filters.sector ? 'var(--wx-teal)' : 'var(--wx-border)'}`,
                  cursor: 'pointer',
                }}
              >
                All Topics
              </button>
              {sectors.map((s) => {
                const color = SECTOR_COLORS[s.slug] ?? '#6b7280';
                const active = filters.sector === s.slug;
                return (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, sector: active ? '' : s.slug }))}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{
                      background: active ? color : `${color}10`,
                      color: active ? '#fff' : color,
                      border: `1.5px solid ${active ? color : `${color}25`}`,
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: 11 }}>{SECTOR_ICONS[s.slug] ?? '📚'}</span>
                    {s.name}
                    {s.event_count !== undefined && (
                      <span style={{ opacity: 0.75 }}>({s.event_count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile filter panel */}
            {showFilters && (
              <div className="sm:hidden flex flex-wrap gap-2 mt-2.5 pt-2.5" style={{ borderTop: '1px solid var(--wx-border)' }}>
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, sector: '' }))}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: !filters.sector ? 'var(--wx-teal)' : 'var(--wx-surface)',
                    color: !filters.sector ? '#fff' : 'var(--wx-muted)',
                    border: '1.5px solid var(--wx-border)',
                    cursor: 'pointer',
                  }}
                >
                  All
                </button>
                {sectors.map((s) => {
                  const color = SECTOR_COLORS[s.slug] ?? '#6b7280';
                  const active = filters.sector === s.slug;
                  return (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => setFilters((f) => ({ ...f, sector: active ? '' : s.slug }))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: active ? color : `${color}10`,
                        color: active ? '#fff' : color,
                        border: `1.5px solid ${active ? color : `${color}25`}`,
                        cursor: 'pointer',
                      }}
                    >
                      {SECTOR_ICONS[s.slug]} {s.name}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setFilters((f) => ({ ...f, upcomingOnly: !f.upcomingOnly }))}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: filters.upcomingOnly ? 'var(--wx-teal-pale)' : 'var(--wx-surface)',
                    color: filters.upcomingOnly ? 'var(--wx-teal)' : 'var(--wx-muted)',
                    border: '1.5px solid var(--wx-border)',
                    cursor: 'pointer',
                  }}
                >
                  <CalendarDays size={12} /> Upcoming only
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Results area ─── */}
        <div className="wx-container" style={{ paddingTop: '1.5rem', paddingBottom: '3rem' }}>
          {/* Result count + active chips */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {!loading && (
              <p className="text-sm font-medium" style={{ color: 'var(--wx-muted)' }}>
                {total > 0
                  ? <><span style={{ color: 'var(--wx-ink)', fontWeight: 700 }}>{total.toLocaleString('en-IN')}</span> events</>
                  : 'No events'}
                {filters.q ? <> matching <em>"{filters.q}"</em></> : ''}
              </p>
            )}
            {activeChips.map((chip) => (
              <FilterChip key={chip.label} label={chip.label} onRemove={chip.clear} />
            ))}
            {activeChips.length > 1 && (
              <button
                onClick={clearFilters}
                className="text-xs font-semibold transition-colors"
                style={{ color: 'var(--wx-muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Grid */}
          <div
            className={
              gridView
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'grid grid-cols-1 gap-3'
            }
          >
            {loading ? (
              <SkeletonCards count={PAGE_SIZE} />
            ) : events.length === 0 ? (
              <EmptyState query={filters.q} onClear={clearFilters} />
            ) : (
              events.map((event) => (
                <WebinarCard
                  key={event.id}
                  event={event}
                  featured={event.is_featured === true}
                  compact={!gridView}
                />
              ))
            )}

            {loadingMore && <SkeletonCards count={3} />}
          </div>

          {/* Load more */}
          {!loading && !loadingMore && hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={loadMore}
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: 'var(--wx-white)',
                  border: '1.5px solid var(--wx-border)',
                  color: 'var(--wx-ink)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <TrendingUp size={16} style={{ color: 'var(--wx-teal)' }} />
                Load more events
                <span style={{ color: 'var(--wx-muted)', fontWeight: 400 }}>
                  ({Math.min(PAGE_SIZE, total - events.length)} more)
                </span>
              </button>
            </div>
          )}

          {/* End of results */}
          {!loading && !hasMore && events.length > 0 && (
            <p className="text-center text-sm mt-10" style={{ color: 'var(--wx-muted)' }}>
              You've seen all {total.toLocaleString('en-IN')} events ·{' '}
              <a href="/ai-search" style={{ color: 'var(--wx-teal)', fontWeight: 600 }}>
                Try AI Search for more →
              </a>
            </p>
          )}

          {/* Error */}
          {error && (
            <div
              className="text-center py-10 text-sm"
              style={{ color: '#DC2626' }}
            >
              {error} —{' '}
              <button
                onClick={() => void fetchEvents(filters, 0)}
                style={{ color: 'var(--wx-teal)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                retry
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
