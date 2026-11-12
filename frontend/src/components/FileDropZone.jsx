import { useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';

/**
 * Drag-and-drop file upload zone.
 * Props:
 *   accept  — file accept string (e.g. '.pdf')
 *   onFile  — callback(File)
 *   file    — currently selected File | null
 *   loading — show spinner while uploading
 */
export default function FileDropZone({ accept = '.pdf', onFile, file, loading }) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const dropped = e.dataTransfer.files[0];
      if (dropped) onFile(dropped);
    },
    [onFile],
  );

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFile(selected);
  };

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`drop-zone block ${dragging ? 'active' : ''}`}
    >
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Parsing resume…</p>
        </div>
      ) : file ? (
        <div className="flex flex-col items-center gap-3 py-2">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
            <FileText className="w-7 h-7 text-brand-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">{file.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); onFile(null); }}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center
                          group-hover:bg-brand-500/10 transition-colors">
            <Upload className="w-7 h-7 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">
              Drag & drop your resume <span className="text-brand-400">here</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">or click to browse — PDF only</p>
          </div>
        </div>
      )}
    </label>
  );
}
