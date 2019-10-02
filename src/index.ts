import * as cv from "opencv4nodejs";

const devicePort = 0;
const wCap = new cv.VideoCapture(devicePort);

const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);
const fps = 1;
const fpsInterval = 1000 / fps;

const drawRect = (
  image: cv.Mat,
  rect: cv.Rect,
  color: cv.Vec3,
  thickness = 2
) => {
  image.drawRectangle(rect, color, thickness, cv.LINE_4);
};

const drawAllFaces = (
  image: cv.Mat,
  objects: cv.Rect[],
  numDetections: number[],
  numDetectionsTh = 10
) => {
  objects.forEach((rect, i) => {
    const thickness = numDetections[i] < numDetectionsTh ? 1 : 2;
    drawRect(image, rect, new cv.Vec3(0, 255, 0), thickness);
  });
  return image;
};

let done = false;
const delay = 10;
while (!done) {
  let frame = wCap.read();
  if (frame.empty) {
    wCap.reset();
    frame = wCap.read();
  }
  let imgGrey = frame.bgrToGray();
  let res = classifier.detectMultiScale(imgGrey);
  let img = drawAllFaces(frame, res.objects, res.numDetections);
  cv.imshow("Faces", img);
  const key = cv.waitKey(delay);
  done = key === 81;
}
