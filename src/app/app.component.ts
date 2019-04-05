import { Component, OnInit, OnDestroy } from '@angular/core';
import {Paho} from 'ng2-mqtt/mqttws31';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscription: Subscription;

  
  title = 'mqtt-client';
  private client;
  // mqttbroker = 'test.mosquitto.org';
  // port='8080';
  // subscribedPath = '$SYS/#';
  // mqttbroker = 'broker.hivemq.com';
  // port='8000';
  // subscribedPath = 'testtopic/1';
  mqttbroker = '113.161.168.2';
  port='1883';
  subscribedPath = '/NSS/#';

  public message: string;

  constructor(private _mqttService: MqttService) {
    this.subscription = this._mqttService.observe(this.subscribedPath).subscribe((message: IMqttMessage) => {
      this.message = message.payload.toString();
      console.log(message);
    });
  }
  
  
  public unsafePublish(topic: string, message: string): void {
    this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



  ngOnInit(): void {
    this.client = new Paho.MQTT.Client(this.mqttbroker, Number(this.port), 'mitsuruog');
  this.client.onMessageArrived = this.onMessageArrived.bind(this);
  this.client.onConnectionLost = this.onConnectionLost.bind(this);
  // this.client.connect({onSuccess: this.onConnect.bind(this)});
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
