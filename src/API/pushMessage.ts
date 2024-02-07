import axios from "axios";
import * as dotenv from "dotenv";
import pg from "pg";
import { getListToday, getWaitApprove } from "./leaveScheduleAPI";
import { getNotApproveHHLists } from "./hhAPI";

// Setup
dotenv.config();
const pool = new pg.Pool();

export async function pushMessage() {
  const LINE_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN || "";
  const GROUP_ID = process.env.GROUP_ID || "";

  // Line Messaging API endpoint
  const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

  // Create an Axios instance with the Line API headers
  const axiosInstance = axios.create({
    baseURL: LINE_API_URL,
    headers: {
      Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  const listToday = await getListToday(pool);

  // Define the message you want to send
  const message1 = {
    type: "text",
    text: "☀️ สวัสดียามเช้าที่สดใส ☀️\n\n" + listToday,
  };

  // Create the payload for the request
  const payload1 = {
    to: GROUP_ID,
    messages: [message1],
  };

  // Send the message to the Line Group
  axiosInstance
    .post("", payload1)
    .then((response) => {
      console.log("Message sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });

  // =======================================
  // =======================================
  // =======================================

  const waitApprove = await getWaitApprove(pool);

  // Define the message you want to send
  const message2 = {
    type: "text",
    text: waitApprove,
  };

  // Create the payload for the request
  const payload2 = {
    to: GROUP_ID,
    messages: [message2],
  };

  // Send the message to the Line Group
  axiosInstance
    .post("", payload2)
    .then((response) => {
      console.log("Message sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });

  // =======================================
  // =======================================
  // =======================================

  const notApproveHHLists = await getNotApproveHHLists(pool);

  if (notApproveHHLists.length > 0) {
    const waitApproveHh =
      "❤️ HH ที่นังรอ Approve\n\n" +
      notApproveHHLists
        .map((hh) => {
          return `🙅‍♂️ <${hh.id}> ${hh.member} ${hh.hours}h ${
            hh.description == null || hh.description == ""
              ? ""
              : `(${hh.description})`
          }`;
        })
        .join("\n");

    // Define the message you want to send
    const message3 = {
      type: "text",
      text: waitApproveHh,
    };

    // Create the payload for the request
    const payload3 = {
      to: GROUP_ID,
      messages: [message3],
    };

    // Send the message to the Line Group
    axiosInstance
      .post("", payload3)
      .then((response) => {
        console.log("Message sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  }
}

export async function pushSingleMessage(message: string) {
  const LINE_ACCESS_TOKEN = process.env.CHANNEL_ACCESS_TOKEN || "";
  const GROUP_ID = process.env.GROUP_ID || "";

  // Line Messaging API endpoint
  const LINE_API_URL = "https://api.line.me/v2/bot/message/push";

  // Create an Axios instance with the Line API headers
  const axiosInstance = axios.create({
    baseURL: LINE_API_URL,
    headers: {
      Authorization: `Bearer ${LINE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  // Define the message you want to send
  const message1 = {
    type: "text",
    text: message,
  };

  // Create the payload for the request
  const payload1 = {
    to: GROUP_ID,
    messages: [message1],
  };

  // Send the message to the Line Group
  axiosInstance
    .post("", payload1)
    .then((response) => {
      console.log("Message sent successfully:", response.data);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}
