const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true, 
        maxlength: 50 
    },
    text: { 
        type: String, 
        default: "" 
    },
    columnId: { 
        type: String, 
        required: true 
    },
    tags: [String],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

//Normalize JSON response output for frontend compatibility
//Exposes string "id", strips internal "__v", and deletes raw "_id"
taskSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id 
    }
});

module.exports = mongoose.model("Task", taskSchema);