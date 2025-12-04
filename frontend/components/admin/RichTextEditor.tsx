"use client";

import { useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = (command: string, commandValue?: string) => {
    document.execCommand(command, false, commandValue);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
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

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("bold")}
          title="Đậm"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("italic")}
          title="Nghiêng"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("underline")}
          title="Gạch chân"
        >
          <Underline className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

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

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("insertUnorderedList")}
          title="Danh sách"
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
          title="Thêm hình ảnh"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-8 bg-gray-300 mx-1" />

        <select
          className="h-8 px-2 text-sm border-0 bg-transparent rounded hover:bg-gray-100"
          onChange={(e) => execCommand("formatBlock", e.target.value)}
          defaultValue=""
        >
          <option value="">Định dạng</option>
          <option value="h1">Tiêu đề 1</option>
          <option value="h2">Tiêu đề 2</option>
          <option value="h3">Tiêu đề 3</option>
          <option value="p">Đoạn văn</option>
        </select>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[300px] p-4 focus:outline-none prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: value }}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />
    </div>
  );
}


