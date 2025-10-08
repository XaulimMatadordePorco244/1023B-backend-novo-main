import {Router} from 'express'

import carrinhoController from '../carrinho/carrinho.controller.js'
import produtosController from '../produtos/produtos.controller.js'
import usuariosController from '../usuarios/usuariosController.js'

const rotas = Router()

// Rotas do Carrinho
rotas.put('/carrinho/atualizarQuantidade',carrinhoController.atualizarQuantidade)
rotas.post('/carrinho/adicionarItem',carrinhoController.adicionarItem)
rotas.delete('/carrinho/excluir',carrinhoController.remover)
rotas.delete('/carrinho/item',carrinhoController.removerItem)
rotas.get('/carrinho',carrinhoController.listar)


// Rotas dos produtos
rotas.get('/produtos',produtosController.listar)
rotas.post('/produtos',produtosController.adicionar)


// Rotas dos usuários
rotas.post('/adicionarUsuario', usuariosController.adicionar)
rotas.post('/login', usuariosController.login)

export default rotas