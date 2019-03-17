# deCONZ-to-MQTT
Bridge deCONZ events and publish to MQTT


## config.json
```{
    "deconz": {
        "host" : "192.168.1.1",
        "port" : 8443
    },
    "mqtt" : {
        "host" : "192.168.1.1",
        "port" : 1883,
        "username" : "username", 
        "password" : "password",
        "state_topic" : "state",
        "command_topic" : "set"
    } 
}
```
