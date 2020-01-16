import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import clsx from 'clsx';
import {
  InputAdornment,
  Checkbox,
  FormControl,
  FormControlLabel,
  Button as MuiButton,
  Paper,
  Typography,
  IconButton,
  Snackbar
} from "@material-ui/core";
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { spacing } from "@material-ui/system";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import APIFunction from './../../services'
import { MySnackbarContentWrapper } from './../../components/MySnackbarContentWrapper'
const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;


class SignIn extends Component {

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      showPassword: false,
      isOpen: false,
      errorMessage: '',
      classes: ''
    };

  }

  onSignIn = () => {
    let that = this;
    let { username, password } = this.state;
    APIFunction.login({ username: username, password: password, grant_type: 'password', client_id: 'web', client_secret: 'web' }).then((result) => {
      that.setState({ isOpen: false, errorMessage: '' })
    }).catch(function (error) {
      that.setState({ isOpen: true, errorMessage: error.message })
    });

  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ isOpen: false })

  };

  render() {
    let { username, password, showPassword, isOpen, errorMessage, classes } = this.state;
    return (
      <Wrapper>
        <Snackbar
          className={clsx(classes['error'])}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right"
          }}
          open={isOpen}
        >
          <MySnackbarContentWrapper
            onClose={this.handleClose}
            variant="error"
            message={errorMessage}
          />
        </Snackbar>

        <Typography component="h2" variant="body1" align="center">
          Sign in to Shopbox Seller
      </Typography>
        <ValidatorForm
          ref="form"
          onSubmit={this.onSignIn}
        >
          <FormControl margin="normal" required fullWidth>
            <TextValidator
              label="User name *"
              onChange={e => this.setState({ username: e.target.value })}
              name="username"
              value={username}
              validators={['required', 'isEmail']}
              errorMessages={['Required', 'Email is not valid']}
              autoFocus
            />
          </FormControl>

          <FormControl margin="normal" required fullWidth>
            <TextValidator
              label="Password *"
              onChange={e => this.setState({ password: e.target.value })}
              name="password"
              value={password}
              validators={['required']}
              errorMessages={['Required']}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => this.setState({ showPassword: !showPassword })}
                      onMouseDown={() => this.setState({ showPassword: !showPassword })}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>)

              }}
            />

          </FormControl>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            mb={2}
            type="submit"
          >
            Sign in
        </Button>
          <Button
            component={Link}
            to="/auth/reset-password"
            fullWidth
            color="primary"
          >
            Forgot password
        </Button>
        </ValidatorForm>
      </Wrapper>
    );
  }

}

export default SignIn;
