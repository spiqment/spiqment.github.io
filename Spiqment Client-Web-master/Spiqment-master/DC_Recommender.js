const XLSX = require('xlsx');
const express = require('express');
const app = express();
const port = 3005;

require('dotenv').config({ path: './.env'});

require("./config/database");
const User = require("./models/user")
const Product = require("./models/product");

const RecommendedArray = async () => {
    try {
        const products = await Product.find();
    
        // Create an array to store the product data with user age
        const UserRecommendedArray = [];
    
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
            UserRecommendedArray.push({
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
        console.log(JSON.stringify(UserRecommendedArray));
    }
    catch (error) {
        console.log('Error retrieving product data:', error);
      }
}

RecommendedArray();