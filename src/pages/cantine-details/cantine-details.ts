import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-cantine-details',
  templateUrl: 'cantine-details.html'
})
export class CantineDetailsPage {
  item;

  constructor(params: NavParams) {
    this.item = params.data.item;
  }
}