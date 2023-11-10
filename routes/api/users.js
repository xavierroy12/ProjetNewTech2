const express = require("express");
const router = express.Router();
const uuid = require("uuid");
let users = require("../../db");
const mongoose = require('mongoose');

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://dbUser:penis@projectnewtech2.ehsvhxq.mongodb.net/?retryWrites=true&w=majority";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const { Schema } = mongoose;

let conversionsValues = {}

const conversionSchema = new Schema({
  name: String,
  values: Object
});

const Conversion = mongoose.model('Conversion', conversionSchema);


//Data that we inserted in the database
const data = {
  longueur: {
    "Xavier": 1.9304,
    "Adam": 1.8034,
    "Antoine": 1.778,
    "Metre": 1,
    "Pied": 0.3048,
    "Yard": 0.9144,
    "Kilometre": 1000,
    "Mile": 1609.344,
    "Centimetre": 0.01,
    "Millimetre": 0.001,
  },
  temperature: {
    "Kelvin": 1,
    "Celsius": 274.15,
  },
  poids: {
    "Kilogramme": 1,
    "Gramme": 0.001,
    "Tonne": 1000,
    "Livre": 0.453592,
    "Once": 0.0283495,
  },
  volume: {
    "Metre cube": 1,
    "Litre": 0.001,
    "Pinte": 0.000568261,
    "Gallon": 0.00454609,
    "Millilitre": 0.000001,
    "Centilitre": 0.00001,
    "Decilitre": 0.0001,
  },
  vitesse: {
    "Metre par seconde": 1,
    "Kilometre par heure": 0.277778,
    "Mile par heure": 0.44704,
    "Noeud": 0.514444,
    "Pied par seconde": 0.3048,
  }
}
//Function to add data to mongodb
async function runAddData() {
  try {
    /* // Connect the client to the server	(optional starting in v4.7)
     await client.connect();
     // Send a ping to confirm a successful connection
     await client.db("admin").command({ ping: 1 });
     console.log("Pinged your deployment. You successfully connected to MongoDB!");*/
    console.log(Object.keys(data));
    Object.keys(data).forEach(keyValue => console.log(keyValue));
    const promises = Object.keys(data).map(async (keyValue) => {
      console.log(keyValue);
      const conversion = new Conversion({ "name": keyValue, "values": data[keyValue] });
      console.log(conversion);
      const savedConversion = await conversion.save();

      console.log(savedConversion);
    });
    await Promise.all(promises);
    console.log("Done!")

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
//Function to read data from mongodb
async function runReadData() {
  try {

    const conversions = await Conversion.find({});
    ConversionsData = {}
    conversions.forEach(conversion => {
      ConversionsData[conversion.name] = conversion.values
    });
    return ConversionsData;
  } catch (err) {
    console.error(err);
  }
}


//Connection to mongoose
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected...')
    runReadData().then((data) => {
      conversionsValues = data
      console.log(conversionsValues);


    })
      .catch(console.dir);


  })
  .catch(err => console.log(err));



/*
router.get("/", (req, res) => {
  //res.json(users);
  res.json("Hello World");
});

router.get("/:id", (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));

  if (found) {
    res.json(users.filter(user => user.id === parseInt(req.params.id)));
  } else {
    res.sendStatus(400);
  }
});

router.post("/", (req, res) => {
  const newUser = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email
  };

  if (!newUser.name || !newUser.email) {
    return res.sendStatus(400);
  }
  users.push(newUser);
  res.json(users);
});

//Update User
router.put("/:id", (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));
  if (found) {
    const updateUser = req.body;
    users.forEach(user => {
      if (user.id === parseInt(req.params.id)) {
        user.name = updateUser.name ? updateUser.name : user.name;
        user.email = updateUser.email ? updateUser.email : user.email;
        res.json({ msg: "User updated", user });
      }
    });
  } else {
    res.sendStatus(400);
  }
});


//Delete User
router.delete("/:id", (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id))
  if (found) {
     users = users.filter(user => user.id !== parseInt(req.params.id))
     res.json({
     msg: "User deleted",
     users
   });
  } else {
      res.sendStatus(400);
  }
});
*/
router.get("/convert", (req, res) => {
  try {
    let from = req.query.from
    let to = req.query.to
    let value = req.query.value
    let type = req.query.type
    if (!type || !(type in conversionsValues))
      throw { message: "type invalide", validValues: Object.keys(conversionsValues) };
    if (!from || !(from in conversionsValues[type]))
      throw { message: "from invalide", validValues: Object.keys(conversionsValues[type]) };
    if (!to || !(to in conversionsValues[type]))
      throw { message: "to invalide", validValues: Object.keys(conversionsValues[type]) };
    if (!value || isNaN(value))
      throw { message: "value invalide", validValues: "must be a number UwU" };
    let initialValue = conversionsValues[type][from] * req.query.value
    let finalValue = initialValue / conversionsValues[type][to]
    return res.json({
      "value": finalValue
    })
  } catch (error) {
    return res.status(400).json(error)
  }
});

module.exports = router;


