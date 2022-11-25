import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BusStopSearchBar from '../components/BusStopSearchBar';
import InfoArray from '../components/InfoArray';
import '../styles/App.css';

function convertToSelectOptions(data) {
	let stops = Object.values(data)[0].stops; // take first
	var arr = [];

	for (let index = 0; index < stops.length; index++) {
		const stop = stops[index];

		if (stop.stopName !== null && stop.stopId !== null) {
			let customLabel = `${stop.stopName} (id: ${stop.stopId})`;
			arr.push({ label: customLabel, value: stop.stopId });
		}
	}

	return arr;
}


const Board = () => {

	const [radioChoice, setRadioChoice] = useState({ busStopId: '', arrayIndex: -1, radioValue: false });
	const [isRadioChosen, setIsRadioChosen] = useState(true);
	const [isBusStopChosen, setIsBusStopChosen] = useState(true);
	const [busStopId, setBusStopId] = useState(-1);
	const [busStopName, setBusStopName] = useState("");
	const [busStopList, setBusStopList] = useState([]);
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
				.then(response => processUserInfoArray(response))
				.catch(error => console.log(error));
		}
		fetchData();
	}, []);

	function processUserInfoArray(response) {
		let processedArray = [];
		for (let index = 0; index < response.length; index++) {
			if (response[index].Delays.length > 0) {
				processedArray.push(response[index]);
			}
		}

		setUserInfoArrays(processedArray);
	}

	function processResponse(response) {
		setBusStopList(convertToSelectOptions(response));
	}
	const handleSelectBusStop = (userSelect) => {
		setBusStopName(userSelect.label);
		setBusStopId(userSelect.value);
		setIsBusStopChosen(true);
	}

	const onRadioChoose = (event, id, stopId) => {
		setRadioChoice({ busStopId: stopId, arrayIndex: id, radioValue: event.target.value });
		setIsRadioChosen(true);
	}

	async function handleAddStop(event) {

		event.preventDefault();

		if (busStopId > -1) {

			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' }
			};

			await fetch(`/addbusstop?userId=${userData.id}&busStopId=${busStopId}`, requestOptions)
				.then(_ => window.location.reload(false))
				.catch(error => console.log(error));
		}
	}

	async function handleDeleteStop() {

		if (isRadioChosen) {

			const requestOptions = {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' }
			};

			await fetch(`/deletebusstop?userId=${userData.id}&busStopId=${radioChoice.busStopId}`, requestOptions)
				.then(_ => window.location.reload(false))
				.catch(error => console.log(error));
		}
	}

	return (
		<>
			<div>
				<div>{"Hello " + userData.login}</div>
				<form id='my_form' onSubmit={handleAddStop}>

					<BusStopSearchBar
						busStopName={busStopName}
						onSelectBusStop={handleSelectBusStop}
						isBusStopChosen={isBusStopChosen}
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
									// value="one_value"
									checked={radioChoice.arrayIndex === i}
									onChange={event => onRadioChoose(event, i, array.StopId)}
									id={i}
								/>
								<div>
									<h4>{`stop id: ${array.StopId}`}</h4>
									<InfoArray
										array={array.Delays}
									/>
								</div>
							</label>
						</div>
					))}
				</div>

				<button onClick={handleDeleteStop}>Delete stop</button>
			</div>
		</>
	);
};

export default Board;