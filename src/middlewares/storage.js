import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import multer from 'multer';
import supabase from "../db1.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const destination = path.join(__dirname, '../../../Client_Front/src/assets/images/');
        cb(null, destination);
    },
    filename: (req, file, cb) => {
        const uniqueFileName = Date.now() + '-' + file.originalname;
        cb(null, uniqueFileName);
    }
});

export const uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, 
    },
}).single('photo');

export const handleUpload = async (req, res, next) => {
    try {
        console.log('File:', req.file);
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'Por favor, sube un archivo.' });
        }

        const nameUnique = Date.now() + '-' + file.originalname

        const { data, error } = await supabase.storage.from('actividades').upload((nameUnique), file.buffer,{ contentType: file.mimetype});
        if (error) {
            console.error('Error al subir el archivo a Supabase Storage:', error.message);
            throw error;
        }

        
        // Aquí obtenemos la URL de la imagen después de subirla a Supabase y la adjuntamos a req.body
        const name = 'object/public/actividades/' + nameUnique;
        const imageUrl = `${supabase.storageUrl}/${name}`;
        req.body.imageURL = imageUrl;

        // Llamamos a next() para pasar al siguiente middleware o controlador en la cadena de middleware
        next();
    } catch (error) {
        console.error('Error general:', error.message);
        res.status(500).json({ message: 'Ocurrió un error al subir el archivo.' });
    }
};
