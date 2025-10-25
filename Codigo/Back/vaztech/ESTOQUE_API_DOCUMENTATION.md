# API Endpoint - Listagem de Estoque com Paginação

## Visão Geral
Este endpoint foi criado para fornecer uma listagem paginada dos itens do estoque da assistência técnica Vaztech.

## Endpoint

```
GET /api/estoque
```

## Parâmetros de Query (Opcionais)

- `page` (int, padrão: 0) - Número da página (baseado em zero)
- `size` (int, padrão: 10) - Tamanho da página (número de itens por página)

## Exemplos de Uso

### Exemplo 1: Primeira página com tamanho padrão
```
GET /api/estoque
```
Retorna a primeira página com 10 itens.

### Exemplo 2: Página específica com tamanho customizado
```
GET /api/estoque?page=2&size=20
```
Retorna a página 2 com 20 itens por página.

### Exemplo 3: Apenas alterando o tamanho da página
```
GET /api/estoque?size=5
```
Retorna a primeira página com 5 itens.

## Resposta

### Estrutura JSON de Resposta

```json
{
  "items": [
    {
      "id": 1,
      "numeroSerie": "SN12345678",
      "modelo": "Galaxy S21",
      "produto": "Smartphone Samsung",
      "custo": 150000,
      "descricao": "Smartphone com tela trincada",
      "fornecedorId": 1,
      "dataEntrada": "2024-09-15",
      "observacoes": "Cliente reportou queda",
      "status": "Em reparo",
      "cor": "Azul"
    }
  ],
  "metadata": {
    "totalItems": 150,
    "totalPages": 15,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### Campos do Item de Estoque

- `id` (Integer) - Identificador único do item
- `numeroSerie` (String) - Número de série do produto
- `modelo` (String) - Modelo do produto
- `produto` (String) - Nome/tipo do produto
- `custo` (Integer) - Custo em centavos (ex: 150000 = R$ 1.500,00)
- `descricao` (String, opcional) - Descrição do item
- `fornecedorId` (Integer, opcional) - ID do fornecedor (FK para tabela pessoa)
- `dataEntrada` (LocalDate) - Data de entrada no estoque
- `observacoes` (String, opcional) - Observações sobre o item
- `status` (String, opcional) - Status atual do item
- `cor` (String, opcional) - Cor do produto

### Metadados da Paginação

- `totalItems` (Long) - Total de itens no estoque
- `totalPages` (Integer) - Total de páginas disponíveis
- `currentPage` (Integer) - Página atual (baseado em zero)
- `pageSize` (Integer) - Tamanho da página solicitada

## Códigos de Status HTTP

- `200 OK` - Sucesso na consulta
- `400 Bad Request` - Parâmetros inválidos
- `500 Internal Server Error` - Erro interno do servidor

## Considerações Técnicas

### Otimização para Grandes Volumes
- A consulta utiliza paginação nativa do Spring Data JPA
- Os resultados são ordenados por data de entrada (mais recentes primeiro) e ID
- A consulta é otimizada com índices apropriados no banco de dados

### Validação de Parâmetros
- O parâmetro `page` deve ser >= 0
- O parâmetro `size` deve ser > 0 e <= 100 (limite de segurança)
- Valores inválidos usam os padrões (page=0, size=10)

### Segurança
- Endpoint configurado como público (não requer autenticação)
- Configurado no `SecurityConfig.java` para permitir acesso via GET

## Implementação

### Arquivos Criados/Modificados

1. **ProdutoController.java** - Controller com endpoint `/api/estoque`
2. **EstoqueResponseDTO.java** - DTOs para resposta estruturada
3. **ProdutoRepository.java** - Query otimizada com paginação
4. **ProdutoService.java** - Interface com método de listagem
5. **ProdutoServiceImpl.java** - Implementação da lógica de negócio
6. **SecurityConfig.java** - Configuração de segurança atualizada

### Tecnologias Utilizadas

- Spring Boot 3.5.5
- Spring Data JPA (Paginação)
- SQL Server (Azure Database)
- Lombok (redução de boilerplate)
- Jakarta Persistence API
- Spring Security (configuração de acesso público)

## Testando o Endpoint

Para testar o endpoint, você pode usar ferramentas como:

### 1. Navegador Web
```
http://localhost:8080/api/estoque
http://localhost:8080/api/estoque?page=0&size=5
http://localhost:8080/api/estoque?page=1&size=20
```

### 2. PowerShell (Invoke-RestMethod)
```powershell
# Teste básico
Invoke-RestMethod -Uri "http://localhost:8080/api/estoque" -Method GET

