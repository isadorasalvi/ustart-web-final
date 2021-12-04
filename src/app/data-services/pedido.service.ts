import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EndpointsService } from '../core/services/endpoints/endpoints.service';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido/pedido';

@Injectable({ providedIn: 'root' })
export class PedidoService {
    constructor(
        private http: HttpClient,
        private endpointsService: EndpointsService
    ) { }

    public get(pesquisar: string = null): Observable<Pedido[]> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/pedido/?pesquisa=${pesquisar}`
        return this.http.get<Pedido[]>(url);
    }

    public getById(id: string = null): Observable<Pedido> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/pedido/${id}`
        return this.http.get<Pedido>(url);
    }

    public add(pedido: Pedido): Observable<Pedido> {

        const url = `${this.endpointsService.getServerUrl()}api/v1/pedido/`
        return this.http.post<Pedido>(url, pedido);
    }

    public update(pedido: Pedido): Observable<Pedido> {
        
        const url = `${this.endpointsService.getServerUrl()}api/v1/pedido/${pedido.id}`;
        return this.http.put<Pedido>(url, pedido);
    }

    public delete(id: string): Observable<any> {
        
        const url = `${this.endpointsService.getServerUrl()}api/v1/pedido/${id}`;
        return this.http.delete<any>(url);
    }
}