# deCONZ-to-MQTT
Bridge deCONZ events and publish to MQTT

## Create an API key

Open the phoscon web application and navigate to:
Gateway / Extended

Click on:
`Connect App`

Execute the following command within the next 60 secounds:
`curl -H "Content-Type: application/json" -X POST -d '{"devicetype": "deconz-mqtt"}' http://<host>/api`

the given username can be used as API key.

## Get the websocket port

`curl http://<host>/api/<apikey>/config | grep -Eo "websocketport\":\d+"`

## config.json

Example configuration with two sensors:

```
{
    "deconz": {
        "host" : "192.168.1.1",
        "port" : 443
    },
    "mqtt": {
        "host" : "192.168.1.1",
        "port" : 1883,
        "username" : "username", 
        "password" : "password"
    },
    "sensors": {
        "2": {
            "topic": "livingroom/temperature",
            "data": "temperature",
            "divisor": 100
        },
        "3": {
            "topic": "livingroom/humidity",
            "data": "humidity",
            "divisor": 100
        },
        "4": {
            "topic": "livingroom/pressure",
            "data": "pressure",
            "divisor": 1
        },

        "5": {
            "topic": "bathroom/temperature",
            "data": "temperature",
            "divisor": 100
        },
        "6": {
            "topic": "bathroom/humidity",
            "data": "humidity",
            "divisor": 100
        },
        "7": {
            "topic": "bathroom/pressure",
            "data": "pressure",
            "divisor": 1
        }        
    }
}
```
