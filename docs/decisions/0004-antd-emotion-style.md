# 0004. antd et emotion pour l'UI et le style

- **Statut** : Accepté
- **Date** : 2026-11-11 (formalise un choix existant)

## Contexte

L'application est principalement faite de tableaux, formulaires, cartes et statistiques. Elle doit fonctionner sur
mobile et en thème clair ou sombre. Il faut une bibliothèque de composants complète et un moyen d'ajuster le style
sans casser le thème.

## Options envisagées

1. **Tailwind + composants maison** : flexible, mais tout est à construire (tables triables, formulaires validés,
   date pickers).
2. **antd seul**, ajusté par `style` inline et CSS global : rapide, mais le style se disperse et ignore le thème.
3. **antd + emotion `styled`** : composants complets et thème via tokens antd ; le style spécifique est écrit dans
   des composants stylés co-localisés.

## Décision

Nous utilisons :

- **antd 6** pour les composants, le thème (algorithme clair/sombre, `cssVar`) et le feedback (`App.useApp()`) ;
- **emotion (`@emotion/styled`)** pour le style spécifique, dans des fichiers `<Composant>.style.tsx`, avec les
  **tokens antd exposés en variables CSS** (`var(--ant-*)`) ;
- **FontAwesome** pour les icônes, **chart.js** (`react-chartjs-2`) pour les graphiques.

## Conséquences

- **Positives** :
    - grande couverture fonctionnelle ;
    - thème sombre gratuit dès qu'on utilise les tokens ;
    - style localisé et nommé.
- **Négatives** :
    - surcharger antd demande de la spécificité (`&&`), qu'il faut maîtriser ;
    - deux systèmes cohabitent (tokens antd et emotion) ;
    - le bundle antd est lourd.
- **Suivi** :
    - règles dans `conventions/styling.md` et `conventions/components.md` ;
    - retirer les dépendances inutilisées (`@ant-design/plots`) et le thème emotion non lu (voir `tech-debt.md`).
