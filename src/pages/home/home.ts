import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CantineDetailsPage } from '../cantine-details/cantine-details';
import { CantineListPage } from '../cantine-list/cantine-list';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  items = [];

  constructor(public nav: NavController) {
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
}
