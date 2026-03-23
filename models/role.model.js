const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema({ 
    title: String, 
    description: String, 
    permissions: { 
        type: Array, 
        default: [] 
    }, 
    deleted: { 
        type: Boolean, 
        default: false 
    } 
}, 
{ 
    timestamps: true 
});
module.exports = mongoose.model("Role", roleSchema, "roles");