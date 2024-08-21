const fs = require('fs')

function loadData() {
    try {
        const jsonString = fs.readFileSync('./data/data.json', 'utf-8')
        const data = JSON.parse(jsonString)
        return {
            projects: data.projects,
            tasks: data.tasks
        }
        
    } catch (err) {
        console.error('Error parsing JSON', err)
        return null
    }
}

module.exports = loadData