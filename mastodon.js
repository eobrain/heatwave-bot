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
  await fetch(pp(`${baseUrl}/api/v1/statuses`), {
    method: 'POST',
    headers,
    body
  })
}
