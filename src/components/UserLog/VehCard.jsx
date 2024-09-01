import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../../assets/css/CondCard.css';
import { useVehiculo } from '../../context/vehiculoContext.jsx';

function VehCard({ veh }) {

    const [setModalOpen] = useState(false);
    const { deleteVehiculo, getVehiculo } = useVehiculo();

    const [selectedId, setSelectedId] = useState(null);
    const { reset, setValue } = useForm();
    const [setMensaje] = useState('');

    useEffect(() => {
        if (selectedId !== null) {
            async function loadVeh() {
                const veh = await getVehiculo(selectedId);
                setValue('placa', veh.placa);
                setValue('marca', veh.marca);
                setValue('linea', veh.linea);
                setValue('modelo', veh.modelo);
                setValue('clase', veh.clase);
                setValue('cilindra', veh.cilindra);
                setValue('color', veh.color);
                setValue('carroceria', veh.carroceria);
                setValue('combustible', veh.combustible);
                setValue('photo_perfil', veh.photo_perfil);
            }
            loadVeh();
        }
    }, [selectedId]);


    const handleOpenModal = () => {
        setSelectedId(veh.id);
        setModalOpen(true);

    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleLimpiarClick = () => {
        reset();
        setMensaje('');
    };


    return (
        <div className="card">
            <div className='title'>
                <img className='imagen_p1' src={veh.photo_perfil} alt="Imagen" />
                <div>
                    <h1>Marca: {veh.marca} </h1>
                    <p>Color {veh.color}</p>
                    <p>Modelo: {veh.modelo} </p>
                    <p>Placa: {veh.placa}</p>

                    <div className='buttons1'>
                        <button onDoubleClick={() => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar este vehiculo?')) {
                                deleteVehiculo(veh.id);
                            }
                        }}>Eliminar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VehCard;
