# AgroDigital API — Backend (GPS.dev)

Primeira API backend do projeto AgroDigital. Construída em **Node.js + Express**, com persistência em arquivos JSON (a etapa de banco de dados vem depois).

## O que você aprende neste projeto

1. O que é um servidor e como ele "escuta" requisições
2. Rotas REST (GET, POST, PUT, DELETE)
3. Separação rota → controller (padrão profissional)
4. Leitura e escrita de arquivos com `fs`
5. Relacionamento entre dados (safra pertence a fazenda)
6. CORS, middlewares e códigos de status HTTP (200, 201, 400, 404)

## Estrutura

```
agrodigital-api/
├── server.js                        # Coração do servidor
├── package.json                     # Dependências e scripts
├── .gitignore
├── routes/
│   ├── fazendas.js                  # Endereços das rotas de fazendas
│   └── safras.js                    # Endereços das rotas de safras
├── controllers/
│   ├── fazendas-controller.js       # Lógica CRUD de fazendas
│   └── safras-controller.js         # Lógica de safras
├── data/
│   ├── fazendas.json                # "Banco de dados" em arquivo
│   └── safras.json
└── public/
    └── index.html                   # Painel de teste visual (GPS.dev)
```

## Como rodar (no seu Debian 12)

```bash
# 1. Entre na pasta do projeto
cd agrodigital-api

# 2. Instale as dependências (cria a pasta node_modules)
npm install

# 3. Inicie em modo desenvolvimento (reinicia sozinho ao salvar)
npm run dev
```

Abra no navegador:

- `http://localhost:3000` → painel de teste visual
- `http://localhost:3000/api` → resposta JSON da API
- `http://localhost:3000/api/fazendas` → lista de fazendas

Para parar o servidor: `Ctrl + C` no terminal.

## Testando as rotas pelo terminal (curl)

```bash
# Listar fazendas
curl http://localhost:3000/api/fazendas

# Buscar a Fazenda Pipe
curl http://localhost:3000/api/fazendas/3

# Cadastrar nova fazenda
curl -X POST http://localhost:3000/api/fazendas \
  -H "Content-Type: application/json" \
  -d '{"nome":"Fazenda Nova Era","cidade":"Rio Verde","estado":"GO","culturaPrincipal":"Sorgo"}'

# Atualizar a fazenda 1
curl -X PUT http://localhost:3000/api/fazendas/1 \
  -H "Content-Type: application/json" \
  -d '{"areaHectares":520}'

# Remover a fazenda 4
curl -X DELETE http://localhost:3000/api/fazendas/4
```

## Roteiro de estudo (ordem de leitura dos arquivos)

1. `server.js` — entenda como o servidor nasce
2. `routes/fazendas.js` — veja como as URLs são mapeadas
3. `controllers/fazendas-controller.js` — a lógica de cada operação
4. `data/fazendas.json` — abra antes e depois de um POST e veja mudar
5. `public/index.html` — como o front conversa com o back via `fetch`

## Próximas etapas (evolução em estágios)

- [ ] Etapa 2: adicionar rota PUT e DELETE para safras (exercício seu)
- [ ] Etapa 3: trocar JSON por banco SQLite
- [ ] Etapa 4: autenticação com token (login)
- [ ] Etapa 5: deploy no Render (mesmo lugar do front AgroDigital)

---
**GPS.dev** — Gustavo Paula Santos · Filósofo que programa
