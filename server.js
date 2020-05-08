'use strict';

const WebSocket = require('ws');
const mqtt = require('mqtt')
const config = require('./config.json');
const socket = new WebSocket(`ws://${config.deconz.host}:${config.deconz.port}`)

var mqttConnected = false;

const client = mqtt.connect(`mqtt://${config.mqtt.host}:${config.mqtt.port}`, { 
  keepalive: 10000, 
  clientId: "deconz-to-mqtt",
  username: config.mqtt.username, 
  password: config.mqtt.password
});

client.on('error', () => {
  console.log('MQTT connection failure or parsing error');
  mqttConnected = false;
});

client.on('offline', () => {
  console.log('MQTT going offline');
  mqttConnected = false;
});

client.on('connect', () => {
  console.log('MQTT Server connected');
  mqttConnected = true;
});

client.on('end', () => {
  console.log('MQTT shutdown');
  mqttConnected = false;
});

client.on('message', (topic,message) => {
  console.log('onMessageArrived:' + message.payloadString);
});

socket.on('open', () => {
  socket.on('message', data => {
    const sensorData = JSON.parse(data)
    const sensorId = sensorData.id;
    const sensor = config.sensors[sensorId];
    if (sensor === undefined) {
      console.log(`sensor not defined: ${sensorId}`)
      return
    }

    const topic = `${sensor.topic}`

    var value = sensorData.state[`${sensor.data}`]

    const isInt = value === parseInt(value)
    const isFloat = value === parseFloat(value)
    const isNumeric = isInt || isFloat
    const hasDivisor = !(sensor.divisor === undefined)

    if (isNumeric && hasDivisor) {
      value /= sensor.divisor
    }

    console.log(`topic: ${topic} data: ${value}`)

    if (mqttConnected) {
      client.publish(topic, `${value}`)
      console.log("data published");
    }
    else {
      console.log("mqtt not connected.");
    }
  });
});

socket.on('error', () => {
  console.log('something has gone wrong');
});

console.log('started');