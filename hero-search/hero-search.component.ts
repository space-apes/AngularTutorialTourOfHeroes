import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Hero } from '../heroes/hero';
import { HeroService } from '../hero.service';


@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$!: Observable<Hero[]>;
  
  private searchTerms = new Subject<string>();

  constructor(private heroService : HeroService) { };


  ngOnInit(): void {
  	this.heroes$=this.searchTerms.pipe(
		// waits until flow of string events pauses for 300ms
		debounceTime(300),
		//request sent only if filter text changed
		distinctUntilChanged(),
		//calls search service for each search term that makes it 
		//through previous two filters
		//cancels and and discards previous search observables 
		//returning only latest one
		switchMap((term: string) => this.heroService.searchHeroes(term))
  	);
  }

  //push a search term into the observable stream
  search(term: string) : void {
  	this.searchTerms.next(term);
  }
}
