import React, { useState, useEffect } from 'react';
import { useReserva } from '../context/reservaContext';
import { useCond } from '../context/condContext';
import { useAuth } from '../context/authContext';
import { useVehiculo } from '../context/vehiculoContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import '../assets/css/Reservas.css';

function Reservas() {
    const [reservas, setReservas] = useState([]);
    const [reservasFecha, setReservasFecha] = useState([]);
    const { getReservas, getFechaReservas, updateReservaStatus } = useReserva();
    const { getCond } = useCond();
    const { getVehiculo } = useVehiculo();
    const { getCliente } = useAuth();
    const [mostrarReservas, setMostrarReservas] = useState(true);
    const [mostrarDia, setMostrarDia] = useState(false);

    const handleMostrarReservas = () => {
        setMostrarReservas(true);
        setMostrarDia(false);
    };

    const handleMostrarDia = () => {
        setMostrarDia(true);
        setMostrarReservas(false);
    };

    const handleAprobarPago = async (uid_compra) => {
        try {
            await updateReservaStatus(uid_compra, 'pagado');
        } catch (error) {
            console.error('Error al aprobar pago:', error);
        }
    };

    useEffect(() => {
        const obtenerReservasDesdeBD = async () => {
            try {
                const reservasData = await getReservas();
                const reservasConDetalles = await Promise.all(reservasData.map(async (reserv) => {
                    const conductorData = await getCond(reserv.uid_conductor);
                    const vehiculoData = await getVehiculo(reserv.uid_vehiculo);
                    const clienteData = await getCliente(reserv.uid_cliente);

                    return {
                        ...reserv,
                        conductor: `${conductorData?.data?.first_name || 'Nombre no disponible'} ${conductorData?.data?.first_last_name || ''}`,
                        vehiculo: vehiculoData?.data?.placa || 'Placa no disponible',
                        cliente: `${clienteData?.data?.first_name || 'Nombre no disponible'} ${clienteData?.data?.first_last_name || ''}`,
                        telefono: clienteData?.data?.phone_number || 'Teléfono no disponible'
                    };
                }));
                setReservas(reservasConDetalles);
            } catch (error) {
                console.error('Error al obtener reservas:', error);
            }
        };

        const obtenerReservasFechaDesdeBD = async () => {
            try {
                const reservasFechaData = await getFechaReservas();
                const reservasFechaConDetalles = await Promise.all(reservasFechaData.map(async (reservF) => {
                    const conductorData = await getCond(reservF.uid_conductor);
                    const vehiculoData = await getVehiculo(reservF.uid_vehiculo);
                    const clienteData = await getCliente(reservF.uid_cliente);

                    return {
                        ...reservF,
                        conductor: `${conductorData?.data?.first_name || 'Nombre no disponible'} ${conductorData?.data?.first_last_name || ''}`,
                        vehiculo: vehiculoData?.data?.placa || 'Placa no disponible',
                        cliente: `${clienteData?.data?.first_name || 'Nombre no disponible'} ${clienteData?.data?.first_last_name || ''}`,
                        telefono: clienteData?.data?.phone_number || 'Teléfono no disponible'
                    };
                }));

                setReservasFecha(reservasFechaConDetalles);
            } catch (error) {
                console.error('Error al obtener reservas:', error);
            }
        };

        obtenerReservasDesdeBD();
        obtenerReservasFechaDesdeBD();
    }, [getReservas, getFechaReservas, getCond, getVehiculo, getCliente]);

    const addHeaderStyle = (ws) => {
        // Add header style (blue color) to the worksheet
        const headers = ws['!cols'] || [];
        headers.forEach((col) => {
            col.s = {
                fill: {
                    fgColor: { rgb: '0000FF' }
                },
                font: {
                    color: { rgb: 'FFFFFF' },
                    bold: true
                }
            };
        });
        ws['!cols'] = headers;
        return ws;
    };

    const exportToExcel = (conductores, actividades) => {
        const wb = XLSX.utils.book_new();

        // Process conductores sheet
        const wsConductores = XLSX.utils.json_to_sheet(conductores);
        addHeaderStyle(wsConductores);
        XLSX.utils.book_append_sheet(wb, wsConductores, "Conductores");

        // Process actividades sheet
        const wsActividades = XLSX.utils.json_to_sheet(actividades);
        addHeaderStyle(wsActividades);
        XLSX.utils.book_append_sheet(wb, wsActividades, "Actividades");

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'reservas_report.xlsx');
    };

    const handleDownloadReport = () => {
        const sortedConductores = [...reservas].sort((a, b) => b.calificacion - a.calificacion);
        const sortedActividades = [...reservasFecha].sort((a, b) => b.calificacion - a.calificacion);

        exportToExcel(sortedConductores, sortedActividades);
    };

    return (
        <div className='tablaRes'>
            <div className="buttons3">
                <button onClick={handleMostrarReservas}>Historico Reservas</button>
            </div>
            <div className="buttons2">
                <button onClick={handleMostrarDia}>Reservas del día</button>
            </div>
            <div className="buttons4">
                <button onClick={handleDownloadReport}>Descargar Reporte</button>
            </div>
            <br /><br />
            {mostrarReservas && (
                <table>
                    <thead>
                        <tr className='trTabla'>
                            <th>Actividad</th>
                            <th>Conductor</th>
                            <th>Vehiculo</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Telefono</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservas.map((reserv) => (
                            <tr key={reserv.uid_compra}>
                                <td>{reserv.nombre_actividad || 'N/A'}</td>
                                <td>{typeof reserv.conductor === 'string' ? reserv.conductor : 'Conductor no disponible'}</td>
                                <td>{typeof reserv.vehiculo === 'string' ? reserv.vehiculo : 'Vehículo no disponible'}</td>
                                <td>{reserv.fecha_reserva || 'Fecha no disponible'}</td>
                                <td>{reserv.hora || 'Hora no disponible'}</td>
                                <td>{typeof reserv.cliente === 'string' ? reserv.cliente : 'Cliente no disponible'}</td>
                                <td>{reserv.telefono || 'Teléfono no disponible'}</td>
                                <td>{reserv.status || 'Estado no disponible'}</td>
                                <td className='status'>
                                    {reserv.status === 'Pago en Proceso' && (
                                        <button onClick={() => handleAprobarPago(reserv.uid_compra)} className='BotonStatus'>
                                            Aprobar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {mostrarDia && (
                <table>
                    <thead>
                        <tr className='trTabla'>
                            <th>Actividad</th>
                            <th>Conductor</th>
                            <th>Vehiculo</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Telefono</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservasFecha.map((reservF) => (
                            <tr key={reservF.uid_compra}>
                                <td>{reservF.nombre_actividad || 'N/A'}</td>
                                <td>{typeof reservF.conductor === 'string' ? reservF.conductor : 'Conductor no disponible'}</td>
                                <td>{typeof reservF.vehiculo === 'string' ? reservF.vehiculo : 'Vehículo no disponible'}</td>
                                <td>{reservF.fecha_reserva || 'Fecha no disponible'}</td>
                                <td>{reservF.hora || 'Hora no disponible'}</td>
                                <td>{typeof reservF.cliente === 'string' ? reservF.cliente : 'Cliente no disponible'}</td>
                                <td>{reservF.telefono || 'Teléfono no disponible'}</td>
                                <td>{reservF.status || 'Estado no disponible'}</td>
                                <td className='status'>
                                    {reservF.status === 'pago en proceso' && (
                                        <button onClick={() => handleAprobarPago(reservF.uid_compra)} className='BotonStatus'>
                                            Aprobar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Reservas;
