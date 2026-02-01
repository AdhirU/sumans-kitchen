import { useEffect, useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  debounceMs = 300,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs, onSearch]);

  return (
    <TextField
      fullWidth
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ color: '#999' }} />
          </InputAdornment>
        ),
        endAdornment: query && (
          <InputAdornment position="end">
            <Clear
              sx={{ color: '#999', cursor: 'pointer' }}
              onClick={() => setQuery('')}
            />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          backgroundColor: '#fafafa',
        },
      }}
    />
  );
};

export default SearchBar;
