package br.com.vaztech.vaztech.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "Funcionarios")
@Getter
@Setter
public class Funcionario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "cod_funcionario", nullable = false, length = 50)
    private String codFuncionario;

    @Column(name = "nome", nullable = false, length = 100)
    private String nome;

    @Column(name = "cpf_cnpj", nullable = false, unique = true, length = 20)
    private String cpfCnpj;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "status", nullable = false)
    private Integer status;
}