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
            setConds(numConds);
        } catch (error) {
            console.error('Error al obtener el número de conductores:', error);
        }
    };


    const createConds = async (formData) => {
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
        const cedula = formData.get('cedula');
        const correo = formData.get('correo').toLowerCase();
        const phone_number = formData.get('phone_number');
        const uid_vehiculo = formData.get('uid_vehiculo');
        const tipo_licencia = formData.get('tipo_licencia').toLowerCase();

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
            setConds(newConductor);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    const deleteCond = async (uid_conductor) => {
        try {
            const { data, error } = await supabase
                .from('inf_conductor_t')
                .delete()
                .eq('uid_conductor', uid_conductor).single();
            if (error) {
                throw new Error(error.message);
            }
            if (!data) {
                console.error('No existe el Conductor, por lo que no se eliminó nada:', error);
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

            return { data };
        } catch (error) {
            console.error('Error al obtener el Conductor:', error);
            return null;
        }
    }

    const updateCond = async (uid_conductor, formData) => {
        try {
            let updatedCond = {};
            let isFormData = typeof formData.get === 'function';

            if (isFormData) {
                updatedCond = {
                    first_name: formData.get('first_name').toLowerCase(),
                    second_name: formData.get('second_name').toLowerCase(),
                    first_last_name: formData.get('first_last_name').toLowerCase(),
                    second_last_name: formData.get('second_last_name').toLowerCase(),
                    phone_number: formData.get('phone_number'),
                    cedula: formData.get('cedula'),
                    correo: formData.get('correo').toLowerCase(),
                    tipo_licencia: formData.get('tipo_licencia').toLowerCase(),
                    uid_vehiculo: formData.get('uid_vehiculo')
                };

                const file = formData.get('photo_perfil');
                if (file) {
                    const url = await uploadImageAndGetURL(file);
                    updatedCond.photo_perfil = url;
                }
            } else {
                const { first_name, second_name, first_last_name, second_last_name, phone_number, correo, cedula, tipo_licencia, uid_vehiculo, photo_perfil } = formData;

                updatedCond = {
                    first_name,
                    second_name,
                    first_last_name,
                    second_last_name,
                    phone_number,
                    cedula,
                    correo,
                    tipo_licencia,
                    uid_vehiculo,
                    photo_perfil
                };
            }

            if (!updatedCond.photo_perfil) {
                const { data: existingCond, error: fetchError } = await supabase
                    .from('inf_conductor_t')
                    .select('photo_perfil')
                    .eq('uid_conductor', uid_conductor)
                    .single();

                if (fetchError) {
                    throw new Error(fetchError.message);
                }

                updatedCond.photo_perfil = existingCond.photo_perfil;
            }

            const { data, error } = await supabase
                .from('inf_conductor_t')
                .update(updatedCond)
                .eq('uid_conductor', uid_conductor);

            if (error) {
                throw new Error(error.message);
            }

            setConds(prevconds =>
                prevconds.map(prevcond =>
                    prevcond.uid_conductor === uid_conductor
                        ? { ...prevcond, ...updatedCond }
                        : prevcond
                )
            );
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
