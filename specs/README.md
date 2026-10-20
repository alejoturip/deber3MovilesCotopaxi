# Specs (Spec-Driven Development)

Cada historia de usuario tiene su carpeta con tres documentos:

| Archivo | Pregunta que responde | Quién lo produce |
|---|---|---|
| `spec.md` | ¿Qué se construye exactamente y cómo se verifica? | agente `spec-writer` |
| `plan.md` | ¿Dónde vive en la arquitectura y qué decisiones técnicas implica? | agente `spec-writer` |
| `tasks.md` | ¿Qué pasos pequeños se ejecutan y cuáles ya están hechos? | agente `mobile-implementer` / `qa-tester` |

Orden de implementación (por riesgo y dependencia): HU-006 → HU-001 → HU-002 → HU-003 → HU-004 → HU-005.
Las HU de riesgo alto (HU-003 y HU-004) se validaron primero con una prueba técnica en dispositivo, porque si fallan cambian la arquitectura.
