const express = require("express");
const router = express.Router();
const uuid = require("uuid");
let users = require("../../db");

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

const convertValues = {
longueur :{
  "Xavier" : 1.9304,
  "Adam" : 1.8034,
  "Antoine" : 1.778,
  "Metre" : 1,
  "Pied" : 0.3048,
  "Yard" : 0.9144,
  "Kilometre" : 1000,
  "Mile" : 1609.344,
  "Centimetre" : 0.01,
  "Millimetre" : 0.001,
},
temperature :{
  "Kelvin" : 1,
  "Celsius" : 274.15,
},
poids :{
  "Kilogramme" : 1,
  "Gramme" : 0.001,
  "Tonne" : 1000,
  "Livre" : 0.453592,
  "Once" : 0.0283495,
},
volume :{
  "Metre cube" : 1,
  "Litre" : 0.001,
  "Pinte" : 0.000568261,
  "Gallon" : 0.00454609,
  "Millilitre" : 0.000001,
  "Centilitre" : 0.00001,
  "Decilitre" : 0.0001,
},
vitesse :{
  "Metre par seconde" : 1,
  "Kilometre par heure" : 0.277778,
  "Mile par heure" : 0.44704,
  "Noeud" : 0.514444,
  "Pied par seconde" : 0.3048,
},
Monnaie:{

}
}
Object.keys(convertValues).forEach(convertValue => {
  let converter = convertValues[convertValue]
  router.get("/convert/" + convertValue, (req, res) => {
    try{
    let from = req.query.from
    let to = req.query.to
    let value = req.query.value
    if (!from || !(from in converter)) 
      throw new Error("from invalide")
    if (!to || !(to in converter)) 
      throw new Error("to invalide")
    if (!value) 
      throw new Error("value invalide")
    let initialValue = converter[from] * req.query.value
    let finalValue = initialValue / converter[to]
    
    return res.json({
      "value" : finalValue
    })
  }catch(e){
    res.statusCode = 402
    return res.json({
      "error" : e.message,
      "valeursValide" : Object.keys(converter)
    })
  }

  });
})


module.exports = router;


