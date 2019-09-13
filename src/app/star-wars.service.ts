import { LogService } from './log.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class StarWarsService {
  private characters = [
    {name: 'Luke Skywalker', side: ''},
    {name: 'Darth Vader', side: ''}
  ];

  private logService: LogService;
  charactersChanged = new Subject<void>();
  http: Http;

  constructor(logService: LogService, http: Http) {
    this.logService = logService;
    this.http =  http;
  }

  fetchCharacters() {
    this.http.get(
      'https://swapi.co/api/people/'
    )
    .map((response: Response) => {
      const data = response.json();
      const extractedChars = data.results;
      const chars = extractedChars.map((char) => {
        return {name: char.name, side: ''};
      });

      return chars;
    })
    .subscribe((data) => {
      console.log(data);
      this.characters = data;
      this.charactersChanged.next();
    });

  }

  getCharacters(chosenList) {
    if (chosenList === 'all') {
      return this.characters.slice();
    }
    return this.characters.filter((char) => {
      return char.side === chosenList;
    });
  }

  onSideChosen(event) {
    const pos = this.characters.findIndex((char) =>{
      return char.name === event.name;
    });
    this.characters[pos].side = event.side;
    this.charactersChanged.next();
    this.logService.writeLog(`Changed side of ${event.name} to the ${event.side} side`);
  }

  addCharacter(name, side) {
    const pos = this.characters.findIndex((char) =>{
      return char.name === name;
    });
    if (pos === -1) {
      const newChar = {name: name, side: side};
      this.characters.push(newChar);
    }
  }


}
