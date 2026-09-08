import { useState } from 'react';
import { Send, Lock, Key, ChevronDown, ChevronUp, Info } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface Endpoint {
  id: string; method: string; path: string; desc: string; auth: 'none' | 'bearer' | 'apikey';
  params?: { name: string; type: string; required: boolean; desc: string; in: 'query' | 'body' | 'header' }[];
  sampleBody?: string;
  responses: { code: number; desc: string; sample: string }[];
  tags: string[];
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'get-users', method: 'GET', path: '/api/users', desc: 'List all users with pagination and search', auth: 'bearer',
    params: [
      { name: 'page', type: 'integer', required: false, desc: 'Page number (default: 1)', in: 'query' },
      { name: 'limit', type: 'integer', required: false, desc: 'Items per page (default: 10, max: 50)', in: 'query' },
      { name: 'search', type: 'string', required: false, desc: 'Search by name or email', in: 'query' },
      { name: 'role', type: 'string', required: false, desc: 'Filter by role: admin|user', in: 'query' },
    ],
    responses: [
      { code: 200, desc: 'Success', sample: '{"data":[{"id":1,"name":"Alice","email":"alice@test.com","role":"user"}],"pagination":{"page":1,"limit":10,"total":42,"totalPages":5}}' },
      { code: 401, desc: 'Unauthorized', sample: '{"error":"Missing or invalid Bearer token"}' },
      { code: 429, desc: 'Rate Limited', sample: '{"error":"Too many requests","retryAfter":60}' },
    ],
    tags: ['users', 'pagination'],
  },
  {
    id: 'post-users', method: 'POST', path: '/api/users', desc: 'Create a new user', auth: 'bearer',
    sampleBody: '{\n  "name": "Jane Smith",\n  "email": "jane@example.com",\n  "role": "user",\n  "password": "securepass123"\n}',
    params: [{ name: 'Authorization', type: 'string', required: true, desc: 'Bearer <token>', in: 'header' }],
    responses: [
      { code: 201, desc: 'Created', sample: '{"data":{"id":43,"name":"Jane Smith","email":"jane@example.com","role":"user","createdAt":"2024-01-15T10:00:00Z"}}' },
      { code: 400, desc: 'Bad Request', sample: '{"error":"Email already exists"}' },
      { code: 401, desc: 'Unauthorized', sample: '{"error":"Missing or invalid Bearer token"}' },
    ],
    tags: ['users', 'create'],
  },
  {
    id: 'get-user-id', method: 'GET', path: '/api/users/:id', desc: 'Get a specific user by ID', auth: 'bearer',
    params: [{ name: 'id', type: 'integer', required: true, desc: 'User ID', in: 'query' }],
    responses: [
      { code: 200, desc: 'Success', sample: '{"data":{"id":1,"name":"Alice","email":"alice@test.com","role":"user","createdAt":"2024-01-01T00:00:00Z"}}' },
      { code: 404, desc: 'Not Found', sample: '{"error":"User not found"}' },
    ],
    tags: ['users'],
  },
  {
    id: 'put-user', method: 'PUT', path: '/api/users/:id', desc: 'Replace a user (full update)', auth: 'bearer',
    sampleBody: '{\n  "name": "Alice Updated",\n  "email": "alice@test.com",\n  "role": "admin"\n}',
    responses: [
      { code: 200, desc: 'Updated', sample: '{"data":{"id":1,"name":"Alice Updated","role":"admin"}}' },
      { code: 404, desc: 'Not Found', sample: '{"error":"User not found"}' },
    ],
    tags: ['users', 'update'],
  },
  {
    id: 'patch-user', method: 'PATCH', path: '/api/users/:id', desc: 'Partially update a user', auth: 'bearer',
    sampleBody: '{\n  "role": "admin"\n}',
    responses: [
      { code: 200, desc: 'Patched', sample: '{"data":{"id":1,"role":"admin"}}' },
      { code: 404, desc: 'Not Found', sample: '{"error":"User not found"}' },
    ],
    tags: ['users', 'update'],
  },
  {
    id: 'delete-user', method: 'DELETE', path: '/api/users/:id', desc: 'Delete a user by ID', auth: 'bearer',
    responses: [
      { code: 204, desc: 'Deleted (no content)', sample: '' },
      { code: 404, desc: 'Not Found', sample: '{"error":"User not found"}' },
    ],
    tags: ['users', 'delete'],
  },
  {
    id: 'post-login', method: 'POST', path: '/api/auth/login', desc: 'Authenticate and receive JWT token', auth: 'none',
    sampleBody: '{\n  "email": "admin@test.com",\n  "password": "password123"\n}',
    responses: [
      { code: 200, desc: 'Success', sample: '{"token":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.xxx","refreshToken":"rt_abc123","user":{"id":1,"email":"admin@test.com","role":"admin"}}' },
      { code: 401, desc: 'Invalid credentials', sample: '{"error":"Invalid email or password"}' },
    ],
    tags: ['auth'],
  },
  {
    id: 'post-refresh', method: 'POST', path: '/api/auth/refresh', desc: 'Refresh JWT using refresh token', auth: 'none',
    sampleBody: '{\n  "refreshToken": "rt_abc123"\n}',
    responses: [
      { code: 200, desc: 'Success', sample: '{"token":"eyJhbGciOiJIUzI1NiJ9.new.xxx"}' },
      { code: 401, desc: 'Invalid refresh token', sample: '{"error":"Refresh token expired or invalid"}' },
    ],
    tags: ['auth'],
  },
  {
    id: 'get-products', method: 'GET', path: '/api/products', desc: 'List products (API key auth)', auth: 'apikey',
    params: [
      { name: 'X-API-Key', type: 'string', required: true, desc: 'Your API key', in: 'header' },
      { name: 'category', type: 'string', required: false, desc: 'Filter by category', in: 'query' },
    ],
    responses: [
      { code: 200, desc: 'Success', sample: '{"data":[{"id":1,"name":"Playwright Course","price":39.99,"category":"testing"}]}' },
      { code: 403, desc: 'Forbidden', sample: '{"error":"Invalid or missing API key"}' },
    ],
    tags: ['products', 'apikey'],
  },
  {
    id: 'get-chaos', method: 'GET', path: '/api/chaos', desc: 'Chaos endpoint — randomly returns 200, 500, or 503', auth: 'none',
    responses: [
      { code: 200, desc: 'Lucky! Success.', sample: '{"status":"ok","message":"You got lucky!","roll":42}' },
      { code: 500, desc: 'Internal Server Error', sample: '{"error":"Something went wrong (simulated)","requestId":"req_xyz"}' },
      { code: 503, desc: 'Service Unavailable', sample: '{"error":"Service temporarily unavailable","retryAfter":5}' },
    ],
    tags: ['chaos'],
  },
  {
    id: 'get-rate-limited', method: 'GET', path: '/api/rate-limited', desc: 'Rate-limited endpoint (5 req/min)', auth: 'none',
    responses: [
      { code: 200, desc: 'Success', sample: '{"data":"Rate limit test data","requestsLeft":4}' },
      { code: 429, desc: 'Too Many Requests', sample: '{"error":"Rate limit exceeded","limit":5,"window":"1m","retryAfter":45}' },
    ],
    tags: ['rate-limit'],
  },
  {
    id: 'get-download-csv', method: 'GET', path: '/api/download/csv', desc: 'Download a CSV file', auth: 'bearer',
    responses: [
      { code: 200, desc: 'CSV file download', sample: 'id,name,email,role\n1,Alice,alice@test.com,user\n2,Bob,bob@test.com,admin' },
      { code: 401, desc: 'Unauthorized', sample: '{"error":"Authentication required"}' },
    ],
    tags: ['download'],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  PATCH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};
