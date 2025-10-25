package br.com.vaztech.vaztech.service;

import br.com.vaztech.vaztech.dto.LoginRequestDTO;
import br.com.vaztech.vaztech.dto.RegisterRequestDTO;
import br.com.vaztech.vaztech.dto.AuthResponseDTO;

public interface AuthService {
    public AuthResponseDTO login(LoginRequestDTO dto) throws Exception;

    public AuthResponseDTO register(RegisterRequestDTO dto) throws Exception;
}
