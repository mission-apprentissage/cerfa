import React, { useState, useEffect } from "react";
import { Box, Alert, AlertIcon, AlertTitle, AlertDescription, Text, Link } from "@chakra-ui/react";
import { _get } from "../../../common/httpClient";

const replaceLinks = (str: string) => {
  const regex = /(\[(.*?)\])(\((.*?)\))/gim;
  let m = regex.exec(str);

  if (!m) {
    return [str];
  }
  try {
    const parseResults = [];
    let currentPos = 0;
    while (m !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        // eslint-disable-next-line no-plusplus
        regex.lastIndex++;
      }

      parseResults.push(str.substring(currentPos, m.index));
      parseResults.push({
        linkText: m[2],
        href: m[4],
      });
      currentPos = m.index + m[0].length;

      m = regex.exec(str);
    }
    if (currentPos < str.length) {
      parseResults.push(str.substring(currentPos, str.length));
    }
    return parseResults;
  } catch (error) {
    return [str];
  }
};

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
          <AlertTitle mr={2}>Alerte : </AlertTitle>
          <AlertDescription>
            {messagesAlert.map((element) => {
              if (!element.enabled) return null;
              return (
                <Text key={element._id}>
                  {replaceLinks(element.msg).map((part, i) => {
                    return typeof part === "string" ? (
                      <Text as="span" key={i}>
                        {part}
                      </Text>
                    ) : (
                      <Link href={part.href} fontSize="md" key={i} textDecoration={"underline"} isExternal>
                        {part.linkText}
                      </Link>
                    );
                  })}
                </Text>
              );
            })}
          </AlertDescription>
        </Alert>
      )}
      {messagesInfo.length > 0 && (
        <Alert status="info">
          <AlertIcon />
          <AlertTitle mr={2}>Info : </AlertTitle>
          <AlertDescription>
            {messagesInfo.map((element) => {
              if (!element.enabled) return null;
              return (
                <Text key={element._id}>
                  {replaceLinks(element.msg).map((part, i) => {
                    return typeof part === "string" ? (
                      <Text as="span" key={i}>
                        {part}
                      </Text>
                    ) : (
                      <Link href={part.href} fontSize="md" key={i} textDecoration={"underline"} isExternal>
                        {part.linkText}
                      </Link>
                    );
                  })}
                </Text>
              );
            })}
          </AlertDescription>
        </Alert>
      )}
    </Box>
  );
};

export default AlertMessage;
