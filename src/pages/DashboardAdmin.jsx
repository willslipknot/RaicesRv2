import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import NavBar from '../components/Home/NavBar.jsx';
import '../assets/css/Home.css';
import { useActs } from '../context/actContext.jsx';
import { useCond } from '../context/condContext.jsx';
import { useVehiculo } from '../context/vehiculoContext.jsx';
import { useReserva } from '../context/reservaContext.jsx';
import { BsFilePersonFill, BsGeoAltFill, BsFillBellFill, BsRocketFill, BsInfoCircle } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function DashboardAdmin() {
    const navigate = useNavigate(); // Crear el hook para navegar
    const { getContActs, acts } = useActs();
    const { getContConds, conds, getCond } = useCond();
    const { getContVehiculos, vehiculos } = useVehiculo();
    const { getContReserva, getTopActivities } = useReserva();
    const [datosGrafico, setDatosGrafico] = useState([]);
    const [datosGrafico1, setDatosGrafico1] = useState([]);
    const [date, setDate] = useState(new Date());
    const [mes, setMes] = useState((date.getMonth() + 1));
    const [numReservas, setNumReservas] = useState('Cargando...');
    const [showTooltip, setShowTooltip] = useState(false);

    const obtenerColorPorIndice = (index) => {
        const colores = ['#FFC0CB', '#DDA0DD', '#7B68EE', '#7FFFD4', '#90EE90'];
        return colores[index % colores.length];
    };

    const ContReservas = async () => {
        try {
            const resultado = await getContReserva();
            setNumReservas(resultado);
        } catch (error) {
            console.error('Error al obtener el conteo de reservas:', error);
            setNumReservas('Error');
        }
    };

    useEffect(() => {
        ContReservas();
    }, []);

    const contarActividades = async () => {
        try {
            const registros = await getTopActivities();
            const contadorActividades = {};

            registros.forEach((registro) => {
                const nombreActividad = registro.nombre_actividad;
                const fechaRegistro = registro.fecha_reserva;
                const [year, month, day] = fechaRegistro.split('-');

                if (parseInt(month) === mes) {
                    if (contadorActividades[nombreActividad]) {
                        contadorActividades[nombreActividad]++;
                    } else {
                        contadorActividades[nombreActividad] = 1;
                    }
                }
            });

            const data = Object.keys(contadorActividades)
                .map((nombre, index) => ({
                    name: nombre,
                    cantidad: contadorActividades[nombre],
                    fill: obtenerColorPorIndice(index),
                }))
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 5);

            setDatosGrafico(data);
        } catch (error) {
            console.error(error);
        }
    };

    const contarConductores = async () => {
        try {
            const registros = await getTopActivities();

            const promesasConductor = registros.map(async (registro) => {
                const idConductor = registro.uid_conductor;
                const conductorA = await getCond(idConductor);
                return conductorA.data.first_name;
            });

            const nombresConductores = await Promise.all(promesasConductor);

            const contadorConductores = {};

            registros.forEach((registro, index) => {
                const nombreConductor = nombresConductores[index] || 'Desconocido';
                const fechaRegistro = registro.fecha_reserva;
                const [year, month, day] = fechaRegistro.split('-');
                if (parseInt(month) === mes) {
                    if (contadorConductores[nombreConductor]) {
                        contadorConductores[nombreConductor]++;
                    } else {
                        contadorConductores[nombreConductor] = 1;
                    }
                }
            });

            const data = Object.keys(contadorConductores)
                .map((nombre, index) => ({
                    name: nombre,
                    cantidad: contadorConductores[nombre],
                    fill: obtenerColorPorIndice(index),
                }))
                .sort((a, b) => b.cantidad - a.cantidad)
                .slice(0, 5);

            setDatosGrafico1(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        contarActividades();
        contarConductores();
    }, [mes]);

    const onMonthClick = (newDate) => {
        setDate(newDate);
        const mesSeleccionado = (newDate.getMonth() + 1);
        setMes(mesSeleccionado);
    };

    useEffect(() => {
        const miniMapContainer = document.getElementById('miniMap');

        if (miniMapContainer && !miniMapContainer._leaflet_id) {
            const miniMap = L.map('miniMap').setView([4.8486111111111, -74.620555555556], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
            }).addTo(miniMap);
        }
    }, []);

    useEffect(() => {
        getContActs();
        getContConds();
        getContVehiculos();
        getContReserva();
        contarActividades();
        contarConductores();
    }, []);

    return (
        <div>
            <NavBar />
            <br></br><br></br>
            <main className='main-container'>

                <div className='main-cards'>
                    <div className='card' onClick={() => navigate('/Actividades')}>
                        <div className='card-inner'>
                            <h3>Actividades</h3>
                            <BsGeoAltFill className='card_icon' />
                        </div>
                        <h1>{typeof acts === 'number' ? acts : 'Cargando...'}</h1>
                    </div>
                    <div className='card' onClick={() => navigate('/Conductores')}>
                        <div className='card-inner'>
                            <h3>Conductores</h3>
                            <BsFilePersonFill className='card_icon' />
                        </div>
                        <h1>{typeof conds === 'number' ? conds : 'Cargando...'}</h1>
                    </div>
                    <div className='card' onClick={() => navigate('/Conductores')}>
                        <div className='card-inner'>
                            <h3>Vehiculos</h3>
                            <BsRocketFill className='card_icon' />
                        </div>
                        <h1>{typeof vehiculos === 'number' ? vehiculos : 'Cargando...'}</h1>
                    </div>
                    <div className='card' onClick={() => navigate('/Reservas')}>
                        <div className='card-inner'>
                            <h3>Reservas</h3>
                            <BsFillBellFill className='card_icon' />
                        </div>
                        <h1>{typeof numReservas === 'number' ? numReservas : 'Cargando...'}</h1>
                    </div>
                </div>

                <div className='charts0'>
                    <Calendar
                        className={'calendario'}
                        view="year"
                        onClickMonth={onMonthClick}
                        value={date}
                    />
                    <BsInfoCircle 
                        className="info-icon" 
                        onClick={() => setShowTooltip(!showTooltip)} 
                        style={{ position: 'absolute', top: 260, right: 940, cursor: 'pointer' }}
                    />
                    {showTooltip && (
                        <div className="tooltip" 
                            style={{ position: 'absolute', top: 285, right: 740, zIndex: 1000 }}>
                            Filtra por mes las graficas top
                        </div>
                    )}

                    <div id="miniMap" className='minimapa'></div>
                </div>

                <div className='charts'>
                    <ResponsiveContainer width="105%" height={290}>
                        <h2>Top 5 Rutas</h2>
                        <br></br>
                        <BarChart
                            data={datosGrafico}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="cantidad" fill="white" />
                        </BarChart>
                    </ResponsiveContainer>

                    <ResponsiveContainer width="100%" height={290}>
                        <h2>Top 5 Conductores </h2>
                        <br></br>
                        <BarChart
                            data={datosGrafico1}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="cantidad" fill="white" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <br></br><br></br>
            </main>
        </div>
    );
}

export default DashboardAdmin;
