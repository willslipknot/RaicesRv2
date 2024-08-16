import supabase from '../db1'; // Asegúrate de que la configuración esté correcta

export const uploadImageAndGetURL = async (file) => {
    try {
        const nameUnique = Date.now() + '-' + file.name; // Asegúrate de que `file.name` esté definido

        // Utiliza `file` directamente
        const { data, error } = await supabase.storage.from('actividades').upload(nameUnique, file, { contentType: file.type });
        if (error) {
            console.error('Error al subir el archivo a Supabase Storage:', error.message);
            throw error;
        }

        const name = 'object/public/actividades/' + nameUnique;
        const imageUrl = `${supabase.storageUrl}/${name}`;
        console.log('urlD:',imageUrl);

        return imageUrl;
    } catch (error) {
        console.error('Error general:', error.message);
        throw new Error('Ocurrió un error al subir el archivo.');
    }
};
