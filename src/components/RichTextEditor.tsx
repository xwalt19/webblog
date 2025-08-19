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
  key?: string; // Added key prop for re-initialization
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className,
  readOnly = false,
  key,
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
    <div className={cn(className)}> {/* Removed prose dark:prose-invert max-w-none */}
      <ReactQuill
        key={key} // Apply the key prop here
        theme="snow"
        value={value}
        onChange={onChange}
        modules={readOnly ? { toolbar: false } : modules} // Disable toolbar if readOnly
        formats={formats}
        placeholder={placeholder}
        readOnly={readOnly}
        className="mt-1 bg-background"
      />
    </div>
  );
};

export default RichTextEditor;