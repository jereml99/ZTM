import React, { Component } from 'react';
import "../styles/navBar.css"

export default class Navbar extends Component {
	render() {
		return (
			<div className="navigation">
				<ul className='myUL'>
					{/* className="active"  */}
					<li><a href="/loginUser">Login</a></li>
					<li><a href="/nnModelForm">Add bus stop</a></li>
					<li><a href="/board">Board</a></li>
				</ul>
			</div>
		);
	}
};
