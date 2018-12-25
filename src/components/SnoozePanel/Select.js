// @flow
import React from 'react';
import NativeSelect from '@material-ui/core/NativeSelect';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    fontSize: '2rem',
    lineHeight: 'initial',
  },
});

export default withStyles(styles)(
  (props: {
    value: any,
    onChange: any => void,
    options: Array<{ label: string, value: string }>,
  }) => (
    <NativeSelect
      {...props}
      value={undefined}
      onChange={event => {
        const selectedIndex = parseInt(event.target.value);
        const selectedOption = props.options[selectedIndex];
        console.log(selectedOption.value);
        props.onChange(selectedOption.value);
      }}
    >
      {props.options.map((option, index) => (
        <option
          key={option.value}
          value={index}
          selected={props.value === option.value}
        >
          {option.label}
        </option>
      ))}
    </NativeSelect>
  )
);
