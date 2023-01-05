import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";
import HairStyle from "./HairStyleModel.js";
const { DataTypes } = Sequelize;

const Bookmarks = db.define(
    "bookmarks", {

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

    }, {
        freezeTableName: true,
    }
);

Users.hasMany(Bookmarks);
Bookmarks.belongsTo(Users, { foreignKey: 'userId', targetKey: "users.uuid", constraints: false });
Bookmarks.hasOne(HairStyle);
Bookmarks.belongsTo(HairStyle, { foreignKey: 'hairId', targetkey: "HairStyle.uuid", constraints: false });
export default Bookmarks;