import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";
import HairStyle from "./HairStyleModel.js";
const { DataTypes } = Sequelize;

const Comments = db.define(
    "Comments", {

        hairId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true

            }
        },
        userId: {
            type: DataTypes.INTEGER,
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
Comments.belongsTo(Users, { foreignKey: 'userId' });
Comments.hasOne(HairStyle, { foreignKey: 'hairId' })
export default Comments;