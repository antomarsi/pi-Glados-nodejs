import http from "http";
import express from "express";
import bodyParser from "body-parser";
import socketio from "socket.io";
import path from "path";
import routes from "./routes";
import Robot from "./robot";

class Server {
  constructor() {
    this.port = process.env.PORT || 4000;
    this.host = `localhost`;
    if (process.env.NODE_ENV !== "production") {
      this.pigpio = require("pigpio-mock");
    } else {
      this.pigpio = require("pigpio");
    }
    this.app = express();
    this.http = http.Server(this.app);
    this.socket = socketio(this.http);
    this.robot = new Robot(this.socket, this.pigpio);
  }

  appConfig() {
    this.app.use(bodyParser.json());
    this.app.use(express.static(path.join("data")));
  }

  includeRoutes() {
    this.app.use("/api", new routes(this.socket).routesConfig());
    this.app.use("/robot", this.robot.robotConfigRoutes());
  }

  listen() {
    this.appConfig();
    this.includeRoutes();

    this.http.listen(this.port, this.host, () => {
      console.log(`Listening on http://${this.host}:${this.port}`);
      console.log("Starting Robot Process");
      this.robot.run();
    });
  }
}

export default new Server();
