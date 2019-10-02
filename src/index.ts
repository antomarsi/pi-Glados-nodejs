import * as cv from 'opencv4nodejs';

const devicePort = 0;
const wCap = new cv.VideoCapture(devicePort);

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const fps = 15;
const fpsInterval = 1000 / fps;

const drawRect = (
  image: cv.Mat,
  rect: cv.Rect,
  color: cv.Vec3,
  thickness = 2
) => {
  image.drawRectangle(rect, color, thickness, cv.LINE_4);
};

const drawAllFaces = (image: cv.Mat, numDetectionsTh = 10) => {
  return image
    .bgrToGrayAsync()
    .then(grayImg => classifier.detectMultiScaleAsync(grayImg))
    .then(({ objects, numDetections }) => {
      objects.forEach((rect, i) => {
        const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
        drawRect(image, rect, new cv.Vec3(0, 255, 0), thickness);
      });
      return image;
    });
};

setInterval(() => {
  if (wCap)
    wCap
      .readAsync()
      .then(img => drawAllFaces(img))
      .then(img => cv.imshow("Faces", img));
}, fpsInterval);
