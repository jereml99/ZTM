import React, { Component } from 'react';
import Select from 'react-select'

function filterOptions(assets, filterText) {

	var filteredOptions = [{}];
	var filterTextLowercase = filterText.toLowerCase();

	for (let index = 0; index < assets.length; index++) {

		const asset = assets[index];
		var elementLowercase = asset.label.toLowerCase();

		if (elementLowercase.indexOf(filterTextLowercase) !== -1) {
			filteredOptions.push(asset);
		}
	}

	return filteredOptions;
}

export default class BusStopSearchBar extends Component {

	constructor(props) {
		super(props);

		this.state = {
			filterText: '',
			displayedData: [{}]
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSelectBusSop = this.handleSelectBusSop.bind(this);
	}

	componentDidUpdate() {
		if (this.props.busStopList !== undefined) {
			if (this.props.busStopList !== this.state.displayedData) {
				this.setState({ displayedData: this.props.busStopList });
			}
		}
	}

	handleSelectBusSop(userSelect) {
		this.props.onSelectBusStop(userSelect);
	}

	handleInputChange(filterText) {

		this.setState({ filterText: filterText })

		if (filterText.length > 0) {
			let filterData = filterOptions(this.state.displayedData, filterText);
			this.setState({ displayedData: filterData });
		}
		else {
			this.setState({ displayedData: this.props.busStopList });
		}
	}

	render() {
		return (
			<>
				<div>
					<div className='div_for_my_label'><label className='my_label'>Choose bus stop</label></div>

					<Select
						className='select_component'
						value={{ value: this.props.busStopName, label: this.props.busStopName }}
						options={this.state.displayedData}
						onChange={this.handleSelectBusSop}
						onInputChange={this.handleInputChange}
						placeholder={'Search...'}
					/>

					{(!this.props.isBusStopChosen) ? <span style={{ color: "red" }}><div>Choose bus stop!</div></span> : <></>}
				</div>
			</>
		)
	}
}