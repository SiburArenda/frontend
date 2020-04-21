import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Link, BrowserRouter as Router} from "react-router-dom";
import Hint from "./Hint";

class ClientNavList extends Component {

    state = {
        hintX: 0,
        hintY: 0,
        showAppFormHint: false
    };

    render() {
        return (
            <Router>
                <li>
                    <Link to='/' className='hover-text'>О сервисе</Link>
                </li>
                <li>
                    <Link to='/rooms' className='hover-text'>Помещения</Link>
                </li>
                <li>
                    <Link to='/contacts' className='hover-text'>Контакты</Link>
                </li>
                <li>
                    <Link to='/signup' className='hover-text'>Регистрация</Link>
                </li>
                <li>
                    <button
                        onClick={() => this.props.openApplicationForm()}
                        className='hover-text'
                        onMouseEnter={e => this.showHint(e)}
                        onMouseLeave={() => this.setState({showAppFormHint: false})}
                    >
                        Оформить заявку
                    </button>
                    {this.state.showAppFormHint
                        ? <Hint
                            hintText={'Окно заполнения заявки откроется параллельно с остальным содержимым сервиса' +
                        ' - Вы сможете переходить по разделам, не закрывая его и не заполняя заново!'}
                            x={this.state.hintX}
                            y={this.state.hintY}/>
                        : null}
                </li>
            </Router>
        );
    }


    showHint = (e) => {
        this.setState({
            hintX: +e.clientX,
            hintY: +e.clientY,
            showAppFormHint: true
        })
    }
}

ClientNavList.propTypes = {
    openApplicationForm: PropTypes.func.isRequired
};

export default ClientNavList;