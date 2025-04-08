const Brand = require('../models/brandModel');

// Add a new brand
exports.addBrand = async (req, res) => {
  const { brandName, brandLogo, categories } = req.body;
  try {
    const existing = await Brand.findOne({ brandName });
    if (existing) {
      return res.status(400).json("Brand already exists");
    }
    const newBrand = new Brand({ brandName, brandLogo, categories });
    await newBrand.save();
    res.status(200).json(newBrand);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(201).json(brands);
  } catch (err) {
    res.status(500).json(err);
  }
};
