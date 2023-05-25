const XLSX = require('xlsx');
const express = require('express');
const app = express();
const port = 3001;

require('dotenv').config({ path: './.env'});

require("./config/database");
const User = require("./models/user");

const createUser = async (name, email, role, password, age) => {
  console.log(`[ADDING USER] ${email}, ${name}`);

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    console.log(`[USER EXISTS] ${email}, ${name}`);
    return;
  }

  try {
    const newUser = await User.create({
      name,
      email,
      role,
      password,
      age,
    });

    console.log(`[USER ADDED] ${email}, ${name}`)
  } catch (error) {
    console.log(error);
    console.log(`[USER ADDING FAILED] ${email}, ${name}`);
  }
}

const seedUsers = async () => {
  const file_path = 'ExcelSheets/UserDetail.csv';
  const workbook = XLSX.readFile(file_path);
  const sheet_name = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheet_name];
  const data = [];
  // Loop through each row in the sheet
  for (let row = 2; ; row++) {
    // Extract the data from each cell in the row
    const name = sheet[`A${row}`]?.v;
    const email = sheet[`B${row}`]?.v;
    const password = sheet[`C${row}`]?.v;
    const role = sheet[`D${row}`]?.v;
    const age = sheet[`E${row}`]?.v;

    // Stop the loop if the row has no data
    if (!name && !email && !password && !role && !age) break;

    // Add the row's data to the array
    data.push({ name, email, password, role, age });
  }

  // Print the data to the console
  //console.log(data);

  // Return the data as a JSON response
  //res.json(data);

  let userCreationPromises = [];

  for (var i=0;i<data.length;i++){
    const name = data[i].name;
    const email = data[i].email;
    const password = data[i].password;
    const role = data[i].role;
    const age = data[i].age;
    
    // const CreateUser = new User({name,email,role,password,});
    // const savedUser = await CreateUser.save()

    userCreationPromises.push(createUser(name, email, role, password,age));
    
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


seedUsers();