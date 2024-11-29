const mongoose = require("mongoose");

let expenseModel = mongoose.Schema({
    Type: { type: String, required: true },
    Category: { type: String, required: true },
    Details: { type: String, required: true },
    Amount: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
}, {
    collection: "expense"
});

module.exports = mongoose.model('expense', expenseModel);