import { Excalidraw} from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { useState } from "react";
import useWebSocket from "react-use-websocket";
import {isEqual} from "lodash"

const Canvas = () => {
  const [canvasElements, setCanvasElements] = useState<string[] | any>()
  console.log(canvasElements);
  

  // ws connection
  const { sendJsonMessage } = useWebSocket("ws://localhost:5000", {
    onMessage: (e) => {
        try {
            const data = JSON.parse(e.data)
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }
  })

  // handle canvas change
  const handleChange = async (drawings: string[] | any) => {
    const drawingCopy = drawings.map((drawing: string[] | any) => ({
        ...drawing
    }))

    if (!isEqual(canvasElements, drawingCopy)) {
        setCanvasElements(drawingCopy)

        sendJsonMessage({
            type: "New drawings",
            data: canvasElements
        })
    }

  }


  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        initialData={{
          elements: canvasElements,
          appState: { theme: "dark" },
        }}
        onChange={handleChange}
      >
      </Excalidraw>
    </div>
  );
};

export default Canvas;
