import React, {Component} from 'react';
import PropTypes from 'prop-types';
import '../../resource/styles/Main.css'
import '../../resource/styles/Contacts.css'

class Contacts extends Component {

    render() {
        return (
            <div
                className='info-container'
            >
                <h1>Контакты</h1>

                <div
                    className='flex-100 info-paragraph'
                >

                    <div
                        className='block-col person-info'
                    >
                        <img
                            src='http://siburarenda.publicvm.com/img/pisareva.jpg'
                            alt='Y.A.Pisareva'
                            className='person-photo'
                        />
                        <p>Директор по развитию</p>
                        <p>Писарева Юлия Анатольевна</p>
                        <p>
                            e-mail:{' '}
                            <a
                                href='mailto:pisareva@siburarena.com'
                                className='turquoise-hover'
                            >
                                pisareva@siburarena.com
                            </a>
                        </p>
                        <p>
                            (аренда основной арены, организация мероприятий)
                        </p>
                    </div>

                    <div
                        className='block-col person-info'
                    >
                        <img
                            src='http://siburarenda.publicvm.com/img/fedorov.jpg'
                            alt='P.S.Fedorov'
                            className='person-photo'
                        />
                        <p>Менеджер коммерческого отдела</p>
                        <p>Федоров Павел Сергеевич</p>
                        <p>тел: +7 931 261-04-37</p>
                        <p>
                            e-mail:{' '}
                            <a
                                href='mailto:fedorov@siburarena.com'
                                className='turquoise-hover'
                            >
                                fedorov@siburarena.com
                            </a>
                        </p>
                        <p>
                            (выставочная деятельность, организация и проведение мероприятий на главной арене, аренда аква-зоны и тренировочного зала)
                        </p>
                    </div>

                </div>

                <div className='info-paragraph center-paragraph'>
                    <p>Адрес:</p>
                    <p>Санкт-Петербург, Футбольная аллея, дом 8</p>
                    <p>Телефоны КСК «СИБУР АРЕНА:</p>
                    <p>+7 (812) 456-08-00</p>
                    <p>+7 (812) 456-03-11</p>
                    <p>факс: +7 (812) 456-08-00 (доб. 160)</p>
                    <p>
                        e-mail:{' '}
                        <a
                            href='mailto:office@siburarena.com'
                            className='turquoise-hover'
                        >
                            office@siburarena.com
                        </a>
                    </p>
                    <p>
                        Официальный сайт СИБУР АРЕНЫ:{' '}
                        <a
                            href='https://siburarena.com'
                            rel="noopener noreferrer"
                            target='_blank'
                            className='turquoise-hover'
                        >
                            https://siburarena.com
                        </a>
                    </p>
                </div>

                <div
                    className='info-paragraph center-paragraph'
                >
                    <h2>Как добраться</h2>

                    <p>На автомобиле:</p>
                    <p className='travel-margin'>По Южной или Северной дороге Крестовского острова до Футбольной аллеи. Напротив расположен стадион «Газпром Арена». На территории, прилегающей к комплексу и к легкоатлетическому манежу, расположена бесплатная парковка.</p>

                    <p>На автобусе:</p>
                    <p className='travel-margin'>От метро «Крестовский остров» или «Чкаловская» на автобусе №14 или №25 до автостанции «Крестовский остров». Далее пешком через парк (около 10 минут)</p>

                    <p>Пешком:</p>
                    <p className='travel-margin'>От станции метро «Новокрестовская» через пешеходный мост (около 10 минут)...</p>

                    <img
                        className='map-img travel-margin'
                        alt='novokrestovakayaMap'
                        src='http://siburarenda.publicvm.com/img/novokrestovskayaMap.png'
                    />

                    <p className='travel-margin'>...или от станции метро «Крестовский остров» по главной аллее парка до конца. «СИБУР АРЕНА» расположена слева от памятника Кирову.</p>

                    <img
                        className='map-img travel-margin'
                        alt='krestovskiyOstrovMap'
                        src='http://siburarenda.publicvm.com/img/krestovskiyOstrovMap.png'
                    />

                    <p>Во время ряда мероприятий от станций метро «Крестовский остров» и «Новокрестовская» до комплекса и обратно курсируют бесплатные автобусы.</p>

                </div>

            </div>
        );
    }
}

Contacts.propTypes = {};

export default Contacts;