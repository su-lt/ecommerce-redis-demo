"use strict"
const { getRedis } = require("../dbs/redis.db")
const { Product } = require("./models")
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
        const productKey = `product:${productId}`

        // check redis cache
        const foundCache = await redisClient.exists(productKey)
        if (!foundCache) {
            const foundProduct = await Product.findById(productId)
            if (!foundProduct) return { message: "Product not found" }

            // set cache
            await redisClient.hset(productKey, {
                stock: foundProduct.p_stock,
            })
            // set ttl - 5 seconds
            await redisClient.pexpire(productKey, 5000)

            return {
                message: {
                    _status: "direct",
                    _stock: foundProduct.p_stock,
                },
            }
        }

        return {
            message: {
                _status: "cache",
                _stock: await redisClient.hget(productKey, "stock"),
            },
        }
    }
}

module.exports = EcommerceService
