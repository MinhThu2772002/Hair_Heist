import express from "express";
import FileUpload from "express-fileupload";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import UserRoute from "./routes/UserRoute.js";
import HairStyleRoute from "./routes/HairStyleRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/Database.js";

dotenv.config();

const app = express();
/*(async() => {
    await db.sync();
})();*/
const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db: db

});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'

}));
app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));
app.use(UserRoute);
app.use(HairStyleRoute);
app.use(AuthRoute);
// store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running..');
});