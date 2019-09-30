import detectWebcamFace from "../utils/WebcamDetect";
import opencvHelpers from "../utils/OpencvHelpers";

class Routes {

    constructor(app, socket) {
        this.app = app;
        this.io = socket;
    }

    appRoutes() {
        this.app.get('/', (request, response) => {
            res.json({message: 'Hello World'});
        });

        this.app.get('/detect-faces', (request, response) => {
            opencvHelpers.detectFace()
                .then((result) => {
                    response.statusCode = 200;
                    response.send(result);
                    response.end();
                }).catch((err) => {
                    response.statusCode = 500;
                    response.send(null);
                    response.end();
                });
        });
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
            detectWebcamFace.startDetectFaces().then((buffers) => {
                this.io.emit('face', {
                    buffer: buffers
                });
            });
        });
    }

    routesConfig() {
        this.appRoutes();
        this.socketEvents();
    }
}

export default Routes;