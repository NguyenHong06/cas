import React, { Component } from "react";
import styled from "styled-components";
import {
  Button as MuiButton,
  ButtonGroup as MuiButtonGroup,
  MenuList,
  ClickAwayListener,
  Grow,
  MenuItem as MuiMenuItem,
  Popper as MuiPopper,
  Paper,
} from "@material-ui/core";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';;

const Button = styled(MuiButton)`
  width: 327px;
  font-weight: 500;
  font-size: 13px;
`;
const MenuItem = styled(MuiMenuItem)`
  font-size: 13px;
`;
const ButtonIcon = styled(MuiButton)`
`;
const Popper = styled(MuiPopper)`
  z-index: 1;
  border: 1px solid #ccc;
  width: 370px;
  border-radius: 4px;
  margin-left:2px;
`;
const ButtonGroup = styled(MuiButtonGroup)`
  margin:5px;
`;
class SelectForm extends Component{
	constructor(props) {
		super(props);
	}
	state = {
		open: false,
	};
	handleToggle = () => {
		this.setState(state => ({ open: !state.open }));
	};
	handleClose = event => {
		this.setState({ open: false });
	};
	render() {
		const { options , fieldname, value} = this.props;
		const { open } = this.state;
		let option = options.find(e => {
			return e.value == value
		})
		return (
			<div>
				<ButtonGroup ref={node => {this.anchorEl = node}} aria-label="split button">
					<Button onClick={this.handleToggle}>
						{
						option ? option.description: 'Select ' + fieldname
						}
					</Button>
					<ButtonIcon
						size="small"
						aria-controls={open ? 'split-button-menu' : undefined}
						aria-expanded={open ? 'true' : undefined}
						aria-label="select merge strategy"
						aria-haspopup="menu"
						onClick={this.handleToggle}
					>
						<ArrowDropDownIcon />
					</ButtonIcon>
				</ButtonGroup>
				<Popper open={open} anchorEl={this.anchorEl} role={undefined} transition disablePortal>
				{({ TransitionProps, placement }) => (
					<Grow
					{...TransitionProps}
					style={{
						transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
					}}
					>
					<Paper>
						<ClickAwayListener onClickAway={this.handleClose}>
						<MenuList id="split-button-menu">
							{options.map((option)=>{
								return (
									<MenuItem key={'option' + fieldname + option.value}
									onClick={(evt) => {
										this.setState({ open: false });
										this.props.onChange({['item']:evt.target.value})
									}}
									value={option.value}>{option.description}</MenuItem>
								)
							})}
						</MenuList>
						</ClickAwayListener>
					</Paper>
					</Grow>
				)}
				</Popper>
			</div>
		);
	}
}
export default SelectForm;