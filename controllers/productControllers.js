const path = require("path");
const productModel = require("../models/productModel");

const createProduct = async (req, res) => {
  console.log(req.body);
  console.log(req.files);

  //  Destructuring the body
  const { productName, productCategory, productDescription, productPrice } =
    req.body;

  // Validating the data
  if (
    !productName ||
    !productCategory ||
    !productDescription ||
    !productPrice
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all fields!",
    });
  }

  // Validating the image
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image!",
    });
  }

  const { productImage } = req.files;

  //  Upload the image
  // 1. Generate new image name
  const imageName = `${Date.now()}-${productImage.name}`;

  // 2. Make a upload path (/path/upload - directory)
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );

  // 3, Move to that directory (await, try catch)
  try {
    await productImage.mv(imageUploadPath);

    // save the product to database

    const newProduct = new productModel({
      productName: productName,
      productCategory: productCategory,
      productDescription: productDescription,
      productPrice: productPrice,
      productImage: imageName,
    });

    const product = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: "error",
    });
  }
};

// Fetch all products
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productModel.find({});

    res.status(201).json({
      success: true,
      message: "All products fetched successfully",
      products: allProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

// Get one product
const getOneProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product: product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

const updateProduct = async (req, res) => {
  res.send("Update Product");
};

module.exports = {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
};
