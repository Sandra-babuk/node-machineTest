const Product = require('../models/productModel');
const Brand = require('../models/brandModel');
const User = require('../models/userModel');


exports.addProduct = async (req, res) => {
  try {
    const { productName, description, price, category, brand, productImage } = req.body;
    const userId = req.userId;

    const brandDoc = await Brand.findById(brand);
    if (!brandDoc) return res.status(404).json("Brand not found");

    if (!brandDoc.categories.includes(category)) {
      return res.status(400).json("Category does not exist under this brand");
    }

    const newProduct = new Product({
      productName,
      description,
      price,
      category,
      brand,
      productImage,
      addedBy: userId,
    });

    await newProduct.save();
    res.status(200).json(newProduct);

  } catch (err) {
    res.status(500).json(err.message);
  }
};

// get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithUsername = await Promise.all(
      products.map(async (product) => {
        const user = await User.findById(product.addedBy);
        const brand = product.brand;

        return {
          ...product._doc,
          addedBy: user ? user.username : 'Unknown User',
        };
      })
    );

    res.status(200).json(productsWithUsername);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// edit 
exports.editProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const userId = req.userId;
  
      const product = await Product.findById(id);
      if (!product) return res.status(404).json("Product not found");
  
      if (product.addedBy.toString() !== userId) {
        return res.status(403).json("Unauthorized: You can only edit your own product");
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true });
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

//   delete
exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.userId;
  
      const product = await Product.findById(id);
      if (!product) return res.status(404).json("Product not found");
  
      if (product.addedBy.toString() !== userId) {
        return res.status(403).json("Unauthorized: You can only delete your own product");
      }
  
      await Product.findByIdAndDelete(id);
      res.status(200).json("Product deleted successfully");
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  

  