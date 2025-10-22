import { Request, Response } from "express";
import { db } from '../database/banco-mongo.js';
import { ObjectId } from 'mongodb';   

interface ItemCarrinho {
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    nome: string;
}

interface Carrinho {
    usuarioId: string;
    itens: ItemCarrinho[];
    dataAtualizacao: Date;
    total: number;
}

interface AutenticacaoRequest extends Request {
    usuarioId?: string
}

class CarrinhoController {

    async adicionarItem(req: AutenticacaoRequest, res: Response) {
        try {
            const { produtoId, quantidade } = req.body;
            const usuarioId = req.usuarioId; 
            if (!usuarioId || !produtoId || !quantidade) {
                return res.status(400).json({ error: "usuarioId, produtoId e quantidade são obrigatórios" });
            }

            let produto;
            try {
                produto = await db.collection('produtos')
                    .findOne({ _id: ObjectId.createFromHexString(produtoId) });
            } catch (e) {
                // Se não for um ObjectId válido, evita erro
                return res.status(400).json({ error: "produtoId inválido" });
            }

            if (!produto) {
                return res.status(404).json({ error: "Produto não encontrado" });
            }

            // Verificar se um carrinho com o usuário já existe
            let carrinho: any = await db.collection('carrinhos').findOne({ usuarioId });

            const item: ItemCarrinho = {
                produtoId, // continua guardando como string pra facilitar
                quantidade,
                precoUnitario: produto.preco,
                nome: produto.nome,
            };

            if (!carrinho) {
                carrinho = {
                    usuarioId,
                    itens: [item],
                    dataAtualizacao: new Date(),
                    total: item.precoUnitario * item.quantidade
                };
                await db.collection('carrinhos').insertOne(carrinho);
            } else {
                // Atualiza ou adiciona item
                const index = carrinho.itens.findIndex((i: ItemCarrinho) => i.produtoId === produtoId);
                if (index > -1) {
                    carrinho.itens[index].quantidade += quantidade;
                } else {
                    carrinho.itens.push(item);
                }
                carrinho.total = carrinho.itens.reduce(
                    (acc: number, i: ItemCarrinho) => acc + i.precoUnitario * i.quantidade,
                    0
                );
                carrinho.dataAtualizacao = new Date();
                await db.collection('carrinhos').updateOne(
                    { usuarioId },
                    { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
                );
            }


            return res.status(201).json(carrinho);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: "Erro ao adicionar item ao carrinho", details: error });
        }
    }




    // Remove um item do carrinho
    async removerItem(req: Request, res: Response) {
        try {
            const { usuarioId, produtoId } = req.body;
            if (!usuarioId || !produtoId) {
                return res.status(400).json({ error: "usuarioId e produtoId são obrigatórios" });
            }
            const carrinho = await db.collection('carrinhos').findOne({ usuarioId });
            if (!carrinho) {
                return res.status(404).json({ error: "Carrinho não encontrado" });
            }
            const itensAtualizados = carrinho.itens.filter((item: any) => item.produtoId !== produtoId);
            const total = itensAtualizados.reduce((acc: number, i: any) => acc + i.precoUnitario * i.quantidade, 0);
            await db.collection('carrinhos').updateOne(
                { usuarioId },
                { $set: { itens: itensAtualizados, total, dataAtualizacao: new Date() } }
            );
            return res.status(200).json({ mensagem: "Item removido do carrinho" });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao remover item", details: error });
        }
    }

    // Atualiza a quantidade de um item
    async atualizarQuantidade(req: AutenticacaoRequest, res: Response) {
        try {
            const { produtoId, quantidade } = req.body;
            const usuarioId = req.usuarioId;
            if (!usuarioId || !produtoId || typeof quantidade !== 'number') {
                return res.status(400).json({ error: "usuarioId, produtoId e quantidade são obrigatórios" });
            }
            const carrinho = await db.collection('carrinhos').findOne({ usuarioId });
            if (!carrinho) {
                return res.status(404).json({ error: "Carrinho não encontrado" });
            }
            const index = carrinho.itens.findIndex((item: any) => item.produtoId === produtoId);
            if (index === -1) {
                return res.status(404).json({ error: "Item não encontrado no carrinho" });
            }
            carrinho.itens[index].quantidade = quantidade;
            carrinho.total = carrinho.itens.reduce((acc: number, i: any) => acc + i.precoUnitario * i.quantidade, 0);
            carrinho.dataAtualizacao = new Date();
            await db.collection('carrinhos').updateOne(
                { usuarioId },
                { $set: { itens: carrinho.itens, total: carrinho.total, dataAtualizacao: carrinho.dataAtualizacao } }
            );
            return res.status(200).json({ mensagem: "Quantidade atualizada" });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao atualizar quantidade", details: error });
        }
    }

    // Lista o carrinho do usuário
    async listar(req: Request, res: Response) {
        try {
            const { usuarioId } = req.query;
            if (!usuarioId) {
                return res.status(400).json({ error: "usuarioId é obrigatório" });
            }
            const carrinho = await db.collection('carrinhos').findOne({ usuarioId });
            if (!carrinho) {
                return res.status(404).json({ error: "Carrinho não encontrado" });
            }
            return res.status(200).json(carrinho);
        } catch (error) {
            return res.status(500).json({ error: "Erro ao listar carrinho", details: error });
        }
    }

    // Remove o carrinho inteiro
    async remover(req: AutenticacaoRequest, res: Response) {
        try {
            const usuarioId = req.usuarioId;
            if (!usuarioId) {
                return res.status(400).json({ error: "usuarioId é obrigatório" });
            }
            const resultado = await db.collection('carrinhos').deleteOne({ usuarioId });
            if (resultado.deletedCount === 0) {
                return res.status(404).json({ error: "Carrinho não encontrado" });
            }
            return res.status(200).json({ mensagem: "Carrinho removido com sucesso" });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao remover carrinho", details: error });
        }
    }

}
export default new CarrinhoController();