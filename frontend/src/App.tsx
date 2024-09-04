import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Container, Typography, TextField, Button, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, Box, CircularProgress } from '@mui/material';
import { Add, Delete, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';

type ShoppingItem = {
  id: bigint;
  text: string;
  completed: boolean;
  completedAt: bigint | null;
};

type FormInputs = {
  itemText: string;
};

function App() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm<FormInputs>();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const fetchedItems = await backend.getItems();
      setItems(fetchedItems);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setLoading(true);
      await backend.addItem(data.itemText);
      reset();
      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      setLoading(false);
    }
  };

  const toggleItem = async (id: bigint) => {
    try {
      setLoading(true);
      await backend.toggleItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Error toggling item:', error);
      setLoading(false);
    }
  };

  const deleteItem = async (id: bigint) => {
    try {
      setLoading(true);
      await backend.deleteItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" className="mt-8">
      <Box
        className="mb-8 p-4 rounded-lg"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1519987684948-d25dbcf146db?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjU0MjEwMjR8&ixlib=rb-4.0.3)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="h4" component="h1" className="text-white font-bold">
          Shopping List
        </Typography>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 flex">
        <TextField
          {...register('itemText', { required: true })}
          label="Add new item"
          variant="outlined"
          fullWidth
          className="mr-2"
        />
        <Button type="submit" variant="contained" color="primary" startIcon={<Add />}>
          Add
        </Button>
      </form>
      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {items.map((item) => (
            <ListItem key={Number(item.id)} button onClick={() => toggleItem(item.id)}>
              <ListItemIcon>
                {item.completed ? <CheckCircle color="secondary" /> : <RadioButtonUnchecked />}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                style={{ textDecoration: item.completed ? 'line-through' : 'none' }}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={() => deleteItem(item.id)}>
                  <Delete color="error" />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
}

export default App;
