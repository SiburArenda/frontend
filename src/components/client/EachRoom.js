import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from "react-router-dom";

class EachRoom extends Component {

    render() {
        return (
            <React.Fragment>
                {this.props.roomArray.map(room => {
                        return room.name.endsWith('13 персон')
                            ? null
                            : <Route
                                key={room.serverName}
                                path={`/${room.getURL()}`}
                                render={
                                    () => this.getLayoutByDescription(room)
                                }
                            />
                    }
                )}
            </React.Fragment>
        );
    }

    getLayoutByDescription = (room) => {
        const {name, description} = room;
        if (name.startsWith('VIP')) {
            console.log(description)
        }
        const split = description.split(/<\/?p>/).filter(word => word !== '');
        return <div className='info-container'>
            <h2>{name.startsWith('VIP') ? 'VIP ложи' : name}</h2>
            {split.map(paragraph => <p key={paragraph[0] + split.indexOf(paragraph)}
                                       className='info-paragraph'>{paragraph}</p>)}
        </div>
    }
}

EachRoom.propTypes = {
    roomArray: PropTypes.array.isRequired
};

export default EachRoom;