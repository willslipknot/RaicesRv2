import React from 'react';
import { FaFacebookF, FaAndroid, FaApple } from 'react-icons/fa'; // Asegúrate de instalar react-icons si no lo has hecho
import '../assets/css/Contacto.css';
import imagenLogo from '../assets/images/logo_progrado.png';
import emailjs from 'emailjs-com';

const Contacto = () => {
    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_g5h1fxe', 'template_5sknu6j', e.target, 'OcFucUjKKDEFNAAHk')
            .then((result) => {
                console.log('Email sent successfully:', result.text);
                alert('Mensaje enviado con éxito!');
            }, (error) => {
                console.error('Error sending email:', error.text);
                alert('Error al enviar el mensaje.');
            });
           
    };

    return (
        <div className="contacto-container">
            <div className='logoCon'>
                <img className='imagenLogo' src={imagenLogo} alt=" " />
            </div>
            <div className='iconos'>
                <div className="contacto-icono-face">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="contacto-icono">
                        <FaFacebookF size={80} />
                    </a>
                </div>
                <div className="contacto-icono-andro">
                    <a href="https://play.google.com" target="_blank" rel="noopener noreferrer" className="contacto-icono">
                        <FaAndroid size={80} />
                    </a>
                </div>
                <div className="contacto-icono-apple">
                    <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="contacto-icono">
                        <FaApple size={80} />
                    </a>
                </div>
            </div>
            <div className="contacto-formulario">
                <div className="contact-form">
                    <h2>Contacto</h2>
                    <form className='contacto' onSubmit={sendEmail}>
                        <div className="form-group-contac">
                            <label htmlFor="name">Nombre:</label>
                            <input type="text" name="name" className='formulario_con' required />
                        </div>
                        <div className="form-group-contac">
                            <label htmlFor="email">Correo electrónico:</label>
                            <input type="email" name="email" className='formulario_con' required />
                        </div>
                        <div className="form-group-contac">
                            <label htmlFor="message">Mensaje:</label>
                            <textarea name="message" className="areaDesCon" rows="6" required></textarea>
                        </div>
                        <button type="submit">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contacto;