// call databases
require("./dbs/mongo.db")
const { initRedis } = require("./dbs/redis.db")
initRedis({
    IO_REDIS_ENABLED: true,
})
const EcommerceController = require("./src/controller")
const express = require("express")
const { getProductCache } = require("./src/middleware")
const app = express()

// middlewares

app.use(express.json())
app.get("/product/:productId", getProductCache, EcommerceController.getProduct)
app.post("/cart/:userId/add", EcommerceController.addToCart)

module.exports = app
