// Copia agentes y skills de .github/ (fuente de verdad, compartida con Copilot/OpenCode)
// a .claude/ para que Claude Code los detecte como subagentes y skills.
// Uso: npm run sync:claude
import { cpSync, mkdirSync, readdirSync, rmSync, copyFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const agentsSrc = join(root, '.github', 'agents');
const skillsSrc = join(root, '.github', 'skills');
const agentsDst = join(root, '.claude', 'agents');
const skillsDst = join(root, '.claude', 'skills');

rmSync(agentsDst, { recursive: true, force: true });
rmSync(skillsDst, { recursive: true, force: true });
mkdirSync(agentsDst, { recursive: true });

for (const file of readdirSync(agentsSrc)) {
  if (!file.endsWith('.agent.md')) continue;
  copyFileSync(join(agentsSrc, file), join(agentsDst, file.replace('.agent.md', '.md')));
}
cpSync(skillsSrc, skillsDst, { recursive: true });

console.log('Agentes y skills sincronizados en .claude/');
