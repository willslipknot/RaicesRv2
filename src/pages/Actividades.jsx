import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../assets/css/Actividades.css';
import NavBar from '../components/Home/NavBar.jsx';
import { useActs } from '../context/actContext';
import ActCard from '../components/UserLog/ActCard';
import { useVehiculo } from '../context/vehiculoContext.jsx';

const opciones = [
    { label: 'Estadia', value: 'cdca80ef-6f8d-478b-94f1-80e1e67da46d' },
    { label: 'Alimentacion', value: '35a0e8e0-728c-4712-81fd-1df805a0e294' },
    { label: 'Actividad', value: '859a6b07-ecd9-4c13-bc1c-6894d8fb0520' },
];

const colores = ['#FFC0CB', '#DDA0DD', '#7B68EE', '#7FFFD4', '#90EE90'];

function Actividades() {
    const { register, handleSubmit, reset, watch } = useForm();
    const { createActs, createRutas, getActs, acts, getRutas, getConduc } = useActs();
    const [tip, setTip] = useState('');
    const [file, setFile] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const { getVehiculo } = useVehiculo();
    const [nombreArchivo1, setNombreArchivo1] = useState('');
   const [modalOpen1, setModalOpen1] = useState(false);
    const [mostrarActividades, setMostrarActividades] = useState(true)
    const [mostrarRutas, setMostrarRutas] = useState(false)
    const [Alimentacion, setAlimentacion] = useState('');
    const [comida, setComida] = useState(null);
    const [ComSel, setComSel] = useState('');
    const [actividades, setActividades] = useState('');
    const [activity, setActivity] = useState(null);
    const [actSel, setActSel] = useState('');
    const [hospedaje, setHospedaje] = useState('');
    const [hosped, setHosped] = useState(null);
    const [hosSel, setHosSel] = useState('');
    const [conductor, setConductor] = useState('');
    const [conduc, setConduc] = useState(null);
    const [condSel, setCondSel] = useState('');
    const [placas, setPlacas] = useState('');
    const [pla, setPla] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            const selectedAlimentacion = '35a0e8e0-728c-4712-81fd-1df805a0e294';
            setAlimentacion(selectedAlimentacion);
            setComida(null);
        
            if (selectedAlimentacion) {
                try {
                    const alimentacionData = await getRutas(selectedAlimentacion);
                    const formattedAlimentacion = alimentacionData.map((alimentoData) => ({
                        label: alimentoData.nombre,
                        value: alimentoData.uid_actividades,
                    }));
                    setComida(formattedAlimentacion);
                } catch (error) {
                    console.error('Error al obtener alimentacion:', error);
                }
            }
        };
        
        const fetchData1 = async () => {
            const selectedActividad = '859a6b07-ecd9-4c13-bc1c-6894d8fb0520';
            setActividades(selectedActividad);
            setActivity(null);
        
            if (selectedActividad) {
                try {
                    const actividadesData = await getRutas(selectedActividad);
                    const formattedActividades = actividadesData.map((actividadData) => ({
                        label: actividadData.nombre,
                        value: actividadData.uid_actividades,
                    }));
                    setActivity(formattedActividades);
                } catch (error) {
                    console.error('Error al obtener actividades:', error);
                }
            }
        };
        
        const fetchData2 = async () => {
            const selectedHospedaje = 'cdca80ef-6f8d-478b-94f1-80e1e67da46d';
            setHospedaje(selectedHospedaje);
            setHosped(null);
        
            if (selectedHospedaje) {
                try {
                    const hospedajeData = await getRutas(selectedHospedaje);
                    const formattedHospedaje = hospedajeData.map((hospedaData) => ({
                        label: hospedaData.nombre,
                        value: hospedaData.uid_actividades,
                    }));
                    setHosped(formattedHospedaje);
                } catch (error) {
                    console.error('Error al obtener hospedaje:', error);
                }
            }
        };        
        const fetchData3 = async () => {
            setConduc(null);
        
            try {
                const conductorData = await getConduc();
                const formattedConductor = conductorData.map((conducData) => ({
                    label: `${conducData.first_name} ${conducData.first_last_name}`,
                    value: conducData.uid_conductor,
                    placa: conducData.uid_vehiculo,
                }));
        
                setConduc(formattedConductor);
            } catch (error) {
                console.error('Error al obtener conductores:', error);
            }
        };
        
        fetchData();
        fetchData1();
        fetchData2();
        fetchData3();

    }, []);

    useEffect(() => {
        const fetchData4 = async () => {
            if (placas) {
                try {
                    const vehiculoData = await getVehiculo(placas);
                    console.log('vehiculoData:', vehiculoData);
                    setPla(vehiculoData.data.placa);

                } catch (error) {
                    console.error('Error al obtener información del vehículo:', error);
                    setPla("");
                }
            }
        };
    
        fetchData4();
    }, [placas]);
    
    

    const handleAlimentacionChange = async (e) => {
        setComSel(e.target.value);
        console.log(e.target.value);
    }

    const handleActividadChange = async (e) => {
        setActSel(e.target.value);
        console.log(e.target.value);
    }

    const handleHospedajeChange = async (e) => {
        setHosSel(e.target.value);
        console.log(e.target.value);
    }

    const handleConductorChange = async (e) => {
        const selectedValue = e.target.value;
        setCondSel(selectedValue);
        console.log(selectedValue);
        
        const selectedPlaca = conduc.find(conducItem => conducItem.value === selectedValue)?.placa;

        setPlacas(selectedPlaca);
        console.log('Placa seleccionada:', selectedPlaca);
    };
    


    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenModal1 = () => {
        setModalOpen1(true);
    };

    const handleCloseModal1 = () => {
        setModalOpen1(false);
    };

    const handleTipoChange = (e) => {
        setTip(e.target.value);
    };

    const handleImagenChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleRutaSubmit = async (values) => {
        createRutas(values);
        reset();
        //window.location.reload();
    };

    const onSubmit = handleSubmit((data) => {
        if (!file) {
            alert('Debes subir un archivo')
            return
        }

        const formData = new FormData();
        formData.append('nombre', data.nombre);
        formData.append('coordenadasX', data.coordenadasX);
        formData.append('coordenadasY', data.coordenadasY);
        formData.append('hora_inicio', data.hr_inicio);
        formData.append('hora_fin', data.hr_fin);
        formData.append('descripcion', data.descripcion);
        formData.append('tipo', data.tipo);
        formData.append('photo', file);

        console.log("Datos del formulario:", data);

        createActs(formData);

        setMensaje('Actividad creada exitosamente');
        reset();

        setTimeout(() => {
            setMensaje('');
            window.location.reload();
        }, 3000);

    });

    const handleLimpiarClick = () => {
        reset();
        setMensaje('');

    };

    useEffect(() => {
        console.log('Fetching activities...');
        getActs();
    }, []);

    return (
        <div className="actividad-container">
            <NavBar />
            <div className="actividad-buttons">
                <button onClick={handleOpenModal}>Crear Actividad</button>
            </div>
            <div className="rutas-buttons">
                <button onClick={handleOpenModal1}>Crear Ruta</button>
            </div>
            <div className="actividad-content">
                <div className='cards'>
                    {acts && acts.length > 0 ? (
                        acts.map((act, index) => (
                            <ActCard key={act.uid_actividades} act={act} color={colores[index % colores.length]} />
                        ))
                    ) : (
                        <p>No hay actividades disponibles.</p>
                    )}
                </div>
                {modalOpen && (
                    <div className="modal" onClick={handleCloseModal}>
                        <div className="actividad-form" onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={onSubmit} className='actividad' >

                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre</label>
                                    <input type="text" className='formulario' {...register("nombre", { required: true })} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="direccion">Coordenada X</label>
                                    <input type="text" className='formulario' {...register("coordenadasX", { required: true })} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="direccion">Coordenada Y</label>
                                    <input type="text" className='formulario' {...register("coordenadasY", { required: true })} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="direccion">Hora Inicio</label>
                                    <input type="time" className='formulario' {...register("hora_inicio", { required: true })} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="direccion">Hora Final</label>
                                    <input type="time" className='formulario' {...register("hora_fin", { required: true })} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripcion</label>
                                    <textarea className="area" rows="3" {...register("descripcion", { required: true })} ></textarea>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tipo">Tipo</label>&nbsp;&nbsp;
                                    <select {...register('tipo', { required: true })} onChange={handleTipoChange} type="text" className='formulario-tipo' >
                                        <option value="">Selecciona un tipo</option>
                                        {opciones.map((opcion) => (
                                            <option key={opcion.value} value={opcion.value}>
                                                {opcion.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group-image">
                                    <input id='inputFile' type="file" onChange={handleImagenChange} className='formulario1' />
                                    <input type="text" value={nombreArchivo} hidden className='formulario' {...register("imagen")} />
                                </div>

                                <div className="form-group">
                                    <button type='submit'>Crear</button>
                                    <button type='button' onClick={handleLimpiarClick}>Limpiar</button>
                                </div>
                                {mensaje && <div className="mensaje">{mensaje}</div>}
                            </form>
                        </div>
                    </div>
                )}
                {modalOpen1 && (
                    <div className="modal" onClick={handleCloseModal1}>
                        <div className="ruta-form" onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={handleSubmit(handleRutaSubmit)} className='ruta' >
                                <div className="form-columns1">
                                    <div className="col11">

                                        <div className="form-group">
                                            <label htmlFor="nombre">Nombre</label>
                                            <input type="text" className='formulario' {...register("nombre", { required: true })} />
                                        </div>


                                        <div className="form-group">
                                            <label htmlFor="act1">Desayuno</label>&nbsp;&nbsp;
                                            <select {...register('act_1', { required: true })} className='formulario-tipos' onChange={handleAlimentacionChange} value={comida ? comida.value : ''}>
                                                <option value="">Selecciona un restaurante</option>
                                                {comida && comida.map((comidaItem, index) => (
                                                    <option key={comidaItem.value} value={comidaItem.value}>
                                                        {comidaItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="act2">Primera Actividad</label>&nbsp;&nbsp;
                                            <select {...register('act_2', { required: true })} className='formulario-tipos' onChange={handleActividadChange} value={activity ? activity.value : ''}>
                                                <option value="">Selecciona una actividad</option>
                                                {activity && activity.map((activityItem, index) => (
                                                    <option key={activityItem.value} value={activityItem.value}>
                                                        {activityItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="act3">Segunda Actividad</label>&nbsp;&nbsp;
                                            <select {...register('act_3', { required: true })} className='formulario-tipos' onChange={handleActividadChange} value={activity ? activity.value : ''}>
                                                <option value="">Selecciona una actividad</option>
                                                {activity && activity.map((activityItem, index) => (
                                                    <option key={activityItem.value} value={activityItem.value}>
                                                        {activityItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="act4">Tercera Actividad</label>&nbsp;&nbsp;
                                            <select {...register('act_4', { required: true })} className='formulario-tipos' onChange={handleActividadChange} value={activity ? activity.value : ''}>
                                                <option value="">Selecciona una actividad</option>
                                                {activity && activity.map((activityItem, index) => (
                                                    <option key={activityItem.value} value={activityItem.value}>
                                                        {activityItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="act5">Almuerzo</label>&nbsp;&nbsp;
                                            <select {...register('act_5', { required: true })} className='formulario-tipos' onChange={handleAlimentacionChange} value={comida ? comida.value : ''}>
                                                <option value="">Selecciona un restaurante</option>
                                                {comida && comida.map((comidaItem, index) => (
                                                    <option key={comidaItem.value} value={comidaItem.value}>
                                                        {comidaItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="act6">Cuarta Actividad</label>&nbsp;&nbsp;
                                            <select {...register('act_6', { required: true })} className='formulario-tipos' onChange={handleActividadChange} value={activity ? activity.value : ''}>
                                                <option value="">Selecciona una actividad</option>
                                                {activity && activity.map((activityItem, index) => (
                                                    <option key={activityItem.value} value={activityItem.value}>
                                                        {activityItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col22">
                                        <div className="form-group">
                                            <label htmlFor="act7">Quinta Actividad</label>&nbsp;&nbsp;
                                            <select {...register('act_7', { required: true })} className='formulario-tipos' onChange={handleActividadChange} value={activity ? activity.value : ''}>
                                                <option value="">Selecciona una actividad</option>
                                                {activity && activity.map((activityItem, index) => (
                                                    <option key={activityItem.value} value={activityItem.value}>
                                                        {activityItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="act8">Cena</label>&nbsp;&nbsp;
                                            <select {...register('act_8', { required: true })} className='formulario-tipos' onChange={handleAlimentacionChange} value={comida ? comida.value : ''}>
                                                <option value="">Selecciona un restaurante</option>
                                                {comida && comida.map((comidaItem, index) => (
                                                    <option key={comidaItem.value} value={comidaItem.value}>
                                                        {comidaItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="act9">Hospedaje</label>&nbsp;&nbsp;
                                            <select {...register('act_9', { required: true })} className='formulario-tipos' onChange={handleHospedajeChange} value={hosped ? hosped.value : ''}>
                                                <option value="">Selecciona una lugar</option>
                                                {hosped && hosped.map((hospedItem, index) => (
                                                    <option key={hospedItem.value} value={hospedItem.value}>
                                                        {hospedItem.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="descripcion">Descripcion</label>
                                            <textarea className="area1" rows="3" {...register("descripcion", { required: true })} ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button type='submit'>Crear</button>
                                    <button type='button' onClick={handleLimpiarClick}>Limpiar</button>
                                </div>

                                {mensaje && <div className="mensaje">{mensaje}</div>}
                            </form>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

 export default Actividades;
