const redis = require("redis")

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = "Service connect redis failed !!!"

let client = {},
    statusConnect = {
        CONNECT: "connect",
        END: "end",
        RECONNECT: "reconnecting",
        ERROR: "error",
    },
    connectionTimeout

const handleTimeOutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new Error(REDIS_CONNECT_MESSAGE)
    }, REDIS_CONNECT_TIMEOUT)
}

const handleEventConnection = ({ connectionRedis }) => {
    // connect successfully
    connectionRedis.on(statusConnect.CONNECT, () => {
        console.log("Redis - Connect database successfully at port 6379")
        clearImmediate(connectionTimeout)
    })
    // connect end
    connectionRedis.on(statusConnect.END, () => {
        console.log("Redis - Connect database status: disconnected")
        // retry connect
        handleTimeOutError()
    })
    // re-connecting
    connectionRedis.on(statusConnect.RECONNECT, () => {
        console.log("Redis - Connect database status: reconnecting")
    })
    // connect error
    connectionRedis.on(statusConnect.ERROR, (err) => {
        console.log("Redis - Connect database status: error")
        // retry connect
        handleTimeOutError()
    })
}

const initRedis = () => {
    if (!client.instanceConnect) {
        client.instanceConnect = redis.createClient()
        // connect redis
        client.instanceConnect.connect()
    }

    handleEventConnection({
        connectionRedis: client.instanceConnect,
    })
}
initRedis()

const getRedis = () => client

const closeRedis = () => client.instanceConnect.disconnect()

module.exports = {
    getRedis,
    closeRedis,
}
