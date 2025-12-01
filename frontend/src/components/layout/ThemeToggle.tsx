'use client';

import { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeContext } from '@/contexts/ThemeContext';

export default function ThemeToggle() {
  const { mode, toggleMode } = useContext(ThemeContext);

  return (
    <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
      <IconButton onClick={toggleMode} color="inherit">
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

