import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  constructor() { }
  getSaludo():string{
    const hora: number = parseInt(moment().format("H"));
      let saludo = "";
      if(hora<12){
        saludo = "Buenos días";
      }
      if(hora>=12 && hora<19){
        saludo = "Buenas tardes";
      }
      if(hora>19){
        saludo = "Buenas noches";
      }
      return saludo;
  }
  getTime():string{
    const time: string = moment().format("HH:mm:ss");
    return time;
  }
  getDate():string{
    const date: string = moment().format("yyyy/MM/dd");
    return date;
  }
  getTimestamp():string{
    const timestamp: string = moment().format();
    return timestamp;
  }

}
