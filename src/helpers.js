const emojiRegex = require('emoji-regex')

const getFirstName = name => {
  const [firstName] = name.split(' ')
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
}

const IGNORE_LOCATIONS = [
  "India"
]

module.exports = {
  cookTwitterUsers: (users, visitedUsersIds) => {
    const filteredUsers = users
      .map(user => ({
        ...user,
        name: user.name.replace(emojiRegex(), '')
      }))
      .filter(({ id, name, entities, description, default_profile_image, location }) => {
        if (default_profile_image || visitedUsersIds.includes(id) || name.split(' ').length !== 2) {
          return false
        }
        if (IGNORE_LOCATIONS.find(l => location.includes(l))) {
          return false
        }
        return (entities && entities.urls) || description
      })
  
    return filteredUsers.map(u => ({
      id: u.id,
      name: u.name,
      description: u.description,
      screenName: u.screen_name,
      location: u.location,
      urls: u.entities && u.entities.url ? u.entities.url.urls.map(u => u.expanded_url) : []
    }))
  },
  getTwitterUrl: (screenName) => `https://twitter.com/${screenName}`,
  getLinkedInUrl: (name) => `https://www.linkedin.com/search/results/people/?keywords=${encodeURI(name)}&origin=SWITCH_SEARCH_VERTICAL`,
  getMessages: (name) => {
    const firstName = getFirstName(name)
    const greet = `Hi ${firstName}!`

    return [
      `${greet} I'm curious, what are you doing as a successful X to stay organized and focused, with so many responsibilities and opportunities?`,
      `${greet} I'm curious, what are you doing as a X to be more productive and stay focused on a task at hand?`,
      `${greet} I'm curious what do you do as a X to organize your days better during this remote work time?`
    ]
  }
}