import cv from "opencv4nodejs";
import OpencvHepers from "./OpencvHelpers";

class DetectWebcamFace {

    constructor() {
        this.webcamPort = 0;
    }

    detectFaces(img) {
        const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

        // restrict minSize and scaleFactor for faster processing
        const options = {
            minSize: new cv.Size(100, 100),
            scaleFactor: 1.2,
            minNeighbors: 10
        };
        return classifier.detectMultiScale(img.bgrToGray(), options).objects;
    }

    startDetectFaces() {
        return new Promise((resolve, reject) => {
            OpencvHepers.runVideoFaceDetection(this.webcamPort, this.detectFaces, (imageBuffers) => {
                resolve(imageBuffers);
            });
        })
    }
}