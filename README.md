# SANS Study Indexer

A high-density, professional study indexing and exam preparation tool designed specifically for SANS course books and open-book certification exams (such as GIAC exams).

---

## Features

### 🖨️ Multi-Format Printing & Booklet Layouts
* **Continuous & Per-Book Booklet Modes:** Toggle between a continuous master index and structured booklets per course book.
* **Master Cover Page:** Automatically generates an alphabetical topic guide and summary cover page for quick-scanning during timed exams.
* **2-Column Layout with Notes:** High-density printing format optimized for maximum information density per page without sacrifice of legibility.
* **Zero-Waste Pagination Engine:** Intelligent pagination budgeting eliminates single orphaned entries on trailing pages.
* **Binding Margins:** Built-in binding offset options (for spiral binding, comb binding, or 3-ring hole punches).
* **Acronym Booklet:** Generates a dedicated physical acronym reference booklet.

### 🤖 AI-Powered Auto-Indexing (Gemini)
* **Automated PDF Indexing:** Ingest SANS course PDFs or existing index documents to extract topics, books, page numbers, and concise summaries.
* **Google Gemini Integration:** Dynamic model discovery with support for Gemini 2.5 Flash, 2.5 Pro, 2.0 Flash, and custom prompt templates.
* **Smart Batch Chunking & Pacing:** Automatic batch queuing, quota-tier pacing, and real-time live progress console.
* **Local OCR Fallback:** Optional local extraction engine powered by Python, PyMuPDF, and doctr OCR.

### 🛡️ Course-Scoped Version History & Revert
* **100 Version Auto-Backups:** Automatically snapshots your database locally after changes.
* **Course Isolation:** Reverting is scoped strictly to your active course, ensuring other courses remain untouched.
* **Notes Metric Tracking:** Tracks both total terms and entries with notes (e.g. `1,527 terms • 412 notes`), making note additions visible even when term count hasn't changed.
* **Pre-Revert Safety Snapshots:** Every revert automatically creates a pre-revert safety snapshot (`backup_<timestamp>_pre_revert.json`) for instant one-click undo.
* **Note-Loss Warnings:** Explicitly alerts you before restoring if a prior version contains fewer notes than your current index.

### 🎨 Custom Themes (including Windows 95)
* Switch themes on the fly via the Theme Selector in the header:
  * **Windows 95:** Classic beveled 3D gray UI, retro sunken insets, system fonts, and authentic audio feedback.
  * **Modern Dark:** Default sleek dark interface.
  * **Cyberpunk:** Neon high-contrast palette.
  * **Forest:** Calming earthy green tones.
  * **Nord:** Arctic blue minimalist theme.
  * **Solarized:** Classic developer palette.
  * **Paper (Light):** Clean, crisp high-readability light theme.
  * **Synthwave:** Vibrant 80s retro aesthetics.

### 🔍 Smart Search & Formatting
* **Page Range Matching:** Enter pages as ranges (`55-88`) or lists (`12, 14-17`). Searching page `57` accurately surfaces and highlights entries spanning `55-88`.
* **Starred Topics:** Highlight high-priority entries with a golden badge for instant visual recognition in both software and print.
* **Live Markdown Notes:** Full markdown formatting on the fly (`==highlight==`, `**bold**`, `__underline__`, `*italic*`).
* **Keyboard Shortcuts:** `Ctrl + F` (Search), `Alt + N` (New Entry), `Esc` (Clear / Close).
* **Native Spellchecking:** Context menu integration with Windows spellcheck and quick edit actions.

### 📚 Study & Exam Tools
* **Interactive Study Quiz:** Dynamic flashcard and quiz testing mode to practice recall against your indexed terms.
* **Acronym Dictionary:** Dedicated acronym manager and fast lookup tab.
* **Integrated Notes Editor:** Built-in workspace editor for drafting long-form study notes and cheat sheets.
* **Data Import/Export:** Direct CSV and JSON import/export with automatic course and book creation.

---

## Setup & Installation

### Prerequisites
1. **[Node.js](https://nodejs.org/)** (v18.x or higher / LTS recommended)
2. **Git** (for automatic in-app updates)
3. *(Optional)* **Google Gemini API Key:** Required only if using AI Auto-Indexing. You can generate a free API key at [Google AI Studio](https://aistudio.google.com/).
4. *(Optional)* **Python 3.10+:** Required only if using the optional local Python OCR extraction engine instead of Gemini AI.

---

### Running Locally

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/bkboltz/SANS-Index.git
   cd SANS-Index
   ```
2. **Install Node Dependencies:**
   ```bash
   npm install
   ```
3. **Launch the Application:**
   ```bash
   npm start
   ```

---

### Packaging as a Standalone Application
To generate a standalone Windows executable (so classmates or study group partners can run it without installing Node.js):

1. Run the packager script:
   ```bash
   npm run package
   ```
2. Open the generated `SANS Study Indexer-win32-x64` folder.
3. Launch `SANS Study Indexer.exe`.

---

## How to Use

### 1. Creating Courses & Books
* Select or create a course from the top course dropdown (e.g. `SEC504`, `FOR508`, `SEC565`).
* Click **Manage Books** in the sidebar to configure book numbers, names, and color tags matching your physical SANS course books.

### 2. Adding Entries
* Use `Alt + N` or the entry form to specify the **Book**, **Topic**, **Pages** (e.g. `23-27`, `104`), and optional **Notes** formatted in Markdown.
* Toggle the ⭐ star icon to flag must-know concepts for the exam.

### 3. Using AI Auto-Indexing
* Navigate to the **Auto Index** tab.
* Enter your Gemini API Key and click **Lock**.
* Select your target course book and upload the book's PDF or index excerpt.
* Choose your Gemini model and click **Start Auto-Indexing**. Review the generated entries in the staging table before approving them into your live index.

### 4. Printing for the Exam
* Click **Print Preview** in the top navigation bar.
* Choose your layout:
  * **2-Column Condensed:** Maximum entries per page with inline notes.
  * **Standard Single-Column:** Classic spaced format.
  * **Booklet per Book:** Segregated index books.
* Configure binding offset margins under Print Settings.
* Click **Print Index** (or export directly to PDF using your system's print dialog).

### 5. Reverting to a Previous Version
* In the left sidebar under **Data & Storage**, click **Revert to Previous Version** (or from the Auto-Index header).
* Select any timestamped backup from the list.
* Inspect the **Total Terms** delta, **Entries with Notes** delta, and the per-book comparison table.
* Click **Revert Course to Selected Version**. A pre-revert safety snapshot is automatically created before changes are applied.

### 6. Updating the Application
* If you cloned the repository via Git, simply click **Help $\rightarrow$ Check for Updates...** from the top menu bar.
* The application will inspect GitHub for remote updates, show you the latest release notes, pull the new changes, and restart automatically.

---

## Data Portability & Storage

* **Local Database:** All courses, books, entries, acronyms, and settings are stored locally in `sans_index.json` in the root folder.
* **Automatic Backups:** The app automatically retains up to 100 timestamped database versions inside the `backups/` directory.
* **Portable:** You can copy the application directory onto an encrypted USB drive to take your index directly into high-security or offline study environments.

---

## Credits

* **Auto-Indexer Python Engine:** Auto-indexing algorithms and Python extraction scripts created by [sketch-turner](https://github.com/sketch-turner).
