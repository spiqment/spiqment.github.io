const User = require("../models/user")
const Product = require("../models/product");
const MESSAGES = require("../constants/messages");
const { applyPagination } = require("../utils/generalHelpers");
const cloudinary = require("cloudinary");
const axios = require('axios');

const productService = {
  getAllProducts: async (req, res, next) => {
    const { keyword } = req.query;
    const products = await applyPagination(
      Product.searchQuery(keyword, req.query),
      req.query
    );
    const count = await Product.searchQuery(keyword, req.query).count();

    return res.status(200).json({
      success: true,
      count,
      products,
    });
  },

 getAllRecommendedProducts: async (req, res, next) => {
    try {
      const products = await Product.find();
  
      // Create an array to store the product data with user age
      const users_review_history = [];

      let recommededProducts = [];
  
      // Iterate through each product
      for (const product of products) {
        // Iterate through the reviews array
        for (const review of product.reviews) {
          try{
              const user = await User.findById(review.user);

              // Access user's age
              const userAge = user.age;
              const userName = user.name;

              // Push the review data with user age
              users_review_history.push({
              user_id: review.user._id,
              user_name: userName,
              user_age: userAge,
              product_id: product._id,
              rating: review.rating,
            });
          }
          catch(error){
              console.log("Cannot find user >>> " , review.user);
          }
        }
      }
      user_loggedIn = req.user._id;
      console.log(user_loggedIn);
      const data = {
        user_id: user_loggedIn , // Example user ID
        users_review_history
      };
      const response = await axios.post('http://localhost:5000/recommend', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const recommendedIds = response.data;

    try {
      for (const product_id of recommendedIds) {
      const product = await Product.findById(product_id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
        });
      }
      recommededProducts.push(product)
    }
    console.log(user_loggedIn);
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    } 
      
      return res.status(200).json({
        success: true,
        count:recommededProducts.length,
        recommended_products: recommededProducts
      });

  }
  catch (error) {
      console.log('Error retrieving product data:', error);
      return res.status(404).json({
        success: false,
        message: MESSAGES.PRODUCT_RETRIEVE_ERROR,
      });
    }
    /* const { keyword } = req.query;
    const products = await applyPagination(
      Product.searchQuery(keyword, req.query),
      req.query
    );
    const count = await Product.searchQuery(keyword, req.query).count();

    return res.status(200).json({
      success: true,
      count,
      products,
    }); */
  }, 

  createProduct: async (req, res, next) => {
    var sizesArray = [];
    const { name, price, description ,color, sizes, category, stock } = req.body;
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    if (req.body.images.length <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please add at least 1 image",
      });
    }

    let imageLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    if(sizes != null){
      sizesArray = sizes.split(",").map((size) => size.trim());
    }
    try {
      const product = await Product.create({
        name,
        price,
        description,
        color,
        sizes:sizesArray,
         ...(imageLinks.length > 0 && { images: imageLinks }),
        category,
        stock,
        user: req.user._id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.PRODUCT_CREATION_FAILURE,
      });
    }

    return res.status(201).json({
      success: true,
      message: MESSAGES.PRODUCT_CREATION_SUCCESS,
    });
  },
  getSingleProduct: async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
        });
      }
      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  },
  updateSingleProduct: async (req, res, next) => {
    var sizeArray = [];
    const { id } = req.params;
    const { name, price, description, color, sizes, category, stock } = req.body;
    
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
        });
      }
      if(sizes != null){
        sizeArray = sizes.split(",").map((size) => size.trim());
      }
      product.name = name;
      product.price = price;
      product.description = description;
      product.color = color;
      product.sizes = sizeArray;

      let images = [];
      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else {
        images = req.body.images;
      }

      let imageLinks = [];
      if (!!images) {
        for (let i = 0; i < product.images.length; i++) {
          const result = await cloudinary.v2.uploader.destroy(
            product.images[i].public_id
          );
        }
        let imageLinks = [];
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products",
          });
          imageLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });

          product.images = imageLinks;
        }
      }

      product.category = category;
      product.stock = stock;
      await product.save();
      return res.status(200).json({
        success: true,
        message: MESSAGES.PRODUCT_UPDATION_SUCCESS,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  },
  deleteSingleProduct: async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
        });
      }
      await product.delete();
      return res.status(200).json({
        success: true,
        message: MESSAGES.PRODUCT_DELETION_SUCCESS,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.PRODUCT_DELETION_FAILURE,
      });
    }
  },
  createProductReview: async (req, res) => {
    const { rating, comment } = req.body;
    const review = {
      user: req.user.id,
      comment,
      rating,
    };

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
    }

    await Product.findByIdAndUpdate(req.params.id, {
      reviews: product.reviews,
    });

    res.status(200).json({
      success: true,
      message: "Review posted",
    });
  },
  getProductReviews: async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  },
  deleteProductReview: async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    let reviewToDelete = product.reviews.filter(
      (review) => review._id.toString() === req.query.reviewId.toString()
    );

    if (reviewToDelete.userId !== req.user._id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Cannot delete this review",
      });
    }

    let reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.reviewId.toString()
    );

    await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  },
};

module.exports = productService;
