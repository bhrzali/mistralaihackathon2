# Configuración de la API

## Variables de Entorno

Crea un archivo `.env.local` en la carpeta `front/` con las siguientes variables:

```bash
# URL base de la API (por defecto usa el backend alemán)
VITE_API_BASE_URL=https://mistralaibackend-a0bzf8faakamd4gb.germanywestcentral-01.azurewebsites.net

# Ruta para enviar resultados (opcional)
VITE_RESULTS_PATH=/results

# Modo estático (opcional, por defecto carga desde API)
VITE_USE_STATIC=1
```

## Modos de Uso

### 1. Modo API (Recomendado)
```bash
# Sin variables de entorno - usa la API por defecto
npm run dev:front
```

### 2. Modo Estático
```bash
# Con VITE_USE_STATIC=1 - carga desde quiz.json
VITE_USE_STATIC=1 npm run dev:front
```

### 3. Modo Híbrido
```bash
# API para cargar quizzes, estático para resultados
VITE_API_BASE_URL=https://tu-api.com npm run dev:front
```

## URLs de Ejemplo

- **Quiz por ID**: `http://localhost:5173/ishowspeed-template/quiz?quizId=1`
- **Quiz por tema**: `http://localhost:5173/ishowspeed-template/quiz?topic=Das%20Perfekt`
- **Quiz desde URL**: `http://localhost:5173/ishowspeed-template/quiz?quizUrl=https://api.ejemplo.com/quiz.json`
- **Quiz estático**: `http://localhost:5173/ishowspeed-template/quiz` (con VITE_USE_STATIC=1)

## Endpoints de la API

- `GET /quizzes` - Obtener todos los quizzes
- `GET /quizzes/{id}` - Obtener quiz por ID
- `GET /quizzes/topic/{topic}` - Obtener quizzes por tema
- `POST /quizzes/parse` - Crear quiz desde texto
- `DELETE /quizzes/{id}` - Eliminar quiz
