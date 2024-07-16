const Redis = require("ioredis")

const REDIS_CONNECT_TIMEOUT = 10000
const REDIS_CONNECT_MESSAGE = "Service connect redis failed !!!"

let clients = {},
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

const initRedis = ({
    IO_REDIS_ENABLED,
    IO_REDIS_HOST = "localhost",
    IO_REDIS_PORT = 6379,
}) => {
    if (IO_REDIS_ENABLED) {
        if (!clients.instanceConnect) {
            clients.instanceConnect = new Redis({
                host: IO_REDIS_HOST,
                port: IO_REDIS_PORT,
            })
        }

        handleEventConnection({
            connectionRedis: clients.instanceConnect,
        })
    }
}

const getRedis = () => clients

const closeRedis = () => clients.instanceConnect.disconnect()

module.exports = {
    initRedis,
    getRedis,
    closeRedis,
}
