import { pp } from 'passprint'

const accessToken = process.env.MASTODON_ACCESS_TOKEN
const mastodonServer = process.env.MASTODON_SERVER
const baseUrl = `https://${mastodonServer}`

const headers = {
  Authorization: `Bearer ${accessToken}`
}

/** Post a response */
export const toot = async (status) => {
  const body = new URLSearchParams()
  body.append('status', status)
  pp(body)
  const result = await fetch(`${baseUrl}/api/v1/statuses`, {
    method: 'POST',
    headers,
    body
  })
  pp(await result.json())
}
