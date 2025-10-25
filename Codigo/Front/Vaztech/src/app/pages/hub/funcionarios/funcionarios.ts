import { Component, inject } from '@angular/core';
import { FuncionariosService } from '../../../services/funcionarios.service';
import { FuncionarioResponse } from '../../../models/funcionario.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { CpfPipe } from '../../../pipes/cpf.pipe';

@Component({
  imports: [
    CpfPipe,
    CardModule,
    MessageModule,
    ButtonModule,
    DatePipe,
    AvatarModule,
    DialogModule,
    FormsModule,
    InputOtpModule,
    CheckboxModule,
  ],
  selector: 'app-funcionarios',
  styleUrl: './funcionarios.css',
  templateUrl: './funcionarios.html',
  standalone: true,
})
export class FuncionariosComponent {
  funcionariosService = inject(FuncionariosService);

  funcionarios: FuncionarioResponse[] = [];

  modalMudarCodigoAberto: boolean = false;
  mudandoCodigoID: number | undefined = undefined;

  ngOnInit() {
    this.buscarFuncionarios();
  }

  esconderMudarCodigoModal(form: NgForm) {
    this.mudandoCodigoID = undefined;
    form.resetForm();
  }

  abrirModalMudarCodigo(id: number) {
    this.mudandoCodigoID = id;
    this.modalMudarCodigoAberto = true;
  }

  enviarMudarCodigoForm(form: NgForm) {
    if (form.invalid) return;
    console.log(
      `Mudando código do funcionário id(${this.mudandoCodigoID}) para: ${form.value.codigo}`,
    );
    this.modalMudarCodigoAberto = false;
    this.mudandoCodigoID = undefined;
  }

  private buscarFuncionarios() {
    this.funcionariosService.buscarFuncionarios().subscribe({
      next: (funcionarios: FuncionarioResponse[]) => {
        this.funcionarios = [...funcionarios];
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
