//HEROSERVICE: allows us to retrieve a hero but abstracts where we get it from

import { Injectable } from '@angular/core';
import { Hero } from './heroes/hero';
import { HEROES } from './heroes/mock-heroes';
import { Observable, of } from 'rxjs';
import { MessageService } from './message.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes';

  httpOptions = {
  	headers: new HttpHeaders( {'Content-Type': 'application/json' } )
  }
 
  constructor(
		  private http: HttpClient,
		  private messageService: MessageService,

             ) { };
  
 



  /* SIMPLE VERSION WITHOUT ANY HTTP REQUESTS

  //service 'fetch' type method using mockup from mock-heroes.ts
  //getHeroes() : void {
  //	return HEROES;
  //
  }
  
	
  //now getHeroes doesn't return an array. returns observable that emits array
  getHeroes(): Observable<Hero[]> {
  	const heroes = of(HEROES);
  	return heroes;
  }

  //get single hero using a given id 
  getHero(id: number): Observable<Hero> {
  	//for now assume hero with given id exists
	const hero = HEROES.find(h => (h.id == id) )!;
	this.messageService.add(`HeroService: fetched hero id=${id}`);
	return of(hero);
  }

  */

  /** HTTP GET heroes from server */

  //requests array of heroes from url
  //pipes results through error catching method
  //returns final result so application keeps working

  //pipe seems to pass returned value in to list of functions so 
  //it is important for all these functions to return same datatype
  //if we are going to return the original value at the end
  getHeroes(): Observable<Hero[]> {
	return this.http.get<Hero[]>(this.heroesUrl)
	.pipe(
		tap(_ => this.log('fetched heroes')),
		catchError(this.handleError<Hero[]>('getHeroes', []))
	);
  }

  /** HTTP GET single hero**/
  getHero(id: number) : Observable<Hero> {
  	const url = `${this.heroesUrl}/${id}`
	return this.http.get<Hero>(url).pipe(
		tap(_ => this.log(`fetched hero with id: ${id}`)),
		catchError(this.handleError<Hero>(`getHero id=${id}`))
	);
  }	  

  /** HTTP GET heroes whose name matches given search term **/

  searchHeroes(term: string) : Observable<Hero[]> {
	//if no search term, return empty array
  	if (!term.trim())
	{
		return of([]);
	}
	return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
		tap(x => x.length ? 
			this.log(`found heroes matching term: ${term}`) :
			this.log(`no heroes matching term: ${term}`)
		   ),
		catchError(this.handleError<Hero[]>('searchHeroes', []))
		);
  }
 
  /** HTTP PUT **/
  updateHero(hero: Hero) : Observable<any> {
  	return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
		tap(_ =>this.log(`updated hero id=${hero.id}`)),
		catchError(this.handleError<any>('updateHero'))
	);
  }

  /** HTTP POST **/

  addHero(hero:Hero) : Observable<Hero>{
  	return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
		tap( (newHero:Hero) => this.log(`added hero w/ name: ${newHero.name}, id: ${newHero.id}`)),
		catchError(this.handleError<Hero>('addHero'))
	);
  }

  /** HTTP DELETE **/

  deleteHero(id: number) : Observable<Hero> {
  	const url = `${this.heroesUrl}/${id}`;
	return this.http.delete<Hero>(url, this.httpOptions).pipe(
		tap( _ => this.log(`deleted hero with id: ${id}`)),
		catchError(this.handleError<Hero>('deleteHero'))
	);
  }

  /**
    * Handle Http operation that failed.
    * let the app continue
    * Because each service method returns a different kind of 
    * Observable result, handleError() takes a type parameter so 
    * it can return the safe value as the type that the application expects.
    *
    * @param operation - the name of the operation that failed
    * @param result - optional value to return as the observable result
    * @returns function - prints error, logs it, returns result as T
    */

  private handleError<T> (operation = 'operation', result?: T){
  	return (error: any): Observable<T> => {
		
		//TODO: send error to remote logging infrastructure
		console.error(error);

		//TODO: transform error for user 
		this.log(`${operation} failed: ${error.message}`);

		//let app keep running by returning empty result
		return of(result as T);

	}
  }


  private log(message: string) : void {
  	this.messageService.add(`HeroService: ${message}`);
  }

}
