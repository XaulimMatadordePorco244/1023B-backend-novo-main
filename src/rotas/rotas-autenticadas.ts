import {Router} from 'express'

import carrinhoController from '../carrinho/carrinho.controller.js'
import produtosController from '../produtos/produtos.controller.js'


const rotas = Router()


rotas.put('/carrinho/atualizarQuantidade',carrinhoController.atualizarQuantidade)
rotas.post('/carrinho/adicionarItem',carrinhoController.adicionarItem)
rotas.delete('/carrinho/excluir',carrinhoController.remover)
rotas.delete('/carrinho/item',carrinhoController.removerItem)
rotas.get('/carrinho',carrinhoController.listar)


// Rotas dos produtos

rotas.post('/produtos',produtosController.adicionar)




export default rotas