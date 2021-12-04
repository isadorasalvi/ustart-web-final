import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppRoutes } from 'src/app/app-routes';
import { ClienteService } from 'src/app/data-services/cliente.service';
import { FormaPagamentoService } from 'src/app/data-services/forma-pagamento.service';
import { PedidoService } from 'src/app/data-services/pedido.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { Cliente } from 'src/app/models/clientes/cliente';
import { FormaPagamento } from 'src/app/models/forma-pagamento/forma-pagamento';
import { Pedido } from 'src/app/models/pedido/pedido';

import { getISOWeek } from 'date-fns';
import { pt_BR, NzI18nService } from 'ng-zorro-antd/i18n';
import { PedidosItens } from 'src/app/models/pedido/pedido-item';
import { ModalItemPedidoComponent } from '../componentes/modal-item-pedido/modal-item-pedido.component';

@Component({
  selector: 'app-cad-pedido',
  templateUrl: './cad-pedido.component.html',
  styleUrls: ['./cad-pedido.component.scss']
})
export class CadPedidoComponent implements OnInit {

  private idSelecionado: string;
  public novoRegistro: boolean = false;
  public pedido: Pedido;

  public clientes: Cliente[] = [];
  public carregandoClientes: boolean = false;
  public clienteSel: string;

  public formasPagamentos: FormaPagamento[] = [];
  public carregandoFormasPgto: boolean = false;
  public formaPagamentoSel: string;

  //Somente para atualizar o grid de produtos
  public pedidosItens: PedidosItens[] = [];


