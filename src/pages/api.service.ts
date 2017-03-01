import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Cantine } from './interface/cantine'

@Injectable()
export class cantineService{
  private baseUrl: string = 'https://data.toulouse-metropole.fr/api';
  constructor(private http : Http){
  }

  getAllMaternelles(): Observable<Cantine[]> {
    let cantine$ = this.http
      .get(`${this.baseUrl}/records/1.0/search/?dataset=ecoles-maternelles-publiques&rows=1000`, {headers: this.getHeaders()})
      .map(mapCantinesMat);
      return cantine$;
  }

  getAllElementaires(): Observable<Cantine[]> {
    let cantine$ = this.http
      .get(`${this.baseUrl}/records/1.0/search/?dataset=ecoles-elementaires-publiques&rows=1000`, {headers: this.getHeaders()})
      .map(mapCantinesElem);
      return cantine$;
  }

  getMenuByTypeMonth(type :string, monthName: string): Observable<any> {
    let menu$ = this.http
      .get(`${this.baseUrl}/records/1.0/search/?dataset=menus-cantine-ville-de-toulouse-${monthName}&rows=1000&facet=ecole&refine.ecole=${type}`, {headers: this.getHeaders()})
      .map(mapMenu);
      return menu$;
  }

  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }

}

function handleError (error: any) {
  let errorMsg = error.message || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  return Observable.throw(errorMsg);
}

function mapCantinesMat(response:Response): Cantine[]{
   return response.json().records.map(toCantineMat)
}

function toCantineMat(r:any): Cantine{
  let cantine = <Cantine>({
    id: r.fields.rne,
    name: r.fields.ecole,
    type: 'MAT'
  });
  return cantine;
}

function mapCantinesElem(response:Response): Cantine[]{
   return response.json().records.map(toCantineMat)
}

function toCantineElem(r:any): Cantine{
  let cantine = <Cantine>({
    id: r.fields.rne,
    name: r.fields.ecole,
    type: 'ELEM'
  });
  return cantine;
}


function mapMenu(response:Response): any[]{
   return response.json().records.map(toMenu)
}

function toMenu(r:any): Cantine{
  let menu = <any>({
    semaine: r.fields.semaine,
    allergenes: r.fields.allergenes,
    ecole: r.fields.ecole,
    menu: r.fields.menu,
    ordre: r.fields.ordre,
    jour: r.fields.jour,
    type: r.fields.type
  });

  return menu;
}