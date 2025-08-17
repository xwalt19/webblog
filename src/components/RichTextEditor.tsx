"use client";

import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill's CSS
import { cn } from "@/lib/utils"; // Assuming cn utility is available

// Import Quill directly
import Quill from 'quill';

// Get Parchment from Quill
const Parchment = Quill.import('parchment');

// 1. Define a custom Attributor for the custom bullet type
// This will manage a 'data-custom-bullet' attribute on list items
const CustomBulletAttributor = new Parchment.Attributor('customBullet', 'data-custom-bullet', {
  scope: Parchment.Scope.BLOCK, // Apply to block elements (like list items)
});

// 2. Register the Attributor with Quill
Quill.register(CustomBulletAttributor, true);

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
  const quillRef = React.useRef<any>(null);

  // Custom handler for the custom bullet dropdown
  const customBulletHandler = (value: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const range = quill.getSelection();
    if (range) {
      const [leaf, offset] = quill.getLeaf(range.index);
      const listItem = quill.scroll.closest(leaf, 'list'); // Get the list item blot (Quill's internal representation of a DOM node)

      if (listItem) {
        const currentBullet = listItem.domNode.getAttribute('data-custom-bullet');
        if (currentBullet === value) {
          // If already has this custom bullet, remove it
          quill.format('customBullet', false, Quill.sources.USER);
        } else {
          // Apply the new custom bullet
          quill.format('customBullet', value, Quill.sources.USER);
          // Ensure it's a bullet list if not already
          if (quill.getFormat(range.index, range.length)['list'] !== 'bullet') {
            quill.format('list', 'bullet', Quill.sources.USER);
          }
        }
      } else {
        // If not a list item, convert to bullet list and apply custom bullet
        quill.format('list', 'bullet', Quill.sources.USER);
        setTimeout(() => { // Small delay to ensure list format is applied
          const [newLeaf, newOffset] = quill.getLeaf(range.index);
          const newListItem = quill.scroll.closest(newLeaf, 'list');
          if (newListItem) {
            newListItem.domNode.setAttribute('data-custom-bullet', value);
          }
        }, 0);
      }
    }
  };

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean'],
        [{ 'customBullet': ['star', 'checkmark'] }] // Custom dropdown for bullets
      ],
      handlers: {
        'customBullet': customBulletHandler,
      },
    },
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image',
    'customBullet', // Add customBullet to formats
  ];

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <ReactQuill
        key={key} // Apply the key prop here
        ref={quillRef} // Attach ref to access Quill editor instance
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