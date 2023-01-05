import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UsersModel.js";
const { DataTypes } = Sequelize;

const HairStyle = db.define(
    "hairstyle", {
        uuid: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 100]
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            }
        },


        designerId: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true

            }
        },
        modelId: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                notEmpty: true

            }
        },

    }, {
        freezeTableName: true,
    }
);

Users.hasMany(HairStyle);
HairStyle.belongsTo(Users, { foreignKey: 'designerId', targetKey: "uuid", constraints: false });
export default HairStyle;