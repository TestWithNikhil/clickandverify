import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface Employee {
  id: number;
  name: string;
  department: string;
  role: string;
  salary: number;
  status: 'Active' | 'Inactive' | 'On Leave';
  joined: string;
}

const INITIAL_DATA: Employee[] = [
  { id: 1, name: 'Alice Johnson', department: 'Engineering', role: 'Senior Dev', salary: 95000, status: 'Active', joined: '2020-03-15' },
  { id: 2, name: 'Bob Smith', department: 'Design', role: 'UX Designer', salary: 78000, status: 'Active', joined: '2021-07-01' },
  { id: 3, name: 'Carol White', department: 'Engineering', role: 'QA Engineer', salary: 72000, status: 'Active', joined: '2019-11-20' },
  { id: 4, name: 'David Lee', department: 'Marketing', role: 'SEO Specialist', salary: 65000, status: 'Inactive', joined: '2022-01-10' },
  { id: 5, name: 'Eva Martinez', department: 'Engineering', role: 'DevOps', salary: 88000, status: 'Active', joined: '2020-09-05' },
  { id: 6, name: 'Frank Chen', department: 'HR', role: 'HR Manager', salary: 70000, status: 'On Leave', joined: '2018-04-12' },
  { id: 7, name: 'Grace Kim', department: 'Engineering', role: 'Frontend Dev', salary: 82000, status: 'Active', joined: '2021-02-28' },
  { id: 8, name: 'Henry Brown', department: 'Finance', role: 'Accountant', salary: 68000, status: 'Active', joined: '2023-01-16' },
  { id: 9, name: 'Irene Davis', department: 'Design', role: 'Graphic Designer', salary: 60000, status: 'Inactive', joined: '2022-08-19' },
  { id: 10, name: 'Jack Wilson', department: 'Engineering', role: 'Backend Dev', salary: 90000, status: 'Active', joined: '2019-06-30' },
  { id: 11, name: 'Karen Taylor', department: 'Marketing', role: 'Content Writer', salary: 55000, status: 'Active', joined: '2023-03-01' },
  { id: 12, name: 'Leo Anderson', department: 'Finance', role: 'CFO', salary: 140000, status: 'Active', joined: '2017-02-14' },
];

type SortKey = keyof Employee;
type SortDir = 'asc' | 'desc';

const PAGE_SIZE_OPTIONS = [5, 10, 25];
const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Inactive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  'On Leave': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

