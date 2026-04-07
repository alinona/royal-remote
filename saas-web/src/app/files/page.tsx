"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FolderOpen, File, FileText, Sheet, Upload, Plus,
  Search, Grid, List, Download, Trash2, Share2, Eye,
  ChevronRight, Home, ArrowLeft, X, HardDrive,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { AppLayout } from "@/components/layout/app-layout";
import { Stagger, StaggerItem, FadeIn } from "@/components/ui/motion";
import { cn } from "@/lib/utils/cn";
import { mockFiles, mockFolders } from "@/lib/utils/mock-data";
import { formatDate, formatFileSize } from "@/lib/utils/format";
import type { FileItem, Folder, FileType } from "@/types";

// ─── File Icons ───────────────────────────────────────────────────────────────

const fileTypeConfig: Record<FileType, { icon: React.ElementType; color: string; bg: string }> = {
  document:    { icon: FileText, color: "text-blue-600",   bg: "bg-blue-50" },
  spreadsheet: { icon: Sheet,    color: "text-green-600",  bg: "bg-green-50" },
  pdf:         { icon: File,     color: "text-red-600",    bg: "bg-red-50" },
  image:       { icon: File,     color: "text-purple-600", bg: "bg-purple-50" },
  video:       { icon: File,     color: "text-pink-600",   bg: "bg-pink-50" },
  audio:       { icon: File,     color: "text-amber-600",  bg: "bg-amber-50" },
  archive:     { icon: File,     color: "text-gray-600",   bg: "bg-gray-50" },
  other:       { icon: File,     color: "text-ink-muted",  bg: "bg-surface-100" },
};

// ─── Files Page ───────────────────────────────────────────────────────────────

