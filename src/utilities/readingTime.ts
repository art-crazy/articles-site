type LexicalNode = {
  children?: LexicalNode[]
  fields?: {
    text?: string
  }
  text?: string
  type?: string
}

function collectText(node: LexicalNode): string {
  const parts: string[] = []

  if (typeof node.text === 'string') {
    parts.push(node.text)
  }

  if (node.type === 'block' && typeof node.fields?.text === 'string') {
    parts.push(node.fields.text)
  }

  if (Array.isArray(node.children)) {
    parts.push(...node.children.map(collectText))
  }

  return parts.join(' ')
}

export function calculateReadingTime(content: unknown) {
  if (!content || typeof content !== 'object' || !('root' in content)) {
    return 1
  }

  const root = content.root as LexicalNode
  const text = collectText(root)
  const words = text
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  return Math.max(1, Math.ceil(words.length / 180))
}
