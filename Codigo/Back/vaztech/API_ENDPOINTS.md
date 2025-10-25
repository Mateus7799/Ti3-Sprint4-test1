# API Endpoints - Vaztech Backend

Este documento lista os endpoints expostos pelo backend do projeto Vaztech. Inclui método HTTP, caminho completo, corpo esperado (quando aplicável), e exemplos de uso.

Base URL (local de desenvolvimento): http://localhost:8080

---

## Autenticação

### POST http://localhost:8080/auth/login
- Descrição: Faz login de um usuário.
- Request Body (JSON):
```json
{
  "id": 123,
  "senha": "minhaSenha"
}
```
- Response 200 (JSON):
```json
{
  "token": "<jwt-token-aqui>"
}
```
- Observações: O DTO usado é `LoginRequestDTO` (campos: `id`, `senha`). O endpoint chama `AuthService.login` e retorna um `AuthResponseDTO` com o token.

---

### POST /auth/register
- Descrição: Registra um novo usuário.
- Request Body (JSON):
```json
{
  "senha": "minhaSenha"
}
```
- Response 200 (JSON):
```json
{
  "token": "<jwt-token-aqui>"
}
```
- Observações: O DTO usado é `RegisterRequestDTO` (campo: `senha`). O endpoint chama `AuthService.register`.

---

## Usuário

### GET /usuario
- Descrição: Endpoint de teste que retorna uma string de sucesso.
- Request: sem corpo.
- Response 200 (text/plain):
```
Sucesso!
```

---

## Produtos / Estoque

### POST /api/produto
- Descrição: Adiciona um produto ao estoque.
- **Autenticação**: Requerida (Bearer Token)
- Request Body (JSON):
```json
{
  "numeroSerie": "ABC123",
  "aparelho": "Smartphone",
  "modelo": "X100",
  "cor": "Preto",
  "observacoes": "Sem avarias",
  "status": 1
}
```
- Response 201 (JSON):
- O `ProdutoAddResponseDTO` atualmente está vazio (record sem campos). Verifique a implementação do `ProdutoService` para campos retornados.

---

### PUT /api/produto/{numeroSerie}
- Descrição: **✅ IMPLEMENTADO** - Atualiza um produto existente no estoque.
- **Autenticação**: Requerida (Bearer Token)
- Path Parameter:
  - `numeroSerie` (obrigatório) - Número de série do produto a ser atualizado
- Request Body (JSON) - Todos os campos são opcionais, envie apenas os que deseja atualizar:
```json
{
  "aparelho": "Smartphone",
  "modelo": "X200",
  "cor": "Azul",
  "observacoes": "Atualizado",
  "status": 2
}
```
- Response 200 (JSON):
```json
{
  "numeroSerie": "ABC123",
  "aparelho": "Smartphone",
  "modelo": "X200",
  "cor": "Azul",
  "observacoes": "Atualizado",
  "status": "Vendido"
}
```
- Erros possíveis:
  - 404: Produto não encontrado
  - 400: Status inválido
  - 401: Não autenticado

---

### GET /api/produto/status
- Descrição: Retorna a lista de status possíveis para produtos.
- Request: sem corpo.
- Response 200 (JSON array): Exemplo:
```json
[
  { "id": 1, "nome": "Em estoque" },
  { "id": 2, "nome": "Vendido" }
]
```
- DTO: `StatusProdutoDTO` (id, nome)

---

### GET /api/produto?page=0&size=10
- Descrição: **✅ IMPLEMENTADO** - Retorna o estoque paginado com lista de produtos e metadados de paginação.
- Query params:
  - `page` (opcional, default 0) - Número da página (base zero)
  - `size` (opcional, default 10) - Quantidade de itens por página
