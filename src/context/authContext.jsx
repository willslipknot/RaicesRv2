import { createContext, useContext, useEffect, useState } from "react";
import supabase from '../db1.js';
import Cookies from 'js-cookie';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import verifyToken from '../controllers/VerificacionToken.js'

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
        try {
            const { data, error } = await supabase
                .from('inf_usuarios_t')
                .update(userData)
                .eq('uid', uid)
                .single();
    
            if (error) {
                console.error('Error de Supabase:', error);
                throw error;
            }
    
            console.log('Datos actualizados:', data);
            setUser(data);
        } catch (error) {
            setErrors([error.message || 'Error al actualizar el usuario.']);
        }
    };
    
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

            console.log('Usuario encontrado:', data);

            return { data };
        } catch (error) {
            console.error('Error al obtener el Usuario:', error);
            return null;
        }
    }
    
   
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
                getCliente
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
