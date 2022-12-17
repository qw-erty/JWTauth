const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
const Contact = require("../models/Contact");

exports.create = async (req, res) => {
  console.log("file details : ",req.file);
  const totalRecords = [];
try{
console.log(path.join(__dirname, '../', '/public/csv/' + req.file.filename))
  fs.createReadStream(path.join(__dirname, '../', '/public/csv/' + req.file.filename))
    .pipe(csv.parse({ headers: true }))
    .on('error', error => console.error(error))
    .on('data', row => totalRecords.push(row))
    .on('end', async rowCount => {
      try{
        console.log("records:" , totalRecords)
        const contacts = await Contact.insertMany(totalRecords);
        console.log("u: ",contacts);
        res.json(contacts);
      }catch(err){
        res.status(400).json(err);
      }
    });

  }catch(error){
    res.status(400).json(error)
  }
};
