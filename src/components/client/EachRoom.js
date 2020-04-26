import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Route} from "react-router-dom";
import '../../resource/styles/Rooms.css'

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
        const split = description.split(/<\/?p>/).filter(word => word !== '');
        return <div className='info-container'>
            <h1>{name.startsWith('VIP') ? 'VIP ложи' : name}</h1>
            <img
                src='https://gorbilet.com/static/media/places/ea338e5837d38b5c719d8ea44bdf7ccc.jpg' // TODO: replace this with dynamic url when Valera finishes work on server
                alt='arena'
                className='header-photo'
            />
            {split.map(paragraph => <p key={paragraph[0] + split.indexOf(paragraph)}
                                       className='info-paragraph'>{paragraph}</p>)}
        </div>
    }
}

EachRoom.propTypes = {
    roomArray: PropTypes.array.isRequired
};

export default EachRoom;