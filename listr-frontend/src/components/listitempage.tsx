import React, { useEffect, useState } from "react";
import { type ListItemEntry, type ListEntry } from "../store/types";
import { useLocation, useNavigate } from "react-router";
import {
  Container,
  Box,
  List,
  Button,
  TextField,
  Typography,
  Checkbox,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const ListItemPage: React.FC = () => {
  const [items, setItems] = useState<ListItemEntry[]>([]);
  const state: ListEntry = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/lists/${state.id}/items`)
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  const [text, setText] = useState<string>("");
  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text === "" || text === undefined) {
      return;
    }
    fetch(`http://localhost:3000/lists/${state.id}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: text }),
    })
      .then((response) => response.json())
      .then((data) => {
        setItems((prev) => [...prev, data]);
        setText("");
      });
  };

  const [checked, setChecked] = useState<number[]>([]);
  const handleCheckboxToggle =
    (value: number) =>
    (_event: React.ChangeEvent<HTMLInputElement>, _checked: boolean) => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else newChecked.splice(currentIndex, 1);
      setChecked(newChecked);
    };

  const [disabled, setDisabled] = useState<boolean>(true);
  useEffect(() => {
    setDisabled(checked.length === 0);
  }, [checked]);

  const [modalopen, setModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    checked.forEach((itemId) => {
      fetch(`http://localhost:3000/lists/${state.id}/items/${itemId}`, {
        method: "DELETE",
      });
    });

    setItems((prev) => prev.filter((entry) => !checked.includes(entry.id)));

    setChecked([]);
    setModalOpen(true);
  };

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>("");

  const handleEdit = (itemId: number) => {
    fetch(`http://localhost:3000/lists/${state.id}/items/${itemId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: editText }),
    })
      .then((response) => response.json())
      .then(() => {
        setItems((prev) =>
          prev.map((item) =>
            item.id === itemId ? { ...item, value: editText } : item,
          ),
        );

        setEditingId(null);
        setEditText("");
      });
  };

  return (
    <Container className="page-container">
      <Box>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          {state.name}
        </Typography>
        <br />
        <br />
        <List>
          {items.map((entry) => (
            <Box key={entry.id} className="item-bubble">
              <Checkbox
                checked={checked.includes(entry.id)}
                onChange={handleCheckboxToggle(entry.id)}
              />

              {editingId === entry.id ? (
                <TextField
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                entry.value
              )}

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
                    setEditText(entry.value);
                  }}
                >
                  <EditIcon />
                </IconButton>
              )}
            </Box>
          ))}
        </List>
      </Box>
      <br />
      <Box className="item-actions">
        <Box className="add-item-controls">
          <TextField
            label="Add Item"
            variant="outlined"
            name="newItems"
            value={text}
            onChange={handleText}
          />
          <Button
            variant="outlined"
            onClick={handleSubmit}
            sx={{
              color: "#6b4636",
              borderColor: "#6b4636",
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#fcfad4",
                borderColor: "#6b4636",
              },
            }}
          >
            <AddIcon />
          </Button>
        </Box>
        <Box className="delete-item-controls">
          <Button variant="outlined" onClick={handleDelete} disabled={disabled}>
            Delete Selected:
            <DeleteOutlineIcon />
          </Button>
        </Box>
      </Box>
      <br />
      <Box
        className="back-button-container"
        sx={{
          display: "flex",
          alignItems: "left",
          justifyContent: "flex-start",
        }}
      >
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>
      <Modal
        open={modalopen}
        onClose={() => {
          setModalOpen(false);
        }}
      >
        <Box
          sx={{
            position: "absolute" as const,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 300,
            height: 200,
            bgcolor: "#fff0b8",
            border: "2px solid #6b4636",
            boxShadow: "0 8px 24px rgba(107, 70, 54, 0.25)",
            borderRadius: 4,
            p: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setModalOpen(false);
            }}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              minWidth: "auto",
              padding: "4px 8px",
              bgcolor: "#6b4636",
              color: "#f8e7a1",
              "&:hover": {
                bgcolor: "#54372b",
              },
              borderRadius: 2,
            }}
          >
            x
          </Button>
          <Typography
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {" "}
            Item(s) have been deleted
          </Typography>
        </Box>
      </Modal>
    </Container>
  );
};
