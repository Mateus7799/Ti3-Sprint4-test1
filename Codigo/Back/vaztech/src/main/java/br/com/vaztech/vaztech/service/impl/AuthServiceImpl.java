package br.com.vaztech.vaztech.service.impl;
import java.lang.String;
import java.lang.Integer;
import br.com.vaztech.vaztech.dto.LoginRequestDTO;
import br.com.vaztech.vaztech.dto.RegisterRequestDTO;
import br.com.vaztech.vaztech.dto.AuthResponseDTO;
import br.com.vaztech.vaztech.entity.Usuario;
import br.com.vaztech.vaztech.infra.security.TokenService;
import br.com.vaztech.vaztech.repository.UsuarioRepository;
import br.com.vaztech.vaztech.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Override
    public AuthResponseDTO login(LoginRequestDTO dto) throws RuntimeException {
        try {
            Usuario usuario = repository.findById(dto.id())
                    .orElseThrow(() -> new Exception("Usuário não encontrado."));

            if (!passwordEncoder.matches(dto.senha(), usuario.getSenha())) {
                throw new Exception("Senha incorreta.");
            }

            String token = tokenService.generateToken(usuario);
            return new AuthResponseDTO(token, usuario.getId());


        } catch(Exception e) {
            throw new RuntimeException("Erro no login: " + e.getMessage());
        }
    }

    @Override
    public AuthResponseDTO register(RegisterRequestDTO dto) throws RuntimeException {
        try {
            Usuario newUser = new Usuario();
            newUser.setSenha(passwordEncoder.encode(dto.senha()));

            repository.save(newUser);

            String token = tokenService.generateToken(newUser);

            return new AuthResponseDTO(token, newUser.getId());
        } catch(Exception e) {
            throw new RuntimeException("Erro no registro: " + e.getMessage());
        }
    }
}
