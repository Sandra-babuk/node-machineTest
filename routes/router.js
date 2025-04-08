const express = require('express');
const UserController = require('../controllers/userController');
const jwtMiddleware = require('../middleware/jwtMiddleware');
const brandController = require('../controllers/brandController')
const productController = require ('../controllers/productController')
const blockedUserController = require('../controllers/blockedUserController')

const router = new express.Router()

router.post('/register', UserController.registerController);
router.post('/login', UserController.loginController);
router.get('/get-user',UserController.getAllUsersController)
router.post('/refresh-token',UserController.refreshTokenController)
router.put('/user-profile', jwtMiddleware, UserController.updateProfile)
router.delete('/user-profile', jwtMiddleware, UserController.deleteProfile)

router.post('/add-brand', brandController.addBrand);
router.get('/getall-brand', brandController.getAllBrands);

router.post('/add-product', jwtMiddleware, productController.addProduct);
router.get('/get-product', productController.getAllProducts);
// Get only logged-in user's products
router.get('/my-products', jwtMiddleware, productController.getMyProducts);
router.put('/edit/:id', jwtMiddleware, productController.editProduct)
router.delete('/delete/:id', jwtMiddleware, productController.deleteProduct)

router.put('/block/:targetUserId', jwtMiddleware,blockedUserController.blockUser );
router.put('/unblock/:targetUserId', jwtMiddleware,blockedUserController.unblockUser);


module.exports = router