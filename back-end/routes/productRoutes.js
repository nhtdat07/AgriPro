const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Routes
router.get("/", productController.getAllProducts);
router.post("/", productController.addProduct);

module.exports = router;
