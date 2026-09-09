import React, { useState } from "react";
import type { ListEntry } from "../store/database";
import { useEffect } from "react";
import { Link } from "react-router";
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
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";

export const Listpage: React.FC = () => {
  const [lists, setLists] = useState<ListEntry[]>([]);

  // Fetch the lists from the backend API when the component mounts
  useEffect(() => {
    fetch("http://localhost:3000/lists")
      .then((response) => response.json())
      .then((data) => setLists(data));
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
    fetch("http://localhost:3000/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: text }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLists((prev) => [...prev, data]);
        setText("");
      });
  };

  // Function to handle the deletion of a list
  const handleDelete = (id: number) => {
    fetch(`http://localhost:3000/lists/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setLists((prev) => prev.filter((list) => list.id !== id));
      });
  };

  //Function to handle the editing of a list
  const handleEdit = (id: number) => {
    fetch(`http://localhost:3000/lists/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: editText }),
    })
      .then((response) => response.json())
      .then(() => {
        setLists((prev) =>
          prev.map((list) =>
            list.id === id ? { ...list, name: editText } : list,
          ),
        );

        setEditingId(null);
        setEditText("");
      });
  };

  return (
    <Container>
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: "bold",
          alignContent: "center",
        }}
      >
        WELCOME TO LISTR
      </Typography>
      <Box>
        <List>
          {lists.map((entry) => {
            return (
              <ListItem
                key={entry.id}
                secondaryAction={
                  <>
                    {editingId === entry.id ? (
                      <IconButton
                        aria-label="save"
                        onClick={() => handleEdit(entry.id)}
                      >
                        <CheckIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          setEditingId(entry.id);
                          setEditText(entry.name);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    )}

                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                {editingId === entry.id ? (
                  <TextField
                    value={editText}
                    onChange={(e) => {
                      setEditText(e.target.value);
                    }}
                  />
                ) : (
                  <Link to="/listitems" state={entry}>
                    {entry.name}
                  </Link>
                )}
              </ListItem>
            );
          })}
        </List>
        <TextField
          label="New List"
          variant="outlined"
          value={text}
          onChange={handleText}
        />
        <Button variant="outlined" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Container>
  );
};
