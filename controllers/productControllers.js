const path = require('path')
const productModel = require('../models/productModel');
const Product = require('../models/productModel');
const fs = require('fs')

const createProduct = async (req, res) => {

    //check incoming data
    console.log(req.body)
    console.log(req.files)

    //destructuring the body data (json)
    const { productName,
        productPrice,
        productCategory,
        productDescription
    } = req.body;

    //Validation (task)
    if (!productName || !productPrice || !productCategory || !productDescription) {
        return res.status(400).json({
            "success": false,
            "message": "Please enter all fields"
        })


    }
    //validate if there is image
    if (!req.files || !req.files.productImage) {
        return res.status(400).json({
            "success": false,
            "message": "Image not found"
        })
    }

    const { productImage } = req.files;

    //upload image
    // 1. Generate new image name (abc.png) -> (21324-abc.png)
    const imageName = `${Date.now()}-${productImage.name}`;

    // 2. Make a upload path(/path/upload- directory)
    const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

    // 3. Move to that directory (await, try-catch)
    try {
        await productImage.mv(imageUploadPath)

        // save to database
        const newProduct = new productModel({
            productName: productName,
            productPrice: productPrice,
            productCategory: productCategory,
            productDescription: productDescription,
            productImage: imageName

        })
        const product = await newProduct.save()
        res.status(201).json({
            "success": true,
            "message": "Product created successfully",
            "data": product
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "error": error
        })
    }

};

// Fetch all products
const getAllProducts = async (req, res) => {
    //try catch
    try {
        const allProducts = await productModel.find({})
        res.status(201).json({
            "success": true,
            "message": "Product Fetched Successfully",
            "products": allProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Interval server error",
            "error": error
        })
    }



}

// fetch single products
const getSingleProduct = async (req, res) => {

    // get product id from url (params)
    const productId = req.params.id;

    //find
    try {
        const product = await Product.findById(productId)
        if (!product) {
            res.status(400).json({
                "success": false,
                "message": "No Product Found",
            })
        }
        res.status(201).json({
            "success": true,
            "message": "Product fetched",
            "product": product
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Interval server error",
            "error": error
        })

    }

}

//delete product
const deleteProduct = async (req, res) => {

    try {

        await productModel.findByIdAndDelete(req.params.id)
        res.status(201).json({
            "success": true,
            "message": "Product Deleted Successfully",
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            "success": false,
            "message": "Internal Server Error",
            "error": error
        })

    }

}

// <----update product---->
// 1. get product id (URL)
// 2. if image :
// 3. New image should be uploadee
// 4. old image should be deleted
//  5. final product (database) product image
//  6. find that image in directory
//  7. Delete the image
// 8. Update that product

const updateProduct = async (req, res) => {

    try {

        //if there is image
        if (req.files && req.files.productImage) {

            //Destructuring
            const { productImage } = req.files;

            //upload image to /public/products folder
            // 1. Generate new image name (abc.png) -> (21324-abc.png)
            const imageName = `${Date.now()}-${productImage.name}`;

            // 2. Make a upload path(/path/upload- directory)
            const imageUploadPath = path.join(__dirname, `../public/products/${imageName}`)

            //Move to folder
            await productImage.mv(imageUploadPath)

            //req.params (id), req.body(updated data : pm, pp, pc, pd), req.files(image)
            //add new field to req.body (productImage -> name)
            req.body.productImage = imageName; //image uploaded (generated name)

            //if image is uploaded and req.body is assingned
            if(req.body.productImage){

                // finding existing product
                const existingProduct = await productModel.findById(req.params.id)

                //searching in the directory/folder
                const oldImagePath =  path.join(__dirname, `../public/products/${existingProduct.productImage}`)

                // delete from file system
                fs.unlinkSync(oldImagePath)
            }
        }

        // update the data
        const updatedProduct = await productModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(201).json({
            success : true,
            message : "Product updated !",
            product : updatedProduct
        })

    } catch (error) {

        console.log(error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
        })

    }

}

module.exports = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    updateProduct
};