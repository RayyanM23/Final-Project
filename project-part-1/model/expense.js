const mongoose = require("mongoose");

let expenseModel = mongoose.Schema({
    Type: String,
    Category:String,
    Details:String,
    Amount:String
},
{
    collection:"Expense"
});
module.exports = mongoose.model('Expense',expenseModel);
