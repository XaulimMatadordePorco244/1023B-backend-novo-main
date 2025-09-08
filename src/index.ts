import express from 'express'
import mysql from 'mysql2/promise'
import 'dotenv/config'

const app = express()


app.get('/', async (req, res) => {
    if (process.env.DBHOST === undefined) {
        res.status(500).send('DBHOST não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBUSER === undefined) {
        res.status(500).send('DBUSER não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBPASSWORD === undefined) {
        res.status(500).send('DBPASSWORD não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBDATABASE === undefined) {
        res.status(500).send('DBDATABASE não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBPORT === undefined) {
        res.status(500).send('DBPORT não esta definido nas variaveis de ambiente')
        return
    }

    try {
        const conn = await mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE,
            port: Number(process.env.DBPORT)
        })
        res.send("Conectado ao banco!")
    }
    catch (err) {
        if (err instanceof Error === false) {
            res.status(500).send("Erro desconhecido ao conectar")
            return
        }
        const error = err as Error
        res.status(500).send("Erro ao conectar ao banco de dados: " + err.message)
    }
})
app.get('/produtos', async (req, res) => {
    if (process.env.DBHOST === undefined) {
        res.status(500).send('DBHOST não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBUSER === undefined) {
        res.status(500).send('DBUSER não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBPASSWORD === undefined) {
        res.status(500).send('DBPASSWORD não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBDATABASE === undefined) {
        res.status(500).send('DBDATABASE não esta definido nas variaveis de ambiente')
        return
    }
    if (process.env.DBPORT === undefined) {
        res.status(500).send('DBPORT não esta definido nas variaveis de ambiente')
        return
    }

    try {
        const db = await mysql.createConnection({
            host: process.env.DBHOST,
            user: process.env.DBUSER,
            password: process.env.DBPASSWORD,
            database: process.env.DBDATABASE,
            port: Number(process.env.DBPORT)
        })
        const [rows] = await db.query("SELECT id, nome, preco, urlfoto, descricao FROM produtos");
        res.json(rows);

    } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        res.status(500).json({ error: "Erro interno ao buscar produtos" });
        if (err instanceof Error === false) {
            res.status(500).send("Erro desconhecido ao conectar")
            return
        }
        const error = err as Error
        console.log(err)
        res.status(500).send("Erro ao conectar ao banco de dados: " + err.message)
    }
});


app.listen(8000, () => {
    console.log('Server is running on port 8000')
})

//termminei