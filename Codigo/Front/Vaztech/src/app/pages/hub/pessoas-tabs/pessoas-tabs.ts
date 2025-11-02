import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FormsModule, NgForm } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputMaskModule } from 'primeng/inputmask';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { CpfCnpjMaskDirective } from '../../../directives/cpf-cnpj-mask.directive';
import { PessoaService } from '../../../services/pessoa.service';
import {
  AlterarPessoaBody,
  CadastrarPessoaBody,
  PessoaResponse,
  PessoasReqDTO,
} from '../../../models/pessoa.model';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DatePickerModule } from 'primeng/datepicker';
import { CpfCnpjMaskPipe } from '../../../pipes/cpf-cnpj-mask.pipe';

@Component({
  selector: 'app-pessoas-tabs',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    PaginatorModule,
    ToolbarModule,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    InputMaskModule,
    TextareaModule,
    SelectModule,
    CpfCnpjMaskDirective,
    CpfCnpjMaskPipe,
    AvatarModule,
    ScrollPanelModule,
    DatePickerModule,
  ],
  templateUrl: './pessoas-tabs.html',
  providers: [MessageService],
})
export class PessoasTabsComponent {
  pessoaService = inject(PessoaService);
  toastService = inject(MessageService);

  pessoas: PessoaResponse[] = [];

  modalFormularioAberto: boolean = false;
  editandoPessoa: PessoaResponse | undefined;

  paginaAtual: number = 0;
  itensPorPagina: number = 4;
  totalRegistros: number = 0;

  searchText: string = '';

  funcaoOpcoes = [
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Fornecedor', value: 'Fornecedor' },
  ];

  ngOnInit() {
    this.buscarPessoas();
    // this.pessoas = [
    //   {
    //     id: 1,
    //     nome: 'Ana Souza',
    //     cpfCnpj: '12345678900',
    //     dataNascimento: new Date('1990-03-15'),
    //     origem: 'Cadastro Web',
    //   },
    //   {
    //     id: 2,
    //     nome: 'Carlos Augusto Pereira',
    //     cpfCnpj: '98765432100',
    //     dataNascimento: new Date('1985-11-22'),
    //     origem: 'Importação',
    //   },
    //   {
    //     id: 3,
    //     nome: 'Fernanda Lara Talala Lima',
    //     cpfCnpj: '45678912000110',
    //     dataNascimento: null,
    //     origem: null,
    //   },
    //   {
    //     id: 4,
    //     nome: 'João Oliveira dos Santos',
    //     cpfCnpj: '32165498700',
    //     dataNascimento: new Date('2000-06-05'),
    //     origem: 'API Externa',
    //   },
    //   {
    //     id: 5,
    //     nome: 'Mariana Belisario Alves',
    //     cpfCnpj: '12345678000190',
    //     dataNascimento: new Date('1993-09-30'),
    //     origem: 'Sistema Interno',
    //   },
    // ];
  }

  buscarPessoas(pagina?: number) {
    this.paginaAtual = pagina ?? this.paginaAtual;
    this.pessoaService.buscarPessoas(this.paginaAtual, this.itensPorPagina).subscribe({
      next: (pessoas: PessoasReqDTO) => {
        this.pessoas = [...pessoas.content];
        this.totalRegistros = pessoas.totalElements;
      },
      error: (err) => {
        console.error(err);
        this.toastService.add({
          summary: 'Erro ao carregar!',
          detail: 'Não foi possível carregar as pessoas.',
          severity: 'error',
        });
      },
    });
  }

  onPageChange(event: PaginatorState) {
    this.paginaAtual = event.page || 0;
    this.itensPorPagina = event.rows || 4;
    this.buscarPessoas(this.paginaAtual);
  }

  abrirModalCadastrar() {
    this.editandoPessoa = undefined;
    this.modalFormularioAberto = true;
  }

  abrirModalEditar(pessoa: PessoaResponse) {
    this.editandoPessoa = pessoa;
    this.modalFormularioAberto = true;
  }

  esconderFormularioModal(form: NgForm) {
    this.editandoPessoa = undefined;
    form.resetForm();
  }

  enviarFormulario(form: NgForm) {
    if (form.invalid) return;

    if (!this.editandoPessoa) {
      const cpfCnpjLimpo = form.value.cpfCnpj.replace(/\D/g, '');
      const novaPessoa: CadastrarPessoaBody = {
        nome: form.value.nome,
        cpfCnpj: cpfCnpjLimpo,
        dataNascimento: form.value.dataNascimento || null,
        origem: null,
      };

      this.pessoaService.cadastrarPessoa(novaPessoa).subscribe({
        next: () => {
          this.toastService.add({
            summary: 'Cadastrado!',
            detail: 'A pessoa foi cadastrada com sucesso',
            severity: 'success',
          });
          this.buscarPessoas();
        },
        error: (err) => {
          console.error(err);
          this.toastService.add({
            summary: 'Erro!',
            detail: err.error?.erro || 'Erro ao cadastrar pessoa',
            severity: 'error',
          });
        },
      });
    } else {
      const cpfCnpjLimpo = form.value.cpfCnpj.replace(/\D/g, '');
      const pessoaAtualizada: AlterarPessoaBody = {
        id: this.editandoPessoa.id,
        nome: form.value.nome,
        cpfCnpj: cpfCnpjLimpo,
        dataNascimento: form.value.dataNascimento || null,
        origem: null,
      };

      this.pessoaService.editarPessoa(pessoaAtualizada).subscribe({
        next: () => {
          this.toastService.add({
            summary: 'Editado!',
            detail: 'A pessoa foi editada com sucesso',
            severity: 'success',
          });
          this.buscarPessoas();
        },
        error: (err) => {
          console.error(err);
          this.toastService.add({
            summary: 'Erro!',
            detail: err.error?.erro || 'Erro ao editar pessoa',
            severity: 'error',
          });
        },
      });
    }

    this.modalFormularioAberto = false;
    this.editandoPessoa = undefined;
    form.resetForm();
  }
}
