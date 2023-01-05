import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";
import HairStyle from "./HairStyleModel.js";
const { DataTypes } = Sequelize;

const Comments = db.define(
    "Comments", {

        hairId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true

            }
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true

            }
        },
        message: {
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

Users.hasMany(Comments);
Comments.belongsTo(Users, { foreignKey: 'userId', targetKey: "uuid", constraints: false });
Comments.hasOne(HairStyle)
Comments.belongsTo(HairStyle, { foreignKey: 'hairId', targetkey: "HairStyle.uuid", constraints: false });
export default Comments;