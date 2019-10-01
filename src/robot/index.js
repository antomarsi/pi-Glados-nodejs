import ArmControl from './ArmControl';
import CameraHead from './CameraHead';
import { Router } from "express";

class Robot {

    constructor(socket, pigpio) {

        this.io = socket;
        this.gpio = pigpio.Gpio;
        this.arm = new ArmControl(this.gpio);
        this.camera = new CameraHead();
        this.fps = 1;
        this.robotInterval = Math.ceil(1000 / this.fps);
    }

    appRoutes() {
        const router = Router();
        router.get('/', (req, res) => {
            res.json({
                base: this.arm.ServoBase.GetAngle(),
                head: this.arm.ServoHead.GetAngle()
            });
        });
        router.get('/last-photo', (req, res) => {
            res.contentType('image/jpeg');
            res.end(this.camera.getLastFrameJpeg());
        });
        router.get('/detect', (req, res) => {
            this.camera.getFaceDetection()
                .then(img => {
                    res.contentType('image/jpeg');
                    res.end(img);
                })
                .catch(e => {
                    res.status(500);
                    res.json({ error: e });
                });
        })
        return router;
    }

    socketEvents() {
        this.io.on('connection', (socket) => {
        });
    }

    robotConfigRoutes() {
        this.socketEvents();
        return this.appRoutes();
    }

    process(robot) {
        robot.camera.getDistanceFromCenter();
    }

    run() {
        const _this = this;
        setInterval(() => this.process(_this), this.robotInterval);
    }
}

export default Robot;