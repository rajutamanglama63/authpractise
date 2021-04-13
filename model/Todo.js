const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    }
});

const Todo = mongoose.model("todo", TodoSchema);

module.exports = Todo;