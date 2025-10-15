import {Router} from 'express'


import usuariosController from '../usuarios/usuariosController.js'
import produtosController from '../produtos/produtos.controller.js'

const rotas = Router()

rotas.get('/produtos',produtosController.listar)

// Rotas dos usuários
rotas.post('/adicionarUsuario', usuariosController.adicionar)
rotas.post('/login', usuariosController.login)

export default rotas