'use strict';

const WebSocket = require('ws');
const mqtt = require('mqtt')
const mustache = require('mustache')
const config = require('./config.json');
const SENSOR_PATH = 'deconz';

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
    var sensorData = JSON.parse(data)

    var view = {
      path : SENSOR_PATH,
      id : sensorData.id,
      type : sensorData.r,
      state_topic : config.mqtt.state_topic
    }
    var topic = mustache.render('{{path}}/{{id}}/{{type}}/{{state_topic}}', view);
    if (mqttConnected) {
      client.publish(topic, data, { qos:0, retained:false } );
      console.log(topic + data);
    }
    //console.log(data);
  });
  socket.send('test');
});

socket.on('error', () => {
  console.log('something has gone wrong');
});

