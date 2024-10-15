import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../../assets/css/CondCard.css';
import { useVehiculo } from '../../context/vehiculoContext.jsx';

function VehCard({ veh, style }) {
    const [modalOpen, setModalOpen] = useState(false);
    const { deleteVehiculo, getVehiculo } = useVehiculo();

    const [selectedId, setSelectedId] = useState(null);
    const {setValue, register } = useForm();

    useEffect(() => {
        if (selectedId !== null) {
            async function loadVeh() {
                const vehData = await getVehiculo(selectedId);
                setValue('placa', vehData.placa);
                setValue('marca', vehData.marca);
                setValue('linea', vehData.linea);
                setValue('modelo', vehData.modelo);
                setValue('clase', vehData.clase);
                setValue('cilindra', vehData.cilindra);
                setValue('color', vehData.color);
                setValue('carroceria', vehData.carroceria);
                setValue('combustible', vehData.combustible);
                setValue('tipo_licencia', vehData.tipo_vehiculo);
            }
            loadVeh();
        }
    }, [selectedId]);

    const handleOpenModal = () => {
        if (veh && veh.uid_vehiculo) {
            setSelectedId(veh.uid_vehiculo);
        } else {
            console.error('veh o veh.uid_vehiculo es undefined');
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    return (
        <div className="card" style={style}>
            <div className='title'>
                <img className='imagen_p1' src={veh.photo_perfil} alt="Imagen" />
                <div>
                    <h1>Marca: {veh.marca} </h1>
                    <p>Color: {veh.color}</p>
                    <p>Modelo: {veh.modelo} </p>
                    <p>Placa: {veh.placa}</p>
                    <div className='botones'>
                        <div className='buttons'>
                            <button onClick={handleOpenModal}>Ver</button>&nbsp;
                            {modalOpen && (
                                <div className="modal" onClick={handleCloseModal}>
                                    <div className="conductor-form" onClick={(e) => e.stopPropagation()}>
                                        <form className='conductor22'>
                                            <div className="form-columns">
                                                <div className="col1">
                                                    <div className="form-group">
                                                        <label htmlFor="placa">Placa</label>
                                                        <input type="text" className='formulario' readOnly {...register("placa")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="marca">Marca</label>
                                                        <input type="text" className='formulario' readOnly {...register("marca")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="linea">Linea</label>
                                                        <input type="text" className='formulario' readOnly {...register("linea")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="modelo">Modelo</label>
                                                        <input type="text" className='formulario' readOnly  {...register("modelo")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="clase">Clase</label>
                                                        <input type="text" className='formulario' readOnly  {...register("clase")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="tipoLicencia">Tipo Licencia</label>
                                                        <input type="text" className='formulario' readOnly  {...register('tipo_licencia')}/>
                                                    </div>
                                                </div>
                                                <div className="col2">
                                                    <div className="form-group">
                                                        <label htmlFor="cilindra">Cilindraje</label>
                                                        <input type="text" className='formulario' readOnly {...register("cilindra")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="color">Color</label>
                                                        <input type="text" className='formulario' readOnly {...register("color")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="carroceria">Carroceria</label>
                                                        <input type="text" className='formulario' readOnly {...register("carroceria")} />
                                                    </div>

                                                    <div className="form-group">
                                                        <label htmlFor="combustible">Combustible</label>
                                                        <input type="text" className='formulario' readOnly {...register("combustible")}/>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className='buttons1'>
                            <button onDoubleClick={() => {
                                if (window.confirm('¿Estás seguro de que deseas eliminar este vehiculo?')) {
                                    deleteVehiculo(veh.uid_vehiculo);
                                }
                            }}>
                                Eliminar
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehCard;
