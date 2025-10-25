package br.com.vaztech.vaztech.repository;

import br.com.vaztech.vaztech.entity.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer> {

    List<Funcionario> findAllByStatusOrderByNomeAsc(Integer status);
    boolean existsByCodFuncionario(String codFuncionario);
}