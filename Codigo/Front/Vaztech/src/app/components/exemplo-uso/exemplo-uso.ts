import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FuncionarioModalTriggerComponent } from '../funcionario-modal/funcionario-modal';
import { PessoaFormComponent } from '../pessoa-form/pessoa-form';
import { AuthService } from '../../services/auth.service';
import { PerfisAuth } from '../../models/auth.models';

@Component({
  selector: 'app-exemplo-uso',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    FuncionarioModalTriggerComponent,
    PessoaFormComponent
  ],
  template: `
    <div class="exemplo-container">
      <h1>Exemplos de Uso dos Componentes</h1>

      <mat-card class="secao-card" *ngIf="isAdmin">
        <mat-card-header>
          <mat-card-title>Gerenciamento de Funcionários (Apenas Admin)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Use os botões abaixo para abrir o modal de funcionários:</p>
          <div class="botoes-exemplo">
            <button mat-raised-button color="primary" (click)="abrirModalNovoFuncionario()">
              Adicionar Novo Funcionário
            </button>
            <button mat-raised-button color="accent" (click)="abrirModalEditarFuncionario()">
              Editar Funcionário (ID: 1)
            </button>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="secao-card" *ngIf="!isAdmin">
        <mat-card-header>
          <mat-card-title>Acesso Restrito</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Você não tem permissão para gerenciar funcionários. Apenas administradores podem acessar esta funcionalidade.</p>
        </mat-card-content>
      </mat-card>

      <mat-card class="secao-card">
        <mat-card-header>
          <mat-card-title>Gerenciamento de Pessoas (Admin e Funcionário)</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>Selecione o tipo de formulário:</p>
          <div class="botoes-exemplo">
            <button mat-raised-button color="primary" (click)="mostrarFormCliente()">
              Adicionar Cliente
            </button>
            <button mat-raised-button color="primary" (click)="mostrarFormFornecedor()">
              Adicionar Fornecedor
            </button>
            <button mat-raised-button color="accent" (click)="mostrarFormEdicao()">
              Editar Pessoa (ID: 1)
            </button>
          </div>

          <div *ngIf="mostrarPessoaForm" class="form-container">
            <app-pessoa-form
              [pessoaId]="pessoaIdEdicao"
              [origemPadrao]="origemPadrao"
              (salvou)="onPessoaSalva($event)"
              (cancelou)="onPessoaCancelada()">
            </app-pessoa-form>
          </div>
        </mat-card-content>
      </mat-card>
    </div>

    <app-funcionario-modal-trigger></app-funcionario-modal-trigger>
  `,
  styles: [`
    .exemplo-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    h1 {
      color: #1f2937;
      margin-bottom: 2rem;
    }

    .secao-card {
      margin-bottom: 2rem;
    }

    .botoes-exemplo {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .form-container {
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      .exemplo-container {
        padding: 1rem;
      }

      .botoes-exemplo {
        flex-direction: column;
      }

      .botoes-exemplo button {
        width: 100%;
      }
    }
  `]
})
export class ExemploUsoComponent {
  @ViewChild(FuncionarioModalTriggerComponent) modalTrigger!: FuncionarioModalTriggerComponent;

  private authService = inject(AuthService);

  mostrarPessoaForm = false;
  pessoaIdEdicao?: number;
  origemPadrao: string = 'cliente';

  get isAdmin(): boolean {
    return this.authService.perfil === PerfisAuth.ADMIN;
  }

  abrirModalNovoFuncionario(): void {
    this.modalTrigger.abrirModalFuncionario();
  }

  abrirModalEditarFuncionario(): void {
    this.modalTrigger.abrirModalFuncionario(1);
  }

  mostrarFormCliente(): void {
    this.pessoaIdEdicao = undefined;
    this.origemPadrao = 'cliente';
    this.mostrarPessoaForm = true;
  }

  mostrarFormFornecedor(): void {
    this.pessoaIdEdicao = undefined;
    this.origemPadrao = 'fornecedor';
    this.mostrarPessoaForm = true;
  }

  mostrarFormEdicao(): void {
    this.pessoaIdEdicao = 1;
    this.origemPadrao = 'cliente';
    this.mostrarPessoaForm = true;
  }

  onPessoaSalva(pessoa: any): void {
    console.log('Pessoa salva no componente pai:', pessoa);
    this.mostrarPessoaForm = false;
  }

  onPessoaCancelada(): void {
    console.log('Edição de pessoa cancelada');
    this.mostrarPessoaForm = false;
  }
}
