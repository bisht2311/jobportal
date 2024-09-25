import { Company } from "../models/company.model.js"
import cloudinary from "../utils/cloudinary.js"
import getDataUri from "../utils/datauri.js"

export const registerCompany = async (req,res) => {
    try{
        const {companyName} = req.body

        if(!companyName){
            return res.status(400).json({
                success:false,
                message:'Company name is required'
            })
        }

        let company = await Company.findOne({companyName})

        if(company){
            return res.status(400).json({
                success:false,
                message:'Company name cannot be same',
            })
        }

        company = await Company.create({
            name:companyName,
            userId:req.id,
        })

        return res.status(201).json({
            success:true,
            message:'Company register successfully',
            company,
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}


export const getCompany = async (req,res) => {
    try{
        const {userId} = req.id  // logedin userId

        const companies = await Company.find(userId)

        if(!companies)
        {
            return res.status(404).json({
                success:false,
                message:'Companies not found',
            })
        }

        return res.status(200).json({
            success:true,
            message:`Compnaies by ${userId}`,
            companies,
        })

    }
    catch(error)
    {
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}


export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found.",
            })
        }
        return res.status(200).json({
            success: true,
            company,
        })
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}

export const updateCompany = async (req,res) => {
    try{
        const {name,description,website,location} = req.body
        const file = req.file

        //console.log(name,description,website,location)
        // cloudinary
        const fileUri = getDataUri(file)
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content)

        const logo = cloudResponse.secure_url

        const updateData = {name,description,website,location,logo}

        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true})

        if(!company){
            return res.status(404).json({
                success:false,
                message:'Company not found',
            })
        }

        return res.status(200).json({
            success:true,
            message:'Company info updated successfully',
        })
    }
    catch(error){
        console.log(error.message)
        return res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}