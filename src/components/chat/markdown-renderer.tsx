'use client';

import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';

export const MarkdownRenderer = memo(function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-ar max-w-none text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className, ...rest } = props as {
              children?: React.ReactNode;
              className?: string;
            };
            const match = /language-(\w+)/.exec(className ?? '');
            const isInline = !className;
            if (isInline) {
              return (
                <code
                  className="rounded bg-[color:var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[0.85em]"
                  {...rest}
                >
                  {children}
                </code>
              );
            }
            return <CodeBlock language={match?.[1]} code={String(children).replace(/\n$/, '')} />;
          },
          a(props) {
            const { href, children } = props;
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[color:var(--accent)] underline-offset-4 hover:underline"
              >
                {children}
              </a>
            );
          },
          p(props) {
            return <p className="my-3 whitespace-pre-wrap">{props.children}</p>;
          },
          ul(props) {
            return <ul className="my-3 list-disc space-y-1 pe-6">{props.children}</ul>;
          },
          ol(props) {
            return <ol className="my-3 list-decimal space-y-1 pe-6">{props.children}</ol>;
          },
          h1(props) {
            return <h1 className="my-4 text-xl font-semibold">{props.children}</h1>;
          },
          h2(props) {
            return <h2 className="my-4 text-lg font-semibold">{props.children}</h2>;
          },
          h3(props) {
            return <h3 className="my-3 text-base font-semibold">{props.children}</h3>;
          },
          blockquote(props) {
            return (
              <blockquote className="my-3 border-s-2 border-[color:var(--accent)]/40 ps-4 text-[color:var(--muted)]">
                {props.children}
              </blockquote>
            );
          },
          table(props) {
            return (
              <div className="my-3 overflow-x-auto">
                <table className="w-full border-collapse text-sm">{props.children}</table>
              </div>
            );
          },
          th(props) {
            return <th className="border border-[color:var(--border)] px-3 py-1.5 text-start">{props.children}</th>;
          },
          td(props) {
            return <td className="border border-[color:var(--border)] px-3 py-1.5">{props.children}</td>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
