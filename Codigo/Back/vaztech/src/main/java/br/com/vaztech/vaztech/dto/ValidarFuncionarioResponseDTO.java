package br.com.vaztech.vaztech.dto;

public class ValidarFuncionarioResponseDTO {
    private boolean autorizado;
    private String mensagem;
    private String codigoFuncionario;

    public ValidarFuncionarioResponseDTO() {}

    public ValidarFuncionarioResponseDTO(boolean autorizado, String mensagem, String codigoFuncionario) {
        this.autorizado = autorizado;
        this.mensagem = mensagem;
        this.codigoFuncionario = codigoFuncionario;
    }

    public boolean isAutorizado() {
        return autorizado;
    }

    public void setAutorizado(boolean autorizado) {
        this.autorizado = autorizado;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String getCodigoFuncionario() {
        return codigoFuncionario;
    }

    public void setCodigoFuncionario(String codigoFuncionario) {
        this.codigoFuncionario = codigoFuncionario;
    }
}
