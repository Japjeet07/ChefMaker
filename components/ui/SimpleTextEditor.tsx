"use client";

import React from 'react';

interface SimpleTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleTextEditor: React.FC<SimpleTextEditorProps> = ({
  content = '',
  onChange,
  placeholder = 'Start writing your blog post...',
  className = ''
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`glass-effect rounded-2xl overflow-hidden ${className}`}>
      {/* Simple toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-black/20">
        <div className="text-white text-sm">
          💡 Tip: Use **bold**, *italic*, and line breaks for formatting
        </div>
      </div>

      {/* Textarea */}
      <div className="min-h-[200px]">
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-full p-4 bg-transparent text-white placeholder-gray-300 focus:outline-none resize-none"
          style={{ minHeight: '200px' }}
        />
      </div>
    </div>
  );
};

export default SimpleTextEditor;
