package br.com.vaztech.vaztech.controller;

import br.com.vaztech.vaztech.dto.LoginRequestDTO;
import br.com.vaztech.vaztech.dto.RegisterRequestDTO;
import br.com.vaztech.vaztech.dto.AuthResponseDTO;
import br.com.vaztech.vaztech.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth") // Add prefixo /api
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequestDTO dto) throws Exception {
        final AuthResponseDTO login = authService.login(dto);
        return ResponseEntity.ok(login);
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequestDTO dto) throws  Exception {
        final AuthResponseDTO registro = authService.register(dto);
        return ResponseEntity.ok(registro);
    }
}