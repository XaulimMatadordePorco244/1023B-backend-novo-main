import express, { Request, Response } from 'express'
import 'dotenv/config'
import { MongoClient } from 'mongodb'
import rotas from './rotas.js'

const client = new MongoClient(process.env.MONGO_URI!)
await client.connect()

export const db = client.db(process.env.MONGO_DB!)

const app = express()


app.use(express.json())

app.use(rotas)


app.listen(8000, () => {
    console.log('Server is running on port 8000')
})