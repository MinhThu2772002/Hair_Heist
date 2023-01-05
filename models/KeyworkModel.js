import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";
import HairStyle from "./HairStyleModel.js";
const { DataTypes } = Sequelize;

const Keywords = db.define(
    "Keywords", {
        hairId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true

            }
        },
        word: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true

            }
        },
    }, {
        freezeTableName: true,
    }
);

HairStyle.hasMany(Keywords);
Keywords.belongsTo(HairStyle, { foreignKey: 'hairId', targetkey: "HairStyle.uuid", constraints: false })
export default Keywords;