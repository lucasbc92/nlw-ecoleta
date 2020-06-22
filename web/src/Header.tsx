import React from 'react';

//FC: Function Component

interface HeaderProps {
    title?: string;
    src?: string;
    alt?: string;
    //? : atributo opcional
}

const Header: React.FC<HeaderProps> = (props) => {
    return (
        <header>
            {props.src &&
                <img src={props.src} alt={props.alt}></img>
            }
            {props.title &&
                <h1>{props.title}</h1>
            }                        
        </header>
    )
}

export default Header;