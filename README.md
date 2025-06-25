# Tic-Tac-Toe AI Visualizer

This project is a React-based Tic-Tac-Toe game with an AI opponent using the Minimax algorithm and alpha-beta pruning. It features a visual decision tree, difficulty selection, and detailed AI move explanations.

## Features
- Play Tic-Tac-Toe against an AI with adjustable difficulty
- Visualize the AI's decision tree using react-d3-tree
- See which branches are pruned by alpha-beta pruning
- Get explanations for AI moves and pruning values
- Responsive and modern UI with Tailwind CSS

## Getting Started

### Prerequisites
- Node.js (v18 or later recommended)
- npm

### Installation
1. Clone the repository:
   ```
   git clone <your-repo-url>
   cd Tic-Tac-Toe
   ```
2. Install dependencies:
   ```
   npm install
   ```

### Running Locally
Start the development server:
```
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```
npm run build
```
The production build will be in the `dist` folder.

### Preview Production Build
```
npx serve dist
```

## Deployment (Netlify)
The app is publicly deployed at [Tic-Tac-Toe](https://sprightly-florentine-7e0bfd.netlify.app/)

## Project Structure
- `src/components/DecisionTree.tsx` — Main AI tree visualization and explanations
- `src/components/` — Other UI components
- `src/utils/` — Game logic, minimax, and difficulty helpers
- `src/types/` — TypeScript types

## License
MIT
