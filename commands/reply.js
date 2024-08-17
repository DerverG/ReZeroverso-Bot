module.exports.run = (client, message, args) => {
    const textReceived = args.join(' ') // Une los argumentos en una cadena de texto

    if (!textReceived) {
        return message.channel.send({ content: 'Por favor, proporciona un texto para repetir' })
    }
    
    message.channel.send({ content: textReceived })
}
