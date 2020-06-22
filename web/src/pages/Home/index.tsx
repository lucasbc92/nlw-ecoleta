import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom'; // para fazer a página dinâmica, 
//sem precisar recarregar a página quando mudar de rota
import Header from '../../Header';

import NumberList from '../../NumberList';

import './styles.css';

import logo from '../../assets/logo.svg';

const Home = () => {

    const numbers = [1,2,4,5,7,9];

    return (
        <div id="page-home">
            <div className="content">

                <Header src={logo} alt="Ecoleta" />

                <NumberList numbers={numbers}>Filho</NumberList>

                <main>
                    <h1>Seu marketplace de coleta de resíduos</h1>
                    <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

                    <Link to="/create-point">
                        <span>
                            <FiLogIn />
                        </span>
                        <strong>Cadastre seu ponto de coleta</strong>
                    </Link>
                </main>           
            </div>
        </div>
    )
}

export default Home;