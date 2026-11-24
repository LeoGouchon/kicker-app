# 0008. Workflow feature partagé par un plugin Claude Code

- **Statut** : Proposé
- **Date** : 2026-11-24
- **Remplace en partie** : [0006](0006-workflow-feature.md) (où vivent les skills ; le reste de 0006 tient toujours)

## Contexte

L'ADR 0006 a versionné les skills du workflow feature dans `.claude/skills/` de kicker-app. Le même workflow doit
maintenant servir au backend `hubscore`, puis aux autres projets. Copier les skills dans chaque dépôt les ferait
diverger : chaque amélioration (par exemple la règle de test ajoutée avec l'ADR 0007) serait à reporter partout.

Les skills mêlaient aussi deux choses : le déroulé des phases, commun à tous les projets, et des détails propres à
kicker-app (`npm run lint`, antd, parcours dans le navigateur, port 5173, rôles OIDC).

## Options envisagées

1. **Copie par dépôt** : simple, mais les copies divergent et chaque évolution se fait N fois.
2. **Skills personnelles** (`~/.claude/skills/`) : une seule copie, mais ni versionnée ni disponible sur une autre
   machine.
3. **Plugin dans la bibliothèque de l'organisation** sur claude.ai : partagé, mais visible de toute l'organisation
   alors que ces projets sont personnels.
4. **Plugin dans un dépôt GitHub privé** qui sert aussi de marketplace, avec un profil par projet.

## Décision

Nous retenons l'option 4 :

- **Plugin `gouchon`**, dépôt privé [LeoGouchon/claude-workflow](https://github.com/LeoGouchon/claude-workflow) :
  les skills `feature`, `cadrer`, `planifier`, `implementer`, `verifier`, leurs gabarits et le hook de taille des docs.
  Les commandes deviennent `/gouchon:feature`, `/gouchon:cadrer`, etc.
- **Profil par projet** : `.claude/workflow.md` décrit ce qui est propre au dépôt (commandes de preuve, règle de test,
  branches de cadrage, contrats externes, ordre des tâches, vérification en conditions réelles, points de revue). Sa
  présence active le workflow et le hook dans le dépôt.
- **Déclaration dans le dépôt** : `.claude/settings.json` déclare le marketplace et active le plugin, pour qu'il soit
  proposé sur toute machine qui ouvre le projet (et qui a accès au dépôt privé).
- **Exceptions de taille** : `.claude/doc-length-ignore.txt` (au lieu de `.claude/hooks/doc-length-ignore.txt`).
- **Inchangé** : les quatre phases, les fichiers de `specs/` et leurs statuts, une session par phase, le glossaire.

## Conséquences

- **Positives** :
    - une évolution du workflow se fait une fois et profite à tous les projets ;
    - le profil rend explicite ce que chaque projet attend des phases.
- **Négatives / coûts** :
    - il faut installer le plugin sur chaque machine (accès Git au dépôt privé requis) et le mettre à jour
      (`claude plugin update gouchon@claude-workflow`) ;
    - le format de `specs/` devient un contrat entre le plugin et les projets : il doit rester stable ;
    - une évolution propre à kicker-app va dans le profil ou la doc, jamais dans le plugin.
- **Suivi** :
    - la piste notée dans les specs de `unit-tests-setup` (un plan qui nomme chaque fichier, avec le changement et la
      logique à y coder) se traite désormais dans le dépôt du plugin ; celle du cadrage une question à la fois est
      abandonnée ;
    - l'ADR 0001 cite encore l'ancien chemin du hook : il reste exact pour le principe, le chemin est donné ici.
