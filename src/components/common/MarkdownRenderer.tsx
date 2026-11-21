/**
 * MarkdownRenderer
 * Renders AI chat responses with:
 *  - Markdown formatting (bold, italic, headings, lists, horizontal rules, code)
 *  - Inline LaTeX math  → $expression$
 *  - Block  LaTeX math  → $$expression$$
 *
 * Uses react-markdown + remark-math + rehype-katex + katex CSS.
 */
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  text,
  className = '',
}) => {
  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-current prose-headings:mt-3 prose-headings:mb-1
        prose-p:my-1 prose-p:leading-relaxed
        prose-ul:my-1 prose-ul:pl-5 prose-li:my-0.5
        prose-ol:my-1 prose-ol:pl-5
        prose-code:bg-gray-100 dark:prose-code:bg-[#2A2A2A] prose-code:text-pink-600 dark:prose-code:text-pink-400
        prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.82em] prose-code:font-mono
        prose-pre:bg-gray-100 dark:prose-pre:bg-[#1A1A1A] prose-pre:rounded-xl prose-pre:overflow-x-auto
        prose-strong:font-bold prose-strong:text-current
        prose-hr:border-gray-200 dark:prose-hr:border-[#333]
        [&_.katex]:text-current [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
