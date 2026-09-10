import datadogLogger from "@marketing/logger/datadogLogger";
import type { NotificationType } from "@ruby-ai/sparkle";
import { useSendNotification as useSendNotificationWithoutLogging } from "@ruby-ai/sparkle";
import { useCallback } from "react";

export const useSendNotification = (disableLogging: boolean = false) => {
  const sendNotification = useSendNotificationWithoutLogging();

  return useCallback(
    (notification: NotificationType) => {
      if (notification.type === "error" && !disableLogging) {
        datadogLogger.info(`UI error notification: ${notification.title}`, {
          notification,
        });
      }
      sendNotification(notification);
    },
    [disableLogging, sendNotification]
  );
};
