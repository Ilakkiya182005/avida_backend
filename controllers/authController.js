const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        console.log(req.body);
        const { firstName, lastName, emailId, password, confirmPassword,userType } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, emailId, password: hashedPassword, confirmPassword,userType });
        console.log(newUser);
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id, userType: user.userType }, "ilak@2005", { expiresIn: '7d' });
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000),
          });
        res.json({ token, userType: user.userType });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async(req,res)=>{
    res.cookie("token", null, {
              expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
}
