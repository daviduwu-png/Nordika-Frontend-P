import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import axios from 'axios';

interface AddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (addressData: any) => Promise<void>;
    initialData?: any;
}

export default function AddressModal({ isOpen, onClose, onSave, initialData }: AddressModalProps) {
    const [formData, setFormData] = useState({
        alias: '',
        street: '',
        exterior_number: '',
        interior_number: '',
        neighborhood: '',
        reference: '',
        phone: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'México',
        is_default: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Sepomex state
    const [searchingZip, setSearchingZip] = useState(false);
    const [coloniasDescubiertas, setColoniasDescubiertas] = useState<string[]>([]);
    const [zipError, setZipError] = useState('');

    // Lista de estados de México (por si falla el código postal)
    const ESTADOS_MEXICO = [
        "Aguascalientes", "Baja California", "Baja California Sur", "Campeche", "Chiapas",
        "Chihuahua", "Ciudad de México", "Coahuila", "Colima", "Durango", "Estado de México",
        "Guanajuato", "Guerrero", "Hidalgo", "Jalisco", "Michoacán", "Morelos", "Nayarit",
        "Nuevo León", "Oaxaca", "Puebla", "Querétaro", "Quintana Roo", "San Luis Potosí",
        "Sinaloa", "Sonora", "Tabasco", "Tamaulipas", "Tlaxcala", "Veracruz", "Yucatán", "Zacatecas"
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                alias: initialData.alias || '',
                street: initialData.street || '',
                exterior_number: initialData.exterior_number || '',
                interior_number: initialData.interior_number || '',
                neighborhood: initialData.neighborhood || '',
                reference: initialData.reference || '',
                phone: initialData.phone || '',
                city: initialData.city || '',
                state: initialData.state || '',
                postal_code: initialData.postal_code || '',
                country: initialData.country || 'México',
                is_default: initialData.is_default || false
            });
        } else {
            setFormData({
                alias: '',
                street: '',
                exterior_number: '',
                interior_number: '',
                neighborhood: '',
                reference: '',
                phone: '',
                city: '',
                state: '',
                postal_code: '',
                country: 'México',
                is_default: false
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;


        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    useEffect(() => {
        if (formData.postal_code.length === 5) {
            buscarCodigoPostal(formData.postal_code);
        } else {
            setColoniasDescubiertas([]);
            setZipError('');
        }
    }, [formData.postal_code]);

    const buscarCodigoPostal = async (cp: string) => {
        setSearchingZip(true);
        setZipError('');
        try {
            // Utilizando API pública de Sepomex (puede fallar si está caída, por eso el try-catch)
            const response = await axios.get(`https://api.zippopotam.us/mx/${cp}`);

            if (response.data && response.data.places) {
                const places = response.data.places;

                // Extraer el estado y ciudad/municipio
                const estado = places[0].state;
                // A veces 'place name' es la colonia o el municipio, depende de zippopotam. Zippopotam para MX devuelve colonias en 'place name'
                const colonias = places.map((p: any) => p['place name']);

                // Extraer municipio

                setColoniasDescubiertas(colonias);

                // Autocompletar estado
                setFormData(prev => ({
                    ...prev,
                    state: estado,
                    city: prev.city || '',
                    neighborhood: colonias.includes(prev.neighborhood) ? prev.neighborhood : colonias[0] || ''
                }));
            }
        } catch (error) {
            setZipError('No se encontró el C.P. Ingresa tus datos manualmente.');
            setColoniasDescubiertas([]);
        } finally {
            setSearchingZip(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            setError('Error al guardar la dirección. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 transition-all">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh]">
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className="font-bold text-lg text-gray-900">
                        {initialData ? 'Editar Dirección' : 'Añadir Nueva Dirección'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 overflow-y-auto flex-1 flex flex-col gap-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre (Alias) *</label>
                        <input
                            required
                            type="text"
                            name="alias"
                            placeholder="Ej: Mi Casa, Trabajo"
                            value={formData.alias}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>


                    <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100 mb-4">
                        <p className="text-sm text-indigo-800 font-medium mb-3 flex items-center gap-2">
                            <Search size={16} /> Captura tu Código Postal para autocompletar
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
                                <div className="relative flex items-center">
                                    <input
                                        required
                                        type="text"
                                        name="postal_code"
                                        maxLength={5}
                                        placeholder="Ej: 74200"
                                        value={formData.postal_code}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            e.target.value = val;
                                            handleChange(e);
                                        }}
                                        className="w-full border border-indigo-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                    />
                                    {searchingZip && (
                                        <div className="absolute right-3 animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                                    )}
                                </div>
                                {zipError && <p className="text-[11px] leading-tight text-red-500 mt-1">{zipError}</p>}
                                {coloniasDescubiertas.length > 0 && !zipError && (
                                    <p className="text-[11px] leading-tight text-green-600 mt-1">¡C.P. encontrado!</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">País *</label>
                                <input
                                    required
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-600"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                            <select
                                required
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                            >
                                <option value="" disabled>Selecciona un estado</option>
                                {ESTADOS_MEXICO.map((estado, idx) => (
                                    <option key={idx} value={estado}>{estado}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad/Municipio *</label>
                            <input
                                required
                                type="text"
                                name="city"
                                placeholder="Ej: Atlixco"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colonia *</label>
                            {coloniasDescubiertas.length > 0 ? (
                                <select
                                    required
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                >
                                    <option value="" disabled>Selecciona una colonia</option>
                                    {coloniasDescubiertas.map((col, idx) => (
                                        <option key={idx} value={col}>{col}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    required
                                    type="text"
                                    name="neighborhood"
                                    placeholder="Ej: Centro"
                                    value={formData.neighborhood}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto *</label>
                            <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 bg-white shadow-sm">
                                <span className="bg-gray-50 border-r border-gray-300 px-3 py-2 text-sm text-gray-500 flex items-center font-medium">
                                    +52
                                </span>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    maxLength={10}
                                    placeholder="Ej: 5512345678"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        e.target.value = val;
                                        handleChange(e);
                                    }}
                                    className="w-full px-3 py-2 text-sm focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calle *</label>
                            <input
                                required
                                type="text"
                                name="street"
                                placeholder="Ej: Av. Reforma"
                                value={formData.street}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nº Ext *</label>
                                <input
                                    required
                                    type="text"
                                    name="exterior_number"
                                    placeholder="Ej: 123"
                                    value={formData.exterior_number}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nº Int</label>
                                <input
                                    type="text"
                                    name="interior_number"
                                    placeholder="Ej: B"
                                    value={formData.interior_number}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Referencias de entrega</label>
                        <input
                            type="text"
                            name="reference"
                            placeholder="Ej: Casa blanca con zaguán negro"
                            value={formData.reference}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>



                    <div className="pt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="is_default"
                                checked={formData.is_default}
                                onChange={handleChange}
                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                            />
                            <span className="text-sm font-medium text-gray-700 cursor-pointer">Convertir en dirección principal</span>
                        </label>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
