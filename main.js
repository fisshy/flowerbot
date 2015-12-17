var Cylon = require('cylon');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: 'COM3' }
  },

  devices: {
    led: { driver: 'led', pin: 13 },
    ws: { driver: 'analog-sensor', pin: 0 }
  },

  work: function(my) {

 	every((1).second(), function () {
 		
 		var value = my.ws.analogRead();
 		
 		console.log("water value", value);

 		if(value > 500) {
 			my.led.turnOn();
 		} else {
 			my.led.turnOff();
 		}

 	});
    //console.log(my.ws);

  }
}).start();