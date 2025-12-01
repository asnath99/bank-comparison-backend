
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Données de l'admin existant
const payload = {
  id: 1,                      
  email: "wili@test.com",     
  role: "admin",              
};


const secret = process.env.JWT_SECRET || "votre_secret_jwt_tres_long";

// Durée de validité du token 
const token = jwt.sign(payload, secret, { expiresIn: "1d" });

console.log("\n=== Nouveau token JWT ===\n");
console.log(token);
console.log("\n=========================\n");
