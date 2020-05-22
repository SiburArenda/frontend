import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/Main.css'
import {getEventTypeByID} from '../../functional/Design';
import {Link} from 'react-router-dom';
import Calendar from './Calendar';
import {roomArrayFormation} from '../../functional/RoomInfo';

class SentApplicationView extends Component {

    constructor(props) {
        super(props);

        const prevState = sessionStorage.getItem('SentApplicationView');
        if (prevState != null) {
            this.state.application = JSON.parse(prevState);
        } else {
            this.decideApplication();
        }
    }

    decideApplication = () => {
        const id = +this.props.match.params.id;
        const {applications} = this.props;
        for (let i in applications) {
            if (applications[i].id === id) {
                try {
                    this.state.application = applications[i];
                } catch (e) {
                    this.setState({
                        application: applications[i]
                    })
                }
                break;
            }
        }
    };

    state = {
        application: null
    };

    componentDidMount() {
        window.addEventListener('beforeunload', this.saveState, false);
    }

    saveState = () => {
        if (this.state.application != null) {
            sessionStorage.setItem('SentApplicationView', JSON.stringify(this.state.application));
        }
    };

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this.saveState, false);
    }

    render() {

        const { application } = this.state;

        if (application == null) {
            return (
                <div
                    className='info-container'
                >
                    <p
                        className='info-paragraph'
                    >
                        Наверное, Вы попали на эту страницу по ошибке. Возможно, стоит{' '}
                        <Link
                            to='/applications'
                            className='turquoise-hover'
                        >
                            вернуться к списку Ваших отправленных заявок
                        </Link>
                    </p>
                </div>
            )
        }

        const { name, type, auditory, description } = application;
        const { closeHint, showHint, openApplicationForm } = this.props;

        return (
            <div
                className='info-container sent-application'
            >
                <Link
                    to='/applications'
                    className='back-btn'
                >
                    {''}
                </Link>

                <h2>{name}</h2>

                <h3
                    id='type'
                >
                    {getEventTypeByID(type)}
                </h3>

                <h3>
                    Помещения
                </h3>

                {this.getRooms()}

                <p
                    className='info-paragraph'
                >
                    {
                        auditory === 0
                            ?
                            'Без зрителей'
                            :
                            auditory + this.getPerfectWord()
                    }
                </p>

                {
                    description !== ''
                        ?
                        <React.Fragment>
                            <h3>
                                Комментарий
                            </h3>

                            <p
                                className='info-paragraph'
                            >
                                {description}
                            </p>
                        </React.Fragment>
                        :
                        null
                }

                <Calendar
                    closeHint={closeHint}
                    showHint={showHint}
                    noEdit={true}
                    initState={application}
                />

                <div
                    className='btn-pusher'
                >
                    <button
                        className='transparent-element no-border-element hover-text'
                        onClick={() => openApplicationForm(application)}
                    >
                        Редактировать
                    </button>
                </div>
            </div>
        );
    }

    getPerfectWord = () => {
        const { auditory } = this.state.application;
        const lastDigit = auditory % 10;
        const lastTwoDigits = auditory % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return ' зритель';
        }

        if ((lastTwoDigits < 12 || lastTwoDigits > 14) && (lastDigit > 1 && lastDigit < 5)) {
            return ' зрителя';
        }

        return ' зрителей';
    };

    getRooms() {
        const roomArray = roomArrayFormation(this.state.application.rooms, true);
        const roomStr = [];
        for (let i in roomArray) {
            const room = roomArray[i];
            const {name, amount} = room;
            const url = name.startsWith('VIP') ? 'VIP_ложи' : name.replace(/ /g, '_');
            const comment = room.name === 'Тренировочная арена'
                ?
                (
                    amount === 1
                        ?
                        '(одна площадка)'
                        :
                        '(целиком)'
                )
                :
                (
                    amount === 1
                        ?
                        ''
                        :
                        ` (${amount})`
                );
            roomStr.push(
                <React.Fragment
                    key={name}
                >
                    <Link
                        to={`/rooms/${url}`}
                        className='hover-text'
                    >
                        {name}
                    </Link>
                    {comment}{ +i !== roomArray.length - 1 ? ', ' : ''}
                </React.Fragment>
            );
        }
        return (
            <p
                className='info-paragraph'
            >
                {roomStr}
            </p>
        );
    }
}

SentApplicationView.propTypes = {
    applications: PropTypes.array.isRequired,
    closeHint: PropTypes.func.isRequired,
    showHint: PropTypes.func.isRequired,
    openApplicationForm: PropTypes.func.isRequired
};

export default SentApplicationView;