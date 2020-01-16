import React, { Component } from "react";
import styled, { withTheme } from "styled-components";
import { connect } from "react-redux";
import { darken } from "polished";

import {
	Badge,
	Grid,
	Hidden,
	InputBase,
	Menu,
	MenuItem,
	AppBar as MuiAppBar,
	IconButton as MuiIconButton,
	Toolbar, 
	Button as MuiButton
} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { Menu as MenuIcon } from "@material-ui/icons";
import {
	MessageSquare,
	Power,
	Users,
	FileText
} from "react-feather";
const useStyles = makeStyles(theme => ({
	header: {
		height: '67px',
		paddingLeft: 0
	},
	button:{
		height:'67px',
		width:'120px',
		borderRadius: 0,
		fontWeight: 400,
		'&:hover': {
		}, 
	}, 
	span:{
		paddingLeft: 10
	},
	img:{
		height: 25,
		marginRight: 5
	}
}));
const AppBar = styled(MuiAppBar)`
  background: ${props => props.theme.header.background};
  color: ${props => props.theme.header.color};
  box-shadow: ${props => props.theme.shadows[1]};
`;

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
  &:hover {
    background: ${props => props.theme.header.menuitem.hover};
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${props => props.theme.header.indicator.background};
    color: ${props => props.theme.palette.common.white};
  }
`;
const Button = styled(MuiButton)`
  background: ${props => props.theme.header.menuitem.background};
  color: ${props => props.theme.header.menuitem.color};
  &:hover {
    background: ${props => props.theme.header.menuitem.hover};
  }
`;


class UserMenu extends Component {
  state = {
    anchorMenu: null
  };

  toggleMenu = event => {
    this.setState({ anchorMenu: event.currentTarget });
  };

  closeMenu = () => {
    this.setState({ anchorMenu: null });
  };

  render() {
    const { anchorMenu } = this.state;
    const open = Boolean(anchorMenu);

    return (
      <React.Fragment>
        <IconButton
          aria-owns={open ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={this.toggleMenu}
          color="inherit"
        >
          <Power />
        </IconButton>
        <Menu
          id="menu-appbar"
          anchorEl={anchorMenu}
          open={open}
          onClose={this.closeMenu}
        >
          <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            Profile
          </MenuItem>
          <MenuItem
            onClick={() => {
              this.closeMenu();
            }}
          >
            Sign out
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  }
}

export default function ContainedButtons({onDrawerToggle}) {
  const classes = useStyles();
  return (
    <React.Fragment>
    <AppBar position="sticky" elevation={0}>
      <Toolbar className={classes.header}>
        <Grid container alignItems="center">
          <Hidden mdUp>
            <Grid item>
              <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={onDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
          </Hidden>
            <Grid item>
              <Button href="/" className={classes.button} variant="contained">
                <Users/> <span className={classes.span}> CardInfos </span>
              </Button>
            </Grid>
            <Grid item>
            <Button href="/records" className={classes.button} variant="contained">
              <FileText/> <span className={classes.span}> Records </span>
            </Button>
            </Grid>
          <Grid item xs />
          <Grid item>
            <IconButton color="inherit">
              <Indicator badgeContent={3}>
                <MessageSquare />
              </Indicator>
            </IconButton>
            <UserMenu />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  </React.Fragment>
  );
}
