const CustomizedKind = require('../models/customizedKindModel');

exports.createCustomizedKind = async (req, res) => {
    try {
        const userId = req.userId;
        //console.log('Creating customized kind for user:', userId);
        const customizedKind = new CustomizedKind({ ...req.body, user: userId });
        await customizedKind.save();
        res.status(201).send(customizedKind); // 201 Created
    } catch (error) {
        res.status(400).send(`Error creating customized kind: ${error.message}`); // 400 Bad Request
    }
};

exports.getUserCustomizedKind = async (req, res) => {
    try {
        const customizedKinds = await CustomizedKind.find({ user: req.userId });
        res.send(customizedKinds);
    } catch (error) {
        console.error('Error fetching customized kinds:', error);
        res.status(500).send(`Error fetching customized kinds: ${error.message}`); // 500 Internal Server Error
    }
};

exports.deleteCustomizedKind = async (req, res) => {
    const { id } = req.params;
    try {
        await CustomizedKind.findByIdAndDelete(id);
        res.status(200).send(`Customized kind with id ${id} deleted successfully.`);
    } catch (error) {
        res.status(500).send(`Error deleting customized kind: ${error.message}`);
    }
};