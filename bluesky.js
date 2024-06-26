import { pp } from 'passprint'

const password = process.env.BLUESKY_APP_PASSWORD
const repo = process.env.BLUESKY_HANDLE

const ENDPOINT = 'https://bsky.social/xrpc/com.atproto.repo.createRecord'
// const ENDPOINT = 'https://echo.free.beeceptor.com'

const jsonHeaders = {
  'Content-Type': 'application/json',
  Accept: 'application/json, */*;q=0.5'
}

const sessionResultPromise = fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
  method: 'POST',
  headers: jsonHeaders,
  body: JSON.stringify({
    identifier: repo,
    password
  })
})

pp(repo)

const collection = 'app.bsky.feed.post'

/** Post a response */
export const skeet = async (status, uri, title, description) => {
  const { accessJwt } = await (await sessionResultPromise).json()

  const body = JSON.stringify({
    repo,
    collection,
    record: {
      text: status,
      createdAt: (new Date()).toISOString(),
      embed: {
        $type: 'app.bsky.embed.external',
        external: {
          uri,
          title,
          description
        }
      }

    }
  })
  const result = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessJwt}`,
      ...jsonHeaders
    },
    body
  })
  pp(await result.json())
}
