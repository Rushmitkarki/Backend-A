const router = require("express").Router();
const productController = require("../controllers/productControllers");
const { authGuard, adminGuard } = require("../middleware/authGuard");

router.post("/create", productController.createProduct);
router.get("/get_all_products", authGuard, productController.getAllProducts);
router.get("/get_one_product/:id", authGuard, productController.getOneProduct);
router.put("/update_product/:id", adminGuard, productController.updateProduct);
router.delete("/delete/:id", adminGuard, productController.deleteProduct);
router.get("/get_paginated_products", productController.getProductsPagination);
router.get("/get_products_count", productController.getProductCount);

module.exports = router;
