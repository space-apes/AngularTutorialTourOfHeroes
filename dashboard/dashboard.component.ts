//dashboard also requires definition of Hero and ability
//to retrieve hero data, relies on hero service provider, and is injected by root injector

import { Component, OnInit } from '@angular/core';
import { Hero } from '../heroes/hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  heroes : Hero[] = [];
  
  constructor(private heroService: HeroService) { 
  }

  ngOnInit(): void {
	  this.getHeroes();
  }
  getHeroes(): void {
  	this.heroService.getHeroes().subscribe(heroes=>this.heroes = heroes.slice(1, 5));

  }

}
