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
  (props: { options: Array<{ label: string, value: string }> }) => (
    <NativeSelect {...props}>
      {props.options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </NativeSelect>
  )
);
