import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProdutoService } from 'src/app/data-services/produto.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { PedidosItens } from 'src/app/models/pedido/pedido-item';
import { Produto } from 'src/app/models/produtos/produto';

@Component({
  selector: 'app-modal-item-pedido',
  templateUrl: './modal-item-pedido.component.html',
  styleUrls: ['./modal-item-pedido.component.scss']
})
export class ModalItemPedidoComponent implements OnInit {


  public pedidoItem: PedidosItens

  public saldoEstoque:Number;

  public form: FormGroup = new FormGroup({
    produtoId: new FormControl(null, [Validators.required]),
    observacao: new FormControl(null),
    quantidade: new FormControl(1, [Validators.required]),
    precoUnitario: new FormControl(1, [Validators.required]),
    desconto: new FormControl(0, [Validators.min(0)]),
    totalUnitario: new FormControl(0),
    totalItem: new FormControl(0),
  });

  public produtos: Produto[] = [];
  public carregandoProdutos: boolean = false;
  public produtoSel: string;

  constructor(
    private produtoService: ProdutoService,
    private modalService: NzModalService,
  ) { }

  ngOnInit(): void {
    this.carregarProdutos();
    this.carregarDados();    
  }

  private carregarDados() {

    this.form.get("produtoId").setValue(this.pedidoItem.produtoId);
    this.form.get("observacao").setValue(this.pedidoItem.observacao);
    this.form.get("quantidade").setValue(this.pedidoItem.quantidade);
    this.form.get("precoUnitario").setValue(this.pedidoItem.precoUnitario);
    this.form.get("desconto").setValue(this.pedidoItem.desconto);

    this.form.get("totalUnitario").setValue(this.pedidoItem.totalUnitario);
    this.form.get("totalUnitario").disable();

    this.form.get("totalItem").setValue(this.pedidoItem.totalItem);
    this.form.get("totalItem").disable();

    var produto = this.pedidoItem.produto;
    if (produto) {
      this.produtoSel = produto.id;
    }

    this.calcularTotais();
  }

  private carregarProdutos() {
    this.produtoService.get("").subscribe(
      (result) => {
        this.carregandoProdutos = false;
        this.produtos = result;
      },
      (error) => {
        this.carregandoProdutos = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os produtos',
          nzContent: 'Não foi possível carregar a lista de produtos.'
        });
        console.log(error);
      });
  }

  public produtoOnChange(event) {

    var produto = this.produtos.find((p) => p.id == event)
    if (produto) {
      this.form.get("precoUnitario").setValue(produto.preco);
      this.pedidoItem.produto = produto;
      this.calcularTotais();
    }
  }

  public calcularTotais() {
    
    let preco = Number(this.form.get("precoUnitario").value)
    let quantidade = Number(this.form.get("quantidade").value)
    let desconto = Number(this.form.get("desconto").value)

    let totalUni = preco * quantidade;
    let totalDesconto = (preco * (desconto / 100)) * quantidade;
    let totalItem = totalUni - totalDesconto;

    this.form.get("totalUnitario").setValue(totalUni);
    this.form.get("totalItem").setValue(totalItem);

    this.pedidoItem.totalUnitario = totalUni;
    this.pedidoItem.totalItem = totalItem;
  }

  public formValido(): boolean{

    this.calcularTotais();    

    AssignFormHelper.assignFormValues<PedidosItens>(this.form, this.pedidoItem);

    return this.form.valid;
  }

}
