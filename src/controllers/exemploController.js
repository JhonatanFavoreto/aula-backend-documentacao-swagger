import ExemploModel from '../models/ExemploModel.js';

/**
 * @typedef {object} ReqBodyExemplo
 * @property {string} nome - Nome do exemplo
 * @property {boolean} estado.required - Estado do exemplo (obrigatório)
 * @property {number} preco.required - Preço do exemplo (obrigatório)
 */

/**
 * POST /api/exemplos
 * @tags Exemplos
 * @summary Cria um novo registro de exemplo
 * @description Endpoint responsável por cadastrar um novo exemplo no sistema web
 * @param {ReqBodyExemplo} request.body.required
 *
 * @return 201 - Exemplo criado com sucesso
 * @return 400 - Dados inválidos ou campos obrigatórios não informados
 * @return 500 - Erro interno do servidor
 */

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, estado, preco } = req.body;

        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (preco === undefined || preco === null) {
            return res.status(400).json({ error: 'O campo "preco" é obrigatório!' });
        }

        const exemplo = new ExemploModel({ nome, estado, preco: parseFloat(preco) });
        const data = await exemplo.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

/**
 * GET /api/exemplos
 * @tags Exemplos
 * @summary Busca todos os registros de exemplo
 * @description Endpoint responsável por buscar todos os registros de exemplo no sistema web
 * Permite filtrar os resultados utilizando parâmetros de consulta (query params).
 * @param {string} nome.query
 * @param {boolean} estado.query
 * @param {number} preco.query
 *
 * @return 200 - Registros encontrados com sucesso
 * @return 400 - Nenhum registro encontrado
 * @return 500 - Erro interno do servidor
 */

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ExemploModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

/**
 * GET /api/exemplos/{id}
 * @tags Exemplos
 * @summary Busca um registro de exemplo
 * @description Endpoint responsável por buscar um registro de exemplo por ID
 * @param {integer} id.path.required
 *
 * @return 200 - Registro encontrado com sucesso
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno do servidor
 */

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: exemplo });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

/**
 * PUT /api/exemplos/{id}
 * @tags Exemplos
 * @summary Atualiza um registro de exemplo
 * @description Endpoint responsável por atualizar um registro de exemplo por ID
 * @param {integer} id.path.required
 * @param {ReqBodyExemplo} request.body.required
 *
 * @return 200 - Registro encontrado com sucesso
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno do servidor
 */

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }

        if (req.body.nome !== undefined) {
            exemplo.nome = req.body.nome;
        }
        if (req.body.estado !== undefined) {
            exemplo.estado = req.body.estado;
        }
        if (req.body.preco !== undefined) {
            exemplo.preco = parseFloat(req.body.preco);
        }

        const data = await exemplo.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

/**
 * DELETE /api/exemplos/{id}
 * @tags Exemplos
 * @summary Deleta um registro de exemplo
 * @description Endpoint responsável por deletar um registro de exemplo por ID
 * @param {integer} id.path.required
 *
 * @return 200 - Registro encontrado com sucesso
 * @return 400 - ID inválido
 * @return 404 - Registro não encontrado
 * @return 500 - Erro interno do servidor
 */

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const exemplo = await ExemploModel.buscarPorId(parseInt(id));

        if (!exemplo) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await exemplo.deletar();

        return res.status(200).json({ message: `O registro "${exemplo.nome}" foi deletado com sucesso!`, deletado: exemplo });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};
