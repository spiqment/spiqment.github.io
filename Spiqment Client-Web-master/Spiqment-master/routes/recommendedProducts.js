const router = require("express").Router();
const { isAuthenticatedUser } = require("../middlewares/auth");
const productService = require("../services/productService");


 router.get(
  "/",
  isAuthenticatedUser(),
  productService.getAllRecommendedProducts
); 

module.exports = router;
