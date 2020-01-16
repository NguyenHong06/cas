import React, { Component } from "react";
import styled from "styled-components";
import { withStyles } from '@material-ui/styles';
import fetchAPI from '../../../helpers/fetch'
import SelectForm from '../.././components/Inputs/SelectForm'
import SelectSupervisor from '../.././components/Inputs/SelectSupervisor'
// const { DatePicker } = antd;
import {
  Box,
  CardActions as MuiCardActions,
  CardContent as MuiCardContent,
  Typography,
  Card as MuiCard,
  Button as MuiButton,
  TextField as MuiTextField,
  Grid as MuiGrid,
  Avatar as MuiAvatar,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@material-ui/core";
import { TimePicker, DatePicker, DateTimePicker } from "@material-ui/pickers";

import { spacing } from "@material-ui/system";
const CardContent = styled(MuiCardContent)`
  padding-bottom: 12px !important
`;
// border-bottom: 1px dashed ${props => props.theme.palette.grey[300]};
const CardActions = styled(MuiCardActions)`
  float: right;
`;
const Centered = styled.div`
  text-align: center;
`;
const Card = styled(MuiCard)(spacing);
const Button = styled(MuiButton)(spacing);

const TextFieldSpacing = styled(MuiTextField)(spacing);

const TextField = styled(TextFieldSpacing)`
	width: 380px;
	padding: 5px 5px;
`;
const Grid = styled(MuiGrid)(spacing);
const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 128px;
  width: 128px;
`;
const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
	padding:0,
    paddingLeft: 5,
    textTransform: 'capitalize'
  }
}))(TableCell);
const CustomTableInfo = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);
const CustomTableRow = styled(TableRow)`
`;

class FieldInfo extends Component{
	constructor(props) {
		super(props);
	}
	state = {
		search_term:'',
		field:{
			name: 'first_name',
			type: 'text',
		},
		options:[
		],
		selected_supervisor: {
			number_id: '',
			title: ''
		}
	};
	componentDidMount() {
		this.refreshCodeSetValue();
		this.refreshSupervisor();
	}
	componentWillReceiveProps(props){
		this.refreshCodeSetValue();
		this.refreshSupervisor();
	}
	refreshCodeSetValue(){
		var field = this.props.field;
		if(field.type=='code_type' && field.code_type){
			fetchAPI('/get_codesets_based_on_code_type?', {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				params:{
					code_type: field.code_type,
					display_value_id: field.filter || ''
				}
			}).then(res =>{
				var codesets = res.data;
				var options = []
				for (let codeset of codesets){
					let option = {
						value: codeset.codeset_id,
						description: codeset.description
					}
					options.push(option);
				}
				this.setState({options});
			})
		}
	}
	refreshSupervisor(){
		var field = this.props.field;
		if(field.type == 'card_info' && field.value){
			fetchAPI('/api/cardinfos/' + field.value, {
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).then(res =>{
				let cardinfo = res.data;
				if(cardinfo){
					this.setState({
						selected_supervisor: {
							number_id: cardinfo.number_id,
							title: `${cardinfo.name} | ${cardinfo.number_id} | ${cardinfo.user_name} `
						}
					})
				}
			})
		}
	}
	renderInfoField(){
		const { classes, field} = this.props;
		let option = this.state.options.find(e => {
			return e.value == field.value
		});
		let selected_supervisor = this.state.selected_supervisor;
		if(option && option.description){
			return (
				<div>{option.description}</div>
			) 
		}
		else if (selected_supervisor && selected_supervisor.title){
			return (
				<div>{selected_supervisor.title}</div>
			) 
		}
		return (
			<div>{field.value}</div>
		)
	}
	renderEditField(){
		const { classes, field} = this.props;
		if(field.type=='code_type' && field.code_type){
			return (
				<SelectForm key={'FormControl' + field.name} options={this.state.options} value={field.value}
					fieldname = {field.name}
					onChange = {(evt) => {
						this.props.onChange({[field.name]:evt["item"]})
					}}
				/>
			)
		}
		else if(field.type=='card_info'){
			return (
				<SelectSupervisor selected_supervisor={this.state.selected_supervisor}
				searchTerm={this.state.search_term} onChange={()=>this.props.onChangeAutocomplete} />
			);
		}
		else{
			return (
				<TextField
					variant="outlined" size="small" margin='dense'
					id="date"
					type={field.type}
					value={field.value}
					onChange={(evt) => {
						this.props.onChange({[field.name]:evt.target.value})
					}}
					InputProps={{
						classes: {
							input: classes[field.type],
						}
					}}
				/>
			)
		}
		
	}
	handleDateChange = date => {
		this.setState({ selectedDate: date });
	  };
	render() {
		const { field, isEdit} = this.props;
		if(!isEdit){
			return(
				<CustomTableInfo key={'customtablecell2' + field.name} component="th" scope="row" >
					{this.renderInfoField()}
				</CustomTableInfo>
			)
		}
		else {
			return(
				<CustomTableCell key={'customtablecell2' + field.name} align="right">
					{this.renderEditField()}
				</CustomTableCell>
			)
		}
		
	}
}
class ChangeInfo extends Component{
	constructor(props) {
		super(props);
	}
	state = {
		number_id: "",
		user_name: '',
		card_number: '',
	};
	render() {
		const { classes, cardinfo, isEdit } = this.props;
		return (
			<Table key={'row11-'}> 
			<TableBody key={'row1-2'}>
				{
					cardinfo.map((field) =>{
						if(field && field.type != 'oid'){
							if(field && field.name == 'department'){
								field['filter'] = cardinfo.find(e => {
									return e.name == 'home_school'
								}).value
							}
							return(
								<CustomTableRow key={'customtablerow' + field.name}>
									<CustomTableCell key={'customtablecell1' + field.name} component="th" scope="row" >
										{field.name.replace("_", " ")}
									</CustomTableCell>
									{
										<FieldInfo isEdit={isEdit} classes={classes} onChange={this.props.onChange} 
										onChangeAutocomplete={this.props.onChangeAutocomplete}
										field={field}/>
									}
								</CustomTableRow>	
							)
						}
					})
				}
			</TableBody>
			</Table>
		);
	}
}
class CardInfo extends React.Component {
	constructor(props) {
		super(props);
		
	}
	state = {
		number_id: '',
		isEdit: false,
		fields:[]
		
	};
	componentDidMount(){
		this.initFields()
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.number_id){
			this.setState({number_id:nextProps.number_id},()=>{
				this.refresh();
			})
		}
	}
	initFields(){
		this.setState({fields: this.props.fields},()=>{
			this.refresh();
		})
	}
	refresh = () => {
		fetchAPI('/api/cardinfos/' + this.state.number_id, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			params:{
				// format: 'json'
			}
		}).then(res =>{
			var fields = this.state.fields;
			var card_json = res.data;
			if(card_json){
				for (let field of fields){
					field.value = card_json[field.name];
				}
				this.setState({fields});
			}
           
		})
	}
	handleCancel = name => event => {
		this.refresh();
		this.setState({isEdit:!this.state.isEdit})
	};
	submitInfo = name => event => {
		if(this.state.isEdit){
			var fields = {}
			for (var i = 0; i < this.state.fields.length; i++) {
				fields[this.state.fields[i].name] = this.state.fields[i].value;
			}
			fetchAPI(`/api/cardinfos/${fields.number_id}/` , {
				method: 'PUT',
				headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(fields)
			}).then(res =>{
				console.log(res);
			})
		}
		this.setState({isEdit:!this.state.isEdit})
	};
	handleChange = (field) => {
		var keyName = Object.keys(field)[0];
		var fields = this.state.fields;
		let objIndex = fields.findIndex((obj => obj.name == keyName));
		fields[objIndex].value = field[keyName];
		this.setState({
		  	fields
		});
	}
	handleChangeAutocomplete = (event, cardinfo) => {
		if(cardinfo){
			this.state.fields.find(e => {return e.name == 'supervisor'}).value = cardinfo.number_id;
			this.setState({
				fields: this.state.fields
			});
		}
	}
	render() {
		const { classes, fields, title } = this.props;
		return (
			<Card mb={6} className={classes.Card}>
				<CardActions className={classes.CardAction}>
					<Typography gutterBottom variant="h6" component="h3" className={classes.CardTitle}>
						{title}
					</Typography>
					<Button onClick={this.submitInfo()} size="small" color="primary">
						{this.state.isEdit ? 'Submit': 'Edit'}
					</Button>
					<Button onClick={this.handleCancel()} style={this.state.isEdit ? {} : { display: 'none' }} size="small">
						Cancel
					</Button>
				</CardActions>
				<CardContent>
					<Grid container spacing={6}>
						<ChangeInfo classes = {classes} isEdit={this.state.isEdit} cardinfo={this.state.fields} 
						onChangeAutocomplete={(evt, hand)=>this.handleChangeAutocomplete(evt, hand)}
						onChange={field => this.handleChange(field)}/>
					</Grid>
				</CardContent>
				
			</Card>
		);
  	}
}
  
export default CardInfo;
