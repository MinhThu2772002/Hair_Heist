import Users from "../models/UsersModel.js";
import HairStyle from "../models/HairStyleModel.js";
import Bookmarks from "../models/BookmarksModel.js";
import argon2 from "argon2";
import path from "path";
import fs from "fs";
import Keywords from "../models/KeyworkModel.js";

export const createKeyword = async (req, res) => {
    const { word } = req.body;
    try {
        await Keywords.create({
            hairId: req.params.hairId,
            word: word,
        });
        res.status(201).json({ msg: "Add keyword Successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

export const deleteKeyword = async (req, res) => {
    const { word } = req.body;
    const keyword = await Keywords.findOne({
        where: {
            hairId: req.params.hairId,
            word: word,
        }
    });
    if (!keyword) return res.status(404).json({ msg: "Keyword doesn't exist" });
    try {
        await Keywords.destroy({
            where: {
                hairId: req.params.hairId,
                word: word,
            },
        });
        res.status(200).json({ msg: "Delete successfully" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};