# 🛒 BackEnd - API de eCommerce con Mercado Pago

Este proyecto es el **Back-End** de [ecommerce](https://github.com/IgnacioRojos/ecommerce), una aplicación full stack de eCommerce en producción. Es una **API RESTful** construida con **Node.js**, **Express** y **MongoDB** (MongoDB Atlas), con integración de **Mercado Pago** para procesar pagos reales mediante la creación de preferencias de compra.

Todas las operaciones fueron testeadas con **Postman**, permitiendo validar el correcto funcionamiento de los endpoints.

---

## 🌐 Despliegue

El backend está desplegado en **Render** y sirve en producción al frontend del proyecto:

```
🔗 API: https://backend-pt73.onrender.com
🔗 Frontend: https://eccomercefullstack.netlify.app/
```

---

## 🚀 Tecnologías Utilizadas

- 🟢 Node.js
- ⚙️ Express.js
- 🍃 MongoDB (NoSQL)
- ☁️ MongoDB Atlas (base de datos en la nube)
- 💳 Mercado Pago (procesamiento de pagos)
- 📬 Postman (test de endpoints)
- ✏️ JavaScript

---

## 📁 Estructura del Proyecto

```
📦 BackEnd/
 ┣ 📂src/
 ┃ ┣ 📂controllers/    -> Lógica y controladores para cada recurso
 ┃ ┣ 📂managers/       -> Managers de acceso a datos
 ┃ ┣ 📂models/         -> Esquemas de MongoDB (productos, carritos, etc.)
 ┃ ┣ 📂routes/         -> Definición de rutas de la API (incluye Mercado Pago)
 ┃ ┣ 📂script/         -> Scripts auxiliares
 ┃ ┣ 📂views/          -> Vistas del servidor
 ┃ ┗ 📄app.js          -> Configuración principal del servidor Express
 ┣ 📄.env              -> Variables de entorno (MongoDB, credenciales de Mercado Pago)
 ┗ 📄package.json      -> Dependencias y scripts
```

---

## ⚙️ Instalación y Uso

1. **Cloná el repositorio**

```bash
git clone https://github.com/IgnacioRojos/BackEnd.git
cd BackEnd
```

2. **Instalá las dependencias**

```bash
npm install
```

3. **Configurá el archivo `.env`**

```env
PORT=8080
DB_URI="mongodb+srv:<usuario>@cluster0.wr7tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MP_ACCESS_TOKEN=<tu_access_token_de_Mercado_Pago>
```

4. **Iniciá el servidor**

```bash
npm start
```

> El servidor estará corriendo en `http://localhost:8080/`

---

## 📬 Endpoints de Ejemplo

| Método | Ruta               | Descripción                        |
|--------|--------------------|------------------------------------|
| GET    | /api/productos     | Obtener todos los productos        |
| GET    | /api/productos/:id | Obtener un producto por ID         |
| POST   | /api/productos     | Crear un nuevo producto            |
| PUT    | /api/productos/:id | Actualizar un producto existente   |
| DELETE | /api/productos/:id | Eliminar un producto               |
| POST   | /api/pagos/create_preference | Crear una preferencia de pago en Mercado Pago |

> Se recomienda revisar el archivo `src/routes/` para ver todas las rutas disponibles.

---

## 🧠 Aprendizajes Destacados

- Implementación de una arquitectura MVC en un servidor Express.
- Manejo de una base de datos no relacional (MongoDB) alojada en la nube.
- Integración de una pasarela de pagos real (Mercado Pago) del lado del servidor.
- Manejo seguro de credenciales mediante variables de entorno.
- Testeo de endpoints con Postman.

---

## 📌 Autor

**Ignacio Rojos**  
🔗 [GitHub](https://github.com/IgnacioRojos)

---

## 📄 Licencia

Distribuido bajo licencia MIT — libre para uso y modificación con fines educativos o comerciales, dando crédito al autor original.
