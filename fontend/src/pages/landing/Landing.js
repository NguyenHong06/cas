import React from "react";
import styled from "styled-components";

import {
  Link,
  Paper,
  Typography,

} from "@material-ui/core";

import { makeStyles } from '@material-ui/core/styles';

import { NavLink as RouterNavLink } from "react-router-dom";

const NavLink = React.forwardRef((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const useStyles = makeStyles(theme => ({
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));


function Landing() {

  const classes = useStyles();

  return (
    <Wrapper>
      <Typography className={classes.root}>
        <Link component={NavLink} exact to="/dashboard">
          Dashboard
      </Link>

        <Link component={NavLink} exact to="/auth/sign-in">
          Sign In
      </Link>

        <Link component={NavLink} exact to="/auth/sign-up">
          Sign Up
      </Link>

      </Typography>

      <Typography variant="h3" gutterBottom align="center">
        Landing page here
      </Typography>
    </Wrapper>
  );
}

export default Landing;
