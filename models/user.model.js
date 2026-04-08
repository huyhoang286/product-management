//Customer
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({ 
    fullName: String, 
    email: String, 
    password: String, 
    tokenUser: String,
    phone: String, 
    address: String, 
    status: { 
        type: String, 
        default: "active" 
    }, 
    deleted: { 
        type: Boolean, 
        default: false 
    } 
}, 
{ 
    timestamps: true 
});
module.exports = mongoose.model("User", userSchema, "users");