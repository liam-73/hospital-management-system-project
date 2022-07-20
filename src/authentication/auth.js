const jwt = require("jsonwebtoken");

// schema
const Admin = require("../models/admin");

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");

        const decoded = jwt.verify( token, process.env.JWT_SECRET );

        const admin = await Admin.findById(decoded._id).populate('hospital');

        if(!admin) throw new Error("Token is missing or invalid!");

        req.admin = admin;
        req.hospital = admin.hospital

        next();
    } catch(e) {
        if( e.message === "Token is missing or invalid!" ) {
            return res.status(401).json({ message: e.message });
        }
        
        res.status(500).json({ message: e.message });
    }
};

module.exports = auth;