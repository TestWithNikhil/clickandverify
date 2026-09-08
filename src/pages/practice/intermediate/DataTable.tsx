import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, RefreshCw, ArrowUpDown } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface Row { id: number; name: string; email: string; country: string; status: 'active' | 'inactive' | 'pending'; score: number; joined: string; }

// Generate 120 mock rows
const ALL_ROWS: Row[] = Array.from({ length: 120 }, (_, i) => {
  const id = i + 1;
  const firstNames = ['Alice','Bob','Carol','David','Eva','Frank','Grace','Henry','Irene','Jack','Karen','Leo','Maya','Nate','Olivia','Peter','Quinn','Rachel','Sam','Tina'];
  const lastNames = ['Smith','Johnson','Williams','Brown','Davis','Miller','Wilson','Moore','Taylor','Anderson','Thomas','Jackson','White','Harris','Martin'];
  const countries = ['USA','UK','Canada','Germany','France','Australia','India','Brazil','Japan','Netherlands'];
  const statuses: Row['status'][] = ['active', 'active', 'active', 'inactive', 'pending'];
  return {
    id, name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    email: `user${id}@example.com`,
    country: countries[i % countries.length],
    status: statuses[i % statuses.length],
    score: Math.floor(Math.random() * 100) + 1,
    joined: new Date(2020 + Math.floor(i / 30), (i * 3) % 12, (i % 28) + 1).toISOString().slice(0, 10),
  };
});

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

type SortKey = keyof Row;

