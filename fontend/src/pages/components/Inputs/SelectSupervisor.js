import React from "react";
import { withStyles } from '@material-ui/styles';
import styled from 'styled-components';
import {
  TextField,
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import fetchAPI from '../../../helpers/fetch'
const styles = theme => ({
  TextField: {
    fontSize: 13,

  },
});
const Label = styled('label')`
  padding: 5px 0 0 0;
  text-align: left;
  line-height: 1.5;
  display: block;
`;
class Search extends React.Component {
	constructor(props) {
		super(props);
		
	}
	state = {
		options: [],
		search_term_query: '',
		selected_supervisor: {
			number_id: '',
			title: ''
		}
	};
	componentDidMount() {
    }
	// when value in Input change
	handleSearchOnChange(event) {
		this.setState({
			search_term_query: event.target.value },()=>{
				this.refreshSearchData();
		})
	};
	refreshSearchData(){
		fetchAPI('/get_cardinfos_based_on_search_term?', {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			params:{
				search_term:this.state.search_term_query
			}
		}).then(res =>{
			var options = []
			var cardinfos = res.data;
			for(let cardinfo of cardinfos){
				let option = {
					number_id: cardinfo.number_id,
					title: `${cardinfo.name} | ${cardinfo.number_id} | ${cardinfo.user_name} `
				}
				options.push(option)
			}
			this.setState({options});
		})
	}
	render() {
		return (
			<Autocomplete
				title='supervisor'
				options={this.state.options}
				getOptionLabel={option => option.title}
                onChange={this.props.onChange()}
				clearOnEscape={true}
				renderInput={params => (
					<div>
						<Label>{this.props.selected_supervisor.title}</Label>
						<TextField {...params}
							onChange = {(evt) => this.handleSearchOnChange(evt)}
							variant="outlined" size="small" margin='dense' fullWidth/>
					</div>
						
					)}
			/>
		);
	}
}
export default withStyles(styles)(Search);
