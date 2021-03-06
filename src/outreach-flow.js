const readlineSync = require('readline-sync')
const chalk = require('chalk')

const Storage = require('./storage')
const twitter = require('./twitter')
const helpers = require('./helpers')

module.exports = (screenName) => {
  console.log(`Starting outreach flow for ${screenName} followers`)
  
  // to: refactor
  const storage = new Storage(screenName)
  let state = storage.get()
  const initialMessagedNumber = state.messaged.length
  const updateState = (newPart) => {
    state = { ...state, ...newPart }
    storage.update(state)
  }
  
  const flow = async () => {
    if (state.users.length) {
      const [{
        id,
        name,
        description,
        screenName,
        location,
        urls
      }, ...restUsers] = state.users
      const messagedNumber = state.messaged.length - initialMessagedNumber
      console.clear()
      messagedNumber && console.log(`+ ${messagedNumber} messaged`)
      console.log(chalk.yellow(name))
      location && console.log(location)
      description && console.log(description)
      console.log(helpers.getTwitterUrl(screenName))
      console.log(helpers.getLinkedInUrl(name))
      urls.forEach(url => console.log(url))
      console.log()
      const messages = helpers.getMessages(name)
      messages.forEach(m => console.log(m))

      const options = [
        'Mark as ignored',
        'Mark as messaged',
      ]
      const answer = readlineSync.keyInSelect(options, 'What is next?')
      if (answer === -1) {
        return
      }
      let newPart = {
        users: restUsers
      }
      if (answer === 0) {
        newPart.ignored = [...state.ignored, id]
      }
      if (answer === 1) {
        newPart.messaged = [...state.messaged, id]

      }
      updateState(newPart)

      return flow()
    } else {
      console.log('Fetching new followers ...')
      try {
        const { users, nextCursor } = await twitter.getFollowers(screenName, state.nextCursor)
        updateState({ users: helpers.cookTwitterUsers(users, [...state.messaged, ...state.ignored]), nextCursor })
        return flow()
      } catch (err) {
        console.log('Fail to fetch followers: ', err.message)
      }
    }
  }

  return flow()
}