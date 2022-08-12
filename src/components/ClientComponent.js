/*
*Client side code
*/

import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

require("dotenv").config();

export default function ClientComponent() {
    const [changedMovements, toggleMovement] = useState(["", "", ""]);
    const [movement, setMovement] = useState(["x", "y", "z"]);
    const Endpoint = process.env.REACT_APP_ENDPOINT;

    useEffect(() => {
        const socket = socketIOClient(Endpoint);

        socket.emit("handleMovements", "changeMovements");
        socket.on("FromServer", (data) => {
            if(Object.keys(data).length === 0) return;
            setMovement(Object.entries(data));
        });
    } , [Endpoint, changedMovements]);

    function handleMovements(joint, direction, position) {
        toggleMovement([joint, direction, position]);
    }

//set commands to be recognized
  const commands = [
    {
      command: "reset",
      callback: () => resetTranscript(),
    },
    {
      command: "up",
      callback: () => up(),
    },
    {
      command: "down",
      callback: () => down(),
    },
    {
      command: "left",
      callback: () => left(),
    },
    {
      command: "right",
      callback: () => right(),
    },
    {
      command: "فوق",
      callback: () => up(),
    },
    {
      command: "تحت",
      callback: () => down(),
    },
    {
      command: "يسار",
      callback: () => left(),
    },
    {
      command: "يمين",
      callback: () => right(),
    },
    {
      command: "مسح",
      callback: () => resetTranscript(),
    },
  ];

  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
  } = useSpeechRecognition({ commands });

    const up = () => {
      handleMovements("base","up", "0");
    };    
    const down = () => {
        handleMovements("base","down", "0");
    };
    const left = () => {
        handleMovements("base","left", "0");
    };
    const right = () => {
        handleMovements("base","right", "0");
    };

    
    /* The part is closed because it's not necessary anymore while using johnny-five
    * But I left it to show how Web Serial API Works...
    * The main issue if we left it open is that we need to use the same port as the arduino
    * and the arduino needs to be connected to johnny-five
    * so It will cause a conflict if we use the same port for both
    /*
    const [port, setPort] = useState(0);
    const openSerialPort = async () => {
        const port = await navigator.serial.requestPort();
        await port.open({
            baudRate: 11520,
        });
  setPort(port);
};
const closeSerialPort = async () => {
    await port.close();
    setPort(0);
};
*/

//Using start Listening and Adding the language
    const startListeningEn = () => {
        SpeechRecognition.startListening({
            continuous: true,
            language: "en-US",
        });
    };

    const startListeningAr = () => {
        SpeechRecognition.startListening({
        continuous: true,
        language: "ar-SA",
        });
    };

  // to chick if the browser support the speech recognition
  if (!browserSupportsSpeechRecognition) {
    return <span>Your Browser doesn't support speech recognition</span>;
  }

  //check if the serial port is supported
  if ("serial" in navigator) {

  }

  return (
    <div>
        {/*this is not necessary */}
      {/*{!port ? (
        <button onClick={openSerialPort}>Open Serial Port</button>
      ) : (*/}
        <>
          <p> Microphone: {listening ? "on" : "off"} </p>
          <p>
            voice commands: {""}
            {commands.map((c) => c.command + " , ")}
          </p>
          <button
            onMouseDown={startListeningEn}
            onMouseUp={SpeechRecognition.stopListening}
          >
            Hold to talk in English
          </button>
          <button
            onMouseDown={startListeningAr}
            onMouseUp={SpeechRecognition.stopListening}
          >
            اضغط مطولاً للتحدث بالعربية
          </button>
          <button
            onClick={() => {
              resetTranscript();
            }}
          >
            Clear/مسح
          </button>
          <p> {transcript} </p>
          <p className="robotMovement">
            {movement.map(([key, val]) => (
                <span key={key}>
                    <br />
                    {key}: {val}
                    </span>
            ))}
          </p>
          {/*<button onClick={closeSerialPort}>Close Serial Port</button>*/}
        </>
      {/*)}*/}
    </div>
  );
}