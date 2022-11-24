import React, { useState, useEffect } from 'react';
import '../styles/App.css';
import BusStopSearchBar from '../components/BusStopSearchBar';
import InfoArray from '../components/InfoArray';
import { useLocation } from 'react-router-dom';

// class Model {

// 	constructor(modelName) {

// 		var array = modelName.split('_');
// 		var params = adjustArray(array);

// 		this.token = params[0];
// 		this.startTime = params[1];
// 		this.endTime = params[2];
// 		this.nrOfLayers = params[3];
// 		this.learningRate = params[4];
// 		this.nrOfHiddenDimensions = params[5];
// 		this.lookBack = params[6];
// 		this.batchSize = params[7];
// 		this.isTwitter = params[8];
// 		this.modelName = modelName;
// 	}
// }

// function adjustArray(array) {
// 	array[8] = array[8].toLowerCase();

// 	return array;
// }

// function createJsonObjects(response) {

// 	var models = [];

// 	response.forEach(element => {
// 		var model = new Model(element);
// 		models.push(model);
// 	});

// 	return models;
// }

function convertToSelectOptions(data) {
	let stops = Object.values(data)[0].stops; // take first
	var arr = [];

	for (let index = 0; index < stops.length; index++) {
		const stop = stops[index];

		if (stop.stopName !== null && stop.stopId !== null) {
			arr.push({ label: stop.stopName, value: stop.stopId });
		}
	}

	return arr;
}


const Board = () => {

	const [radioChoice, setRadioChoice] = useState({ arrayIndex: -1, radioValue: false });
	const [isRadioChosen, setIsRadioChosen] = useState(true);
	//const [models, setModels] = useState([]);
	const [busStopId, setBusStopId] = useState(0);
	const [isTokenValid, setTokenValid] = useState(true);
	const [busStopName, setBusStopName] = useState("");
	const [busStopList, setBusStopList] = useState(null);
	const [userInfoArrays, setUserInfoArrays] = useState([]);
	const userData = useLocation().state;

	useEffect(() => {
		function fetchData() {
			fetch("/busstops")
				.then(res => res.json())
				.then(response => processResponse(response))
				.catch(error => console.log(error));
		}
		fetchData();
	}, []);

	useEffect(() => {
		function fetchData() {
			fetch(`/listuserbusstops/${userData.id}`)
				.then(res => res.json())
				.then(response => setUserInfoArrays(response))
				.catch(error => console.log(error));
		}
		fetchData();
	}, []);

	function processResponse(response) {
		setBusStopList(convertToSelectOptions(response));
	}
	const handleSelectStock = (userSelect) => {
		setBusStopName(userSelect.label);
		setBusStopId(userSelect.value);
		setTokenValid(true);
	}

	const onRadioChosen = (event) => {
		setRadioChoice({ radioValue: event.target.value });

	}

	async function handleAddStop(event) {

		event.preventDefault();

		if (true) {

			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			};

			await fetch(`/addbusstop?userId=${userData.id}&busStopId=${busStopId}`, requestOptions)
				.then(response => console.log(response))
				.catch(error => console.log(error));

			// await fetch(`/stopinfo/${busStopId}`)
			// 	.then(res => res.json())
			// 	.then(response => processResponse(response))
			// 	.catch(error => console.log(error));

			//alert("ok!");
		}
	}

	async function makeFetch() {

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ model_name: radioChoice.modelName })
		};

		let response = await fetch('/predict', requestOptions)
			.then(response => response.json())
			.catch(err => alert('There was an error:' + err));

		return response;
	}

	return (
		<>
			<div>
				<div>{"Hello " + userData.login}</div>
				<form id='stock_form' onSubmit={handleAddStop}>

					<BusStopSearchBar
						chosenCompanyName={busStopName}
						onSelectStock={handleSelectStock}
						isTokenValid={isTokenValid}
						busStopList={busStopList}
					/>

					<div className='submit_input_div'><input type="submit" value={"Add stop"} /></div>

				</form>

				<div className='radio-options'>
					{userInfoArrays.map((array, i) => (
						<div key={i}>
							<label className="radioInput">
								<input
									type="radio"
									name="tableRadio"
									value="one_value"
									checked={radioChoice.radioValue === i}
									onChange={onRadioChosen}
									id={i}
								/>
								<div>
									aaa
									{/* <InfoArray
										array={array}
									/> */}
								</div>
							</label>
						</div>
					))}
				</div>

				{/* <div className='radio-options'>
					{models.map((item, i) => (
						<div key={i}>
							<input
								type="radio"
								name="modelRadio"
								value={item.modelName}
								checked={radioChoice.radioValue === item.modelName}
								onChange={(e) => setRadioChoice({
									modelName: item.modelName,
									radioValue: e.target.value,
									radioId: i
								})}
								id={i}
							/>
							<label htmlFor={i}>{"token: " + item.token + ", start time: " + item.startTime + ", end time: " + item.endTime + ", is twitter: " + item.isTwitter}</label>
						</div>
					))}
				</div> */}
			</div>
		</>
	);
};

export default Board;