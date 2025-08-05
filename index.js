import express from "express";
import {Client} from "pg";
import {Pool} from "pg";
import dotenv from "dotenv";
import authenticationToken from "./middleware/authentication.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import { PrismaClient } from './generated/prisma/index.js'
const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(express.json());

// const client = new Client({
//     user: process.env.DB_USER, 
//     password: process.env.DB_PASSWORD, 
//     host: process.env.DB_HOST, 
//     port: process.env.DB_PORT,
//     database: process.env.DB_NAME
// })
// await client.connect();
// console.log("Connected to the database")

// app.post('/query' , authenticationToken , async(req, res) => {
//     const {query} = req.body;

//     const response =  await client.query(query)
//     console.log(response)

//     res.json(response.rows)
// })

const pool = await new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 60000,
})
console.log("Connected to the database")
console.log("pool size is", pool.totalCount)
console.log("pool idle count is", pool.idleCount)


app.post('/poolQuery', authenticationToken, async(req, res) => {
    const {query} = req.body;
    const response =  await pool.query(query)
    // console.log(response)

    res.json(response.rows)
})

app.post('/signin', async (req, res) => {
    try{
        const {name, username, password} = req.body; 
        const hashed = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                username,
                password: hashed
            }
        })
        console.log("User created", user);
        const token = jwt.sign({username} , process.env.JWT_SECRET )
        console.log("Token created", token);
        res.json({token})
    }
    catch(e){
        console.error( "Error creating user" ,e)
    }
    finally{
        await prisma.$disconnect();
    }
})

app.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await prisma.user.findFirst({
            where: {
                username
            }
        })
        if(!user){ res.json({ message: "User not found. "})}
        const success = await bcrypt.compare(password, user.password);
        if(!success){
            res.json({
                message: "Invalid password"
            })
        }
        const token = jwt.sign({username}, process.env.JWT_SECRET)
        res.json({token})
    }
    catch(e){
        console.log("Error while logging in : ", e)
    }
})

app.get('/poolStats', (req, res) => {
    res.json({
        totalCount: pool.totalCount,
        idleCount: pool.idleCount
    })
})

// await pool.end();
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})