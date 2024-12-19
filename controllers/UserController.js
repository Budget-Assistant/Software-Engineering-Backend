const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully' }); // Send JSON response
    } catch (error) {
        res.status(400).json({ success: false, message: `Error registering user: ${error.message}` }); // Send JSON response
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        //const user = await User.findOne({ email });
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: email }
            ]
        });
        

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' }); // Return JSON response
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid password' }); // Return JSON response
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN);
        res.status(200).json({ success: true, token }); // Return JSON response
    } catch (error) {
        res.status(500).json({ success: false, message: `Error logging in: ${error.message}` }); // Return JSON response
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { username } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        // 解碼 token 獲取用戶 ID
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const userId = decoded.userId;

        // 檢查新用戶名是否已被使用
        const existingUser = await User.findOne({ username });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ 
                success: false, 
                message: '此用戶名已被使用' 
            });
        }

        // 更新用戶名
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: '找不到用戶' 
            });
        }

        user.username = username;
        await user.save();

        res.status(200).json({ 
            success: true,
            message: '用戶名更新成功',
            username: user.username 
        });

    } catch (error) {
        console.error('更新用戶設定錯誤:', error);
        res.status(500).json({ 
            success: false, 
            message: `更新失敗: ${error.message}` 
        });
    }
};

exports.getUserInfo = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: '找不到用戶' 
            });
        }

        res.status(200).json({ 
            success: true,
            user: {
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `獲取用戶信息失敗: ${error.message}` 
        });
    }
};

exports.updateEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const userId = decoded.userId;

        // 檢查新 email 是否已被使用
        const existingUser = await User.findOne({ email });
        if (existingUser && existingUser._id.toString() !== userId) {
            return res.status(400).json({ 
                success: false, 
                message: '此 email 已被使用' 
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: '找不到用戶' 
            });
        }

        user.email = email;
        await user.save();

        res.status(200).json({ 
            success: true,
            message: 'Email 更新成功',
            email: user.email 
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `更新失敗: ${error.message}` 
        });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: '找不到用戶' 
            });
        }

        // 驗證舊密碼
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: '目前密碼不正確' 
            });
        }

        // 檢查新密碼是否與舊密碼相同
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ 
                success: false, 
                message: '新密碼不能與目前密碼相同' 
            });
        }

        // 更新密碼
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ 
            success: true,
            message: '密碼更新成功'
        });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: `更新失敗: ${error.message}` 
        });
    }
};
