const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// MongoDB Model
const User = require('../models/User');

// VALIDATION Import
const { registerValidation, loginValidation } = require('../validation');

// Register User
router.post('/register', async (req, res) => {
	
    // Validate User
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	// Check if User already in database
	const emailExist = await User.findOne({ email: req.body.email });
	if(emailExist) return res.status(400).send('Email already exists');

	// Hash Passwords
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	// Validated And Create User
	const user = new User({ 
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword,
		role: req.body.role,
		image: ""
	});

	try{
		const savedUser = await user.save();
		res.json({ name: user.name, email: user.email });
	} catch (err) {
		res.json({ message: err });
	}
});

// Login User
router.post('/login', async(req, res) => {
	const { error } = loginValidation(req.body); 
	if (error) return res.status(400).send(error.details[0].message);

	// Check if Email Exists
	const user = await User.findOne({ email: req.body.email });
	if(!user) return res.status(400).send('Email Does Not Exist');

	const validPass = await bcrypt.compare(req.body.password, user.password)
	if(!validPass) return res.status(400).send('Invalid Password');

	// Create & Assign Token 
	const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
	res.header('auth-token', token).send(token);
});

// Update User
router.put('/update', async (req, res) => {
	
    // Validate User
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	// Check if User already in database
	const emailExist = await User.findOne({ email: req.body.email });
	if(!emailExist) return res.status(400).send('Email do not exists');


	// Hash Passwords
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);

	// Validated And Update User
	const user = await User.updateOne({email: req.body.email },
		{$set:{ name: req.body.name, email: req.body.email, password: hashedPassword, image: "" } },
		{ upsert: true }
	);
		
	try{
		res.json({ message : "Update Successful" });
	} catch (err) {
		res.json({ message: err });
	}
});

// Get Users
router.get('/users', async (req, res) => {
	
    
	// Check if User already in database
	const user = await User.find({}, {password: 0})
	try{
		res.json(user);
	} catch (err) {
		res.json({ message: err });
	}
});

// Get User id
router.get('/:uid/only', async (req, res) => {
	
    
	// Check if User already in database
	const user = await User.findOne({_id: req.params.uid}, {})
	try{
		res.json(user);
	} catch (err) {
		res.json({ message: err });
	}
});

// Delete user 
router.delete('/:uid/only', async(req, res) => {
	try {
		const removedUser = await User.remove({ _id: req.params.uid });
		res.json(removedUser);
	} catch(err) {
		res.json({ message: err });
	}
});


module.exports = router;