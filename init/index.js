const mongoose = require("mongoose");
const PLACE = require("../model/schema.js");
const initdata = require("./data.js");

main()
.then((res) => {console.log("connected to DB")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initDB = async () => {
    await PLACE.deleteMany({});
    await PLACE.insertMany(initdata.data)
    console.log("data saved")
}

initDB();