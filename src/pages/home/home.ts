import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CantineDetailsPage } from '../cantine-details/cantine-details';
import { CantineListPage } from '../cantine-list/cantine-list';
import {cantineService} from '../api.service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  items = [];

  constructor(public nav: NavController, private cantineService: cantineService) {
    this.updateSelectedCantines();
  }

  openNavDetailsPage(item) {
    this.nav.push(CantineDetailsPage, { item: item });
  }

  openNavCantineList() {
    this.nav.push(CantineListPage, { selectedCantines: this.items });
  }

  ionViewWillEnter() {
    this.updateSelectedCantines();
  }

  updateSelectedCantines() {
    this.items = [];
    
    let selectedCantine = JSON.parse(localStorage.getItem("selectedCantine"));

    if (selectedCantine)
       this.items = selectedCantine;

  }
  
  deleteCantine(item) {
    let index = this.items.map(function(x) {return x.id; }).indexOf(item.id);
    if (index > -1) {
      this.items.splice(index, 1);
      localStorage.setItem('selectedCantine', JSON.stringify(this.items));
    }
  }

  ngOnInit() {
    this.cantineService.getAllMaternelles().subscribe(p =>  {});
    this.cantineService.getAllElementaires().subscribe(p =>  {});
    this.cantineService.getMenuByTypeMonth("MAT", "janvier").subscribe(p =>  {});
    this.cantineService.getMenuByTypeMonth("ELEM", "janvier").subscribe(p =>  {});
    this.cantineService.getMenuByTypeMonth("MAT", "fevrier").subscribe(p =>  {});
    this.cantineService.getMenuByTypeMonth("ELEM", "fevrier").subscribe(p =>  {});
    this.cantineService.getMenuByTypeMonth("MAT", "mars").subscribe(p =>  {});
    this.cantineService.getMenuByTypeMonth("ELEM", "mars").subscribe(p =>  {});
  }
}
