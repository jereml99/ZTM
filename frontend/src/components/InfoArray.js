import React, { Component } from 'react';
import Select from 'react-select'

export default class InfoArray extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div>tab</div>
                {this.props.array.map((el, j) => (
                    <ul>
                        <li>{el.id}</li>
                    </ul>
                    // <div key={i}>

                    // </div>
                ))}
            </>
        )
    }
}