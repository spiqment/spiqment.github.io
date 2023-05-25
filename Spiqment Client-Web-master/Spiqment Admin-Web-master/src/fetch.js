const XLSX = require('xlsx');
const express = require('express');
const app = express();
const port = 3000;

app.get('/extract-data', (req, res) => {
  const file_path = 'src/ExcelSheets/UserDetail.xlsx';
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

    // Stop the loop if the row has no data
    if (!name && !email && !password && !role) break;

    // Add the row's data to the array
    data.push({ name, email, password, role });
  }

  // Print the data to the console
  //console.log(data);

  // Return the data as a JSON response
  //res.json(data);
  for (var i=0;i<data.length;i++){
    console.log("Name:" + data[i].name)
    console.log("Email:" + data[i].email)
    console.log("Password:" + data[i].password)
    console.log("Role:" + data[i].role)
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});