// @flow
import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

type Props = {
  domains: Array<string>,
  onChange: (Array<string>) => void,
};

export default function DomainTagInput({ domains, onChange }: Props): React.Node {
  const [inputValue, setInputValue] = useState('');

  const addDomain = useCallback(() => {
    const trimmed = inputValue.trim().toLowerCase();
    if (!trimmed || domains.includes(trimmed)) {
      setInputValue('');
      return;
    }
    onChange([...domains, trimmed]);
    setInputValue('');
  }, [inputValue, domains, onChange]);

  const removeDomain = useCallback((domain: string) => {
    onChange(domains.filter(d => d !== domain));
  }, [domains, onChange]);

  const handleKeyDown = useCallback((e: SyntheticKeyboardEvent<>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDomain();
    }
  }, [addDomain]);

  return (
    <Root>
      <ChipList>
        {domains.map(domain => (
          <Chip
            key={domain}
            label={domain}
            size="small"
            onDelete={() => removeDomain(domain)}
          />
        ))}
        {domains.length === 0 && (
          <EmptyHint>No domains configured</EmptyHint>
        )}
      </ChipList>
      <InputRow>
        <TextField
          size="small"
          placeholder="e.g. mail.google.com"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          style={{ flex: 1 }}
        />
        <Button size="small" onClick={addDomain} variant="outlined">
          Add
        </Button>
      </InputRow>
    </Root>
  );
}

const Root = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px 0;
`;

const ChipList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 24px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const EmptyHint = styled.span`
  font-size: 12px;
  color: #bbb;
  align-self: center;
`;
