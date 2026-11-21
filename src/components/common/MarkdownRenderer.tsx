/**
 * MarkdownRenderer
 * Renders AI chat responses with:
 *  - Markdown formatting (bold, italic, headings, lists, horizontal rules)
 *  - Inline & Block Code: White text on dark/black background ("chữ trắng nền đen") with Copy button
 *  - Inline LaTeX math  → $expression$ (e.g., fractions, powers, Big-O)
 *  - Block  LaTeX math  → $$expression$$
 *
 * Uses react-markdown + remark-math + rehype-katex + katex CSS.
 */
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Copy, Check } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  text: string;
  className?: string;
}

// Code block component for preformatted code with dark background & white text
const CodeBlock: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [copied, setCopied] = useState(false);

  // Extract language & code content from inner <code> element
  const codeProps = (React.isValidElement(children) ? children.props : {}) as {
    className?: string;
    children?: React.ReactNode;
  };
  const className = codeProps.className || '';
  const match = /language-(\w+)/.exec(className);
  const language = match ? match[1] : '';
  const rawCode = String(codeProps.children || '').replace(/\n$/, '');

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="not-prose my-3 rounded-xl overflow-hidden border border-gray-800 bg-[#18181b] text-gray-100 shadow-md">
      {/* Header bar with language & copy button */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#202024] border-b border-gray-800 text-[11px] font-mono text-gray-400 select-none">
        <span className="uppercase tracking-wider font-semibold text-gray-300">
          {language || 'code'}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-gray-700/60"
          title="Sao chép mã"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Chép mã</span>
            </>
          )}
        </button>
      </div>

      {/* Code contents: white text on black background */}
      <pre className="p-3.5 sm:p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-gray-100 m-0 bg-[#18181b]">
        <code className="text-gray-100 font-mono">{rawCode}</code>
      </pre>
    </div>
  );
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  text,
  className = '',
}) => {
  if (!text) return null;

  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-current prose-headings:mt-3 prose-headings:mb-1
        prose-p:my-1 prose-p:leading-relaxed
        prose-ul:my-1 prose-ul:pl-5 prose-li:my-0.5
        prose-ol:my-1 prose-ol:pl-5
        prose-strong:font-bold prose-strong:text-current
        prose-hr:border-gray-200 dark:prose-hr:border-[#333]
        [&_.katex]:text-current [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-1.5
        ${className}`}
    >
      {/* Inline KaTeX CSS override to ensure fraction lines & math borders are always visible */}
      <style>{`
        .katex, .katex * {
          border-color: currentColor;
        }
        .katex .mfrac .frac-line,
        .katex .katex-hline,
        .katex .katex-overline .overline-line,
        .katex .katex-underline .underline-line {
          display: inline-block !important;
          width: 100% !important;
          border-bottom-style: solid !important;
          border-bottom-color: currentColor !important;
          border-bottom-width: max(1.25px, 0.05em) !important;
          min-height: 1.25px !important;
          box-sizing: content-box !important;
        }
      `}</style>

      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Block code rendered via CodeBlock: black background & white text
          pre: CodeBlock,
          // Inline code rendered with dark chip & white text
          code({ children, ...props }) {
            return (
              <code
                className="not-prose inline-block bg-[#1f242d] text-gray-100 dark:bg-[#18181b] dark:text-gray-100 px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-gray-700/60 align-baseline"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
