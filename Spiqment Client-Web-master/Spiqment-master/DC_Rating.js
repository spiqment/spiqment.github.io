const XLSX = require('xlsx');
const express = require('express');
const app = express();
const port = 3001;

require('dotenv').config({ path: './.env'});

require("./config/database");
const Product = require("./models/product");

const createReview = async (userId, productId, rating, comment) => {
    const review = {
        user: userId,
        comment,
        rating,
    };
  console.log(`[ADDING REVIEW >>> ] ${comment}, [RATING >>> ] ${rating}`);

  try {
    const product = await Product.findById(productId);

    if (!product) {
      console.log(`[Product not found >>> ] ${productId}`);
      return;
    }

    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === userId.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
    }

    await Product.findByIdAndUpdate(productId, {
      reviews: product.reviews,
    });

    console.log(`[ADDED REVIEW >>> ] ${comment}, [RATING >>> ] ${rating}`);
  }
    catch (error) {
    console.log(error);
    console.log(`[REVIEW ADDING FAILED] ${comment}, [RATING >>> ] ${rating}`);
  }
}

const seedReviews = async () => {
  const file_path = 'ExcelSheets/ReviewDetail_Final.csv';
  const workbook = XLSX.readFile(file_path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  const data = [];
  // Loop through each row in the sheet
  for (let row = 2; ; row++) {
    // Extract the data from each cell in the row
    const userId = sheet[`A${row}`]?.v;
    const productId = sheet[`B${row}`]?.v;
    const rating = sheet[`C${row}`]?.v;
    const comment = sheet[`D${row}`]?.v;

    // Stop the loop if the row has no data
    if (!userId && !productId && !rating && !comment) break;

    // Add the row's data to the array
    data.push({ userId, productId, rating, comment });
  }

  // Print the data to the console
  //console.log(data);

  // Return the data as a JSON response
  //res.json(data);

  let reviewCreationPromises = [];

  for (var i=0;i<data.length;i++){
    const userId = data[i].userId;
    const productId = data[i].productId;
    const rating = data[i].rating;
    const comment = data[i].comment;
    
    // const CreateUser = new User({name,email,role,password,});
    // const savedUser = await CreateUser.save()

    reviewCreationPromises.push(createReview(userId, productId, rating, comment));
    
    // console.log(`Name:  ${name}`);
    // console.log(`Email:  ${email}`);
    // console.log(`Password:  ${password}`);
    // console.log(`Role:  ${role}`);
  }

  await Promise.all(reviewCreationPromises);
}

// app.get('/extract-data', async (req, res) => {
//   const file_path = 'ExcelSheets/UserDetail.xlsx';
//   const workbook = XLSX.readFile(file_path);
//   const sheet_name = workbook.SheetNames[0];
//   const sheet = workbook.Sheets[sheet_name];
//   const data = [];
//   // Loop through each row in the sheet
//   for (let row = 2; ; row++) {
//     // Extract the data from each cell in the row
//     const name = sheet[`A${row}`]?.v;
//     const email = sheet[`B${row}`]?.v;
//     const password = sheet[`C${row}`]?.v;
//     const role = sheet[`D${row}`]?.v;

//     // Stop the loop if the row has no data
//     if (!name && !email && !password && !role) break;

//     // Add the row's data to the array
//     data.push({ name, email, password, role });
//   }

//   // Print the data to the console
//   //console.log(data);

//   // Return the data as a JSON response
//   //res.json(data);

//   for (var i=0;i<data.length;i++){
//     const name = data[i].name;
//     const email = data[i].email;
//     const password = data[i].password;
//     const role = data[i].role;
    
//     const CreateUser = new User({name,email,role,password,});
//     const savedUser = await CreateUser.save()

//     res.send(savedUser)

//     console.log(`Name:  ${name}`);
//     console.log(`Email:  ${email}`);
//     console.log(`Password:  ${password}`);
//     console.log(`Role:  ${role}`);

//   }
// });

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });


seedReviews();