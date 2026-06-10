import React from 'react'

import { getMediaAlt, getMediaUrl } from '@/shared/lib/format'

import styles from './RichText.module.css'

type LexicalNode = {
  children?: LexicalNode[]
  fields?: {
    alt?: string
    article?: unknown
    blockType?: string
    text?: string
    tone?: string
  }
  format?: number | string
  relationTo?: string
  tag?: string
  text?: string
  type?: string
  url?: string
  value?: unknown
}

function renderChildren(nodes?: LexicalNode[]) {
  return nodes?.map((node, index) => <React.Fragment key={index}>{renderNode(node)}</React.Fragment>)
}

function renderText(node: LexicalNode) {
  let content: React.ReactNode = node.text || ''
  const format = typeof node.format === 'number' ? node.format : 0

  if (format & 1) content = <strong>{content}</strong>
  if (format & 2) content = <em>{content}</em>
  if (format & 8) content = <u>{content}</u>

  return content
}

function getRelatedArticle(node: LexicalNode) {
  const article = node.fields?.article

  if (!article || typeof article !== 'object') {
    return null
  }

  const title = 'title' in article && typeof article.title === 'string' ? article.title : null
  const slug = 'slug' in article && typeof article.slug === 'string' ? article.slug : null

  if (!title || !slug) {
    return null
  }

  return { slug, title }
}

function renderBlock(node: LexicalNode) {
  switch (node.fields?.blockType) {
    case 'callout':
      return (
        <aside className={`${styles.callout} ${styles[node.fields.tone || 'note']}`}>
          {node.fields.text}
        </aside>
      )
    case 'divider':
      return <hr className={styles.divider} />
    case 'relatedArticle': {
      const article = getRelatedArticle(node)

      if (!article) {
        return null
      }

      return (
        <aside className={styles.related}>
          <span>Рекомендуемая статья</span>
          <a href={`/articles/${article.slug}`}>{article.title}</a>
        </aside>
      )
    }
    default:
      return null
  }
}

function renderNode(node: LexicalNode): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderText(node)
    case 'heading': {
      const Tag = node.tag === 'h3' ? 'h3' : 'h2'
      return <Tag>{renderChildren(node.children)}</Tag>
    }
    case 'quote':
      return <blockquote>{renderChildren(node.children)}</blockquote>
    case 'list': {
      const Tag = node.tag === 'ol' ? 'ol' : 'ul'
      return <Tag>{renderChildren(node.children)}</Tag>
    }
    case 'listitem':
      return <li>{renderChildren(node.children)}</li>
    case 'link':
      return <a href={node.url}>{renderChildren(node.children)}</a>
    case 'upload': {
      const url = getMediaUrl(node.value)
      const alt = node.fields?.alt || getMediaAlt(node.value)

      if (!url) {
        return null
      }

      return (
        <figure className={styles.image}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={alt} src={url} />
          {alt && <figcaption>{alt}</figcaption>}
        </figure>
      )
    }
    case 'block':
      return renderBlock(node)
    case 'paragraph':
      return <p>{renderChildren(node.children)}</p>
    default:
      return renderChildren(node.children)
  }
}

export function RichText({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object' || !('root' in data)) {
    return null
  }

  const root = data.root as LexicalNode
  return <div className={styles.body}>{renderChildren(root.children)}</div>
}
