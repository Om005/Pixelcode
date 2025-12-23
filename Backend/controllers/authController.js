import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import {transporter} from '../config/nodemailer.js';
import { WECOME_EMAIL_TEMPLATE, VERIFY_EMAIL_TEMPLATE, RESET_PASSWORD_TEMPLATE } from '../config/emailTemplates.js';

// import sendMail from '../config/nodemailer.js';
export const register = async(req, res)=>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.json({success: false, message: 'Missing Details'});
    }
    try{
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({success: false, message: "User already exists"});
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const user = new userModel({name, email, password: hashedPass});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7*24*60*60*1000
        })
        const mailOptions ={
            from: process.env.SENDGRID_SENDER_EMAIL,
            to: email,
            subject: 'Welcome to this website',
            // text: `Welcome to this website. Your account has been created with email id: ${email}`
            html: WECOME_EMAIL_TEMPLATE.replace("{{name}}", user.name)
        }
        
        try {
            // await sendMail(mailOptions)
            await transporter.sendMail(mailOptions)
        } catch (emailError) {
            console.error('Error sending email:', emailError);
        }
        
        
        return res.json({success: true})
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}



export const login = async(req, res)=>{
const {email, password} = req.body;
if(!email || !password){
    return res.json({success: false, message:'Email and password are required'});
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message:'Invalid email'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.json({success: false, message:'Incorrect password'});
        }
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 7*24*60*60*1000
        })
        
        return res.json({success: true})
        
    }
    catch(error){
        return res.json({success: false, message: error.message});
    }
}

export const logout = async(req, res)=>{
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: "None",
        })
        return res.json({success: true, message: 'Logged out'})
    }
    catch(error){
        return res.json({success: false, message: error.message});
        
    }
}


export const sendVerifyOtp = async(req, res)=>{
    try{
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        if(user.isAccountVerified){
            return res.json({success: false, message:"Account Already Verified."});
        }
        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now()+ 24*60*60*1000;
        await user.save();
        
        const mailOptions ={
            from: process.env.SENDGRID_SENDER_EMAIL,
            to: user.email,
            subject: 'Accout Verification OTP',
            // text: `Your OTP is ${otp}. Verify your account using this OTP.`
            html: VERIFY_EMAIL_TEMPLATE.replace("{{name}}", user.name).replace("{{otp}}", otp)
        }
        await transporter.sendMail(mailOptions);
        res.json({success:true, message: "Verification email sent on email."})
    } catch(error){
        // console.log(error.message)
        res.json({success: false, message: error.message})
    }
}


export const verifyEmail = async(req, res)=>{
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success:false, message: "Missing Details."})
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success: false, message: "User not found."})
        }
        if(user.verifyOtp==='' || user.verifyOtp!==otp){
            return res.json({success: false, message: "Invalid OTP."})
        }
        if(user.verifyOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired."})
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({success: true, message: "Email verified successfully"})
    }
    catch(error){
        return res.json({success: false, message: error.message})
    }
}



export const isAuthenticated = async(req, res)=>{
    try{
        return res.json({success:true}) 
    }catch(error){
        return res.json({success: false, message: error.message})
    }
}


export const sendResetOtp = async(req, res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false, message: "Email is required."})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message: "User not found."})  
        }

        const otp = String(Math.floor(100000 + Math.random()*900000))
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now()+ 15*60*1000;
        await user.save();
        
        const mailOptions ={
            from: process.env.SENDGRID_SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            // text: `Your OTP for resetting the password is ${otp}. Use this otp to proceed with resetting your password.`
            html: RESET_PASSWORD_TEMPLATE.replace("{{name}}", user.name).replace("{{otp}}", otp)
        }
        try{
            await transporter.sendMail(mailOptions);
        }catch(error){
            console.log(error.message)
        }
        
        res.json({success:true, message: "OTP sent to your email."})

    }catch(error){
        return res.json({success:false, message: error.message})  
    }
}

export const verifyResetOtp = async(req, res)=>{
    const {email, otp} = req.body;

    if(!email || !otp){
        return res.json({success:false, message: "Missing Details."})
    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success: false, message: "User not found."})
        }
        if(user.resetOtp==='' || user.resetOtp!==otp){
            return res.json({success: false, message: "Invalid OTP."})
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success: false, message: "OTP Expired."})
        }
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({success: true, message: "Enter new password"})
    }
    catch(error){
        return res.json({success: false, message: error.message})
    }
}

export const resetPassword = async(req, res)=>{
    const {email, newPassword} = req.body;
    if(!newPassword){
        return res.json({success:false, message: "New password is required."});  
    }
    try{
        const user = await userModel.findOne({email});
        // console.log(user.name)
        if(!user){
            return res.json({success:false, message: "User not found."});  
        }
        const hashedPass = await bcrypt.hash(newPassword, 10);
        user.password = hashedPass
        await user.save();
        return res.json({success:true, message: "Password has been reset successfully."});  

    }catch(error){
        return res.json({success:false, message: error.message});  
    }
}
