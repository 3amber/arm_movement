import React, { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "./App.css";

//set commands to be recognized
const App = () => {
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
  
  const up = () => {
    console.log("up");
  };

  const down = () => {
    console.log("down");
  };

  const left = () => {
    console.log("left");
  };

  const right = () => {
    console.log("right");
  };

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


  // to chick if the browser support the speech recognition
  if (!browserSupportsSpeechRecognition) {
    return <span>Your Browser doesn't support speech recognition</span>;
  }

  // open Serial Port
  if ("serial" in navigator) {
  }

  return (
    <div>
      {!port ? (
        <button onClick={openSerialPort}>Open Serial Port</button>
      ) : (
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
          <button onClick={closeSerialPort}>Close Serial Port</button>
        </>
      )}
    </div>
  );
};
export default App;
