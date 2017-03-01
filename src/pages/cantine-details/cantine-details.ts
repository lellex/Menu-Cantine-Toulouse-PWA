import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {cantineService} from '../api.service';

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
  currentMenu = {'Pain': [], 'Entrée': [], 'Plat': [], 'Dessert/Fromage': []};
  constructor(params: NavParams, private cantineService: cantineService) {
    this.currentCantine = params.data.item;
    this.cantineService.getMenuByTypeMonth(this.currentCantine.type, this.currentMonth).subscribe(p =>  {
      this.menu = p;
      this.week = [...new Set(this.menu.map(item => item.semaine))];
      this.currentWeek = this.week[0];
      this.updateMenu();
    });
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
      this.currentDay = this.days[index]
      this.updateMenu();
    }
  }

  dayBack() {
    let index = this.days.indexOf(this.currentDay) - 1;
    if (index >= 0 && index < this.days.length) {
      this.currentDay = this.days[index]
      this.updateMenu();
    }
  }

  weekForward() {
    let index = this.week.indexOf(this.currentWeek) + 1;
    if (index >= 0 && index < this.week.length) {
      this.currentWeek = this.week[index]
      this.updateMenu();
    }
  }

  weekBack() {
    let index = this.week.indexOf(this.currentWeek) - 1;
    if (index >= 0 && index < this.week.length) {
      this.currentWeek = this.week[index]
      this.updateMenu();
    }
  }

  updateMenu() {
    this.currentMenu['Pain'] = this.getFoodByTypeWeekDay('Pain', this.currentWeek, this.currentDay);
    this.currentMenu['Entrée'] = this.getFoodByTypeWeekDay('Entrée', this.currentWeek, this.currentDay);
    this.currentMenu['Plat'] = this.getFoodByTypeWeekDay('Plat', this.currentWeek, this.currentDay);
    this.currentMenu['Dessert/Fromage'] = this.getFoodByTypeWeekDay('Dessert/Fromage', this.currentWeek, this.currentDay);
  }
}

function compare(a,b) {
  if (a.ordre < b.ordre)
    return -1;
  if (a.ordre > b.ordre)
    return 1;
  return 0;
}