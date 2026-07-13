# SANS Study Indexer

A premium, high-density study indexing tool designed specifically for SANS course books and open-book exams (such as GIAC exams).

## Features
* **Multi-Format Printing & Booklet Layouts:** Toggle between a standard continuous list and structured booklets per book. Features a dynamic Master Cover Page index for quick-scanning topics alphabetically.
* **Smart Page Ranges:** Enter pages as ranges (e.g. `55-88`) or lists (e.g. `12, 14-17`). The search bar matches ranges (e.g., searching `57` correctly highlights entries in the `55-88` range).
* **Starred Entries:** Star important topics for high-fidelity golden visual highlight inside the table and printed copy.
* **Markdown Formatting:** Format your notes on the fly using standard markdown (==highlight==, **bold**, __underline__, *italic*).
* **Keyboard Shortcuts:** Focus search using `Ctrl + F`, focus new entry form using `Alt + N`, and clear/cancel using `Esc`.
* **Spellcheck Integration:** Integrated context menus offer native Windows spellchecking suggestions and standard edit operations (Cut, Copy, Paste).
* **Auto-Backups:** Automatically stores up to 100 timestamped backups of your database locally in the `backups/` folder.

## Setup Instructions

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (LTS recommended).

### Running Locally
1. Clone or download this repository.
2. Open your terminal inside this directory.
3. Install package dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```

### Packaging as a Standalone App
To create a standalone double-clickable executable (no Node.js installation required for classmates):
1. Run the packaging command:
   ```bash
   npm run package
   ```
2. Open the newly created `SANS Study Indexer-win32-x64` (or similar depending on platform) folder.
3. Run the executable inside!

## Data Portability & Storage
* **Local Storage:** All your data is saved in `sans_index.json` directly inside the application folder.
* **Easy Portability:** If you move the folder to a flash drive or another drive, the database and backups travel with the application.
