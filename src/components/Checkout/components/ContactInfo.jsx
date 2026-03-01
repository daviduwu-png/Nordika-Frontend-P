export default function ContactInfo({ email, setEmail, telefono, setTelefono }) {
    return (
        <section>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    1
                </span>
                Información de Contacto
            </h2>

            <div className="space-y-4">
                <input
                    id="checkout-email"
                    type="email"
                    placeholder="Correo electrónico *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                />
                <input
                    id="checkout-telefono"
                    type="tel"
                    placeholder="Teléfono de contacto"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition"
                />
            </div>
        </section>
    );
}
