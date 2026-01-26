import React, { useState, type FC } from "react";
import { database, type ListEntry, createList } from "../store/database";
import { useEffect } from "react";
import { Link} from "react-router";
import { Container, Box, List, ListItem, ListItemIcon, ListItemAvatar, Avatar, Button, TextField, Typography} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


export const Listpage:React.FC = () =>{
    const [lists, setLists] = useState<ListEntry[]>([]);

    useEffect (() => { 
        setLists(database.lists);
    })

    const[text, setText] = useState<string>("");
    const handleText = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setText(e.target.value);
    }
    const handleSubmit = (e:React.FormEvent) =>{
        e.preventDefault();
        const newEntry:ListEntry =createList(text);
        setLists(prev => [...prev, newEntry]);
        setText("");
    }

    return (<Container>
    <Typography
        sx={{
            fontSize: 20,
            fontWeight: "bold",
            alignContent: "center"
    }}>WELCOME TO LISTR</Typography>
    <Box>
        <List>
            {
                lists.map((entry) => {
                    return (
                    <ListItem    
                        key={entry.id}
                        secondaryAction={
                            <IconButton edge="end" aria-label="delete" onClick={() => {}}>
                                <DeleteIcon />
                            </IconButton>
                        }>
                            <ListItemAvatar>
                                <Avatar>
                                    <FolderIcon />
                                </Avatar>
                            </ListItemAvatar>
                        <Link to="/listitems" state={entry}>{entry.name}</Link>
                    </ListItem>
                    )
                })
            }
        </List>
            <TextField label="New List" variant="outlined" value={text} onChange={handleText}/>
            <Button variant="outlined" onClick={handleSubmit}>Submit</Button>
    </Box>
    </Container>)
}