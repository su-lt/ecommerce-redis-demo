"use strict"

const EcommerceService = require("./service")

class EcommerceController {
    // POST - http://localhost:3333/cart/1001/add
    addToCart = async (req, res, next) => {
        /**
         * req.body :{
         *      productId,
         *      quantity,
         * }
         * userId: req.params.userId
         */
        const metadata = await EcommerceService.addToCart({
            ...req.body,
            userId: req.params.userId,
        })
        return res.status(200).json(metadata)
    }
}

module.exports = new EcommerceController()
