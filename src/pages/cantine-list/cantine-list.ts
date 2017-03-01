import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {cantineService} from '../api.service';

@Component({
  selector: 'page-cantine-list',
  templateUrl: 'cantine-list.html'
})
export class CantineListPage {
  mats = [];
  elems = [];
  cantineType: string = "mat";
  selectedCantines = [];

  constructor(public nav: NavController, private cantineService : cantineService, params: NavParams) {
    this.selectedCantines = params.data.selectedCantines;
  }

  selectCantine(item) {
    let index = this.selectedCantines.map(function(x) {return x.id; }).indexOf(item.id);
    if (index > -1) {
      this.selectedCantines.splice(index, 1);    
    } else {
      this.selectedCantines.push(item);    
    }
  }

  addSelectedCantine() {
    localStorage.setItem('selectedCantine', JSON.stringify(this.selectedCantines));
    this.nav.pop();
  }

  isHidden(item) {
    return this.selectedCantines.map(function(x) {return x.id; }).indexOf(item.id) > -1 ? true : false;
  }
  
  ngOnInit() {
    this.cantineService.getAllMaternelles().subscribe(p =>  {
      this.mats = p.sort(compare);
    });
    this.cantineService.getAllElementaires().subscribe(p =>  {
      this.elems = p.sort(compare);
    });
  }
}


function compare(a,b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}