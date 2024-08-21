const fs = require('fs')

function writeData(data) {
    try {
        const jsonString = JSON.stringify(data, null, 2) // Formateo con indentación de 2 espacios
        fs.writeFileSync('./data/data.json', jsonString, 'utf-8')
    } catch (err) {
        console.error('Error writing JSON', err)
    }
}

module.exports = writeData