import jwt from "jsonwebtoken";
const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ 
                message: "Unauthorized access. No token provided.",
                success: false
            });
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded) {
            return res.status(401).json({ 
                message: "Unauthorized access. Invalid token.",
                success: false
            });
        };
        //sending the user id to the next middleware
        req.id = decoded.userId;
        next();
    }catch (error) {
        console.error("Error in authentication middleware:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export default isAuthenticated;