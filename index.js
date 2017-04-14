const five  = require("johnny-five");
const low   = require("lowdb");
const server = require('./server.js');

const board = new five.Board();
const db    = low('db.json');


const TEMPERATURE_MAX       = 25;
const TEMPERATURE_INTERVAL  = 1000 * 30;

const PUMP_INTERVAL         = 1000 * 60;
const PUMP_DURATION         = 1000 * 20;

const LIGHT_INTERVAL        = 1000 * 60;
const LIGHT_SPAN            = [
    [6, 10],
    [15, 21]
];

stopFans = (fans) => {
    fans.forEach((fan) => {
        fan.open();
    });
}

startFans = (fans) => {
    fans.forEach((fan) => {
        fan.close();
    });
}

handleFans = (fans, thermometer) =>  {
    stopFans(fans);

    console.log("begin fan");

    setInterval(() => {
        let celsius = thermometer.celsius;

        console.log("celcius", celsius);

        let fanOn = celsius > TEMPERATURE_MAX;
        let date = new Date();

        db.get('celsius')
          .push({ fanOn, celsius, date })
          .write()

        if(fanOn) {
            console.log("fan running");
            startFans(fans);
            return;
        }

        stopFans(fans);

    }, TEMPERATURE_INTERVAL);
}

handlePump = (pump) => {
    pump.open();
    console.log("begin pump");

    setInterval(() => {

        console.log("pump started");
        pump.close();

        setTimeout(() => {
            pump.open();
            console.log("pump closed");
        }, PUMP_DURATION)


    }, PUMP_INTERVAL);
}

handleLight = (light) => {
    light.close();
    console.log("light begin");

    setInterval(() => {

        let hour = new Date().getHours();
        let startLight = false;

        LIGHT_SPAN.forEach(hours => {
            let start   = hours[0];
            let end     = hours[1];
            if(hour > start && hour < end) {
                startLight = true;
            }
        });

        if(startLight) {
            light.open();
            console.log("light open");
        } else {
            light.close();
            console.log("light stop");
        }

    }, LIGHT_INTERVAL);
}

initDb = () => {
    db.defaults({ celsius: [] })
    .write()
}

let fan1;
let fan2;
let pump;

board.on("ready", () => {

  initDb();

  let thermometer = new five.Thermometer({
    controller: "DS18B20",
    pin: 2
  });

  //let light = new five.Relay(4);

  fan1  = new five.Relay(4);
  fan2  = new five.Relay(5);
  pump  = new five.Relay(6);

  handleFans([fan1, fan2], thermometer);
  //handlePump(pump);
  //handleLight(light);

});

board.on("exit", () => {
    fan1.open();
    fan2.open();
    pump.open();
});

server.start();
