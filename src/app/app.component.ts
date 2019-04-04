import { Component, OnInit } from '@angular/core';
import {Paho} from 'ng2-mqtt/mqttws31';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  title = 'mqtt-client';
  private client;
  // mqttbroker = 'test.mosquitto.org';
  // port='8080';
  // subscribedPath = '$SYS/#';
  mqttbroker = 'broker.hivemq.com';
  port='8000';
  subscribedPath = 'testtopic/1';

  ngOnInit(): void {
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(this.port), 'mitsuruog');
  this.client.onMessageArrived = this.onMessageArrived.bind(this);
  this.client.onConnectionLost = this.onConnectionLost.bind(this);
  this.client.connect({onSuccess: this.onConnect.bind(this)});
  }


  onConnect() {
    console.log('onConnect');
    this.client.subscribe(this.subscribedPath);
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log('onConnectionLost:' + responseObject.errorMessage);
    }
  }

  onMessageArrived(message) {
    console.log(message.payloadString);
  
  }

}
