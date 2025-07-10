import userModel from "../models/userModel.js";
import axios from "axios";

export const getUserData = async(req, res)=>{
    try{
        const {userId} = req.body;
        
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found."})
        }
        res.json({
            success: true,
            userData: {
                email: user.email,
                name: user.name,
                isAccountVerified: user.isAccountVerified, 
            }
        })
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const sendemail = async (req, res) => {
    try{

        const form = req.body;
        const response = await axios.post("https://api.web3forms.com/submit", {
            // method: "POST",
            
            ...form,
            access_key: process.env.WEB_API_KEY,
        })
        if(response.data.success){
            return res.json({success: true, message: "Email sent successfully."})
        }
        return res.json({success: false, message: "Email not sent."})
    }
    catch(error){
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}
