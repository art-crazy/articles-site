import { slugify } from '@/utilities/slugify'

type LexicalNode = {
  children?: LexicalNode[]
  tag?: string
  text?: string
  type?: string
}

export type TocItem = {
  id: string
  level: 2 | 3
  title: string
}

function getNodeText(node: LexicalNode): string {
  if (node.type === 'text') {
    return node.text || ''
  }

  return node.children?.map(getNodeText).join('') || ''
}

export function getHeadingId(title: string, index: number) {
  return slugify(title) || `section-${index + 1}`
}

export function getTableOfContents(data: unknown): TocItem[] {
  if (!data || typeof data !== 'object' || !('root' in data)) {
    return []
  }

  const root = data.root as LexicalNode
  const headings = root.children?.filter((node) => node.type === 'heading') || []

  return headings
    .map((node, index) => {
      const title = getNodeText(node).trim()

      if (!title) {
        return null
      }

      return {
        id: getHeadingId(title, index),
        level: node.tag === 'h3' ? 3 : 2,
        title,
      } satisfies TocItem
    })
    .filter((item): item is TocItem => item !== null)
}
