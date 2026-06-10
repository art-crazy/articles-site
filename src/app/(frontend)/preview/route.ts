import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (!slug || !secret || secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid preview request', {
      status: 401,
    })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(`/articles/${slug}`)
}
