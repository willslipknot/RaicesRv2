import React, { Component } from 'react';
import imagen1 from '../../assets/images/encabezado.jpg'; // Imágenes optimizadas
import imagen2 from '../../assets/images/encabezado2.jpeg';
import imagen3 from '../../assets/images/encabezado3.jpeg';
import "../../assets/css/Encabezado.css";

class Encabezado extends Component {
    render() {
        return (
            <div> 
                <div className="encabezado-container">
                    <img 
                        className='imagen_p1' 
                        src={imagen1} 
                        alt="imagen_1" 
                        width="800" 
                        height="400"
                        srcSet={`${imagen1} 800w, ${imagen1}?w=400 400w`}
                        sizes="(max-width: 600px) 400px, 800px"
                    />
                    <img 
                        className='imagen_p3' 
                        src={imagen3} 
                        alt="imagen_2" 
                        width="800" 
                        height="400"
                        srcSet={`${imagen3} 800w, ${imagen3}?w=400 400w`}
                        sizes="(max-width: 600px) 400px, 800px"
                    />
                    <img 
                        className='imagen_p2' 
                        src={imagen2} 
                        alt="imagen_3" 
                        width="800" 
                        height="400"
                        srcSet={`${imagen2} 800w, ${imagen2}?w=400 400w`}
                        sizes="(max-width: 600px) 400px, 800px"
                    />   
                </div>
                <div className="texto_superpuesto">
                    <h1>Raices Rurales</h1>
                    <p className='parrafo'>Descubre la esencia de la comunidad en cada rincón con Raíces Rurales</p>
                </div>
            </div>
        );
    }
}

export default Encabezado;
