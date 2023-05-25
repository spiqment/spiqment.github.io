const XLSX = require('xlsx');
const express = require('express');
const app = express();
const port = 3005;

require('dotenv').config({ path: './.env'});

require("./config/database");
const Order = require("./models/order");
//const Product = require("./models/product");

const createOrder = async (shippingInfo, orderItems, charges, paymentInfo, user, orderStatus) => {
  console.log(`[ADDING ORDER OF USER >>> ] ${user}`);

/*    for (let i = 0; i < orderItems.length; i++) {
    let item = orderItems[i];
    const productExists = await Product.findById(item.product);

    if (!productExists) {
      console.log(`[Invalid product ID specified, product not found] >>> ${item.product}`);
      return;
    }
  }  */

  try {
    const newOrder = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice: charges.basePrice,
      taxPrice: charges.taxPrice,
      shippingPrice: charges.shippingPrice,
      totalPrice: charges.totalPrice,
      paymentInfo,
      orderStatus,
      paidAt: Date.now(),
      user,
    });

    console.log(`[ORDER CREATED] ${user}`)
  } catch (error) {
    console.log(error);
    console.log(`[ORDER CREATION FAILED] ${user}`);
  }
}

const seedOrders = async () => {
  const file_path = 'ExcelSheets/OrderDetail_Final.csv';
  const workbook = XLSX.readFile(file_path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  const data = [];
  // Loop through each row in the sheet
  for (let row = 2; ; row++) {
    // Extract the data from each cell in the row
    const address = sheet[`A${row}`]?.v;
    const city = sheet[`B${row}`]?.v;
    const phoneNo = sheet[`C${row}`]?.v;
    const postalCode = sheet[`D${row}`]?.v;
    const province = sheet[`E${row}`]?.v;
    const country = sheet[`F${row}`]?.v;
    const user = sheet[`G${row}`]?.v;
    const quantity = sheet[`H${row}`]?.v;
    const product = sheet[`I${row}`]?.v;
    const productPrice = sheet[`J${row}`]?.v;
    const basePrice = sheet[`K${row}`]?.v;
    const shippingPrice = sheet[`L${row}`]?.v;
    const taxPrice = sheet[`M${row}`]?.v;
    const totalPrice = sheet[`N${row}`]?.v;
    const paymentMethod = sheet[`O${row}`]?.v;
    const orderStatus = sheet[`P${row}`]?.v;

    // Stop the loop if the row has no data
    if (!address && !city && !phoneNo && !postalCode && !province && !country && !user && !quantity && !product && !productPrice && !basePrice && !shippingPrice && !taxPrice && !totalPrice && !paymentMethod && !orderStatus) break;

    // Add the row's data to the array
    data.push({ address, city, phoneNo, postalCode, province, country, user, quantity, product, productPrice, basePrice, shippingPrice, taxPrice, totalPrice, paymentMethod, orderStatus });
  }

  // Print the data to the console
  //console.log(data);

  // Return the data as a JSON response
  //res.json(data);

  let userCreationPromises = [];

  for (var i=0;i<data.length;i++){
    const address = data[i].address;
    const city = data[i].city;
    const phoneNo = data[i].phoneNo;
    const postalCode = data[i].postalCode;
    const province = data[i].province;
    const country = data[i].country;
    const user = data[i].user;
    const quantity = data[i].quantity;
    const product = data[i].product;
    const productPrice = data[i].productPrice;
    const basePrice = data[i].basePrice;
    const shippingPrice = data[i].shippingPrice;
    const taxPrice = data[i].taxPrice;
    const totalPrice  = data[i].totalPrice;
    const paymentMethod = data[i].paymentMethod;
    const orderStatus = data[i].orderStatus;

    let shippingInfo = {
      address,
      city,
      phoneNo,
      postalCode,
      province,
      country,
    }
    let orderItems = [
      {
        quantity,
        product,
        price:productPrice,
      }
    ]
    let charges = {
      productPrice,
      basePrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    }
    let paymentInfo = {
      paymentMethod
    }
    
    // const CreateUser = new User({name,email,role,password,});
    // const savedUser = await CreateUser.save()

    userCreationPromises.push(createOrder(shippingInfo, orderItems, charges, paymentInfo, user, orderStatus));
    
    // console.log(`Name:  ${name}`);
    // console.log(`Email:  ${email}`);
    // console.log(`Password:  ${password}`);
    // console.log(`Role:  ${role}`);
  }

  await Promise.all(userCreationPromises);
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


seedOrders();