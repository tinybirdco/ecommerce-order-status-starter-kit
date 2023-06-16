const { Kafka, Partitioners, logLevel } = require('kafkajs')
const { faker } = require('@faker-js/faker');
const config = require('./config.json')


// Introduce multi - items orders, when 1 order contain multiple items and not exactly with items quantity = 1. For that we need to allow non - unique OrderId and add Quantity field(default =1)
// Allow to create orders with similar products(currently 1 product = 1 order)
// Limit shipping to a single country, e.g.US: leave only state, city and street address.


// Connects to Kafka and returns a producer and consumer
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

const generateProductOrder = (quantity) => {
    let products = [];

    for (let i = 0; i < quantity; i++) {
        products.push(faker.number.int({ min: 0, max: 1000000 }));
    }
    return products;
}

// A function that sends a message at a random interval between .01 seconds to 1 second.
const sendMessageAtRandomInterval = async (producer) => {
    let randomInterval = Math.floor(Math.random() * 1000) + 10;

    setInterval(async () => {
        randomInterval = Math.floor(Math.random() * 1000) + 10;
        const quantity = faker.number.int({ min: 0, max: 10 });
        const productsOrdered = generateProductOrder(quantity);
        const message = {
            products: productsOrdered,
            quantity: quantity,
            region: faker.number.int({ min: 1, max: 10 }),
            orderID: faker.number.int({ min: 10000, max: 20000 }),
            shippingLocation: {
                streetAddress: faker.location.streetAddress({ useFullAddress: true }),
                state: faker.location.state({ abbreviated: true }),
                city: faker.location.city(),
                zipCode: faker.location.zipCode(),
                country: "USA",
            },
            currentLocation: {
                latitude: faker.location.latitude(),
                longitude: faker.location.longitude()
            },
            orderDate: faker.date.recent({ days: 10 }),
            fullName: faker.person.fullName(),
            userEmail: faker.internet.email(),
            // userEmail: 'joe@tinybird.co'
        }

        const payload = {
            topic: config.topic,
            messages: [{
                value: JSON.stringify(message)
            }],
        }
        const responses = await producer.send(payload)

        console.log('Published message', { responses })
    }, randomInterval);
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
    await sendMessageAtRandomInterval(producer)
    // await receiveMessage(consumer)
    console.log('Done!');
}

main().catch(error => {
    console.error(error)
    process.exit(1)
})
