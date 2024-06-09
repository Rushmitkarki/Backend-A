const router = require("express").Router();
const productController = require("../controllers/productControllers");
const { authGuard } = require("../middleware/authGuard");

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
router.delete("/delete_product/:id", productController.deleteProduct);

//update product
router.put("/update_product/:id", productController.updateProduct);

module.exports = router;
