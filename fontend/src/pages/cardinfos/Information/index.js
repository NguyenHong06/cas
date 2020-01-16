import React from "react";
import styled, { withTheme } from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";

import { Bar } from "react-chartjs-2";

import { red, green, blue } from "@material-ui/core/colors";
import { withStyles } from '@material-ui/styles';
import {
  Avatar as MuiAvatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardActions,
  CardContent as MuiCardContent,
  Chip as MuiChip,
  Divider as MuiDivider,
  Grid as MuiGrid,
  LinearProgress as MuiLinearProgress,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,

  InputBase,
  TextField
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { spacing } from "@material-ui/system";
import Info from "./info";
import ContactInfos from "./ContactInfos";
import CardInfo from "./CardInfo";
import fetchAPI from '../../../helpers/fetch'
import Search from '../search'
// import EditText from '../../../components/material-ui/TextField';
import {
  Briefcase,
  ExternalLink,
  Facebook,
  Home,
  Instagram,
  MapPin,
  Twitter,
} from "react-feather";

const Button = styled(MuiButton)(spacing);

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Grid = styled(MuiGrid)(spacing);

const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 128px;
  width: 128px;
`;



const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${props => props.theme.palette.grey[300]};
`;
function editInfo(){
  console.log('editInfo');
}
const styles = {
	text: {
		fontSize: 13,
	},
	date:{
		fontSize: 13,
		padding: 10,
		textAlign: 'center'
	},
	Card:{
		border: '1px solid #ccc',
		borderRadius: 0,
		padding: 0
	},
	CardTitle: {
		fontSize: 15,
		padding: 5,
		paddingLeft:10,
		paddingBottom: 0,
		width:'100%'
	},
	CardAction:{
		width:'100%',
		padding: 0,
		background: '#ebecf0',
		color: '#444',
	},
	Avatar:{
		padding: '0 25px !important'
	}
};
class CardInfos extends React.Component {
	constructor(props) {
		super(props);
		
	}
	state = {
		options: [],
		search_term: '',
		search_term_query: '',
		selected_number_id: '',
		search_values : {
			number_id: '',
			title: ''
		},
		card_infos:{
			title: "Card Information",
			fields:[
				{name:'card_number', type: 'text', value: ''},
				{name:'active', type: 'code_type', code_type: 'active', value: ''},
				{name:'number_id', type: 'oid', value: ''},
				{name:'user_name', type: 'text', value: ''},
				{name:'first_name', type: 'text', value: ''},
				{name:'last_name', type: 'text', value: ''},
				{name:'middle_name', type: 'text', value: ''},
				{name:'gender', type: 'code_type', code_type: 'gender', value: ''},
				{name:'dob', type: 'date', value: ''},
				
			]
		},
		contact_infos:{
			title: "Contact Information",
			fields:[
				{name:'number_id', type: 'oid', value: ''},
				{name:'home_phone', type: 'text', value: ''},
				{name:'street', type: 'text', value: ''},
				{name:'ward', type: 'text', value: ''},
				{name:'district', type: 'text', value: ''},
			]
		},
		school_infos:{
			title: "School Related Information",
			fields:[
				{name:'number_id', type: 'oid', value: ''},
				{name:'home_school', type: 'code_type', code_type: 'home_school', value: ''},
				{name:'department',  type: 'code_type', code_type: 'department', value: ''},
				{name:'email', type: 'text', value: ''},
				{name:'position_email', type: 'text', value: ''},
				{name:'phone_extension', type: 'text', value: ''},
				{name:'supervisor', type: 'card_info', value: ''},
				{name:'account_type', type: 'code_type', code_type: 'account_type', value: ''},
				{name:'crisis_role', type: 'text', value: ''},
			]
		}
	};
	componentDidMount() {
	}
	// when value in autocomplete options is selected
	handleAutocompleteChange = (event, values) => {
		if(values){
			console.log(values);
			this.setState({
				selected_number_id: values.number_id,
				search_term: '',
				search_values: values
			});
		}
	}
	render() {
		return (
		<React.Fragment>
			<Grid container spacing={6}>
				<Grid item xs={12} lg={9} xl={3}>
					<Search searchTerm={this.state.search_term} onChange={()=>this.handleAutocompleteChange}/>
					<Typography gutterBottom variant="h6" component="h3" className={this.props.classes.CardTitle}>
						{this.state.search_values.title}
					</Typography>
				</Grid>
				<Grid item xs={12} lg={3} xl={3} className={this.props.classes.Avatar}>
					<Avatar alt="Lucy Lavender" src="https://cas.ssis.edu.vn/media/207845.JPG" />
				</Grid>
			</Grid>
			<Divider my={4} />
			<Grid container spacing={6}>
				<Grid item xs={12} lg={6} xl={3}>
					<CardInfo title={this.state.card_infos.title} fields={this.state.card_infos.fields} number_id={this.state.search_values.number_id} classes={this.props.classes}/>
				</Grid>
				<Grid item xs={12} lg={6} xl={3}>
				<CardInfo title={this.state.school_infos.title} fields={this.state.school_infos.fields} number_id={this.state.search_values.number_id} classes={this.props.classes}/>
				</Grid>
				<Grid item xs={12} lg={6} xl={3}>
				<CardInfo title={this.state.contact_infos.title} fields={this.state.contact_infos.fields} number_id={this.state.search_values.number_id} classes={this.props.classes}/>
				</Grid>
				<Grid item xs={12} lg={6} xl={3}>
					<ContactInfos number_id={this.state.search_values.number_id} classes={this.props.classes}/>
				</Grid>
				{/* <Grid item xs={12} lg={6} xl={3}>
					<CardInfo 
					fields={['street','ward','number_id']} number_id={this.state.search_values.number_id} classes={this.props.classes}/>
				</Grid>
				<Grid item xs={12} lg={6} xl={3}>
					<CardInfo fields={['district','home_phone','number_id']} number_id={this.state.search_values.number_id} classes={this.props.classes}/>
				</Grid> */}
				
			</Grid>
		</React.Fragment>
		);
	}
}
// export default Profile;
export default withStyles(styles)(CardInfos);
