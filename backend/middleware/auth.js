const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({
            message: "Token not found"
        });
    }

    try {

        const decodedToken = jwt.verify(token, "mysecretkey");

        req.userId = decodedToken.userId;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid token"
        });
    }
};

module.exports = authenticateUser;