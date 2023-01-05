import HairStyle from "../models/HairStyleModel.js";
import path from "path";
import { response } from "express";
import fs from "fs";
import Users from "../models/UsersModel.js";
import { Op } from "sequelize"
import Keywords from "../models/KeyworkModel.js";
export const getHairStyles = async(req, res) => {
    try {

        const responses = await HairStyle.findAll({
            attributes: ["uuid", "name", "image", "url", "designerId"],
            include: [{
                model: Users,
                attributes: ["name", "email", "profileImgUrl"]
            }]
        });

        res.json(responses);
    } catch (error) {
        console.log(error.message);
    }
}

export const getHairStyleById = async(req, res) => {
    try {
        const response = await HairStyle.findOne({
            attributes: ["uuid", "name", "image", "url"],
            where: {
                uuid: req.params.id
            },
            include: [{
                model: Users,
                attributes: ["name", "email", "profileImgUrl"]
            }]
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}

// export const getHairStyleByKeyword = async(req, res) => {
//     const { keys = '' } = req.body;
//     try {
//         const response = await Keywords.findAll({
//             attributes: ["hairId", "word"],
//             where: {
//                 word: keys
//             }
//         });
//         res.json(response);
//     } catch (error) {
//         console.log(error.message);
//     }
// }

export const getHairStyleByKeyword = async(req, res) => {
    const { keys = '' } = req.body;
    const words = await Keywords.findAll({
        where: {
            word: keys,
        },
    });
    const hairIds = words.map(word => word.hairId);
    try {
        if (hairIds.length === 0) {
            res.status(400).json({ msg: 'No hair styles found for the given keywords' });
            return;
        }

        const response = await HairStyle.findAll({
            attributes: ["uuid", "name", "image", "url", "designerId", "modelId"],
            where: {
                uuid: {
                    [Op.in]: hairIds,
                },
            },
            include: [{
                model: Users,
                attributes: ["name", "email", "profileImgUrl"]
            }]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

// export const getHairStyleByKeyword = async(req, res) => {
//     const keys = req.body;    
//     try {

//             const words = await Keywords.findAll({
//                 include: [{
//                     model: HairStyle,
//                     required: true,
//                     where: {
//                         word: keys,
//                     }

//                 }],

//             });
//             const response = await HairStyle.findAll({
//                 where: {
//                     uuid: words.hairId,
//                 },
//             });
//             res.status(200).json(response);
//         } catch (error) {
//             res.status(500).json({ msg: error.message });
//         }



// };

export const saveHairStyle = (req, res) => {

    if (req.files === null) return res.status(400).json({ msg: "No File Uploaded" });
    const name = req.body.title;
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png', '.jpg', '.jpeg'];

    if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async(err) => {
        if (err) return res.status(500).json({ msg: err.message });
        try {
            const tempde = await Users.findOne({
                attributes: ["uuid"],
                where: {
                    id: req.userId
                }
            });
            await HairStyle.create({
                name: name,
                image: fileName,
                url: url,
                designerId: tempde.uuid
            });
            res.status(201).json({ msg: "HairStyle Created Successfuly" });
        } catch (error) {
            console.log(error.message);
        }
    })

}

export const updateHairStyle = async(req, res) => {
    const HairStylei = await HairStyle.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!HairStylei) return res.status(404).json({ msg: "No Data Found" });

    let fileName = "";
    if (req.files === null) {
        fileName = HairStylei.image;
    } else {
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) return res.status(422).json({ msg: "Invalid Images" });
        if (fileSize > 5000000) return res.status(422).json({ msg: "Image must be less than 5 MB" });

        const filepath = `./public/images/${HairStylei.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) return res.status(500).json({ msg: err.message });
        });
    }
    const name = req.body.title;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

    try {
        await HairStylei.update({ name: name, image: fileName, url: url }, {
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "HairStyle Updated Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}

export const deleteHairStyle = async(req, res) => {
    const HairStylei = await HairStyle.findOne({
        where: {
            id: req.params.id
        }
    });
    if (!HairStylei) return res.status(404).json({ msg: "No Data Found" });

    try {
        const filepath = `./public/images/${HairStylei.image}`;
        fs.unlinkSync(filepath);
        await HairStylei.destroy({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({ msg: "HairStyle Deleted Successfuly" });
    } catch (error) {
        console.log(error.message);
    }
}