const { Kafka, Partitioners, logLevel } = require('kafkajs')
const config = require('./config.json')

const connectToKafka = async () => {
    const kafka = new Kafka({
        clientId: config.clientID,
        brokers: [config.bootstrap_servers],
        enforceRequestTimeout: false,
        logLevel: logLevel.ERROR,
        connectionTimeout: config.session_timeout_ms,
        authenticationTimeout: config.session_timeout_ms,
        ssl: true,
        sasl: {
            mechanism: config.sasl_mechanisms,
            username: config.sasl_username,
            password: config.sasl_password
        },
    })

    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
    await producer.connect()
    const consumer = await kafka.consumer({ groupId: config.topic })
    await consumer.connect()

    console.log("Successfully connected to Kafka");

    return { producer, consumer }
}

const sendMessage = async (producer) => {
    const payload = {
        topic: config.topic,
        messages: [{
            value: JSON.stringify({ kind: 'CAT', name: 'BMO' })
        }],
    }
    const responses = await producer.send(payload)

    console.log('Published message', { responses })
    return responses
}

const receiveMessage = async (consumer) => {
    // Consuming
    await consumer.subscribe({ topic: config.topic, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                topic,
                partition,
                offset: message.offset,
                value: JSON.parse(message.value),
            })
        },
    })
}

const main = async () => {
    const { producer, consumer } = await connectToKafka()
    await sendMessage(producer)
    await receiveMessage(consumer)
    console.log('Done!');
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
