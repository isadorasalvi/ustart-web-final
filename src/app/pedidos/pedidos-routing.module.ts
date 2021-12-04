import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadPedidoComponent } from './pages/cad-pedido/cad-pedido.component';
import { PedidoComponent } from './pages/pedido/pedido.component';

const routes: Routes = [
  { path: '', component: PedidoComponent },
  { path: 'cad-pedido', component: CadPedidoComponent },
  { path: 'cad-pedido/:id', component: CadPedidoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidosRoutingModule { }
