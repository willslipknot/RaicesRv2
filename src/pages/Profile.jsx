import React, { useEffect, useState } from 'react';
import NavBar from '../components/Home/NavBar.jsx';
import { useAuth } from '../context/authContext.jsx';
import '../assets/css/Profile.css';
import { useForm, Controller } from 'react-hook-form';

function Profile() {
    const { user, updateUser } = useAuth();
    const { handleSubmit, control, reset } = useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(user || {});

    useEffect(() => {
        if (user) {
            reset({
                username: user.username || '',
                phone_number: user.phone_number || '',
                first_name: user.first_name || '',
                first_last_name: user.first_last_name || '',
                second_name: user.second_name || '',
                second_last_name: user.second_last_name || '',
            });
            setUserData(user);
        }
    }, [user, reset]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            if (user && user.uid) {
                await updateUser(user.uid, data);
                setIsEditing(false);
                setUserData({ ...userData, ...data });
            } else {
                console.error('No se encontró el ID de usuario.');
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        } finally {
            setTimeout(() => {
            }, 3000);
        }
    };

    return (
        <div className="profile-container">
            <NavBar /><br /><br /><br /><br />
            <div className="profile-form">
                <h1>Perfil de Usuario</h1><br />
                <form onSubmit={handleSubmit(onSubmit)} className='perfil'>
                    <div className="form-group">
                        <label htmlFor="username">Nombre de Usuario</label>
                        <Controller
                            name="username"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="text" {...field} readOnly={!isEditing} />}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono</label>
                        <Controller
                            name="phone_number"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="text" {...field} readOnly={!isEditing} />}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Primer Nombre</label>
                        <Controller
                            name="first_name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="text" {...field} readOnly={!isEditing} />}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Segundo Nombre</label>
                        <Controller
                            name="second_name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="text" {...field} readOnly={!isEditing} />}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido">Primer Apellido</label>
                        <Controller
                            name="first_last_name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="text" {...field} readOnly={!isEditing} />}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="apellido">Segundo Apellido</label>
                        <Controller
                            name="second_last_name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <input type="text" {...field} readOnly={!isEditing} />}
                        />
                    </div>
                    {isEditing ? (
                        <div className="form-group">
                            <button type="submit">Actualizar</button>
                            <button type="button" onClick={handleCancelClick}>Cancelar</button>
                        </div>
                    ) : (
                        <button type="button" onClick={handleEditClick}>Editar</button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Profile;
