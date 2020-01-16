import React from "react";
import { withStyles } from '@material-ui/styles';
import {
  TextField
} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import fetchAPI from './../../helpers/fetch'
const styles = theme => ({
  TextField: {
    fontSize: 13,

  },
});
class Search extends React.Component {
	constructor(props) {
		super(props);
		
	}
	state = {
		options: [],
		search_term: '',
		search_term_query: '',
	};
	componentDidMount() {
    }
    componentWillReceiveProps(nextProps) {
        this.setState({search_term: nextProps.searchTerm})
    }
	// when value in Input change
	handleSearchOnChange(event) {
		this.setState({search_term: event.target.value,
			search_term_query: event.target.value },()=>{
				this.refreshSearchData();
			})
	};
	handleSearchOnClick() {
		this.refreshSearchData()
	}
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
					title: `${cardinfo.name} | ${cardinfo.number_id} | ${cardinfo.user_name} | ${cardinfo.card_number} | ${cardinfo.description} | ${cardinfo.email} `
				}
				options.push(option)
			}
			this.setState({options});
		})
	}
	render() {
		return (
			<Autocomplete
				options={this.state.options}
				getOptionLabel={option => option.title}
                onChange={this.props.onChange()}
				clearOnEscape={true}
				inputValue={this.state.search_term}
				renderInput={params => (
				<TextField {...params}
					onChange = {(evt) => this.handleSearchOnChange(evt)}
					onClick = {(evt) => this.handleSearchOnClick(evt)}
					label="Name | Username | ID Number | Card Number | Description | Email"
					variant="outlined" size="small" margin='dense' fullWidth/>
			    )}
			/>
		);
	}
}
export default withStyles(styles)(Search);
