import React, { useState } from 'react';
import { uploadToCloudinary } from '../api';
import { Upload, CheckCircle2, FileText, Image as ImageIcon, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function CloudinaryUploader({ folder = 'trucklink_docs', onUploadSuccess, label = "Upload Image or Document" }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadToCloudinary(file, folder);
      if (res.data && res.data.url) {
        setUploadResult(res.data);
        if (onUploadSuccess) {
          onUploadSuccess(res.data.url, res.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Ensure backend server is running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 transition-all">
      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </label>

      {!uploadResult ? (
        <div className="relative border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-slate-950/40 group">
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            )}
            <p className="text-sm font-medium text-slate-300">
              {isUploading ? 'Uploading to Cloudinary...' : 'Drag & drop file or click to browse'}
            </p>
            <p className="text-xs text-slate-500">Supports PNG, JPG, WEBP, PDF (Direct Cloud Storage)</p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            {uploadResult.resource_type === 'image' ? (
              <img src={uploadResult.url} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-700" />
            ) : (
              <div className="w-10 h-10 rounded bg-cyan-950/60 border border-cyan-800 flex items-center justify-center text-cyan-400">
                <FileText className="w-5 h-5" />
              </div>
            )}
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Cloudinary Uploaded
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                  {uploadResult.mode || 'Cloudinary'}
                </span>
              </div>
              <p className="text-xs text-slate-300 truncate font-mono mt-0.5">{uploadResult.url}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(uploadResult.url);
              alert('Cloudinary URL copied to clipboard!');
            }}
            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-900 rounded transition-colors"
            title="Copy URL"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && <p className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}
