const express = require("express");
const mongoose = require("mongoose");

const User = require("./model/user.model");

const app = express();

mongoose
  .connect("mongodb://localhost:27017/sampleDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`CONNECTED TO MONGO!`);
  })
  .catch((err) => {
    console.log(`MONGO CONNECTION ERROR!`);
    console.log(err);
  });

// First need to insert the following documents
// db.users.insert([
//   { _id: "1", name: "A", age: 15 },
//   { _id: "2", name: "B", age: 32 },
//   { _id: "3", name: "C", age: 73 },
// ]);

let newUsers = [
  { _id: "1", name: "X", age: 17 }, // updates name **and** age
  { _id: "2", name: "B", age: 39 }, // updates only age
  { _id: "3", name: "C", age: 73 }, // same
  { _id: "4", name: "P", age: 43 }, // new
  { _id: "5", name: "Q", age: 33 }, // new
];

//wrap the documents into a format that bulkWrite requires.
for (let i in newUsers) {
  console.log(newUsers[i]);
  newUsers[i] = {
    updateOne: {
      filter: { _id: newUsers[i]._id },
      update: newUsers[i],
      upsert: true,
    },
  };
}

async function start() {
  try {
    const result = await User.bulkWrite(newUsers);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

app.listen(3000, () => {
  console.log("Connected to PORT 3000...");
});
start();
