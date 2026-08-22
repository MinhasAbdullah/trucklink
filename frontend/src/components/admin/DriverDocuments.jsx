import React from "react";
import { ExternalLink, FileText, FileWarning } from "lucide-react";

const DriverDocuments = ({ documents }) => {
  if (!Array.isArray(documents) || documents.length === 0) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-[#fff8e8] p-5">
        <div className="flex gap-3">
          <FileWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <div>
            <h3 className="font-bold text-[#6c5520]">Documents are not exposed by the backend API</h3>
            <p className="mt-1 text-sm leading-6 text-[#7c6a40]">
              The project brief calls for document review, but the current moderation queue serializer does not include documents and there is no document list/detail endpoint. No dummy files are displayed.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#e6dfcb] bg-white p-5">
      <h3 className="font-bold text-[#29483a]">Submitted documents</h3>
      <div className="mt-4 space-y-2">
        {documents.map((document) => (
          <div
            key={document.id || `${document.doc_type}-${document.file}`}
            className="flex items-center justify-between gap-3 rounded-xl border border-[#e7ece8] bg-[#f8faf8] p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f1e9]">
                <FileText className="h-4 w-4 text-[#2d6a4f]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold capitalize text-[#2d493c]">
                  {(document.doc_type || "document").replaceAll("_", " ")}
                </p>
                {document.uploaded_at && (
                  <p className="text-xs text-[#829087]">
                    Uploaded {new Date(document.uploaded_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            {document.file && (
              <a
                href={document.file}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-[#2d6a4f] hover:bg-[#e5f1e9]"
              >
                Open <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default DriverDocuments;
