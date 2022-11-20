import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import StockSearchBar from '../components/StockSearchBar';

class Model {

	constructor(modelName) {

		var array = modelName.split('_');
		var params = adjustArray(array);

		this.token = params[0];
		this.startTime = params[1];
		this.endTime = params[2];
		this.nrOfLayers = params[3];
		this.learningRate = params[4];
		this.nrOfHiddenDimensions = params[5];
		this.lookBack = params[6];
		this.batchSize = params[7];
		this.isTwitter = params[8];
		this.modelName = modelName;
	}
}

function adjustArray(array) {
	array[8] = array[8].toLowerCase();

	return array;
}

function createJsonObjects(response) {

	var models = [];

	response.forEach(element => {
		var model = new Model(element);
		models.push(model);
	});

	return models;
}

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


const Board = () => {

	const [radioChoice, setRadioChoice] = useState({ modelName: '', radioValue: false, radioId: -1 });
	const [isRadioChosen, setIsRadioChosen] = useState(true);
	const [models, setModels] = useState([]);
    const navigate = useNavigate();
    
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
	useEffect(() => {
		function fetchData() {
			fetch("/models")
				.then(res => res.json())
				.then(response => setModels(createJsonObjects(response.model_names)))
				.catch(error => console.log(error));
		}
		fetchData();
	}, []);

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

	async function handleSubmit(event) {

		event.preventDefault();

		if (radioChoice.radioId !== -1) {

			//alert(`Submitting prediction request for model: ${event.target[radioChoice.radioId].value}`);
			let response = await makeFetch();

			setIsRadioChosen(true);
			var chosenModel = new Model(radioChoice.modelName);
			let state = {
				modelPrediction: response.model_prediction,
				token: chosenModel.token
			};
			navigate('/predictOutput', { state });
		}
		else {
			setIsRadioChosen(false);
		}
	}

	return (
		<>
            <div>
                
                <form id='stock_form' onSubmit={handleSubmit}>

                    <StockSearchBar
                        chosenCompanyName={companyName}
                        onSelectStock={handleSelectStock}
                        isTokenValid={isTokenValid}
                        assetsSelectList={assetsSelectList}
                    />

                    <div className='submit_input_div'><input type="submit" defaultValue="Add bus stop" /></div>

			    </form>

                <div className='radio-options'>
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
                </div>
			</div>
		</>
	);
};

export default Board;