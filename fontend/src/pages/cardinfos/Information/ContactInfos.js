import React, { Component } from "react";
import styled from "styled-components";
import { withStyles } from '@material-ui/styles';
import fetchAPI from '../../../helpers/fetch'
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import PublishIcon from '@material-ui/icons/Publish';
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
    // if (!status) return false;
    return (
        <Table key={'row11-'}> 
          <TableBody key={'row1-2'}>
            {Object.keys(cardinfo).map((item, i)=> (
                item=='number_id' ? null:
                <CustomTableRow key={'customtablerow' + item}>
                    <CustomTableCell key={'customtablecell1' + item} component="th" scope="row" >
                        {item.replace("_", " ")}
                    </CustomTableCell>
                    {
                        isEdit?
                        <CustomTableCell key={'customtablecell2' + item} align="right">
                        {
                            <TextField key={'textfield' + item}
                            variant="outlined"
                            value={cardinfo[item]}
                            size="small"
                            margin='dense'
                            InputProps={{
                                classes: {
                                    input: classes.TextField,
                                }
                            }}
                            onChange={(evt) => {
                                this.props.onChange({[item]:evt.target.value})
                            }}/>
                        }
                        </CustomTableCell>:
                        <CustomTableInfo key={'customtablecell2' + item} component="th" scope="row" >
                        {cardinfo[item]}

                        </CustomTableInfo>
                    }
                </CustomTableRow>
              	
            ))}
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
		fields:{
            number_id:'',
			street: '',
            ward: '',
            district: '',
            home_phone: ''
		}
		
	};
	componentWillReceiveProps(nextProps) {
		if(nextProps.number_id){
			this.setState({number_id:nextProps.number_id},()=>{
				this.refresh();
			})
		}
	}
	refresh = () => {
		fetchAPI('/get_cardinfo_based_on_number_id?', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			params:{
				number_id: this.state.number_id
			}
		}).then(res =>{
            var fields = this.state.fields;
            var keyNames = Object.keys(fields);
            for (let keyName of keyNames){
                fields[keyName] = res.data[0][keyName];
            }
        	this.setState({fields});
		})
	}
	handleCancel = name => event => {
		this.refresh();
		this.setState({isEdit:!this.state.isEdit})
	};
	submitInfo = name => event => {
		if(this.state.isEdit){
			fetchAPI(`/api/cardinfos/${this.state.fields.number_id}/` , {
				method: 'PUT',
				headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(this.state.fields)
			}).then(res =>{
			})
		}
		this.setState({isEdit:!this.state.isEdit})
	};
	handleChange = (field) => {
		var keyName = Object.keys(field)[0];
		var fields = this.state.fields;
		fields[keyName] = field[keyName]
		this.setState({
		  	fields
		});
	}
	render() {
    const { classes } = this.props;
		return (
		<Card mb={6} className={classes.Card}>
            <CardActions className={classes.CardAction}>
                <Typography gutterBottom variant="h6" component="h3" className={classes.CardTitle}>
                    Home Address
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
                    <ChangeInfo classes = {classes} isEdit={this.state.isEdit} cardinfo={this.state.fields} onChange={field => this.handleChange(field)}/>
				</Grid>
			</CardContent>
			
		</Card>
		);
  	}
}
  
export default CardInfo;
