module.exports = {
  cookTwitterUsers: (users) => {
    const filteredUsers = users.filter(({ name, entities }) => {
      const withFullName = name.split(' ').length > 1
      if (withFullName) {
        return true
      }
      if (entities && entities.urls) {
        return true
      }
    })
  
    return filteredUsers.map(u => ({
      id: u.id,
      name: u.name,
      description: u.description,
      screenName: u.screen_name,
      urls: u.entities && u.entities.url ? u.entities.url.urls.map(u => u.expanded_url) : []
    }))
  },
  getTwitterUrl: (screenName) => `https://twitter.com/${screenName}`,
  getLinkedInUrl: (name) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURI(name)}&origin=SWITCH_SEARCH_VERTICAL`
}