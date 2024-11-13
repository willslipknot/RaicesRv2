import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import '../assets/css/Conductor.css';
import NavBar from '../components/Home/NavBar.jsx';
import { useCond } from '../context/condContext';
import { useVehiculo } from '../context/vehiculoContext.jsx';
import { useAuth } from '../context/authContext.jsx';
import CondCard from '../components/UserLog/CondCard';
import VehCard from '../components/UserLog/VehCard.jsx';


const opciones = [
    { label: 'a2 - b1', value: 'a2-b1' },
    { label: 'a2', value: 'a2' },
    { label: 'b1', value: 'b1' }
];

const opciones1 = [
    { label: 'Moto', value: 'a2' },
    { label: 'Carro', value: 'b1' },
];

function Conductor() {
    const { register, handleSubmit, reset } = useForm();
    const { createConds, getConds, conds, createUserConds } = useCond();
    const { getVeh, createVehiculos, vehiculos, getVehiculos } = useVehiculo();
    const { create_UserCond } = useAuth();

    const [clase, setClase] = useState('');
    const [file, setFile] = useState(null);
    const [mensaje, setMensaje] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen1, setModalOpen1] = useState(false);
    const [mostrarConductores, setMostrarConductores] = useState(true);
    const [mostrarVehiculos, setMostrarVehiculos] = useState(false);

    const [vehiculoSel, setVehiculoSel] = useState(null);
    const [vehiculo, setVehiculo] = useState(null);
    const [allVehiculo, setAllVehiculo] = useState([]);
    const navigate = useNavigate();

    const colors = ['#2962FF', '#FF6D00', '#2E7D32', '#D50000', '#000000'];

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        reset();
        setClase('');
        setVehiculoSel('');
    };

    const handleOpenModal1 = () => {
        setModalOpen1(true);
    };

    const handleCloseModal1 = () => {
        setModalOpen1(false);
        reset();
        setClase('');
        setVehiculoSel('');
        
    };

    const handleMostrarConductores = () => {
        setMostrarConductores(true);
        setMostrarVehiculos(false);
    };

    const handleMostrarVehiculos = () => {
        setMostrarVehiculos(true);
        setMostrarConductores(false);
    };

    const handleResetCond = () => {
        reset();
        setClase('');
        setVehiculoSel('');
    };

    const handleTipoVehChange = async (e) => {
        const selectedTipVeh = e.target.value;
        setClase(selectedTipVeh);
        setVehiculo(null);
        let vehiculosData

        if (selectedTipVeh) {
            if (selectedTipVeh === 'a2-b1') {
                vehiculosData = await getVehiculos();
            }
            else {
                vehiculosData = await getVeh(selectedTipVeh);
            }
            try {
                const formattedVehiculos = vehiculosData.map((vehiculoData) => ({
                    label: vehiculoData.placa,
                    value: vehiculoData.uid_vehiculo,
                }));
                setVehiculo(formattedVehiculos);
            } catch (error) {
            }
        }
    };

    const handleVehiculoChange = (e) => {
        setVehiculoSel(e.target.value);
    };

    const handleImagenChange = (e) => {
        setFile(e.target.files[0]);
    };

    const onSubmit = handleSubmit(async (data) => {
        if (!file) {
            alert('Debes subir un archivo');
            return;
        }

        const formData1 = new FormData();
        formData1.append('cedula', data.cedula);
        formData1.append('correo', data.correo);

        const id_cond = await create_UserCond(formData1);

        if (!id_cond) {
            alert('No se pudo crear el usuario');
            return;
        }

        const formData = new FormData();
        formData.append('uid_conductor', id_cond);
        formData.append('first_name', data.first_name);
        formData.append('second_name', data.second_name);
        formData.append('first_last_name', data.first_last_name);
        formData.append('second_last_name', data.second_last_name);
        formData.append('correo', data.correo);
        formData.append('phone_number', data.phone_number);
        formData.append('cedula', data.cedula);
        formData.append('uid_vehiculo', data.uid_vehiculo);
        formData.append('tipo_licencia', data.tipo_licencia);
        formData.append('photo_perfil', file);

        try {
            await createConds(formData);
            createUserConds(formData);
            setMensaje('Conductor creado exitosamente');
            navigate('/Conductores');
            handleResetCond();


            setTimeout(() => {
                setMensaje('');

            }, 3000);
        } catch (error) {
            console.error('Error al crear conductor:', error);
            alert('Ocurrió un error al crear el conductor');
        }
    });


    const onSubmit1 = handleSubmit((data) => {
        if (!file) {
            alert('Debes subir un archivo');
            return;
        }

        const formData = new FormData();
        formData.append('placa', data.placa);
        formData.append('marca', data.marca);
        formData.append('linea', data.linea);
        formData.append('modelo', data.modelo);
        formData.append('clase', data.clase);
        formData.append('cilindra', data.cilindra);
        formData.append('color', data.color);
        formData.append('carroceria', data.carroceria);
        formData.append('combustible', data.combustible);
        formData.append('tipo_licencia', data.tipo_licencia);
        formData.append('photo_perfil', file);

        createVehiculos(formData);

        setMensaje('Vehiculo creado exitosamente');
        reset();

        setTimeout(() => {
            setMensaje('');
        }, 3000);
    });

    const handleLimpiarClick = () => {
        reset();
        setMensaje('');
        setClase('');
        setVehiculoSel('');
    };

    useEffect(() => {
        getConds();
        const obtenerConductores = async () => {
            await getVehiculos();
            setAllVehiculo(vehiculos);
        };

        obtenerConductores();
    }, [getVehiculos, vehiculos]);

    return (
        <div className="conductor-container">
            <NavBar />
            <div className="conductor-buttons2">
                <button onClick={handleOpenModal}>Crear Conductor</button>
            </div>

            <div className="vehiculo-buttons">
                <button onClick={handleOpenModal1}>Crear Vehiculo</button>
            </div>

            <div className="conductor-buttons1">
                <button onClick={handleMostrarConductores}>Ver Conductores</button>
            </div>

            <div className="vehiculo-buttons1">
                <button onClick={handleMostrarVehiculos}>Ver Vehiculos</button>
            </div>

            <div className="conductor-content">
                {mostrarConductores && (
                    <div className="cards" style={{ paddingBottom: '4rem' }}>
                        {conds && Array.isArray(conds) ? (
                            conds.map((cond, index) => (
                                <CondCard key={cond.uid_conductor} cond={cond} style={{ backgroundColor: colors[index % colors.length] }}/>
                            ))
                        ) : (
                            <p>Actualizando conductores</p>
                        )}
                        <br></br><br></br><br></br>  
                    </div>
                )}

                {mostrarVehiculos && (
                    <div className="cards" style={{ paddingBottom: '4rem' }}>
                        {allVehiculo && Array.isArray(allVehiculo) ? (
                            allVehiculo.map((veh, index) => (
                                <VehCard key={veh.uid_vehiculo} veh={veh} style={{ backgroundColor: colors[index % colors.length] }}  />
                            ))
                        ) : (
                            <p>Actualizando vehículos</p>
                        )}
                    </div>
                )}

                {modalOpen && (
                    <div className="modal" onClick={handleCloseModal}>
                        <div className="conductor-form11" onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={onSubmit} className='conductor11'>
                                <div className="form-columns">
                                    <div className="col1">
                                        <div className="form-group">
                                            <label htmlFor="nombre">Nombre</label>
                                            <input type="text" className='formulario' {...register("first_name", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nombre">Segundo Nombre</label>
                                            <input type="text" className='formulario' {...register("second_name", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="apellido">Primer Apellido</label>
                                            <input type="text" className='formulario'  {...register("first_last_name", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="apellido">Segundo Apellido</label>
                                            <input type="text" className='formulario'  {...register("second_last_name", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="apellido">Numero Telefono</label>
                                            <input type="text" className='formulario'  {...register("phone_number", { required: true })} />
                                        </div>
                                    </div>
                                    <div className="col2">
                                        <div className="form-group">
                                            <label htmlFor="apellido">Correo</label>
                                            <input type="text" className='formulario'  {...register("correo", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="licencia">Cedula/Licencia</label>
                                            <input type="text" className='formulario'  {...register("cedula", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="clase">Tipo Licencia</label>&nbsp;&nbsp;
                                            <select {...register('tipo_licencia', { required: true })} onChange={handleTipoVehChange} className='formulario-tipo' value={clase || ''}>
                                                <option value="">Selecciona un tipo</option>
                                                {opciones.map((clase) => (
                                                    <option key={clase.value} value={clase.value}>{clase.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="vehiculo">Vehiculo</label>&nbsp;&nbsp;
                                            <select {...register('uid_vehiculo', { required: true })} onChange={handleVehiculoChange} className='formulario-tipo' value={vehiculoSel || ''}>
                                                <option value="">Selecciona un vehiculo</option>
                                                {vehiculo && vehiculo.map((veh) => (
                                                    <option key={veh.value} value={veh.value}>{veh.label}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="imagen">Imagen de Perfil</label>
                                            <input type="file" accept="image/*" className='formulario1' onChange={handleImagenChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button type="submit">Guardar</button>
                                    <button type="button" onClick={handleLimpiarClick}>Limpiar</button>
                                </div>

                                {mensaje && <p>{mensaje}</p>}
                            </form>
                        </div>
                    </div>
                )}

                {modalOpen1 && (
                    <div className="modal" onClick={handleCloseModal1}>
                        <div className="vehiculo-form" onClick={(e) => e.stopPropagation()}>
                            <form onSubmit={onSubmit1} className='vehiculo'>
                                <div className="form-columns">
                                    <div className="col1">
                                        <div className="form-group">
                                            <label htmlFor="nombre">Placa</label>
                                            <input type="text" className='formulario' {...register("placa", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="marca">Marca</label>
                                            <input type="text" className='formulario' {...register("marca", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="linea">Linea</label>
                                            <input type="text" className='formulario' {...register("linea", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="modelo">Modelo</label>
                                            <input type="text" className='formulario' {...register("modelo", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="clase">Clase</label>
                                            <input type="text" className='formulario' {...register("clase", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="clase">Tipo Licencia</label>&nbsp;&nbsp;
                                            <select
                                                {...register('tipo_licencia', { required: true })}
                                                onChange={handleTipoVehChange}
                                                className='formulario-tipo'
                                                defaultValue=""
                                            >
                                                <option value="">Selecciona un tipo</option>
                                                {opciones1.map((opcion) => (
                                                    <option key={opcion.value} value={opcion.value}>
                                                        {opcion.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col2">
                                        <div className="form-group">
                                            <label htmlFor="cilindra">Cilindraje</label>
                                            <input type="text" className='formulario' {...register("cilindra", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="color">Color</label>
                                            <input type="text" className='formulario' {...register("color", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="carroceria">Carroceria</label>
                                            <input type="text" className='formulario' {...register("carroceria", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="combustible">Combustible</label>
                                            <input type="text" className='formulario' {...register("combustible", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="imagen">Imagen</label>
                                            <input type="file" accept="image/*" className='formulario1' onChange={handleImagenChange} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <button type="submit">Guardar</button>
                                    <button type="button" onClick={handleLimpiarClick}>Limpiar</button>
                                </div>

                                {mensaje && <p>{mensaje}</p>}

                            </form>

                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}

export default Conductor;
