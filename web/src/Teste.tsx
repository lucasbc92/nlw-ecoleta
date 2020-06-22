import React, { useState } from 'react';
import './App.css';

// JSX: Sintaxe de XML dentro de JavaScript (.jsx ou .tsx)


import Header from './Header';

function Teste() {
  const [counter, setCounter] = useState(0); //[valor do estado, função pra atualizar o valor do estado]

  function handleButtonClick() {
    setCounter(counter + 1); //Imutabildade
  }

  return (
    <div>
      <Header title={`Contador: ${counter}`} />

      <h1>{counter * 2}</h1>
      <button type='button' onClick={handleButtonClick}>Aumentar</button>

      <Header title="Rodapé" />
    </div>
  );
}

export default Teste;
