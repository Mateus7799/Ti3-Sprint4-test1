package br.com.vaztech.vaztech.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "Produtos")
@Getter
@Setter
public class Produto {
    @Id
    @Column(name = "numero_serie", nullable = false)
    private String numeroSerie;

    @Column(name = "aparelho", nullable = false)
    private String aparelho;

    @Column(name = "modelo", nullable = true)
    private String modelo;

    @Column(name = "cor", nullable = true)
    private String cor;

    @Column(name = "observacoes", nullable = true)
    private String observacoes;

    @ManyToOne
    @JoinColumn(name = "id_status", referencedColumnName = "id", nullable = true)
    private StatusProduto status;
}
