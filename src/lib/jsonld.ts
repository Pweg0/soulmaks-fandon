/**
 * JSON-LD Schema.org helper functions for SoulmaskBR
 *
 * All functions are pure, no side effects, server-safe.
 * No external dependencies — plain objects returned directly.
 *
 * SEO-03: Structured data for rich results in Google.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://soulmaskbr.com'

/**
 * VideoGame schema for the homepage.
 * Represents the Soulmask game itself.
 */
export function videoGameSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: 'Soulmask',
    description:
      'Survival game com habilidades baseadas em mascaras por Qooland Games',
    genre: ['Survival', 'Open World', 'Action RPG'],
    gamePlatform: ['PC', 'Steam'],
    url: BASE_URL,
    inLanguage: 'pt-BR',
    publisher: {
      '@type': 'Organization',
      name: 'Qooland Games',
    },
  }
}

/**
 * WebSite schema for the homepage.
 * Represents SoulmaskBR as a web entity.
 */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SoulmaskBR',
    url: BASE_URL,
    description: 'O guia completo de Soulmask em portugues',
    inLanguage: 'pt-BR',
  }
}

/**
 * BreadcrumbList schema for detail pages.
 * Mirrors the HTML breadcrumb navigation exactly.
 *
 * @param items - Array of breadcrumb items with name and URL
 */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Article schema for guide pages (category === 'guias').
 * Default to Article (not HowTo) since MDX content may not have
 * machine-readable steps — per research pitfall #5.
 *
 * @param title - Article headline
 * @param description - Article description
 * @param url - Canonical URL of the article
 * @param datePublished - Optional ISO date string
 */
export function articleSchema(
  title: string,
  description: string,
  url: string,
  datePublished?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    inLanguage: 'pt-BR',
    ...(datePublished && { datePublished }),
  }
}

/**
 * WebPage schema for category listing pages (per D-04).
 * Simple schema for listing pages — page name + URL, minimal effort.
 *
 * @param name - Page name (category label)
 * @param url - Canonical URL of the page
 */
export function webPageSchema(name: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    url,
    inLanguage: 'pt-BR',
  }
}
