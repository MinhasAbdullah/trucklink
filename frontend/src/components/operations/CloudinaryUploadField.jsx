import React, { useRef, useState } from "react";
import { FileUp, Loader2, ExternalLink } from "lucide-react";
import { operationsApi } from "../../api/operations";
import { getApiErrorMessage } from "../../api/client";

const CloudinaryUploadField = ({ label, value, onChange, folder, accept = "*/*" }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { data } = await operationsApi.uploadFile(file, folder);
      if (!data?.url) throw new Error("Unable to complete the upload.");
      onChange(data.url);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to upload file."));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-[#52675c]">{label}</span>
      <div className="rounded-xl border-2 border-dashed border-[#d9e5de] bg-[#fbfdfb] p-3">
        <input ref={inputRef} type="file" accept={accept} onChange={upload} className="hidden" />
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2d6a4f] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload"}
          </button>
          {value ? (
            <a href={value} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 truncate text-xs font-semibold text-[#2d6a4f] hover:underline">
              File uploaded <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : <span className="text-xs text-[#8aa89a]">No file uploaded</span>}
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default CloudinaryUploadField;
