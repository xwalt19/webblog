"use client";

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  componentKey?: string; // Changed from 'key' to 'componentKey'
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  readOnly = false,
  componentKey, // Destructure componentKey
}) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className={cn(className)}>
      <ReactQuill
        key={componentKey} // Use componentKey here
        theme="snow"
        value={value}
        onChange={onChange}
        modules={readOnly ? { toolbar: false } : modules} // Disable toolbar if readOnly
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        className="mt-1 bg-background min-h-[120px]" // Add min-h here
      />
    </div>
  );
};

export default RichTextEditor;