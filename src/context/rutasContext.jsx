import { createContext, useContext, useState } from "react"
import supabase from '../db1.js';
import { uploadImageAndGetURL } from '../middlewares/imagen.js';


const RutaContext = createContext();

export const useRutas = () => {
    const context = useContext(RutaContext);

    if (!context) {
        throw new Error("RutaContext must be used whitin a TaskProvider")
    }
    return context;
}

export function RutaProvider({ children }) {

    const [rutasAll, setRutasAll] = useState([]);

    const getRutasAll = async () => {
        try {
            const { data, error } = await supabase
                .from('ruta_t')
                .select('*');
    
            if (error) {
                throw new Error(error.message);
            }
    
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };
    

    const deleteRuta = async (uid_ruta) => {
        try {
            const { data, error } = await supabase
                .from('ruta_t')
                .delete()
                .eq('uid_ruta', uid_ruta).single();
            if (error) {
                throw new Error(error.message);
            }
            if (!data) {
                return res.status(405).json(["No existe la ruta, por lo que no se eliminó nada"]);
            }
        } catch (error) {
            console.error(error);
        }

    }

    const getRuta = async (uid_ruta) => {
        try {
            const { data, error } = await supabase
                .from('ruta_t')
                .select('*')
                .eq('uid_ruta', uid_ruta)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            return data;
        } catch (error) {
            console.error('Error al obtener la ruta:', error);
            return null;
        }
    };



    const updateRuta = async (uid_ruta, rutaData ) => {
        try {
            const { data, error } = await supabase
                .from('ruta_t')
                .update(rutaData)
                .eq('uid_ruta', uid_ruta)
                .single();
    
            if (error) {
                console.error('Error de Supabase:', error);
                throw error;
            }
            setRutasAll(data);
        } catch (error) {
            setErrors([error.message || 'Error al actualizar la ruta.']);
        }
    };

    const createRutas = async (values) => {
        const { nombre, act_1, act_2, act_3, act_4, act_5, act_6, act_7, act_8, act_9, descripcion } = values;
        const dep = "Cundinamarca";
        const mun = "San_Juan";
        const fot = "https://piazhwrekcgxbvsyqiwi.supabase.co/storage/v1/object/public/actividades/sanjuan.png?t=2024-08-15T15%3A32%3A05.313Z";
        const inicio = "05:00:00";
        const fin = "19:00:00";

        try {
            const { data: newRuta, error } = await supabase
                .from('ruta_t')
                .insert([
                    {
                        nombre,
                        foto: fot,
                        departamento: dep,
                        municipio: mun,
                        hr_inicio: inicio,
                        hr_fin: fin,
                        act_1, act_2, act_3, act_4, act_5, act_6, act_7, act_8, act_9,
                        descripcion
                    }
                ]);

            if (error) {
                throw new Error(error.message);
            }
            return { message: "Ruta creada correctamente", newRuta };
        } catch (error) {
            console.error('Error al crear la ruta:', error);
            throw new Error('Error interno del servidor');
        }
    };

    return (
        <RutaContext.Provider value={{
            rutasAll,
            getRutasAll,
            deleteRuta,
            getRuta,
            updateRuta,
            createRutas
        }}>
            {children}
        </RutaContext.Provider>
    );
}