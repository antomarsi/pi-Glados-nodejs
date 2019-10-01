import detectWebcamFace from "../utils/WebcamDetect";
import opencvHelpers from "../utils/OpencvHelpers";
import { Router } from "express";

class Routes {

    constructor(socket) {
        this.io = socket;
    }

    appRoutes() {
        const router = Router();
        router.get('/', (request, response) => {
            res.json({message: 'Hello World'});
        });

        router.get('/detect-faces', (request, response) => {
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
        return router;
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
        this.socketEvents();
        return this.appRoutes();
    }
}

export default Routes;