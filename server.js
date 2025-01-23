import express from "express";
import * as middleware from "./middleware/index.js";
import cors from "cors";
import mysql from 'mysql2';
import dotenv from "dotenv";

const app = express();
dotenv.config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(middleware.bodyParserJson);
app.use(middleware.bodyParserUrlencoded);

app.post('/', (req, res) => {
    console.log("form data =>", req.body)
    const query = `
    INSERT INTO students (name, email, course, sem, roll_number) 
    VALUES (?, ?, ?, ?, ?)
`;
    const values = [req.body.name, req.body.email, req.body.course, req.body.sem, req.body.roll_number];

    db.execute(query, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('<h1>Error inserting data</h1>');
        }
        console.log('Data inserted:', result);
        res.send('<h1>Form Submitted Successfully!</h1>');
    });
})

app.listen(80, () => {
    console.log("server is running ..");
});