export const validation = async (req,res,next) =>{
    const { displayName,email,password,role } = req.body
    if (req.body.hasOwnProperty("displayName") && req.body.hasOwnProperty("email") && req.body.hasOwnProperty("password") && req.body.hasOwnProperty("role") ) {
        
        if ([displayName,email,password,role].some((field)=>field === "")) {
            return res.json("All field are required")
        }
    }else{

        return res.json("Invalid")
    }
    next()
}
