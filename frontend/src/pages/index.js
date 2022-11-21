import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

const LoginUser = () => {

    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onLoginChange = (query) => {
        setLogin(query.target.value);
    }

    const onPasswordChange = (query) => {
        setPassword(query.target.value);
    }

    async function checkIfUserIsValid(userData) {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        };

        return fetch('/login', requestOptions);
    }

    async function handleSubmit(event) {

        event.preventDefault();

        if (login !== undefined && login.length > 0 &&
            password !== undefined && password.length > 0) {

            //alert("ok");
            let userData = { login: login, password: password };

            checkIfUserIsValid(userData).then(function (response) {
                if (!response.ok) {
                    // make the promise be rejected if we didn't get a 2xx response
                    window.location.reload(false);
                    return false;
                } else {
                    alert(`ok`);
                    userData.id = response;
                    navigate('/board', { userData });
                }
            }).catch(function (err) {
                alert('There was an error:' + err);
                window.location.reload(false);
                return false;
            });
        }
    }

    return (
        <>
            <form id='stock_form' onSubmit={handleSubmit}>
                <div className='div_for_my_label'><label className='my_label'>Login</label> </div>
                <input name="queryText" type="text" onChange={onLoginChange}></input>

                <div className='div_for_my_label'><label className='my_label'>Password</label> </div>
                <input name="bearerToken" type="password" onChange={onPasswordChange}></input>

                <div className='submit_input_div'><input type="submit" defaultValue="Send" /></div>
            </form>
        </>
    );
};

export default LoginUser;
