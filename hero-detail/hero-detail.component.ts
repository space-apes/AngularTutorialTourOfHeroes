import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../heroes/hero';

import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  @Input() hero?: Hero;

  //activated route, hero service and location injected at time creation
  constructor(
  private route: ActivatedRoute,
  private heroService: HeroService,
  private location: Location
  ) { }

  ngOnInit(): void {
	  this.getHero()
  }

  //sets hero field by:
  //	- getting route that led to this instance of hero-detail.component
  //	- extracting id from that route
  // 	- using HeroService to retrieve the hero using the id	
  getHero(): void {
  	const id = Number(this.route.snapshot.paramMap.get('id'));
	this.heroService.getHero(id).subscribe(hero => this.hero = hero);
  }

  //persists changes to hero name using HeroService.updateHero then navigates back to previous view
  save() {
  	if (this.hero) {
		this.heroService.updateHero(this.hero).subscribe(() => this.goBack() );
	}
  }

  //hits teh back button!
  goBack(): void {
  	this.location.back();
  }
}
