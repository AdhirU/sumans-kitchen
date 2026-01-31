import { useState, ChangeEvent, useRef } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Avatar,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Add,
  Delete,
  Restaurant,
  CheckCircleOutline,
  Public,
  CameraAlt,
  Upload,
  DragIndicator,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NewRecipe } from '../types';

interface Props {
  recipe: NewRecipe;
  onSave: (newRecipe: NewRecipe, imageFile?: File) => Promise<void>;
}

type arrayFields = 'ingredients' | 'directions';

interface SortableIngredientProps {
  id: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

const SortableIngredient = ({
  id,
  index,
  value,
  onChange,
  onRemove,
}: SortableIngredientProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      display="flex"
      alignItems="center"
      sx={{ mb: 2 }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'grab',
          color: '#999',
          '&:hover': { color: '#666' },
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicator fontSize="small" />
      </IconButton>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#9c3848',
          mr: 2,
          flexShrink: 0,
        }}
      />
      <TextField
        fullWidth
        size="small"
        placeholder={`Ingredient ${index + 1}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#fafafa',
          },
        }}
      />
      <IconButton
        onClick={onRemove}
        sx={{
          ml: 1,
          color: '#999',
          '&:hover': { color: '#d32f2f' },
        }}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};

interface SortableDirectionProps {
  id: string;
  index: number;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

const SortableDirection = ({
  id,
  index,
  value,
  onChange,
  onRemove,
}: SortableDirectionProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      display="flex"
      alignItems="flex-start"
      sx={{ mb: 2 }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'grab',
          color: '#999',
          mt: 0.25,
          '&:hover': { color: '#666' },
          '&:active': { cursor: 'grabbing' },
        }}
      >
        <DragIndicator fontSize="small" />
      </IconButton>
      <Avatar
        sx={{
          width: 28,
          height: 28,
          backgroundColor: '#9c3848',
          fontSize: '0.85rem',
          fontWeight: 600,
          mr: 2,
          mt: 0.5,
          flexShrink: 0,
        }}
      >
        {index + 1}
      </Avatar>
      <TextField
        fullWidth
        multiline
        size="small"
        placeholder={`Step ${index + 1}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            backgroundColor: '#fafafa',
          },
        }}
      />
      <IconButton
        onClick={onRemove}
        sx={{
          ml: 1,
          color: '#999',
          '&:hover': { color: '#d32f2f' },
        }}
      >
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};

