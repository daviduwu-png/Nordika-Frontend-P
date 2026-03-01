export default function ShippingAddress({
    nombre, setNombre,
    apellidos, setApellidos,
    calle, setCalle,
    colonia, setColonia,
    cp, setCp,
    ciudad, setCiudad,
    estado, setEstado,
    savedAddresses = [],
    selectedAddressId = "new",
    handleSelectAddress = () => { },
    loadingAddresses = false,
}) {
    const inputClass =
        "border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition w-full disabled:bg-gray-100 disabled:text-gray-500";

    const isAddressSelected = selectedAddressId !== "new";

    return (
        <section>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        2
                    </span>
                    Dirección de Envío
                </div>
            </h2>

            {/* ── Selector de direcciones guardadas ──────────────────────────────── */}
            {!loadingAddresses && savedAddresses && savedAddresses.length > 0 && (
                <div className="mb-5">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                        Selecciona una dirección guardada
                    </label>
                    <select
                        value={selectedAddressId}
                        onChange={(e) => handleSelectAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition appearance-none bg-white cursor-pointer"
                    >
                        {savedAddresses.map((addr) => (
                            <option key={addr.id} value={addr.id.toString()}>
                                {addr.alias ? `📍 ${addr.alias} - ` : ""}
                                {addr.street} {addr.exterior_number}, {addr.city} {addr.postal_code}
                            </option>
                        ))}
                        <option value="new">➕ Usar otra dirección distinta</option>
                    </select>
                </div>
            )}

            {/* ── Formulario de dirección ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    id="checkout-nombre"
                    type="text"
                    placeholder="Nombre *"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    disabled={isAddressSelected}
                    className={inputClass}
                />
                <input
                    id="checkout-apellidos"
                    type="text"
                    placeholder="Apellidos *"
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    disabled={isAddressSelected}
                    className={inputClass}
                />
                <input
                    id="checkout-calle"
                    type="text"
                    placeholder="Calle y número *"
                    value={calle}
                    onChange={(e) => setCalle(e.target.value)}
                    disabled={isAddressSelected}
                    className={`${inputClass} md:col-span-2`}
                />
                <input
                    id="checkout-colonia"
                    type="text"
                    placeholder="Colonia *"
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                    disabled={isAddressSelected}
                    className={inputClass}
                />
                <input
                    id="checkout-cp"
                    type="text"
                    placeholder="Código Postal *"
                    value={cp}
                    onChange={(e) => setCp(e.target.value)}
                    disabled={isAddressSelected}
                    className={inputClass}
                />
                <input
                    id="checkout-ciudad"
                    type="text"
                    placeholder="Ciudad *"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    disabled={isAddressSelected}
                    className={inputClass}
                />
                <input
                    id="checkout-estado"
                    type="text"
                    placeholder="Estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    disabled={isAddressSelected}
                    className={inputClass}
                />
            </div>
        </section>
    );
}
