import React from 'react';
import NativeSelect from '@mui/material/NativeSelect';
import { styled as muiStyled } from '@mui/material/styles';

// MUI v5 styled component
const StyledNativeSelect = muiStyled(NativeSelect)(({ theme }) => ({
  fontSize: '2rem',
  lineHeight: 'initial',
}));

export interface SelectProps {
  component?: React.ElementType;
  value?: any;
  onChange?: (value: any) => void;
  options: Array<{ label: string; value: any }>;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}

export default (props: SelectProps): React.ReactNode => {
  const SelectComp = props.component || StyledNativeSelect;
  
  return (
    <SelectComp
      {...props}
      value={props.options.findIndex(
        opt => opt.value === props.value
      )}
      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIndex = parseInt(event.target.value);
        const selectedOption = props.options[selectedIndex];
        props.onChange?.(selectedOption.value);
      }}
    >
      {props.options.map((option, index) => (
        <option key={option.value} value={index}>
          {option.label}
        </option>
      ))}
    </SelectComp>
  );
};