const RecipeForm = ({ recipe, onSave }: Props) => {
  const [editedRecipe, setEditedRecipe] = useState({ ...recipe });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    recipe.image_url || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleSave = async () => {
    setLoading(true);
    await onSave(editedRecipe, imageFile || undefined);
    setLoading(false);
  };

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedRecipe((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    index: number,
    field: arrayFields,
    value: string,
  ) => {
    setEditedRecipe((prev) => {
      const updatedArray = [...prev[field]];
      updatedArray[index] = value;
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleAddItem = (field: arrayFields) => {
    setEditedRecipe((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const handleRemoveItem = (index: number, field: arrayFields) => {
    setEditedRecipe((prev) => {
      const updatedArray = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: updatedArray };
    });
  };

  const handleDragEnd = (field: arrayFields) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setEditedRecipe((prev) => {
        const oldIndex = prev[field].findIndex((_, i) => `${field}-${i}` === active.id);
        const newIndex = prev[field].findIndex((_, i) => `${field}-${i}` === over.id);
        return {
          ...prev,
          [field]: arrayMove(prev[field], oldIndex, newIndex),
        };
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
          border: '1px solid #f0e0e0',
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          name="title"
          label="Recipe Title"
          value={editedRecipe.title}
          onChange={handleEditChange}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              fontSize: '1.25rem',
              fontWeight: 600,
            },
          }}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          name="description"
          label="Description"
          value={editedRecipe.description}
          onChange={handleEditChange}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
          }}
        />

        {/* Image Upload Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#666' }}>
            Recipe Image (optional)
          </Typography>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
          {!imagePreview ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CameraAlt />}
                onClick={() => cameraInputRef.current?.click()}
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  borderColor: '#ccc',
                  color: '#666',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9c3848',
                    backgroundColor: 'rgba(156, 56, 72, 0.04)',
                  },
                }}
              >
                Take Photo
              </Button>
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  borderColor: '#ccc',
                  color: '#666',
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#9c3848',
                    backgroundColor: 'rgba(156, 56, 72, 0.04)',
                  },
                }}
              >
                Upload Image
              </Button>
            </Box>
          ) : (
            <Box>
              <Box
                component="img"
                src={imagePreview}
                alt="Recipe preview"
                sx={{
                  maxWidth: '100%',
                  maxHeight: 200,
                  borderRadius: 2,
                  mb: 1,
                  display: 'block',
                }}
              />
              <Button
                size="small"
                onClick={clearImage}
                sx={{
                  color: '#666',
                  textTransform: 'none',
                  '&:hover': { color: '#d32f2f' },
                }}
              >
                Remove Image
              </Button>
            </Box>
          )}
        </Box>

        <FormControlLabel
          control={
            <Switch
              checked={editedRecipe.is_public}
              onChange={(e) =>
                setEditedRecipe((prev) => ({
                  ...prev,
                  is_public: e.target.checked,
                }))
              }
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#9c3848',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#9c3848',
                },
              }}
            />
          }
          label={
            <Box display="flex" alignItems="center" gap={1}>
              <Public sx={{ fontSize: 20, color: '#666' }} />
              <Typography sx={{ color: '#666' }}>
                Make this recipe public
              </Typography>
            </Box>
          }
        />
      </Paper>

      {/* Ingredients Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          borderRadius: 3,
          border: '1px solid #e8e8e8',
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <Restaurant sx={{ color: '#9c3848', mr: 1.5, fontSize: 28 }} />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d2d2d' }}>
            Ingredients
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd('ingredients')}
        >
          <SortableContext
            items={editedRecipe.ingredients.map((_, i) => `ingredients-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            {editedRecipe.ingredients.map((ingredient, index) => (
              <SortableIngredient
                key={`ingredients-${index}`}
                id={`ingredients-${index}`}
                index={index}
                value={ingredient}
                onChange={(value) => handleArrayChange(index, 'ingredients', value)}
                onRemove={() => handleRemoveItem(index, 'ingredients')}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          startIcon={<Add />}
          onClick={() => handleAddItem('ingredients')}
          sx={{
            mt: 1,
            color: '#9c3848',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#f8d7da',
            },
          }}
        >
          Add Ingredient
        </Button>
      </Paper>

      {/* Directions Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          borderRadius: 3,
          border: '1px solid #e8e8e8',
        }}
      >
        <Box display="flex" alignItems="center" mb={2}>
          <CheckCircleOutline
            sx={{ color: '#9c3848', mr: 1.5, fontSize: 28 }}
          />
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#2d2d2d' }}>
            Directions
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd('directions')}
        >
          <SortableContext
            items={editedRecipe.directions.map((_, i) => `directions-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            {editedRecipe.directions.map((step, index) => (
              <SortableDirection
                key={`directions-${index}`}
                id={`directions-${index}`}
                index={index}
                value={step}
                onChange={(value) => handleArrayChange(index, 'directions', value)}
                onRemove={() => handleRemoveItem(index, 'directions')}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          startIcon={<Add />}
          onClick={() => handleAddItem('directions')}
          sx={{
            mt: 1,
            color: '#9c3848',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#f8d7da',
            },
          }}
        >
          Add Step
        </Button>
      </Paper>

      {/* Save Button */}
      <Box textAlign="center">
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={loading}
          sx={{
            px: 6,
            py: 1.5,
            background: '#9c3848',
            color: '#fff',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              background: '#7d2d3a',
            },
            '&:disabled': {
              background: '#ccc',
            },
          }}
        >
          {loading ? 'Saving...' : 'Save Recipe'}
        </Button>
      </Box>
    </Container>
  );
};

export default RecipeForm;
