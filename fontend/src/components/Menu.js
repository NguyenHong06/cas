import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    background: '#1b2430',
    display:"inline-block"
  },
  button:{
    margin: '0px',
    height: '44px',
    background: '#1b2430',
    color: 'white',
    width:'150px',
    borderRadius: 0,
    fontWeight: 400,
    '&:hover': {
        background: '#12171d',
    },  
  },
  img:{
    height: 25,
    marginRight: 5
  }
}));
export default function ContainedButtons() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button className={classes.button} variant="contained">
      <img src='/static/img/icons/team.svg' className={classes.img} />
          <span> CardInfos </span></Button>
      <Button className={classes.button} variant="contained">Records</Button>
      <Button className={classes.button} variant="contained">Reports</Button>
      <Button className={classes.button} variant="contained">Admin</Button>
    </div>
  );
}