export default function TablePage() {
  const [data] = useState<Employee[]>(INITIAL_DATA);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [deptFilter, setDeptFilter] = useState('');

  const departments = useMemo(() => [...new Set(data.map((d) => d.department))].sort(), [data]);

  const filtered = useMemo(() => {
    return data.filter((e) => {
      const s = search.toLowerCase();
      const matchSearch = !s || e.name.toLowerCase().includes(s) || e.role.toLowerCase().includes(s) || e.department.toLowerCase().includes(s);
      const matchDept = !deptFilter || e.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [data, search, deptFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
    console.log(`[ClickAndVerify] Table sort: ${key} ${sortKey === key ? (sortDir === 'asc' ? 'desc' : 'asc') : 'asc'}`);
  };

  const toggleSelect = (id: number) => {
    setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const allPageSelected = paginated.every((r) => selected.has(r.id));
  const toggleAll = () => {
    if (allPageSelected) setSelected((s) => { const n = new Set(s); paginated.forEach((r) => n.delete(r.id)); return n; });
    else setSelected((s) => { const n = new Set(s); paginated.forEach((r) => n.add(r.id)); return n; });
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown size={12} className="text-gray-400" />;
    return sortDir === 'asc' ? <ArrowUp size={12} className="text-blue-500" /> : <ArrowDown size={12} className="text-blue-500" />;
  };

  const columns: { key: SortKey; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'role', label: 'Role' },
    { key: 'salary', label: 'Salary' },
    { key: 'status', label: 'Status' },
    { key: 'joined', label: 'Joined' },
  ];

  return (
    <PageLayout
      title="Static Table"
      description="Sortable, filterable data table with pagination and row selection."
      difficulty="beginner"
      testId="table-page"
      onReset={() => { setSearch(''); setSortKey('id'); setSortDir('asc'); setPage(1); setPageSize(5); setSelected(new Set()); setDeptFilter(''); }}
    >
      <div className="card overflow-hidden" data-testid="table-container">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-3 items-center" data-testid="table-toolbar">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search name, role, department…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); console.log('[ClickAndVerify] Table search:', e.target.value); }}
              className="input pl-9 text-sm"
              data-testid="table-search"
              aria-label="Search table"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="input w-auto text-sm"
            data-testid="table-dept-filter"
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d} value={d} data-testid={`dept-option-${d.toLowerCase()}`}>{d}</option>)}
          </select>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="input w-auto text-sm"
            data-testid="table-page-size"
            aria-label="Rows per page"
          >
            {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s} rows</option>)}
          </select>
          {selected.size > 0 && (
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded" data-testid="table-selected-count">
              {selected.size} selected
            </span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="employee-table" aria-label="Employee table">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={allPageSelected && paginated.length > 0}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    data-testid="table-select-all"
                    aria-label="Select all visible rows"
                  />
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider w-8">ID</th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-3 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none"
                    onClick={() => handleSort(col.key)}
                    data-testid={`table-header-${col.key}`}
                    aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
                  >
                    <span className="flex items-center gap-1">{col.label} <SortIcon col={col.key} /></span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800" data-testid="table-body">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-gray-400" data-testid="table-empty">
                    No results found
                  </td>
                </tr>
              ) : (
                paginated.map((emp, rowIdx) => (
                  <tr
                    key={emp.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${selected.has(emp.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                    data-testid={`table-row-${emp.id}`}
                    data-row-index={rowIdx}
                    aria-selected={selected.has(emp.id)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(emp.id)}
                        onChange={() => toggleSelect(emp.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        data-testid={`table-row-select-${emp.id}`}
                        aria-label={`Select ${emp.name}`}
                      />
                    </td>
                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400 font-mono text-xs" data-testid={`table-cell-id-${emp.id}`}>{emp.id}</td>
                    <td className="px-3 py-3 font-medium text-gray-900 dark:text-gray-100" data-testid={`table-cell-name-${emp.id}`}>{emp.name}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300" data-testid={`table-cell-dept-${emp.id}`}>{emp.department}</td>
                    <td className="px-3 py-3 text-gray-600 dark:text-gray-300" data-testid={`table-cell-role-${emp.id}`}>{emp.role}</td>
                    <td className="px-3 py-3 text-gray-900 dark:text-gray-100 font-mono" data-testid={`table-cell-salary-${emp.id}`}>${emp.salary.toLocaleString()}</td>
                    <td className="px-3 py-3" data-testid={`table-cell-status-${emp.id}`}>
                      <span className={`badge ${STATUS_COLORS[emp.status]}`}>{emp.status}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-500 dark:text-gray-400 text-xs font-mono" data-testid={`table-cell-joined-${emp.id}`}>{emp.joined}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3" data-testid="table-pagination">
          <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="table-pagination-info">
            Showing <span className="font-semibold">{Math.min((page - 1) * pageSize + 1, sorted.length)}</span>–
            <span className="font-semibold">{Math.min(page * pageSize, sorted.length)}</span> of{' '}
            <span className="font-semibold">{sorted.length}</span> results
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="btn-ghost p-1.5 text-xs disabled:opacity-40"
              data-testid="table-page-first"
              aria-label="First page"
            >«</button>
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="btn-ghost p-1.5 disabled:opacity-40"
              data-testid="table-page-prev"
              aria-label="Previous page"
            ><ChevronLeft size={14} /></button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, page - 2);
              const p = start + i;
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1.5 rounded text-xs font-medium ${p === page ? 'bg-blue-600 text-white' : 'btn-ghost'}`}
                  data-testid={`table-page-${p}`}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                >{p}</button>
              );
            })}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages || totalPages === 0}
              className="btn-ghost p-1.5 disabled:opacity-40"
              data-testid="table-page-next"
              aria-label="Next page"
            ><ChevronRight size={14} /></button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages || totalPages === 0}
              className="btn-ghost p-1.5 text-xs disabled:opacity-40"
              data-testid="table-page-last"
              aria-label="Last page"
            >»</button>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
