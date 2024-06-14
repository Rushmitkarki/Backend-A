const router = require("express").Router();
const productController = require("../controllers/productControllers");
const { authGuard, adminGuard } = require("../middleware/authGuard");

router.post("/create", productController.createProduct);

// fetch all products
router.get("/get_all_products", authGuard, productController.getAllProducts);

// fetch single products
router.get(
  "/get_single_products/:id",
  authGuard,
  productController.getSingleProduct
);

//delete product
router.delete("/delete_product/:id", adminGuard, productController.deleteProduct);

//update product
router.put("/update_product/:id",adminGuard, productController.updateProduct);

module.exports = router;
