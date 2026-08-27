const Hospital = require("../models/Hospital");

exports.getHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();

        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch hospitals",
            error: error.message
        });
    }
};

exports.getHospitalById = async (req, res) => {
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        res.status(200).json(hospital);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch hospital",
            error: error.message
        });
    }
};

exports.createHospital = async (req, res) => {
    try {
        const { name, city, totalBeds, availableBeds } = req.body;

        if (!name || !city || totalBeds === undefined || availableBeds === undefined) {
            return res.status(400).json({
                message: "All hospital fields are required"
            });
        }

        const hospital = await Hospital.create({
            name,
            city,
            totalBeds,
            availableBeds
        });

        res.status(201).json({
            message: "Hospital created successfully",
            hospital
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create hospital",
            error: error.message
        });
    }
};

exports.updateHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            message: "Hospital updated successfully",
            hospital
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update hospital",
            error: error.message
        });
    }
};

exports.deleteHospital = async (req, res) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);

        if (!hospital) {
            return res.status(404).json({
                message: "Hospital not found"
            });
        }

        res.status(200).json({
            message: "Hospital deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete hospital",
            error: error.message
        });
    }
};

exports.getAvailableHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find({
            availableBeds: { $gt: 0 }
        });

        res.status(200).json(hospitals);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch available hospitals",
            error: error.message
        });
    }
};