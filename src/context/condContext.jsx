import { createContext, useContext, useState } from "react"
import supabase from '../db1.js';
import { uploadImageAndGetURL } from '../middlewares/imagen.js';


const condContext = createContext();

export const useCond = () => {
    const context = useContext(condContext);

    if (!context) {
        throw new Error("useCond must be used whitin a TaskProvider")
    }
    return context;
}

export function CondProvider({ children }) {

    const [conds, setConds] = useState([]);

    const getConds = async () => {
        try {
            const { data, error } = await supabase
                .from('inf_conductor_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }
            console.log(data)
            setConds(data)
        } catch (error) {
            console.error(error);
        }

    }

    const getContConds = async () => {
        try {
            const { data: conductores, error } = await supabase
                .from('inf_conductor_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            const numConds = conductores.length;
            console.log(`Número de conductores existentes: ${numConds}`);
            setConds(numConds);

        } catch (error) {
            console.error('Error al obtener el número de conductores:', error);
        }
    };
    

    const createConds = async (formData) => {
        console.log('Datos del FormData:', formData);
        // Asegúrate de que `file` esté en `formData`
        const file = formData.get('photo_perfil');
        if (!file) {
            console.error('No file found in formData');
            return;
        }
        // Subir imagen y obtener URL
        const url = await uploadImageAndGetURL(file);
        console.log(url);

        // Obtener otros campos de `formData`
        const first_name = formData.get('first_name');
        const second_name = formData.get('second_name');
        const first_last_name = formData.get('first_last_name');
        const second_last_name = formData.get('second_last_name');
        const cedula = formData.get('cedula');
        const correo = formData.get('correo');
        const phone_number = formData.get('phone_number');
        const uid_vehiculo = formData.get('uid_vehiculo');
        const tipo_licencia = formData.get('tipo_licencia');

        try {
            const { data: newConductor, error } = await supabase
                .from('inf_conductor_t')
                .insert([
                    {
                        first_name,
                        second_name,
                        first_last_name,
                        second_last_name,
                        photo_perfil: url,
                        cedula,
                        uid_vehiculo,
                        tipo_licencia,
                        phone_number,
                        correo
                    },
                ]);

            if (error) {
                throw new Error(error.message);
            }

            console.log('Conductor creado correctamente', newConductor);
            setConds(newConductor);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const deleteCond = async (uid_conductor) => {
        console.log(uid_conductor);
        try {
            const { data, error } = await supabase
                .from('inf_conductor_t')
                .delete()
                .eq('uid_conductor', uid_conductor).single();
            if (error) {
                throw new Error(error.message);
            }
            if (!data) {
                return res.status(405).json(["No existe el Conductor, por lo que no se eliminó nada"]);
            }
        } catch (error) {
            console.error(error);
        }

    }

    const getCond = async (uid_conductor) => {
        try {
            const { data, error } = await supabase
                .from('inf_conductor_t')
                .select('*')
                .eq('uid_conductor', uid_conductor)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            console.log('Conductor encontrado:', data);

            return { data };
        } catch (error) {
            console.error('Error al obtener el Conductor:', error);
            return null;
        }
    }

    const updateCond = async (uid_conductor, cond) => {
        try {
            let url;
            const file = cond.get('photo_perfil');
            if (file) {
                url = await uploadImageAndGetURL(file);
            }

            const first_name = cond.get('first_name');
            const second_name = cond.get('second_name');
            const first_last_name = cond.get('first_last_name');
            const second_last_name = cond.get('second_last_name');
            const phone_number = cond.get('phone_number');
            const cedula = cond.get('cedula');
            const correo = cond.get('correo');
            const tipo_licencia = cond.get('tipo_licencia');
            const uid_vehiculo = cond.get('uid_vehiculo');

            const updatedCond = {
                first_name,
                second_name,
                first_last_name,
                second_last_name,
                phone_number,
                cedula,
                correo,
                tipo_licencia,
                uid_vehiculo
            };

            if (url) {
                updatedCond.photo_perfil = url;
            }

            const { data, error } = await supabase
                .from('inf_conductor_t')
                .update(updatedCond)
                .eq('uid_conductor', uid_conductor);

            if (error) {
                throw new Error(error.message);
            }

            // Actualizar el estado local
            setConds(prevconds => {
                return prevconds.map(prevcond => {
                    if (prevcond.uid_conductor === uid_conductor) {
                        return { ...prevcond, ...updatedCond };
                    }
                    return prevcond;
                });
            });

            console.log('Conductor actualizado correctamente', data);
        } catch (error) {
            console.error('Error al actualizar Conductor:', error);
        }
    };

    return (
        <condContext.Provider value={{
            conds,
            createConds,
            getConds,
            deleteCond,
            getCond,
            updateCond,
            getContConds

        }}>
            {children}
        </condContext.Provider>
    );
}