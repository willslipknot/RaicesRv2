import { createContext, useContext, useState, useCallback } from "react"
import supabase from '../db1.js';
import { uploadImageAndGetURL } from '../middlewares/imagen.js';


const ActContext = createContext();

export const useActs = () => {
    const context = useContext(ActContext);

    if (!context) {
        throw new Error("useActs must be used whitin a TaskProvider")
    }
    return context;
}

export function ActProvider({ children }) {

    const [acts, setActs] = useState([]);

    const getActs = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('actividades_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }
            setActs(data)
        } catch (error) {
            console.error(error);
        }
    }, []);

    const getContActs = useCallback(async () => {
        try {
            const { data: actividades, error } = await supabase
                .from('actividades_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }
            const numActs = actividades.length;
            setActs(numActs);
        } catch (error) {
            console.error('Error al obtener el número de actividades:', error);
        }
    }, []);


    const createActs = useCallback(async (formData) => {
        const file = formData.get('photo');
        if (!file) {
            console.error('No file found in formData');
            return;
        }
        const url = await uploadImageAndGetURL(file);
        const nombre = formData.get('nombre').toLowerCase();
        const descripcion = formData.get('descripcion').toLowerCase();
        const tipo = formData.get('tipo').toLowerCase();
        const coordenadasX = formData.get('coordenadasX');
        const coordenadasY = formData.get('coordenadasY');
        const hr_inicio = formData.get('hora_inicio');
        const hr_fin = formData.get('hora_fin');
        const costo = formData.get('costo');

        try {
            const { data: newActividad, error } = await supabase
                .from('actividades_t')
                .insert([{
                    nombre,
                    direccion: `${coordenadasX}, ${coordenadasY}`,
                    descripcion,
                    tipo,
                    photo: url,
                    hr_inicio,
                    hr_fin,
                    costo,
                    departamento: 'Cundinamarca',
                    municipio: 'San_Juan',
                }]);

            if (error) {
                throw new Error(error.message);
            }
            await getActs();
        } catch (error) {
            console.error('Error:', error.message);
        }
    }, [getActs]);


    const deleteAct = useCallback(async (uid_actividades) => {
        try {
            const { data, error } = await supabase
                .from('actividades_t')
                .delete()
                .eq('uid_actividades', uid_actividades).single();
            if (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            console.error(error);
        }

    }, []);

    const getAct = useCallback(async (uid_actividades) => {
        try {
            const { data, error } = await supabase
                .from('actividades_t')
                .select('*')
                .eq('uid_actividades', uid_actividades)
                .single();

            if (error) {
                throw new Error(error.message);
            }
            const [coordenadasX, coordenadasY] = data.direccion.split(', ');
            return { ...data, coordenadasX, coordenadasY };
        } catch (error) {
            console.error('Error al obtener la actividad:', error);
            return null;
        }
    }, []);

    const updateAct = useCallback(async (uid_actividades, formData) => {
        try {
            let updatedAct = {};
            let isFormData = typeof formData.get === 'function';

            if (isFormData) {
                updatedAct = {
                    nombre: formData.get('nombre').toLowerCase(),
                    direccion: `${formData.get('coordenadasX')}, ${formData.get('coordenadasY')}`,
                    descripcion: formData.get('descripcion').toLowerCase(),
                    tipo: formData.get('tipo').toLowerCase(),
                    hr_inicio: formData.get('hr_inicio'),
                    hr_fin: formData.get('hr_fin'),
                    costo: formData.get('costo'),
                    departamento: 'Cundinamarca',
                    municipio: 'San_Juan',
                };

                const file = formData.get('photo');
                if (file) {
                    const url = await uploadImageAndGetURL(file);
                    updatedAct.photo = url;
                }
            } else {
                const { nombre, descripcion, tipo, coordenadasX, coordenadasY, hr_inicio, hr_fin, costo, photo } = formData;
                updatedAct = {
                    nombre,
                    direccion: `${coordenadasX}, ${coordenadasY}`,
                    descripcion,
                    tipo,
                    hr_inicio,
                    hr_fin,
                    costo,
                    departamento: 'Cundinamarca',
                    municipio: 'San_Juan',
                    photo
                };
            }

            if (!updatedAct.photo) {
                const { data: existingAct, error: fetchError } = await supabase
                    .from('actividades_t')
                    .select('photo')
                    .eq('uid_actividades', uid_actividades)
                    .single();

                if (fetchError) {
                    throw new Error(fetchError.message);
                }

                updatedAct.photo = existingAct.photo;
            }

            const { data, error } = await supabase
                .from('actividades_t')
                .update(updatedAct)
                .eq('uid_actividades', uid_actividades);

            if (error) {
                throw new Error(error.message);
            }

            setActs(prevActs =>
                prevActs.map(prevAct =>
                    prevAct.uid_actividades === uid_actividades
                        ? { ...prevAct, ...updatedAct }
                        : prevAct
                )
            );
        } catch (error) {
            console.error('Error al actualizar la actividad:', error);
        }
    }, []);

    const getRutas = useCallback(async (tipo) => {
        try {
            const { data, error } = await supabase
                .from('actividades_t')
                .select('*')
                .eq('tipo', tipo);

            if (error) {
                throw new Error(error.message);
            }

            if (data.length === 0) {
                throw new Error('No se encontraron rutas para el tipo especificado.');
            }

            return data;
        } catch (error) {
            console.error('Error al obtener rutas:', error);
            return [];
        }
    }, []);

    const getConduc = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('inf_conductor_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            return data;
        } catch (error) {
            console.error(error);
        }
    }, []);

    const createRutas = useCallback(async (values) => {
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
            await getRutas();
        } catch (error) {
            console.error('Error al crear la ruta:', error);
            throw new Error('Error interno del servidor');
        }
    }, []);

    return (
        <ActContext.Provider value={{
            acts,
            createActs,
            getActs,
            deleteAct,
            getAct,
            updateAct,
            getContActs,
            getConduc,
            getRutas,
            createRutas
        }}>
            {children}
        </ActContext.Provider>
    );
}