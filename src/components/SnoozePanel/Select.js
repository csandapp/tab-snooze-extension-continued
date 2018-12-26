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
      value={props.options.findIndex(
        opt => opt.value === props.value
      )}
      onChange={event => {
        const selectedIndex = parseInt(event.target.value);
        const selectedOption = props.options[selectedIndex];

        props.onChange(selectedOption.value);
      }}
    >
      {props.options.map((option, index) => (
        <option key={option.value} value={index}>
          {option.label}
        </option>
      ))}
    </NativeSelect>
  )
);
