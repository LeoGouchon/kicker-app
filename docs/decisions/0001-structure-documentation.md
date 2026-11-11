# 0001. Structure de la documentation

- **Statut** : Accepté
- **Date** : 2026-11-11

## Contexte

La doc du projet se limitait :

- à un README centré sur la configuration OIDC, qui citait une commande `npm test` inexistante ;
- à un `.codex/AGENTS.md` de trois lignes que le code ne respectait pas toujours.

Les conventions n'étaient écrites nulle part. Les nouvelles features recopiaient donc les patterns du fichier le plus
proche, y compris les mauvais.

Le projet est développé avec des agents IA (Claude Code). Un agent a besoin d'une doc qu'il peut charger **par
morceaux**. Un fichier unique et long consomme le contexte pour rien, et une doc éparpillée sans index n'est pas
trouvée.

## Options envisagées

1. **Fichiers plats** (`ARCHITECTURE.md`, `CONVENTIONS.md`…) : simple, mais les fichiers grossissent et doivent être
   chargés en entier.
2. **Diátaxis** (tutorials / how-to / reference / explanation) : référence reconnue, mais trop lourde pour la taille
   du projet.
3. **Dossiers par thème avec sommaires progressifs** :
    - `architecture/`, `conventions/`, `process/`, `decisions/` ;
    - un `README.md` par dossier.

## Décision

Nous retenons l'option 3 :

- **Organisation** : `docs/` est la source de vérité, en français, organisée en quatre dossiers thématiques :
    - `architecture` décrit ce qui est ;
    - `conventions` dit ce qui doit être ;
    - `process` dit comment faire ;
    - `decisions` explique pourquoi.
- **Sommaires** : chaque dossier a un `README.md` qui donne sa visée et son sommaire. Chaque entrée de sommaire porte
  un lien, une description et une ligne « À lire si », pour que le lecteur ou l'agent décide s'il charge le fichier.
- **Taille** : un fichier vise **200 lignes maximum**. Un hook Claude Code (`.claude/hooks/check-doc-length.mjs`,
  déclaré dans `.claude/settings.json`) signale le dépassement, et l'agent **propose** de transformer le fichier en
  dossier qui suit le même système. Le hook ne bloque pas : l'utilisateur peut accepter, reporter, ou garder le
  fichier long en l'ajoutant à `.claude/hooks/doc-length-ignore.txt`.
- **Point d'entrée IA** : `CLAUDE.md` est le seul fichier d'instructions pour les agents. Il importe
  `docs/README.md` et résume les règles non négociables. `.codex/AGENTS.md` est supprimé.
- **Approche** : les conventions décrivent la **cible** (inspirée des recommandations officielles React, antd et
  TanStack Query). Les écarts du code actuel sont listés dans `tech-debt.md` au lieu d'être documentés comme normes.

## Conséquences

- **Positives** :
    - un agent ne charge que les fichiers utiles à sa tâche ;
    - les règles sont explicites et justifiées ;
    - la dette est visible et priorisée.
- **Coûts** :
    - la doc doit être mise à jour dans la même PR que le code qui la contredit ;
    - les sommaires doivent rester exacts ;
    - le hook ne surveille que les écritures faites par Claude Code : une édition manuelle n'est pas contrôlée, et la
      relecture de PR doit vérifier la taille ;
    - la limite étant une proposition, les exceptions s'accumulent si on refuse trop souvent : la relecture doit
      vérifier `doc-length-ignore.txt`.
- **Suivi** : migrer le code vers les conventions au fil de `tech-debt.md`.
