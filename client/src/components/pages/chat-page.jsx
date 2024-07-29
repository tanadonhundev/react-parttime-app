import React, { useEffect, useRef, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import FiberManualRecord from "@mui/icons-material/FiberManualRecord";
import Grid from "@mui/material/Grid";

import dayjs from "dayjs";

import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { currentUser } from "../../services/auth";
import { profileUser } from "../../services/user";
import { findChats, findUserChats } from "../../services/chat";
import { createMessage, getMessage } from "../../services/message";
import { FindunreadMessage, unreadMessage } from "../../services/unreadMessage";

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
  const [unreadMessages, setUnreadMessages] = useState({});

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

  const scroll = useRef(null);

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
  }, [newMessage, socket, currentChatId, chats, userId]);

  useEffect(() => {
    if (socket === null) return;

    // Listen for incoming messages
    socket.on("getMessage", (message) => {
      // If the message is for the current chat, add it to the chat window
      if (currentChatId === message.chatId) {
        setMessages((prevMessages) => [...prevMessages, message]);
        scroll.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        // If the message is for another chat, update the unread messages count
        setUnreadMessages((prev) => ({
          ...prev,
          [message.chatId]: (prev[message.chatId] || 0) + 1,
        }));
      }
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

  const handleClick = async (chatId, index) => {
    try {
      setMessageText("");
      setCurrentChatId(chatId);
      setIndexMsg(index);

      // Reset unread count in the database
      await unreadMessage({ chatId, userId, count: 0 });

      // Update unread message count in local state
      setUnreadMessages((prev) => ({
        ...prev,
        [chatId]: 0,
      }));

      // Fetch new messages
      const res = await getMessage(chatId);
      setMessages(res.data);

      // Navigate to the chat page
      navigate({
        pathname: "/dashboard-employee/chat",
        search: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        // Fetch unread messages using FindunreadMessage
        const response = await FindunreadMessage(userId);
        // Convert data into a map of chatId to unread count
        const unreadMap = response.data.reduce((acc, item) => {
          acc[item.chatId] = item.count;
          return acc;
        }, {});

        // Update state with the unread messages
        setUnreadMessages(unreadMap);
      } catch (error) {
        console.error("Error fetching unread messages:", error);
      }
    };

    // Fetch unread messages when userId changes
    fetchUnreadMessages();
  }, [userId]); // Dependency array ensures effect runs when userId changes

  useEffect(() => {
    if (socket === null) return;

    const handleMessage = async (message) => {
      try {
        if (currentChatId === message.chatId) {
          // ข้อความนี้อยู่ในแชทที่กำลังเปิดอยู่
          setMessages((prevMessages) => {
            const isDuplicate = prevMessages.some(
              (msg) => msg._id === message._id
            );
            if (isDuplicate) {
              return prevMessages;
            }
            return [...prevMessages, message];
          });
          scroll.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          // ข้อความนี้เป็นของแชทอื่น
          setUnreadMessages((prev) => {
            const newCount = prev[message.chatId] || 0;

            // อัปเดตจำนวนข้อความที่ยังไม่ได้อ่านในฐานข้อมูล
            unreadMessage({ chatId: message.chatId, userId, count: newCount })
              .then(() => console.log("Unread count updated"))
              .catch((error) =>
                console.error("Error updating unread count:", error)
              );

            return { ...prev, [message.chatId]: newCount };
          });
        }
      } catch (error) {
        console.error("Error handling message:", error);
      }
    };

    socket.on("getMessage", handleMessage);

    return () => {
      socket.off("getMessage", handleMessage);
    };
  }, [socket, currentChatId, userId]);

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

          // ตรวจสอบผู้รับข้อความ
          const receiverId = chats
            .find((chat) => chat._id === currentChatId)
            ?.members.find((id) => id !== userId);

          if (
            receiverId &&
            !onlineUsers.some((user) => user.userId === receiverId)
          ) {
            // ถ้าผู้รับไม่ได้ออนไลน์ อัปเดตจำนวนข้อความที่ยังไม่ได้อ่าน
            unreadMessage({
              chatId: currentChatId,
              userId: receiverId,
              count: (unreadMessages[currentChatId] || 0) + 1,
            })
              .then(() => {
                setUnreadMessages((prev) => ({
                  ...prev,
                  [currentChatId]: (prev[currentChatId] || 0) + 1,
                }));
              })
              .catch((error) =>
                console.error("Error updating unread count:", error)
              );
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <Grid container spacing={2} sx={{ marginTop: 4 }}>
      <Grid item xs={12} sm={12} lg={4} md={4}>
        <Paper sx={{ padding: 2, height: "100%" }}>
          {loading ? (
            <Stack alignItems={"center"}>
              <CircularProgress />
              <Typography>กำลังโหลดข้อมูล</Typography>
            </Stack>
          ) : (
            <>
              <Stack
                direction="column"
                justifyContent="center"
                spacing={1}
                sx={{ marginBottom: 2 }}
              >
                {chats.map((chat, index) => {
                  const unreadCount = unreadMessages[chat._id] || 0;
                  const isOnline = onlineUsers.some(
                    (user) => user.userId === data[index]?.data._id
                  );
                  const avatarSrc = `${baseURL}/uploads/avatar/${data[index]?.data.avatarphoto}`;
                  const displayName =
                    data[index]?.data.role === "owner"
                      ? `${data[index]?.data.firstName} ${data[index]?.data.lastName} (${data[index]?.data.role} - ${data[index]?.data.companyName})`
                      : `${data[index]?.data.firstName} ${data[index]?.data.lastName} (${data[index]?.data.role})`;

                  return (
                    <Paper key={chat._id} sx={{ marginBottom: 1 }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={1}
                        sx={{
                          width: "100%",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          bgcolor: "lavender",
                        }}
                      >
                        <Typography
                          variant="contained"
                          onClick={() => handleClick(chat._id, index)}
                          sx={{
                            flex: 1,
                            padding: 1,
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            textTransform: "none",
                          }}
                        >
                          <Badge
                            overlap="circular"
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "right",
                            }}
                            badgeContent={
                              isOnline ? (
                                <FiberManualRecord
                                  sx={{ fontSize: 10, color: "success.main" }}
                                />
                              ) : (
                                <FiberManualRecord
                                  sx={{ fontSize: 10, color: "error.main" }}
                                />
                              )
                            }
                          >
                            <Avatar
                              sx={{ width: 40, height: 40, marginRight: 1 }}
                              alt="User Avatar"
                              src={avatarSrc}
                            />
                          </Badge>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{ flex: 1, alignItems: "center" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "14px", flex: 1 }}
                            >
                              {displayName}
                            </Typography>
                            <Badge
                              badgeContent={unreadCount}
                              color="primary"
                              invisible={unreadCount === 0}
                              sx={{ marginLeft: 1 }}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <MailIcon color="action" />
                            </Badge>
                          </Stack>
                        </Typography>
                      </Stack>
                    </Paper>
                  );
                })}
              </Stack>
            </>
          )}
        </Paper>
      </Grid>
      <Grid item xs={12} sm={12} lg={8} md={8}>
        <Paper sx={{ padding: 2, height: "100%" }}>
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
                    <span>
                      {data[indexMsg]?.data.firstName}{" "}
                      {data[indexMsg]?.data.lastName}(
                      {data[indexMsg]?.data.role} -{" "}
                      {data[indexMsg]?.data.companyName})
                    </span>
                  ) : (
                    <span>
                      {data[indexMsg]?.data.firstName}{" "}
                      {data[indexMsg]?.data.lastName}
                      {data[indexMsg]?.data.role &&
                        ` (${data[indexMsg]?.data.role})`}
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
                        <Paper
                          sx={{
                            backgroundColor:
                              message?.senderId === userId
                                ? "lightblue"
                                : "lightgreen",
                            padding: 1,
                          }}
                        >
                          <Typography variant="body1">
                            {message?.text}
                          </Typography>
                        </Paper>
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
                        <div ref={scroll} />
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
      </Grid>
    </Grid>
  );
}
