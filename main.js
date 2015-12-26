var Cylon = require('cylon');

Cylon.robot({
  connections: {
    arduino: { adaptor: 'firmata', port: 'COM3' }
  },

  devices: {
    ws: { driver: 'analog-sensor', pin: 0 },
    wp: { driver: 'relay', pin: 6 }
  },

  work: function(my) {

    var isWpOff = true;

   	every((1).second(), function () {
   		
   		var value = my.ws.analogRead();
   		
   		console.log("water value", value);

   		if(value > 200 && !isWpOff) {

        console.log("turn off");

        my.wp.turnOff();
        
        isWpOff = true;

  		} else if(isWpOff && value < 100){

        console.log("turn on");

        my.wp.turnOn();

        isWpOff = false;

   		}

   	});
  }
}).start();