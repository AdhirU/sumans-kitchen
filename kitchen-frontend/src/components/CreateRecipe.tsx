import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import { NewRecipe } from '../types';
import RecipeForm from './RecipeForm';
import { createRecipe } from '../reducers/recipeReducer';
import generateService from '../services/generate';
import recipeService from '../services/recipes';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Navigate, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import {
  AutoAwesome,
  CameraAlt,
  Edit,
  Image,
  Upload,
} from '@mui/icons-material';

const emptyRecipe: NewRecipe = {
  title: '',
  description: '',
  ingredients: [''],
  directions: [''],
  is_public: false,
};

const CreateRecipe = () => {
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const [value, setValue] = useState('text');
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<NewRecipe | null>(
    emptyRecipe,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Wait for auth to load before deciding to redirect
  // If we have a token but no user yet, the user is still being loaded
  if (token && !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: '#9c3848' }} />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'text') {
      setSelectedRecipe(emptyRecipe);
    } else {
      setSelectedRecipe(null);
    }
    setValue(newValue);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    if (newValue === 'text') {
      setSelectedRecipe(emptyRecipe);
    } else {
      setSelectedRecipe(null);
    }
    setValue(newValue);
  };

  const generateFromPrompt = async () => {
    setLoading(true);
    const recipe = await generateService.fromPrompt(promptText);
    setLoading(false);
    setSelectedRecipe(recipe);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const generateFromImage = async () => {
    if (!imageFile) return;
    setLoading(true);
    try {
      const recipe = await generateService.fromImage(imageFile);
      setSelectedRecipe(recipe);
    } catch (error) {
      console.error('Failed to generate recipe from image:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const saveRecipe = async (newRecipe: NewRecipe, imageFile?: File) => {
    const recipeId = await dispatch(createRecipe(newRecipe));
    if (recipeId) {
      if (imageFile) {
        try {
          await recipeService.uploadImage(recipeId, imageFile);
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
      navigate('/my-recipes');
    }
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#2d2d2d',
            mb: 3,
            textAlign: 'center',
          }}
        >
          Create New Recipe
        </Typography>
      </Container>

      <TabContext value={value}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          {/* Mobile dropdown */}
          <FormControl
            sx={{
              display: { xs: 'block', sm: 'none' },
              minWidth: 200,
            }}
          >
            <Select
              value={value}
              onChange={handleSelectChange}
              sx={{
                borderRadius: 2,
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                },
              }}
            >
              <MenuItem value="text">
                <Edit sx={{ fontSize: 20, mr: 1 }} /> Manual Entry
              </MenuItem>
              <MenuItem value="prompt">
                <AutoAwesome sx={{ fontSize: 20, mr: 1 }} /> AI Generate
              </MenuItem>
              <MenuItem value="image">
                <Image sx={{ fontSize: 20, mr: 1 }} /> From Image
              </MenuItem>
            </Select>
          </FormControl>

          {/* Desktop tabs */}
          <Paper
            elevation={0}
            sx={{
              display: { xs: 'none', sm: 'block' },
              borderRadius: 3,
              border: '1px solid #e8e8e8',
              overflow: 'hidden',
            }}
          >
            <TabList
              onChange={handleChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  px: 3,
                  minHeight: 56,
                },
                '& .Mui-selected': {
                  color: '#9c3848 !important',
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#9c3848',
                },
              }}
            >
              <Tab
                icon={<Edit sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="Manual Entry"
                value="text"
              />
              <Tab
                icon={<AutoAwesome sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="AI Generate"
                value="prompt"
              />
              <Tab
                icon={<Image sx={{ fontSize: 20 }} />}
                iconPosition="start"
                label="From Image"
                value="image"
              />
            </TabList>
          </Paper>

          <Box width="100%" display="flex" justifyContent="center">
            <TabPanel value="type"></TabPanel>
            <TabPanel
              sx={{
                width: { xs: '100%', md: '600px' },
                px: { xs: 2, md: 0 },
                py: 4,
              }}
              value="prompt"
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e8e8e8',
                  background:
                    'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 2, color: '#666', textAlign: 'center' }}
                >
                  Describe the recipe you want and AI will generate it for you
                </Typography>
                <Box
                  display="flex"
                  gap={2}
                  flexDirection={{ xs: 'column', sm: 'row' }}
                >
                  <TextField
                    size="small"
                    placeholder="e.g., Spicy Thai green curry with tofu"
                    fullWidth
                    value={promptText}
                    onChange={({ target }) => setPromptText(target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#fff',
                      },
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={generateFromPrompt}
                    disabled={loading || !promptText.trim()}
                    sx={{
                      px: 4,
                      background: '#9c3848',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        background: '#7d2d3a',
                      },
                      '&:disabled': {
                        background: '#ccc',
                      },
                    }}
                  >
                    Generate
                  </Button>
                </Box>
              </Paper>
            </TabPanel>
            <TabPanel
              sx={{
                width: { xs: '100%', md: '600px' },
                px: { xs: 2, md: 0 },
                py: 4,
              }}
              value="image"
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: '1px solid #e8e8e8',
                  background:
                    'linear-gradient(135deg, #fff5f5 0%, #ffffff 100%)',
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ mb: 3, color: '#666', textAlign: 'center' }}
                >
                  Take a photo or upload an image of a recipe
                </Typography>

                {/* Hidden file inputs */}
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
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      justifyContent: 'center',
                      flexDirection: { xs: 'column', sm: 'row' },
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<CameraAlt />}
                      onClick={() => cameraInputRef.current?.click()}
                      sx={{
                        display: { xs: 'inline-flex', md: 'none' },
                        px: 3,
                        py: 1.5,
                        borderColor: '#9c3848',
                        color: '#9c3848',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#7d2d3a',
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
                        px: 3,
                        py: 1.5,
                        borderColor: '#9c3848',
                        color: '#9c3848',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#7d2d3a',
                          backgroundColor: 'rgba(156, 56, 72, 0.04)',
                        },
                      }}
                    >
                      Upload Image
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <Box
                      component="img"
                      src={imagePreview}
                      alt="Recipe preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: 300,
                        borderRadius: 2,
                        mb: 2,
                      }}
                    />
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        justifyContent: 'center',
                        flexDirection: { xs: 'column', sm: 'row' },
                      }}
                    >
                      <Button
                        variant="outlined"
                        onClick={clearImage}
                        sx={{
                          px: 3,
                          borderColor: '#999',
                          color: '#666',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 500,
                          '&:hover': {
                            borderColor: '#666',
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          },
                        }}
                      >
                        Choose Different Image
                      </Button>
                      <Button
                        variant="contained"
                        onClick={generateFromImage}
                        disabled={loading}
                        sx={{
                          px: 4,
                          background: '#9c3848',
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          '&:hover': {
                            background: '#7d2d3a',
                          },
                          '&:disabled': {
                            background: '#ccc',
                          },
                        }}
                      >
                        Extract Recipe
                      </Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </TabPanel>
          </Box>
        </Box>
      </TabContext>

      {loading && (
        <Box
          display="flex"
          height="40vh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={2}
        >
          <CircularProgress sx={{ color: '#9c3848' }} />
          <Typography variant="body1" sx={{ color: '#666' }}>
            Generating your recipe...
          </Typography>
        </Box>
      )}

      {selectedRecipe && !loading && (
        <RecipeForm recipe={selectedRecipe} onSave={saveRecipe} />
      )}
    </Box>
  );
};

export default CreateRecipe;
