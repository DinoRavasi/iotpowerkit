import {Component} from 'angular2/core';
import {Router} from 'angular2/router';
 
@Component({
    selector: 'chat',
    templateUrl: 'templates/chat.html'
})
export class ChatComponent {
    message = '';
    conversation = [];
    socket = null;
 
    constructor(
        private _router: Router){}
 
    ngOnInit() {
        if (sessionStorage.getItem("userName") === null){
            this._router.navigate(['Registration']);
        }
        this.socket = io('http://localhost:8000');
        this.socket.on('chatUpdate', function(data) {
            this.conversation.push(data);
        }.bind(this));
    }
 
    send() {
        this.socket.emit('newMessage', {
            'userName': sessionStorage.getItem("userName"),
            'text': this.message
        });
        this.message = '';
    }
 
    keypressHandler(event) {
        if (event.keyCode === 13){
            this.send();
        }
    } 
 
    isNewUserAlert(data){
        return data.userName === '';
    }
}