"use client";

import { useState } from "react";
import { PDFParse } from "pdf-parse";

interface FileUploaderProps {
  onFileSelect: (text: string, file: File) => void;
}

export default function FileUploader({ onFileSelect }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const readFileAsText = async (file: File): Promise<string> => {
    if (file.type === "text/plain") {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      });
    } else if (file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = (await new PDFParse(arrayBuffer as any)) as any;
      return pdf.text;
    }

    throw new Error("不支持的文件类型（仅支持 .txt 和 .pdf）");
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const text = await readFileAsText(file);
      onFileSelect(text, file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const text = await readFileAsText(file);
      onFileSelect(text, file);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        accept=".txt,.pdf"
        onChange={handleFileInput}
        className="hidden"
      />
      <p className="text-gray-600">
        {isDragging ? "松开上传文件" : "拖拽合同文件到此处，或点击选择"}
      </p>
      <p className="text-sm text-gray-500 mt-2">支持 .txt 格式（PDF 即将支持）</p>
    </div>
  );
}
