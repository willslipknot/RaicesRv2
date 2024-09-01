import { createContext, useContext, useState, useCallback, useEffect } from "react";
import supabase from '../db1.js';

const reservaContext = createContext();

export const useReserva = () => {
    const context = useContext(reservaContext);
    if (!context) {
        throw new Error("useReserva must be used within a ReservaProvider");
    }
    return context;
};

export function ReservaProvider({ children }) {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);

    // Función para obtener todas las reservas
    const getReservas = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) throw new Error(error.message);

            const reservasOrdenadas = data.sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva));
            setReservas(reservasOrdenadas);
            return reservasOrdenadas;
        } catch (error) {
            console.error("Error al obtener las reservas:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener reservas del día
    const getFechaReservas = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) throw new Error(error.message);

            const fechaActual = new Date().toISOString().split('T')[0];
            return data.filter((reserva) => reserva.fecha_reserva === fechaActual);
        } catch (error) {
            console.error("Error al obtener reservas del día:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener una reserva específica
    const getReserva = useCallback(async (uid_compra) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .select('*')
                .eq('uid_compra', uid_compra)
                .single();

            if (error) throw new Error(error.message);
            if (!data) throw new Error("No existe la Reserva");

            return data;
        } catch (error) {
            console.error("Error al obtener la reserva:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener el conteo de reservas del día
    const getContReserva = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) throw new Error(error.message);

            const fechaActual = new Date().toISOString().split('T')[0];
            const reservasDelDia = data.filter((reserva) => reserva.fecha_reserva === fechaActual);
            setReservas(reservasDelDia.length);
            return reservasDelDia.length;
        } catch (error) {
            console.error("Error al obtener el conteo de reservas:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getContReserva();
    }, [getContReserva]);

    // Función para obtener las reservas más recientes
    const getTopActivities = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .select('*');

            if (error) throw new Error(error.message);

            const reservasOrdenadas = data.sort((a, b) => new Date(a.fecha_reserva) - new Date(b.fecha_reserva));
            setReservas(reservasOrdenadas);
            return reservasOrdenadas;
        } catch (error) {
            console.error("Error al obtener las reservas más recientes:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para actualizar el estado de una reserva
    const updateReservaStatus = useCallback(async (uid_compra, newStatus) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('carrito_ven_t')
                .update({ status: newStatus })
                .eq('uid_compra', uid_compra);

            if (error) throw new Error(error.message);

            setReservas(prevReservas =>
                prevReservas.map(reserva =>
                    reserva.uid_compra === uid_compra ? { ...reserva, status: newStatus } : reserva
                )
            );

            return data;
        } catch (error) {
            console.error("Error al actualizar el estado de la reserva:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener conductores ordenados por calificación
    const getAllCondsOrdenados = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inf_conductor_t')
                .select('*');

            if (error) throw new Error(error.message);

            return data.sort((a, b) => b.calificacion - a.calificacion);
        } catch (error) {
            console.error("Error al obtener los conductores ordenados:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para obtener actividades ordenadas por calificación
    const getAllActsOrdenadas = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('actividades_t')
                .select('*');

            if (error) throw new Error(error.message);

            return data.sort((a, b) => b.calificacion - a.calificacion);
        } catch (error) {
            console.error("Error al obtener las actividades ordenadas:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <reservaContext.Provider value={{
            reservas,
            loading,
            getReserva,
            getReservas,
            getFechaReservas,
            getContReserva,
            getTopActivities,
            updateReservaStatus,
            getAllActsOrdenadas,
            getAllCondsOrdenados
        }}>
            {children}
        </reservaContext.Provider>
    );
}
