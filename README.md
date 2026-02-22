# 🛍️ Nordika Wear - Frontend

![Project Status](https://img.shields.io/badge/status-development-orange)
![Astro](https://img.shields.io/badge/Astro-v5.0-ff5d01)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

Frontend moderno y de alto rendimiento para la plataforma de comercio electrónico **Nordika Wear**. Construido con una arquitectura **Headless**, enfocado en la velocidad de carga y una experiencia de usuario interactiva para la personalización de productos.

## 🚀 Características Principales

* **Arquitectura Híbrida:** Renderizado estático (SSG) para catálogo y páginas informativas, con islas dinámicas de hidratación parcial para interactividad.
* **Módulo de Personalización:** Herramienta visual "Drag & Drop" que permite a los usuarios subir imágenes, redimensionarlas y posicionarlas sobre productos base (playeras, tazas).
* **Carrito Persistente:** Gestión de estado global con **Nano Stores**, manteniendo el carrito guardado en el navegador (`localStorage`).
* **Diseño Responsivo:** Interfaz adaptada a móviles y escritorio utilizando **Tailwind CSS**.
* **Comunicación API:** Integración con backend en Django REST Framework.

## 🛠️ Tech Stack

* **Framework:** [Astro v5](https://astro.build/)
* **Librería UI:** [React](https://react.dev/) (para componentes interactivos)
* **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
* **Estado Global:** [Nano Stores](https://github.com/nanostores/nanostores) (`@nanostores/react`, `@nanostores/persistent`)
* **Utilidades:**
    * `react-draggable`: Para la manipulación de diseños en el personalizador.
    * `lucide-react`: Iconografía ligera.

## 📦 Prerrequisitos

Asegúrate de tener instalado lo siguiente:

* [Node.js](https://nodejs.org/) (v18.14.1 o superior)
* npm (o pnpm/yarn)

## 🔧 Instalación y Configuración

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/tu-usuario/nordika-frontend.git](https://github.com/tu-usuario/nordika-frontend.git)
    cd nordika-frontend
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto y agrega la URL de tu API (Backend Django):

    ```env
    PUBLIC_API_URL=[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)
    ```

4.  **Ejecutar servidor de desarrollo:**
    ```bash
    npm run dev
    ```

5.  **Abrir en el navegador:**
    Visita `http://localhost:4321` para ver la aplicación.

## 📂 Estructura del Proyecto

```text
src/
├── components/       # Componentes reutilizables (React & Astro)
├── layouts/          # Plantillas principales (Layout.astro)
├── pages/            # Rutas de la aplicación (File-based routing)
│   ├── index.astro   # Home
│   ├── catalogo.astro
│   └── producto/[slug].astro
├── store/            # Estado global (cartStore.js)
└── styles/           # Estilos globales y Tailwind

```

## 🔗 Integración Backend

Este frontend consume datos de una API REST construida con **Django** y **Django REST Framework**.

* Repositorio del Backend: https://github.com/daviduwu-png/Nordika-backend
