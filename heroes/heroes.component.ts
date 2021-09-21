import { Component, OnInit } from '@angular/core';

import { Hero } from './hero';
import { MessageService } from '../message.service';
import { HeroService } from '../hero.service'

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  
  heroes : Hero[] = []; 
  
  //not used since heroescomponent just adds links to hero detail pages now	   
  //selectedHero?: Hero;

  //dependency injection here because hero component class 
  // depends on hero but does not instantiate it.
  //instead it takes an already instantiated object as constructer param
  constructor(private heroService: HeroService, private messageService: MessageService) { }

  //constructor should only create instance. should not do any work
  //this makes request to service after instantiation
  ngOnInit(): void {
  	this.getHeroes();
  }

  /*
  //not used since heroesComponent adds links to detail pages now
  //class setter. also add message to message service queue 
  onSelect(hero: Hero): void {
  	this.selectedHero = hero;
	this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`)
  }
  */

  //setter to retrieve array of heroes using HeroService
  // the service returns an observable so we must subscribe
  // to it and wait for it to emit the array of Heroes
  getHeroes() : void{
  	//old version when it returned an array of Heroes
	//this.heroes = this.heroService.getHeroes();
  	this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  //persists new hero by passing name from input element to heroservice.addHero
  // waits for heroService to update the true backend and after that
  // pushes the new hero to the local array of Heros

  add(name: string) : void {
	//remove whitespaces  
	name = name.trim();
	//if empty name, just return
	if(!name) {return;}
	// type assertion to force this object to be type Hero
  	this.heroService.addHero({name } as Hero).subscribe(
		hero => this.heroes.push(hero)
	);

  }

  //sets local array of heroes to same array missing hero from parameter
  //deletes persisted record of hero by using heroService.deleteHero
  delete(hero: Hero) : void {
  	this.heroes = this.heroes.filter(h=> h!== hero);
	this.heroService.deleteHero(hero.id).subscribe();
  }


}
