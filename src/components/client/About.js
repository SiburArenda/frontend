import React, {Component} from 'react';
import '../../resource/styles/Main.css'

class About extends Component {

    componentDidMount() {
        sessionStorage.removeItem('SignUp');
    }

    render() {
        return (
            <React.Fragment>
                <div className='info-container'>
                    <h1>О сервисе</h1>
                    <img
                        src='http://siburarenda.publicvm.com/img/frontPage.png'
                        alt='niceSiburPhoto'
                        style={{width: '100%'}}
                    />
                    <p
                        className='info-paragraph'
                    >
                        Благодаря данному сервису, Вы можете оставить заявку на аренду помещений СИБУР АРЕНЫ
                    </p>
                </div>
            </React.Fragment>
        );
    }
}

export default About;
//TODO: nice About text