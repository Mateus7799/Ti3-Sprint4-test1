package br.com.vaztech.vaztech.controller;

import br.com.vaztech.vaztech.dto.*;
import br.com.vaztech.vaztech.service.OperacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/operacao")
public class OperacaoController {

    @Autowired
    private OperacaoService operacaoService;

    @PostMapping
    public ResponseEntity<OperacaoResponseDTO> criarOperacao(@RequestBody OperacaoAddRequestDTO dto) throws ResponseStatusException {
        OperacaoResponseDTO response = operacaoService.criarOperacao(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OperacaoResponseDTO> atualizarOperacao(@PathVariable Integer id, @Valid @RequestBody OperacaoUpdateRequestDTO dto) throws ResponseStatusException {
        OperacaoResponseDTO response = operacaoService.atualizarOperacao(id, dto);
        return ResponseEntity.ok(response);
    }

    //Request - id da operação e código do funcionário
    //Lógica - verificar se o código do funcionário é o mesmo da operação
    //Response - 204(sim) ou 403(não)
    @PostMapping("/validar-funcionario")
    public ResponseEntity<ValidarFuncionarioResponseDTO> validarFuncionario(@Valid @RequestBody ValidarFuncionarioRequestDTO request) {
        ValidarFuncionarioResponseDTO response = operacaoService.validarFuncionarioParaEdicao(request);

        if (response.isAutorizado()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
