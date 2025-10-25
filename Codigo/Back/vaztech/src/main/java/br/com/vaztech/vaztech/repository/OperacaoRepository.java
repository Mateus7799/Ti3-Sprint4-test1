package br.com.vaztech.vaztech.repository;

import br.com.vaztech.vaztech.entity.Operacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OperacaoRepository extends JpaRepository<Operacao, Integer> {
}