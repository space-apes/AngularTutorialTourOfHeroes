//like a queue of messages for asynch stuff
//this 'queue' will be where the message component gets its data

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  
  //array of string messages
  messages: string[] = []
  constructor() { }

  //add a new message to message queue
  add(message: string) {
  	this.messages.push(message);	
  }

  //clear messages
  clear() {
  	this.messages = [];
  }
  
}
