import { useState } from 'react';
import { Shield, User, Eye, EyeOff, Lock, Unlock, Settings, Users, BarChart2, FileText, Trash2, Edit } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

type Role = 'guest' | 'user' | 'moderator' | 'admin';

interface Permission { action: string; resource: string; }

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: [
    { action: 'read', resource: 'posts' },
    { action: 'read', resource: 'comments' },
  ],
  user: [
    { action: 'read', resource: 'posts' },
    { action: 'create', resource: 'posts' },
    { action: 'read', resource: 'comments' },
    { action: 'create', resource: 'comments' },
    { action: 'update', resource: 'own_posts' },
    { action: 'delete', resource: 'own_posts' },
    { action: 'read', resource: 'profile' },
    { action: 'update', resource: 'profile' },
  ],
  moderator: [
    { action: 'read', resource: 'posts' },
    { action: 'create', resource: 'posts' },
    { action: 'update', resource: 'posts' },
    { action: 'delete', resource: 'posts' },
    { action: 'read', resource: 'comments' },
    { action: 'create', resource: 'comments' },
    { action: 'delete', resource: 'comments' },
    { action: 'read', resource: 'users' },
    { action: 'read', resource: 'profile' },
  ],
  admin: [
    { action: 'read', resource: 'posts' },
    { action: 'create', resource: 'posts' },
    { action: 'update', resource: 'posts' },
    { action: 'delete', resource: 'posts' },
    { action: 'read', resource: 'comments' },
    { action: 'create', resource: 'comments' },
    { action: 'delete', resource: 'comments' },
    { action: 'read', resource: 'users' },
    { action: 'create', resource: 'users' },
    { action: 'update', resource: 'users' },
    { action: 'delete', resource: 'users' },
    { action: 'read', resource: 'settings' },
    { action: 'update', resource: 'settings' },
    { action: 'read', resource: 'analytics' },
    { action: 'read', resource: 'profile' },
    { action: 'update', resource: 'profile' },
  ],
};

function can(role: Role, action: string, resource: string): boolean {
  return ROLE_PERMISSIONS[role].some(p =>
    (p.action === action || p.action === 'manage') &&
    (p.resource === resource || p.resource === 'all')
  );
}

interface GateProps { role: Role; action: string; resource: string; children: React.ReactNode; fallback?: React.ReactNode; }
function Gate({ role, action, resource, children, fallback }: GateProps) {
  if (can(role, action, resource)) return <>{children}</>;
  return fallback ? <>{fallback}</> : (
    <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded border border-dashed border-gray-300 dark:border-gray-700" data-testid={`permission-denied-${action}-${resource}`}>
      <Lock size={11}/> No permission: <code className="font-mono">{action}:{resource}</code>
    </div>
  );
}

const AUDIT_LOG_ENTRIES = [
  { id: 1, user: 'admin@test.com', action: 'delete', resource: 'users', target: 'user#42', ts: '10:32:01', severity: 'high' },
  { id: 2, user: 'mod@test.com', action: 'delete', resource: 'comments', target: 'comment#88', ts: '10:28:14', severity: 'medium' },
  { id: 3, user: 'alice@test.com', action: 'update', resource: 'posts', target: 'post#7', ts: '10:15:55', severity: 'low' },
  { id: 4, user: 'admin@test.com', action: 'update', resource: 'settings', target: 'site_config', ts: '09:58:22', severity: 'high' },
  { id: 5, user: 'bob@test.com', action: 'create', resource: 'posts', target: 'post#23', ts: '09:45:10', severity: 'low' },
];

