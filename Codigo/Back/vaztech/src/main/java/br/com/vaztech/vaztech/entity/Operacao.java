package br.com.vaztech.vaztech.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "Operacoes")
@Getter
@Setter
public class Operacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "numero_serie_produto", referencedColumnName = "numero_serie", nullable = false)
    private Produto produto;

    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @ManyToOne
    @JoinColumn(name = "id_cliente", referencedColumnName = "id", nullable = false)
    private Pessoa cliente;

    @ManyToOne
    @JoinColumn(name = "id_funcionario", referencedColumnName = "id", nullable = false)
    private Funcionario funcionario;

    @Column(name = "tipo", nullable = false)
    private Integer tipo;

    @Column(name = "observacoes")
    private String observacoes;
}