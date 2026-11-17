// Hook Claude Code (PostToolUse sur Write|Edit|MultiEdit).
// Quand un fichier de documentation (docs/**/*.md ou CLAUDE.md) dépasse MAX_LINES lignes, il ne bloque rien :
// il prévient l'utilisateur et demande à l'agent de lui PROPOSER le découpage. L'utilisateur décide.
// - Proposé au plus une fois par fichier et par session (« Pas maintenant » ne relance pas à chaque édition).
// - Les fichiers listés dans IGNORE_FILE ne sont plus signalés (« Ne plus demander »).
// Voir docs/README.md, section « Contribuer à la doc ».
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { isAbsolute, join, relative, resolve } from 'node:path';

const MAX_LINES = 200;
const IGNORE_FILE = '.claude/hooks/doc-length-ignore.txt';

const readStdin = async () => {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
};

const countLines = (content) => {
    if (content.length === 0) return 0;
    const lines = content.split(/\r?\n/);
    return lines.at(-1) === '' ? lines.length - 1 : lines.length;
};

const readIgnoredPaths = (projectDir) => {
    const ignoreFile = join(projectDir, IGNORE_FILE);
    if (!existsSync(ignoreFile)) return new Set();
    return new Set(
        readFileSync(ignoreFile, 'utf8')
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#'))
    );
};

// Mémorise, pour la session, les fichiers pour lesquels le découpage a déjà été proposé.
const wasAlreadyProposed = (sessionId, relativePath) => {
    if (!sessionId) return false;
    const stateDir = join(tmpdir(), 'claude-doc-length');
    const stateFile = join(stateDir, `${sessionId.replace(/[^\w-]/g, '_')}.json`);
    const proposed = existsSync(stateFile) ? JSON.parse(readFileSync(stateFile, 'utf8')) : [];
    if (proposed.includes(relativePath)) return true;
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(stateFile, JSON.stringify([...proposed, relativePath]));
    return false;
};

const buildInstructions = (relativePath, lineCount) => {
    const isClaudeMd = relativePath === 'CLAUDE.md';
    const splitHow = isClaudeMd
        ? 'déplacer le détail dans docs/ et ne garder dans CLAUDE.md qu’un résumé avec des liens'
        : `transformer ${relativePath} en dossier du même nom (sans .md) contenant un README.md (visée, quand y ` +
          'ajouter un fichier, sommaire : lien + description + « À lire si » par sous-fichier) et des sous-fichiers ' +
          'thématiques de moins de 200 lignes, puis mettre à jour le sommaire parent et les liens';
    return [
        `[Limite de taille de la doc] ${relativePath} fait ${lineCount} lignes (limite : ${MAX_LINES}).`,
        'NE DÉCOUPE PAS ce fichier de toi-même. Termine d’abord l’action en cours, puis pose la question à',
        'l’utilisateur avec AskUserQuestion, en proposant un plan de découpage concret (noms des sous-fichiers',
        'et répartition des sections). Options :',
        `1. « Découper maintenant » : ${splitHow}.`,
        '2. « Pas maintenant » : ne rien faire ; ce hook ne redemandera pas pour ce fichier pendant cette session.',
        `3. « Ne plus demander pour ce fichier » : ajouter la ligne « ${relativePath} » à ${IGNORE_FILE}.`,
        'Respecte strictement la réponse de l’utilisateur.',
    ].join('\n');
};

const main = async () => {
    const payload = JSON.parse((await readStdin()) || '{}');
    const filePath = payload.tool_input?.file_path ?? payload.tool_response?.filePath;
    if (!filePath) return;

    const projectDir = process.env.CLAUDE_PROJECT_DIR || payload.cwd || process.cwd();
    const absolutePath = isAbsolute(filePath) ? filePath : resolve(projectDir, filePath);
    const relativePath = relative(projectDir, absolutePath).replaceAll('\\', '/');

    const isDoc = relativePath === 'CLAUDE.md' || (relativePath.startsWith('docs/') && relativePath.endsWith('.md'));
    if (!isDoc || !existsSync(absolutePath)) return;

    const lineCount = countLines(readFileSync(absolutePath, 'utf8'));
    if (lineCount <= MAX_LINES) return;
    if (readIgnoredPaths(projectDir).has(relativePath)) return;
    if (wasAlreadyProposed(payload.session_id, relativePath)) return;

    process.stdout.write(
        JSON.stringify({
            systemMessage: `${relativePath} dépasse ${MAX_LINES} lignes (${lineCount}) : un découpage va vous être proposé.`,
            hookSpecificOutput: {
                hookEventName: 'PostToolUse',
                additionalContext: buildInstructions(relativePath, lineCount),
            },
        })
    );
};

main().catch((error) => {
    process.stderr.write(`check-doc-length: ${error.message}\n`);
    process.exit(1);
});
