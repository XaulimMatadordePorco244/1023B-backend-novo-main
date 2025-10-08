import express from 'express'
import 'dotenv/config'
import { MongoClient } from 'mongodb'
import rotasAutenticadas from './rotas/rotas-autenticadas.js'
import rotasNaoAutenticadas from './rotas/rotas-nao-autenticadas.js'
import { auth } from './middleware/auth.js'


const client = new MongoClient(process.env.MONGO_URI!)
await client.connect()

export const db = client.db(process.env.MONGO_DB!)

const app = express()



app.use(express.json())

app.use(auth, rotasAutenticadas)
app.use(rotasNaoAutenticadas)


app.listen(8000, () => {
    console.log('Server is running on port 8000')
})