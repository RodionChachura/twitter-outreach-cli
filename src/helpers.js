const getFirstName = name => {
  const [firstName] = name.split(' ')
  return firstName.charAt(0).toUpperCase() + firstName.slice(1)
}

module.exports = {
  cookTwitterUsers: (users, visitedUsersIds) => {
    console.log(users)
    const filteredUsers = users.filter(({ id, name, entities, profile_image_url }) => {
      if (!profile_image_url || visitedUsersIds.includes(id)) {
        return false
      }

      const withFullName = name.split(' ').length === 2
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
  getLinkedInUrl: (name) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURI(name)}&origin=SWITCH_SEARCH_VERTICAL`,
  getMessage: (name) => `Hi ${getFirstName(name)}! I'm curious, what are you doing as a successful X to stay organized and focused, with so many responsibilities and opportunities?`
}