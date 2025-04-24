import { useEffect, useState } from "react";
import axios from "axios";

// Material-UI Components
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Typography,
  Divider,
  Drawer,
  Toolbar,
  Paper,
  Avatar,
} from "@mui/material";

import ChatIcon from "@mui/icons-material/Chat"; // Chat icon

const SERVER_URL = "http://localhost:4000"; // Backend server URL

// Define fixed colors to assign to usernames
const usernameColors = [
  "#FFB6C1",
  "#ADD8E6",
  "#90EE90",
  "#FFD700",
  "#FFA07A",
  "#E0FFFF",
  "#D8BFD8",
  "#F0E68C",
  "#FFDEAD",
  "#F5DEB3",
  "#FF69B4",
  "#87CEFA",
  "#98FB98",
  "#DAA520",
  "#FF6347",
  "#AFEEEE",
  "#BA55D3",
  "#EEE8AA",
  "#FFA500",
  "#B0C4DE",
];

// Function to assign a consistent color to each username using a hash
const getUsernameColor = (username) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % usernameColors.length;
  return usernameColors[index];
};

export default function Home() {
  const [username, setUsername] = useState(""); // Store the current user's name
  const [entered, setEntered] = useState(false); // Tracks if user has joined
  const [users, setUsers] = useState([]); // List of connected users
  const [message, setMessage] = useState(""); // Message input
  const [messages, setMessages] = useState([]); // List of messages

  // Fetch messages and users every 2 seconds after joining
  useEffect(() => {
    if (entered) {
      const interval = setInterval(() => {
        axios
          .get(`${SERVER_URL}/messages`)
          .then((res) => setMessages(res.data)); // Update messages
        axios.get(`${SERVER_URL}/users`).then((res) => setUsers(res.data)); // Update users list
      }, 2000); // Poll every 2 seconds
      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [entered]);

  // Called when user clicks "Join Chat"
  const handleJoin = async () => {
    if (!username.trim()) return;
    await axios.post(`${SERVER_URL}/users`, { username });
    setEntered(true);
  };

  // Called when user clicks "Send" or presses Enter
  const handleSend = async () => {
    if (message.trim()) {
      await axios.post(`${SERVER_URL}/messages`, { username, text: message }); // Send message to backend
      setMessage(""); // Clear input
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        position: "relative",
        background: "linear-gradient(to bottom right, #0f0f0f, #1f1f1f)",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.03), transparent 60%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.03), transparent 60%)",
          zIndex: 0,
        },
      }}
    >
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 260,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 260,
            boxSizing: "border-box",
            bgcolor: "#1f1f1f",
            borderRight: "1px solid #2e2e2e",
          },
        }}
      >
        <Toolbar>
          <ChatIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Chat Room</Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: "auto", px: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ mt: 2, mb: 1, color: "#aaa", fontWeight: "bold" }}
          >
            Users Online
          </Typography>
          <Box
            sx={{
              background: "rgba(255, 255, 255, 0.04)",
              borderRadius: 2,
              p: 1,
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "inset 0 0 10px rgba(255,255,255,0.05)",
            }}
          >
            <List disablePadding>
              {users.map((u, i) => (
                <ListItem
                  key={i}
                  sx={{
                    px: 1,
                    py: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                    ":last-child": { borderBottom: "none" },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      fontSize: 14,
                      bgcolor: getUsernameColor(u),
                      color: "#000",
                    }}
                  >
                    {u[0].toUpperCase()}
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#eee",
                      fontWeight: "500",
                      flexGrow: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {u}{" "}
                    {u === username && (
                      <Typography
                        component="span"
                        sx={{ fontSize: "0.8rem", color: "#bbb" }}
                      >
                        (You)
                      </Typography>
                    )}
                  </Typography>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "limegreen",
                      boxShadow: "0 0 5px limegreen",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "transparent",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Toolbar />
        {!entered ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 5 }}>
            <TextField
              label="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleJoin} variant="contained">
              Join Chat
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" height="80vh">
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                mb: 2,
                p: 2,
                borderRadius: 4,
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              }}
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent:
                      msg.username === username ? "flex-end" : "flex-start",
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      bgcolor:
                        msg.username === username ? "#9c6eff" : "#2c2c2c",
                      color: "#fff",
                      borderRadius: 3,
                      maxWidth: "60%",
                      width: "fit-content",
                      boxShadow: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: "bold",
                        mb: 0.5,
                        color: getUsernameColor(msg.username),
                      }}
                    >
                      {msg.username}
                    </Typography>

                    <Box
                      sx={{ display: "inline-flex", alignItems: "flex-end" }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {msg.text}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "0.65rem",
                          color: "#ccc",
                          ml: "10px",
                          mb: "-6px",
                        }}
                      >
                        {new Date(msg.time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                variant="outlined"
                sx={{
                  bgcolor: "#2c2c2c",
                  borderRadius: 2,
                  input: { color: "#fff" },
                }}
              />
              <Button variant="contained" onClick={handleSend} sx={{ px: 4 }}>
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
