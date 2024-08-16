import { createContext, useContext, useState } from "react";
import supabase from '../db1.js';
import { uploadImageAndGetURL } from '../middlewares/imagen.js';

const VehiculoContext = createContext();

export const useVehiculo = () => {
    const context = useContext(VehiculoContext);

    if (!context) {
        throw new Error("useVehiculo must be used whitin a TaskProvider")
    }
    return context;
}

export function VehiculoProvider({ children }) {

    const [vehiculos, setVehiculos] = useState([]);


    const getVehiculos = async () => {
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .select('*');
    
            if (error) {
                throw new Error(error.message);
            }
            console.log(data)
            setVehiculos(data)
        } catch (error) {
            console.error(error);
        }

    }

    const getVeh = async (clase) => {
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .select('*')
                .eq('clase', clase);

            if (error) {
                throw new Error(error.message);
            }

            if (data.length === 0) {
                console.log("No existen vehículos para la clase proporcionada.");
                return [];
            }

            setVehiculos(data);
            return data;
        } catch (error) {
            console.error('Error al obtener vehículos por clase:', error);
            return null;
        }
    };

    const getContVehiculos = async () => {
        try {
            const { data: vehiculos, error } = await supabase
                .from('inf_vehi_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            const numVehs = vehiculos.length;
            console.log(`Número de vehiculos existentes: ${numVehs}`);
            setVehiculos(numVehs);

        } catch (error) {
            console.error('Error al obtener el número de vehiculos:', error);
        }
    }

    const createVehiculos = async (formData) => {
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
        const placa = formData.get('placa');
        const marca = formData.get('marca');
        const linea = formData.get('linea');
        const modelo = formData.get('modelo');
        const cilindra = formData.get('cilindra');
        const color = formData.get('color');
        const clase = formData.get('clase');
        const carroceria = formData.get('carroceria');
        const combustible = formData.get('combustible');


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
                        disponible: "1"
                    },
                ]);
    
            if (error) {
                throw new Error(error.message);
            }
    
            console.log('Conductor creado correctamente', newVehiculo);
            setVehiculos(newVehiculo);
        } catch (error) {
            console.error('Error:', error.message);
        }    
    }

    const deleteVehiculo = async (uid_vehiculo) => {
        console.log(uid_vehiculo);
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .delete()
                .eq('uid_vehiculo', uid_vehiculo).single();
            if (error) {
                throw new Error(error.message);
            }
            if (!data) {
                return res.status(405).json(["No existe el vehiculo, por lo que no se eliminó nada"]);
            }
        } catch (error) {
            console.error(error);
        }

    }

    const getVehiculo = async (uid_vehiculo) => {
        try {
            const { data, error } = await supabase
                .from('inf_vehi_t')
                .select('*')
                .eq('uid_vehiculo', uid_vehiculo)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            console.log('Vehiculo encontrado:', data);

            return { data };
        } catch (error) {
            console.error('Error al obtener el Vehiculo:', error);
            return null;
        }
    }
    

    return (
        <VehiculoContext.Provider value={{
            vehiculos,
            createVehiculos,
            getVehiculos,
            deleteVehiculo,
            getVehiculo,
            getContVehiculos,
            getVeh,

        }}>
            {children}
        </VehiculoContext.Provider>
    );
}