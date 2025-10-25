import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FuncionariosService } from '../../services/funcionarios.service';
import { AuthService } from '../../services/auth.service';
import { PerfisAuth } from '../../models/auth.models';
import { FuncionarioAddRequest, FuncionarioUpdateRequest } from '../../models/funcionario.model';

@Component({
  selector: 'app-funcionario-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule
  ],
  templateUrl: './funcionario-modal.html',
  styleUrl: './funcionario-modal.css'
})
export class FuncionarioModalComponent {
  private fb = inject(FormBuilder);
  private funcionariosService = inject(FuncionariosService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<FuncionarioModalComponent>);

  funcionarioForm: FormGroup;
  isEditMode = false;
  funcionarioId?: number;

  statusOptions = [
    { value: 1, label: 'Ativo' },
    { value: 0, label: 'Inativo' }
  ];

  constructor() {
    this.funcionarioForm = this.fb.group({
      codFuncionario: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      cpfCnpj: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required]],
      status: [1, [Validators.required]]
    });
  }

  get isAdmin(): boolean {
    return this.authService.perfil === PerfisAuth.ADMIN;
  }

  carregarFuncionario(id: number): void {
    this.isEditMode = true;
    this.funcionarioId = id;

    this.funcionariosService.buscarFuncionarioPorId(id).subscribe({
      next: (funcionario) => {
        this.funcionarioForm.patchValue({
          codFuncionario: funcionario.codFuncionario,
          nome: funcionario.nome,
          cpfCnpj: funcionario.cpfCnpj,
          dataNascimento: funcionario.dataNascimento,
          status: funcionario.status
        });
      },
      error: (err) => {
        console.error('Erro ao carregar funcionário:', err);
      }
    });
  }

  onSalvar(): void {
    if (this.funcionarioForm.invalid) {
      this.funcionarioForm.markAllAsTouched();
      return;
    }

    const formValue = this.funcionarioForm.value;
    const dataNascimento = formValue.dataNascimento instanceof Date
      ? formValue.dataNascimento.toISOString().split('T')[0]
      : formValue.dataNascimento;

    const funcionarioData = {
      codFuncionario: formValue.codFuncionario,
      nome: formValue.nome,
      cpfCnpj: formValue.cpfCnpj,
      dataNascimento: dataNascimento,
      status: formValue.status
    };

    if (this.isEditMode && this.funcionarioId) {
      console.log('PUT /funcionarios/' + this.funcionarioId, funcionarioData);

      this.funcionariosService.atualizarFuncionario(this.funcionarioId, funcionarioData as FuncionarioUpdateRequest)
        .subscribe({
          next: (response) => {
            console.log('Funcionário atualizado com sucesso:', response);
            this.dialogRef.close(response);
          },
          error: (err) => {
            console.error('Erro ao atualizar funcionário:', err);
          }
        });
    } else {
      console.log('POST /funcionarios', funcionarioData);

      this.funcionariosService.criarFuncionario(funcionarioData as FuncionarioAddRequest)
        .subscribe({
          next: (response) => {
            console.log('Funcionário criado com sucesso:', response);
            this.dialogRef.close(response);
          },
          error: (err) => {
            console.error('Erro ao criar funcionário:', err);
          }
        });
    }
  }

  onCancelar(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'app-funcionario-modal-trigger',
  standalone: true,
  template: ''
})
export class FuncionarioModalTriggerComponent {
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  get isAdmin(): boolean {
    return this.authService.perfil === PerfisAuth.ADMIN;
  }

  abrirModalFuncionario(id?: number): void {
    if (!this.isAdmin) {
      console.warn('Apenas administradores podem gerenciar funcionários');
      return;
    }

    const dialogRef = this.dialog.open(FuncionarioModalComponent, {
      width: '600px',
      disableClose: false
    });

    if (id) {
      dialogRef.componentInstance.carregarFuncionario(id);
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Modal fechado com resultado:', result);
      }
    });
  }
}