export default function FilesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Folder[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) { clearInterval(interval); setUploading(false); return 0; }
        return p + 10;
      });
    }, 200);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    onDragEnter: () => setDragOver(true),
    onDragLeave: () => setDragOver(false),
  });

  const navigateToFolder = (folder: Folder) => {
    setBreadcrumbs(prev => [...prev, folder]);
    setCurrentFolder(folder);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setBreadcrumbs([]);
      setCurrentFolder(null);
    } else {
      setBreadcrumbs(prev => prev.slice(0, index + 1));
      setCurrentFolder(breadcrumbs[index]);
    }
  };

  const filteredFolders = mockFolders.filter(f =>
    !search || f.name.includes(search)
  );
  const filteredFiles = mockFiles
    .filter(f => !currentFolder || f.parentId === currentFolder.id)
    .filter(f => !search || f.name.includes(search));

  const totalSize = mockFiles.reduce((acc, f) => acc + f.size, 0);

  return (
    <AppLayout title="إدارة الملفات">
      <div {...getRootProps()} className="space-y-6 relative">
        <input {...getInputProps()} />

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-primary/10 backdrop-blur-sm flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-card rounded-3xl border-2 border-dashed border-primary p-12 text-center"
              >
                <Upload className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-xl font-bold text-ink">أفلت الملفات هنا</p>
                <p className="text-sm text-ink-muted mt-2">يتم الرفع تلقائيًا</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Storage stats */}
        <Stagger className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "المساحة المستخدمة", value: formatFileSize(totalSize), icon: HardDrive, color: "text-primary-600 bg-primary-50" },
            { label: "إجمالي الملفات", value: mockFiles.length.toString(), icon: File, color: "text-blue-600 bg-blue-50" },
            { label: "المجلدات", value: mockFolders.length.toString(), icon: FolderOpen, color: "text-amber-600 bg-amber-50" },
          ].map((stat, i) => (
            <StaggerItem key={stat.label}>
              <div className="card-base p-4 flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", stat.color.split(" ")[1])}>
                  <stat.icon className={cn("w-5 h-5", stat.color.split(" ")[0])} strokeWidth={1.8} />
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-ink">{stat.value}</p>
                  <p className="text-xs text-ink-muted">{stat.label}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Toolbar */}
        <FadeIn delay={0.1}>
          <div className="card-base p-4">
            <div className="flex items-center gap-3">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1 flex-1 text-sm">
                <button
                  onClick={() => navigateToBreadcrumb(-1)}
                  className="flex items-center gap-1 text-ink-muted hover:text-ink transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>الملفات</span>
                </button>
                {breadcrumbs.map((crumb, i) => (
                  <div key={crumb.id} className="flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-ink-subtle" />
                    <button
                      onClick={() => navigateToBreadcrumb(i)}
                      className="text-ink-muted hover:text-ink transition-colors"
                    >
                      {crumb.name}
                    </button>
                  </div>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="بحث في الملفات..."
                  className="input-base pr-9 w-48 text-right"
                  dir="rtl"
                />
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-surface-50 border border-border rounded-xl p-1">
                <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-lg transition-all", view === "grid" ? "bg-white shadow-card text-ink" : "text-ink-muted")}>
                  <Grid className="w-4 h-4" />
                </button>
                <button onClick={() => setView("list")} className={cn("p-1.5 rounded-lg transition-all", view === "list" ? "bg-white shadow-card text-ink" : "text-ink-muted")}>
                  <List className="w-4 h-4" />
                </button>
              </div>

              <motion.button
                onClick={() => { setUploading(true); setTimeout(() => setUploading(false), 2000); }}
                className="btn-secondary gap-2 text-sm"
                whileTap={{ scale: 0.97 }}
              >
                <Upload className="w-4 h-4" />
                رفع ملف
              </motion.button>
              <motion.button className="btn-primary gap-2 text-sm" whileTap={{ scale: 0.97 }}>
                <Plus className="w-4 h-4" />
                مجلد جديد
              </motion.button>
            </div>

            {/* Upload progress */}
            <AnimatePresence>
              {uploading && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-primary rounded-full"
                          animate={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <span className="text-xs text-ink-muted w-10 text-left">{uploadProgress}%</span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1 text-right">جارٍ رفع الملف...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </FadeIn>

        {/* Files Content */}
        {view === "grid" ? (
          <div className="space-y-4">
            {/* Folders */}
            {!currentFolder && filteredFolders.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-ink-muted mb-3 text-right">المجلدات</h3>
                <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredFolders.map(folder => (
                    <StaggerItem key={folder.id}>
                      <FolderCard folder={folder} onClick={() => navigateToFolder(folder)} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            )}

            {/* Files */}
            {filteredFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-ink-muted mb-3 text-right">الملفات</h3>
                <Stagger className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredFiles.map(file => (
                    <StaggerItem key={file.id}>
                      <FileCard file={file} onClick={() => setPreviewFile(file)} />
                    </StaggerItem>
                  ))}
                </Stagger>
              </div>
            )}
          </div>
        ) : (
          <FileListView
            folders={!currentFolder ? filteredFolders : []}
            files={filteredFiles}
            onFolderClick={navigateToFolder}
            onFileClick={setPreviewFile}
          />
        )}
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <FilePreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

// ─── Folder Card ──────────────────────────────────────────────────────────────

function FolderCard({ folder, onClick }: { folder: Folder; onClick: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      className="card-base p-4 cursor-pointer hover:shadow-card-hover text-right"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
        style={{ background: folder.color + "20", border: `1px solid ${folder.color}40` }}
      >
        <FolderOpen className="w-5 h-5" style={{ color: folder.color }} strokeWidth={1.8} />
      </div>
      <h3 className="text-sm font-semibold text-ink truncate">{folder.name}</h3>
      <p className="text-xs text-ink-muted mt-1">
        {folder.filesCount} ملف · {formatFileSize(folder.size)}
      </p>
    </motion.div>
  );
}

// ─── File Card ────────────────────────────────────────────────────────────────

function FileCard({ file, onClick }: { file: FileItem; onClick: () => void }) {
  const config = fileTypeConfig[file.type];
  return (
    <motion.div
      onClick={onClick}
      className="card-base p-4 cursor-pointer hover:shadow-card-hover text-right group"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", config.bg)}>
        <config.icon className={cn("w-5 h-5", config.color)} strokeWidth={1.8} />
      </div>
      <h3 className="text-xs font-semibold text-ink truncate">{file.name}</h3>
      <p className="text-[11px] text-ink-muted mt-1">{formatFileSize(file.size)}</p>
      <p className="text-[11px] text-ink-subtle mt-0.5">{formatDate(file.updatedAt)}</p>

      <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1 rounded hover:bg-surface-100 text-ink-muted hover:text-ink">
          <Eye className="w-3 h-3" />
        </button>
        <button className="p-1 rounded hover:bg-surface-100 text-ink-muted hover:text-ink">
          <Download className="w-3 h-3" />
        </button>
        <button className="p-1 rounded hover:bg-surface-100 text-ink-muted hover:text-ink">
          <Share2 className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// ─── File List View ───────────────────────────────────────────────────────────

function FileListView({
  folders, files, onFolderClick, onFileClick,
}: {
  folders: Folder[];
  files: FileItem[];
  onFolderClick: (f: Folder) => void;
  onFileClick: (f: FileItem) => void;
}) {
  return (
    <FadeIn>
      <div className="card-base overflow-hidden">
        <div className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-3 border-b border-border bg-surface-50">
          {["الاسم", "الحجم", "آخر تعديل", ""].map(h => (
            <span key={h} className="text-[11px] font-semibold text-ink-muted uppercase tracking-wide text-right">{h}</span>
          ))}
        </div>

        <div className="divide-y divide-border">
          {folders.map((folder, i) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onFolderClick(folder)}
              className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-3 hover:bg-surface-50 cursor-pointer items-center transition-colors"
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="w-4 h-4 flex-shrink-0" style={{ color: folder.color }} />
                <span className="text-sm font-medium text-ink">{folder.name}</span>
              </div>
              <span className="text-sm text-ink-muted text-right">{formatFileSize(folder.size)}</span>
              <span className="text-sm text-ink-muted text-right">{formatDate(folder.createdAt)}</span>
              <div />
            </motion.div>
          ))}

          {files.map((file, i) => {
            const config = fileTypeConfig[file.type];
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (folders.length + i) * 0.03 }}
                onClick={() => onFileClick(file)}
                className="grid grid-cols-[2fr_1fr_1fr_80px] gap-4 px-5 py-3 hover:bg-surface-50 cursor-pointer items-center transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <config.icon className={cn("w-4 h-4 flex-shrink-0", config.color)} />
                  <span className="text-sm font-medium text-ink truncate">{file.name}</span>
                </div>
                <span className="text-sm text-ink-muted text-right">{formatFileSize(file.size)}</span>
                <span className="text-sm text-ink-muted text-right">{formatDate(file.updatedAt)}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 rounded hover:bg-surface-100 text-ink-muted hover:text-ink">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 rounded hover:bg-red-50 text-ink-muted hover:text-danger">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </FadeIn>
  );
}

// ─── File Preview Modal ───────────────────────────────────────────────────────

function FilePreviewModal({ file, onClose }: { file: FileItem; onClose: () => void }) {
  const config = fileTypeConfig[file.type];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-4 top-16 bottom-4 z-50 max-w-4xl mx-auto bg-card rounded-2xl border border-border shadow-card-hover overflow-hidden flex flex-col"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-50 text-ink-muted hover:text-ink">
            <X className="w-4 h-4" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="btn-secondary text-sm gap-2">
              <Share2 className="w-3.5 h-3.5" />
              مشاركة
            </button>
            <button className="btn-secondary text-sm gap-2">
              <Download className="w-3.5 h-3.5" />
              تحميل
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", config.bg)}>
              <config.icon className={cn("w-4 h-4", config.color)} />
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-ink">{file.name}</p>
              <p className="text-xs text-ink-muted">{formatFileSize(file.size)} · {formatDate(file.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 flex items-center justify-center bg-surface-50 p-8">
          <div className="text-center">
            <div className={cn("w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-4", config.bg)}>
              <config.icon className={cn("w-12 h-12", config.color)} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium text-ink">{file.name}</p>
            <p className="text-xs text-ink-muted mt-1">معاينة الملف غير متاحة في وضع العرض التجريبي</p>
            <div className="flex items-center gap-3 mt-6 justify-center">
              <button className="btn-secondary text-sm">فتح في محرر جديد</button>
              <button className="btn-primary text-sm">تحميل الملف</button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
