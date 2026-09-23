import React, { useState } from "react";
import type { ListEntry } from "../store/types";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Container,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

const API_URL = import.meta.env.VITE_API_URL;

export const Listpage: React.FC = () => {
  const [lists, setLists] = useState<ListEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch the lists from the backend API when the component mounts
  useEffect(() => {
    fetch(`${API_URL}/lists`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }
        return response.json();
      })
      .then((data) => {
        setLists(data);
        setError(null);
      })
      .catch(() => {
        setError("Could not load lists");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // State and handler for the new list input
  const [text, setText] = useState<string>("");
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  // State for editing a list
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  // Function to handle the submission of a new list
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API_URL}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: text }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create list");
        }
        return response.json();
      })
      .then((data) => {
        setLists((prev) => [...prev, data]);
        setText("");
        setError(null);
      })
      .catch(() => {
        setError("Could not create list");
      });
  };

  // Function to handle the deletion of a list
  const handleDelete = (id: number) => {
    fetch(`${API_URL}/lists/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete list");
        }
        return response.json();
      })
      .then(() => {
        setLists((prev) => prev.filter((list) => list.id !== id));
        setError(null);
      })
      .catch(() => {
        setError("Could not delete list");
      });
  };

  //Function to handle the editing of a list
  const handleEdit = (id: number) => {
    fetch(`${API_URL}/lists/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editText }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to edit list");
        }
        return response.json();
      })
      .then(() => {
        setLists((prev) =>
          prev.map((list) =>
            list.id === id ? { ...list, name: editText } : list,
          ),
        );

        setEditingId(null);
        setEditText("");
        setError(null);
      })
      .catch(() => {
        setError("Could not edit list");
      });
  };

  const navigate = useNavigate();

  return (
    <Container className="page-container">
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: "bold",
          letterSpacing: "0.2px",
          textShadow: "1px 2px 3px rgba(107, 70, 54, 0.2)",
        }}
      >
        WELCOME TO LISTR
      </Typography>
      {error && <Typography>{error}</Typography>}
      <Box>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <List className="list-container">
            {lists.map((entry) => {
              return (
                <ListItem
                  key={entry.id}
                  onClick={() => navigate("/listitems", { state: entry })}
                  secondaryAction={
                    <>
                      {editingId === entry.id ? (
                        <IconButton
                          aria-label="save"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(entry.id);
                          }}
                          sx={{
                            color: "#6b4636",
                            "&:hover": {
                              backgroundColor: "#fcfad4",
                            },
                          }}
                        >
                          <CheckIcon />
                        </IconButton>
                      ) : (
                        <IconButton
                          aria-label="edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingId(entry.id);
                            setEditText(entry.name);
                          }}
                          sx={{
                            color: "#6b4636",
                            "&:hover": {
                              backgroundColor: "#fcfad4",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )}

                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        sx={{
                          color: "#6b4636",
                          "&:hover": {
                            backgroundColor: "#fcfad4",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  }
                >
                  <Box className="list-card-content">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#fcfad4" }}>
                        <ListAltOutlinedIcon className="list-icon" />
                      </Avatar>
                    </ListItemAvatar>
                    {editingId === entry.id ? (
                      <TextField
                        value={editText}
                        onChange={(e) => {
                          setEditText(e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: "bold",
                          letterSpacing: "0.2px",
                        }}
                      >
                        {entry.name}
                      </Typography>
                    )}
                    <Box className="list-item-count">
                      {entry.itemCount === 1
                        ? "1 item"
                        : `${entry.itemCount} items`}
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
        <TextField
          label="New List"
          variant="outlined"
          value={text}
          onChange={handleText}
          sx={{ margin: "5px" }}
        />
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};
