package br.com.vaztech.vaztech.service;

import br.com.vaztech.vaztech.dto.*;
import br.com.vaztech.vaztech.entity.Operacao;
import br.com.vaztech.vaztech.entity.Funcionario;
import br.com.vaztech.vaztech.entity.Produto;
import br.com.vaztech.vaztech.entity.Pessoa;
import br.com.vaztech.vaztech.repository.FuncionarioRepository;
import br.com.vaztech.vaztech.repository.OperacaoRepository;
import br.com.vaztech.vaztech.repository.PessoaRepository;
import br.com.vaztech.vaztech.repository.ProdutoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OperacaoService {

    @Autowired
    FuncionarioRepository funcionarioRepository;

    @Autowired
    ProdutoRepository produtoRepository;

    @Autowired
    PessoaRepository pessoaRepository;

    @Autowired
    OperacaoRepository operacaoRepository;

    @Autowired
    ProdutoService produtoService;

    public OperacaoResponseDTO criarOperacao(OperacaoAddRequestDTO dto) throws ResponseStatusException {
        try {
            Produto produto = produtoRepository.findByNumeroSerie(dto.numeroSerieProduto())
                    .orElse(null);

            if (produto == null) {
                if (dto.produto() == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Produto não encontrado e dados do produto não foram enviados para criação automática.");
                }

                ProdutoResponseDTO novoProduto = produtoService.produtoAdd(dto.produto());

                produto = produtoRepository.findByNumeroSerie(dto.produto().numeroSerie())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar o produto automaticamente."));
            }

            Pessoa pessoa = pessoaRepository.findById(dto.idPessoa())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente ou fornecedor não encontrado com ID: " + dto.idPessoa()));

            Funcionario funcionario = funcionarioRepository.findById(dto.idFuncionario())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Funcionário não encontrado com ID: " + dto.idFuncionario()));

            Operacao operacao = new Operacao();
            operacao.setProduto(produto);
            operacao.setPessoa(pessoa);
            operacao.setFuncionario(funcionario);
            operacao.setValor(dto.valor());
            operacao.setTipo(dto.tipo());
            operacao.setObservacoes(dto.observacoes());
            operacao.setDataHoraTransacao(LocalDateTime.now());

            Operacao salva = operacaoRepository.save(operacao);

            return new OperacaoResponseDTO(salva);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao criar operação: " + e.getMessage(), e);
        }
    }

    public OperacaoResponseDTO atualizarOperacao(Integer id, OperacaoUpdateRequestDTO dto) throws ResponseStatusException {
        try {
            Operacao operacao = operacaoRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Operação não encontrada com ID: " + id));

            if (dto.valor() != null) {
                operacao.setValor(dto.valor());
            }

            if (dto.tipo() != null) {
                operacao.setTipo(dto.tipo());
            }

            if (dto.observacoes() != null) {
                operacao.setObservacoes(dto.observacoes());
            }

            Operacao atualizada = operacaoRepository.save(operacao);
            return new OperacaoResponseDTO(atualizada);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Erro ao atualizar operação: " + e.getMessage(), e);
        }
    }

    public ValidarFuncionarioResponseDTO validarFuncionarioParaEdicao(ValidarFuncionarioRequestDTO request) {
        String codigoFuncionario = request.codigoFuncionario();

        // Validar se o código foi fornecido
        if (codigoFuncionario == null || codigoFuncionario.trim().isEmpty()) {
            return new ValidarFuncionarioResponseDTO(
                false,
                "Código de funcionário não pode estar vazio",
                codigoFuncionario
            );
        }
        
        // Buscar funcionário ativo
        Optional<Funcionario> funcionario = funcionarioRepository.findByCodFuncionarioAndAtivo(codigoFuncionario.trim());
        
        if (funcionario.isEmpty()) {
            // Buscar sem verificar status para determinar o motivo
            Optional<Funcionario> funcionarioInativo = funcionarioRepository.findByCodFuncionario(codigoFuncionario.trim());
            
            if (funcionarioInativo.isEmpty()) {
                return new ValidarFuncionarioResponseDTO(
                    false,
                    "Funcionário não encontrado no sistema",
                    codigoFuncionario
                );
            } else {
                return new ValidarFuncionarioResponseDTO(
                    false,
                    "Funcionário inativo. Não tem permissão para autorizar edições",
                    codigoFuncionario
                );
            }
        }
        
        // Funcionário válido e ativo
        Funcionario func = funcionario.get();

        return new ValidarFuncionarioResponseDTO(
            true,
            "Funcionário autorizado para editar operações",
            codigoFuncionario
        );
    }
}
