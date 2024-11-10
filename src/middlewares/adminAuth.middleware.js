export const adminAuth = async (req, res, next) =>{
    try {
        if (req.user.role == "user" && req.user.role == "seller") {
            return res.send("access denied")
        }
        next()
    } catch (error) {
        console.log("auth", error);
        
    }
}