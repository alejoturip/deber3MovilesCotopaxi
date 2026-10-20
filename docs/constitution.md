# Constitución del proyecto — Cotopaxi Focus

Principios no negociables. Toda spec, plan y cambio de código debe cumplirlos. Si una solicitud los contradice, se explica el conflicto antes de actuar.

## I. El cliente primero
La línea base son las 6 historias de usuario de `docs/historias/`. Se pueden añadir mejoras, pero ninguna puede romper un criterio de aceptación existente.

## II. El tiempo nunca se pierde
El temporizador se basa en la hora absoluta de fin (`endsAt`), nunca en contar ticks. Bloquear el celular, cerrar la app o reiniciar el proceso no puede alterar el tiempo restante.

## III. El aviso siempre llega
Cuando se inicia una fase, la alarma queda agendada en el sistema operativo. Debe sonar con el celular bloqueado, en silencio o con la app cerrada. Pausar o reiniciar la cancela.

## IV. Cero fricción, cero datos
Sin registro, sin inicio de sesión, sin publicidad, sin analítica y sin servidor. Todo funciona sin internet y los datos solo viven en el celular.

## V. Separación de responsabilidades
- `src/app`: pantallas.
- `src/domain`: reglas puras y probadas.
- `src/storage` y `src/services`: únicas puertas hacia AsyncStorage y expo-notifications.
- `src/components`: UI reutilizable sin reglas de negocio.

## VI. Identidad Cotopaxi
Se usan los colores medidos del logotipo (azul `#16145F`, dorado `#D1A417`) y el logotipo original sin deformar. Los estados nunca se comunican solo con color.

## VII. Probado antes de entregado
Toda regla del dominio tiene test. Las HU de riesgo alto (HU-003, HU-004) se verifican además en un celular Android real con el checklist de su spec.

## VIII. Simplicidad
Arquitectura profesional pero proporcional a una app académica. No se agregan dependencias ni capas sin una necesidad concreta.
