"use strict"
const { Product } = require("./models")
const { getRedis } = require("../dbs/redis.db")
const { instanceConnect: redisClient } = getRedis()

const script = `
                local productKey = tostring(KEYS[1])
                local cartKey = tostring(KEYS[2])
                local quantity =  tonumber(ARGV[1])

                local stock = tonumber(redis.call('HGET', productKey, 'stock'))
                if stock and stock >= quantity then
                    redis.call('HINCRBY', productKey, 'stock', -quantity);
                    redis.call('HINCRBY', cartKey, productKey, quantity);
                    return 1
                else
                    return 0
                end`

class EcommerceService {
    static addToCart = async ({ userId, productId, quantity }) => {
        const cartKey = `cart:${userId}`
        const productKey = `product:${productId}`
        const quantityString = String(quantity)

        try {
            const result = await redisClient.eval(script, {
                keys: [productKey, cartKey],
                arguments: [quantityString],
            })
            if (result) {
                return {
                    message: "OK",
                }
            }

            return {
                message: "Out of stock",
            }
        } catch (error) {
            return {
                message: "Not OK",
            }
        }
    }

    static getProduct = async ({ productId }) => {
        // check valid product id here

        // get product in dbs
        const foundProduct = await Product.findById(productId)
        const stock = foundProduct ? foundProduct.p_stock : null
        // set cache
        const productKey = `product:${productId}`
        await redisClient.hset(productKey, {
            stock,
        })
        // set ttl - 15 seconds
        await redisClient.expire(productKey, 15)

        return {
            message: {
                _status: "direct",
                _stock: stock,
            },
        }
    }
}

module.exports = EcommerceService
