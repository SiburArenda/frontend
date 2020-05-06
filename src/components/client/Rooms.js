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
        const addTo = room.isAdditionTo;

        const imageURL = 'http://siburarenda.publicvm.com/img/' + room.getURL(2) + 'HeaderPh.jpg';

        const noP = room.description.replace(/<\/?p>/g, '');
        const dots = noP.split(/\. ?(?=[А-ЯЁ])/);

        let descriptionPreview = '';

        let firstSentence = dots[0];
        if (firstSentence.length <= 180 && firstSentence.length >= 100) {
            descriptionPreview = firstSentence;
        } else if (firstSentence.length < 100) {
            descriptionPreview = firstSentence + '. ' + dots[1]
        } else {
            while(firstSentence.length > 180) {
                const comma = firstSentence.lastIndexOf(',');
                firstSentence = firstSentence.substring(0, comma);
            }
            descriptionPreview = firstSentence;
        }

        return <div
            key={name}
            className='room-in-list'
        >
            <img
                src={imageURL}
                alt={name}
                className='header-photo-small'
            />

            <div
                className='room-short-about'
            >
                <h2>{name}</h2>

                <p style={{userSelect: 'auto'}}>{descriptionPreview + '...'}</p>

                {
                    addTo === 'independent'
                        ? null
                        :
                        <div
                            className='flex-container additional-room-info'
                        >
                            <label>Это дополнительное помещение к</label>
                            <Link
                                to={`/${addTo.replace(/ /g, '_')}`}
                                className='turquoise-hover'
                            >
                                {
                                    addTo
                                        .replace('ая', 'ой')
                                        .replace(/а$/, 'е')
                                        .replace(/и$/, 'ам')
                                }
                            </Link>
                        </div>
                }

                {
                    room.tags.includes('Сторонний арендодатель')
                        ?
                        <div
                            className='flex-container additional-room-info'
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

        if (this.allTags.length === 0) {
            for (let i in this.props.roomArray) {
                const tags = this.props.roomArray[i].tags;
                for (let j in tags) {
                    if (!this.allTags.includes(tags[j])){
                        this.allTags.push(tags[j]);
                    }
                }
            }
        }

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
                <h1>Помещения</h1>
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
                {
                    this.state.tags.length === 0
                        ?
                        null
                        :
                        <div className='map-display'>
                            <label style={{marginRight: '8px'}}>Тэги:</label>
                            {
                                this.state.tags.map(
                                    tag =>
                                        <span
                                            key={tag}
                                            className='map-span'
                                            style={{order: tag.length}}
                                        >
                                            {tag}
                                            <button
                                                className='remove-btn'
                                                onClick={() => this.removeTag(tag)}
                                            >{''}
                                            </button>
                                        </span>
                                )
                            }
                        </div>
                }
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
        if (!this.state.tags.includes(tag.rusName)) {
            this.setState({
                tags: [...this.state.tags, tag.rusName]
            })
        }
    };

    removeTag = (tag) => {
        const noTag = this.state.tags.slice();
        const index = noTag.indexOf(tag);
        noTag.splice(index, 1);
        this.setState({
            tags: noTag
        })
    }
}

Rooms.propTypes = {
    roomArray: PropTypes.array.isRequired,
    showHint: PropTypes.func.isRequired,
    closeHint: PropTypes.func.isRequired
};

export default Rooms;