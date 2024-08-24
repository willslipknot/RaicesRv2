import { createContext, useContext, useEffect, useState } from "react";
import supabase from '../db1.js';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import verifyToken from '../controllers/VerificacionToken.js'
import { uploadImageAndGetURL } from '../middlewares/imagen.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(true);

    const signin = async (user) => {
        try {
            const { data, error } = await supabase
                .from('inf_usuarios_t')
                .select('*')
                .eq('username', user.username)
                .single();

            if (error || !data) {
                setErrors(["Usuario no encontrado."]);
                return;
            }

            const passwordMatch = await bcrypt.compare(user.password, data.password);
            if (!passwordMatch) {
                setErrors(["Contraseña incorrecta."]);
                return;
            }

            const token = `${data.uid}-${uuidv4()}`;
            Cookies.set('token', token, { expires: 1 });
            localStorage.setItem('token', token);

            setUser(data);
            setIsAuthenticated(true);

        } catch (error) {
            setErrors([error.message || "Error al iniciar sesión."]);
        }
    };

    const logout = () => {
        Cookies.remove('token');
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
    };

    const updateUser = async (uid, userData) => {
        const lowercasedUserData = Object.fromEntries(
            Object.entries(userData).map(([key, value]) =>
                [key, typeof value === 'string' ? value.toLowerCase() : value]
            )
        );

        try {
            const { data, error } = await supabase
                .from('inf_usuarios_t')
                .update(lowercasedUserData)
                .eq('uid', uid)
                .single();

            if (error) {
                console.error('Error de Supabase:', error);
                throw error;
            }
            setUser(data);
        } catch (error) {
            setErrors([error.message || 'Error al actualizar el usuario.']);
        }
    };

    const createUserConds = async (formData) => {
        const file = formData.get('photo_perfil');
        if (!file) {
            console.error('No file found in formData');
            return;
        }

        const url = await uploadImageAndGetURL(file);
        const first_name = formData.get('first_name').toLowerCase();
        const second_name = formData.get('second_name').toLowerCase();
        const first_last_name = formData.get('first_last_name').toLowerCase();
        const second_last_name = formData.get('second_last_name').toLowerCase();
        const username = formData.get('correo').toLowerCase();
        const correo = formData.get('correo').toLowerCase();
        const phone_number = formData.get('phone_number');
        const tipoUsuario = "Conductor";

        try {
            const { data: newConductor, error } = await supabase
                .from('inf_usuarios_t')
                .insert([
                    {
                        first_name,
                        second_name,
                        first_last_name,
                        second_last_name,
                        photo_perfil: url,
                        username,
                        phone_number,
                        correo,
                        tipoUser: tipoUsuario
                    },
                ]);

            if (error) {
                throw new Error(error.message);
            }
            setUser(newConductor);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }


    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem('token') || Cookies.get('token');
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const userData = await verifyToken(token);
                setUser(userData);
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        }
        checkLogin();
    }, []);

    const getCliente = async (uid) => {
        try {
            const { data, error } = await supabase
                .from('inf_usuarios_t')
                .select('*')
                .eq('uid', uid)
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return { data };
        } catch (error) {
            console.error('Error al obtener el Usuario:', error);
            return null;
        }
    }

    const getUserRole = async (userId) => {
        try {
            if (!user) throw new Error("No se encontró usuario");

            const { data, error } = await supabase
                .from('inf_usuarios_t')
                .select('tipoUser')
                .eq('uid', userId)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data.tipoUser;
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                signin,
                user,
                isAuthenticated,
                errors,
                loading,
                logout,
                updateUser,
                verifyToken,
                getCliente,
                getUserRole,
                createUserConds
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
