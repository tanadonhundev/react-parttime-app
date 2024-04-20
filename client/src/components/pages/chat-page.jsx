import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import dayjs from "dayjs";

import { io } from "socket.io-client";
import { currentUser } from "../../services/auth";
import { profileUser } from "../../services/user";
import { findUserChats } from "../../services/chat";
import { createMessage, getMessage } from "../../services/message";

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState("");
  const [messageText, setMessageText] = useState("");
  const [currentChatId, setCurrentChatId] = useState("");
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [indexMsg, setIndexMsg] = useState("");

  const baseURL = import.meta.env.VITE_API;
  const socketURL = import.meta.env.VITE_API_SOCKET;

  //console.log("onlineUsers", onlineUsers);

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        setUserId(res.data._id);
        //console.log(id);
        findUserChats(id)
          .then((res) => {
            //console.log(res.data);
            setChats(res.data);
            setLoading(false);
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchProfile = async () => {
      if (chats.length > 0) {
        const profileId = chats.map((chat) => {
          if (chat.members[0] === userId) {
            return chat.members[1];
          } else {
            return chat.members[0];
          }
        });
        try {
          const profiles = await Promise.all(
            profileId.map((id) => profileUser(token, id))
          );
          setData(profiles);
        } catch (error) {
          console.error("Error fetching profiles:", error);
        }
      }
    };

    fetchProfile();
  }, [chats, userId]);

  useEffect(() => {
    const newSocket = io(socketURL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  // add online user
  useEffect(() => {
    //console.log(userId);
    if (socket === null) return;
    socket.emit("addNewUser", userId);
    socket.on("getOnlineUsers", (res) => {
      console.log(res[0].userId);
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null || !newMessage || !currentChatId) return;

    const receiverId = chats
      .find((chat) => chat._id === currentChatId)
      ?.members.find((id) => id !== userId);
    if (!receiverId) return;

    socket.emit("sendMessage", { ...newMessage, receiverId });
  }, [newMessage]);

  //receive message
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      console.log(res);
      if (currentChatId?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res.data]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChatId]);

  const handleClick = (chatId, index) => {
    setMessageText("");
    //console.log(chatId);
    setCurrentChatId(chatId);
    setIndexMsg(index);
    getMessage(chatId)
      .then((res) => {
        setMessages(res.data);
        //console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const handleSendMessage = () => {
    if (messageText.trim() !== "") {
      const messageData = {
        chatId: currentChatId,
        senderId: userId,
        text: messageText,
      };

      createMessage(messageData)
        .then((res) => {
          setMessages((prevMessages) => [...prevMessages, res.data]); // Add the new message to the messages array
          setNewMessage(res);
          setMessageText(""); // Clear the message text field
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Stack direction="row" spacing={4} sx={{ marginTop: 4 }}>
      <div className="chat-box" style={{ flex: 1 }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography>เลือกคนที่จะพูดคุยกับคุณ</Typography>
            <Stack direction={"row"} spacing={0.5}>
              {chats.map((chat, index) => (
                <Button
                  variant="contained"
                  color={
                    onlineUsers.some(
                      (user) => user.userId === data[index]?.data._id
                    )
                      ? "success"
                      : "error"
                  }
                  key={chat._id}
                  onClick={() => handleClick(chat._id, index)}
                  sx={{ marginBottom: 1 }}
                >
                  <Typography variant="body1" sx={{ fontSize: "14px" }}>
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,
                        margin: "auto",
                      }}
                      alt="Remy Sharp"
                      src={`${baseURL}/uploads/avatar/${data[index]?.data.avatarphoto}`}
                    />
                    {data[index]?.data.role === "owner" ? (
                      <span>{data[index]?.data.companyName}</span>
                    ) : (
                      <>{data[index]?.data.firstName}</>
                    )}
                  </Typography>
                </Button>
              ))}
            </Stack>
          </>
        )}
        {currentChatId ? (
          <>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">
                Chat Room{" "}
                {data[indexMsg]?.data.role === "owner" ? (
                  <span>{data[indexMsg]?.data.companyName}</span>
                ) : (
                  <span>
                    {data[indexMsg]?.data.firstName}{" "}
                    {data[indexMsg]?.data.lastName}
                  </span>
                )}
              </Typography>
              <Paper sx={{ padding: 2, backgroundColor: "#f0f0f0" }}>
                {messages.map((message, index) => (
                  <Stack
                    key={index}
                    className={`message-container ${
                      message.senderId === userId ? "message-right" : ""
                    }`}
                    direction="row"
                    justifyContent={
                      message.senderId === userId ? "flex-end" : "flex-start"
                    }
                    sx={{ marginBottom: 1 }}
                  >
                    <Stack justifyContent={"flex-end"}>
                      <Typography variant="body1">{message.text}</Typography>
                      <Typography variant="caption">
                        {dayjs(message.createdAt).format("DD/MM/YYYY") ===
                        dayjs().format("DD/MM/YYYY")
                          ? `Today at ${dayjs(message.createdAt).format(
                              "HH:mm"
                            )}`
                          : dayjs(message.createdAt).format("DD/MM/YYYY HH:mm")}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Paper>
              <br />
              <TextField
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                label="Type your message"
                variant="outlined"
                fullWidth
                disabled={!currentChatId}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                sx={{ marginBottom: 1 }}
              />
              <Stack direction={"row"} justifyContent={"flex-end"}>
                <Button
                  onClick={handleSendMessage}
                  variant="contained"
                  color="primary"
                  disabled={!currentChatId}
                >
                  Send
                </Button>
              </Stack>
            </Paper>
          </>
        ) : (
          <></>
        )}
      </div>
    </Stack>
  );
}
