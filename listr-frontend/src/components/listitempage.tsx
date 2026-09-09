import React, { useEffect, useState } from "react";
import {
  createListItem,
  database,
  type ListItemEntry,
  deleteListItem,
  type ListEntry,
} from "../store/database";
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

export const ListItemPage: React.FC = () => {
  const [items, setItems] = useState<ListItemEntry[]>([]);
  const state: ListEntry = useLocation().state;
  const navigate = useNavigate();

  useEffect(() => {
    setItems(database.items.filter((entry) => entry.listId === state.id));
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
    const newEntry: ListItemEntry = createListItem(text, state.id);
    setItems((prev) => [...prev, newEntry]);
    setText("");
  };

  const [checked, setChecked] = useState<number[]>([]);
  const handleCheckboxToggle =
    (value: number) => (_event: React.ChangeEvent<HTMLInputElement>, _checked: boolean) => {
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
    for (let i = 0; i <= checked.length; i++) {
      deleteListItem(checked[i]);
    }
    setItems((prev) => prev.filter((entry) => !checked.includes(entry.id)));
    setChecked([]);
    setModalOpen(true);
  };

  return (
    <Container>
      <Box>
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: "bold",
            alignContent: "center",
          }}
        >
          {state.name}
        </Typography>
        <br />
        <br />
        <List>
          {items.map((entry) => (
            <Box
              key={entry.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Checkbox
                checked={checked.includes(entry.id)}
                onChange={handleCheckboxToggle(entry.id)}
              />
              <label htmlFor={entry.value}>{entry.value}</label>
            </Box>
          ))}
        </List>
      </Box>
      <br />
      <Box>
        <TextField
          label="Add Item"
          variant="outlined"
          name="newItems"
          value={text}
          onChange={handleText}
        />
        <Button variant="outlined" onClick={handleSubmit}>
          +
        </Button>
        <Button variant="outlined" onClick={handleDelete} disabled={disabled}>
          -
        </Button>
      </Box>
      <br />
      <Box
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
            bgcolor: "white",
            border: "2px solid black",
            boxShadow: 24,
            borderRadius: 2,
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
              bgcolor: "red",
              color: "white",
              "&:hover": { bgcolor: "darkred" },
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
