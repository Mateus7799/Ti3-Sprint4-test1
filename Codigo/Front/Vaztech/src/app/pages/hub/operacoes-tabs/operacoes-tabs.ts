import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputOtpModule } from 'primeng/inputotp';
import { FormsModule, NgForm } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { Operacao } from '../../../models/operacao.model';
import { TabsModule } from 'primeng/tabs';
import { FormularioOperacao } from './formulario-operacao/formulario-operacao';
import { OperacoesService } from '../../../services/operacoes.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-operacoes-tabs',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    DialogModule,
    InputOtpModule,
    FormsModule,
    MessageModule,
    DatePipe,
    CurrencyPipe,
    MessageModule,
    ToastModule,
    CardModule,
    AvatarModule,
    TabsModule,
    FormularioOperacao,
  ],
  templateUrl: './operacoes-tabs.html',
  styleUrl: './operacoes-tabs.css',
  providers: [MessageService],
})
export class OperacoesTabsComponent implements OnInit {
  operacoesService = inject(OperacoesService);
  toastService = inject(MessageService);

  modalCodigoAberto: boolean = false;
  operacoes: Operacao[] = [];
  abaAtual: number = 0;

  operacoesEdicao: Operacao[] = [];
  operacaoValidandoCodigo: Operacao | undefined = undefined;

  ngOnInit(): void {
    // this.buscarTodasOperacoes();
    this.operacoes = [
      {
        id: 1,
        produto: {
          id: 101,
          numeroSerie: 'SNX-2025-001',
          aparelho: 'Notebook',
          modelo: 'Dell Inspiron 15',
        },
        funcionario: {
          id: 11,
          nome: 'Lucas Almeida',
        },
        pessoa: {
          id: 201,
          nome: 'Fernanda Costa',
          cpfCnpj: '123.456.789-00',
        },
        valor: 3500.0,
        tipo: 0, // Exemplo: entrada
        observacoes: 'Entrada de equipamento novo em estoque.',
        dataHoraTransacao: new Date(),
      },
      {
        id: 2,
        dataHoraTransacao: new Date(),
        produto: {
          id: 102,
          numeroSerie: 'SNX-2025-002',
          aparelho: 'Smartphone',
          modelo: 'Samsung Galaxy S24',
        },
        funcionario: {
          id: 12,
          nome: 'Mariana Ribeiro',
        },
        pessoa: {
          id: 202,
          nome: 'Carlos Henrique',
          cpfCnpj: '987.654.321-00',
        },
        valor: 2800.0,
        tipo: 1, // Exemplo: saída
        observacoes: 'Venda realizada ao cliente final.',
      },
    ];
  }

  abrirModalCodigo(op: Operacao) {
    this.modalCodigoAberto = true;
    this.operacaoValidandoCodigo = op;
  }

  escondeuModalCodigo(form: NgForm) {
    form.resetForm();
  }

  enviarCodigoForm(form: NgForm) {
    if (form.invalid || !this.operacaoValidandoCodigo) return;
    console.log(`Código: ${form.value.codigo}`);
    // TODO: Adicionar validação com o servidor sobre o código colocado
    this.operacoesEdicao.push(structuredClone(this.operacaoValidandoCodigo));
    this.modalCodigoAberto = false;
    this.operacaoValidandoCodigo = undefined;
    form.resetForm();
  }

  buscarTodasOperacoes() {
    this.buscarOperacoesCompra();
    this.buscarOperacoesVenda();
  }

  buscarOperacoesCompra() {
    this.operacoesService.listarOperacoes('compras').subscribe({
      next: (response: any) => {
        this.operacoes = response.ultimasOperacoes;
      },
    });
  }

  buscarOperacoesVenda() {
    this.operacoesService.listarOperacoes('vendas').subscribe({
      next: (response: any) => {
        this.operacoes = response.ultimasOperacoes;
      },
    });
  }

  fecharAba(index: number, event: { reload: boolean; toast?: any }) {
    if (index >= 0) this.operacoesEdicao.splice(index, 1);
    if (event?.reload) {
      // this.buscarTodasOperacoes();
    }
    if (event?.toast) {
      this.toastService.add(event.toast);
    }
    this.abaAtual = 0;
  }
}
