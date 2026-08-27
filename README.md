# Sistema de Gestión de Parqueadero

El sistema administra el ingreso y la salida de vehículos en un parqueadero:
registra el ingreso por placa, calcula el tiempo de permanencia y el valor a
pagar, lista los vehículos actualmente estacionados y valida la
disponibilidad de cupos.

## Reglas de negocio

1. No se permiten dos vehículos con la misma placa parqueados al mismo tiempo.
2. No se permite el ingreso de un vehículo si el parqueadero está lleno.
3. La hora de salida no puede ser anterior a la hora de entrada.

## Requerimientos funcionales cubiertos

- Registrar el ingreso de un vehículo por placa.
- Registrar automáticamente la hora de entrada.
- Calcular el tiempo de permanencia (horas facturables).
- Calcular el valor a pagar según una tarifa por hora.
- Consultar los vehículos actualmente estacionados.
- Validar la disponibilidad de cupos.

## Estructura del proyecto (separación de responsabilidades)

```
parking-system/
├── index.html               # Página principal de la aplicación
├── css/
│   └── styles.css            # Estilos visuales de la interfaz
├── src/
│   ├── models/               # Entidades de dominio (Vehicle)
│   ├── errors/                # Clases de error personalizadas
│   ├── utils/                 # Funciones auxiliares (cálculo de tiempos, formato)
│   ├── validators/            # Reglas de validación de datos de entrada
│   ├── repositories/          # Capa de acceso a datos (almacenamiento en memoria)
│   ├── services/               # Lógica de negocio (ParkingService)
│   ├── ui/                     # Capa de presentación web (manejo del DOM)
│   └── main.js                 # Punto de entrada de la aplicación
└── tests/
    └── parkingService.test.js  # Pruebas unitarias de las reglas de negocio
```

Cada capa tiene una única responsabilidad:
- validators: solo verifican que los datos de entrada sean correctos
  (campos obligatorios, valores numéricos válidos, valores no numéricos,
  rangos permitidos).
- repositories: solo gestionan el almacenamiento de los datos.
- services: solo contienen las reglas de negocio y la orquestación
  entre capas.
- ui: solo maneja la interacción con el usuario (leer el DOM, mostrar
  resultados), delegando toda la lógica al servicio.

## Validaciones de datos implementadas

- Campos obligatorios (por ejemplo, placa vacía o no enviada).
- Valores numéricos válidos (por ejemplo, la capacidad del parqueadero).
- Valores no numéricos rechazados donde se espera un número.
- Rangos permitidos (la capacidad debe ser un entero positivo; la placa
  debe tener entre 3 y 8 caracteres).

## Manejo de errores

Se definieron clases de error personalizadas (`ValidationError`,
`BusinessRuleError`, `NotFoundError`) que son lanzadas desde las capas de
validación y de negocio, y capturadas en la capa de interfaz (`ui`), la
cual muestra un mensaje claro al usuario en pantalla en lugar de dejar que
la aplicación falle de forma inesperada.

## Cómo ejecutarlo en Visual Studio Code con Live Server



Ejecuta los siguientes comandos desde la carpeta `parking-system`:

```bash
git init
git add .
git commit -m "feat: initial parking lot management system"

git branch -M main
git remote add origin https://github.com/<tu-usuario>/parking-system.git
git push -u origin main
```

## Configuración

La configuración inicial se define en `src/main.js`:
- `PARKING_CAPACITY = 5` (cupos totales del parqueadero)
- `RATE_PER_HOUR = 2000` (unidades monetarias por cada hora facturable;
  toda hora iniciada se cobra completa)

