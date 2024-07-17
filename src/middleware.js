"use strict"
const { getRedis } = require("../dbs/redis.db")
const { instanceConnect: redisClient } = getRedis()

const getProductCache = async (req, res, next) => {
    const { productId } = req.params
    const productKey = `product:${productId}`

    // check redis cache
    const foundCache = await redisClient.exists(productKey)
    if (foundCache) {
        return res.status(200).json({
            message: {
                _status: "cache",
                _stock: await redisClient.hget(productKey, "stock"),
            },
        })
    }

    return next()
}

module.exports = { getProductCache }
