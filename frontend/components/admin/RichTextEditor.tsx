"use client";

import { useRef, useEffect, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link,
  Image as ImageIcon,
  Undo,
  Redo,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Type,
  Palette,
  Languages,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MediaLibraryPicker from "@/app/(admin)/admin/news/MediaLibraryPicker";

type Locale = 'vi' | 'en' | 'ja';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  globalLocale?: Locale;
  translateData?: (data: any, updateCallback: (translated: any) => void, sectionName?: string) => Promise<void>;
  translatingAll?: boolean;
  translateSourceLang?: Locale;
  setTranslateSourceLang?: (lang: Locale) => void;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  globalLocale = 'vi',
  translateData,
  translatingAll = false,
  translateSourceLang = 'vi',
  setTranslateSourceLang,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const isUpdatingRef = useRef(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const [showTranslateDialog, setShowTranslateDialog] = useState(false);
  const [translateText, setTranslateText] = useState("");
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [selectedImageRect, setSelectedImageRect] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  } | null>(null);
  const [controlPanelPosition, setControlPanelPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const resizingRef = useRef<{
    startX: number;
    startWidth: number;
  } | null>(null);

  // Lưu selection trước khi update
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current?.contains(selection.anchorNode)) {
      try {
        selectionRef.current = selection.getRangeAt(0).cloneRange();
        return true;
      } catch (e) {
        // Ignore nếu không thể clone
      }
    }
    return false;
  };

  // Khôi phục selection sau khi update
  const restoreSelection = () => {
    if (selectionRef.current && editorRef.current) {
      const selection = window.getSelection();
      if (selection) {
        try {
          selection.removeAllRanges();
          selection.addRange(selectionRef.current);
        } catch (e) {
          // Ignore nếu không thể restore
        }
      }
    }
  };

  // Khởi tạo editor với value ban đầu
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML && value) {
      editorRef.current.innerHTML = value;
    }
  }, []);

  // Sync value với editor nhưng không làm mất focus (chỉ khi value thay đổi từ bên ngoài)
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const currentContent = editorRef.current.innerHTML || "";
      const normalizedValue = value || "";
      
      // Chỉ update nếu value thay đổi từ bên ngoài (không phải từ user typing)
      if (currentContent !== normalizedValue && value !== undefined) {
        const wasFocused = document.activeElement === editorRef.current;
        const hadSelection = saveSelection();
        
        isUpdatingRef.current = true;
        editorRef.current.innerHTML = normalizedValue;
        
        // Khôi phục selection và focus sau một chút để đảm bảo DOM đã update
        requestAnimationFrame(() => {
          if (wasFocused && hadSelection) {
            restoreSelection();
            editorRef.current?.focus();
          }
          isUpdatingRef.current = false;
        });
      }
    }
  }, [value]);

  const execCommand = (command: string, commandValue?: string) => {
    if (editorRef.current) {
      editorRef.current.focus();
      saveSelection();
      document.execCommand(command, false, commandValue);
      isUpdatingRef.current = true;
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
      isUpdatingRef.current = false;
      setTimeout(() => {
        restoreSelection();
      }, 0);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (editorRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      const newValue = editorRef.current.innerHTML;
      // Chỉ update nếu thực sự thay đổi
      if (newValue !== value) {
        onChange(newValue);
      }
      isUpdatingRef.current = false;
    }
  };

  const addLink = () => {
    const url = window.prompt("Nhập URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const addImage = () => {
    const url = window.prompt("Nhập URL hình ảnh:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const setColor = (color: string) => {
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const setBackgroundColor = (color: string) => {
    execCommand("backColor", color);
    setShowColorPicker(false);
  };

  const commonColors = [
    { name: "Đen", value: "#000000" },
    { name: "Xám đậm", value: "#333333" },
    { name: "Xám", value: "#666666" },
    { name: "Xám nhạt", value: "#999999" },
    { name: "Trắng", value: "#FFFFFF" },
    { name: "Đỏ", value: "#EF4444" },
    { name: "Cam", value: "#F97316" },
    { name: "Vàng", value: "#EAB308" },
    { name: "Xanh lá", value: "#22C55E" },
    { name: "Xanh dương", value: "#3B82F6" },
    { name: "Tím", value: "#A855F7" },
    { name: "Hồng", value: "#EC4899" },
  ];

  const updateSelectedImageSize = (mode: "small" | "medium" | "large" | "full") => {
    if (!selectedImage) return;
    let width: string;
    switch (mode) {
      case "small":
        width = "40%";
        break;
      case "medium":
        width = "60%";
        break;
      case "large":
        width = "80%";
        break;
      case "full":
      default:
        width = "100%";
        break;
    }
    selectedImage.style.width = width;
    selectedImage.style.maxWidth = "100%";
    selectedImage.style.height = "auto";

    // Đồng bộ HTML mới ra ngoài
    if (editorRef.current) {
      const htmlAfter = editorRef.current.innerHTML || "";
      if (htmlAfter !== value) {
        onChange(htmlAfter);
      }
    }
  };

  const updateSelectedImageAlign = (align: "left" | "center" | "right") => {
    if (!selectedImage || !editorRef.current) return;

    const imgSrc = selectedImage.src;
    let parent = selectedImage.parentElement;
    
    // Xóa các style align cũ của ảnh
    selectedImage.style.marginLeft = "";
    selectedImage.style.marginRight = "";
    selectedImage.style.display = "";
    selectedImage.style.float = "";

    // Kiểm tra xem parent có phải là editor không
    const isDirectChild = !parent || parent === editorRef.current || parent.tagName === "BODY";
    
    if (isDirectChild) {
      // Tạo div wrapper mới để wrap ảnh
      const wrapper = document.createElement("div");
      wrapper.style.textAlign = align;
      wrapper.style.marginBottom = "1rem";
      wrapper.style.width = "100%";
      
      // Di chuyển ảnh vào wrapper
      if (selectedImage.parentNode) {
        selectedImage.parentNode.insertBefore(wrapper, selectedImage);
        wrapper.appendChild(selectedImage);
      }
      parent = wrapper;
    } else if (parent) {
      // Sử dụng parent hiện tại, nhưng đảm bảo nó là block element
      if (parent.tagName === "P" || parent.tagName === "DIV") {
        parent.style.textAlign = align;
        parent.style.width = "100%";
        if (!parent.style.marginBottom && parent.tagName === "DIV") {
          parent.style.marginBottom = "1rem";
        }
      } else {
        // Nếu parent không phải p/div, tạo wrapper mới
        const wrapper = document.createElement("div");
        wrapper.style.textAlign = align;
        wrapper.style.marginBottom = "1rem";
        wrapper.style.width = "100%";
        
        if (selectedImage.parentNode) {
          selectedImage.parentNode.insertBefore(wrapper, selectedImage);
          wrapper.appendChild(selectedImage);
        }
        parent = wrapper;
      }
    }

    // Đảm bảo ảnh hiển thị đúng với align
    selectedImage.style.display = "block";
    if (align === "center") {
      selectedImage.style.marginLeft = "auto";
      selectedImage.style.marginRight = "auto";
    } else if (align === "right") {
      selectedImage.style.marginLeft = "auto";
      selectedImage.style.marginRight = "0";
    } else {
      selectedImage.style.marginLeft = "0";
      selectedImage.style.marginRight = "auto";
    }

    // Đồng bộ HTML mới ra ngoài
    const htmlAfter = editorRef.current.innerHTML || "";
    if (htmlAfter !== value) {
      onChange(htmlAfter);
    }

    // Cập nhật lại selectedImage reference và vị trí sau khi DOM đã update
    requestAnimationFrame(() => {
      const newImage = editorRef.current?.querySelector(`img[src="${imgSrc}"]`) as HTMLImageElement;
      if (newImage) {
        setSelectedImage(newImage);
      }
    });
  };

  const updateSelectedImageRect = () => {
    if (!selectedImage || !editorRef.current) {
      setSelectedImageRect(null);
      setControlPanelPosition(null);
      return;
    }
    const imgRect = selectedImage.getBoundingClientRect();
    const editorRect = editorRef.current.getBoundingClientRect();
    const imageRect = {
      top: imgRect.top - editorRect.top,
      left: imgRect.left - editorRect.left,
      width: imgRect.width,
      height: imgRect.height,
      right: imgRect.right - editorRect.left,
      bottom: imgRect.bottom - editorRect.top,
    };
    setSelectedImageRect(imageRect);

    // Tính toán vị trí khối điều khiển (bên phải ảnh, hoặc bên dưới nếu không đủ chỗ)
    const controlPanelWidth = 220; // Ước tính chiều rộng khối điều khiển
    const controlPanelHeight = 80; // Ước tính chiều cao khối điều khiển
    const editorWidth = editorRect.width;
    const editorHeight = editorRect.height;
    const spaceRight = editorWidth - imageRect.right;
    const spaceBelow = editorHeight - imageRect.bottom;

    let panelTop = imageRect.top;
    let panelLeft = imageRect.right + 12;

    // Nếu không đủ chỗ bên phải, đặt bên dưới ảnh
    if (spaceRight < controlPanelWidth + 20) {
      panelLeft = imageRect.left;
      panelTop = imageRect.bottom + 12;
      // Nếu vẫn không đủ chỗ bên dưới, đặt bên trái ảnh
      if (spaceBelow < controlPanelHeight + 20 && imageRect.left > controlPanelWidth + 20) {
        panelLeft = imageRect.left - controlPanelWidth - 12;
        panelTop = imageRect.top;
      }
    }

    // Đảm bảo không tràn ra ngoài editor
    panelLeft = Math.max(12, Math.min(panelLeft, editorWidth - controlPanelWidth - 12));
    panelTop = Math.max(12, Math.min(panelTop, editorHeight - controlPanelHeight - 12));

    setControlPanelPosition({ top: panelTop, left: panelLeft });
  };

  // Cập nhật lại vị trí handle resize và khối điều khiển khi chọn ảnh mới
  useEffect(() => {
    if (!selectedImage) {
      setSelectedImageRect(null);
      setControlPanelPosition(null);
      return;
    }
    updateSelectedImageRect();
    const handle = () => updateSelectedImageRect();
    const handleScroll = () => updateSelectedImageRect();
    window.addEventListener("resize", handle);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", handle);
      window.removeEventListener("scroll", handleScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage]);

  const handleResizeMove = (event: MouseEvent) => {
    if (!selectedImage || !editorRef.current || !resizingRef.current) return;
    const { startX, startWidth } = resizingRef.current;
    const deltaX = event.clientX - startX;
    const newWidthPx = Math.max(40, startWidth + deltaX);
    const editorRect = editorRef.current.getBoundingClientRect();
    const editorWidth = editorRect.width || newWidthPx;
    const percent = Math.max(10, Math.min(100, (newWidthPx / editorWidth) * 100));

    selectedImage.style.width = `${percent}%`;
    selectedImage.style.maxWidth = "100%";
    selectedImage.style.height = "auto";

    // Đồng bộ HTML ra ngoài
    const htmlAfter = editorRef.current.innerHTML || "";
    if (htmlAfter !== value) {
      onChange(htmlAfter);
    }

    updateSelectedImageRect();
  };

  const stopResize = () => {
    window.removeEventListener("mousemove", handleResizeMove);
    window.removeEventListener("mouseup", stopResize);
    resizingRef.current = null;
  };

  const startResize = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedImage) return;
    const imgRect = selectedImage.getBoundingClientRect();
    resizingRef.current = {
      startX: e.clientX,
      startWidth: imgRect.width,
    };
    window.addEventListener("mousemove", handleResizeMove);
    window.addEventListener("mouseup", stopResize);
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden relative">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("undo")}
          title="Hoàn tác (Ctrl+Z)"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("redo")}
          title="Làm lại (Ctrl+Y)"
        >
          <Redo className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("bold")}
          title="Đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("italic")}
          title="Nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("underline")}
          title="Gạch chân (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("strikeThrough")}
          title="Gạch ngang"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "h1")}
          title="Tiêu đề 1"
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "h2")}
          title="Tiêu đề 2"
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "h3")}
          title="Tiêu đề 3"
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "h4")}
          title="Tiêu đề 4"
        >
          <Heading4 className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "p")}
          title="Đoạn văn"
        >
          <Type className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("justifyLeft")}
          title="Căn trái"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("justifyCenter")}
          title="Căn giữa"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("justifyRight")}
          title="Căn phải"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("justifyFull")}
          title="Căn đều"
        >
          <AlignJustify className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("insertUnorderedList")}
          title="Danh sách không đánh số"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("insertOrderedList")}
          title="Danh sách có số"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Special Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "blockquote")}
          title="Trích dẫn"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "pre")}
          title="Code block"
        >
          <Code className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Colors */}
        <Popover open={showColorPicker} onOpenChange={setShowColorPicker}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              title="Màu chữ"
            >
              <Palette className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Màu chữ</label>
                <div className="grid grid-cols-6 gap-2">
                  {commonColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 mb-2 block">Màu nền</label>
                <div className="grid grid-cols-6 gap-2">
                  {commonColors.map((color) => (
                    <button
                      key={`bg-${color.value}`}
                      type="button"
                      className="w-8 h-8 rounded border border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setBackgroundColor(color.value)}
                      title={`Nền ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        {/* Links & Images */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={addLink}
          title="Thêm liên kết"
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={addImage}
          title="Thêm hình ảnh bằng URL"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs font-medium"
          onClick={() => {
            // KHÔNG gọi saveSelection ở đây nữa để tránh ghi đè selection sang toolbar
            // Vị trí con trỏ đã được lưu khi user click/gõ trong editor
            setShowMediaDialog(true);
          }}
        >
          <ImageIcon className="w-3 h-3 mr-1" />
          Thư viện media
        </Button>
        {translateData && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-medium"
            onClick={() => {
              // Lấy text đã chọn hoặc toàn bộ nội dung
              const selection = window.getSelection();
              let selectedText = "";
              
              if (selection && selection.rangeCount > 0 && selection.toString().trim()) {
                // Có text được chọn
                selectedText = selection.toString();
              } else if (editorRef.current) {
                // Lấy toàn bộ text từ HTML (bỏ tags)
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = editorRef.current.innerHTML;
                selectedText = tempDiv.textContent || tempDiv.innerText || "";
              }
              
              setTranslateText(selectedText);
              setShowTranslateDialog(true);
            }}
          >
            <Languages className="w-3 h-3 mr-1" />
            Dịch thuật
          </Button>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={saveSelection}
        onFocus={restoreSelection}
        onMouseUp={(e) => {
          const target = e.target as HTMLElement | null;
          if (target && target.tagName === "IMG") {
            setSelectedImage(target as HTMLImageElement);
          } else {
            setSelectedImage(null);
          }
          saveSelection();
        }}
        onKeyUp={saveSelection}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        suppressContentEditableWarning
        data-placeholder={placeholder}
        style={{
          minHeight: "300px",
        }}
      />

      {/* Khối điều khiển kích thước ảnh - hiển thị bên cạnh ảnh */}
      {selectedImage && controlPanelPosition && (
        <div
          className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex flex-col gap-2 min-w-[200px]"
          style={{
            top: `${controlPanelPosition.top}px`,
            left: `${controlPanelPosition.left}px`,
          }}
        >
          <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
            Kích thước ảnh:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => updateSelectedImageSize("small")}
            >
              Nhỏ (40%)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => updateSelectedImageSize("medium")}
            >
              Trung bình (60%)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => updateSelectedImageSize("large")}
            >
              Lớn (80%)
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 px-2 text-[11px]"
              onClick={() => updateSelectedImageSize("full")}
            >
              Toàn chiều rộng (100%)
            </Button>
          </div>
          
          <div className="border-t border-gray-200 pt-2 mt-1">
            <span className="text-xs font-semibold text-gray-700 whitespace-nowrap block mb-1.5">
              Căn chỉnh vị trí:
            </span>
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => updateSelectedImageAlign("left")}
                title="Căn trái"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => updateSelectedImageAlign("center")}
                title="Căn giữa"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => updateSelectedImageAlign("right")}
                title="Căn phải"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Handle kéo resize ảnh (góc dưới bên phải ảnh) */}
      {selectedImage && selectedImageRect && (
        <div
          className="absolute w-3 h-3 bg-blue-500 border border-white rounded cursor-se-resize z-20"
          style={{
            top: selectedImageRect.bottom - 6,
            left: selectedImageRect.right - 6,
          }}
          onMouseDown={startResize}
        />
      )}
      
      <style jsx global>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>

      {/* Media Library Dialog */}
      <Dialog open={showMediaDialog} onOpenChange={setShowMediaDialog}>
        <DialogContent 
          className="w-full flex flex-col overflow-hidden"
          style={{ 
            maxWidth: "95vw", 
            width: "60vw",
            maxHeight: "90vh",
            height: "90vh"
          }}
        >
          <DialogHeader>
            <DialogTitle>Chọn ảnh từ thư viện media</DialogTitle>
          </DialogHeader>
          <div className="mt-2 overflow-y-auto" style={{ maxHeight: "calc(90vh - 100px)" }}>
            <MediaLibraryPicker
              onSelectImage={(url) => {
                setShowMediaDialog(false);

                if (editorRef.current) {
                  editorRef.current.focus();

                  try {
                    if (selectionRef.current) {
                      // Dùng Range API để chèn <img> tại đúng vị trí con trỏ
                      const range = selectionRef.current;
                      range.collapse(false);

                      const img = document.createElement("img");
                      img.src = url;
                      img.alt = "";
                      img.style.maxWidth = "100%";
                      img.style.height = "auto";

                      range.insertNode(img);

                      // Di chuyển caret ra sau ảnh
                      const newRange = document.createRange();
                      newRange.setStartAfter(img);
                      newRange.setEndAfter(img);
                      const sel = window.getSelection();
                      if (sel) {
                        sel.removeAllRanges();
                        sel.addRange(newRange);
                      }

                      // Cập nhật selectionRef sang vị trí mới
                      selectionRef.current = newRange;

                      const htmlAfter = editorRef.current.innerHTML || "";
                      if (htmlAfter !== value) {
                        onChange(htmlAfter);
                      }
                      return;
                    }
                  } catch {
                    // ignore, sẽ fallback phía dưới
                  }

                  // Fallback: nếu không có selection (chưa click vào nội dung)
                  // thì append ảnh vào cuối bài để luôn thấy ảnh
                  const currentHtml =
                    (editorRef.current.innerHTML &&
                    editorRef.current.innerHTML.trim().length > 0
                      ? editorRef.current.innerHTML
                      : value) || "";

                  const imgHtml = `<p><img src="${url}" alt="" /></p>`;
                  const mergedHtml = currentHtml
                    ? `${currentHtml}${imgHtml}`
                    : imgHtml;

                  editorRef.current.innerHTML = mergedHtml;
                  if (mergedHtml !== value) {
                    onChange(mergedHtml);
                  }
                } else {
                  // Fallback nếu vì lý do gì đó chưa có editorRef
                  const imgHtml = `<p><img src="${url}" alt="" /></p>`;
                  const mergedHtml = value ? `${value}${imgHtml}` : imgHtml;
                  onChange(mergedHtml);
                }
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Translate Dialog */}
      {translateData && (
        <Dialog open={showTranslateDialog} onOpenChange={setShowTranslateDialog}>
          <DialogContent style={{ width: "1200px", maxWidth: "95vw" }}>
            <DialogHeader>
              <DialogTitle>Dịch thuật nội dung</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Nội dung cần dịch ({translateSourceLang?.toUpperCase()})</Label>
                  {setTranslateSourceLang && (
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-600">Dịch từ:</Label>
                      <Select 
                        value={translateSourceLang} 
                        onValueChange={(val: Locale) => setTranslateSourceLang(val)}
                      >
                        <SelectTrigger className="w-[130px] h-8 text-xs" suppressHydrationWarning>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vi">🇻🇳 Tiếng Việt</SelectItem>
                          <SelectItem value="en">🇬🇧 English</SelectItem>
                          <SelectItem value="ja">🇯🇵 日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
                <Textarea
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                  placeholder="Nhập nội dung cần dịch..."
                  style={{ minHeight: "220px", height: "300px" }}
                  className="resize-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowTranslateDialog(false);
                    setTranslateText("");
                  }}
                  disabled={translatingAll}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={async () => {
                    if (!translateText.trim()) {
                      return;
                    }

                    // Tạo locale object với nội dung ở ngôn ngữ nguồn
                    const contentToTranslate = {
                      vi: translateSourceLang === 'vi' ? translateText : "",
                      en: translateSourceLang === 'en' ? translateText : "",
                      ja: translateSourceLang === 'ja' ? translateText : "",
                    };

                    await translateData(
                      { contentHtml: contentToTranslate },
                      (translated: any) => {
                        // Lấy nội dung đã dịch theo ngôn ngữ hiện tại
                        const translatedContent = translated.contentHtml?.[globalLocale] || translateText;
                        
                        if (editorRef.current && translatedContent) {
                          editorRef.current.focus();
                          
                          try {
                            if (selectionRef.current) {
                              // Chèn nội dung đã dịch tại vị trí con trỏ
                              const range = selectionRef.current;
                              range.collapse(false);
                              
                              // Tạo một div tạm để chuyển text thành HTML (giữ format)
                              const tempDiv = document.createElement("div");
                              tempDiv.innerHTML = translatedContent;
                              
                              // Chèn các node từ tempDiv vào editor
                              const fragment = document.createDocumentFragment();
                              while (tempDiv.firstChild) {
                                fragment.appendChild(tempDiv.firstChild);
                              }
                              
                              range.insertNode(fragment);
                              
                              // Di chuyển caret ra sau nội dung đã chèn
                              const newRange = document.createRange();
                              newRange.setStartAfter(fragment.lastChild || range.startContainer);
                              newRange.setEndAfter(fragment.lastChild || range.startContainer);
                              const sel = window.getSelection();
                              if (sel) {
                                sel.removeAllRanges();
                                sel.addRange(newRange);
                              }
                              
                              selectionRef.current = newRange;
                              
                              const htmlAfter = editorRef.current.innerHTML || "";
                              if (htmlAfter !== value) {
                                onChange(htmlAfter);
                              }
                            } else {
                              // Fallback: append vào cuối
                              const currentHtml = editorRef.current.innerHTML || value || "";
                              const mergedHtml = currentHtml ? `${currentHtml}${translatedContent}` : translatedContent;
                              editorRef.current.innerHTML = mergedHtml;
                              if (mergedHtml !== value) {
                                onChange(mergedHtml);
                              }
                            }
                          } catch (error) {
                            // Fallback: append vào cuối
                            const currentHtml = editorRef.current.innerHTML || value || "";
                            const mergedHtml = currentHtml ? `${currentHtml}${translatedContent}` : translatedContent;
                            editorRef.current.innerHTML = mergedHtml;
                            if (mergedHtml !== value) {
                              onChange(mergedHtml);
                            }
                          }
                        }
                        
                        setShowTranslateDialog(false);
                        setTranslateText("");
                      },
                      'Nội dung HTML'
                    );
                  }}
                  disabled={translatingAll || !translateText.trim()}
                  className="gap-2"
                >
                  {translatingAll ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Đang dịch...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Dịch và chèn vào editor</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}


