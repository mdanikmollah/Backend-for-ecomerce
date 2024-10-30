export const adminAuth = async (req,res,next) =>{
    try {
        if (req.user.role != "user") {
            next()
        }
        return res.send("access denied")
    } catch (error) {
        console.log("auth", error);
        
    }
}