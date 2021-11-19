import React, { useState, useEffect } from "react";
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, Text } from "@chakra-ui/react";
import { _get } from "../../../common/httpClient";

const AlertMessage = () => {
  const [messagesInfo, setMessagesInfo] = useState([]);
  const [messagesAlert, setMessagesAlert] = useState([]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const data = await _get("/api/v1/maintenanceMessage");
        const hasMessages = data.reduce((acc, item) => acc || item.enabled, false);
        if (hasMessages && mounted) {
          setMessagesAlert(data.filter((d) => d.type === "alert" && d.context === "manuel" && d.enabled));
          setMessagesInfo(data.filter((d) => d.type === "info" && d.enabled));
        }
      } catch (e) {
        console.error(e);
      }
    };
    run();

    return () => {
      // cleanup hook
      mounted = false;
    };
  }, []);

  if (messagesAlert.length === 0 && messagesInfo.length === 0) return null;
  return (
    <Box>
      {messagesAlert.length > 0 && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Alert : </AlertTitle>
          <AlertDescription>
            {messagesAlert.map((element) => element.enabled && <Text key={element._id}>{element.msg}</Text>)}
          </AlertDescription>
        </Alert>
      )}
      {messagesInfo.length > 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle mr={2}>Info : </AlertTitle>
          <AlertDescription>
            {messagesInfo.map((element) => element.enabled && <Text key={element._id}>{element.msg}</Text>)}
          </AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default AlertMessage;
