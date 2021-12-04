import { v4 as uuidv4 } from 'uuid';
import { Cliente } from '../clientes/cliente';
import { FormaPagamento } from '../forma-pagamento/forma-pagamento';
import { PedidosItens } from './pedido-item';

export class Pedido {
    public id: string
    public dataPedido: Date
    public clienteId: string 
    public cliente:Cliente   
    public usuarioId: string    
    public formaPagamentoId: string    
    public formaPagamento: FormaPagamento
    public observacao: string
    public itens: PedidosItens[]
    public quantidadeDeItens: number
    public totalItens: number
    public totalDesconto: number
    public totalProdutos: number
    
    constructor(init?: Partial<Pedido>) {
        debugger;
        if (init) {
            Object.assign(this, init);
        } else {
            this.id = uuidv4();            
            this.itens = [];            
        }
    }
}

 
 
 
 
 
 
 
 
 
 
 
 
 
 
