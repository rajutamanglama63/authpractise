const express = require("express");

const Todo = require("../model/Todo");
const auth = require("../middleware/auth");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        if(!todos) throw err("No todos");

        res.status(200).json(todos);
    } catch (err) {
        res.status(400).json({msg : err.message});
    }
});


router.post('/create', auth, async (req, res) => {
    const newTodo = new Todo({
        name : req.body.name
    });

    try {
        const todo = await newTodo.save();
        if(!todo) throw err("something went wrong");
        res.status(200).json(todo);
    } catch (err) {
        res.status(400).json({msg : err.message});
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if(!todo) throw err("No todos found");

        const removed = await todo.remove();
        if(!removed) throw err('Something went wrong while trying to delete the item');

        res.status(200).json({success : true});
    } catch (err) {
        res.status(400).json({msg : err.message, success : false});
    }
});


module.exports = router;