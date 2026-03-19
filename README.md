# Miso's Gym App 💜

A personalized workout checklist and progress tracker.

## 🚀 How to Host on GitHub Pages

Follow these steps to get your app online:

### 1. Create a Repository
- Go to [GitHub](https://github.com/new).
- Name it (e.g., `miso-gym`).
- Keep it **Public**.
- Click **Create repository**.

### 2. Push your Code
Open your terminal in this project folder and run:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```
*(Replace `<YOUR_GITHUB_REPO_URL>` with your link)*

### 3. Enable Deployment (CRITICAL FIX FOR ERRORS)
If you get a "Not Found" error on GitHub Actions, you must do this:
1. On GitHub, go to your repository **Settings**.
2. Click **Pages** in the left sidebar.
3. Under **Build and deployment** > **Source**, change "Deploy from a branch" to **GitHub Actions**.
4. That's it! Your site will now build and deploy successfully.

## ✨ Features
- **Persistent Progress**: Checklist only resets when you click "Finish Workout".
- **Top Progress Bar**: Always visible tracker at the top.
- **Grinding & Resting**: Toggle between "Normal" and "Low Energy" modes.
- **Points Shop**: Earn points for titles and rewards.
- **Hydration Tracking**: Log water with quick-add buttons.
- **Custom Titles**: Equip owned titles in the Settings menu.
