import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, Route} from "react-router-dom";
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

    poolParameters = (description) => {
        const split = description.split(/%parameters%/);

        const parameters = split[1].split(', ');

        const firstPart = split[0].substring(0, split[0].length - 3);

        const list = parameters.map(parameter => {
            const parameterNoP = parameter.replace(/\.<\/p>\n/, '');
            return `<li>${parameterNoP}</li>`
        });
        const lastPart = `<ul class="pool-parameters">${list.toString().replace(/,/g, '')}</ul>`;

        return firstPart + '<p>Параметры бассейна:</p>' + lastPart;
    };

    getLayoutByDescription = (room) => {
        const {name, description, isAdditionTo} = room;

        const clearDescription = description.indexOf('%parameters%') === -1
            ? description
            : this.poolParameters(description);

        const withStyle = clearDescription
            .replace(/<p/g, '<p class="info-paragraph"')
            .replace(/ ?<a/g, ' <a class="turquoise-hover" rel="noopener noreferrer" target="_blank"');

        const imageURL = 'http://siburarenda.publicvm.com/img/' + room.getURL(2) + 'HeaderPh.jpg';
        return <div className='info-container'>
            <h1>{name.startsWith('VIP') ? 'VIP ложи' : name}</h1>
            <Link
                to='/rooms'
                id='back-to-rooms'
                onMouseEnter={e => this.props.showHint(e, 'backToRooms')}
                onMouseLeave={() => this.props.closeHint()}
                onClick={() => this.props.closeHint()}
            >
            </Link>
            <img
                src={imageURL}
                alt={name}
                className='header-photo'
            />
            <div dangerouslySetInnerHTML={{__html: withStyle}}>
            </div>
            {
                isAdditionTo === 'independent'
                    ? null
                    :
                    <div
                        className='flex-container addition-to-inside'
                    >
                        <label>Это дополнительное помещение к</label>
                        <Link
                            to={`/${isAdditionTo.replace(/ /g, '_')}`}
                            className='turquoise-hover'
                        >
                            {
                                isAdditionTo
                                    .replace('ая', 'ой')
                                    .replace(/а$/, 'е')
                                    .replace(/и$/, 'ам')
                            }
                        </Link>
                    </div>
            }
        </div>
    }
}

EachRoom.propTypes = {
    roomArray: PropTypes.array.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default EachRoom;