CREATE TABLE Operacoes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    numero_serie_produto VARCHAR(50) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    id_cliente INT NOT NULL,
    id_funcionario INT NOT NULL,
    tipo INT NOT NULL,
    observacoes VARCHAR(MAX) NULL,

CONSTRAINT fk_Operacoes_Produtos FOREIGN KEY (numero_serie_produto)
   REFERENCES Produtos(numero_serie)
   ON UPDATE CASCADE
   ON DELETE NO ACTION,

CONSTRAINT fk_Operacoes_Pessoas FOREIGN KEY (id_cliente)
   REFERENCES Pessoas(id)
   ON UPDATE CASCADE
   ON DELETE NO ACTION,

CONSTRAINT fk_Operacoes_Funcionarios FOREIGN KEY (id_funcionario)
   REFERENCES Funcionarios(id)
   ON UPDATE CASCADE
   ON DELETE NO ACTION
);