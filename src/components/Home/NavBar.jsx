import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/authContext.jsx';
import { Link, useNavigate } from 'react-router-dom';

import '../../assets/css/NavBar.css';

function NavBar() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [showInitialFields, setShowInitialFields] = useState(true);
    const [admin, setAdmin] = useState(null); // Cambié null para hacer mejor el manejo de estados
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const { isAuthenticated, signin, errors: erroresLogin, logout, user, getUserRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserRole = async () => {
            if (user && user.uid) {
                const role = await getUserRole(user.uid);
                setAdmin(role);
            } else {
                setAdmin(null);
            }
        };

        checkUserRole();
    }, [user]);

    const handleCheckboxChange = () => {
        setIsLoginOpen(!isLoginOpen);
        setShowInitialFields(true);
        reset();
    };

    const handleLogoClick = () => {
        if (admin === 'Admin') {
            navigate('/HomeAdmin');
        } else {
            navigate('/');
        }
    };

    const handleLoginSubmit = async (values) => {
        try {
            const userCredentials = await signin(values);
    
            if (userCredentials) {
                const userId = userCredentials.uid;
                const role = await getUserRole(userId);
                setAdmin(role);
                if (role === 'Admin') {
                    navigate('/HomeAdmin');
                } else {
                    setAdmin(null);
                    alert('El usuario no es administrador. Por favor descargue la app.');
                    navigate('/Contacto');
                }
            } else {
                console.error('No se pudieron obtener las credenciales del usuario.');
            }
    
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    
        setIsLoginOpen(false);
    };
    
    const handleLogout = () => {
        logout();
        setAdmin(null);
        navigate('/');
        setIsLoginOpen(false);
    };

    return (
        <div className="nav">
            <nav className="navbar">
                <ul className="navLis">
                    <div className='logo' onClick={handleLogoClick} />
                    {isAuthenticated && admin === 'Admin' ? (
                        <>
                            <li><Link to="/DashboardAdmin"><b className='menu'>Dashboard</b></Link></li>
                            <li><Link to="/Actividades"><b className='menu'>Actividades</b></Link></li>
                            <li><Link to="/Conductores"><b className='menu'>Conductores</b></Link></li>
                            <li><Link to="/Reservas"><b className='menu'>Reservas</b></Link></li>
                            <li><Link to="/Profile"><b className='menu'>Perfil</b></Link></li>
                            <li>
                                <label className='labelcheck'>
                                    <b className='menu'>
                                        <input type="checkbox" className='check' onChange={handleCheckboxChange} />
                                        {user?.username}
                                    </b>
                                </label>
                                {isLoginOpen && (
                                    <ul className="submenuUser">
                                        <form className='login'>
                                            <div className="form-group">
                                                <li><button href="/" onClick={handleLogout}><b className='menu'>Logout</b></button></li>
                                            </div>
                                        </form>
                                    </ul>
                                )}
                            </li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/"><b className='menu'>Inicio</b></Link></li>
                            <li><Link to="/Contacto"><b className='menu'>Contacto</b></Link></li>
                            <li>
                                <label className='labelcheck' htmlFor="menuCheckbox">
                                    <b className='menu'>
                                        <input type="checkbox" className='check' id="menuCheckbox" onChange={handleCheckboxChange} />
                                        Login
                                    </b>
                                </label>
                                {isLoginOpen && (
                                    <ul className="submenu">
                                        {showInitialFields && (
                                            <form className='login' onSubmit={handleSubmit(handleLoginSubmit)}>
                                                <div>
                                                    <div className="form-group-login">
                                                        <label htmlFor="username"><b className='formulario'>Nombre Usuario</b></label>
                                                        <input type="text" {...register('username', { required: true })} />
                                                        {errors.username && (
                                                            <p className='text-red-500'>
                                                                Nombre de usuario es requerido
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="form-group-login">
                                                        <label htmlFor="password"><b className='formulario'>Contraseña</b></label>
                                                        <input type="password" {...register('password', { required: true })} />
                                                        {errors.password && (
                                                            <p className='text-red-500'>
                                                                Contraseña es requerida
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="form-group-login">
                                                        &nbsp;&nbsp;&nbsp; <button className="button" type='submit'><b className='botones'>Entrar</b></button>
                                                    </div>
                                                    {erroresLogin.map((error, i) => (
                                                        <div className='bg-red-500 p-0 text-white' key={i}>
                                                            {error}
                                                        </div>
                                                    ))}
                                                </div>
                                            </form>
                                        )}
                                    </ul>
                                )}
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default NavBar;
