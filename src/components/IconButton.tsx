import React, { FunctionComponent, ReactNode } from 'react';
import '../styles/app.less';
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
  iconButton: {
    background: 'unset',
    border: 'unset',
    '&:focus': {
      outline: 'none',
    },
    padding: '0',
  }
})

interface IconButton {
  size: number
  onClick?: () => void
  disabled?: boolean
  children?: ReactNode
}

const IconButton: FunctionComponent<IconButton> = ({size, onClick, disabled, children}) => { 
  const classes = useStyles()

  return (
    <button
      className={classes.iconButton}
      disabled={disabled}
      onClick={onClick}
    >
      <svg viewBox="0 0 512 512" width="1em" height="1em" fontSize={`${size}px`}>
        {children}
      </svg>
    </button>
  );
}

export default IconButton;
