import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req,res) => {
    try{
        const {fullname,email,password,phoneNumber,role} = req.body
        /*console.log(fullname,email,password,phoneNumber,role)*/

        if(!fullname || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({
                success:false,
                message:'Something is missing'
            })
        }

        const file = req.file
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                success:false,
                message:'User already exist'
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        await User.create({
            fullname,
            email,
            password:hashedPassword,
            phoneNumber,
            role,
            profile:{
                profilePhoto:cloudResponse.secure_url,
            }
        })

        return res.status(200).json({
            success:true,
            message:'Account created successfully'
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


export const login = async (req,res) => {
    try{

        const {email,password,role} = req.body
        /*console.log(email,password,role)*/

        if(!email || !password || !role) {
            return res.status(400).json({
                success:false,
                message:'Something is missing'
            })
        }

        let user = await User.findOne({email})

        if(!user)
        {
            return res.status(400).json({
                success:false,
                message:'Incorrect Email'
            })
        }

        const isPasswordMatch = await bcrypt.compare(password,user.password)

        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:'Incorrect Password'
            })
        }

        // check role is correct or not
        if(role!== user.role){
            return res.status(400).json({
                success:false,
                message:'Account doesnot exist for current role'
            })
        }

        const tokenData = {
            userId:user._id,
            expriesIn:'1d',
        }

        const token = await jwt.sign(tokenData,process.env.SECRET_KEY)

        user = {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }

        return res.status(200).cookie("token",token,
                                                    {
                                                        maxAge:1*24*60*60*1000,
                                                        httpsOnly:true,
                                                        sameSite:'strict'
                                                    }).json({
                                                        success:true,
                                                        message:`Welcome back ${user.fullname}`,
                                                        user,
                                                    })

    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:'LogIn Failed.Please try agin later.'
        })
    }
}


export const logout = async (req,res) => {
    try{
        return res.status(200).cookie("token","",{maxAge:0}).json({
                                                                    success:true,
                                                                    message:'LogOut Successfully'
                                                                })
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:'LogOut Failed.Please try agin later.'
        })
    }
}


export const updateProfile = async (req,res) => {
    try{
        const {fullname,email,phoneNumber,bio,skills} = req.body
        /*console.log(fullname,email,phoneNumber,bio,skills)*/

        const file = req.file

        //cloudinary ayega idhar
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)
        // console.log(cloudResponse)
        const urlsplit=cloudResponse.secure_url.split(".")
        console.log(urlsplit);
        urlsplit[3]="jpg";
        const url = urlsplit.join(".")
        console.log(url);

        let skillsArray;
        if(skills){
             skillsArray = skills.split(",")
        }

        const userId = req.id //middleware authentication

        let user = await User.findById(userId)

        if(!user)
        {
            return res.status(400).json({
                success:false,
                message:'User not found'
            })
        }

        // upadting user
        if(fullname) user.fullname=fullname
        if(email) user.email=email
        if(phoneNumber) user.phoneNumber=phoneNumber
        if(bio) user.profile.bio=bio
        if(skills) user.profile.skills=skillsArray

        //resume comes later here
        if(cloudResponse){
            user.profile.resume = url  //set the cloudinary url
            user.profile.resumeOriginalName = file.originalname  // save the original name of file
        }

        await user.save()

        user ={
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile
        }

        return res.status(200).json({
            success:true,
            message:'Profile updated successfully',
            user,
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}