class Robot {

    constructor(app, socket, pigpio) {
        this.app = app;
        this.io = socket;
        this.gpio = pigpio.Gpio;
    }

    appRoutes() {
        
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