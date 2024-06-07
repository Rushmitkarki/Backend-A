const path = require("path");
const productModel = require("../models/productModel");
const fs = require("fs"); // fs vaneko file system

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
// delete product

// update product
// 1.get product id(comes from url)

// 2. if image:
// 3. new umage should be upload
// 4. old image should be delete
// 5 . find product(database) product image
// 6. find that image in directory
// 7. Delete
// 9. update that product
const updateProduct = async (req, res) => {
  try {
    // if there is image
    if (req.files && req.files.productImage) {
      // destructuring
      const { productImage } = req.files;

      // upload image to /public/product folder
      const imageName = `${Date.now()}-${productImage.name}`;

      // 2. Make a upload path (/path/upload - directory)
      const imageUploadPath = path.join(
        __dirname,
        `../public/products/${imageName}`
      );

      // move to folder

      await productImage.mv(imageUploadPath);

      // req.params (id), req.body update data(product name, prod price , pc , pd) req.files(image)
      // add new field to req.body(prductImage -> name)
      req.body.productImage = imageName; //image  uploadeed (generated name)

      // if image is upoloaded and rew.body is assingned

      if (req.body.productImage) {
        // finding the existing product
        const existingProduct = await productModel.findById(req.params.id);
        // searching in folder
        const oldImagePath = path.join(
          __dirname,
          `../public/products/${existingProduct.productImage}`
        );
        // delete from filesystem
        fs.unlinkSync(oldImagePath);
      }
    }

    // update the data
    const updateProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    res.status(201).json({
      success: true,
      message: " product updated!",
      product: updateProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error !",
      error: error,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
};
