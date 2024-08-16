import supabase from '../db1.js';

const verifyToken = async (token) => {
    if (!token) {
        throw new Error('Token no proporcionado');
    }

    try {
        const [userId] = token.split('-');

        const { data: userFound, error } = await supabase
            .from('inf_usuarios_t')
            .select('uid, username, first_name, second_name, first_last_name, second_last_name, phone_number')
            .eq('uid', userId)
            .single();

        if (error || !userFound) {
            throw new Error('Token inválido o usuario no encontrado');
        }

        return userFound;
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        throw error; 
    }
};

export default verifyToken;