# Com paginação
Invoke-RestMethod -Uri "http://localhost:8080/api/estoque?page=1&size=5" -Method GET
```

### 3. Postman/Insomnia
- **Método**: GET
- **URL**: `http://localhost:8080/api/estoque`
- **Headers**: `Content-Type: application/json`
- **Parâmetros Query**: `page=0&size=10`

### 4. cURL
```bash
# Teste básico
curl -X GET "http://localhost:8080/api/estoque"

# Com paginação
curl -X GET "http://localhost:8080/api/estoque?page=1&size=5"
```

## Estrutura do Banco de Dados

### Tabela: dbo.Estoque
```sql
CREATE TABLE [dbo].[Estoque] (
    [id] int IDENTITY(1,1) PRIMARY KEY,
    [numero_de_serie] varchar(100) NOT NULL,
    [modelo] varchar(100) NOT NULL,
    [produto] varchar(100) NOT NULL,
    [custo] decimal(10,2) NOT NULL,
    [descricao] varchar(255) NULL,
    [fornecedor_id] int NULL,
    [data_entrada] datetime2(7) NOT NULL,
    [observacoes] varchar(255) NULL,
    [status] varchar(50) NULL,
    [cor] varchar(25) NULL
)
```

## Exemplos de Resposta

### Resposta com Dados
```json
{
  "items": [
    {
      "id": 1,
      "numeroSerie": "SN001234567890",
      "modelo": "Galaxy S21",
      "produto": "Smartphone Samsung",
      "custo": 120050,
      "descricao": "Tela trincada, touch funcionando",
      "fornecedorId": 1,
      "dataEntrada": "2024-09-20",
      "observacoes": "Cliente relatou queda no chão",
      "status": "Em reparo",
      "cor": "Preto"
    },
    {
      "id": 2,
      "numeroSerie": "SN002345678901",
      "modelo": "iPhone 13",
      "produto": "Smartphone Apple",
      "custo": 250000,
      "descricao": "Bateria viciada, não carrega",
      "fornecedorId": 2,
      "dataEntrada": "2024-09-21",
      "observacoes": "Garantia expirada, cobrar cliente",
      "status": "Aguardando peça",
      "cor": "Azul"
    }
  ],
  "metadata": {
    "totalItems": 15,
    "totalPages": 2,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

### Resposta Vazia
```json
{
  "items": [],
  "metadata": {
    "totalItems": 0,
    "totalPages": 0,
    "currentPage": 0,
    "pageSize": 10
  }
}
```

## Critérios de Aceitação Atendidos

✅ **Endpoint criado**: `GET /api/estoque`  
✅ **Paginação implementada**: Parâmetros `page` e `size`  
✅ **Campos retornados**: Todos os campos solicitados  
✅ **Metadados incluídos**: `totalItems`, `totalPages`, `currentPage`, `pageSize`  
✅ **Consulta otimizada**: Paginação nativa do Spring Data JPA  
✅ **Teste sem parâmetros**: Retorna primeira página com 10 itens  
✅ **Teste com parâmetros**: `?page=2&size=20` funciona corretamente  
✅ **Sempre retorna metadados**: Estrutura consistente da resposta  

## Próximos Passos (Opcional)

1. Implementar filtros de busca (por status, modelo, fornecedor, etc.)
2. Adicionar ordenação customizável por diferentes campos
3. Implementar cache Redis para melhorar performance
4. Adicionar métricas de monitoramento e logs
5. Criar endpoint para busca por texto livre
6. Implementar validação mais robusta de parâmetros
7. Adicionar documentação OpenAPI/Swagger