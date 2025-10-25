import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { PessoaService } from '../../services/pessoa.service';
import { AuthService } from '../../services/auth.service';
import { PerfisAuth } from '../../models/auth.models';
import { PessoaAddRequest, PessoaUpdateRequest, PessoaResponse } from '../../models/pessoa.model';

@Component({
  selector: 'app-pessoa-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCardModule
  ],
  templateUrl: './pessoa-form.html',
  styleUrl: './pessoa-form.css'
})
export class PessoaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private pessoaService = inject(PessoaService);
  private authService = inject(AuthService);

  @Input() pessoaId?: number;
  @Input() origemPadrao: string = 'cliente';
  @Output() salvou = new EventEmitter<PessoaResponse>();
  @Output() cancelou = new EventEmitter<void>();

  pessoaForm: FormGroup;
  isEditMode = false;

  origemOptions = [
    { value: 'cliente', label: 'Cliente' },
    { value: 'fornecedor', label: 'Fornecedor' }
  ];

  constructor() {
    this.pessoaForm = this.fb.group({
      nome: ['', [Validators.required]],
      cpfCnpj: ['', [Validators.required]],
      dataNascimento: [''],
      origem: ['cliente', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.pessoaId) {
      this.carregarPessoa(this.pessoaId);
    } else {
      this.pessoaForm.patchValue({ origem: this.origemPadrao });
    }
  }

  get isAdmin(): boolean {
    return this.authService.perfil === PerfisAuth.ADMIN;
  }

  get isFuncionario(): boolean {
    return this.authService.perfil === PerfisAuth.FUNCIONARIO;
  }

  carregarPessoa(id: number): void {
    this.isEditMode = true;

    this.pessoaService.buscarPessoaPorId(id).subscribe({
      next: (pessoa) => {
        this.pessoaForm.patchValue({
          nome: pessoa.nome,
          cpfCnpj: pessoa.cpfCnpj,
          dataNascimento: pessoa.dataNascimento || '',
          origem: pessoa.origem
        });
      },
      error: (err) => {
        console.error('Erro ao carregar pessoa:', err);
      }
    });
  }

  onSalvar(): void {
    if (this.pessoaForm.invalid) {
      this.pessoaForm.markAllAsTouched();
      return;
    }

    const formValue = this.pessoaForm.value;

    let dataNascimento: string | undefined = undefined;
    if (formValue.dataNascimento) {
      dataNascimento = formValue.dataNascimento instanceof Date
        ? formValue.dataNascimento.toISOString().split('T')[0]
        : formValue.dataNascimento;
    }

    const pessoaData = {
      nome: formValue.nome,
      cpfCnpj: formValue.cpfCnpj,
      dataNascimento: dataNascimento,
      origem: formValue.origem
    };

    if (this.isEditMode && this.pessoaId) {
      console.log('PUT /pessoas/' + this.pessoaId, pessoaData);

      this.pessoaService.atualizarPessoa(this.pessoaId, pessoaData as PessoaUpdateRequest)
        .subscribe({
          next: (response) => {
            console.log('Pessoa atualizada com sucesso:', response);
            this.salvou.emit(response);
          },
          error: (err) => {
            console.error('Erro ao atualizar pessoa:', err);
          }
        });
    } else {
      console.log('POST /pessoas', pessoaData);

      this.pessoaService.criarPessoa(pessoaData as PessoaAddRequest)
        .subscribe({
          next: (response) => {
            console.log('Pessoa criada com sucesso:', response);
            this.salvou.emit(response);
          },
          error: (err) => {
            console.error('Erro ao criar pessoa:', err);
          }
        });
    }
  }

  onCancelar(): void {
    this.cancelou.emit();
  }

  resetarFormulario(): void {
    this.pessoaForm.reset({ origem: this.origemPadrao });
    this.isEditMode = false;
    this.pessoaId = undefined;
  }
}
