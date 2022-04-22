const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        name: String,
        age: Number,
        shark: String,
        status: {
            type: Number,
            default: 1,
            enum: [1, 2, 3], //1=Active 2=InActive 3=Deleted
        },

    });
module.exports = mongoose.model("users", User);
