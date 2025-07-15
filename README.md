# 🛒 BackEnd - Simulación de Base de Datos para eCommerce

Este proyecto representa el **Back-End** de una aplicación tipo eCommerce, diseñado como práctica profesional para simular la gestión de datos de una tienda online. Se construyó una **API RESTful** utilizando tecnologías modernas como **Node.js**, **Express**, y una base de datos **no relacional** con **MongoDB** alojada en **MongoDB Atlas**.

Todas las operaciones fueron testeadas con **Postman**, permitiendo validar el correcto funcionamiento de los endpoints.

---

## 🚀 Tecnologías Utilizadas

- 🟢 Node.js
- ⚙️ Express.js
- 🍃 MongoDB (NoSQL)
- ☁️ MongoDB Atlas (base de datos en la nube)
- 📬 Postman (test de endpoints)
- ✏️ JavaScript

---

## 📁 Estructura del Proyecto

```
📦 backend/
 ┣ 📂models/          -> Esquemas de MongoDB (productos, usuarios, etc.)
 ┣ 📂routes/          -> Definición de rutas de la API
 ┣ 📂controllers/     -> Lógica y controladores para cada recurso
 ┣ 📄.env             -> Variables de entorno (conexión a MongoDB Atlas)
 ┣ 📄app.js           -> Configuración principal del servidor Express
 ┗ 📄package.json     -> Dependencias y scripts
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
PORT = 8080
DB_URI = "mongodb+srv:<usuario>@cluster0.wr7tz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
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

> Los endpoints pueden variar según la implementación final. Se recomienda revisar el archivo `routes/` para ver todas las rutas disponibles.

---

## 🧠 Aprendizajes Destacados

- Implementación de una arquitectura MVC simple en un servidor Express.
- Manejo de una base de datos no relacional (MongoDB) alojada en la nube.
- Testeo de endpoints con Postman.
- Organización modular del código con controladores, rutas y modelos.

---

## 📌 Autor

**Ignacio Rojos**  
🔗 [GitHub](https://github.com/IgnacioRojos)

---

## 📄 Licencia

Este proyecto se desarrolló con fines educativos y de práctica profesional. No está destinado a producción.
