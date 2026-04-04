//ADMIN
const mongoose = require("mongoose");
const accountSchema = new mongoose.Schema({ 
    fullName: String, 
    email: String, 
    password: String, 
    token: String,
    phone: String, 
    avatar: String, 
    role_id: String, 
    status: { 
        type: String, 
        default: "active" 
    }, 
    deleted: { 
        type: Boolean, 
        default: false 
    },
    deletedAt: Date
}, 
{ 
    timestamps: true 
});
module.exports = mongoose.model("Account", accountSchema, "accounts");