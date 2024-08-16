import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../../assets/css/ActCard.css';
import { useActs } from '../../context/actContext';

const opciones = [
    { label: 'Estadia', value: 'cdca80ef-6f8d-478b-94f1-80e1e67da46d' },
    { label: 'Alimentacion', value: '35a0e8e0-728c-4712-81fd-1df805a0e294' },
    { label: 'Actividad', value: '859a6b07-ecd9-4c13-bc1c-6894d8fb0520' },
];

function ActCard({ act }) {

    const [modalOpen, setModalOpen] = useState(false);
    const { deleteAct, getAct, updateAct } = useActs()
    const [selectedId, setSelectedId] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();
    const [tip, setTip] = useState('');
    const [file, setFile] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (selectedId !== null) {
            async function loadAct() {
                const act = await getAct(selectedId);
                if (act) { 
                    setValue('nombre', act.nombre);
                    setValue('direccion', act.direccion);
                    setValue('descripcion', act.descripcion);
                    setValue('tipo', act.tipo);
                    setValue('photo', act.photo);
                    setValue('coordenadasX', act.coordenadasX);
                    setValue('coordenadasY', act.coordenadasY);
                    setValue('hr_inicio', act.hr_inicio);
                    setValue('hr_fin', act.hr_fin);
                } else {
                    console.error('No se encontró la actividad.');
                }
            }
            loadAct();
        }
    }, [selectedId]);

    const handleOpenModal = () => {
        if (act && act.uid_actividades) {
            setSelectedId(act.uid_actividades);
        } else {
            console.error('act o uid_actividades es undefined');
        }
        setModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleImagenChange = (e) => {
        setFile(e.target.files[0])
    }

    const onSubmit = handleSubmit(async (data) => {
        try {
            if (selectedId !== null) {
                if (file) {
                    const formData = new FormData();
                    formData.append('nombre', data.nombre);
                    formData.append('descripcion', data.descripcion);
                    formData.append('tipo', data.tipo);
                    formData.append('coordenadasX', data.coordenadasX);
                    formData.append('coordenadasY', data.coordenadasY);
                    formData.append('hr_inicio', data.hr_inicio);
                    formData.append('hr_fin', data.hr_fin);
                    formData.append('photo', file);

                    await updateAct(selectedId, formData);
                } else {
                    await updateAct(selectedId, data);
                }

                setMensaje('Actividad editada exitosamente');
            }
        } catch (error) {
            console.error("Error al editar la actividad:", error);
            setMensaje('Error al editar la actividad');
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

    const handleTipoChange = (e) => {
        setTip(e.target.value);
    };

    return (
        <div className="card">
            <div className='title'>
                <img className='imagen_p1' src={act.photo} alt="Photo" />
                <div>
                    <h1>Nombre: {act.nombre}</h1>
                    <p>Tipo: {opciones.find(option => option.value === act.tipo)?.label}</p><br />
                    <div className='buttons'>
                        <button onClick={handleOpenModal}>Editar</button>&nbsp;
                        {modalOpen && (
                            <div className="modal" onClick={handleCloseModal}>
                                <div className="actividad-form" onClick={(e) => e.stopPropagation()}>
                                    <form onSubmit={onSubmit} className='actividad'>

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
                                            <input type="time" className='formulario' {...register("hr_inicio", { required: true })} />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="direccion">Hora Final</label>
                                            <input type="time" className='formulario' {...register("hr_fin", { required: true })} />
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
                                            <input type="file" onChange={handleImagenChange} className='formulario1' />
                                            <input type="text" value={nombreArchivo} hidden className='formulario' {...register("photo")} />
                                        </div>

                                        <div className="form-group">
                                            <button type='submit' onClick={handleSubmit}>Editar</button>
                                            <button type='button' onClick={handleLimpiarClick}>Limpiar</button>
                                        </div>

                                        {mensaje && <div className="mensaje">{mensaje}</div>}
                                    </form>
                                </div>
                            </div>
                        )}

                        <button onDoubleClick={() => {
                            deleteAct(act.uid_actividades);
                        }}>Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ActCard;
