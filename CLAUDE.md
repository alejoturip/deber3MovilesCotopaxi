@AGENTS.md

## Notas para Claude Code

- La fuente de verdad de agentes y skills es `.github/agents/` y `.github/skills/` (compartidos con Copilot/OpenCode).
- `npm run sync:claude` los copia a `.claude/agents/` y `.claude/skills/` para que Claude Code los detecte como subagentes y skills. No edites las copias: edita `.github/` y vuelve a sincronizar.
- Para una HU nueva o un cambio de alcance, empieza con el subagente `spec-writer`; para implementar, `mobile-implementer`; para verificar, `qa-tester`; para diseño, `ui-designer`.
