import { createContext, useContext, useState, useEffect } from "react"
import supabase from '../db1.js';

const reservaContext = createContext();

export const useReserva = () => {
    const context = useContext(reservaContext);

    if (!context) {
        throw new Error("useReserva must be used whitin a TaskProvider")
    }
    return context;
}

export function ReservaProvider({ children }) {

    const [reservas, setReservas] = useState([]);

    const getReservas = async () => {
        try {
            const { data: reservas, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            const reservasOrdenadas = reservas.sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva));
            setReservas(reservasOrdenadas);
            return reservasOrdenadas;
        } catch (error) {
            console.error("Error al obtener las reservas:", error);
            throw error;
        }
    };

    const getFechaReservas = async () => {
        try {
            const { data: reservas, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            const fechaActual = new Date().toISOString().split('T')[0];
            const reservasDelDia = reservas.filter((reserva) => reserva.fecha_reserva === fechaActual);

            return reservasDelDia;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const getReserva = async (uid_compra) => {
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .select('*')
                .eq('uid_compra', uid_compra)
                .single();

            if (error) {
                throw new Error(error.message);
            }

            if (!data) {
                throw new Error("No existe la Reserva");
            }

            return data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const getContReserva = async () => {
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }
            const fechaActual = new Date().toISOString().split('T')[0];
            const reservasDelDia = data.filter((reserva) => reserva.fecha_reserva === fechaActual);
            const numReservas = reservasDelDia.length;
            setReservas(numReservas);
            return numReservas;
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    useEffect(() => {
        getContReserva();
    }, []);

    const getTopActivities = async () => {
        try {
            const { data: reservas, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            const reservasOrdenadas = reservas.sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva));
            setReservas(reservasOrdenadas);
            return reservasOrdenadas;
        } catch (error) {
            console.error("Error al obtener las reservas:", error);
            throw error;
        }
    };

    const updateReservaStatus = async (uid_compra, newStatus) => {
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .update({ status: newStatus })
                .eq('uid_compra', uid_compra);
    
            if (error) {
                throw new Error(error.message);
            }
    
            // Actualiza la lista de reservas en el estado
            setReservas((prevReservas) =>
                prevReservas.map((reserva) =>
                    reserva.uid_compra === uid_compra ? { ...reserva, status: newStatus } : reserva
                )
            );
    
            return data;
        } catch (error) {
            console.error("Error al actualizar el estado de la reserva:", error);
            throw error;
        }
    };

    return (
        <reservaContext.Provider value={{
            reservas,
            getReserva,
            getReservas,
            getFechaReservas,
            getContReserva,
            getTopActivities,
            updateReservaStatus
        }}>
            {children}
        </reservaContext.Provider>
    );
}