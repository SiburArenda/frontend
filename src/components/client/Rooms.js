import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dropdown from "../Dropdown";
import '../../resource/styles/Rooms.css'
import {Link} from "react-router-dom";

class Rooms extends Component {

    state = {
        tags: [],
        searchString: ''
    };

    allTags = [];

    constructor(props) {
        super(props);

        const roomArray = this.props.roomArray.slice();

        for (let i in roomArray) {
            const tags = roomArray[i].tags;
            for (let j in tags) {
                if (!this.allTags.includes(tags[j])){
                    this.allTags.push(tags[j]);
                }
            }
        }
    }

    rentGiverLink = (room) => {
        const description = room.description;
        const link = description.replace(/.*(<a href=')|('>http.*)/g, '');
        return <a
            href={link}
            rel="noopener noreferrer"
            target='_blank'
            className='turquoise-hover'
        >
            {link}
        </a>
    };

    getRoomLayout = (room) => {
        if (room.name.endsWith('13 персон')) {
            return null;
        }

        const name = room.name.startsWith('VIP') ? 'VIP ложи' : room.name;

        const imageURL = 'HERE THE BASE URL WILL BE' + room.getURL(2) + '.jpg'; //TODO: dynamic url gonna be taken from here

        const noP = room.description.replace(/<\/?p>/g, '');
        const dots = noP.split(/\. ?(?=[А-ЯЁ])/);

        let descriptionPreview = '';

        const firstSentence = dots[0];
        if (firstSentence.length <= 180 && firstSentence.length >= 100) {
            descriptionPreview = firstSentence;
        } else if (firstSentence.length < 100) {
            descriptionPreview = firstSentence + '. ' + dots[1]
        } else {
            const comma = firstSentence.lastIndexOf(',');
            descriptionPreview = firstSentence.substring(0, comma);
            if (descriptionPreview.length > 180) {
                const comma2 = descriptionPreview.lastIndexOf(', ');
                descriptionPreview = descriptionPreview.substring(0, comma2);
            }
        }

        return <div
            key={name}
            className='room-in-list'
        >
            <img
                src='https://gorbilet.com/static/media/places/ea338e5837d38b5c719d8ea44bdf7ccc.jpg' // TODO: replace this with dynamic url when Valera finishes work on server
                alt='arena'
                className='header-photo-small'
            />

            <div
                className='room-short-about'
            >
                <h2>{name}</h2>

                <p>{descriptionPreview + '...'}</p>

                {
                    room.tags.includes('Сторонний арендодатель')
                        ?
                        <div
                            className='flex-container rent-giver'
                        >
                            <label>Сайт арендодателя:  </label>
                            {this.rentGiverLink(room)}
                        </div>
                        : null
                }

                <Link
                    to={`/${room.getURL()}`}
                    className='turquoise-hover room-link'
                >
                    Читать далее
                </Link>
            </div>

        </div>
    };

    render() {

        const filteredRooms = this.props.roomArray.filter(roomInfo => {
            for (let i in this.state.tags) {
                if (!roomInfo.tags.includes(this.state.tags[i])) {
                    return false;
                }
            }

            const searchString = this.state.searchString.toLowerCase();

            const inName = roomInfo.name.toLowerCase().indexOf(searchString) !== -1;

            let inTags = false;
            for (let i in roomInfo.tags) {
                if (roomInfo.tags[i].toLowerCase().indexOf(searchString) !== -1) {
                    inTags = true;
                    break;
                }
            }

            const noHTMLDescription = roomInfo.description.replace(/(<\/?[A-za-z:/='. ]*>)|(%parameters%)/g, '');
            const inDescription = noHTMLDescription.toLowerCase().indexOf(searchString) !== -1;

            const sameAmount = searchString === roomInfo.amount + '';

            const inAdditions = roomInfo.isAdditionTo !== 'independent' && roomInfo.isAdditionTo.toLowerCase().indexOf(searchString) !== -1;

            return inName || inTags || inDescription || sameAmount || inAdditions;
        });

        const roomDisplay = filteredRooms.map(room => this.getRoomLayout(room));

        return (
            <div
                className='info-container'
            >
                <div className='flex-container flex-end'>
                    <div id='search-icon'>
                    </div>
                    <input
                        type='text'
                        className='search'
                        name='searchString'
                        onChange={e => this.handleInput(e)}
                    />
                    <label id='divider'>|</label>
                    <Dropdown
                        header='Искать по тэгам'
                        options={this.allTags.map(tag => {return {rusName: tag, additional: null}})}
                        onChoose={this.addTag}
                        withButton={false}
                        showHint={this.props.showHint}
                        closeHint={this.props.closeHint}
                    />
                </div>
                {roomDisplay}
            </div>
        );
    }

    handleInput = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };

    addTag = (tag) => {
        this.setState({
            tags: [...this.state.tags, tag.rusName]
        })
    };
}

Rooms.propTypes = {
    roomArray: PropTypes.array.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default Rooms;