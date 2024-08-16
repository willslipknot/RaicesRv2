import React, { Component } from 'react';
import imagen1 from '../../assets/images/encabezado.jpg'
import imagen2 from "../../assets/images/encabezado2.jpeg"
import imagen3 from "../../assets/images/encabezado3.jpeg"
import "../../assets/css/Encabezado.css" 

class Encabezado extends Component {
    render() {
        return (
            <div> 
                <div className="encabezado-container" >
                    <img className= 'imagen_p1' src={imagen1} alt=" " />
                    <img className= 'imagen_p3' src={imagen3} alt=" " />
                    <img className= 'imagen_p2' src={imagen2} alt=" " />   
                </div>
                <div className="texto_superpuesto">
                    <h1>Raices Rurales</h1>
                    <p className='parrafo'> Descubre la escencia de la comunidad en cada rincon con Raices Rurales </p>
                </div>
            </div>
        );
    }
}


export default Encabezado;
