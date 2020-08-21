const fetch = require('node-fetch')

const getFollowers = async (screenName, cursor = -1) => {
  const response = await fetch(`https://api.twitter.com/1.1/followers/list.json?cursor=${cursor}&screen_name=${screenName}&skip_status`, {
    headers: {
      authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
    }
  })
  if (response.status >= 400) {
    throw new Error(response.statusText)
  }
  const { users, next_cursor } = await response.json()

  return {
    users,
    nextCursor: next_cursor
  }
}

module.exports = {
  getFollowers
}