export default function RbacPage() {
  const [currentRole, setCurrentRole] = useState<Role>('guest');
  const [showDenied, setShowDenied] = useState(true);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const logAction = (action: string, resource: string) => {
    const entry = `${new Date().toLocaleTimeString()} — [${currentRole}] ${action}:${resource}`;
    setActionLog(l => [entry, ...l].slice(0, 15));
    console.log(`[ClickAndVerify] RBAC action: ${entry}`);
  };

  const ROLE_COLORS: Record<Role, string> = {
    guest: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    moderator: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  };

  const denied = (action: string, resource: string) => showDenied ? (
    <div className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 bg-red-50 dark:bg-red-900/10 rounded border border-dashed border-red-200 dark:border-red-800" data-testid={`permission-denied-${action}-${resource}`} aria-label={`Access denied: ${action} ${resource}`}>
      <Lock size={11}/> Access denied
    </div>
  ) : null;

  return (
    <PageLayout title="Role-Based Access Control" description="Switch roles to see different UI views. Practice asserting on presence/absence of permission-gated elements." difficulty="expert" testId="rbac-page"
      onReset={() => { setCurrentRole('guest'); setActionLog([]); }}>
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Role switcher */}
        <div className="card p-5" data-testid="rbac-role-switcher">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Active Role</h2>
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input type="checkbox" checked={showDenied} onChange={e => setShowDenied(e.target.checked)} className="w-4 h-4 rounded" data-testid="rbac-show-denied-toggle"/>
              Show denied placeholders
            </label>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select role">
            {(['guest', 'user', 'moderator', 'admin'] as Role[]).map(role => (
              <button
                key={role}
                onClick={() => { setCurrentRole(role); console.log(`[ClickAndVerify] Role switched to: ${role}`); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all border-2 ${currentRole === role ? `${ROLE_COLORS[role]} border-current shadow-md scale-105` : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'}`}
                data-testid={`rbac-role-btn-${role}`}
                aria-pressed={currentRole === role}
              >
                {role === 'admin' ? <><Shield size={13} className="inline mr-1"/>Admin</> :
                 role === 'moderator' ? <><Eye size={13} className="inline mr-1"/>Moderator</> :
                 role === 'user' ? <><User size={13} className="inline mr-1"/>User</> : 'Guest'}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Current role: <span className={`badge ${ROLE_COLORS[currentRole]}`} data-testid="rbac-current-role">{currentRole}</span>
            <span className="ml-2">({ROLE_PERMISSIONS[currentRole].length} permissions)</span>
          </p>
        </div>

        {/* Permission matrix */}
        <div className="card p-5" data-testid="rbac-permission-matrix">
          <h2 className="section-header">Permission Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" data-testid="rbac-matrix-table">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-500">Resource</th>
                  {(['read','create','update','delete'] as const).map(a => (
                    <th key={a} className="text-center py-2 px-3 text-gray-500 capitalize">{a}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['posts','comments','users','settings','analytics','profile'].map(resource => (
                  <tr key={resource} className="border-b border-gray-100 dark:border-gray-800" data-testid={`rbac-row-${resource}`}>
                    <td className="py-2 px-3 font-medium text-gray-700 dark:text-gray-300 capitalize">{resource}</td>
                    {(['read','create','update','delete'] as const).map(action => (
                      <td key={action} className="py-2 px-3 text-center" data-testid={`rbac-cell-${action}-${resource}`}>
                        {can(currentRole, action, resource)
                          ? <span className="text-green-500" aria-label="allowed">✓</span>
                          : <span className="text-red-300 dark:text-red-800" aria-label="denied">✗</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Protected UI sections */}
        <div className="card p-5" data-testid="rbac-protected-ui">
          <h2 className="section-header">Protected UI Sections</h2>
          <p className="section-sub">Content visibility changes based on the active role</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Posts management */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2" data-testid="rbac-section-posts">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1"><FileText size={12}/> Posts</p>
              <Gate role={currentRole} action="read" resource="posts">
                <button onClick={() => logAction('read','posts')} className="btn-ghost text-xs border border-gray-200 dark:border-gray-600 w-full justify-start" data-testid="rbac-action-read-posts"><Eye size={12}/> View Posts</button>
              </Gate>
              <Gate role={currentRole} action="create" resource="posts" fallback={denied('create','posts') ?? undefined}>
                <button onClick={() => logAction('create','posts')} className="btn-ghost text-xs border border-gray-200 dark:border-gray-600 w-full justify-start" data-testid="rbac-action-create-posts"><Edit size={12}/> Create Post</button>
              </Gate>
              <Gate role={currentRole} action="delete" resource="posts" fallback={denied('delete','posts') ?? undefined}>
                <button onClick={() => logAction('delete','posts')} className="btn-ghost text-xs border border-red-200 dark:border-red-800 text-red-600 w-full justify-start" data-testid="rbac-action-delete-posts"><Trash2 size={12}/> Delete Post</button>
              </Gate>
            </div>

            {/* Users management */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2" data-testid="rbac-section-users">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1"><Users size={12}/> Users</p>
              <Gate role={currentRole} action="read" resource="users" fallback={denied('read','users') ?? undefined}>
                <button onClick={() => logAction('read','users')} className="btn-ghost text-xs border border-gray-200 dark:border-gray-600 w-full justify-start" data-testid="rbac-action-read-users"><Eye size={12}/> View Users</button>
              </Gate>
              <Gate role={currentRole} action="create" resource="users" fallback={denied('create','users') ?? undefined}>
                <button onClick={() => logAction('create','users')} className="btn-ghost text-xs border border-gray-200 dark:border-gray-600 w-full justify-start" data-testid="rbac-action-create-users"><Edit size={12}/> Create User</button>
              </Gate>
              <Gate role={currentRole} action="delete" resource="users" fallback={denied('delete','users') ?? undefined}>
                <button onClick={() => logAction('delete','users')} className="btn-ghost text-xs border border-red-200 dark:border-red-800 text-red-600 w-full justify-start" data-testid="rbac-action-delete-users"><Trash2 size={12}/> Delete User</button>
              </Gate>
            </div>

            {/* Settings (admin only) */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2" data-testid="rbac-section-settings">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1"><Settings size={12}/> Settings <span className="text-purple-500">(admin only)</span></p>
              <Gate role={currentRole} action="read" resource="settings" fallback={denied('read','settings') ?? undefined}>
                <button onClick={() => logAction('read','settings')} className="btn-ghost text-xs border border-gray-200 dark:border-gray-600 w-full justify-start" data-testid="rbac-action-read-settings"><Settings size={12}/> Site Settings</button>
              </Gate>
            </div>

            {/* Analytics (admin only) */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-2" data-testid="rbac-section-analytics">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1"><BarChart2 size={12}/> Analytics <span className="text-purple-500">(admin only)</span></p>
              <Gate role={currentRole} action="read" resource="analytics" fallback={denied('read','analytics') ?? undefined}>
                <button onClick={() => logAction('read','analytics')} className="btn-ghost text-xs border border-gray-200 dark:border-gray-600 w-full justify-start" data-testid="rbac-action-read-analytics"><BarChart2 size={12}/> View Analytics</button>
              </Gate>
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="card p-5" data-testid="rbac-audit-log">
          <h2 className="section-header">Audit Log</h2>
          <p className="section-sub">Immutable record of privileged actions</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs" data-testid="rbac-audit-table">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 uppercase">
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-left py-2 px-3">User</th>
                  <th className="text-left py-2 px-3">Action</th>
                  <th className="text-left py-2 px-3">Resource</th>
                  <th className="text-left py-2 px-3">Target</th>
                  <th className="text-left py-2 px-3">Severity</th>
                </tr>
              </thead>
              <tbody>
                {AUDIT_LOG_ENTRIES.map(entry => (
                  <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-800" data-testid={`audit-row-${entry.id}`}>
                    <td className="py-2 px-3 font-mono text-gray-400">{entry.ts}</td>
                    <td className="py-2 px-3 font-mono text-blue-600 dark:text-blue-400">{entry.user}</td>
                    <td className="py-2 px-3 capitalize font-medium">{entry.action}</td>
                    <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{entry.resource}</td>
                    <td className="py-2 px-3 font-mono text-gray-500">{entry.target}</td>
                    <td className="py-2 px-3">
                      <span className={`badge ${entry.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : entry.severity === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`} data-testid={`audit-severity-${entry.id}`}>{entry.severity}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {actionLog.length > 0 && (
          <div className="card p-4" data-testid="rbac-action-log">
            <h3 className="font-semibold text-sm mb-2">Your Action Log</h3>
            <ul className="space-y-0.5">
              {actionLog.map((e, i) => <li key={i} className="text-xs font-mono text-gray-500 dark:text-gray-400" data-testid={`rbac-action-${i}`}>{e}</li>)}
            </ul>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
