# Aplicación de Quiz - Integrada con API Alemana

Esta aplicación de quiz está construida dentro del boilerplate existente y está **completamente integrada con tu API real** del backend alemán.

## Características

- ✅ **Integración completa con API real**: `https://mistralaibackend-a0bzf8faakamd4gb.germanywestcentral-01.azurewebsites.net`
- ✅ **Múltiples modos de carga**: API, estático, por ID, por tema, por URL
- ✅ **Lista de quizzes disponibles**: Interfaz para ver todos los quizzes de la API
- ✅ **Soporte para datos de quiz desde props/state**
- ✅ **Modo estático con carga desde `./quiz.json`** (fallback)
- ✅ **Transformación de datos de API a formato UI simplificado**
- ✅ **Interfaz de usuario moderna con Tailwind CSS**
- ✅ **Cálculo automático de resultados**
- ✅ **Envío de resultados a API** (configurable)
- ✅ **Datos reales**: Quiz alemán "Das Perfekt" con 20 preguntas

## Estructura de Archivos

```
front/src/
├── types/
│   └── quiz.ts              # Tipos TypeScript (coinciden con API real)
├── api/
│   └── quizApi.ts           # Cliente API para backend alemán
├── utils/
│   └── quizTransformer.ts   # Función de transformación
├── components/
│   ├── QuizPage.tsx         # Componente principal del quiz
│   └── QuizList.tsx         # Lista de quizzes disponibles
└── public/
    └── quiz.json            # Quiz alemán "Das Perfekt" (fallback)
```

## Uso

### 1. **Modo API (Recomendado)** 🚀

La aplicación se conecta automáticamente a tu API alemana:

```bash
npm run dev:front
```

**URLs disponibles:**
- **Lista de quizzes**: `http://localhost:5173/ishowspeed-template/quizzes`
- **Quiz por ID**: `http://localhost:5173/ishowspeed-template/quiz?quizId=1`
- **Quiz por tema**: `http://localhost:5173/ishowspeed-template/quiz?topic=Das%20Perfekt`

### 2. Modo Prop/State

```tsx
import QuizPage from '@/components/QuizPage';
import { QuizResponse } from '@/types/quiz';

const quizData: QuizResponse = {
  // ... datos del quiz
};

function App() {
  return <QuizPage quiz={quizData} />;
}
```

### 3. Modo Estático (Fallback)

```bash
VITE_USE_STATIC=1 npm run dev:front
```

Carga el quiz alemán desde `./quiz.json`.

### 4. Modo URL Externa

```
http://localhost:5173/quiz?quizUrl=https://api.ejemplo.com/quiz/123
```

## Variables de Entorno

```bash
# URL base de la API (por defecto usa tu backend alemán)
VITE_API_BASE_URL=https://mistralaibackend-a0bzf8faakamd4gb.germanywestcentral-01.azurewebsites.net

# Ruta para enviar resultados (opcional)
VITE_RESULTS_PATH=/results

# Modo estático (opcional, por defecto usa API)
VITE_USE_STATIC=1
```

## Scripts

```bash
# Desarrollo
npm run dev:front

# Construcción
npm run build:front
```

## Formato de Datos

### QuizResponse (API)
```typescript
type QuizResponse = {
  id: number;
  title: string;
  topic: string;
  explanation: string | null;
  number_of_questions: number;
  generated_at: string;
  questions: QuestionResponse[];
};
```

### UiQuiz (UI)
```typescript
type UiQuiz = {
  id: string;
  title: string;
  description?: string | null;
  topic?: string | null;
  generatedAt?: string | null;
  total: number;
  questions: Array<{
    id: string;
    number: number;
    prompt: string;
    translation?: string | null;
    choices: Array<{ id: string; label: string }>;
    answer: string;
    explanation?: string;
  }>;
};
```

## Funcionalidades

### Ingestion de Datos
- **Prop/State**: Pasa datos directamente como prop
- **Estático**: Carga desde `./quiz.json` cuando `VITE_USE_STATIC=1`
- **URL**: Carga desde URL con parámetro `?quizUrl=`

### UI
- Header con título, tema, fecha y descripción
- Preguntas con opciones de radio
- Traducciones opcionales
- Validación de respuestas completas

### Resultados
- Cálculo automático de puntuación
- Detalles por pregunta
- Explicaciones para respuestas incorrectas
- Botón de reintentar

### Envío de Resultados
- Envío automático a API si están configuradas las variables de entorno
- Logging en consola para modo estático
- Formato `ResultSubmission` estándar

## Ejemplo de Uso

### **Opción 1: Usar API Real (Recomendado)**

1. **Ejecutar en desarrollo**:
   ```bash
   npm run dev:front
   ```

2. **Navegar a la lista de quizzes**:
   ```
   http://localhost:5173/ishowspeed-template/quizzes
   ```

3. **Seleccionar un quiz** y comenzar a responder

### **Opción 2: Quiz Estático (Fallback)**

1. **Configurar modo estático**:
   ```bash
   echo "VITE_USE_STATIC=1" > .env.local
   ```

2. **Ejecutar en desarrollo**:
   ```bash
   npm run dev:front
   ```

3. **Navegar a**:
   ```
   http://localhost:5173/ishowspeed-template/quiz
   ```

La aplicación cargará el quiz alemán "Das Perfekt" desde `public/quiz.json`.

## Criterios de Aceptación ✅

- ✅ **Integración con API real**: Se conecta a `https://mistralaibackend-a0bzf8faakamd4gb.germanywestcentral-01.azurewebsites.net`
- ✅ **Múltiples modos de carga**: API, estático, por ID, por tema, por URL
- ✅ **Lista de quizzes**: Interfaz para ver todos los quizzes disponibles
- ✅ **Datos reales**: Quiz alemán "Das Perfekt" con formato exacto de tu API
- ✅ **Prop/state**: Si hay prop/state de quiz, la página se renderiza desde él (sin fetch)
- ✅ **Modo estático**: Si no hay prop y `VITE_USE_STATIC=1`, carga `./quiz.json` y renderiza correctamente
- ✅ **Envío de resultados**: Muestra resultados locales y hace POST a API cuando está configurada
- ✅ **Transformación**: `fromApiQuiz` mapea correctamente las letras/etiquetas de opciones sin errores de runtime
- ✅ **Tipos TypeScript**: Coinciden exactamente con tu OpenAPI spec
- ✅ **Cliente API**: Funciones para todos los endpoints de tu backend
