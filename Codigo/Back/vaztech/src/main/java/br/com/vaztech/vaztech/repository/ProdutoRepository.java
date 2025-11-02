package br.com.vaztech.vaztech.repository;

import br.com.vaztech.vaztech.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;
import java.util.List;

public interface ProdutoRepository extends JpaRepository<Produto, String> {
    Optional<Produto> findById(Integer id);
    Optional<Produto> findByNumeroSerie(String numeroSerie);
    boolean existsByNumeroSerie(String numeroSerieProduto);

    @Query("SELECT p FROM Produto p " +
           "WHERE LOWER(p.aparelho) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.modelo) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.numeroSerie) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Produto> findTop50ByAparelhoOrModeloOrNumeroSerieLike(@Param("query") String query);
}
