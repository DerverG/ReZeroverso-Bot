exports.run = (client, message, args) => {
    message.channel.send('Pong!')
}

exports.name = 'ping'
exports.description = 'Responde con un Pong!'