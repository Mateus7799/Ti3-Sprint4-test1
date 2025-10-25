package br.com.vaztech.vaztech.repository;

import br.com.vaztech.vaztech.entity.Pessoa;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PessoaRepository extends JpaRepository<Pessoa, Integer> {
}