- Response 200 (JSON):
```json
{
  "items": [
    {
      "id": null,
      "numeroSerie": "ABC123",
      "modelo": "X100",
      "produto": "Smartphone",
      "custo": null,
      "descricao": null,
      "fornecedorId": null,
      "dataEntrada": null,
      "observacoes": "Sem avarias",
      "status": "Em estoque",
      "cor": "Preto"
    }
  ],
  "metadata": {
    "totalItems": 42,
    "totalPages": 5,
    "currentPage": 0,
    "pageSize": 10
  }
}
```
- DTO: `EstoqueResponseDTO` (items: list of EstoqueItemDTO, metadata: PaginacaoMetadataDTO).
- Observações:
  - A consulta é otimizada usando `Page<Produto>` do Spring Data JPA.
  - Campos `id`, `custo`, `descricao`, `fornecedorId` e `dataEntrada` retornam `null` pois não existem na tabela `Produtos` atual.
  - O campo `produto` é mapeado do campo `aparelho` da entidade.

---

## Notas gerais e instruções

- Iniciar backend (a partir da pasta `Codigo/Back/vaztech`):

```powershell
# Windows PowerShell
./mvnw spring-boot:run
```

- Caso precise popular o banco, verifique os scripts Flyway em `src/main/resources/db/migration`.
- Alterar `application.properties` para configurar a conexão com o banco e porta, se necessário.
- Para testar endpoints localmente use ferramentas como `curl`, `Postman` ou `httpie`.

Exemplo com curl (login):

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"id":123,"senha":"minhaSenha"}'
```

---

Se quiser, eu posso:
- Exportar esse Markdown para PDF.
- Gerar exemplos prontos do Postman collection.
- Testar os endpoints com dados reais do banco.

## Exemplos de Teste

### Testar endpoint de estoque paginado (PowerShell):

```powershell
# Primeira página (10 itens - padrão)
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/produto" -Headers @{ Authorization = "Bearer SEU_TOKEN_AQUI" }

# Segunda página com 20 itens
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/produto?page=1&size=20" -Headers @{ Authorization = "Bearer SEU_TOKEN_AQUI" }

# Terceira página com 5 itens
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/produto?page=2&size=5" -Headers @{ Authorization = "Bearer SEU_TOKEN_AQUI" }
```

### Testar endpoint de estoque paginado (curl):

```bash
# Primeira página (10 itens - padrão)
curl -X GET "http://localhost:8080/api/produto" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"

# Segunda página com 20 itens
curl -X GET "http://localhost:8080/api/produto?page=1&size=20" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Testar endpoint de atualização de produto (PowerShell):

```powershell
# Atualizar produto (requer autenticação)
$body = @{
    aparelho = "Tablet"
    modelo = "Tab-500"
    cor = "Prata"
    observacoes = "Produto atualizado via API"
    status = 2
} | ConvertTo-Json

Invoke-RestMethod -Method Put -Uri "http://localhost:8080/api/produto/ABC123" `
    -Headers @{ Authorization = "Bearer SEU_TOKEN_AQUI"; "Content-Type" = "application/json" } `
    -Body $body
```

### Testar endpoint de atualização de produto (curl):

```bash
# Atualizar apenas alguns campos de um produto
curl -X PUT "http://localhost:8080/api/produto/ABC123" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "cor": "Vermelho",
    "observacoes": "Cor alterada",
    "status": 2
  }'
```

### Testar endpoint de atualização de produto (Insomnia/Postman):

1. **Método**: PUT
2. **URL**: `http://localhost:8080/api/produto/ABC123`
3. **Headers**:
   - `Authorization`: `Bearer SEU_TOKEN_JWT`
   - `Content-Type`: `application/json`
4. **Body** (JSON):
```json
{
  "aparelho": "Notebook",
  "modelo": "Note-2024",
  "cor": "Cinza",
  "observacoes": "Atualizado via Insomnia",
  "status": 1
}
```
5. **Resposta esperada** (200 OK):
```json
{
  "numeroSerie": "ABC123",
  "aparelho": "Notebook",
  "modelo": "Note-2024",
  "cor": "Cinza",
  "observacoes": "Atualizado via Insomnia",
  "status": "Em estoque"
}
```

