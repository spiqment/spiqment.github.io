const XLSX = require('xlsx');
const express = require('express');
const app = express();
const port = 3005;

require('dotenv').config({ path: './.env'});

require("./config/database");
const Product = require("./models/product");

const createProduct = async (name, price, description, color,sizes, images, category, stock, user) => {
  console.log(`[ADDING PRODUCT >>> ] ${name}`);

/*    for (let i = 0; i < orderItems.length; i++) {
    let item = orderItems[i];
    const productExists = await Product.findById(item.product);

    if (!productExists) {
      console.log(`[Invalid product ID specified, product not found] >>> ${item.product}`);
      return;
    }
  }  */

  try {
    const product = await Product.create({
        name,
        price,
        description,
        color,
        sizes,
        images,
        category,
        stock,
        user,
    });

    console.log(`[PRODUCT CREATED] ${name}`)
  } catch (error) {
    console.log(error);
    console.log(`[PRODUCT ADDITION FAILED] ${name}`);
  }
}

const seedProducts = async () => {
  const file_path = 'ExcelSheets/ProductDetail.csv';
  const workbook = XLSX.readFile(file_path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  const data = [];
  // Loop through each row in the sheet
  for (let row = 2; ; row++) {
    // Extract the data from each cell in the row
    const name = sheet[`A${row}`]?.v;
    const price = sheet[`B${row}`]?.v;
    const description = sheet[`C${row}`]?.v;
    const color = sheet[`D${row}`]?.v;
    const public_id = sheet[`E${row}`]?.v;
    const url = sheet[`F${row}`]?.v;
    const category = sheet[`G${row}`]?.v;
    const stock = sheet[`H${row}`]?.v;
    const user = sheet[`I${row}`]?.v;
    const sizes = sheet[`J${row}`]?.v;

    // Stop the loop if the row has no data
    if (!name && !price && !description && !color && !public_id && !url && !user && !category && !stock && !sizes) break;

    // Add the row's data to the array
    data.push({ name, price, description, color, public_id, url, user, category, stock, sizes});
  }

  // Print the data to the console
  //console.log(data);

  // Return the data as a JSON response
  //res.json(data);

  let productCreationPromises = [];

  for (var i=0;i<data.length;i++){
    const name = data[i].name;
    const price = data[i].price;
    const description = data[i].description;
    const color = data[i].color;
    const public_id = data[i].public_id;
    const url = data[i].url;
    const user = data[i].user;
    const category = data[i].category;
    const stock = data[i].stock;
    const availableSizes = data[i].sizes;

    let images = [
      {
        public_id,
        url,
      }
    ]

    const sizes = createArrayForSizes(availableSizes);

    productCreationPromises.push(createProduct(name, price, description, color,sizes, images, category, stock, user));
    
    // console.log(`Name:  ${name}`);
    // console.log(`Email:  ${email}`);
    // console.log(`Password:  ${password}`);
    // console.log(`Role:  ${role}`);
  }

  await Promise.all(productCreationPromises);
}

function createArrayForSizes(str) {
    if (str === "null") {
      return [''];
    } else {
      return str.split(',');
    }
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


seedProducts();