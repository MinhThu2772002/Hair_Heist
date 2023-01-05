import HairStyle from "../models/HairStyleModel.js";
import path from "path";
import { response } from "express";
import fs from "fs";
import { Op } from "sequelize"
import Comments from "../models/CommentModel.js";

export const getCommentById = async(req, res) => {
    try {
        const response = await Comments.findAll({
            where: {
                hairId: req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message);
    }
}