  public form: FormGroup = new FormGroup({
    dataPedido: new FormControl(new Date(),),
    clienteId: new FormControl(null, [Validators.required]),
    usuarioId: new FormControl(null),
    formaPagamentoId: new FormControl(1, [Validators.required]),
    observacao: new FormControl(null),
    quantidadeDeItens: new FormControl(null),
    totalItens: new FormControl(null),
    totalDesconto: new FormControl(null),
    totalProdutos: new FormControl(null),
  });

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private pedidoService: PedidoService,
    private clienteService: ClienteService,
    private formaPgtService: FormaPagamentoService,
    private i18n: NzI18nService
  ) {
    //this.i18n.setLocale(pt_BR);
    this.activatedRoute.params.subscribe(
      (params) => {

        //Carrega o id passado por parametro na URL
        this.idSelecionado = params.id;

        //Caso o parametro seja o valor "novo" então devemos gerar um novo registro
        if (this.idSelecionado == null || this.idSelecionado.toLowerCase() === 'novo') {
          this.novoRegistro = true;
          this.pedido = new Pedido();
          //Caso contrário devemos consultar na base para atualizar os valores
        } else {
          this.pesquisarPorId();
        }
      });
  }

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarFormasPgto();
  }

  private pesquisarPorId() {
    this.pedidoService.getById(this.idSelecionado).subscribe(
      (result) => {
        this.pedido = result;
        this.carregarDados();
      },
      (err) => { }
    );
  }

  private carregarClientes() {
    this.clienteService.get("").subscribe(
      (result) => {
        this.carregandoClientes = false;
        this.clientes = result;
      },
      (error) => {
        this.carregandoClientes = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os clientes',
          nzContent: 'Não foi possível carregar a lista de clientes.'
        });
        console.log(error);
      });
  }

  private carregarFormasPgto() {
    this.formaPgtService.get("").subscribe(
      (result) => {
        this.carregandoClientes = false;
        this.formasPagamentos = result;
      },
      (error) => {
        this.carregandoClientes = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar as formas de pagamento',
          nzContent: 'Não foi possível carregar a lista de formas de pagamento.'
        });
        console.log(error);
      });
  }

  public voltar(): void {
    this.router.navigateByUrl(AppRoutes.Pedidos.base());
  }

  public salvar(): void {

    //Passa os valores do form para o objeto
    AssignFormHelper.assignFormValues<Pedido>(this.form, this.pedido);

    //Se o form estiver válido segue para o processo de salvar ou atualizar
    if (this.form.valid) {

      //Verificar qual operaçao o usuário está querendo executar
      const operacao = this.novoRegistro 
        ? this.pedidoService.add(this.pedido) 
        : this.pedidoService.update(this.pedido);

      operacao.subscribe((result) => {
        this.voltar();
      },
        (err) => {
          let msg: string = '';
          if (err.error) {
            for (const iterator of err.error) {
              msg += `<p>${iterator.message}</p>`
            }

          }
          this.modalService.error({
            nzTitle: 'Falha ao registrar o registro',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                      ${msg}`
          });

        })
    }
  }

  private carregarDados() {
    if (this.pedido) {
      this.form.get("dataPedido").setValue(this.pedido.dataPedido);
      this.form.get("clienteId").setValue(this.pedido.clienteId);
      this.form.get("usuarioId").setValue(this.pedido.usuarioId);
      this.form.get("formaPagamentoId").setValue(this.pedido.formaPagamentoId);
      this.form.get("observacao").setValue(this.pedido.observacao);

      this.form.get("quantidadeDeItens").setValue(this.pedido.quantidadeDeItens);
      this.form.get("quantidadeDeItens").disable();

      this.form.get("totalItens").setValue(this.pedido.totalItens);
      this.form.get("totalItens").disable();

      this.form.get("totalDesconto").setValue(this.pedido.totalDesconto);
      this.form.get("totalDesconto").disable();

      this.form.get("totalProdutos").setValue(this.pedido.totalProdutos);
      this.form.get("totalProdutos").disable();

      this.clienteSel = this.pedido.clienteId;
      this.formaPagamentoSel = this.pedido.formaPagamentoId;

      this.pedidosItens = this.pedido.itens;

    }
  }

  public editar(item: PedidosItens): void {
    this.abrirModalItem(item);
  }

  public excluir(item: PedidosItens): void {
    let prod = item.produto ? item.produto.nome : ""
    if (confirm(`Deseja excluir o registro ${prod}?`)) {

      const index = this.pedido.itens.indexOf(item);
      this.pedido.itens.splice(index, 1);
      this.forcarAtualizarTabelaItens();

      this.calcularTotais();

    }
  }

  public adicionar() {
    this.abrirModalItem(new PedidosItens());

  }

  private calcularTotais(){
    
    this.form.get("quantidadeDeItens").setValue(this.pedido.itens.length);

    let totalItens = 0;
    let totalDesconto = 0;
    let totalProdutos = 0;
    for (const item of this.pedido.itens) {
      
      totalItens += (item.precoUnitario * item.quantidade);

      totalDesconto += (item.quantidade * item.precoUnitario * (item.desconto / 100));

      totalProdutos += totalItens - totalDesconto;
    }

    this.form.get("totalItens").setValue(totalItens.toFixed(2));
    this.form.get("totalDesconto").setValue(totalDesconto.toFixed(2));
    this.form.get("totalProdutos").setValue(totalProdutos.toFixed(2));
  }

  public abrirModalItem(item: PedidosItens) {

    const modal = this.modalService.create<ModalItemPedidoComponent>({
      nzTitle: "Adicionar item",
      nzContent: ModalItemPedidoComponent,
      nzComponentParams: {
        pedidoItem: item
      },
      nzWidth: 650,
      nzFooter: [
        {
          label: "Cancelar",
          onClick: () => modal.destroy(),
        },
        {
          label: "Salvar",
          type: "primary",
          onClick: (componentInstance) => {

            if (componentInstance.formValido() == false) {
              return;
            }

            const item = this.pedido.itens.find((item) => item.id == componentInstance.pedidoItem.id);
            if (!item) {
              this.pedido.itens.push(componentInstance.pedidoItem);
            }

            this.forcarAtualizarTabelaItens();

            this.calcularTotais();

            modal.destroy();
          },
        },
      ],
    });

  }

  private forcarAtualizarTabelaItens(){
    //Gambi! Ps o "data" do componente não reconhece a alteração então é necessário forçar uma atualização
    this.pedidosItens = [];
    this.pedidosItens = this.pedido.itens.filter((item) => true);
  }

}
