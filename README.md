# ✨ Para Liseth — Un Universo Para Ti 🌌

Una experiencia web poética, cinematográfica e interactiva diseñada especialmente para **Liseth**. Combina una atmósfera 3D cósmica en capas, animaciones fluidas con **GSAP**, música ambiental y un modal con efecto realista de **máquina de escribir en fuente *Special Elite*** con audio mecánico táctil.

🌐 **Enlace en vivo (GitHub Pages)**: [https://umbrex47.github.io/para-liseth/](https://umbrex47.github.io/para-liseth/)

---

## 💫 Características Principales

1. **Escena Cósmica Tridimensional**:
   - Silueta humana contemplando el infinito sobre un pedestal geométrico flotante con halos de luz.
   - Planetas texturizados mediante filtros SVG (`feTurbulence`), anillos estelares y un sol resplandeciente.
   - Más de 200 estrellas fugaces (*startails*) y partículas celestes generadas dinámicamente.
   - Efecto Parallax 3D suave al mover el ratón o inclinar el dispositivo móvil.

2. **Flujo de Interacción Cinematográfico con GSAP**:
   - Botón inicial flotante: **«Leer respuestas»** con halo de luz y animación suave de levitación.
   - Al pulsar, el botón se disuelve poéticamente y revela el menú de **3 preguntas / capítulos** con entrada escalonada (*staggered spring animation*).
   - Opción para ocultar las preguntas y volver a admirar el firmamento en cualquier momento.

3. **Modal de Máquina de Escribir (Fuente *Special Elite*)**:
   - Modal flotante con estética *glassmorphism* cósmica y borde estrellado.
   - Efecto de mecanografía con pausas orgánicas (comas, puntos, pausas reflexivas y saltos de párrafo).
   - Cursor de máquina de escribir parpadeante.
   - Sonido realista de pulsación mecánica de teclas sintetizado mediante la **Web Audio API** (sin dependencias de archivos externos).
   - Botones para silenciar el tecleo o mostrar el texto completo de inmediato (`⚡ Leer todo`).
   - Firma amorosa que aparece suavemente al culminar la lectura junto con una lluvia de estrellas brillantes (*confetti celestial*).
   - Navegación fluida entre capítulos (`← Anterior`, `Siguiente →`, teclado `Esc`, `←`, `→`).

4. **Banda Sonora**:
   - **Canción de fondo**: *Tel Aviv* de **Danny Ocean** incluida localmente en alta fidelidad (`public/audio/tel-aviv.mp3`), disponible tanto en modo desarrollo como en la compilación de producción.
   - Botón de audio con ecualizador animado en la esquina superior derecha para pausar o reanudar.
   - Sintetizador de respaldo automático mediante Web Audio API.

5. **Optimización Nativa para Celulares en Vertical**:
   - **Vista vertical fluida**: Se eliminó cualquier bloqueo de rotación para permitir abrir y disfrutar la experiencia directamente sosteniendo el teléfono de forma natural (vertical).
   - **Escena 3D adaptativa**: La composición de planetas, sol y la silueta en el pedestal se centran armoniosamente en pantallas móviles alargadas.
   - **Tarjetas y modal táctiles**: Menú de preguntas en lista vertical limpia y modal con desplazamiento táctil suave (*smooth touch scrolling*) y tipografía legible.

---

## 📖 Las 3 Cartas Incluidas

* **Capítulo 01**: *¿Qué pienso cuando te veo?*
  > *«Pienso muchas cosas. A veces, cuando te pones con tus vainas raras… Luego, al girar la cabeza y volver a verte, pienso: Claro, es que es jodidamente maravillosa, a pesar de que me saca canas.»*

* **Capítulo 02**: *¿Qué pienso al escuchar tu nombre?*
  > *«La verdad, mi reacción es casi automática. Me vuelvo más atento… Como si, entre tantas palabras, tu nombre tuviera una forma particular de hacerse notar.»*

* **Capítulo 03**: *¿Qué siento cuando pienso en ti?*
  > *«Con la simple aparición de tu sonrisa en mi pensamiento, dejó de importarme todo lo demás… Sencillamente, es la chica que quiero a mi lado.»*

---

## 🚀 Cómo Iniciar el Proyecto

### Opción 1: Script Directo
En la terminal, dentro de la carpeta del proyecto:
```bash
./start.sh
```

### Opción 2: Con Bun o Node / NPM
```bash
# Iniciar servidor de desarrollo
bun run dev
# o con npm:
npm run dev
```
Luego abre tu navegador en: **`http://localhost:5173`**

### Opción 3: Construir para Compartir o Desplegar
```bash
bun run build
# o con npm:
npm run build
```
Los archivos optimizados y autónomos se generarán en la carpeta `dist/`. Puedes subirlos a Vercel, Netlify, GitHub Pages o enviárselos como un archivo comprimido.

---

## 🛠️ Tecnologías Utilizadas

- **Vite 6** (Empaquetador ultra rápido y liviano)
- **GSAP (GreenSock Animation Platform)** (Animaciones fluidas y complejas)
- **Sass (SCSS)** (Estilos avanzados, capas `@layer`, transformaciones 3D)
- **Web Audio API** (Sintetizador procedural de tecleo y música ambiental)
- **Google Fonts** (`Special Elite`, `Cinzel`, `Plus Jakarta Sans`)
- **Canvas-Confetti** (Destellos estelares)

---

*Hecho con amor y dedicación para Liseth.* ✨
