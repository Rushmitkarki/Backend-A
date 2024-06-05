const router = require("express").Router();
const productController = require("../controllers/productControllers");

router.post("/create", productController.createProduct);
router.get("/get_all_products", productController.getAllProducts);
router.get("/get_one_product/:id", productController.getOneProduct);
router.put("/update/:id", productController.updateProduct);

module.exports = router;
