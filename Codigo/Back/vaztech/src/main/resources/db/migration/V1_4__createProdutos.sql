CREATE TABLE Produtos (
    numero_serie VARCHAR(50) PRIMARY KEY,
    aparelho VARCHAR(50) NOT NULL,
    modelo VARCHAR(100) NULL,
    cor VARCHAR(30) NULL,
    observacoes VARCHAR(MAX) NULL
);