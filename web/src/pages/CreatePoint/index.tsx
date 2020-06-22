import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import axios from 'axios';
import api from '../../services/api';

import Dropzone from '../../components/Dropzone';

import './styles.css';

import logo from '../../assets/logo.svg';

interface Item{
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const CreatePoint = () => {
    // sempre que é criado um useState para um array ou um objeto, é preciso informar manualmente o tipo da variável
    const [items, setItems] = useState<Item[]>([]);
    const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);
    
    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        whatsapp: '',
    });
    
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>(initialPosition);
    const [selectedItems, setSelectedItems] = useState<Number[]>([]);
    const [selectedFile, setSelectedFile] = useState<File>();

    const history = useHistory();

    useEffect( () => {        
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          };
          
          function success(pos: Position) {
            const crd = pos.coords;
          
            // console.log('Sua posição atual é:');
            // console.log('Latitude : ' + crd.latitude);
            // console.log('Longitude: ' + crd.longitude);
            // console.log('Mais ou menos ' + crd.accuracy + ' metros.');

            // console.log("aqui no getCurrentPosition");
            
            setInitialPosition([crd.latitude, crd.longitude]);
            setSelectedPosition([crd.latitude, crd.longitude]);
          };
          
          function error(err: any) {
            console.warn('ERROR(' + err.code + '): ' + err.message);
          };
          
          navigator.geolocation.getCurrentPosition(success, error, options);
    }, [])

    useEffect( () => {
        api.get('items').then( response => {
            setItems(response.data);
        });
    }, []) //array vazio: executa só uma vez

    useEffect( () => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/').then( response => {
            const ufAbbreviations = response.data.map(uf => uf.sigla);
            ufAbbreviations.sort();
            setUfs(ufAbbreviations);
            //console.log(ufAbbreviations);        
        });
    }, [])

    useEffect( () => {
        if (selectedUf === '0') {
            return;
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then( response => {
            const cityNames = response.data.map(city => city.nome);
            setCities(cityNames);
            //console.log(cities);        
        });
    }, [selectedUf]) // carregar as cidades sempre que a UF mudar
    


    function handleSelectUf(event: ChangeEvent<HTMLSelectElement>) {
        const uf = event.target.value;
        setSelectedUf(uf);
    }

    function handleSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value;
        //console.log(city);
        setSelectedCity(city);
    }

    function handleMapClick(event: LeafletMouseEvent) {
        //console.log([event.latlng.lat, event.latlng.lng]);        
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
        const { name, value } = event.target;
        setInputData({
            ...inputData,
            [name] : value
        });
        //console.log(inputData);
    }

    function handleSelectItem(id: Number) {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) { //findIndex encontrou
            const filteredItems = selectedItems.filter(item => item !== id);
            // pra filtrar o id selecionado e tirar o className 'selected'
            setSelectedItems(filteredItems);
        } else {//findIndex = -1, não encontrou
            setSelectedItems([ ...selectedItems, id ]);
        }

        
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault(); //para que não mude de tela ao dar submit no form
        
        const { name, email, whatsapp } = inputData;
        const uf = selectedUf;
        const city = selectedCity;
        const [latitude, longitude] = selectedPosition;
        const items = selectedItems;

        const data = new FormData();

        data.append('name', name);
        data.append('email', email);
        data.append('whatsapp', whatsapp);
        data.append('uf', uf);
        data.append('city', city);
        data.append('latitude', String(latitude)); //data precisa ser String
        data.append('longitude', String(longitude));
        data.append('items', items.join(',')); //items separados por vírgula como string

        if(selectedFile) {
            data.append('image', selectedFile);
        }

        await api.post('points', data);

        alert('Ponto de Coleta criado');

        //console.log(data);
        history.push('/');
    }



    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Ecoleta" />
                <Link to="/">
                    <FiArrowLeft />
                    Voltar para home
                </Link>
            </header>

            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/> ponto de coleta</h1>
                
                <Dropzone onFileUploaded={setSelectedFile}/>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                        <label htmlFor="whatsapp">Whatsapp</label>
                        <input
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}
                        />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectedPosition} />
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select
                                name="uf"
                                id="uf"
                                value={selectedUf}
                                onChange={handleSelectUf}
                            >
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                    )
                                )}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select
                                name="city"
                                id="city"
                                value={selectedCity}
                                onChange={handleSelectCity}
                            >
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                    )
                                )}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de Coleta</h2>
                        <span>Selecione um ou mais itens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => (
                            //key: retornar valor único de cada item do map, ou seja, o id,
                            //para que o react possa montar a lista
                            <li 
                                key={item.id}
                                onClick={() => handleSelectItem(item.id)} //arrow function para a função não executar
                                className={selectedItems.includes(item.id) ? 'selected' : ''}
                            >
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>
                </fieldset>

                <button type='submit'>Cadastrar ponto de coleta</button>
            </form>         
        </div>
    )
}

export default CreatePoint;