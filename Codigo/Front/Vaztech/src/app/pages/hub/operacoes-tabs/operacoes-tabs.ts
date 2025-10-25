import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-operacoes-tabs',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    InputOtpModule,
    FormsModule,
    MessageModule,
    ToastModule,
  ],
  templateUrl: './operacoes-tabs.html',
  styleUrl: './operacoes-tabs.css',
  providers: [MessageService],
})
export class OperacoesTabsComponent {
  modalCodigoAberto: boolean = false;

  abrirModalCodigo() {
    this.modalCodigoAberto = true;
  }

  escondeuModalCodigo(form: NgForm) {
    form.resetForm();
  }

  enviarCodigoForm(form: NgForm) {
    if (form.invalid) return;
    console.log(`Código: ${form.value.codigo}`);
    // TODO: Adicionar validação com o servidor sobre o código colocado
    this.modalCodigoAberto = false;
    form.resetForm();
  }
}
