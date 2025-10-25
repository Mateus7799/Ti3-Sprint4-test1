package br.com.vaztech.vaztech.repository;

import br.com.vaztech.vaztech.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Import não é mais necessário

public interface ProdutoRepository extends JpaRepository<Produto, String> {

}