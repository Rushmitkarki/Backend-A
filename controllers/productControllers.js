const path = require("path");
const createProduct = async (req, res) => {
  //  check incommin g data

  console.log(req.body);
  // for sending the files data
  console.log(req.files);

  // destructure the incomming body data(json)

  const { productName, productPrice, productCategory, productDescription } =
    req.body;

  // validation
  if (
    !productName ||
    !productPrice ||
    !productCategory ||
    !productDescription
  ) {
    return res.status(400).json({
      success: false,
      message: "Please enter all the fields",
    });
  }
  //  vallidation the imge
  if (!req.files || !req.files.productImage) {
    return res.status(400).json({
      success: false,
      message: "Please upload the image",
    });
  }
  const { productImage } = req.files;

  //  save the data to the database

  // generatethe new image name (abc.png => 123456-abc.png)

  const imageName = `${Date.now()}-${productImage.name}`;

  //  make a upload path(/path/upload -dirextory)
  const imageUploadPath = path.join(
    __dirname,
    `../public/products/${imageName}`
  );
  // move to that directory(await , try catch)
  try {
    await productImage.mv(imageUploadPath);
    res.send("File uploaded successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  createProduct,
};