const STATUS_COLORS: Record<number, string> = {
  200: 'text-green-600 dark:text-green-400', 201: 'text-green-600 dark:text-green-400',
  204: 'text-green-600 dark:text-green-400', 400: 'text-yellow-600 dark:text-yellow-400',
  401: 'text-red-500', 403: 'text-red-500', 404: 'text-orange-500',
  429: 'text-purple-600 dark:text-purple-400', 500: 'text-red-600', 503: 'text-red-600',
};

function TryItPanel({ ep }: { ep: Endpoint }) {
  const [params, setParams] = useState<Record<string, string>>({});
  const [body, setBody] = useState(ep.sampleBody || '');
  const [token, setToken] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState<{ status: number; body: string; time: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const tryIt = async () => {
    setLoading(true);
    const start = Date.now();
    try {
      let url = `http://localhost:4000${ep.path}`;
      if (Object.keys(params).length > 0) {
        const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString();
        if (qs) url += '?' + qs;
      }
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (ep.auth === 'bearer' && token) headers['Authorization'] = `Bearer ${token}`;
      if (ep.auth === 'apikey' && apiKey) headers['X-API-Key'] = apiKey;

      const opts: RequestInit = { method: ep.method, headers };
      if (['POST', 'PUT', 'PATCH'].includes(ep.method) && body) {
        try { opts.body = JSON.stringify(JSON.parse(body)); } catch { opts.body = body; }
      }

      const res = await fetch(url, opts);
      const text = await res.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* leave as-is */ }
      setResponse({ status: res.status, body: pretty, time: Date.now() - start });
      console.log(`[ClickAndVerify] API Try-It: ${ep.method} ${url} → ${res.status} (${Date.now() - start}ms)`);
    } catch (e) {
      setResponse({ status: 0, body: `Network error — is the backend running?\n\nStart it with: npm run server\n\nError: ${e}`, time: Date.now() - start });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3" data-testid={`try-it-${ep.id}`}>
      {ep.auth === 'bearer' && (
        <div>
          <label className="label flex items-center gap-1"><Lock size={12} /> Bearer Token</label>
          <input type="text" className="input font-mono text-xs" placeholder="eyJhbGciOiJIUzI1NiJ9..." value={token} onChange={e => setToken(e.target.value)} data-testid={`token-input-${ep.id}`} />
          <p className="text-xs text-gray-400 mt-0.5">Get token from POST /api/auth/login (admin@test.com / password123)</p>
        </div>
      )}
      {ep.auth === 'apikey' && (
        <div>
          <label className="label flex items-center gap-1"><Key size={12} /> API Key</label>
          <input type="text" className="input font-mono text-xs" placeholder="test-api-key-12345" value={apiKey} onChange={e => setApiKey(e.target.value)} data-testid={`apikey-input-${ep.id}`} />
          <p className="text-xs text-gray-400 mt-0.5">Use: <code className="font-mono">test-api-key-12345</code></p>
        </div>
      )}
      {ep.params?.filter(p => p.in === 'query').map(p => (
        <div key={p.name}>
          <label className="label text-xs">{p.name} {p.required && <span className="text-red-400">*</span>} <span className="text-gray-400 font-normal">({p.type}) — {p.desc}</span></label>
          <input type="text" className="input text-sm" placeholder={p.name} value={params[p.name] || ''} onChange={e => setParams(prev => ({ ...prev, [p.name]: e.target.value }))} data-testid={`param-${ep.id}-${p.name}`} />
        </div>
      ))}
      {ep.sampleBody && (
        <div>
          <label className="label">Request Body (JSON)</label>
          <textarea rows={6} className="input font-mono text-xs resize-y" value={body} onChange={e => setBody(e.target.value)} data-testid={`body-${ep.id}`} />
        </div>
      )}
      <button onClick={tryIt} disabled={loading} className="btn-primary text-sm gap-1.5 disabled:opacity-50" data-testid={`btn-try-${ep.id}`} aria-busy={loading}>
        {loading ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Sending…</> : <><Send size={14} /> Try It</>}
      </button>
      {response && (
        <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700" data-testid={`response-${ep.id}`}>
          <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <span className={`font-mono font-bold text-sm ${STATUS_COLORS[response.status] || 'text-gray-600'}`} data-testid={`response-status-${ep.id}`}>
              {response.status || 'ERR'}
            </span>
            <span className="text-xs text-gray-400 font-mono">{response.time}ms</span>
          </div>
          <pre className="bg-gray-900 text-gray-200 p-3 text-xs overflow-auto max-h-48 font-mono" data-testid={`response-body-${ep.id}`}>
            {response.body || '(no content)'}
          </pre>
        </div>
      )}
    </div>
  );
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<'docs' | 'try'>('docs');

  return (
    <div className="card overflow-hidden" data-testid={`endpoint-${ep.id}`} data-method={ep.method} data-path={ep.path}>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-left"
        data-testid={`endpoint-toggle-${ep.id}`}
        aria-expanded={expanded}
      >
        <span className={`badge font-mono font-bold text-xs ${METHOD_COLORS[ep.method]}`} data-testid={`method-badge-${ep.id}`}>{ep.method}</span>
        <code className="text-sm font-mono text-gray-800 dark:text-gray-200 flex-1" data-testid={`path-${ep.id}`}>{ep.path}</code>
        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{ep.desc}</span>
        {ep.auth !== 'none' && (
          <span className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
            {ep.auth === 'bearer' ? <Lock size={11} /> : <Key size={11} />}
            {ep.auth}
          </span>
        )}
        {expanded ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-800">
          <div className="flex border-b border-gray-100 dark:border-gray-800 px-4">
            {(['docs', 'try'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} className={`py-2 px-3 text-xs font-semibold capitalize border-b-2 transition-colors ${tab === t ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`} data-testid={`endpoint-tab-${t}-${ep.id}`}>
                {t === 'docs' ? 'Documentation' : 'Try It Out'}
              </button>
            ))}
          </div>
          <div className="p-4">
            {tab === 'docs' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">{ep.desc}</p>
                {ep.params && ep.params.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Parameters</h4>
                    <table className="w-full text-xs">
                      <thead><tr className="text-left text-gray-400"><th className="py-1 pr-3">Name</th><th className="py-1 pr-3">In</th><th className="py-1 pr-3">Type</th><th className="py-1">Description</th></tr></thead>
                      <tbody>
                        {ep.params.map(p => (
                          <tr key={p.name} className="border-t border-gray-100 dark:border-gray-800" data-testid={`param-doc-${ep.id}-${p.name}`}>
                            <td className="py-1.5 pr-3 font-mono text-blue-600 dark:text-blue-400">{p.name}{p.required && <span className="text-red-400 ml-0.5">*</span>}</td>
                            <td className="py-1.5 pr-3 text-gray-500">{p.in}</td>
                            <td className="py-1.5 pr-3 text-gray-500">{p.type}</td>
                            <td className="py-1.5 text-gray-600 dark:text-gray-400">{p.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Responses</h4>
                  <div className="space-y-2">
                    {ep.responses.map(r => (
                      <div key={r.code} className="rounded bg-gray-50 dark:bg-gray-800 overflow-hidden" data-testid={`response-doc-${ep.id}-${r.code}`}>
                        <div className="flex items-center gap-2 px-3 py-1.5">
                          <span className={`font-mono font-bold text-xs ${STATUS_COLORS[r.code] || 'text-gray-600'}`}>{r.code}</span>
                          <span className="text-xs text-gray-500">{r.desc}</span>
                        </div>
                        {r.sample && <pre className="bg-gray-900 text-gray-300 px-3 py-2 text-xs overflow-auto font-mono">{r.sample}</pre>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <TryItPanel ep={ep} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiPlaygroundPage() {
  const [filterTag, setFilterTag] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const allTags = [...new Set(ENDPOINTS.flatMap(e => e.tags))].sort();
  const filtered = ENDPOINTS.filter(e =>
    (!filterTag || e.tags.includes(filterTag)) &&
    (!filterMethod || e.method === filterMethod)
  );

  return (
    <PageLayout title="REST API Playground" description="Interactive Swagger-like docs for all backend endpoints. Test auth, pagination, rate limits, chaos, and file downloads." difficulty="expert" testId="api-playground-page"
      onReset={() => { setFilterTag(''); setFilterMethod(''); }}>
      <div className="max-w-4xl mx-auto space-y-4">

        <div className="card p-4" data-testid="api-info">
          <div className="flex items-start gap-2">
            <Info size={15} className="text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>Base URL: <code className="font-mono bg-gray-100 dark:bg-gray-800 px-1 rounded">http://localhost:4000</code></p>
              <p className="mt-1">Auth: Use <code className="font-mono">admin@test.com</code> / <code className="font-mono">password123</code> with POST /api/auth/login to get a Bearer token. API key: <code className="font-mono">test-api-key-12345</code></p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center" data-testid="api-filters">
          <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)} className="input w-auto text-sm" data-testid="filter-method">
            <option value="">All Methods</option>
            {['GET','POST','PUT','PATCH','DELETE'].map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="input w-auto text-sm" data-testid="filter-tag">
            <option value="">All Tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <span className="text-xs text-gray-500 dark:text-gray-400" data-testid="endpoints-count">{filtered.length} endpoints</span>
        </div>

        <div className="space-y-3" data-testid="endpoints-list">
          {filtered.map(ep => <EndpointCard key={ep.id} ep={ep} />)}
        </div>
      </div>
    </PageLayout>
  );
}
