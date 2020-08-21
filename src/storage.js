const fs = require('fs')

const DEFAULT_STATE = {
  messaged: [],
  ignored: [],
  users: [],
}

class Storage {
  constructor(screenName){
    this.screenName = screenName
    this.filePath = `./states/${screenName}.json`
  }

  update(newState) {
    fs.writeFileSync(this.filePath, JSON.stringify(newState));
  }

  get() {
    if (!fs.existsSync(this.filePath)) {
      this.update(DEFAULT_STATE)
    }
    
    return JSON.parse(fs.readFileSync(this.filePath))
  }
}

module.exports = Storage