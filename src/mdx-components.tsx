/**
 * MDX custom component mapping for App Router
 * Required by @next/mdx — maps HTML elements to dark tribal styled React components
 * Pattern 3 from 02-RESEARCH.md + 02-UI-SPEC.md typography
 */

import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2
        className="text-2xl font-bold mt-8 mb-4 text-foreground"
        style={{ fontFamily: 'var(--font-cinzel), Georgia, serif' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-base font-bold mt-6 mb-3 text-foreground font-inter">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-base leading-relaxed text-foreground mb-4">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-primary hover:underline transition-colors duration-150"
      >
        {children}
      </a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-primary bg-muted px-4 py-3 my-4">
        {children}
      </blockquote>
    ),
    code: ({ children }) => (
      <code className="bg-muted text-sm px-1 rounded">{children}</code>
    ),
    ...components,
  }
}
