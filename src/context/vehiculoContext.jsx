import { createContext, useContext, useState, useCallback } from "react";
import supabase from '../db1.js';
import { uploadImageAndGetURL } from '../middlewares/imagen.js';

const VehiculoContext = createContext();

export const useVehiculo = () => {
    const context = useContext(VehiculoContext);
    if (!context) {
        throw new Error("useVehiculo must be used within a VehiculoProvider");
    }
    return context;
};

export function VehiculoProvider({ children }) {
    const [vehiculos, setVehiculos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Función para obtener todos los vehículos
    const getVehiculos = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }
            setVehiculos(data);
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener vehículos por clase
    const getVeh = useCallback(async (clase) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .select('*')
                .eq('tipo_vehiculo', clase);

            if (error) {
                throw new Error(error.message);
            }

            setVehiculos(data);
            return data;
        } catch (error) {
            console.error('Error al obtener vehículos por clase:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener el conteo de vehículos
    const getContVehiculos = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            const numVehs = data.length;
            setVehiculos(numVehs);
        } catch (error) {
            console.error('Error al obtener el número de vehículos:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para crear un vehículo
    const createVehiculos = useCallback(async (formData) => {
        const file = formData.get('photo_perfil');
        if (!file) {
            console.error('No file found in formData');
            return;
        }
        const url = await uploadImageAndGetURL(file);
        const placa = formData.get('placa').toLowerCase();
        const marca = formData.get('marca').toLowerCase();
        const linea = formData.get('linea').toLowerCase();
        const modelo = formData.get('modelo').toLowerCase();
        const cilindra = formData.get('cilindra').toLowerCase();
        const color = formData.get('color').toLowerCase();
        const clase = formData.get('clase').toLowerCase();
        const carroceria = formData.get('carroceria').toLowerCase();
        const combustible = formData.get('combustible').toLowerCase();
        const tipo_vehiculo = formData.get('tipo_licencia').toLowerCase();


        try {
            const { data: newVehiculo, error } = await supabase
                .from('inf_vehi_t')
                .insert([
                    {
                        placa,
                        marca,
                        linea,
                        modelo,
                        photo_perfil: url,
                        cilindra,
                        color,
                        clase,
                        carroceria,
                        combustible,
                        disponible: "1",
                        tipo_vehiculo
                    },
                ]);

            if (error) {
                throw new Error(error.message);
            }
            setVehiculos(newVehiculo);
        } catch (error) {
            console.error('Error:', error.message);
        }
    },[]);


    // Función para eliminar un vehículo
    const deleteVehiculo =useCallback(async (uid_vehiculo) => {
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .delete()
                .eq('uid_vehiculo', uid_vehiculo).single();
            if (error) {
                throw new Error(error.message);
            }

        } catch (error) {
            console.error(error);
        }

    },[]);

    // Función para obtener un vehículo específico
    const getVehiculo = useCallback(async (uid_vehiculo) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .select('*')
                .eq('uid_vehiculo', uid_vehiculo)
                .single();

            if (error) {
                throw new Error(error.message);
            }
            return data;
        } catch (error) {
            console.error('Error al obtener el vehículo:', error);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <VehiculoContext.Provider value={{
            vehiculos,
            loading,
            createVehiculos,
            getVehiculos,
            deleteVehiculo,
            getVehiculo,
            getContVehiculos,
            getVeh
        }}>
            {children}
        </VehiculoContext.Provider>
    );
}
