import React, { useState, useEffect } from 'react';
import StockSearchBar from '../components/StockSearchBar';
import '../styles/App.css';

function convertToSelectOptions(data) {
	let assets = data.assets_names;
	var arr = [];

	if (data && assets.length > 0) {
		for (let index = 0; index < assets.length; index++) {
			if (assets[index].token !== undefined) {
				arr.push({ label: assets[index].token, value: assets[index].token });
			}
		}
	}

	return arr;
}


async function requestModelOutput(endpoint, params) {
	let responseWithTwitter;
	let responseWithoutTwitter;

	params.is_twitter = true;
	await makeFetch(endpoint, params)
		.then(response => responseWithTwitter = response)
		.catch("error");

	params.is_twitter = false;
	await makeFetch(endpoint, params)
		.then(response => responseWithoutTwitter = response)
		.catch("error");

	let state =
	{
		responseWithTwitter: responseWithTwitter,
		responseWithoutTwitter: responseWithoutTwitter
	};

	return state;
}

function makeFetch(endpoint, params) {

	const requestOptions = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	};

	let result = fetch(endpoint, requestOptions)
		.then(response => response.json())
		.catch(err => alert('There was an error:' + err));

	return result;
}

export default function NNModelForm() {

	const endpoint = "/train";
	const [userChosenToken, setToken] = useState("");
	const [isTokenValid, setTokenValid] = useState(true);
	const [companyName, setTokenCompanyName] = useState("");
	const [validDateRange, setValidDateRange] = useState({ startTime: new Date(), endTime: new Date() });
	const [assets, setAssets] = useState(null);
	const [assetsSelectList, setAssetsSelectList] = useState(null);

	useEffect(() => {
		function fetchData() {
			fetch("/assets")
				.then(res => res.json())
				.then(response => processResponse(response))
				.catch(error => console.log(error));
		}
		fetchData();
	}, []);

	function processResponse(response) {
		setAssetsSelectList(convertToSelectOptions(response));
		setAssets(response.assets_names);
	}

	const handleSelectStock = (userSelect) => {
		setToken(userSelect.value);
		setTokenValid(true);
		setTokenCompanyName(userSelect.label);
		console.log(validDateRange);
	}

	async function handleSubmit(event) {

		event.preventDefault();

		var nrOfLayers = event.target.nrOfLayers;

		if (true) {
			alert("ok!");
		}
	}

	return (
		<>
			<form id='stock_form' onSubmit={handleSubmit}>

				<StockSearchBar
					chosenCompanyName={companyName}
					onSelectStock={handleSelectStock}
					isTokenValid={isTokenValid}
					assetsSelectList={assetsSelectList}
				/>

				<div className='submit_input_div'><input type="submit" defaultValue="Send" /></div>

			</form>
		</>
	);
}