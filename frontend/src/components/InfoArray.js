import React from 'react';

function InfoArray(props) {

    return (
        <>
            <table style={{ width: "100%" }}>
                <thead>
                    <tr style={{}}>
                        <th>Line</th>
                        <th>Direction</th>
                        <th>Estimated time</th>
                        <th>Theoretical time</th>
                    </tr>
                </thead>
                {
                    props.array.map((item, j) => (
                        <tbody key={j} style={{ textAlign: "center" }}>
                            <tr>
                                <td>{item.routeId}</td>
                                <td>{item.headsign}</td>
                                <td>{item.estimatedTime}</td>
                                <td>{item.theoreticalTime}</td>
                            </tr>
                        </tbody>

                    ))
                }
            </table>

            {/* <ul key={j}>
                    <li>{`Line: ${el.routeId}, to: ${el.headsign}, estimatedTime: ${el.estimatedTime}, theoreticalTime: ${el.theoreticalTime}`}</li>
                </ul> */}
        </>
    )
}

export default InfoArray;