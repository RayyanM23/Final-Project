const mongoose = require("mongoose");

let expenseModel = mongoose.Schema({
    Type: { type: String, required: true },
    Category: { type: String, required: true },
    Details: { type: String, required: true },
    Amount: { type: Number, required: true }
}, 
{
    collection: "Expense"
});

module.exports = mongoose.model('expense', expenseModel);