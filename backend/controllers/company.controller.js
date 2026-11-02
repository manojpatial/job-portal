import { Company } from '../models/company.model.js';
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: 'Company name is required',
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: 'Company already exists',
                success: false
            });
        }
        company = await Company.create({
            name: companyName,
            userId: req.id, // from authentication 
        });

        res.status(201).json({
            message: 'Company registered successfully',
            company,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering company', error });
    }
};

//Get company details for logged in user
export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // this is logged in user id from authentication middleware
        const companies = await Company.find({ userId });
        console.log(companies);
        if (!companies) {
            return res.status(404).json({
                message: 'Company not found',
                success: false
            });
        }

        res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error });
    }
};

//Get company by ID

export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                message: 'Company not found',
                success: false
            });
        }
        res.status(200).json({
            company,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error });
    }
};


//Update company details for logged in user
export const updateCompany = async (req, res) => {
    try {

        const { name, description, website, location } = req.body;
        const file = req.file; // with coudinary, the file path will be available in req.file.path
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;


        const updateData = { name, description, website, location, logo };
        //const company = await Company.findOneAndUpdate({ _id: req.params.id }, updateData, { new: true });
        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: 'Company not found',
                success: false
            });
        }
        res.status(200).json({
            message: 'Company updated successfully',
            company,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error });
    }
};