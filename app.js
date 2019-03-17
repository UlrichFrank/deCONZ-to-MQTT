'use strict';

global.WebSocket = require('ws');
const mqtt = require('mqtt')

const config = require('./config.json');

const SENSOR_PATH = 'deconz/sensor/';

var mqttConnected = false;

const socket = new WebSocket('ws://' + config.deconz.host + ':' + config.deconz.port);
var client = mqtt.connect('mqtt://' + config.mqtt.host + ':' + config.mqtt.port, { keepalive: 10000, username : config.mqtt.username, password : config.mqtt.password});

client.on('error', () => {
  console.log('MQTT connection failure or parsing error');
  mqttConnected = false;
});

client.on('offline', () => {
  console.log('MQTT going oflline');
  mqttConnected = false;
});

client.on('connect', () => {
  console.log('MQTT Server connected');
  mqttConnected = true;
});

client.on('end', () => {
  console.log('MQTT shutdown');
  mqttConnected = true;
});

client.on('message', (topic,message) => {
  console.log('onMessageArrived:' + message.payloadString);
});


socket.on('open', () => {
  socket.on('message', data => {
    console.log(data);
    var sensorData = JSON.parse(data)
    var topic = SENSOR_PATH  + sensorData.id + '/' + config.mqtt.state_topic;
    var payload = data;
    if (mqttConnected) {
      client.publish(topic, payload, { qos:0, retained:false } );
    }
    console.log(data);
  });
  socket.send('test');
});

socket.on('error', () => {
  console.log('something has gone wrong');
});

