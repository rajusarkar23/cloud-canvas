import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

import { useEffect, useState } from "react";
import useWebSocket from "react-use-websocket";
import { isEqual } from "lodash";
import { useNavigate, useParams } from "react-router";
import { BACKEND_URI } from "@/utils/config";
import { Loader } from "lucide-react";
import { useCloudCanvasUserStore } from "@/store/user_store";
import Cookies from "js-cookie";

const Canvas = () => {
  const [canvasElements, setCanvasElements] = useState<string[] | any>();
  const [loading, setLoading] = useState(false);
  const params = useParams();

  const cookie = Cookies.get("canvas_cloud_auth");
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !useCloudCanvasUserStore.getState().isUserAuthenticated &&
      typeof cookie !== "string" &&
      typeof useCloudCanvasUserStore.getState().userName !== "string"
    ) {
      navigate("/signin");
    }

    (async () => {
      setLoading(true);
      const sendReq = await fetch(
        `${BACKEND_URI}/api/v1/canvas/fetch?canvasId=${params.id}`,
        {
          method: "PUT",
        }
      );

      const res = await sendReq.json();

      if (res.success) {
        setCanvasElements(res.canvasElements.canvasElements);
        setLoading(false);
      }
    })();
  }, [params.id]);

  // ws connection for render
  const { sendJsonMessage } = useWebSocket(`wss://cloud-canvas.onrender.com`, {
    onMessage: (e) => {
      try {
        const data = JSON.parse(e.data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  // for local

  // handle canvas change
  const handleChange = async (drawings: string[] | any) => {
    const drawingCopy = drawings.map((drawing: string[] | any) => ({
      ...drawing,
    }));

    if (!isEqual(canvasElements, drawingCopy)) {
      setCanvasElements(drawingCopy);

      sendJsonMessage({
        type: "New drawings",
        data: drawingCopy,
        canvasId: params.id,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[30vh]">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Excalidraw
        initialData={{
          elements: canvasElements,
          appState: { theme: "dark" },
        }}
        onChange={handleChange}
      ></Excalidraw>
    </div>
  );
};

export default Canvas;
