"use client";

import { useState, useEffect } from "react";
import { adminApiCall, AdminEndpoints, uploadFile, uploadFiles } from "@/lib/api/admin";
import { toast } from "sonner";
import { 
  Upload, 
  FolderPlus, 
  FolderTree,
  Edit, 
  Trash2, 
  Grid3x3, 
  List, 
  Search,
  Home,
  ChevronRight,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  MoreVertical,
  CheckSquare,
  Square
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildUrl } from "@/lib/api/base";

interface MediaFolder {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  fileCount: number;
  children?: MediaFolder[];
}

interface MediaFile {
  id: number;
  folder_id: number | null;
  filename: string;
  original_name: string;
  file_path: string;
  file_url: string;
  file_type: string;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  alt_text: string | null;
  description: string | null;
  uploaded_by_name: string | null;
  created_at: string;
}

export default function MediaLibraryPage() {
  const [folders, setFolders] = useState<MediaFolder[]>([]);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [fileTypeFilter, setFileTypeFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [selectedFiles, setSelectedFiles] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Dialogs
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showEditFolder, setShowEditFolder] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingFolder, setEditingFolder] = useState<MediaFolder | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParent, setNewFolderParent] = useState<number | null>(null);
  
  // Load folders tree
  const loadFolders = async () => {
    try {
      const data = await adminApiCall<{ data: MediaFolder[] }>(
        AdminEndpoints.media.folders.tree
      );
      setFolders(data.data || []);
    } catch (error: any) {
      console.error("Load folders error:", error);
      const errorMsg = error?.message || "Không thể tải danh sách thư mục";
      toast.error(errorMsg);
      // Nếu lỗi 404, có thể do chưa có bảng
      if (errorMsg.includes("404") || errorMsg.includes("not found")) {
        toast.error("Vui lòng chạy: npm run setup-media trong thư mục backend");
      }
    }
  };
  
  // Load files
  const loadFiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedFolder !== null) {
        params.append("folder_id", selectedFolder.toString());
      } else {
        params.append("folder_id", "null");
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }
      if (fileTypeFilter !== "all") {
        params.append("file_type", fileTypeFilter);
      }
      params.append("sort_by", sortBy);
      params.append("sort_order", "DESC");
      params.append("page", "1");
      params.append("limit", "100");
      
      const data = await adminApiCall<{ data: MediaFile[]; pagination: any }>(
        `${AdminEndpoints.media.files.list}?${params.toString()}`
      );
      setFiles(data.data || []);
    } catch (error: any) {
      console.error("Load files error:", error);
      const errorMsg = error?.message || "Không thể tải danh sách file";
      toast.error(errorMsg);
      // Nếu lỗi 404, có thể do chưa có bảng
      if (errorMsg.includes("404") || errorMsg.includes("not found") || errorMsg.includes("relation") || errorMsg.includes("does not exist")) {
        toast.error("Vui lòng chạy: npm run setup-media trong thư mục backend");
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadFolders();
  }, []);
  
  useEffect(() => {
    loadFiles();
  }, [selectedFolder, searchQuery, fileTypeFilter, sortBy]);
  
  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Vui lòng nhập tên thư mục");
      return;
    }
    
    try {
      const result = await adminApiCall(AdminEndpoints.media.folders.list, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parent_id: newFolderParent,
        }),
      });
      toast.success("Đã tạo thư mục thành công");
      setShowCreateFolder(false);
      setNewFolderName("");
      setNewFolderParent(null);
      loadFolders();
    } catch (error: any) {
      console.error("Create folder error:", error);
      const errorMsg = error?.message || "Không thể tạo thư mục";
      toast.error(errorMsg);
      // Nếu lỗi 404, có thể do chưa có bảng
      if (errorMsg.includes("404") || errorMsg.includes("not found") || errorMsg.includes("relation") || errorMsg.includes("does not exist")) {
        toast.error("Vui lòng chạy: npm run setup-media trong thư mục backend");
      }
    }
  };
  
  // Delete folder
  const handleDeleteFolder = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa thư mục này?")) return;
    try {
      await adminApiCall(AdminEndpoints.media.folders.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa thư mục thành công");
      loadFolders();
      if (selectedFolder === id) {
        setSelectedFolder(null);
      }
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa thư mục");
    }
  };
  
  // Upload files
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    try {
      setUploading(true);
      const fileArray = Array.from(files);
      
      if (fileArray.length === 1) {
        const result = await uploadFile(fileArray[0], selectedFolder || undefined);
        toast.success("Upload file thành công");
      } else {
        const results = await uploadFiles(fileArray, selectedFolder || undefined);
        toast.success(`Đã upload ${results.length} file thành công`);
      }
      
      setShowUpload(false);
      loadFiles();
    } catch (error: any) {
      toast.error(error?.message || "Không thể upload file");
    } finally {
      setUploading(false);
    }
  };
  
  // Delete file
  const handleDeleteFile = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa file này?")) return;
    try {
      await adminApiCall(AdminEndpoints.media.files.detail(id), {
        method: "DELETE",
      });
      toast.success("Đã xóa file thành công");
      loadFiles();
    } catch (error: any) {
      toast.error(error?.message || "Không thể xóa file");
    }
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };
  
  // Get file icon
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "image":
        return ImageIcon;
      case "document":
        return FileText;
      case "video":
        return Video;
      case "audio":
        return Music;
      default:
        return FileText;
    }
  };
  
  // Render folder tree
  const renderFolderTree = (folderList: MediaFolder[], level = 0) => {
    return folderList.map((folder) => (
      <div key={folder.id} className="select-none">
        <div
          className={`flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer ${
            selectedFolder === folder.id ? "bg-blue-50" : ""
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => setSelectedFolder(folder.id)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <FolderTree className="w-4 h-4 text-blue-600" />
            <span className="text-sm truncate">{folder.name}</span>
            <span className="text-xs text-gray-500">({folder.fileCount})</span>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                setEditingFolder(folder);
                setNewFolderName(folder.name);
                setNewFolderParent(folder.parent_id);
                setShowEditFolder(true);
              }}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-600"
              onClick={() => handleDeleteFolder(folder.id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
        {folder.children && folder.children.length > 0 && (
          <div>{renderFolderTree(folder.children, level + 1)}</div>
        )}
      </div>
    ));
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Thư viện Media</h1>
          <p className="text-gray-500 mt-1">Quản lý file và thư mục media</p>
        </div>
        <Button onClick={() => setShowUpload(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Tải lên Media
        </Button>
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Folders */}
        <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Thư mục</h2>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setNewFolderParent(selectedFolder);
                  setShowCreateFolder(true);
                }}
              >
                <FolderPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-1">
            <div
              className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer ${
                selectedFolder === null ? "bg-blue-50" : ""
              }`}
              onClick={() => setSelectedFolder(null)}
            >
              <Home className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Root</span>
            </div>
            {renderFolderTree(folders)}
          </div>
        </div>
        
        {/* Right Panel - Media Library */}
        <div className="col-span-9 bg-white rounded-lg border border-gray-200 p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Home className="w-4 h-4" />
            <span>Root</span>
          </div>
          
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm tệp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tất cả loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="image">Hình ảnh</SelectItem>
                  <SelectItem value="document">Tài liệu</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Ngày tạo</SelectItem>
                  <SelectItem value="original_name">Tên (A -&gt; Z)</SelectItem>
                  <SelectItem value="file_size">Kích thước</SelectItem>
                  <SelectItem value="file_type">Loại file</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Selection info */}
          {selectedFiles.size > 0 && (
            <div className="mb-4 text-sm text-gray-600">
              Đã chọn {selectedFiles.size} file
            </div>
          )}
          
          {/* Files Grid/List */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Đang tải...</div>
          ) : files.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không có file nào trong thư mục này
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-4 gap-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.file_type);
                const isSelected = selectedFiles.has(file.id);
                const imageUrl = file.file_url.startsWith("/")
                  ? buildUrl(file.file_url)
                  : file.file_url;
                
                return (
                  <div
                    key={file.id}
                    className={`relative group border rounded-lg overflow-hidden cursor-pointer ${
                      isSelected ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => {
                      const newSelected = new Set(selectedFiles);
                      if (isSelected) {
                        newSelected.delete(file.id);
                      } else {
                        newSelected.add(file.id);
                      }
                      setSelectedFiles(newSelected);
                    }}
                  >
                    <div className="absolute top-2 left-2 z-10">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 bg-white rounded" />
                      ) : (
                        <Square className="w-5 h-5 text-white bg-black/50 rounded" />
                      )}
                    </div>
                    
                    {file.file_type === "image" ? (
                      <img
                        src={imageUrl}
                        alt={file.alt_text || file.original_name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <FileIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="p-3">
                      <div className="text-xs font-medium truncate">{file.original_name}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {file.file_type === "image" ? "Hình ảnh" : file.file_type}
                      </div>
                      <div className="text-xs text-gray-500">{formatFileSize(file.file_size)}</div>
                    </div>
                    
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.file_type);
                const isSelected = selectedFiles.has(file.id);
                
                return (
                  <div
                    key={file.id}
                    className={`flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50 border-blue-500" : ""
                    }`}
                    onClick={() => {
                      const newSelected = new Set(selectedFiles);
                      if (isSelected) {
                        newSelected.delete(file.id);
                      } else {
                        newSelected.add(file.id);
                      }
                      setSelectedFiles(newSelected);
                    }}
                  >
                    {isSelected ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                    <FileIcon className="w-8 h-8 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{file.original_name}</div>
                      <div className="text-sm text-gray-500">
                        {formatFileSize(file.file_size)} • {file.file_type}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-4 text-sm text-gray-500">
            Tổng cộng {files.length} files
          </div>
        </div>
      </div>
      
      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tạo thư mục mới</DialogTitle>
            <DialogDescription>
              Tạo thư mục mới để tổ chức file của bạn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Tên thư mục</Label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Nhập tên thư mục..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
              Tạo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tải lên Media</DialogTitle>
            <DialogDescription>
              Chọn file để upload vào thư mục hiện tại
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="file"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              disabled={uploading}
            />
            {uploading && <div className="text-sm text-gray-500">Đang upload...</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpload(false)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
