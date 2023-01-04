import Users from "../models/UsersModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
export const getUsers = async(req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ["uuid", "name", "email", "role"],
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getUserById = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        }
    });

    if (user.role == "user") {


        try {
            const response = await Users.findOne({
                attributes: ["uuid", "name", "email", "role", "profileImgUrl"],
                where: {
                    uuid: req.params.id,
                },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    } else {
        try {
            const response = await Users.findOne({
                attributes: ["uuid", "name", "email", "role", "profileImgUrl", "isVerified", "licenseImgUrl", "Introduce"],
                where: {
                    uuid: req.params.id,
                },
            });
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
    }

};

export const createUser = async(req, res) => {

    const { name, email, password, confPassword, role } = req.body;
    const user = await Users.findOne({
        where: {
            email: email,
        }
    });
    if (user) return res.status(404).json({ msg: "User has already exist!!" });
    if (password !== confPassword)
        return res
            .status(400)
            .json({ msg: "Confirm password differ from password " });
    const hashPassword = await argon2.hash(password);
    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
        });
        res.status(201).json({ msg: "Register Successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};
export const updateUser = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        }
    });
    if (!user) return res.status(404).json({ msg: "User is not exist" });
    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if (password !== confPassword)
        return res
            .status(400)
            .json({ msg: "Confirm password differ from password  " });
    try {
        await Users.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role,
        }, {
            where: {
                id: user.id,
            }
        });
        res.status(200).json({ msg: "Update user successfull" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteUser = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        }
    });
    if (!user) return res.status(404).json({ msg: "User isn't exist" });
    try {
        await Users.destroy({
            where: {
                id: user.id,
            },
        });
        res.status(200).json({ msg: "Delete user successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const updateVerified = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        }
    });
    if (!user) return res.status(404).json({ msg: "User is not exist" });
    const { isVerified } = req.body;

    try {
        await Users.update({
            isVerified: isVerified
        }, {
            where: {
                id: user.id,
            }
        });
        res.status(200).json({ msg: "Update user successfull" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const UpdateProfileImg = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        }

    });
    if (!user) return res.status(404).json({ msg: "User not exist" });

    let fileName = "";
    if (req.files === null) {
        return res.status(400).json({ msg: "No File Uploaded" });
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });



        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await user.update({ image: fileName, profileImgUrl: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "Profile picture Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
};

export const UpdateLicenseImg = async(req, res) => {
    const user = await Users.findOne({
        where: {
            uuid: req.params.id,
        }

    });
    if (!user) return res.status(404).json({ msg: "Designer not exist" });

    let fileName = "";
    if (req.files === null) {
        return res.status(400).json({ msg: "No File Uploaded" });
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });



        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await user.update({ licenseImgUrl: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "License Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
};