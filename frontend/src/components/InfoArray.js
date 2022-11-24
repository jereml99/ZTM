import React, { Component } from 'react';
import Select from 'react-select'

export default class InfoArray extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                {this.props.array.map((el, j) => (
                    <ul key={j}>
                        <li>{`Line: ${el.routeId}, to: ${el.headsign}, estimatedTime: ${el.estimatedTime}, theoreticalTime: ${el.theoreticalTime}`}</li>
                    </ul>
                ))}
            </>
        )
    }
}