export default function DataTablePage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [infiniteMode, setInfiniteMode] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Simulate loading on filter change
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => { setLoading(false); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [debouncedSearch, statusFilter, countryFilter, sortKey, sortDir]);

  // Filter + sort
  const filtered = ALL_ROWS.filter((r) => {
    const q = debouncedSearch.toLowerCase();
    const matchSearch = !q || r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.country.toLowerCase().includes(q);
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchCountry = !countryFilter || r.country === countryFilter;
    return matchSearch && matchStatus && matchCountry;
  }).sort((a, b) => {
    const av = a[sortKey], bv = b[sortKey];
    if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
    return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });

  const countries = [...new Set(ALL_ROWS.map((r) => r.country))].sort();
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Infinite scroll
  useEffect(() => {
    if (!infiniteMode || !sentinelRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && visibleCount < filtered.length) {
        setTimeout(() => setVisibleCount((c) => Math.min(c + 20, filtered.length)), 600);
      }
    }, { threshold: 0.5 });
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [infiniteMode, visibleCount, filtered.length]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const SortBtn = ({ col }: { col: SortKey }) => (
    <button onClick={() => handleSort(col)} className="ml-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" data-testid={`sort-${col}`} aria-label={`Sort by ${col}`}>
      {sortKey !== col ? <ArrowUpDown size={12} /> : sortDir === 'asc' ? <ChevronUp size={12} className="text-blue-500" /> : <ChevronDown size={12} className="text-blue-500" />}
    </button>
  );

  const displayRows = infiniteMode ? filtered.slice(0, visibleCount) : paginated;

  return (
    <PageLayout title="Infinite Scroll / Paginated Table" description="Dynamic data with server-side (simulated) pagination, search, filters, and infinite scroll mode." difficulty="intermediate" testId="data-table-page"
      onReset={() => { setSearch(''); setStatusFilter(''); setCountryFilter(''); setSortKey('id'); setSortDir('asc'); setPage(1); setInfiniteMode(false); setVisibleCount(20); }}>
      <div className="card overflow-hidden" data-testid="data-table-container">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9 text-sm" placeholder="Search name, email, country…" data-testid="dt-search" aria-label="Search" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-auto text-sm" data-testid="dt-filter-status" aria-label="Filter by status">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="input w-auto text-sm" data-testid="dt-filter-country" aria-label="Filter by country">
              <option value="">All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="input w-auto text-sm" data-testid="dt-page-size" aria-label="Rows per page" disabled={infiniteMode}>
              {[10, 20, 50].map((s) => <option key={s} value={s}>{s} / page</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer" data-testid="dt-infinite-label">
              <input type="checkbox" checked={infiniteMode} onChange={(e) => { setInfiniteMode(e.target.checked); setVisibleCount(20); }} className="w-4 h-4 rounded" data-testid="dt-infinite-toggle" />
              Infinite scroll
            </label>
            {loading && <RefreshCw size={14} className="animate-spin text-blue-500" data-testid="dt-loading-spinner" aria-label="Loading" />}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400" data-testid="dt-result-info">
            <Filter size={12} />
            <span data-testid="dt-total-count">{filtered.length}</span> results
            {(debouncedSearch || statusFilter || countryFilter) && (
              <button onClick={() => { setSearch(''); setStatusFilter(''); setCountryFilter(''); }} className="text-blue-500 hover:underline" data-testid="dt-clear-filters">Clear filters</button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="data-table" aria-label="Users data table">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 text-xs uppercase">
              <tr>
                {[
                  { key: 'id' as SortKey, label: 'ID' },
                  { key: 'name' as SortKey, label: 'Name' },
                  { key: 'email' as SortKey, label: 'Email' },
                  { key: 'country' as SortKey, label: 'Country' },
                  { key: 'status' as SortKey, label: 'Status' },
                  { key: 'score' as SortKey, label: 'Score' },
                  { key: 'joined' as SortKey, label: 'Joined' },
                ].map((col) => (
                  <th key={col.key} className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400" data-testid={`dt-header-${col.key}`} aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                    <span className="flex items-center">{col.label}<SortBtn col={col.key} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800" data-testid="dt-body">
              {displayRows.length === 0 && !loading ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400" data-testid="dt-empty">No results found</td></tr>
              ) : (
                displayRows.map((row, idx) => (
                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50" data-testid={`dt-row-${row.id}`} data-row-index={idx}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400" data-testid={`dt-cell-id-${row.id}`}>{row.id}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100" data-testid={`dt-cell-name-${row.id}`}>{row.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 text-xs font-mono" data-testid={`dt-cell-email-${row.id}`}>{row.email}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300" data-testid={`dt-cell-country-${row.id}`}>{row.country}</td>
                    <td className="px-4 py-3" data-testid={`dt-cell-status-${row.id}`}>
                      <span className={`badge ${STATUS_BADGE[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-gray-700 dark:text-gray-300" data-testid={`dt-cell-score-${row.id}`}>{row.score}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono" data-testid={`dt-cell-joined-${row.id}`}>{row.joined}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Infinite scroll sentinel */}
        {infiniteMode && (
          <div ref={sentinelRef} className="h-12 flex items-center justify-center" data-testid="dt-scroll-sentinel">
            {visibleCount < filtered.length ? (
              <span className="text-xs text-gray-400 animate-pulse" data-testid="dt-load-more-indicator">Loading more…</span>
            ) : (
              <span className="text-xs text-gray-400" data-testid="dt-all-loaded">All {filtered.length} rows loaded</span>
            )}
          </div>
        )}

        {/* Pagination */}
        {!infiniteMode && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3" data-testid="dt-pagination">
            <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="dt-pagination-info">
              Page <span data-testid="dt-current-page">{page}</span> of <span data-testid="dt-total-pages">{totalPages}</span>
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={page === 1} className="btn-ghost px-2 py-1 text-xs disabled:opacity-40" data-testid="dt-page-first">«</button>
              <button onClick={() => setPage((p) => p - 1)} disabled={page === 1} className="btn-ghost px-2 py-1 text-xs disabled:opacity-40" data-testid="dt-page-prev">‹</button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => Math.max(1, page - 2) + i).filter((p) => p <= totalPages).map((p) => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded text-xs font-medium ${p === page ? 'bg-blue-600 text-white' : 'btn-ghost'}`} data-testid={`dt-page-btn-${p}`} aria-current={p === page ? 'page' : undefined}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => p + 1)} disabled={page === totalPages} className="btn-ghost px-2 py-1 text-xs disabled:opacity-40" data-testid="dt-page-next">›</button>
              <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="btn-ghost px-2 py-1 text-xs disabled:opacity-40" data-testid="dt-page-last">»</button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
