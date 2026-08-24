# Sistema de Gestión de Parqueadero

Prototipo desarrollado para **TechSoft S.A.** con el fin de validar el manejo
de reglas de negocio y el uso correcto de Git/GitHub, simulando un entorno
real de trabajo en la industria del software.

El sistema administra el ingreso y la salida de vehículos en un parqueadero:
registra el ingreso por placa, calcula el tiempo de permanencia y el valor a
pagar, lista los vehículos actualmente estacionados y valida la
disponibilidad de cupos.

La interfaz es una **página web** (HTML, CSS y JavaScript puro, sin
frameworks ni backend) pensada para ejecutarse con la extensión
**Live Server** de Visual Studio Code.

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
- **validators**: solo verifican que los datos de entrada sean correctos
  (campos obligatorios, valores numéricos válidos, valores no numéricos,
  rangos permitidos).
- **repositories**: solo gestionan el almacenamiento de los datos.
- **services**: solo contienen las reglas de negocio y la orquestación
  entre capas.
- **ui**: solo maneja la interacción con el usuario (leer el DOM, mostrar
  resultados), delegando toda la lógica al servicio.

## Idioma del código y comentarios

Por requerimiento del proyecto, el **código fuente** (nombres de clases,
funciones, variables y mensajes internos del sistema) está escrito
**en inglés**, siguiendo una convención de nombres consistente:
**camelCase** para variables y funciones, y **PascalCase** para clases
(por ejemplo `ParkingService`, `Vehicle`, `registerEntry`, `licensePlate`).

Los **comentarios explicativos dentro del código** y este **README** están
escritos **en español**, para que el proyecto sea fácil de entender y
mantener por el equipo.

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

### Requisitos previos
- [Visual Studio Code](https://code.visualstudio.com/) instalado.
- La extensión **Live Server** (de Ritwick Dey) instalada desde el
  marketplace de VS Code.
- [Node.js](https://nodejs.org) v16 o superior (solo necesario para correr
  las pruebas automatizadas, no para ver la página).

### Pasos
1. Abre la carpeta `parking-system` en Visual Studio Code
   (`File > Open Folder...`).
2. Instala la extensión **Live Server** si aún no la tienes (ícono de
   extensiones en la barra lateral, buscar "Live Server").
3. Haz clic derecho sobre el archivo `index.html` y selecciona
   **"Open with Live Server"** (o haz clic en el botón "Go Live" en la
   barra inferior de VS Code).
4. Se abrirá automáticamente el navegador con la aplicación (por defecto en
   `http://127.0.0.1:5500`).
5. Usa la interfaz para registrar ingresos/salidas de vehículos, consultar
   la disponibilidad y ver la lista de vehículos parqueados.

> **Nota:** el proyecto usa módulos de JavaScript (`type="module"`), por lo
> que **debe** abrirse a través de un servidor como Live Server y no
> directamente como archivo (`file://`), ya que los navegadores bloquean
> los módulos ES al abrirlos así.

### Ejecutar las pruebas automatizadas
```bash
npm test
```
Todas las reglas de negocio (placa duplicada, parqueadero lleno, hora de
salida inválida, cálculo del valor a pagar, validaciones de datos) están
cubiertas por pruebas automatizadas.

## Subir el proyecto a GitHub (evidencia de uso de Git)

Ejecuta los siguientes comandos desde la carpeta `parking-system`:

```bash
git init
git add .
git commit -m "feat: initial parking lot management system"

git branch -M main
git remote add origin https://github.com/<tu-usuario>/parking-system.git
git push -u origin main
```

### Historial de commits sugerido (claros y descriptivos)

Para evidenciar un buen uso de Git, se recomienda hacer commits
incrementales a medida que se construye cada parte, por ejemplo:

```bash
git commit -m "feat: add Vehicle model"
git commit -m "feat: add custom error classes"
git commit -m "feat: add license plate and capacity validators"
git commit -m "feat: add in-memory vehicle repository"
git commit -m "feat: add ParkingService with business rules"
git commit -m "feat: add web UI with animated gate barrier"
git commit -m "test: add unit tests for parking business rules"
git commit -m "fix: correct billable hours rounding"
git commit -m "docs: add project README"
```

Se utilizan prefijos como `feat`, `fix`, `test` y `docs` para mantener el
historial de commits claro y descriptivo.

## Configuración

La configuración inicial se define en `src/main.js`:
- `PARKING_CAPACITY = 5` (cupos totales del parqueadero)
- `RATE_PER_HOUR = 2000` (unidades monetarias por cada hora facturable;
  toda hora iniciada se cobra completa)

Ambos valores pueden ajustarse según sea necesario.
