import cv from "opencv4nodejs";

class CameraHead {
    constructor(webcamPort = 0, fps = 10) {
        this.webcamPort = webcamPort;
        this.camFps = fps;
        this.camInterval = Math.ceil(1000 / this.camFps)
        this.classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
        this.classifierOptions = {
            minSize: new cv.Size(100, 100),
            scaleFactor: 1.2,
            minNeighbors: 10
        };
        this.cap = new cv.VideoCapture(this.webcamPort);
        setInterval(() => {
            let frame = this.cap.read();
            if (frame.empty) {
                this.cap.reset();
                frame = this.cap.read();
            }
            this.lastFrame = frame;
        }, this.camInterval);
        console.log("Started CameraHead");
    }

    getLastFrameJpeg() {
        if (!this.lastFrame.empty) {
            return cv.imencode(".jpeg", this.lastFrame);
        }
        return null;
    }

    getFaceDetection() {
        return this.detectFaces(this.lastFrame).then((detection) => {
            let img = this.lastFrame;
            detection.faces.forEach(face => {
                img = this.drawFaceBorder(img, face);
            });
            return img;
        })
            .then(img => cv.imencode(".jpeg", img));
    }

    detectFaces(img) {
        return new Promise((resolve, reject) => {
            if (img.empty) {
                reject("No Photo");
            }
            img.bgrToGrayAsync()
                .then(grayImg => {
                    return this.classifier.detectMultiScaleAsync(grayImg)
                })
                .then((res) => {
                    if (res.objects.length > 0) {
                        if (this.timer) {
                            clearTimeout(this.timer);
                        }
                        this.lastFace = { faces: res.objects, count: res.numDetections };
                        resolve(this.lastFace);
                        const _this = this;
                        this.timer = setTimeout(() => _this.lastFace = null, 3000);
                    } else if (this.lastFace) {
                        resolve(this.lastFace);
                    } else {
                        reject("No face detected");
                    }
                });
        });
    }

    drawRect(image, rect, color) {
        console.log(image);
        image.drawRectangle(
            rect,
            color,
            2,
            cv.LINE_4
        );
        console.log(image);
        return image;
    }

    drawFaceBorder(image, rect) {
        return this.drawRect(image, rect, new cv.Vec(0, 255, 0));
    }

    getDistanceFromCenter() {
        //console.log(this.detectFaces(this.lastFrame));
    }
}

export default CameraHead;