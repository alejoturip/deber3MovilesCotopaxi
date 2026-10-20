---
name: cotopaxi-school
description: Aplica la identidad visual del logotipo de Academia Cotopaxi American International School a pantallas y componentes de la app móvil (Expo/React Native). Usar al diseñar o rediseñar cualquier pantalla, componente, color, tipografía o texto de interfaz.
---

# SKILL: Identidad visual Academia Cotopaxi (app móvil)

## 1. Objetivo
Que la app transmita educación, excelencia, confianza e identidad institucional con una interfaz moderna, ordenada y fácil de usar por estudiantes de primeros niveles.

## 2. Cuándo utilizarla
- Al crear o modificar pantallas en `src/app/` o componentes en `src/components/`.
- Al agregar colores, tipografías, espaciados o íconos.
- Al revisar la UI antes de la demo.

## 3. Análisis inicial (antes de cambiar nada)
1. Revisar `src/constants/theme.ts` (tokens existentes).
2. Revisar las pantallas y componentes existentes y qué HU atiende cada uno.
3. Localizar el logotipo: `assets/images/logo-cotopaxi.png` (archivo original entregado por el cliente).
4. Mantener la arquitectura y la lógica de negocio: esta skill solo cambia presentación.

## 4. Paleta (medida sobre el logotipo original)
| Token | Hex | Uso |
|---|---|---|
| `navy` | `#16145F` | Títulos, texto principal, botón primario, anillo en fase de estudio |
| `navySoft` | `#292879` | Botones de texto, acentos secundarios |
| `navyMuted` | `#8A89AF` | Bordes de elementos pendientes, placeholders |
| `gold` | `#D1A417` | Acentos, progreso del ciclo, anillo en descanso, botón de acento |
| `goldLight` | `#F5D76E` | Detalles decorativos |
| `goldSoft` | `#FBF3D6` | Fondo de avisos dorados |
| `white` | `#FFFFFF` | Tarjetas |
| `background` | `#F5F6FA` | Fondo de pantallas |
| `textSecondary` | `#606575` | Texto secundario |

> La skill original proponía `#17165C` y `#E2B323` como aproximaciones. Se analizaron los píxeles del logo y se ajustaron a los tonos reales `#16145F` y `#D1A417`.

## 5. Reglas
- Azul institucional para títulos, navegación y acción principal.
- Dorado para acentos e indicadores, nunca como fondo de bloques grandes de texto.
- Sobre dorado el texto va en azul (`navy`), nunca en blanco (contraste insuficiente).
- Fondo gris claro y tarjetas blancas con borde sutil y sombra suave.
- Metáfora visual: el anillo del temporizador se llena como el sol naciente del logo (azul en estudio, dorado en descanso).
- No introducir colores brillantes ajenos a la identidad (ni el azul/amarillo de otras marcas).

## 6. Logotipo
1. Usar siempre `assets/images/logo-cotopaxi.png`.
2. `resizeMode="contain"` y tamaño cuadrado: no estirar, inclinar, recortar ni recolorear.
3. Fondo blanco o neutro.
4. `accessibilityLabel="Logotipo de Academia Cotopaxi American International School"`.
5. No recrearlo con texto o íconos ni sustituirlo por una montaña genérica.

## 7. Componentes
- `Button` (`src/components/ui/Button.tsx`): `primary` azul, `secondary` blanco con borde azul, `accent` dorado con texto azul, `ghost` solo texto.
- `Card` (`src/components/ui/Card.tsx`): blanco, radio 20, borde `border`, sombra suave.
- Formularios: etiqueta visible, rango permitido como ayuda, error en rojo accesible con texto.
- Estados vacíos o de carga: `ActivityIndicator` en azul.

## 8. Accesibilidad móvil
- Objetivos táctiles ≥ 48 dp (`MIN_TOUCH_SIZE`).
- `accessibilityRole` y `accessibilityLabel` en botones, temporizador y avisos.
- Los estados (estudio/descanso, en curso/pausa) se comunican con texto, no solo con color.
- Números del temporizador con `fontVariant: ['tabular-nums']` para que no "salten".
- Contenido con ancho máximo de 520 en tabletas.

## 9. Restricciones
- No inventar programas, logros ni textos institucionales oficiales.
- No agregar enlaces a pantallas inexistentes.
- No agregar dependencias de UI (kits de componentes, fuentes externas) sin justificarlo en `docs/decisiones-tecnicas.md`.
- No tocar `src/domain`, `src/storage` ni `src/services`.

## 10. Ejemplo
```tsx
// ✅ Correcto: tokens del tema
<Text style={{ color: colors.navy, fontSize: typography.title }}>Cotopaxi Focus</Text>

// ❌ Incorrecto: color suelto y blanco sobre dorado
<View style={{ backgroundColor: '#E2B323' }}><Text style={{ color: '#fff' }}>Iniciar</Text></View>
```

## 11. Criterios de aceptación
- La interfaz refleja el azul y el dorado del logotipo de forma consistente.
- El logotipo conserva proporciones y colores.
- Jerarquía visual clara: fase → tiempo → avance → acciones.
- Ningún valor visual fuera de `theme.ts`.
- Las funcionalidades existentes siguen funcionando (`npm test` y `npm run typecheck` en verde).
- Se entrega un resumen de archivos modificados.
