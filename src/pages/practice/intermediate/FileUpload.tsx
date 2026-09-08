import { useState, useRef, useCallback, DragEvent } from 'react';
import { Upload, X, File, Image, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import PageLayout from '../../../components/layout/PageLayout';

interface UploadedFile {
  id: string; name: string; size: number; type: string;
  progress: number; status: 'pending' | 'uploading' | 'done' | 'error'; error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'text/csv'];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
  if (type === 'application/pdf') return <FileText size={16} className="text-red-500" />;
  return <File size={16} className="text-gray-500" />;
}

export default function FileUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const singleRef = useRef<HTMLInputElement>(null);
  const multiRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => {
      let error: string | undefined;
      if (f.size > MAX_FILE_SIZE) error = 'File exceeds 10 MB limit';
      else if (!ALLOWED_TYPES.includes(f.type) && f.type !== '') error = `Type "${f.type}" not allowed`;
      return { id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`, name: f.name, size: f.size, type: f.type || 'application/octet-stream', progress: 0, status: error ? 'error' : 'pending', error };
    });
    setFiles((prev) => [...prev, ...newFiles]);
    console.log('[ClickAndVerify] Files added:', newFiles.map((f) => f.name));
    // Simulate upload for valid files
    newFiles.filter((f) => f.status !== 'error').forEach((f) => simulateUpload(f.id));
  }, []);

  const simulateUpload = (id: string) => {
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, status: 'uploading' } : f));
    const interval = setInterval(() => {
      setFiles((prev) => {
        const file = prev.find((f) => f.id === id);
        if (!file) { clearInterval(interval); return prev; }
        if (file.progress >= 100) {
          clearInterval(interval);
          console.log('[ClickAndVerify] Upload complete:', file.name);
          return prev.map((f) => f.id === id ? { ...f, status: 'done', progress: 100 } : f);
        }
        const increment = Math.random() * 20 + 5;
        return prev.map((f) => f.id === id ? { ...f, progress: Math.min(f.progress + increment, 100) } : f);
      });
    }, 200);
  };

  const removeFile = (id: string) => {
    const f = files.find((f) => f.id === id);
    console.log('[ClickAndVerify] File removed:', f?.name);
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const doneCount = files.filter((f) => f.status === 'done').length;
  const errorCount = files.filter((f) => f.status === 'error').length;
  const uploadingCount = files.filter((f) => f.status === 'uploading').length;

  return (
    <PageLayout title="File Upload" description="Single and multiple file uploads with drag-and-drop, progress bars, and validation." difficulty="intermediate" testId="file-upload-page"
      onReset={() => setFiles([])}>
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Single upload */}
        <div className="card p-6" data-testid="section-single-upload">
          <h2 className="section-header">Single File Upload</h2>
          <p className="section-sub">Click to select one file. Max 10 MB. Types: images, PDF, TXT, CSV.</p>
          <input ref={singleRef} type="file" className="hidden" data-testid="file-input-single"
            accept={ALLOWED_TYPES.join(',')}
            onChange={(e) => { if (e.target.files?.[0]) addFiles(e.target.files); e.target.value = ''; }} />
          <button onClick={() => singleRef.current?.click()} className="btn-primary" data-testid="btn-browse-single">
            <Upload size={16} /> Choose File
          </button>
        </div>

        {/* Multi upload */}
        <div className="card p-6" data-testid="section-multi-upload">
          <h2 className="section-header">Multiple File Upload</h2>
          <p className="section-sub">Select multiple files at once (Ctrl+click or Shift+click in picker).</p>
          <input ref={multiRef} type="file" multiple className="hidden" data-testid="file-input-multi"
            accept={ALLOWED_TYPES.join(',')}
            onChange={(e) => { if (e.target.files?.length) addFiles(e.target.files); e.target.value = ''; }} />
          <button onClick={() => multiRef.current?.click()} className="btn-primary" data-testid="btn-browse-multi">
            <Upload size={16} /> Choose Files
          </button>
        </div>

        {/* Drag-and-drop zone */}
        <div className="card p-6" data-testid="section-dropzone">
          <h2 className="section-header">Drag & Drop Zone</h2>
          <p className="section-sub">Drop files here or click to browse</p>
          <div
            onDragEnter={() => setDragging(true)}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragging(false); }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDrop={handleDrop}
            onClick={() => multiRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
              dragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/10 scale-[1.01]' : 'border-gray-300 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
            }`}
            data-testid="dropzone"
            data-dragging={dragging}
            role="button"
            aria-label="Drop zone for file upload"
          >
            <Upload size={36} className={`mx-auto mb-3 ${dragging ? 'text-blue-500' : 'text-gray-300 dark:text-gray-600'}`} />
            <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
              {dragging ? 'Release to upload' : 'Drop files here'}
            </p>
            <p className="text-xs text-gray-400">or click to browse</p>
            <p className="text-xs text-gray-400 mt-2">Images, PDF, TXT, CSV — max 10 MB each</p>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="card p-6" data-testid="file-list">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">
                Files <span className="text-gray-400 text-sm">({files.length})</span>
              </h2>
              <div className="flex gap-3 text-xs">
                {doneCount > 0 && <span className="text-green-600 dark:text-green-400" data-testid="upload-done-count">✓ {doneCount} done</span>}
                {uploadingCount > 0 && <span className="text-blue-600 dark:text-blue-400" data-testid="upload-uploading-count">↑ {uploadingCount} uploading</span>}
                {errorCount > 0 && <span className="text-red-600 dark:text-red-400" data-testid="upload-error-count">✗ {errorCount} failed</span>}
              </div>
            </div>
            <div className="space-y-3">
              {files.map((f) => (
                <div key={f.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700" data-testid={`file-item-${f.id}`} data-status={f.status}>
                  <div className="mt-0.5 shrink-0"><FileIcon type={f.type} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate" data-testid={`file-name-${f.id}`}>{f.name}</p>
                      <button onClick={() => removeFile(f.id)} className="text-gray-400 hover:text-red-500 shrink-0" data-testid={`file-remove-${f.id}`} aria-label={`Remove ${f.name}`}><X size={14} /></button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5" data-testid={`file-size-${f.id}`}>{formatSize(f.size)}</p>
                    {f.status === 'error' ? (
                      <div className="flex items-center gap-1 mt-1.5" data-testid={`file-error-${f.id}`}>
                        <AlertCircle size={12} className="text-red-500" />
                        <p className="text-xs text-red-600 dark:text-red-400">{f.error}</p>
                      </div>
                    ) : f.status === 'done' ? (
                      <div className="flex items-center gap-1 mt-1.5" data-testid={`file-done-${f.id}`}>
                        <CheckCircle size={12} className="text-green-500" />
                        <p className="text-xs text-green-600 dark:text-green-400">Upload complete</p>
                      </div>
                    ) : (
                      <div className="mt-1.5" data-testid={`file-progress-wrapper-${f.id}`}>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>{f.status === 'uploading' ? 'Uploading…' : 'Pending'}</span>
                          <span data-testid={`file-progress-pct-${f.id}`}>{Math.round(f.progress)}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all duration-150 ${f.status === 'uploading' ? 'bg-blue-500' : 'bg-gray-300'}`}
                            style={{ width: `${f.progress}%` }}
                            data-testid={`file-progress-bar-${f.id}`}
                            role="progressbar"
                            aria-valuenow={Math.round(f.progress)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setFiles([])} className="btn-ghost text-xs mt-4 text-red-500 hover:text-red-700" data-testid="btn-clear-all-files">Clear all files</button>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
