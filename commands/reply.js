exports.run = async (client, message, args) => {
    const textReceived = args.join(' ') // Une los argumentos en una cadena de texto

    if (!textReceived) {
        return message.channel.send({ content: 'Por favor, proporciona un texto para repetir' })
    }
    
    await message.delete()
    await message.channel.send({ content: textReceived })
    
}

exports.name = 'reply'
exports.description = 'Repite lo que dices.'