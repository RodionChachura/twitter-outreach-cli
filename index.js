const outreachFlow = require('./src/outreach-flow')

const [command, ...parameters] = process.argv.slice(2)

if (command === 'outreach') {
  const [screenName] = parameters
  if (!screenName) {
    console.log('Provide screen name of twitter user')
    return
  }

  outreachFlow(screenName)
} else {
  console.log('This command is not supported')
}