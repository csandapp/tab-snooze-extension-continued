// @flow
import React, { useState, useCallback } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import AlarmIcon from '@mui/icons-material/Alarm';
import type { SnoozeOption } from '../SnoozePanel/calcSnoozeOptions';

type Props = {
  options: Array<SnoozeOption>,
  onSelect: (SnoozeOption) => void,
};

export default function SnoozeDropdown({ options, onSelect }: Props): React.Node {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = useCallback((e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleSelect = useCallback((option: SnoozeOption) => {
    handleClose();
    onSelect(option);
  }, [handleClose, onSelect]);

  // Exclude Repeatedly and Pick a Date — they need a dialog, which doesn't fit this compact flow
  const schedulableOptions = options.filter(o => o.when != null);

  return (
    <>
      <IconButton size="small" onClick={handleOpen} aria-label="Snooze tab">
        <AlarmIcon sx={{ fontSize: 16 }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {schedulableOptions.map(opt => (
          <MenuItem key={opt.id} onClick={() => handleSelect(opt)} dense>
            {opt.title}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
