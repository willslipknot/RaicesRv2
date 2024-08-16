import supabase from '../db1.js';

const verifyToken = async (token) => {
    if (!token) {
        throw new Error('Token no proporcionado');
    }

    try {
        // Asumimos que el token tiene el formato 'userId-randomString'
        const [userId] = token.split('-');

        // Consulta en Supabase para verificar si el usuario existe
        const { data: userFound, error } = await supabase
            .from('inf_usuarios_t')
            .select('uid, username, first_name, second_name, first_last_name, second_last_name, phone_number')
            .eq('uid', userId)
            .single();

        if (error || !userFound) {
            throw new Error('Token inválido o usuario no encontrado');
        }

        // Retorna el usuario encontrado si el token es válido
        return userFound;
    } catch (error) {
        console.error('Error al verificar el token:', error.message);
        throw error; // Propaga el error para que pueda ser manejado en el lugar donde se llama
    }
};

export default verifyToken;
