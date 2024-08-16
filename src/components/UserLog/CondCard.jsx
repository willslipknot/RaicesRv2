import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../../assets/css/CondCard.css';
import { useCond } from '../../context/condContext';
import { useVehiculo } from '../../context/vehiculoContext.jsx';

const opciones = [
    { label: 'A2', value: 'A2' },
    { label: 'B1', value: 'B1' }
];

function CondCard({ cond }) {

    const [modalOpen, setModalOpen] = useState(false);
    const { deleteCond, getCond, updateCond } = useCond();
    const { getVeh } = useVehiculo();

    const [selectedId, setSelectedId] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();
    const [tip, setTip] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [vehiculoSel, setVehiculoSel] = useState('');
    const [vehiculo, setVehiculo] = useState(null);
    const [clase, setClase] = useState('');
    const [file, setFile] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState('');

    useEffect(() => {
        if (selectedId !== null) {
            async function loadCond() {
                const act = await getCond(selectedId);
                console.log('act', act.data.cedula)
                if (act) {
                    setValue('first_name', act.data.first_name);
                    setValue('second_name', act.data.second_name);
                    setValue('first_last_name', act.data.first_last_name);
                    setValue('second_last_name', act.data.second_last_name);
                    setValue('correo', act.data.correo);
                    setValue('phone_number', act.data.phone_number);
                    setValue('cedula', act.data.cedula);
                    setValue('uid_vehiculo', act.data.uid_vehiculo);
                    setValue('tipo_licencia', act.data.tipo_licencia);
                    setValue('photo_perfil', file);

                } else {
                    console.error('No se encontró el conductor.');
                }
            }
            loadCond();
        }
    }, [selectedId]);

    const handleOpenModal = () => {
        if (cond && cond.uid_conductor) {
            setSelectedId(cond.uid_conductor);
        } else {
            console.error('cond o uid_conductor es undefined');
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (selectedId !== null) {
                if (file) {
                    const formData = new FormData();
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

                    await updateCond(selectedId, formData);
                } else {
                    await updateCond(selectedId, data);
                }

                setMensaje('Conductor editado exitosamente');
            }
        } catch (error) {
            console.error("Error al editar el Conductor:", error);
            setMensaje('Error al editar el Conductor');
        } finally {
            setTimeout(() => {
                setMensaje('');
            }, 3000);
        }
    });

    const handleLimpiarClick = () => {
        reset();
        setMensaje('');
    };

    const handleImagenChange = (e) => {
        setFile(e.target.files[0])
    }

    useEffect(() => {
        const cargarVehiculos = async () => {
            if (cond.tipo_licencia === 'A2') {
                const selectedTipVeh = 'A2';
                setClase(selectedTipVeh);

                if (selectedTipVeh) {
                    try {
                        const vehiculosData = await getVeh(selectedTipVeh);
                        const formattedVehiculos = vehiculosData.map((vehiculoData) => ({
                            label: vehiculoData.placa,
                            value: vehiculoData.uid_vehiculo,
                        }));
                        setVehiculo(formattedVehiculos);
                    } catch (error) {
                        console.error('Error al obtener vehiculos:', error);
                    }
                }
            }

            if (cond.tipo_licencia === 'B1') {
                const selectedTipVeh = 'B1';
                setClase(selectedTipVeh);

                if (selectedTipVeh) {
                    try {
                        const vehiculosData = await getVeh(selectedTipVeh);
                        const formattedVehiculos = vehiculosData.map((vehiculoData) => ({
                            label: vehiculoData.placa,
                            value: vehiculoData.uid_vehiculo,
                        }));
                        setVehiculo(formattedVehiculos);
                    } catch (error) {
                        console.error('Error al obtener vehiculos:', error);
                    }
                }
            }
        };

        cargarVehiculos();
    }, [cond.tipo_licencia]);


    const handleTipoVehChange = async (e) => {

        const selectedTipVeh = e.target.value;
        setClase(selectedTipVeh);

        if (selectedTipVeh) {
            try {
                const vehiculosData = await getVeh(selectedTipVeh);
                const formattedVehiculos = vehiculosData.map((vehiculoData) => ({
                    label: vehiculoData.placa,
                    value: vehiculoData.uid_vehiculo,
                }));
                setVehiculo(formattedVehiculos);
            } catch (error) {
                console.error('Error al obtener vehiculos:', error);
            }
        }
    }

    const handleVehiculoChange = (e) => {
        setVehiculoSel(e.target.value);
    };

    return (
        <div className="card">
            <div className='title'>
                <img className='imagen_p1' src={cond.photo_perfil} alt="Imagen" />
                <div>
                    <h1>Nombre: {cond.first_name} {cond.first_last_name}</h1>
                    <p>Tipo: {cond.tipo_licencia}</p>
                    <p>N° Licencia: {cond.cedula}</p>
                    <p>Telefono: {cond.phone_number}</p><br />
                    <div className='botones'>
                        <div className='buttons'>
                            <button onClick={handleOpenModal}>Editar</button>&nbsp;
                            {modalOpen && (
                                <div className="modal" onClick={handleCloseModal}>
                                    <div className="conductor-form" onClick={(e) => e.stopPropagation()}>
                                        <form onSubmit={onSubmit} className='conductor22'>
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
                                                        <select {...register('tipo_licencia', { required: true })} onChange={handleTipoVehChange} type="text" className='formulario-tipo' value={clase} >
                                                            <option value="">Selecciona un tipo</option>
                                                            {opciones.map((clase, i) => (
                                                                <option key={clase.value} value={clase.value}>
                                                                    {clase.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="vehiculo">Placa Vehiculo</label>&nbsp;&nbsp;
                                                        <select {...register('uid_vehiculo', { required: true })} className='formulario-tipo' onChange={handleVehiculoChange} value={vehiculo ? vehiculo.value : ''}>
                                                            <option value="">Seleccione la placa</option>
                                                            {vehiculo && vehiculo.map((vehiculoItem, index) => (
                                                                <option key={vehiculoItem.value} value={vehiculoItem.value}>
                                                                    {vehiculoItem.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="form-group-image">
                                                    <label htmlFor="imagen">Imagen de Perfil</label>
                                                        <input id='inputFile' type="file" onChange={handleImagenChange} className='formulario1' />
                                                        <input type="text" value={nombreArchivo} hidden className='formulario' {...register("photo_perfil")} />
                                                    </div>

                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <button type='submit'>Editar</button>
                                                <button type='button' onClick={handleLimpiarClick}>Limpiar</button>
                                            </div>

                                            {mensaje && <div className="mensaje">{mensaje}</div>}
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className='buttons1'><button onDoubleClick={() => {
                            deleteCond(cond.uid_conductor);
                        }}>Eliminar</button></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CondCard;
