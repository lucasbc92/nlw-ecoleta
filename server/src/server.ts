import express from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.use(errors());

app.listen(3333);

//Rota: Endereço completo da requisição (localhost:3333/users)
//Recurso: Entidade do sistema que é acessada (users)

/*
Métodos HTTP:

GET: Buscar/listar uma informação no back-end
POST: Criar
PUT: ALterar
DELETE: Remover uma informação do back-end
*/

/*
Tipos de parâmetros:

Query Params: Parâmetros nomeados enviados na rota após "?" (filtros, paginação) - /users?page=2&name=Lucas
Route Params: Parâmetros utilizados para identificar recursos - /users/:id (ex.:/users/1)
Request Body: Corpo da requisicão, utilizado para criar ou alterar recursos
*/