package br.com.vaztech.vaztech.controller;

import br.com.vaztech.vaztech.dto.PessoaAddRequestDTO;
import br.com.vaztech.vaztech.dto.PessoaResponseDTO;
import br.com.vaztech.vaztech.dto.PessoaUpdateRequestDTO;
import br.com.vaztech.vaztech.service.PessoaService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pessoas")
@RequiredArgsConstructor
public class PessoaController {

    private final PessoaService pessoaService;

    @PostMapping
    public ResponseEntity<PessoaResponseDTO> criarPessoa(@Valid @RequestBody PessoaAddRequestDTO dto) {
        PessoaResponseDTO response = pessoaService.criarPessoa(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PessoaResponseDTO> atualizarPessoa(
            @PathVariable Integer id,
            @Valid @RequestBody PessoaUpdateRequestDTO dto) {
        PessoaResponseDTO response = pessoaService.atualizarPessoa(id, dto);
        return ResponseEntity.ok(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationExceptions(MethodArgumentNotValidException ex) {
        return ex.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(
                        FieldError::getField,
                        FieldError::getDefaultMessage
                ));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFoundException(EntityNotFoundException ex) {
        return Map.of("erro", ex.getMessage());
    }
}