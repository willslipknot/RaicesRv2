import React, { useRef } from 'react';
import { FaFacebookF, FaAndroid, FaApple, FaTwitter, FaInstagram } from 'react-icons/fa';
import '../assets/css/Contacto.css';
import imagenLogo from '../assets/images/logo_progrado.png';
import emailjs from 'emailjs-com';

const Contacto = () => {
    const formRef = useRef(null);

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_g5h1fxe', 'template_5sknu6j', e.target, 'OcFucUjKKDEFNAAHk')
            .then((result) => {
                alert('Mensaje enviado con éxito!');
                formRef.current.reset(); // Limpia los campos del formulario
            }, (error) => {
                console.error('Error sending email:', error.text);
                alert('Error al enviar el mensaje.');
            });
    };

    return (
        <div className="contacto-container">
            <div className="columna-1">
                <div className='logoCon'>
                    <img className='imagenLogo' src={imagenLogo} alt="Logo" />
                </div>
                <p className='TitulosR'>Encuéntranos en:</p>
                <div className='iconosRedsocial'>
                    <div className="contacto-icono">
                        <a href="https://www.facebook.com/profile.php?id=61564268194687" target="_blank" rel="noopener noreferrer">
                            <FaFacebookF size={60} />
                        </a>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="contacto-icono">
                        <a href="https://x.com/raices17271" target="_blank" rel="noopener noreferrer">
                            <FaTwitter size={60} />
                        </a>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="contacto-icono">
                        <a href="https://www.instagram.com/rrurales_dcr/?igsh=Ynk2aHJwdmNpbW95" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={60} />
                        </a>
                    </div>
                </div>
                <p className='TitulosR'>Descarga nuestra Aplicación:</p>
                <div className='iconosDescarga'>
                    <div className="contacto-icono">
                        <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
                            <FaAndroid size={60} />
                        </a>
                    </div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <div className="contacto-icono">
                        <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                            <FaApple size={60} />
                        </a>
                    </div>
                </div>
            </div>

            <div className="columna-3">
                <div className="contacto-formulario">
                    <div className="contact-form">
                        <h2>Contacto</h2>
                        <form ref={formRef} className='contacto' onSubmit={sendEmail}>
                            <div className="form-group-contac">
                                <label htmlFor="name">Nombre:</label>
                                <input type="text" name="name" required />
                            </div>
                            <div className="form-group-contac">
                                <label htmlFor="email">Correo electrónico:</label>
                                <input type="email" name="email" required />
                            </div>
                            <div className="form-group-contac">
                                <label htmlFor="message">Mensaje:</label>
                                <textarea name="message" rows="6" required></textarea>
                            </div>
                            <p className='BotonEnviar'><button type="submit" >Enviar</button></p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contacto;
