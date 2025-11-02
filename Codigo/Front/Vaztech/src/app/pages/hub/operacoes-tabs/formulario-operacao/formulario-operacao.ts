import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { ToastModule } from 'primeng/toast';
import { InputNumberModule } from 'primeng/inputnumber';
import { IftaLabelModule } from 'primeng/iftalabel';
import {
  AdicionarOperacaoDTO,
  EditarOperacaoDTO,
  FuncionarioOperacao,
  Operacao,
  PessoaOperacao,
  ProdutoOperacao,
} from '../../../../models/operacao.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { OperacoesService } from '../../../../services/operacoes.service';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { Produto } from '../../../../models/produto.model';
import { FloatLabel } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';

type TipoOperacaoOpcao = {
  label: string;
  value: 0 | 1;
};

@Component({
  selector: 'app-formulario-operacao',
  templateUrl: './formulario-operacao.html',
  styleUrl: './formulario-operacao.css',
  imports: [
    FormsModule,
    FieldsetModule,
    ToastModule,
    FloatLabel,
    MessageModule,
    InputNumberModule,
    IftaLabelModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    AutoCompleteModule,
    ButtonModule,
    InputTextModule,
    ToggleButtonModule,
    TextareaModule,
    ScrollPanelModule,
  ],
  standalone: true,
  providers: [MessageService],
})
export class FormularioOperacao implements OnInit {
  operacoesService = inject(OperacoesService);
  toastService = inject(MessageService);

  @Input() operacaoEdicao?: Operacao;
  @Output() fecharAba = new EventEmitter();

  readonly opcoesTipoOperacao: TipoOperacaoOpcao[] = [
    {
      label: 'Venda',
      value: 0,
    },
    {
      label: 'Compra',
      value: 1,
    },
  ];

  tipoOperacaoSelecionado: 0 | 1 | undefined = undefined;
  funcionariosDisponiveis: FuncionarioOperacao[] = [];
  produtosDisponiveis: ProdutoOperacao[] = [];
  pessoasDisponiveis: PessoaOperacao[] = [];

  cadastrarNovoProduto: boolean = false;

  ngOnInit() {
    this.tipoOperacaoSelecionado = this.operacaoEdicao?.tipo ?? this.tipoOperacaoSelecionado;
  }

  enviarFormulario(form: NgForm) {
    if (form.invalid) {
      this.toastService.add({
        severity: 'error',
        detail: 'Não foi possível adicionar',
        summary: 'Formulário inválido!',
      });
      return;
    }
    let toastObj;
    // adicionando uma nova operação
    if (!this.operacaoEdicao) {
      let novaOperacao: AdicionarOperacaoDTO = {
        valor: form.value.valor,
        idPessoa: form.value.pessoa.id,
        idFuncionario: form.value.funcionario.id,
        observacoes: form.value.observacoes,
        tipo: form.value.tipo,
        numeroSerieProduto: this.cadastrarNovoProduto ? null : form.value.produto.numeroSerie,
      };
      if (this.cadastrarNovoProduto) {
        const novoProduto: Produto = {
          numeroSerie: form.value.numeroSerieProduto,
          cor: form.value.corProduto,
          aparelho: form.value.aparelhoProduto,
          modelo: form.value.modeloProduto,
          observacoes: form.value.observacoesProduto,
          status: 1,
        };
        novaOperacao = { ...novaOperacao, produto: novoProduto };
      }
      console.log(novaOperacao);
      this.operacoesService.adicionarOperacao(novaOperacao).subscribe({
        next: () => {
          toastObj = {
            severity: 'success',
            summary: 'Operação registrada!',
            detail: `A ${this.tipoOperacaoSelecionado === 0 ? 'venda' : 'compra'} foi registrada com sucesso.`,
          };
          this.fecharAba.emit({ reload: true, toast: toastObj });
        },
        error: (err: any) => {
          console.error(err);
          this.toastService.add({
            severity: 'error',
            summary: 'Ocorreu um erro',
            detail: err.error.message,
          });
        },
        complete: () => {
          form.resetForm();
        },
      });
      return;
    }
    const operacaoEditada: EditarOperacaoDTO = {
      valor: form.value.valor,
      tipo: form.value.tipo,
      observacoes: form.value.observacoes,
    };
    console.log(operacaoEditada);
    this.operacoesService.editarOperacao(operacaoEditada, this.operacaoEdicao.id).subscribe({
      next: () => {
        toastObj = {
          severity: 'success',
          summary: 'Operação editada!',
          detail: `A ${this.tipoOperacaoSelecionado === 0 ? 'venda' : 'compra'} foi alterada com sucesso.`,
        };
        this.fecharAba.emit({ reload: true, toast: toastObj });
      },
      error: (err: any) => {
        console.error(err);
        this.toastService.add({
          severity: 'error',
          summary: 'Ocorreu um erro',
          detail: err.error.message,
        });
      },
      complete: () => {
        this.operacaoEdicao = undefined;
        form.resetForm();
      },
    });
  }

  queryFuncionarios(busca: AutoCompleteCompleteEvent) {
    this.operacoesService.funcionariosQuery(busca.query).subscribe({
      next: (funcionarios: FuncionarioOperacao[]) => {
        this.funcionariosDisponiveis = [...funcionarios];
      },
    });
  }

  queryPessoas(busca: AutoCompleteCompleteEvent) {
    this.operacoesService.pessoasQuery(busca.query).subscribe({
      next: (pessoas: PessoaOperacao[]) => {
        this.pessoasDisponiveis = [...pessoas];
      },
    });
  }

  queryProdutos(busca: AutoCompleteCompleteEvent) {
    this.operacoesService.produtosQuery(busca.query).subscribe({
      next: (produtos: ProdutoOperacao[]) => {
        this.produtosDisponiveis = [...produtos];
      },
    });
  }

  // verificarProdutoExiste(input: any) {
  //   if (!input.value || input.value.length <= 0 || typeof input.value === 'object') {
  //     this.naoEncontreiProdutos = false;
  //   } else if (typeof input.value === 'string' && input.value.length > 0) {
  //     this.naoEncontreiProdutos = true;
  //   }
  // }

  getLabelForProduto(item: ProdutoOperacao) {
    return `${item.numeroSerie}: ${item.modelo}`;
  }
}
