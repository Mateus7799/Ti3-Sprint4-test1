package br.com.vaztech.vaztech.controller;

import br.com.vaztech.vaztech.dto.*;
import br.com.vaztech.vaztech.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/produto")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criarProduto(@RequestBody ProdutoAddRequestDTO dto) throws ResponseStatusException {
        ProdutoResponseDTO response = produtoService.produtoAdd(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<ProdutoListResponseDTO> listarProdutos(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        ProdutoListResponseDTO response = produtoService.listarProdutosComPaginacao(pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<ProdutoBuscarResponseDTO>> buscarProdutos(@RequestParam String query) {
        return ResponseEntity.ok(produtoService.buscarProdutos(query));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizarProduto(@PathVariable Integer id, @Valid @RequestBody ProdutoUpdateRequestDTO dto) throws ResponseStatusException {
        ProdutoResponseDTO response = produtoService.produtoUpdate(dto.id(), dto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<List<ProdutoStatusDTO>> listarProdutoStatus() {
        List<ProdutoStatusDTO> response = produtoService.listarProdutoStatus();
        return ResponseEntity.ok(response);
    }
}
