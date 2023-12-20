import { useEffect, useState } from "react";
import { socket } from "@/util/socket";
import { Button, Space } from "antd";
import { useRouterStore } from "kl_router";
export default function DebugTerminal2() {
  const [isConnect, setIsConnected] = useState(false);
  const [fooEvents, setFooEvents] = useState([]);
  const routeData = useRouterStore();
  console.log("id:", routeData.match?.params["id"]);
  useEffect(() => {
    function onConnect() {
      console.log("socket connet");
      setIsConnected(true);
    }
    function onDisconnect() {
      console.log("socket disconnect");
      setIsConnected(false);
    }

    function onFooEvent(value) {
      console.log("event", value);
      setFooEvents((previous) => [...previous, value]);
    }
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("foo", onFooEvent);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("foo", onFooEvent);
    };
  }, []);
  return (
    <Space size="middle">
      <Button
        onClick={() => {
          console.log("sockect", socket);
          socket.connect();
        }}
      >
        连接
      </Button>
      <Button
        onClick={() => {
          socket.disconnect();
        }}
      >
        断开
      </Button>
    </Space>
  );
}
