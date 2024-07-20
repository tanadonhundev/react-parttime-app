import React, { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";

import dayjs from "dayjs";

import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { currentUser } from "../../services/auth";
import { profileUser } from "../../services/user";
import { findChats, findUserChats } from "../../services/chat";
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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const employeeId = queryParams.get("employeeId");
  const companyId = queryParams.get("companyId");
  const nameCompany = queryParams.get("nameCompany");
  const employeeFirstName = queryParams.get("employeeFirstName");
  const employeeLastName = queryParams.get("employeeLastName");
  const navigate = useNavigate();

  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    currentUser(token)
      .then((res) => {
        const id = res.data._id;
        setUserId(res.data._id);
        findUserChats(id)
          .then((res) => {
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

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", userId);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    if (socket === null || !newMessage || !currentChatId) return;

    const receiverId = chats
      .find((chat) => chat._id === currentChatId)
      ?.members.find((id) => id !== userId);
    if (!receiverId) return;

    socket.emit("sendMessage", { ...newMessage, receiverId });
  }, [newMessage]);

  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChatId !== res.chatId) return;
      setMessages((prev) => [...prev, res.data]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, [socket, currentChatId]);

  useEffect(() => {
    handleFindChat(employeeId, companyId);
  }, [employeeId, companyId]);

  const handleFindChat = (employeeId, companyId) => {
    if (employeeId && companyId) {
      findChats(employeeId, companyId)
        .then((res) => {
          setCurrentChatId(res.data[0]._id);
          getMessage(res.data[0]._id)
            .then((res) => {
              setMessages(res.data);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      console.error("Employee ID or Company ID is not defined.");
    }
  };

  const handleClick = (chatId, index) => {
    setMessageText("");
    setCurrentChatId(chatId);
    setIndexMsg(index);
    getMessage(chatId)
      .then((res) => {
        setMessages(res.data);
        navigate({
          pathname: "/dashboard-employee/chat",
          search: "",
        });
      })
      .catch((error) => console.log(error));
  };

  const handleSendMessage = () => {
    if (messageText.trim() !== "" && currentChatId) {
      const messageData = {
        chatId: currentChatId,
        senderId: userId,
        text: messageText,
      };

      createMessage(messageData)
        .then((res) => {
          setMessages((prevMessages) => [...prevMessages, res.data]);
          setNewMessage(res.data);
          setMessageText("");
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Stack direction="row" spacing={4} sx={{ marginTop: 4 }}>
      <Paper sx={{ flex: 1, padding: 2 }}>
        {loading ? (
          <Stack alignItems={"center"}>
            <CircularProgress />
            <Typography>กำลังโหลดข้อมูลข้อมูล</Typography>
          </Stack>
        ) : (
          <>
            <Typography>เลือกคนที่จะพูดคุยกับคุณ</Typography>
            <Stack direction={"row"} spacing={0.5} sx={{ marginBottom: 1 }}>
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
      </Paper>

      <Paper sx={{ flex: 2, padding: 2 }}>
        {currentChatId ? (
          <>
            <Stack direction={"row"} spacing={1} alignItems="center">
              <Typography variant="h5">Chat Room</Typography>
              <Typography variant="h6">คุณกำลังพูดคุยอยู่กับ</Typography>
              <Stack direction={"row"} spacing={1}>
                {nameCompany && <span>{nameCompany}</span>}
                {employeeFirstName && <span>{employeeFirstName}</span>}
                {employeeLastName && <span>{employeeLastName}</span>}
                {data[indexMsg]?.data.role === "owner" ? (
                  <span>{data[indexMsg]?.data.companyName}</span>
                ) : (
                  <span>
                    {data[indexMsg]?.data.firstName}{" "}
                    {data[indexMsg]?.data.lastName}
                  </span>
                )}
              </Stack>
            </Stack>

            <div className="chat-box" style={{ flex: 1, marginTop: 2 }}>
              <Paper
                ref={scroll}
                sx={{
                  padding: 2,
                  backgroundColor: "#f0f0f0",
                  width: "100%",
                  maxHeight: "400px",
                  overflowY: "auto",
                }}
              >
                {messages.map((message, index) => (
                  <Stack
                    key={index}
                    className={`message-container ${
                      message?.senderId === userId ? "message-right" : ""
                    }`}
                    direction="row"
                    justifyContent={
                      message?.senderId === userId ? "flex-end" : "flex-start"
                    }
                    sx={{ marginBottom: 1 }}
                  >
                    <Stack justifyContent={"flex-end"}>
                      <Typography variant="body1">{message?.text}</Typography>
                      <Typography variant="caption">
                        {dayjs(message?.createdAt).format("DD/MM/YYYY") ===
                        dayjs().format("DD/MM/YYYY")
                          ? `Today at ${dayjs(message?.createdAt).format(
                              "HH:mm"
                            )}`
                          : dayjs(message?.createdAt).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Paper>
            </div>

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
              sx={{ marginTop: 2 }}
            />
            <Stack
              direction={"row"}
              justifyContent={"flex-end"}
              sx={{ marginTop: 1 }}
            >
              <Button
                onClick={handleSendMessage}
                variant="contained"
                color="primary"
                disabled={!currentChatId}
              >
                Send
              </Button>
            </Stack>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            กรุณาเลือกผู้ใช้งานเพื่อเริ่มการสนทนา
          </Typography>
        )}
      </Paper>
    </Stack>
  );
}
