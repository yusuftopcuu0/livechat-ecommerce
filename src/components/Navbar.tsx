import { Link as RouterLink, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  IconButton,
  Tooltip,
  Container,
  Badge,
  TextField,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ChatIcon from "@mui/icons-material/Chat";

type Message = {
  id: string;
  text: string;
  sender: string;
  createdAt: Timestamp;
};

const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [chatOpen, setChatOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  // Firestore'dan mesajları dinle
  useEffect(() => {
    const q = query(
      collection(db, "chats/chat1/messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Message)
      );
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "chats/chat1/messages"), {
      text: input,
      sender: "user",
      createdAt: serverTimestamp(),
    });

    setInput("");
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddToCart = () => {
    setCartCount(cartCount + 1);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Successfully logged out");
      navigate("/login");
      handleClose();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to logout");
    }
  };

  return (
    <>
      <AppBar color="default" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            <Toolbar
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">E-Shop</Typography>

              <Box>
                <IconButton
                  color="inherit"
                  onClick={() => setChatOpen(!chatOpen)}
                >
                  <ChatIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handleAddToCart}>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Box>
            </Toolbar>

            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              LiveChat
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {currentUser ? (
                <>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ display: { xs: "none", sm: "block" } }}
                    >
                      Welcome, {currentUser.displayName || "User"}!
                    </Typography>
                    <Tooltip title="Account settings">
                      <IconButton
                        onClick={handleMenu}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? "account-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                      >
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: "primary.main",
                          }}
                          src={currentUser.photoURL || undefined}
                        >
                          {currentUser.displayName?.[0]?.toUpperCase() || "U"}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={() => navigate("/profile")}>
                      <Avatar /> Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    startIcon={<LoginIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    sx={{ textTransform: "none" }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Live Chat Kutusu */}
      {chatOpen && (
        <Box
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 300,
            height: 400,
            bgcolor: "white",
            border: "1px solid #ccc",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            boxShadow: 3,
          }}
        >
          <Box
            sx={{
              p: 1,
              bgcolor: "primary.main",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          >
            <Typography variant="subtitle2">Canlı Destek</Typography>
            <IconButton
              size="small"
              onClick={() => setChatOpen(false)}
              sx={{ color: "white" }}
            >
              ×
            </IconButton>
          </Box>
          <Box sx={{ flex: 1, p: 1, overflowY: "auto" }}>
            {messages.map((msg) => (
              <Typography
                key={msg.id}
                variant="body2"
                sx={{
                  mb: 1,
                  textAlign: msg.sender === "user" ? "right" : "left",
                  bgcolor: msg.sender === "user" ? "#e3f2fd" : "#f1f1f1",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                {msg.text}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: "flex", p: 1, borderTop: "1px solid #eee" }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Mesajınızı yazın..."
              sx={{ mr: 1 }}
            />
            <Button
              onClick={handleSendMessage}
              variant="contained"
              size="small"
              color="primary"
            >
              Gönder
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Navbar;
