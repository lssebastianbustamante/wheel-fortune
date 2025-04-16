# Custom Wheel Fortune

Una aplicación VTEX IO que implementa una ruleta de premios interactiva con arquitectura cliente-servidor.

## Arquitectura

La aplicación está dividida en dos partes principales:

### 1. Servicio Backend (Node)
- Implementado como un servicio VTEX IO Node
- Maneja la lógica de negocio y persistencia de datos
- Endpoints principales:
  - `/wheel-fortune/searchDocument/:email` - Valida si un usuario ya participó
  - `/wheel-fortune/savePrize` - Guarda los premios ganados en Master Data

### 2. Cliente Frontend (React)
- Componente React que implementa la UI de la ruleta
- Gestiona la interacción del usuario y animaciones
- Se comunica con el backend para validar y guardar participaciones

## Funcionalidades Principales

### Backend (Node)
- Validación de emails para prevenir participaciones duplicadas
- Persistencia de premios en Master Data
- Configuración de entidades y campos mediante app settings
- Manejo de caché para optimizar consultas frecuentes

### Frontend (React) 
- Modal interactivo con ruleta giratoria
- Formulario de captura de email con validaciones
- Animaciones fluidas de giro
- Diseño responsive
- Personalización completa vía Site Editor
- Gestión de estado local para control de participaciones

## Configuración

### 1. Instalación

Agregar la app a tu workspace:

```json
{
  "dependencies": {
    "vendor.wheel-fortune": "1.x"
  }
}
```

### 2. Configuración del Backend

En el admin de VTEX, configurar:

```json
{
  "dataEntity": "CL",         // Entidad de Master Data
  "fieldPrize": "prizeField", // Campo para guardar premio
  "fieldCoupon": "cuponField" // Campo para guardar cupón
}
```

### 3. Configuración del Frontend

Declarar el bloque en tu tema:

```json
{
  "custom-wheel-fortune": {
    "props": {
      "popupActive": true,
      "segments": [
        {
          "text": "ENVÍO GRATIS",
          "textWinner": "¡GANASTE ENVÍO GRATIS!",
          "colorSegment": "#fb5226",
          "colorText": "#fff",
          "prize": "envioGratis"
        }
        // ... más segmentos
      ]
    }
  }
}
```

## Props Disponibles

| Prop name | Type | Description | Default |
|-----------|------|-------------|---------|
| `popupActive` | `boolean` | Activa/desactiva el modal | `false` |
| `segments` | `array` | Configuración de premios | `[]` |
| `imageSrc` | `string` | URL imagen central | - |
| `formImg` | `string` | URL banner del form | - |
| `titleText` | `string` | Título del form | - |
| `variableLocalStorage` | `string` | Variable para localStorage | `"wheel"` |

### Estructura de Segmentos

```typescript
interface Segment {
  text: string           // Texto en la ruleta
  textWinner: string     // Texto al ganar
  colorSegment: string   // Color de fondo
  colorText: string      // Color del texto 
  prize: string         // ID del premio
  cupon: string         // Código de cupón
  voucherCondition: string // Condiciones
  prizeValid: string    // Validez
  prizeConditions: string // Términos y condiciones
}
```

## CSS Handles

| CSS Handle | Descripción |
|------------|-------------|
| `wheelFortuneWrapper` | Contenedor principal |
| `formWrapper` | Contenedor del formulario |
| `wheelContainer` | Contenedor de la ruleta |
| `wheelWrapper` | Wrapper de la ruleta |
| `wheel` | Ruleta |
| `spinButton` | Botón de giro |
| `wheelArrow` | Flecha indicadora |
| `prizeWrapper` | Contenedor del premio |
| `formContent` | Contenido del formulario |

## Comportamiento

1. El modal se muestra automáticamente después de un delay configurable
2. El usuario ingresa su email
3. Se valida si ya participó consultando al backend
4. Si no participó, puede girar la ruleta
5. Al detenerse, se guarda el premio en Master Data
6. Se muestra el premio ganado
7. El localStorage guarda la participación

## Endpoints del Servicio

### GET /wheel-fortune/searchDocument/:email
Valida si un email ya participó

### PATCH /wheel-fortune/savePrize  
Guarda un nuevo premio ganado

Request body:
```json
{
  "email": "usuario@email.com",
  "prizesEvent": "ENVIO_GRATIS",
  "couponEvent": "SHIPFREE"
}
```

## Contribución y Desarrollo

1. Clonar el repositorio
2. Instalar dependencias: `yarn install`
3. Link la app: `vtex link`
4. Para desarrollo:
   - Frontend: `cd react && yarn watch`
   - Backend: `cd node && yarn watch`

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades, por favor crear un issue en el repositorio.
