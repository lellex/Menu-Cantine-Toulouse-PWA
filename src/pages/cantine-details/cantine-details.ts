import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {cantineService} from '../api.service';
import { LoadingController } from 'ionic-angular';

declare let require: any;

@Component({
  selector: 'page-cantine-details',
  templateUrl: 'cantine-details.html'
})
export class CantineDetailsPage {
  menu = [];
  currentCantine;
  months = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];
  week = [];
  days = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  currentMonth = this.months[new Date().getMonth()];
  currentWeek = '';
  currentDay = this.days[0];
  currentMenu = {'Pain': [], 'Entrée': [], 'Plat': [], 'Dessert/Fromage': [], 'Allergenes': []};
  allergens = require("../allergenes.json").allergenes;
 
  constructor(params: NavParams, private cantineService: cantineService, public loadingCtrl: LoadingController) {
    this.currentCantine = params.data.item;
    this.startNewMenuMonth(false);
  }

  getFoodByTypeWeekDay(type, week, day) {
    // type : Pain - Entrée - Plat - Dessert/Fromage
    let arr = this.menu.filter((obj) => {
      if (obj.type === type && obj.semaine === week && obj.jour.toLowerCase() === day ) {
        return true;
      }
    }).sort(compare);
    return arr;
  }

  dayForward() {
    let index = this.days.indexOf(this.currentDay) + 1;
    if (index >= 0 && index < this.days.length) {
      this.currentDay = this.days[index];
      this.updateMenu();
    }
  }

  dayBack() {
    let index = this.days.indexOf(this.currentDay) - 1;
    if (index >= 0 && index < this.days.length) {
      this.currentDay = this.days[index];
      this.updateMenu();
    }
  }

  weekForward() {
    let index = this.week.indexOf(this.currentWeek) + 1;
    let indexMonth;
    if (index >= 0 && index < this.week.length) {
      this.currentWeek = this.week[index];
      this.updateMenu();
    } else {
      if (index >= this.week.length) {
        indexMonth = this.months.indexOf(this.currentMonth) + 1;
        if (indexMonth <= 12) {
          this.currentMonth = this.months[indexMonth];
          this.startNewMenuMonth(false);
        }
      }
    }
  }

  weekBack() {
    let index = this.week.indexOf(this.currentWeek) - 1;
    let indexMonth;
    if (index >= 0 && index < this.week.length) {
      this.currentWeek = this.week[index];
      this.updateMenu();
    } else {
      if (index < 0) {
        indexMonth = this.months.indexOf(this.currentMonth) - 1;
        if (indexMonth >= 0) {
          this.currentMonth = this.months[indexMonth];
          this.startNewMenuMonth(true);
        }
      }
    }
  }

  startNewMenuMonth(startEnd) {
    this.cantineService.getMenuByTypeMonth(this.currentCantine.type, this.currentMonth).subscribe(p =>  {
      this.menu = p;
      this.week = [...new Set(this.menu.map(item => item.semaine))];
      this.currentWeek = startEnd ? this.week[this.week.length - 1] : this.week[0];
      this.updateMenu();
    }
    , e => this.currentMonth = this.months[this.week.indexOf(this.currentWeek) - 1]);
  }

  updateMenu() {
    this.currentMenu['Pain'] = this.getFoodByTypeWeekDay('Pain', this.currentWeek, this.currentDay);
    this.currentMenu['Entrée'] = this.getFoodByTypeWeekDay('Entrée', this.currentWeek, this.currentDay);
    this.currentMenu['Plat'] = this.getFoodByTypeWeekDay('Plat', this.currentWeek, this.currentDay);
    this.currentMenu['Dessert/Fromage'] = this.getFoodByTypeWeekDay('Dessert/Fromage', this.currentWeek, this.currentDay);
    this.currentMenu['Allergenes'] = this.getAllergenes();
  }

  getAllergenes() {
    let allergenes = [];
    allergenes = allergenes.concat(...this.currentMenu['Pain'].map(item => item.allergenes ? item.allergenes.split('/') : item.allergenes));
    allergenes = allergenes.concat(...this.currentMenu['Entrée'].map(item => item.allergenes ? item.allergenes.split('/') : item.allergenes));
    allergenes = allergenes.concat(...this.currentMenu['Plat'].map(item => item.allergenes ? item.allergenes.split('/') : item.allergenes));
    allergenes = allergenes.concat(...this.currentMenu['Dessert/Fromage'].map(item =>  item.allergenes ? item.allergenes.split('/') : item.allergenes));
    allergenes = allergenes.filter(function(n){ return n != undefined }); 
    return [...[...new Set(allergenes)].map(item =>  this.allergens[item - 1])].sort(compareAllergens);
  }

  weekSwipe(evt) {
    // offsetDirection 4 Right 2 Left
    evt.offsetDirection === 2 ? this.weekForward() : this.weekBack();
  }

  daySwipe(evt) {
    evt.offsetDirection === 2 ? this.dayForward() : this.dayBack();
  }
}

function compare(a,b) {
  if (a.ordre < b.ordre)
    return -1;
  if (a.ordre > b.ordre)
    return 1;
  return 0;
}

function compareAllergens(a,b) {
  if (a.code < b.code)
    return -1;
  if (a.code > b.code)
    return 1;
  return 0;
}