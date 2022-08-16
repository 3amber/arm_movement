/*
 * Server Side Code
 */

const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

require("dotenv").config();
const port = process.env["PORT"];
const local = process.env["CORSLOCAL"];

const index = require("./routes/index");
const app = express();

const events = require("events");
const eventEmitter = new events.EventEmitter();

app.use(index);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    // You may need to change this in .ENV if the client starts on a different port.
    origin: local,
    methods: ["GET", "POST"],
  },
  maxHttpBufferSize: 1e8,
});

const five = require("johnny-five");
const board = new five.Board({
  // port: "/dev/tty.usbserial-110",
  repl: false,
  timeout: 3600,
});

let interval;

// Init Socket.io.
io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }

  interval = setInterval(() => getApiAndEmit(socket), 1);

  socket.on("handleMovements", (arg) => {
    console.log(arg);
    if (arg.includes("")) return; // Check if values are empty.
    eventEmitter.emit("handleMovements", arg[0], arg[1], arg[2]);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
    socket.off("handleMovements", (arg) => {});
  });
});

// https://stackabuse.com/using-global-variables-in-node-js/
global.data = {};

const getData = () => {
  return global.data;
};

const setData = (joint, direction, position) => {
  global.data = {
    joint,
    direction,
    position,
  };
};

const getApiAndEmit = (socket) => {
  const data = getData();
  if (Object.keys(data).length === 0) return;
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromServer", data);
};

server.listen(port, () => console.log(`Listening on port ${port}`));

// Arduino Johnny 5.
board.on("ready", function () {
  // We can use this to build the whole robot and control
  // the whole joints.
  // @params {string} joint - The name of the joint.
  const base = new five.Servo({
    pin: 8,
    startAt: 90,
  });
  const shoulder = new five.Servo({
    pin: 9,
    startAt: 90,
  });
  
  // This is on standby.
  // const elbow = new five.Servo({
  //   pin: 10,
  //   startAt: 90,
  // });
  // const wrist = new five.Servo({
  //   pin: 11,
  //   startAt: 90,
  // });

  const toggleMovements = function (joint, direction, position) {
    console.log(`${joint} to ${direction} ${position}`);
    setData(joint, direction, position);
    switch (joint) {
      case "base":
        base.to(position);
        break;
      case "shoulder":
        shoulder.to(position);
        break;
      // case "elbow":
      //   // setElbow(direction, position);
      //   elbow.to(position);
      //   break;
      // case "wrist":
      //   // setWrist(direction, position);
      //   wrist.to(position);
      //   break;
      default:
        break;
    }
  };

  //Assign the event handler to an event:
  eventEmitter.on("handleMovements", (joint, direction, position) =>
    toggleMovements(joint, direction, position)
  );

  board.on("exit", () => {
    base.stop();
    shoulder.stop();
    // elbow.stop();
    // wrist.stop();
  });
});