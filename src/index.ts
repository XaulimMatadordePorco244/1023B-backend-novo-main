import express from 'express'
import mysql from 'mysql2/promise'
import 'dotenv/config'

const app = express()
app.get('/', (req, res) =>{
    res.send(process.env.DBPORT)
})

app.listen(8000, () =>{
    console.log('Server is running on port 8000')
})