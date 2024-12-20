import { createContext, useContext, useEffect, useState } from "react";
import supabase from '../db1.js';
import supabaseAuth from "../dbAuth";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import verifyToken from '../controllers/VerificacionToken.js';
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
                return null;
            }

            const passwordMatch = await bcrypt.compare(user.password, data.password);
            if (!passwordMatch) {
                setErrors(["Contraseña incorrecta."]);
                return null;
            }

            const token = `${data.uid}-${uuidv4()}`;
            sessionStorage.setItem('token', token);

            setUser(data);
            setIsAuthenticated(true);

            return data;
        } catch (error) {
            setErrors([error.message || "Error al iniciar sesión."]);
            return null;
        }
    };

    const logout = () => {
        sessionStorage.removeItem('token');
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
                throw new Error(error.message);
            }
            setUser(data);
        } catch (error) {
            setErrors([error.message || 'Error al actualizar el usuario.']);
        }
    };

    useEffect(() => {
        async function checkLogin() {
            const token = sessionStorage.getItem('token');
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
    };

    const getUserRole = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('inf_usuarios_t')
                .select('tipoUser')
                .eq('uid', userId)
                .single();

            if (error || !data) {
                throw new Error('No se encontró usuario');
            }

            return data.tipoUser;
        } catch (error) {
            console.error('Error al obtener el rol del usuario:', error);
            throw error;
        }
    };

    const create_UserCond = async (formData) => {
        const cedula = formData.get('cedula');
        const correo = formData.get('correo').toLowerCase();
        const contraseña = "CC" + cedula;

        try {
            const { data, error } = await supabase.auth.signUp({
                email: correo,
                password: contraseña,
            });

            if (error) {
                throw new Error(error.message);
            }

            return data.user?.id;
        } catch (error) {
            console.error("Error al crear el usuario:", error.message);
            throw error;
        }
    };

    const deleteCondUser = async (correo) => {
        try {
            const { data, error } = await supabase
                .from('inf_usuarios_t')
                .delete()
                .eq('correo', correo)
                .single();

            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function deleteUserCond(userId) {
        try {
          const { error } = await supabaseAuth.auth.admin.deleteUser(userId);
          
          if (error) {
            console.error('Error al eliminar el usuario:', error);
            return false;
          }
      
          console.log('Usuario eliminado exitosamente');
          return true;
        } catch (err) {
          console.error('Error inesperado:', err);
          return false;
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
                getCliente,
                getUserRole,
                create_UserCond,
                deleteCondUser,
                deleteUserCond
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
