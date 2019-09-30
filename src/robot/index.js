class Robot {

    constructor(app, socket, pigpio) {
        this.app = app;
        this.io = socket;
        this.gpio = pigpio.Gpio;
    }

    appRoutes() {
        const led = new this.gpio(13, { mode: this.gpio.OUTPUT });
        let dutyCycle = 0;
        
        // setInterval(function() {
        //     led.pwmWrite(dutyCycle);
        
        //     dutyCycle += 50;
        //     if (dutyCycle > 255) {
        //         dutyCycle = 0;
        //     }
        // }, 500);
        
    }

    socketEvents() {
        /*this.io.on('connection', (socket) => {
            detectWebcamFace.startDetectFaces().then((buffers) => {
                this.io.emit('face', {
                    buffer: buffers
                });
            });
        });*/
    }

    robotConfig() {
        this.appRoutes();
        this.socketEvents();
    }
}

export default Robot;