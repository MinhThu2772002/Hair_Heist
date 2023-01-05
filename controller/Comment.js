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

export const createComment = async(req, res) => {
    const { message } = req.body;
    try {
        await Comments.create({
            ownerId: req.session.userId,
            hairId: req.params.id,
            message: message,
        });
        res.status(201).json({ msg: "Comment Successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};