const express = require("express");
const jwt = require("jsonwebtoken");
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: ""
})

const app = express();
app.use(express.json())



app.post("/signup", async (req, res) => {
    username = req.body.username;
    email = req.body.email;
    password = req.body.password;

    const response = await pool.query(`INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id ;`,
        [username,email,password]);
    console.log(response);
    res.json({
        message: "Signup done",
        id: response.rows[0].id
    })
})


app.post("/signin", async (req, res) => {
    email = req.body.email;
    password = req.body.password;

    const response = await pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2;`,
        [email,password]);
    console.log(response);

    const userExists = response.rows[0];

    if (!userExists) {
        res.status(403).json({
            message: "Incorrect input"
        })
    } else {
        const token = jwt.sign({
            userId: userExists.id
        }, "attlasiationsupersecret123123password");

        res.json({
            token
        })
    }
})
app.listen(3000);