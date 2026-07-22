// DOM Elements Cache
const elements = {
  // Navigation View Toggles
  sidebarToggleBtn: document.getElementById('sidebar-toggle-btn'),
  mainWorkspace: document.getElementById('main-workspace'),
  sharedTableContainer: document.getElementById('shared-table-container'),

  // Sidebar Controls
  courseSelect: document.getElementById('course-select'),
  addCourseBtn: document.getElementById('add-course-btn'),
  editCourseBtn: document.getElementById('edit-course-btn'),
  deleteCourseBtn: document.getElementById('delete-course-btn'),
  booksList: document.getElementById('books-list'),
  addBookBtn: document.getElementById('add-book-btn'),
  booksSidebarSection: document.getElementById('books-sidebar-section'),
  booksToggleBtn: document.getElementById('books-toggle-btn'),
  
  exportCsvBtn: document.getElementById('export-csv-btn'),
  exportJsonBtn: document.getElementById('export-json-btn'),
  importBtn: document.getElementById('import-btn'),
  lastSaveTime: document.getElementById('last-save-time'),
  
  // Dashboard Header & Stats
  currentCourseTitle: document.getElementById('current-course-title'),
  printCourseTitle: document.getElementById('print-course-title'),
  printDate: document.getElementById('print-date'),
  printTotalCount: document.getElementById('print-total-count'),
  printIndexBtn: document.getElementById('print-index-btn'),
  
  statTotalEntries: document.getElementById('stat-total-entries'),
  statBookCount: document.getElementById('stat-book-count'),
  statLastAdded: document.getElementById('stat-last-added'),
  
  // Entry Form
  entryForm: document.getElementById('entry-form'),
  entryIdInput: document.getElementById('entry-id-input'),
  entryBookSelect: document.getElementById('entry-book-select'),
  entryTopicInput: document.getElementById('entry-topic-input'),
  entryPagesInput: document.getElementById('entry-pages-input'),
  entryNotesInput: document.getElementById('entry-notes-input'),
  saveEntryBtn: document.getElementById('save-entry-btn'),
  cancelEditBtn: document.getElementById('cancel-edit-btn'),
  formActionTitle: document.getElementById('form-action-title'),
  autocompleteList: document.getElementById('autocomplete-list'),
  
  // Table Filters & Search
  tableSearchInput: document.getElementById('table-search-input'),
  filterBookSelect: document.getElementById('filter-book-select'),
  indexTableContainer: document.getElementById('index-table-container'),
  indexTableBody: document.getElementById('index-table-body'),
  tableHeaders: document.querySelectorAll('.index-table th.sortable'),


  
  // Modals & Autocompletes
  courseDialog: document.getElementById('course-dialog'),
  courseDialogTitle: document.getElementById('course-dialog-title'),
  courseDialogForm: document.getElementById('course-dialog-form'),
  dialogCourseId: document.getElementById('dialog-course-id'),
  dialogCourseName: document.getElementById('dialog-course-name'),
  dialogCourseDate: document.getElementById('dialog-course-date'),
  courseAutocompleteList: document.getElementById('course-autocomplete-list'),
  
  bookDialog: document.getElementById('book-dialog'),
  bookDialogTitle: document.getElementById('book-dialog-title'),
  bookDialogForm: document.getElementById('book-dialog-form'),
  dialogBookId: document.getElementById('dialog-book-id'),
  dialogBookName: document.getElementById('dialog-book-name'),
  dialogBookColor: document.getElementById('dialog-book-color'),
  colorPresets: document.querySelectorAll('.color-preset'),
  
  importDialog: document.getElementById('import-dialog'),
  confirmImportBtn: document.getElementById('confirm-import-btn'),
  importJsonFile: document.getElementById('import-json-file'),
  importCsvFile: document.getElementById('import-csv-file'),
  
  // Print Preview
  tableWrapper: document.querySelector('.table-wrapper'),
  printPreviewDialog: document.getElementById('print-preview-dialog'),
  printPreviewPageContainer: document.getElementById('print-preview-page-container'),
  printPreviewConfirmBtn: document.getElementById('print-preview-confirm-btn'),
  printPreviewSavePdfBtn: document.getElementById('print-preview-save-pdf-btn'),
  printFormatSelect: document.getElementById('print-format-select'),
  printOnlyContainer: document.getElementById('print-only-container'),
  printIncludeNotes: document.getElementById('print-include-notes'),

  // Delete confirmation dialog
  deleteConfirmDialog: document.getElementById('delete-confirm-dialog'),
  deleteConfirmOkBtn: document.getElementById('delete-confirm-ok-btn'),
  deleteConfirmCancelBtn: document.getElementById('delete-confirm-cancel-btn'),
  deleteConfirmDontShowAgain: document.getElementById('delete-confirm-dont-show-again'),
  // Multi-delete controls
  selectAllEntriesCheckbox: document.getElementById('select-all-entries-checkbox'),
  multiDeleteBar: document.getElementById('multi-delete-bar'),
  multiDeleteCountText: document.getElementById('multi-delete-count-text'),
  cancelSelectionBtn: document.getElementById('cancel-selection-btn'),
  deleteSelectedBtn: document.getElementById('delete-selected-btn'),

  // Sidebar To-Do
  todoInput: document.getElementById('todo-input'),
  addTodoBtn: document.getElementById('add-todo-btn'),
  todoListActive: document.getElementById('todo-list-active'),
  todoListCompleted: document.getElementById('todo-list-completed'),
  todoCompletedSection: document.getElementById('todo-completed-section'),
  todoSidebarSection: document.getElementById('todo-sidebar-section'),
  todoToggleBtn: document.getElementById('todo-toggle-btn'),
  todoPendingBadge: document.getElementById('todo-pending-badge'),

  // Exam Date Alert Banners & Modal
  examNotificationBanner: document.getElementById('exam-notification-banner'),
  examCautionBanner: document.getElementById('exam-caution-banner'),
  testDateDialog: document.getElementById('test-date-dialog'),
  testDateDialogForm: document.getElementById('test-date-dialog-form'),
  dialogTestDate: document.getElementById('dialog-test-date'),
  clearTestDateBtn: document.getElementById('clear-test-date-btn'),
  dismissForeverBannerBtn: document.querySelector('.dismiss-forever-banner-btn'),
  dismissForeverCautionLink: document.querySelector('.dismiss-forever-caution-link'),
  
  // Workspace Views & Tabs
  manualIndexView: document.getElementById('manual-index-view'),
  autoIndexView: document.getElementById('auto-index-view'),
  notesEditorView: document.getElementById('notes-editor-view'),
  autoIndexNavBtn: document.getElementById('auto-index-nav-btn'),
  manualIndexNavBtn: document.querySelector('.workspace-tabs button[data-view-tab="manual-index"]'),
  notesEditorNavBtn: document.getElementById('notes-editor-nav-btn'),
  
  // Dependency checks
  depPython: document.getElementById('dep-python'),
  depQpdf: document.getElementById('dep-qpdf'),
  depPdftotext: document.getElementById('dep-pdftotext'),
  depOcr: document.getElementById('dep-ocr'),
  depWarnings: document.getElementById('dep-warnings'),
  depInstallConsole: document.getElementById('dep-install-console'),
  depInstallActiveTxt: document.getElementById('dep-install-active-txt'),
  depInstallLogTerminal: document.getElementById('dep-install-log-terminal'),

  // Auto Index Form
  autoIndexForm: document.getElementById('auto-index-form'),
  autoIndexBookSelect: document.getElementById('auto-index-book-select'),
  autoIndexFileArea: document.getElementById('auto-index-file-area'),
  autoIndexFileBtn: document.getElementById('auto-index-file-btn'),
  autoIndexFileName: document.getElementById('auto-index-file-name'),
  autoIndexPassword: document.getElementById('auto-index-password'),
  autoIndexGeminiKey: document.getElementById('auto-index-gemini-key'),
  autoIndexCurationEngine: document.getElementById('auto-index-curation-engine'),
  curationEngineBadge: document.getElementById('curation-engine-badge'),
  curationCardGemini: document.getElementById('curation-card-gemini'),
  curationCardLocal05b: document.getElementById('curation-card-local-0.5b'),
  curationCardLocal15b: document.getElementById('curation-card-local-1.5b'),
  curationCardLocal3b: document.getElementById('curation-card-local-3b'),
  geminiSettingsContainer: document.getElementById('gemini-settings-container'),
  localSlmInfoContainer: document.getElementById('local-slm-info-container'),
  aiCurationOptionsContainer: document.getElementById('ai-curation-options-container'),
  modelDownloadConfirmModal: document.getElementById('model-download-confirm-modal'),
  dlModalModelName: document.getElementById('dl-modal-model-name'),
  dlModalModelDesc: document.getElementById('dl-modal-model-desc'),
  dlModalProgressContainer: document.getElementById('dl-modal-progress-container'),
  dlModalStatusText: document.getElementById('dl-modal-status-text'),
  dlModalLogs: document.getElementById('dl-modal-logs'),
  dlModalStartBtn: document.getElementById('dl-modal-start-btn'),
  dlModalCancelBtn: document.getElementById('dl-modal-cancel-btn'),
  dlModalCloseX: document.getElementById('dl-modal-close-x'),
  localSlmCustomPrompt: document.getElementById('local-slm-custom-prompt'),
  resetLocalPromptBtn: document.getElementById('reset-local-prompt-btn'),
  autoIndexModelSelect: document.getElementById('auto-index-model-select'),
  apiKeyLockBtn: document.getElementById('api-key-lock-btn'),
  apiKeyStatusIcon: document.getElementById('api-key-status-icon'),
  getFreeKeyBtn: document.getElementById('get-free-key-btn'),
  apiKeyGuideModal: document.getElementById('api-key-guide-modal'),
  apiKeyGuideCloseBtn: document.getElementById('api-key-guide-close-btn'),
  apiKeyGuideCloseX: document.getElementById('api-key-guide-close-x'),
  autoIndexUseAi: document.getElementById('auto-index-use-ai'),
  autoIndexDepToggle: document.getElementById('auto-index-dep-toggle'),
  autoIndexDepContent: document.getElementById('auto-index-dep-content'),
  depOverallBadge: document.getElementById('dep-overall-badge'),
  aiCurationErrorAlert: document.getElementById('ai-curation-error-alert'),
  aiCurationErrorText: document.getElementById('ai-curation-error-text'),
  aiCurationRetryBtn: document.getElementById('ai-curation-retry-btn'),
  aiCurationRetryModelSelect: document.getElementById('ai-curation-retry-model-select'),
  aiCurationConfirmModal: document.getElementById('ai-curation-confirm-modal'),
  aiCurationCancelBtn: document.getElementById('ai-curation-cancel-btn'),
  aiCurationContinueBtn: document.getElementById('ai-curation-continue-btn'),
  funFactText: document.getElementById('fun-fact-text'),
  autoIndexFname: document.getElementById('auto-index-fname'),
  autoIndexLname: document.getElementById('auto-index-lname'),
  autoIndexEmail: document.getElementById('auto-index-email'),
  autoIndexSettingsToggle: document.getElementById('auto-index-settings-toggle'),
  autoIndexSettingsContent: document.getElementById('auto-index-settings-content'),
  autoIndexOffset: document.getElementById('auto-index-offset'),
  autoIndexMinLen: document.getElementById('auto-index-min-len'),
  autoIndexMaxLen: document.getElementById('auto-index-max-len'),
  autoIndexZipf: document.getElementById('auto-index-zipf'),
  autoIndexMinFreq: document.getElementById('auto-index-min-freq'),
  autoIndexMaxFreq: document.getElementById('auto-index-max-freq'),
  autoIndexUseOcr: document.getElementById('auto-index-use-ocr'),
  settingsShowAiBadges: document.getElementById('settings-show-ai-badges'),
  settingsConfirmDelete: document.getElementById('settings-confirm-delete'),
  startIndexingBtn: document.getElementById('start-indexing-btn'),

  // Progress
  indexingProgressSection: document.getElementById('indexing-progress-section'),
  indexingProgressStatus: document.getElementById('indexing-progress-status'),
  indexingProgressSubtext: document.getElementById('indexing-progress-subtext'),

  // Verification Preview
  verificationPreviewSection: document.getElementById('verification-preview-section'),
  previewSelectedCount: document.getElementById('preview-selected-count'),
  previewImportCheckedBtn: document.getElementById('preview-import-checked-btn'),
  previewCancelBtn: document.getElementById('preview-cancel-btn'),
  previewSearchInput: document.getElementById('preview-search-input'),
  previewSelectAll: document.getElementById('preview-select-all'),
  previewSelectNone: document.getElementById('preview-select-none'),
  previewTableBody: document.getElementById('preview-table-body'),
  previewHeaderCheckbox: document.getElementById('preview-header-checkbox'),
  quizNewQuestionsToast: document.getElementById('quiz-new-questions-toast'),

  // Practice Quiz Hub & Setup elements
  practiceQuizBtn: document.getElementById('practice-quiz-btn'),
  quizConfigDialog: document.getElementById('quiz-config-dialog'),
  quizConfigForm: document.getElementById('quiz-config-form'),
  quizConfigBooksChecklist: document.getElementById('quiz-config-books-checklist'),
  quizConfigCount: document.getElementById('quiz-config-count'),
  quizConfigDifficulty: document.getElementById('quiz-config-difficulty'),
  quizConfigFeedback: document.getElementById('quiz-config-feedback'),
  quizConfigCloseBtn: document.getElementById('quiz-config-close-btn'),
  
  quizPracticeView: document.getElementById('quiz-practice-view'),
  quizProgressText: document.getElementById('quiz-progress-text'),
  quizProgressFill: document.getElementById('quiz-progress-fill'),
  quizLiveScoreContainer: document.getElementById('quiz-live-score-container'),
  quizLiveScore: document.getElementById('quiz-live-score'),
  quizExitBtn: document.getElementById('quiz-exit-btn'),
  
  quizQuestionContainer: document.getElementById('quiz-question-container'),
  quizQuestionBookBadge: document.getElementById('quiz-question-book-badge'),
  quizQuestionDiffBadge: document.getElementById('quiz-question-diff-badge'),
  quizQuestionText: document.getElementById('quiz-question-text'),
  quizOptionsContainer: document.getElementById('quiz-options-container'),
  
  quizFeedbackPanel: document.getElementById('quiz-feedback-panel'),
  quizFeedbackIndicator: document.getElementById('quiz-feedback-indicator'),
  quizFeedbackIcon: document.getElementById('quiz-feedback-icon'),
  quizFeedbackTitle: document.getElementById('quiz-feedback-title'),
  quizExplanationText: document.getElementById('quiz-explanation-text'),
  quizNextQuestionBtn: document.getElementById('quiz-next-question-btn'),
  
  quizScorecardView: document.getElementById('quiz-scorecard-view'),
  scorecardRatio: document.getElementById('scorecard-ratio'),
  scorecardPercent: document.getElementById('scorecard-percent'),
  scorecardReviewContainer: document.getElementById('scorecard-review-container'),
  scorecardRetryBtn: document.getElementById('scorecard-retry-btn'),
  scorecardCloseBtn: document.getElementById('scorecard-close-btn'),

  autoIndexGenerateQuiz: document.getElementById('auto-index-generate-quiz'),
  quizGenerationSettings: document.getElementById('quiz-generation-settings'),
  autoIndexQuizCount: document.getElementById('auto-index-quiz-count'),
  autoIndexQuizDifficulty: document.getElementById('auto-index-quiz-difficulty'),
  quizGenerationErrorAlert: document.getElementById('quiz-generation-error-alert'),
  quizGenerationErrorText: document.getElementById('quiz-generation-error-text'),

  // Wizard step buttons & progress
  wizardPrevBtn: document.getElementById('wizard-prev-btn'),
  wizardNextBtn: document.getElementById('wizard-next-btn'),
  wizardProgressBar: document.getElementById('wizard-progress-bar'),
  autoIndexAddBookBtn: document.getElementById('auto-index-add-book-btn')
};

// Application State Store
let state = {
  courses: [],
  books: [],
  entries: [],
  todos: [],
  quizzes: [],
  currentCourseId: null
};

// Runtime helpers
let editEntryId = null;
let sortField = 'default'; // Default: custom book order -> topic -> page
let sortAsc = true;
let activeAutocompleteIndex = -1;
let courseAutocompleteIndex = -1;
let bannerTimeoutId = null;
let promptedCourses = new Set();
let pendingDeleteEntryId = null;
let selectedEntryIds = new Set();
let pendingDeleteEntryIds = null;

// Global temporary variables for generated quizzes
let lastGeneratedQuiz = null;
let lastQuizError = null;

// ==========================================================================
// APP INITIALIZATION & SYNC
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Lucide Icons
  lucide.createIcons();
  
  // Load data from Electron Main Process
  const loadedData = await window.api.loadData();
  if (loadedData) {
    state.courses = loadedData.courses || [];
    state.books = loadedData.books || [];
    state.entries = loadedData.entries || [];
    state.todos = loadedData.todos || [];
    state.quizzes = loadedData.quizzes || [];
    
    // Migrate existing entries to compress pages
    let migrated = false;
    state.entries.forEach(entry => {
      if (entry && entry.pages) {
        const compressed = compressPageList(entry.pages);
        if (compressed !== entry.pages) {
          entry.pages = compressed;
          migrated = true;
        }
      }
    });
    if (migrated) {
      saveState();
    }
    
    if (state.courses.length > 0) {
      state.currentCourseId = state.courses[0].id;
    }
  }



  // Bind Event Listeners
  initEventBindings();
  
  // Initialize Notes Text Editor Module
  initNotesEditor();
  
  // Close all custom select dropdown panels when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-panel').forEach(p => {
      p.classList.add('hidden');
    });
  });

  // Convert static print format dropdown to custom select
  makeCustomSelect(elements.printFormatSelect);

  // Initial Render
  renderAll();
  checkExamDateAlerts();
});

// Save state to disk
async function saveState() {
  const result = await window.api.saveData(state);
  if (result && result.success) {
    const now = new Date();
    elements.lastSaveTime.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } else {
    alert("Error saving data locally: " + (result ? result.error : 'Unknown error'));
  }
}

// ==========================================================================
// RENDERING FUNCTIONS (DASHBOARD & SIDEBAR)
// ==========================================================================
function renderAll() {
  renderCourses();
  renderBooks();
  renderEntries();
  renderStats();
  renderTodos();
}

function renderCourses() {
  elements.courseSelect.innerHTML = '';
  
  if (state.courses.length === 0) {
    elements.currentCourseTitle.textContent = "No Active Course";
    elements.printCourseTitle.textContent = "No Active Course";
    return;
  }
  
  state.courses.forEach(course => {
    const option = document.createElement('option');
    option.value = course.id;
    option.textContent = course.name;
    option.selected = (course.id === state.currentCourseId);
    elements.courseSelect.appendChild(option);
  });

  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  if (activeCourse) {
    elements.currentCourseTitle.textContent = activeCourse.name;
    elements.printCourseTitle.textContent = activeCourse.name;
  }
  
  makeCustomSelect(elements.courseSelect);
}

function renderBooks() {
  // Clear lists
  elements.booksList.innerHTML = '';
  elements.entryBookSelect.innerHTML = '<option value="" disabled selected>Select Book</option>';
  elements.filterBookSelect.innerHTML = '<option value="all">All Books</option>';
  elements.autoIndexBookSelect.innerHTML = '<option value="" disabled selected>Select Target Book</option>';
  
  // Filter books for active course
  const activeBooks = state.books.filter(book => book && book.courseId === state.currentCourseId);
  elements.statBookCount.textContent = activeBooks.length;
  
  activeBooks.forEach(book => {
    // 1. Sidebar Book Item (Draggable)
    const bookItem = document.createElement('div');
    bookItem.className = 'book-item';
    bookItem.innerHTML = `
      <div class="book-info">
        <span class="book-color-indicator" style="background-color: ${book.color}"></span>
        <span class="book-title" title="${book.name}">${book.name}</span>
      </div>
      <div class="book-actions">
        <button class="icon-btn-small edit-book" data-id="${book.id}" title="Rename/Color Book">
          <i data-lucide="edit-3"></i>
        </button>
        <button class="icon-btn-small danger delete-book" data-id="${book.id}" title="Delete Book">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    elements.booksList.appendChild(bookItem);
    
    // 2. Entry Form Select Option
    const optionForm = document.createElement('option');
    optionForm.value = book.id;
    optionForm.textContent = book.name;
    elements.entryBookSelect.appendChild(optionForm);
    
    // 3. Table Filter Book Select Option
    const optionFilter = document.createElement('option');
    optionFilter.value = book.id;
    optionFilter.textContent = book.name;
    elements.filterBookSelect.appendChild(optionFilter);

    // 4. Auto Index Target Book Select Option
    const optionAuto = document.createElement('option');
    optionAuto.value = book.id;
    optionAuto.textContent = book.name;
    elements.autoIndexBookSelect.appendChild(optionAuto);
  });
  
  // Re-initialize icons inside books list
  lucide.createIcons({
    attrs: {
      class: 'lucide-icon'
    },
    nameAttr: 'data-lucide',
    nodeList: elements.booksList.querySelectorAll('[data-lucide]')
  });
  
  // Attach book action listeners
  elements.booksList.querySelectorAll('.edit-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bookId = btn.getAttribute('data-id');
      openBookDialog(bookId);
    });
  });
  
  elements.booksList.querySelectorAll('.delete-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bookId = btn.getAttribute('data-id');
      deleteBook(bookId);
    });
  });

  // Enable HTML5 Drag and Drop reordering
  makeBooksDraggable();

  // Convert book selects to custom selects
  makeCustomSelect(elements.entryBookSelect);
  makeCustomSelect(elements.filterBookSelect);
  makeCustomSelect(elements.autoIndexBookSelect);
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderPageBadgesHtml(pagesStr, bookColor) {
  if (!pagesStr) return '';
  const parts = pagesStr.split(',').map(p => p.trim()).filter(p => p.length > 0);
  return parts.map(part => {
    return `<span class="page-badge" style="border-color: ${bookColor}33; background-color: ${bookColor}12; color: ${bookColor};">${escapeHtml(part)}</span>`;
  }).join(' ');
}

let activeSubtaskInputTodoId = null;

function renderTodos() {
  elements.todoListActive.innerHTML = '';
  elements.todoListCompleted.innerHTML = '';
  
  if (!state.currentCourseId) {
    elements.todoListActive.innerHTML = `<li style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 8px;">No active course</li>`;
    elements.todoCompletedSection.classList.add('hidden');
    return;
  }
  
  const courseTodos = state.todos.filter(todo => todo && todo.courseId === state.currentCourseId);
  const activeTodos = courseTodos.filter(todo => !todo.completed);
  const completedTodos = courseTodos.filter(todo => todo.completed);

  // Update pending tasks badge
  if (activeTodos.length > 0) {
    elements.todoPendingBadge.textContent = activeTodos.length;
    elements.todoPendingBadge.classList.remove('hidden');
  } else {
    elements.todoPendingBadge.classList.add('hidden');
  }
  
  // 1. Render Active Tasks
  if (activeTodos.length === 0) {
    elements.todoListActive.innerHTML = `<li style="color: var(--text-muted); font-size: 0.75rem; text-align: center; padding: 8px;">No active tasks. Add one!</li>`;
  } else {
    activeTodos.forEach(todo => {
      const container = document.createElement('li');
      container.className = 'todo-item-container';
      container.setAttribute('data-id', todo.id);
      
      // Main Task Row
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item';
      todoItem.innerHTML = `
        <div class="todo-item-left">
          <div class="todo-drag-handle" title="Drag to Reorder">
            <i data-lucide="grip-vertical"></i>
          </div>
          <input type="checkbox" class="todo-checkbox">
          <span class="todo-text">${escapeHtml(todo.text)}</span>
        </div>
        <div class="todo-actions-right">
          <button class="add-subtask-btn" title="Add Sub-Task">
            <i data-lucide="corner-down-right"></i>
          </button>
          <button class="delete-todo-btn" title="Delete Task">
            <i data-lucide="x"></i>
          </button>
        </div>
      `;
      
      // Bind double-click inline edit
      const todoTextSpan = todoItem.querySelector('.todo-text');
      todoTextSpan.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-edit-input';
        input.value = todo.text;
        input.style.flex = '1';
        input.style.backgroundColor = 'var(--bg-app)';
        input.style.border = '1px solid var(--border-color)';
        input.style.color = 'var(--text-primary)';
        input.style.borderRadius = 'var(--radius-sm)';
        input.style.padding = '2px 6px';
        input.style.fontSize = '0.8rem';
        input.style.outline = 'none';
        
        const saveEdit = () => {
          const newVal = input.value.trim();
          if (newVal) {
            todo.text = newVal;
            saveState();
          }
          renderTodos();
        };
        
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            saveEdit();
          } else if (e.key === 'Escape') {
            renderTodos();
          }
        });
        
        input.addEventListener('blur', saveEdit);
        
        todoTextSpan.replaceWith(input);
        input.focus();
        input.select();
      });
      
      // Bind toggle completed
      const checkbox = todoItem.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => {
        todo.completed = true;
        saveState();
        renderTodos();
      });
      
      // Bind delete todo
      const deleteBtn = todoItem.querySelector('.delete-todo-btn');
      deleteBtn.addEventListener('click', () => {
        state.todos = state.todos.filter(t => t.id !== todo.id);
        saveState();
        renderTodos();
      });
      
      // Bind show subtask input
      const addSubtaskBtn = todoItem.querySelector('.add-subtask-btn');
      addSubtaskBtn.addEventListener('click', () => {
        activeSubtaskInputTodoId = (activeSubtaskInputTodoId === todo.id) ? null : todo.id;
        renderTodos();
      });
      
      container.appendChild(todoItem);
      
      // Render Sub-tasks
      const subtasks = todo.subtasks || [];
      if (subtasks.length > 0) {
        const subList = document.createElement('ul');
        subList.className = 'subtask-list';
        
        subtasks.forEach(sub => {
          const subItem = document.createElement('li');
          subItem.className = 'subtask-item';
          subItem.innerHTML = `
            <div class="todo-item-left">
              <input type="checkbox" class="todo-checkbox" ${sub.completed ? 'checked' : ''}>
              <span class="subtask-text">${escapeHtml(sub.text)}</span>
            </div>
            <button class="delete-todo-btn delete-subtask-btn" title="Delete Sub-Task">
              <i data-lucide="x"></i>
            </button>
          `;
          
          // Bind double-click inline edit
          const subTextSpan = subItem.querySelector('.subtask-text');
          subTextSpan.addEventListener('dblclick', () => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'todo-edit-input';
            input.value = sub.text;
            input.style.flex = '1';
            input.style.backgroundColor = 'var(--bg-app)';
            input.style.border = '1px solid var(--border-color)';
            input.style.color = 'var(--text-primary)';
            input.style.borderRadius = 'var(--radius-sm)';
            input.style.padding = '2px 6px';
            input.style.fontSize = '0.8rem';
            input.style.outline = 'none';
            
            const saveEdit = () => {
              const newVal = input.value.trim();
              if (newVal) {
                sub.text = newVal;
                saveState();
              }
              renderTodos();
            };
            
            input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter') {
                saveEdit();
              } else if (e.key === 'Escape') {
                renderTodos();
              }
            });
            
            input.addEventListener('blur', saveEdit);
            
            subTextSpan.replaceWith(input);
            input.focus();
            input.select();
          });
          
          const subCheckbox = subItem.querySelector('.todo-checkbox');
          subCheckbox.addEventListener('change', () => {
            sub.completed = subCheckbox.checked;
            saveState();
          });
          
          const subDeleteBtn = subItem.querySelector('.delete-subtask-btn');
          subDeleteBtn.addEventListener('click', () => {
            todo.subtasks = todo.subtasks.filter(s => s.id !== sub.id);
            saveState();
            renderTodos();
          });
          
          subList.appendChild(subItem);
        });
        
        container.appendChild(subList);
      }
      
      // Render Inline Subtask Input Form
      if (activeSubtaskInputTodoId === todo.id) {
        const inputContainer = document.createElement('div');
        inputContainer.className = 'subtask-input-container';
        inputContainer.innerHTML = `
          <input type="text" class="subtask-input" placeholder="Add sub-task..." maxlength="100" autofocus>
          <button class="icon-btn-small save-subtask-btn" title="Save Sub-Task">
            <i data-lucide="check"></i>
          </button>
        `;
        
        const subInput = inputContainer.querySelector('.subtask-input');
        const saveSubtask = () => {
          const subText = subInput.value.trim();
          if (!subText) return;
          
          if (!todo.subtasks) todo.subtasks = [];
          todo.subtasks.push({
            id: 'subtodo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            text: subText,
            completed: false
          });
          
          activeSubtaskInputTodoId = null;
          saveState();
          renderTodos();
        };
        
        subInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            saveSubtask();
          }
        });
        
        inputContainer.querySelector('.save-subtask-btn').addEventListener('click', saveSubtask);
        container.appendChild(inputContainer);
      }
      
      elements.todoListActive.appendChild(container);
    });
  }
  
  // 2. Render Completed Tasks
  if (completedTodos.length === 0) {
    elements.todoCompletedSection.classList.add('hidden');
  } else {
    elements.todoCompletedSection.classList.remove('hidden');
    
    completedTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.innerHTML = `
        <div class="todo-item-left">
          <input type="checkbox" class="todo-checkbox" checked>
          <span class="todo-text" style="text-decoration: line-through; color: var(--text-muted);">${escapeHtml(todo.text)}</span>
        </div>
        <button class="delete-todo-btn" title="Delete Task">
          <i data-lucide="x"></i>
        </button>
      `;
      
      // Bind double-click inline edit
      const todoTextSpan = li.querySelector('.todo-text');
      todoTextSpan.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-edit-input';
        input.value = todo.text;
        input.style.flex = '1';
        input.style.backgroundColor = 'var(--bg-app)';
        input.style.border = '1px solid var(--border-color)';
        input.style.color = 'var(--text-primary)';
        input.style.borderRadius = 'var(--radius-sm)';
        input.style.padding = '2px 6px';
        input.style.fontSize = '0.8rem';
        input.style.outline = 'none';
        
        const saveEdit = () => {
          const newVal = input.value.trim();
          if (newVal) {
            todo.text = newVal;
            saveState();
          }
          renderTodos();
        };
        
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            saveEdit();
          } else if (e.key === 'Escape') {
            renderTodos();
          }
        });
        
        input.addEventListener('blur', saveEdit);
        
        todoTextSpan.replaceWith(input);
        input.focus();
        input.select();
      });
      
      // Bind toggle incomplete
      const checkbox = li.querySelector('.todo-checkbox');
      checkbox.addEventListener('change', () => {
        todo.completed = false;
        saveState();
        renderTodos();
      });
      
      // Bind delete todo
      const deleteBtn = li.querySelector('.delete-todo-btn');
      deleteBtn.addEventListener('click', () => {
        state.todos = state.todos.filter(t => t.id !== todo.id);
        saveState();
        renderTodos();
      });
      
      elements.todoListCompleted.appendChild(li);
    });
  }
  
  // Create icons for all elements in both lists
  lucide.createIcons({
    attrs: { class: 'lucide-icon' },
    nameAttr: 'data-lucide',
    nodeList: elements.todoListActive.querySelectorAll('[data-lucide]')
  });
  
  lucide.createIcons({
    attrs: { class: 'lucide-icon' },
    nameAttr: 'data-lucide',
    nodeList: elements.todoListCompleted.querySelectorAll('[data-lucide]')
  });
  
  // Enable Drag-and-Drop on Active Tasks
  makeTodosDraggable();
}

function renderEntries() {
  elements.indexTableBody.innerHTML = '';
  
  // Get active entries
  let activeEntries = state.entries.filter(entry => entry && entry.courseId === state.currentCourseId);
  
  // Apply book filter
  const selectedBookFilter = elements.filterBookSelect.value;
  if (selectedBookFilter !== 'all') {
    activeEntries = activeEntries.filter(entry => entry.bookId === selectedBookFilter);
  }
  
  // Apply Search filter
  const query = elements.tableSearchInput.value.toLowerCase().trim();
  if (query) {
    activeEntries = activeEntries.filter(entry => {
      const book = state.books.find(b => b && b.id === entry.bookId);
      const bookName = book ? book.name.toLowerCase() : '';
      return (
        entry.topic.toLowerCase().includes(query) ||
        (entry.notes && entry.notes.toLowerCase().includes(query)) ||
        isPageMatch(entry.pages, query) ||
        bookName.includes(query)
      );
    });
  }
  
  // Apply Sorting
  sortData(activeEntries);

  elements.printTotalCount.textContent = activeEntries.length;
  
  if (activeEntries.length === 0) {
    elements.indexTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 32px 0;">
          No index entries found. Add your first topic above!
        </td>
      </tr>
    `;
    updateMultiDeleteBarState(activeEntries);
    return;
  }
  
  // Render table rows
  activeEntries.forEach(entry => {
    const book = state.books.find(b => b && b.id === entry.bookId);
    const bookNameFull = book ? book.name : 'Unknown';
    const bookNameShort = bookNameFull.includes(':') ? bookNameFull.split(':')[0].trim() : bookNameFull;
    const bookColor = book ? book.color : '#4b5563';
    
    const tr = document.createElement('tr');
    if (entry.starred) {
      tr.classList.add('starred-row');
    }
    
    if (editEntryId === entry.id) {
      tr.style.backgroundColor = 'rgba(20, 184, 166, 0.08)';
      
      const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);
      const bookOptionsHtml = activeBooks.map(b => 
        `<option value="${b.id}" ${b.id === entry.bookId ? 'selected' : ''}>${b.name.includes(':') ? b.name.split(':')[0].trim() : b.name}</option>`
      ).join('');
      
      tr.innerHTML = `
        <td class="col-select no-print" style="text-align: center;">
          <input type="checkbox" class="select-entry-checkbox" data-id="${entry.id}" ${selectedEntryIds.has(entry.id) ? 'checked' : ''}>
        </td>
        <td class="col-book">
          <select class="inline-edit-input inline-book-select" style="background-color: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; width: 100%;">
            ${bookOptionsHtml}
          </select>
        </td>
        <td class="col-pages">
          <input type="text" class="inline-edit-input inline-pages-input" value="${entry.pages}" style="background-color: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; width: 100%;">
        </td>
        <td class="col-topic">
          <input type="text" class="inline-edit-input inline-topic-input" value="${entry.topic}" style="background-color: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; width: 100%; font-weight: bold;">
        </td>
        <td class="col-notes">
          <div class="inline-notes-wrapper" style="display: flex; flex-direction: column; gap: 4px;">
            <div class="inline-formatting-toolbar" style="display: flex; gap: 4px;">
              <button type="button" class="inline-format-btn" data-format="bold" title="Bold" tabindex="-1" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 2px; display: inline-flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toolbar-icon" style="width: 12px; height: 12px;"><path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8H6z"/></svg>
              </button>
              <button type="button" class="inline-format-btn" data-format="italic" title="Italic" tabindex="-1" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 2px; display: inline-flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toolbar-icon" style="width: 12px; height: 12px;"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
              </button>
              <button type="button" class="inline-format-btn" data-format="underline" title="Underline" tabindex="-1" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 2px; display: inline-flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toolbar-icon" style="width: 12px; height: 12px;"><path d="M6 3v7a6 6 0 0 0 12 0V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>
              </button>
              <button type="button" class="inline-format-btn" data-format="bullet" title="Bullet List" tabindex="-1" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 2px; display: inline-flex; align-items: center; justify-content: center;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="toolbar-icon" style="width: 12px; height: 12px;"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
              </button>
            </div>
            <div contenteditable="true" class="inline-edit-input inline-notes-input notes-textarea-replacement" data-placeholder="Notes" style="background-color: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); padding: 6px 8px; border-radius: 4px; font-size: 0.85rem; width: 100%; min-height: 32px; font-family: inherit; line-height: 1.4; box-sizing: border-box; display: block; outline: none; overflow-y: auto;">${markdownToHtml(entry.notes || '')}</div>
          </div>
        </td>
        <td class="col-actions no-print">
          <button class="icon-btn-small success save-inline-entry" data-id="${entry.id}" title="Save Changes" style="color: var(--accent-light); background: none; border: none; cursor: pointer; padding: 4px;">
            <i data-lucide="check"></i>
          </button>
          <button class="icon-btn-small secondary cancel-inline-entry" data-id="${entry.id}" title="Cancel Edit" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 4px;">
            <i data-lucide="x"></i>
          </button>
        </td>
      `;
    } else {
      // Add row slide-in animation if it's the last added one
      if (state.lastAddedEntryId === entry.id) {
        tr.classList.add('new-row-animation');
        // Clear it after a delay so it doesn't animate on filter/search
        setTimeout(() => {
          tr.classList.remove('new-row-animation');
          state.lastAddedEntryId = null;
        }, 1000);
      }
      
      const starClass = entry.starred ? 'star-active' : 'star-inactive';
      
      if (entry.source === 'auto' || entry.source === 'auto-ai') {
        tr.classList.add('auto-row');
      }
      
      const showAiBadges = localStorage.getItem('show_ai_badges') !== 'false';
      let autoBadgeHtml = '';
      if (showAiBadges) {
        if (entry.source === 'auto-ai') {
          autoBadgeHtml = `
            <span class="auto-badge no-print" style="background: rgba(20, 184, 166, 0.12); border: 1px solid rgba(20, 184, 166, 0.3); color: #2dd4bf; display: inline-flex; align-items: center; gap: 4px; padding: 1px 5px; border-radius: 4px; font-size: 0.68rem; margin-left: 6px; font-weight: 500;" title="Curated by Gemini AI">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width: 10px; height: 10px; color: #2dd4bf;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              <span>AI</span>
            </span>
            <span class="auto-badge-print">[AI]</span>
          `;
        } else if (entry.source === 'auto') {
          autoBadgeHtml = `<span class="auto-badge no-print">Auto</span><span class="auto-badge-print">[Auto]</span>`;
        }
      }
      
      tr.innerHTML = `
        <td class="col-select no-print" style="text-align: center;">
          <input type="checkbox" class="select-entry-checkbox" data-id="${entry.id}" ${selectedEntryIds.has(entry.id) ? 'checked' : ''}>
        </td>
        <td class="col-book">
          <div class="book-badge-container">
            <button class="star-toggle-btn no-print" data-id="${entry.id}" title="${entry.starred ? 'Unstar Entry' : 'Star Entry'}">
              <i data-lucide="star" class="${starClass}"></i>
            </button>
            <span class="book-badge" style="color: ${bookColor}" title="${bookNameFull}">
              <span class="badge-dot" style="background-color: ${bookColor}"></span>
              <span>${bookNameShort}</span>
            </span>
          </div>
        </td>
        <td class="col-pages">${renderPageBadgesHtml(entry.pages, bookColor)}</td>
        <td class="col-topic">${highlightText(entry.topic, query)}${autoBadgeHtml}</td>
        <td class="col-notes">${entry.notes ? highlightText(formatNoteMarkup(entry.notes), query) : ''}</td>
        <td class="col-actions no-print">
          <button class="icon-btn-small edit-entry" data-id="${entry.id}" title="Edit Entry">
            <i data-lucide="edit-3"></i>
          </button>
          <button class="icon-btn-small danger delete-entry" data-id="${entry.id}" title="Delete Entry">
            <i data-lucide="trash-2"></i>
          </button>
        </td>
      `;
    }
    elements.indexTableBody.appendChild(tr);
  });
  
  // Bind action events
  elements.indexTableBody.querySelectorAll('.edit-entry').forEach(btn => {
    btn.addEventListener('click', () => {
      const entryId = btn.getAttribute('data-id');
      startEditEntry(entryId);
    });
  });
  
  elements.indexTableBody.querySelectorAll('.delete-entry').forEach(btn => {
    btn.addEventListener('click', () => {
      const entryId = btn.getAttribute('data-id');
      deleteEntry(entryId);
    });
  });

  elements.indexTableBody.querySelectorAll('.star-toggle-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const entryId = btn.getAttribute('data-id');
      toggleStarEntry(entryId);
    });
  });

  elements.indexTableBody.querySelectorAll('.save-inline-entry').forEach(btn => {
    btn.addEventListener('click', () => {
      const entryId = btn.getAttribute('data-id');
      saveInlineEntry(entryId, btn.closest('tr'));
    });
  });

  elements.indexTableBody.querySelectorAll('.cancel-inline-entry').forEach(btn => {
    btn.addEventListener('click', () => {
      editEntryId = null;
      renderEntries();
    });
  });

  // Bind select checkbox change events
  elements.indexTableBody.querySelectorAll('.select-entry-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const entryId = cb.getAttribute('data-id');
      if (cb.checked) {
        selectedEntryIds.add(entryId);
      } else {
        selectedEntryIds.delete(entryId);
      }
      updateMultiDeleteBarState(activeEntries);
    });
  });

  // Bind inline keyboard events
  const inlineEditingRow = elements.indexTableBody.querySelector('tr[style*="rgba(20, 184, 166"]');
  if (inlineEditingRow) {
    const inlineSelect = inlineEditingRow.querySelector('.inline-book-select');
    if (inlineSelect) {
      makeCustomSelect(inlineSelect);
    }

    inlineEditingRow.querySelectorAll('.inline-edit-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (input.classList.contains('inline-notes-input') && e.shiftKey) {
            return;
          }
          e.preventDefault();
          const entryId = inlineEditingRow.querySelector('.save-inline-entry').getAttribute('data-id');
          saveInlineEntry(entryId, inlineEditingRow);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          editEntryId = null;
          renderEntries();
        }
      });
    });
    // Auto-size and auto-focus the inputs when inline editing starts
    const inlineNotesInput = inlineEditingRow.querySelector('.inline-notes-input');
    if (inlineNotesInput) {
      // Bind contenteditable active state tracking for inline notes
      inlineNotesInput.addEventListener('keyup', () => updateFormatButtonsActiveStates(inlineEditingRow));
      inlineNotesInput.addEventListener('mouseup', () => updateFormatButtonsActiveStates(inlineEditingRow));
      inlineNotesInput.addEventListener('click', () => updateFormatButtonsActiveStates(inlineEditingRow));

      // Click listeners for inline formatting toolbar buttons
      inlineEditingRow.querySelectorAll('.inline-format-btn').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
          e.preventDefault(); // Prevents selection loss
        });
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const format = btn.getAttribute('data-format');
          applyFormatting(inlineNotesInput, format);
          updateFormatButtonsActiveStates(inlineEditingRow);
        });
      });

      // Bind keydown hotkeys for inline notes textarea
      inlineNotesInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
          const key = e.key.toLowerCase();
          if (['b', 'i', 'u'].includes(key)) {
            e.preventDefault();
            const formatMap = { b: 'bold', i: 'italic', u: 'underline' };
            applyFormatting(inlineNotesInput, formatMap[key]);
            updateFormatButtonsActiveStates(inlineEditingRow);
          }
        }
      });
    }

    const inlineTopicInput = inlineEditingRow.querySelector('.inline-topic-input');
    if (inlineTopicInput) inlineTopicInput.focus();
  }
  
  // Re-render icons
  lucide.createIcons({
    attrs: {
      class: 'lucide-icon'
    },
    nameAttr: 'data-lucide',
    nodeList: elements.indexTableBody.querySelectorAll('[data-lucide]')
  });

  updateMultiDeleteBarState(activeEntries);
}

function updateMultiDeleteBarState(activeEntries) {
  if (!activeEntries) {
    let currentActive = state.entries.filter(entry => entry && entry.courseId === state.currentCourseId);
    const selectedBookFilter = elements.filterBookSelect.value;
    if (selectedBookFilter !== 'all') {
      currentActive = currentActive.filter(entry => entry.bookId === selectedBookFilter);
    }
    const query = elements.tableSearchInput.value.toLowerCase().trim();
    if (query) {
      currentActive = currentActive.filter(entry => {
        const book = state.books.find(b => b && b.id === entry.bookId);
        const bookName = book ? book.name.toLowerCase() : '';
        return (
          entry.topic.toLowerCase().includes(query) ||
          (entry.notes && entry.notes.toLowerCase().includes(query)) ||
          isPageMatch(entry.pages, query) ||
          bookName.includes(query)
        );
      });
    }
    activeEntries = currentActive;
  }

  const visibleCheckedCount = activeEntries.filter(e => selectedEntryIds.has(e.id)).length;
  const allChecked = activeEntries.length > 0 && visibleCheckedCount === activeEntries.length;
  const someChecked = visibleCheckedCount > 0 && visibleCheckedCount < activeEntries.length;
  
  if (elements.selectAllEntriesCheckbox) {
    elements.selectAllEntriesCheckbox.checked = allChecked;
    elements.selectAllEntriesCheckbox.indeterminate = someChecked;
    elements.selectAllEntriesCheckbox.disabled = activeEntries.length === 0;
  }
  
  if (elements.multiDeleteBar && elements.multiDeleteCountText) {
    if (selectedEntryIds.size > 0) {
      elements.multiDeleteBar.style.display = 'flex';
      elements.multiDeleteCountText.textContent = `${selectedEntryIds.size} item${selectedEntryIds.size === 1 ? '' : 's'} selected`;
    } else {
      elements.multiDeleteBar.style.display = 'none';
    }
  }
}

function toggleStarEntry(entryId) {
  const entry = state.entries.find(e => e.id === entryId);
  if (entry) {
    entry.starred = !entry.starred;
    saveState();
    renderEntries();
  }
}

function saveInlineEntry(entryId, rowElement) {
  const bookId = rowElement.querySelector('.inline-book-select').value;
  const topic = rowElement.querySelector('.inline-topic-input').value.trim();
  const pages = rowElement.querySelector('.inline-pages-input').value.trim();
  const notes = htmlToMarkdown(rowElement.querySelector('.inline-notes-input').innerHTML).trim();

  if (!bookId) {
    alert("Please select a book first!");
    return;
  }
  
  if (!topic || !pages) {
    alert("Topic and Pages are required!");
    return;
  }

  const validation = parseAndValidatePages(pages);
  if (!validation.isValid) {
    alert(validation.error);
    rowElement.querySelector('.inline-pages-input').focus();
    return;
  }
  const formattedPages = validation.formatted;

  const entry = state.entries.find(e => e.id === entryId);
  if (entry) {
    entry.bookId = bookId;
    entry.topic = topic;
    entry.pages = formattedPages;
    entry.notes = notes;
  }

  editEntryId = null;
  saveState();
  renderEntries();
  renderStats();
}

function triggerStatPulse(cardElement) {
  if (!cardElement) return;
  cardElement.classList.remove('updated-pulse');
  void cardElement.offsetWidth; // Force CSS reflow to restart animation
  cardElement.classList.add('updated-pulse');
}

function renderStats() {
  const activeEntries = state.entries.filter(entry => entry && entry.courseId === state.currentCourseId);
  elements.statTotalEntries.textContent = activeEntries.length;
  
  if (activeEntries.length > 0) {
    const sortedByCreated = [...activeEntries].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
    elements.statLastAdded.textContent = sortedByCreated[0].topic;
    elements.statLastAdded.title = sortedByCreated[0].topic;
  } else {
    elements.statLastAdded.textContent = "-";
    elements.statLastAdded.title = "";
  }

  // Update Countdown vs. Indexed Books stats card
  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  const statCard = elements.statBookCount.closest('.stat-card');
  const statLabel = statCard.querySelector('.stat-label');
  
  if (activeCourse && activeCourse.testDate) {
    const examDate = new Date(activeCourse.testDate + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = examDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      elements.statBookCount.textContent = "Passed";
      statLabel.innerHTML = `Exam Date (${activeCourse.testDate}) <span class="adjust-date-link no-print" style="display: block; font-size: 0.7rem; color: var(--accent-light); text-decoration: underline; margin-top: 4px;">Adjust Date</span>`;
    } else {
      elements.statBookCount.textContent = diffDays;
      statLabel.innerHTML = `${diffDays === 1 ? "Day Until Exam" : "Days Until Exam"} <span class="adjust-date-link no-print" style="display: block; font-size: 0.7rem; color: var(--accent-light); text-decoration: underline; margin-top: 4px;">Adjust Date</span>`;
    }
    statCard.style.cursor = 'pointer';
    statCard.title = `Projected exam date: ${activeCourse.testDate}. Click to modify or remove.`;
  } else {
    // Default back to Indexed Books
    const activeBooks = state.books.filter(book => book && book.courseId === state.currentCourseId);
    elements.statBookCount.textContent = activeBooks.length;
    
    if (activeCourse && activeCourse.dismissExamAlert) {
      statLabel.textContent = "Indexed Books";
      statCard.style.cursor = "default";
      statCard.title = "";
    } else {
      statLabel.innerHTML = `Indexed Books <span class="adjust-date-link no-print" style="display: block; font-size: 0.7rem; color: var(--accent-light); text-decoration: underline; margin-top: 4px;">Configure Date</span>`;
      statCard.style.cursor = 'pointer';
      statCard.title = "No exam date configured. Click to set countdown date!";
    }
  }
}

// Utility to highlight search matches (HTML-tag-safe)
function highlightText(htmlText, query) {
  if (!query) return htmlText;
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  
  // Split by HTML tags to prevent highlighting inside element properties
  const parts = htmlText.split(/(<[^>]+>)/g);
  const highlightedParts = parts.map((part, index) => {
    if (index % 2 === 0) {
      return part.replace(regex, '<mark style="background-color: rgba(20, 184, 166, 0.3); color: #fff; border-radius: 2px; padding: 0 2px;">$1</mark>');
    }
    return part;
  });
  
  return highlightedParts.join('');
}

function formatNoteMarkup(text) {
  if (!text) return '';
  
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Convert newlines to breaks
  escaped = escaped.replace(/\n/g, '<br>');
  
  // 1. Highlight: ==text==
  escaped = escaped.replace(/==(.*?)==/g, '<span class="note-highlight">$1</span>');
  
  // 2. Bold: **text**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 3. Underline: __text__
  escaped = escaped.replace(/__(.*?)__/g, '<u>$1</u>');
  
  // 4. Italics: *text*
  escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert lines starting with "- " or "* " to styled bullets with a bit of indentation
  const lines = escaped.split('<br>');
  const processed = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      return `<div class="published-bullet-item"><span class="bullet-dot">•</span><span class="bullet-content">${trimmed.substring(2)}</span></div>`;
    } else if (trimmed.startsWith('* ')) {
      return `<div class="published-bullet-item"><span class="bullet-dot">•</span><span class="bullet-content">${trimmed.substring(2)}</span></div>`;
    }
    return line;
  });
  
  // Join back, skipping breaks between consecutive list items
  let joined = '';
  for (let i = 0; i < processed.length; i++) {
    if (i > 0) {
      const prevIsBullet = processed[i-1].startsWith('<div class="published-bullet-item"');
      const curIsBullet = processed[i].startsWith('<div class="published-bullet-item"');
      if (prevIsBullet && curIsBullet) {
        joined += ''; // No break between bullets
      } else {
        joined += '<br>';
      }
    }
    joined += processed[i];
  }
  escaped = joined;
  
  return escaped;
}

// ==========================================================================
// DRAG AND DROP REORDERING FOR BOOKS
// ==========================================================================
function makeBooksDraggable() {
  const bookItems = elements.booksList.querySelectorAll('.book-item');
  let draggedBookId = null;
  
  bookItems.forEach(item => {
    const editBtn = item.querySelector('.edit-book');
    if (!editBtn) return;
    const bookId = editBtn.getAttribute('data-id');
    
    item.setAttribute('draggable', 'true');
    
    item.addEventListener('dragstart', (e) => {
      draggedBookId = bookId;
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', bookId);
    });
    
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const bounding = item.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      if (offset > bounding.height / 2) {
        item.style.borderBottom = '2px solid var(--accent-light)';
        item.style.borderTop = '';
      } else {
        item.style.borderTop = '2px solid var(--accent-light)';
        item.style.borderBottom = '';
      }
    });
    
    item.addEventListener('dragleave', () => {
      item.style.borderTop = '';
      item.style.borderBottom = '';
    });
    
    item.addEventListener('drop', (e) => {
      e.preventDefault();
      item.style.borderTop = '';
      item.style.borderBottom = '';
      
      const targetBookId = bookId;
      if (draggedBookId === targetBookId) return;
      
      const draggedIndex = state.books.findIndex(b => b.id === draggedBookId);
      const targetIndex = state.books.findIndex(b => b.id === targetBookId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedBook] = state.books.splice(draggedIndex, 1);
        let newTargetIndex = state.books.findIndex(b => b.id === targetBookId);
        
        const bounding = item.getBoundingClientRect();
        const offset = e.clientY - bounding.top;
        if (offset > bounding.height / 2) {
          state.books.splice(newTargetIndex + 1, 0, draggedBook);
        } else {
          state.books.splice(newTargetIndex, 0, draggedBook);
        }
        
        saveState();
        renderAll();
      }
    });
    
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
      bookItems.forEach(i => {
        i.style.borderTop = '';
        i.style.borderBottom = '';
      });
    });
  });
}

function makeTodosDraggable() {
  const todoContainers = elements.todoListActive.querySelectorAll('.todo-item-container');
  let draggedTodoId = null;
  
  todoContainers.forEach(container => {
    const todoId = container.getAttribute('data-id');
    container.setAttribute('draggable', 'true');
    
    let canDrag = false;
    
    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.todo-drag-handle')) {
        canDrag = true;
      } else {
        canDrag = false;
      }
    });
    
    container.addEventListener('dragstart', (e) => {
      if (!canDrag) {
        e.preventDefault();
        return;
      }
      draggedTodoId = todoId;
      container.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', todoId);
    });
    
    container.addEventListener('dragend', () => {
      container.classList.remove('dragging');
      todoContainers.forEach(c => {
        c.style.borderTop = '';
        c.style.borderBottom = '';
      });
    });
    
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const bounding = container.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      if (offset > bounding.height / 2) {
        container.style.borderBottom = '2px solid var(--accent-light)';
        container.style.borderTop = '';
      } else {
        container.style.borderTop = '2px solid var(--accent-light)';
        container.style.borderBottom = '';
      }
    });
    
    container.addEventListener('dragleave', () => {
      container.style.borderTop = '';
      container.style.borderBottom = '';
    });
    
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.style.borderTop = '';
      container.style.borderBottom = '';
      
      const targetTodoId = todoId;
      if (draggedTodoId === targetTodoId) return;
      
      const draggedIndex = state.todos.findIndex(t => t.id === draggedTodoId);
      const targetIndex = state.todos.findIndex(t => t.id === targetTodoId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [draggedTodo] = state.todos.splice(draggedIndex, 1);
        let newTargetIndex = state.todos.findIndex(t => t.id === targetTodoId);
        
        const bounding = container.getBoundingClientRect();
        const offset = e.clientY - bounding.top;
        if (offset > bounding.height / 2) {
          state.todos.splice(newTargetIndex + 1, 0, draggedTodo);
        } else {
          state.todos.splice(newTargetIndex, 0, draggedTodo);
        }
        
        saveState();
        renderTodos();
      }
    });
  });
}

// ==========================================================================
// HIERARCHICAL DATA SORTING ALGORITHMS
// ==========================================================================
function compareBooks(bookIdA, bookIdB) {
  const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);
  const indexA = activeBooks.findIndex(b => b.id === bookIdA);
  const indexB = activeBooks.findIndex(b => b.id === bookIdB);
  const valA = indexA === -1 ? 9999 : indexA;
  const valB = indexB === -1 ? 9999 : indexB;
  return valA - valB;
}

function compareByDefault(a, b) {
  const bookComp = compareBooks(a.bookId, b.bookId);
  if (bookComp !== 0) return bookComp;
  
  const pageComp = comparePages(a.pages, b.pages);
  if (pageComp !== 0) return pageComp;
  
  const topicComp = a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true });
  if (topicComp !== 0) return topicComp;
  
  const notesA = a.notes || '';
  const notesB = b.notes || '';
  return notesA.localeCompare(notesB, undefined, { sensitivity: 'base' });
}

function comparePages(pageStrA, pageStrB) {
  const strA = pageStrA || '';
  const strB = pageStrB || '';
  
  const parsePage = (str) => {
    if (!str) return 0;
    const match = str.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };
  
  const numA = parsePage(strA);
  const numB = parsePage(strB);
  
  if (numA !== numB) {
    return numA - numB;
  }
  
  return strA.localeCompare(strB, undefined, { numeric: true });
}

function sortData(entries) {
  entries.sort((a, b) => {
    let comparison = 0;
    
    if (sortField === 'default') {
      comparison = compareByDefault(a, b);
    } else if (sortField === 'topic') {
      comparison = a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true });
      if (comparison === 0) {
        comparison = compareBooks(a.bookId, b.bookId);
        if (comparison === 0) {
          comparison = comparePages(a.pages, b.pages);
          if (comparison === 0) {
            const notesA = a.notes || '';
            const notesB = b.notes || '';
            comparison = notesA.localeCompare(notesB, undefined, { sensitivity: 'base' });
          }
        }
      }
    } else if (sortField === 'notes') {
      const notesA = a.notes || '';
      const notesB = b.notes || '';
      comparison = notesA.localeCompare(notesB, undefined, { sensitivity: 'base' });
      if (comparison === 0) {
        comparison = compareBooks(a.bookId, b.bookId);
        if (comparison === 0) {
          comparison = comparePages(a.pages, b.pages);
          if (comparison === 0) {
            comparison = a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true });
          }
        }
      }
    } else if (sortField === 'pages') {
      comparison = comparePages(a.pages, b.pages);
      if (comparison === 0) {
        comparison = compareBooks(a.bookId, b.bookId);
        if (comparison === 0) {
          comparison = a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true });
          if (comparison === 0) {
            const notesA = a.notes || '';
            const notesB = b.notes || '';
            comparison = notesA.localeCompare(notesB, undefined, { sensitivity: 'base' });
          }
        }
      }
    } else if (sortField === 'book') {
      comparison = compareBooks(a.bookId, b.bookId);
      if (comparison === 0) {
        comparison = comparePages(a.pages, b.pages);
        if (comparison === 0) {
          comparison = a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true });
          if (comparison === 0) {
            const notesA = a.notes || '';
            const notesB = b.notes || '';
            comparison = notesA.localeCompare(notesB, undefined, { sensitivity: 'base' });
          }
        }
      }
    }
    
    return sortAsc ? comparison : -comparison;
  });
}

// ==========================================================================
// COURSE MANAGEMENT ACTIONS
// ==========================================================================
function openCourseDialog(courseId = null) {
  closeCourseAutocomplete();
  if (courseId) {
    const course = state.courses.find(c => c.id === courseId);
    if (!course) return;
    elements.courseDialogTitle.textContent = "Edit Course";
    elements.dialogCourseId.value = course.id;
    elements.dialogCourseName.value = course.name;
    elements.dialogCourseDate.value = course.testDate || "";
  } else {
    elements.courseDialogTitle.textContent = "Create New Course";
    elements.dialogCourseId.value = "";
    elements.dialogCourseName.value = "";
    elements.dialogCourseDate.value = "";
  }
  elements.courseDialog.showModal();
  elements.dialogCourseName.focus();
}

function handleCourseDialogSubmit(e) {
  e.preventDefault();
  const id = elements.dialogCourseId.value.trim();
  const name = elements.dialogCourseName.value.trim();
  const selectedDate = elements.dialogCourseDate.value;
  
  if (id) {
    // Edit Mode
    const course = state.courses.find(c => c.id === id);
    if (course) {
      const oldDate = course.testDate;
      course.name = name;
      if (selectedDate) {
        course.testDate = selectedDate;
      } else {
        delete course.testDate;
      }
      // If date changed, reset dismiss alert state
      if (oldDate !== selectedDate) {
        delete course.dismissExamAlert;
      }
    }
  } else {
    // Add Mode (Uses SANS Catalog ID if matched, or generic date ID)
    let newId = 'course-' + Date.now();
    
    // Check if name matches a SANS Catalog code prefix (e.g. "SEC565: ...")
    const matchedCatalog = SANS_CATALOG.find(c => name.startsWith(c.code));
    if (matchedCatalog) {
      newId = matchedCatalog.id;
    }

    // Prevent duplicate course IDs
    if (state.courses.some(c => c.id === newId)) {
      alert("A course with this code or catalog reference is already active!");
      return;
    }

    const newCourse = { id: newId, name };
    if (selectedDate) {
      newCourse.testDate = selectedDate;
    }
    state.courses.push(newCourse);
    
    // Auto-populate default books if catalog matched
    if (matchedCatalog && matchedCatalog.books) {
      matchedCatalog.books.forEach((b, index) => {
        state.books.push({
          id: `book-${newId}-${index + 1}-${Date.now()}`,
          courseId: newId,
          name: b.name,
          color: b.color
        });
      });
    }

    state.currentCourseId = newId; // Auto-select new course
  }
  
  saveState();
  renderAll();
  checkExamDateAlerts();
  elements.courseDialog.close();
}

function deleteCourse() {
  if (state.courses.length === 0) return;
  const course = state.courses.find(c => c.id === state.currentCourseId);
  if (!course) return;
  
  const confirmMsg = `Are you absolutely sure you want to delete "${course.name}"?\nThis will permanently delete all books and index entries associated with this course.`;
  if (confirm(confirmMsg)) {
    // 1. Delete entries
    state.entries = state.entries.filter(e => e && e.courseId !== course.id);
    // 2. Delete books
    state.books = state.books.filter(b => b && b.courseId !== course.id);
    // 3. Delete course
    state.courses = state.courses.filter(c => c && c.id !== course.id);
    
    // Select another course if available
    if (state.courses.length > 0) {
      state.currentCourseId = state.courses[0].id;
    } else {
      state.currentCourseId = null;
    }
    
    selectedEntryIds.clear();
    saveState();
    renderAll();
    checkExamDateAlerts();
  }
}

// ==========================================================================
// EXAM COUNTDOWN MANAGEMENT
// ==========================================================================
function checkExamDateAlerts() {
  if (bannerTimeoutId) {
    clearTimeout(bannerTimeoutId);
    bannerTimeoutId = null;
  }

  // Hide banners by default
  elements.examNotificationBanner.classList.add('hidden');
  elements.examCautionBanner.classList.add('hidden');

  if (!state.currentCourseId) return;

  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  if (!activeCourse) return;

  if (activeCourse.testDate || activeCourse.dismissExamAlert) {
    // Exam date is set or user dismissed alerts: no banners needed
    return;
  }

  // Exam date is missing
  if (!promptedCourses.has(state.currentCourseId)) {
    elements.examNotificationBanner.classList.remove('hidden');
    promptedCourses.add(state.currentCourseId);
    
    // Auto fade-out after 15 seconds
    bannerTimeoutId = setTimeout(() => {
      elements.examNotificationBanner.classList.add('hidden');
      elements.examCautionBanner.classList.remove('hidden');
    }, 15000);
  } else {
    // Already prompted in this session, show caution banner directly
    elements.examCautionBanner.classList.remove('hidden');
  }
}

function dismissExamAlertsForever() {
  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  if (activeCourse) {
    activeCourse.dismissExamAlert = true;
    saveState();
    
    if (bannerTimeoutId) {
      clearTimeout(bannerTimeoutId);
      bannerTimeoutId = null;
    }
    elements.examNotificationBanner.classList.add('hidden');
    elements.examCautionBanner.classList.add('hidden');
    
    renderStats();
  }
}

function openTestDateDialog() {
  if (!state.currentCourseId) {
    alert("Please select or create a course first!");
    return;
  }
  
  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  if (!activeCourse) return;

  if (activeCourse.testDate) {
    elements.dialogTestDate.value = activeCourse.testDate;
    elements.clearTestDateBtn.classList.remove('hidden');
  } else {
    elements.dialogTestDate.value = '';
    elements.clearTestDateBtn.classList.add('hidden');
  }

  elements.testDateDialog.showModal();
}

function handleTestDateDialogSubmit(e) {
  e.preventDefault();
  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  if (activeCourse) {
    activeCourse.testDate = elements.dialogTestDate.value;
    saveState();
    elements.testDateDialog.close();
    
    // Clear and hide active banners
    if (bannerTimeoutId) {
      clearTimeout(bannerTimeoutId);
      bannerTimeoutId = null;
    }
    elements.examNotificationBanner.classList.add('hidden');
    elements.examCautionBanner.classList.add('hidden');
    
    renderAll();
  }
}

// ==========================================================================
// CUSTOM STYLED SELECT DROPDOWNS CONTROLLER
// ==========================================================================
function makeCustomSelect(selectElement) {
  if (!selectElement) return;
  
  if (selectElement.__customSelect) {
    syncCustomSelect(selectElement);
    return;
  }
  
  selectElement.style.display = 'none';
  
  const container = document.createElement('div');
  container.className = 'custom-select-container';
  if (selectElement.classList.contains('flex-1')) {
    container.classList.add('flex-1');
  }
  
  const trigger = document.createElement('div');
  trigger.className = 'custom-select-trigger';
  
  // Style match properties from native select
  trigger.style.backgroundColor = selectElement.style.backgroundColor || 'var(--bg-app)';
  trigger.style.border = selectElement.style.border || '1px solid var(--border-color)';
  trigger.style.color = selectElement.style.color || 'var(--text-primary)';
  trigger.style.borderRadius = selectElement.style.borderRadius || 'var(--radius-sm)';
  trigger.style.fontSize = selectElement.style.fontSize || '0.85rem';
  trigger.style.padding = selectElement.style.padding || '8px 12px';
  trigger.style.height = selectElement.style.height || '38px';
  trigger.style.minHeight = selectElement.style.minHeight || 'auto';
  trigger.style.width = '100%';
  
  const triggerText = document.createElement('span');
  triggerText.className = 'custom-select-trigger-text';
  
  const chevron = document.createElement('i');
  chevron.setAttribute('data-lucide', 'chevron-down');
  chevron.className = 'custom-select-chevron';
  
  trigger.appendChild(triggerText);
  trigger.appendChild(chevron);
  
  const panel = document.createElement('div');
  panel.className = 'custom-select-panel hidden no-print';
  
  container.appendChild(trigger);
  container.appendChild(panel);
  
  selectElement.parentNode.insertBefore(container, selectElement.nextSibling);
  
  selectElement.__customSelect = {
    container,
    trigger,
    triggerText,
    panel
  };
  
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelectorAll('.custom-select-panel').forEach(p => {
      if (p !== panel) p.classList.add('hidden');
    });
    panel.classList.toggle('hidden');
  });
  
  selectElement.addEventListener('change', () => {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    triggerText.textContent = selectedOption ? selectedOption.text : '';
    
    panel.querySelectorAll('.custom-select-option').forEach((item, idx) => {
      const opt = selectElement.options[idx];
      if (opt) {
        if (opt.selected) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      }
    });
  });
  
  syncCustomSelect(selectElement);
}

function syncCustomSelect(selectElement) {
  const custom = selectElement.__customSelect;
  if (!custom) return;
  
  const { triggerText, panel } = custom;
  panel.innerHTML = '';
  
  const options = Array.from(selectElement.options);
  const selectedOption = selectElement.options[selectElement.selectedIndex];
  triggerText.textContent = selectedOption ? selectedOption.text : '';
  
  options.forEach((opt) => {
    const item = document.createElement('div');
    item.className = 'custom-select-option';
    if (opt.disabled) {
      item.classList.add('disabled');
    }
    if (opt.selected) {
      item.classList.add('selected');
    }
    item.textContent = opt.text;
    
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      if (opt.disabled) return;
      
      selectElement.value = opt.value;
      selectElement.dispatchEvent(new Event('change'));
      panel.classList.add('hidden');
    });
    
    panel.appendChild(item);
  });
  
  lucide.createIcons({
    attrs: { class: 'lucide-icon' },
    nameAttr: 'data-lucide',
    nodeList: custom.container.querySelectorAll('[data-lucide]')
  });
}

// ==========================================================================
// COURSE DIALOG AUTOCOMPLETE CATALOG SUGGESTIONS
// ==========================================================================
function showCourseAutocomplete(val) {
  closeCourseAutocomplete();
  if (!val) return;
  
  // Filter SANS catalog based on input
  const query = val.toLowerCase();
  const matches = SANS_CATALOG.filter(c => 
    c.code.toLowerCase().includes(query) ||
    c.cert.toLowerCase().includes(query) ||
    c.name.toLowerCase().includes(query)
  ).slice(0, 5); // Limit 5 matches
  
  if (matches.length === 0) return;
  
  courseAutocompleteIndex = -1;
  elements.courseAutocompleteList.innerHTML = '';
  elements.courseAutocompleteList.classList.remove('hidden');
  
  matches.forEach((match, index) => {
    const item = document.createElement('div');
    item.textContent = match.name;
    item.addEventListener('click', () => {
      elements.dialogCourseName.value = match.name;
      closeCourseAutocomplete();
    });
    elements.courseAutocompleteList.appendChild(item);
  });
}

function closeCourseAutocomplete() {
  elements.courseAutocompleteList.innerHTML = '';
  elements.courseAutocompleteList.classList.add('hidden');
  courseAutocompleteIndex = -1;
}

function handleCourseAutocompleteKeys(e) {
  const listItems = elements.courseAutocompleteList.querySelectorAll('div');
  if (listItems.length === 0) return;
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    courseAutocompleteIndex++;
    if (courseAutocompleteIndex >= listItems.length) courseAutocompleteIndex = 0;
    updateActiveCourseAutocompleteRow(listItems);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    courseAutocompleteIndex--;
    if (courseAutocompleteIndex < 0) courseAutocompleteIndex = listItems.length - 1;
    updateActiveCourseAutocompleteRow(listItems);
  } else if (e.key === 'Enter') {
    if (courseAutocompleteIndex > -1) {
      e.preventDefault();
      listItems[courseAutocompleteIndex].click();
    }
  } else if (e.key === 'Escape') {
    closeCourseAutocomplete();
  }
}

function updateActiveCourseAutocompleteRow(items) {
  items.forEach(item => item.classList.remove('autocomplete-active'));
  if (courseAutocompleteIndex > -1) {
    items[courseAutocompleteIndex].classList.add('autocomplete-active');
    items[courseAutocompleteIndex].scrollIntoView({ block: 'nearest' });
  }
}

// ==========================================================================
// BOOK MANAGEMENT ACTIONS
// ==========================================================================
function openBookDialog(bookId = null) {
  elements.colorPresets.forEach(preset => preset.classList.remove('selected'));

  if (bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;
    elements.bookDialogTitle.textContent = "Edit Book";
    elements.dialogBookId.value = book.id;
    elements.dialogBookName.value = book.name;
    elements.dialogBookColor.value = book.color;
    
    elements.colorPresets.forEach(preset => {
      if (preset.getAttribute('data-color').toLowerCase() === book.color.toLowerCase()) {
        preset.classList.add('selected');
      }
    });
  } else {
    elements.bookDialogTitle.textContent = "Add New Book";
    elements.dialogBookId.value = "";
    
    const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);
    elements.dialogBookName.value = `Book ${activeBooks.length + 1}`;
    
    const defaultColor = "#0d9488";
    elements.dialogBookColor.value = defaultColor;
    elements.colorPresets.forEach(preset => {
      if (preset.getAttribute('data-color') === defaultColor) {
        preset.classList.add('selected');
      }
    });
  }
  elements.bookDialog.showModal();
  elements.dialogBookName.focus();
}

function handleBookDialogSubmit(e) {
  e.preventDefault();
  const id = elements.dialogBookId.value.trim();
  const name = elements.dialogBookName.value.trim();
  const color = elements.dialogBookColor.value;
  
  if (id) {
    // Edit mode
    const book = state.books.find(b => b.id === id);
    if (book) {
      book.name = name;
      book.color = color;
    }
  } else {
    // Add mode
    const newId = 'book-' + Date.now();
    state.books.push({
      id: newId,
      courseId: state.currentCourseId,
      name,
      color
    });
  }
  
  saveState();
  renderAll();
  elements.bookDialog.close();
}

function deleteBook(bookId) {
  const book = state.books.find(b => b.id === bookId);
  if (!book) return;
  
  const entriesCount = state.entries.filter(e => e && e.bookId === bookId).length;
  let confirmMsg = `Are you sure you want to delete "${book.name}"?`;
  if (entriesCount > 0) {
    confirmMsg += `\nWARNING: There are ${entriesCount} index entries associated with this book. They will also be deleted!`;
  }
  
  if (confirm(confirmMsg)) {
    // Delete linked entries
    state.entries = state.entries.filter(e => e && e.bookId !== bookId);
    // Delete book
    state.books = state.books.filter(b => b && b.id !== bookId);
    
    saveState();
    renderAll();
  }
}

// ==========================================================================
// PAGE VALIDATION & SEARCH CONTAINMENT HELPERS
// ==========================================================================
// Helper: compress sequential pages list into ranges (e.g., 4, 5, 6, 7, 8 -> 4-8)
function compressPageList(pagesStr) {
  if (!pagesStr) return '';
  const cleanInput = pagesStr.trim();
  if (!/^[0-9,\-\s]+$/.test(cleanInput)) {
    return cleanInput;
  }

  const parts = cleanInput.split(',').map(p => p.trim()).filter(p => p.length > 0);
  const pagesSet = new Set();

  for (const part of parts) {
    if (part.includes('-')) {
      const rangeParts = part.split('-').map(x => x.trim());
      if (rangeParts.length === 2) {
        const start = parseInt(rangeParts[0], 10);
        const end = parseInt(rangeParts[1], 10);
        if (!isNaN(start) && !isNaN(end)) {
          const actualStart = Math.min(start, end);
          const actualEnd = Math.max(start, end);
          for (let i = actualStart; i <= actualEnd; i++) {
            pagesSet.add(i);
          }
        }
      }
    } else {
      const val = parseInt(part, 10);
      if (!isNaN(val)) {
        pagesSet.add(val);
      }
    }
  }

  const sortedPages = Array.from(pagesSet).sort((a, b) => a - b);
  if (sortedPages.length === 0) return cleanInput;

  const ranges = [];
  let rangeStart = sortedPages[0];
  let rangeEnd = sortedPages[0];

  for (let i = 1; i < sortedPages.length; i++) {
    const current = sortedPages[i];
    if (current === rangeEnd + 1) {
      rangeEnd = current;
    } else {
      if (rangeStart === rangeEnd) {
        ranges.push(`${rangeStart}`);
      } else {
        ranges.push(`${rangeStart}-${rangeEnd}`);
      }
      rangeStart = current;
      rangeEnd = current;
    }
  }
  
  if (rangeStart === rangeEnd) {
    ranges.push(`${rangeStart}`);
  } else {
    ranges.push(`${rangeStart}-${rangeEnd}`);
  }

  return ranges.join(', ');
}

function parseAndValidatePages(pagesInput) {
  const cleanInput = pagesInput.trim();
  if (!/^[0-9,\-\s]+$/.test(cleanInput)) {
    return { 
      isValid: false, 
      error: "Page numbers can only contain numbers, commas, and hyphens (e.g., '12, 14-17')." 
    };
  }

  const parts = cleanInput.split(',').map(p => p.trim()).filter(p => p.length > 0);
  if (parts.length === 0) {
    return { isValid: false, error: "Please enter at least one page number." };
  }

  for (const part of parts) {
    if (part.includes('-')) {
      const rangeParts = part.split('-').map(x => x.trim());
      if (rangeParts.length !== 2 || rangeParts[0] === '' || rangeParts[1] === '') {
        return { isValid: false, error: `Invalid range format: '${part}'. Must be 'start-end' (e.g. 12-15).` };
      }
      
      const start = parseInt(rangeParts[0], 10);
      const end = parseInt(rangeParts[1], 10);
      
      if (isNaN(start) || isNaN(end)) {
        return { isValid: false, error: `Invalid numbers in range: '${part}'.` };
      }
    } else {
      const val = parseInt(part, 10);
      if (isNaN(val)) {
        return { isValid: false, error: `Invalid page number: '${part}'.` };
      }
    }
  }

  return {
    isValid: true,
    formatted: compressPageList(cleanInput)
  };
}

function isPageMatch(entryPagesStr, queryStr) {
  const queryStrClean = queryStr.trim();
  const pageNum = parseInt(queryStrClean, 10);
  if (!isNaN(pageNum) && /^\d+$/.test(queryStrClean)) {
    const parts = entryPagesStr.split(',').map(p => p.trim());
    for (const part of parts) {
      if (part.includes('-')) {
        const range = part.split('-').map(x => parseInt(x.trim(), 10));
        if (range.length === 2 && !isNaN(range[0]) && !isNaN(range[1])) {
          const start = Math.min(range[0], range[1]);
          const end = Math.max(range[0], range[1]);
          if (pageNum >= start && pageNum <= end) {
            return true;
          }
        }
      } else {
        const single = parseInt(part, 10);
        if (!isNaN(single) && single === pageNum) {
          return true;
        }
      }
    }
  }
  return entryPagesStr.toLowerCase().includes(queryStrClean.toLowerCase());
}

// ==========================================================================
// ENTRY CRUD MANAGEMENT
// ==========================================================================
function handleEntrySubmit(e) {
  e.preventDefault();
  
  const id = elements.entryIdInput.value;
  const bookId = elements.entryBookSelect.value;
  const topic = elements.entryTopicInput.value.trim();
  const pages = elements.entryPagesInput.value.trim();
  const notes = htmlToMarkdown(elements.entryNotesInput.innerHTML).trim();
  
  if (!bookId) {
    alert("Please select a book first!");
    elements.entryBookSelect.focus();
    return;
  }
  
  if (!topic || !pages) return;

  const validation = parseAndValidatePages(pages);
  if (!validation.isValid) {
    alert(validation.error);
    elements.entryPagesInput.focus();
    return;
  }
  const formattedPages = validation.formatted;
  
  if (id) {
    // Update existing entry
    const entry = state.entries.find(e => e.id === id);
    if (entry) {
      entry.bookId = bookId;
      entry.topic = topic;
      entry.pages = formattedPages;
      entry.notes = notes;
    }
    endEditEntry();
  } else {
    // Create new entry
    const newId = 'entry-' + Date.now();
    state.entries.push({
      id: newId,
      courseId: state.currentCourseId,
      bookId,
      topic,
      pages: formattedPages,
      notes,
      starred: false,
      createdAt: new Date().toISOString()
    });
    
    // Store last added entry ID for slide-in animation
    state.lastAddedEntryId = newId;
    
    elements.entryTopicInput.value = '';
    elements.entryPagesInput.value = '';
    elements.entryNotesInput.innerHTML = '';
    updateFormatButtonsActiveStates(elements.entryForm);
    
    // Trigger pulses
    triggerStatPulse(elements.statTotalEntries.closest('.stat-card'));
    triggerStatPulse(elements.statLastAdded.closest('.stat-card'));
  }
  
  saveState();
  renderEntries();
  renderStats();
  
  elements.entryTopicInput.focus();
}

function startEditEntry(entryId) {
  editEntryId = entryId;
  renderEntries();
}

function endEditEntry() {
  editEntryId = null;
  renderEntries();
}


function deleteEntry(entryId) {
  const confirmDelete = elements.settingsConfirmDelete ? elements.settingsConfirmDelete.checked : true;
  if (!confirmDelete) {
    performDeleteEntry(entryId);
  } else {
    // Show confirmation dialog
    pendingDeleteEntryId = entryId;
    pendingDeleteEntryIds = null;
    
    // Reset Dialog UI to Single Delete Mode
    if (elements.deleteConfirmDialog) {
      const dialogTitle = elements.deleteConfirmDialog.querySelector('h3');
      const dialogText = elements.deleteConfirmDialog.querySelector('p');
      if (dialogTitle) dialogTitle.textContent = 'Delete Entry?';
      if (dialogText) dialogText.textContent = 'This action cannot be undone. The index entry will be permanently removed.';
      
      const checkboxWrapper = elements.deleteConfirmDontShowAgain ? elements.deleteConfirmDontShowAgain.closest('label') : null;
      if (checkboxWrapper) {
        checkboxWrapper.style.display = 'flex';
      }
      if (elements.deleteConfirmDontShowAgain) {
        elements.deleteConfirmDontShowAgain.checked = false;
      }
      
      lucide.createIcons({
        attrs: { class: 'lucide-icon' },
        nameAttr: 'data-lucide',
        nodeList: elements.deleteConfirmDialog.querySelectorAll('[data-lucide]')
      });
      elements.deleteConfirmDialog.showModal();
    }
  }
}

function performDeleteEntry(entryId) {
  state.entries = state.entries.filter(e => e && e.id !== entryId);
  selectedEntryIds.delete(entryId);
  
  saveState();
  renderEntries();
  renderStats();
  
  // Trigger pulses
  triggerStatPulse(elements.statTotalEntries.closest('.stat-card'));
  
  if (editEntryId === entryId) {
    endEditEntry();
  }
}

function deleteSelectedEntries() {
  const count = selectedEntryIds.size;
  if (count === 0) return;
  
  pendingDeleteEntryId = null;
  pendingDeleteEntryIds = Array.from(selectedEntryIds);
  
  // Set Dialog UI to Multi Delete Mode
  if (elements.deleteConfirmDialog) {
    const dialogTitle = elements.deleteConfirmDialog.querySelector('h3');
    const dialogText = elements.deleteConfirmDialog.querySelector('p');
    if (dialogTitle) dialogTitle.textContent = `Delete ${count} Entries?`;
    if (dialogText) dialogText.textContent = `Are you sure you want to delete these ${count} selected index entries? This action cannot be undone.`;
    
    const checkboxWrapper = elements.deleteConfirmDontShowAgain ? elements.deleteConfirmDontShowAgain.closest('label') : null;
    if (checkboxWrapper) {
      checkboxWrapper.style.display = 'none';
    }
    if (elements.deleteConfirmDontShowAgain) {
      elements.deleteConfirmDontShowAgain.checked = false;
    }
    
    lucide.createIcons({
      attrs: { class: 'lucide-icon' },
      nameAttr: 'data-lucide',
      nodeList: elements.deleteConfirmDialog.querySelectorAll('[data-lucide]')
    });
    elements.deleteConfirmDialog.showModal();
  }
}

function performDeleteEntries(entryIds) {
  const idsSet = new Set(entryIds);
  state.entries = state.entries.filter(e => e && !idsSet.has(e.id));
  
  selectedEntryIds.clear();
  
  saveState();
  renderEntries();
  renderStats();
  
  // Trigger pulses
  triggerStatPulse(elements.statTotalEntries.closest('.stat-card'));
  
  if (editEntryId && idsSet.has(editEntryId)) {
    endEditEntry();
  }
}

// ==========================================================================
// TOPIC INPUT AUTOCOMPLETE SYSTEM
// ==========================================================================
function showSuggestions(val) {
  closeSuggestions();
  if (!val) return;
  
  const activeEntries = state.entries.filter(e => e && e.courseId === state.currentCourseId);
  const topics = [...new Set(activeEntries.map(e => e.topic))];
  
  const matches = topics.filter(topic => 
    topic.toLowerCase().includes(val.toLowerCase())
  ).slice(0, 8);
  
  if (matches.length === 0) return;
  
  activeAutocompleteIndex = -1;
  elements.autocompleteList.innerHTML = '';
  elements.autocompleteList.classList.remove('hidden');
  
  matches.forEach((match, index) => {
    const item = document.createElement('div');
    item.innerHTML = match;
    item.addEventListener('click', () => {
      elements.entryTopicInput.value = match;
      closeSuggestions();
      elements.entryPagesInput.focus();
    });
    elements.autocompleteList.appendChild(item);
  });
}

function closeSuggestions() {
  elements.autocompleteList.innerHTML = '';
  elements.autocompleteList.classList.add('hidden');
  activeAutocompleteIndex = -1;
}

function handleAutocompleteKeys(e) {
  const listItems = elements.autocompleteList.querySelectorAll('div');
  if (listItems.length === 0) return;
  
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    activeAutocompleteIndex++;
    if (activeAutocompleteIndex >= listItems.length) activeAutocompleteIndex = 0;
    updateActiveAutocompleteRow(listItems);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    activeAutocompleteIndex--;
    if (activeAutocompleteIndex < 0) activeAutocompleteIndex = listItems.length - 1;
    updateActiveAutocompleteRow(listItems);
  } else if (e.key === 'Enter') {
    if (activeAutocompleteIndex > -1) {
      e.preventDefault();
      listItems[activeAutocompleteIndex].click();
    }
  } else if (e.key === 'Escape') {
    closeSuggestions();
  }
}

function updateActiveAutocompleteRow(items) {
  items.forEach(item => item.classList.remove('autocomplete-active'));
  if (activeAutocompleteIndex > -1) {
    items[activeAutocompleteIndex].classList.add('autocomplete-active');
    items[activeAutocompleteIndex].scrollIntoView({ block: 'nearest' });
  }
}

// ==========================================================================
// IMPORT & EXPORT LOGIC
// ==========================================================================
function exportToJSON() {
  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  const courseName = activeCourse ? activeCourse.name.replace(/[^a-z0-9]/gi, '_') : 'SANS_Index';
  
  const backupPayload = {
    course: activeCourse,
    books: state.books.filter(b => b && b.courseId === state.currentCourseId),
    entries: state.entries.filter(e => e && e.courseId === state.currentCourseId)
  };
  
  const blob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseName}_backup.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportToCSV() {
  const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
  const courseName = activeCourse ? activeCourse.name.replace(/[^a-z0-9]/gi, '_') : 'SANS_Index';
  
  const courseEntries = state.entries.filter(e => e && e.courseId === state.currentCourseId);
  
  const sortedEntries = [...courseEntries];
  sortData(sortedEntries);
  
  let csvContent = "Topic,Pages,Notes,Book\n";
  
  sortedEntries.forEach(entry => {
    const book = state.books.find(b => b && b.id === entry.bookId);
    const bookName = book ? book.name : '';
    
    const escapeCsv = (str) => {
      if (!str) return '""';
      const escaped = str.replace(/"/g, '""');
      return `"${escaped}"`;
    };
    
    csvContent += `${escapeCsv(entry.topic)},${escapeCsv(entry.pages)},${escapeCsv(entry.notes)},${escapeCsv(bookName)}\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${courseName}_index.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function processImport() {
  const activeTab = document.querySelector('.import-tab-btn.active').getAttribute('data-tab');
  
  if (activeTab === 'tab-json') {
    const file = elements.importJsonFile.files[0];
    if (!file) {
      alert("Please select a JSON file to import.");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        
        if (data.courses && data.books && data.entries) {
          if (confirm("This is a full app backup. Do you want to OVERWRITE your current application database?")) {
            state = data;
            saveState();
            renderAll();
            elements.importDialog.close();
          }
        } else if (data.course && data.books && data.entries) {
          if (confirm(`Do you want to import/merge "${data.course.name}"?`)) {
            const existingCourse = state.courses.find(c => c.id === data.course.id);
            if (!existingCourse) {
              state.courses.push(data.course);
            }
            
            data.books.forEach(b => {
              if (b && !state.books.some(localB => localB && localB.id === b.id)) {
                state.books.push(b);
              }
            });
            
            data.entries.forEach(entry => {
              if (entry && !state.entries.some(localE => localE && localE.id === entry.id)) {
                state.entries.push(entry);
              }
            });
            
            state.currentCourseId = data.course.id;
            saveState();
            renderAll();
            elements.importDialog.close();
          }
        } else {
          alert("Invalid JSON format. Check file structure.");
        }
      } catch (err) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
    
  } else if (activeTab === 'tab-csv') {
    const file = elements.importCsvFile.files[0];
    if (!file) {
      alert("Please select a CSV file to import.");
      return;
    }
    
    const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);
    if (activeBooks.length === 0) {
      alert("Please configure at least one book in this course before importing a CSV index.");
      elements.importDialog.close();
      openBookDialog();
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const text = e.target.result;
        const lines = parseCSVRows(text);
        
        if (lines.length < 2) {
          alert("CSV file seems to be empty or missing data rows.");
          return;
        }
        
        const headers = lines[0].map(h => h.trim().toLowerCase());
        const topicIdx = headers.indexOf('topic');
        const pagesIdx = headers.indexOf('pages');
        const notesIdx = headers.indexOf('notes');
        const bookIdx = headers.indexOf('book');
        
        if (topicIdx === -1 || pagesIdx === -1) {
          alert("CSV requires at least 'Topic' and 'Pages' columns/headers.");
          return;
        }
        
        let importedCount = 0;
        
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          if (row.length < Math.max(topicIdx, pagesIdx) + 1) continue;
          
          const topic = row[topicIdx]?.trim();
          const pages = row[pagesIdx]?.trim();
          const notes = notesIdx !== -1 ? row[notesIdx]?.trim() : '';
          const csvBookName = bookIdx !== -1 ? row[bookIdx]?.trim() : '';
          
          if (!topic || !pages) continue;
          
          let matchedBook = activeBooks[0];
          if (csvBookName) {
            const found = activeBooks.find(b => b && b.name.toLowerCase() === csvBookName.toLowerCase());
            if (found) matchedBook = found;
          }
          
          const validation = parseAndValidatePages(pages);
          const finalPages = validation.isValid ? validation.formatted : pages;

          state.entries.push({
            id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            courseId: state.currentCourseId,
            bookId: matchedBook.id,
            topic,
            pages: finalPages,
            notes,
            createdAt: new Date().toISOString()
          });
          importedCount++;
        }
        
        saveState();
        renderAll();
        alert(`Successfully imported ${importedCount} index entries!`);
        elements.importDialog.close();
        
      } catch (err) {
        alert("Failed to parse CSV file: " + err.message);
      }
    };
    reader.readAsText(file);
  }
}

function parseCSVRows(text) {
  const result = [];
  let row = [''];
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i+1];
    
    if (inQuotes) {
      if (c === '"') {
        if (next === '"') {
          row[row.length - 1] += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        row[row.length - 1] += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ',') {
        row.push('');
      } else if (c === '\r' || c === '\n') {
        if (c === '\r' && next === '\n') i++;
        result.push(row);
        row = [''];
      } else {
        row[row.length - 1] += c;
      }
    }
  }
  
  if (row.length > 1 || row[0] !== '') {
    result.push(row);
  }
  
  return result.filter(r => r.length > 0 && r.some(cell => cell.trim() !== ''));
}

// ==========================================================================
// EVENT BINDINGS REGISTER
// ==========================================================================
function initEventBindings() {
  elements.sidebarToggleBtn.addEventListener('click', () => {
    document.querySelector('.app-layout').classList.toggle('sidebar-collapsed');
  });

  // Course Switch
  elements.courseSelect.addEventListener('change', (e) => {
    state.currentCourseId = e.target.value;
    selectedEntryIds.clear();
    endEditEntry();
    renderAll();
    checkExamDateAlerts();
  });

  // Master selection checkbox
  if (elements.selectAllEntriesCheckbox) {
    elements.selectAllEntriesCheckbox.addEventListener('change', () => {
      let activeEntries = state.entries.filter(entry => entry && entry.courseId === state.currentCourseId);
      const selectedBookFilter = elements.filterBookSelect.value;
      if (selectedBookFilter !== 'all') {
        activeEntries = activeEntries.filter(entry => entry.bookId === selectedBookFilter);
      }
      const query = elements.tableSearchInput.value.toLowerCase().trim();
      if (query) {
        activeEntries = activeEntries.filter(entry => {
          const book = state.books.find(b => b && b.id === entry.bookId);
          const bookName = book ? book.name.toLowerCase() : '';
          return (
            entry.topic.toLowerCase().includes(query) ||
            (entry.notes && entry.notes.toLowerCase().includes(query)) ||
            isPageMatch(entry.pages, query) ||
            bookName.includes(query)
          );
        });
      }

      if (elements.selectAllEntriesCheckbox.checked) {
        activeEntries.forEach(entry => selectedEntryIds.add(entry.id));
      } else {
        activeEntries.forEach(entry => selectedEntryIds.delete(entry.id));
      }
      
      renderEntries();
    });
  }

  // Clear Selection
  if (elements.cancelSelectionBtn) {
    elements.cancelSelectionBtn.addEventListener('click', () => {
      selectedEntryIds.clear();
      renderEntries();
    });
  }

  // Delete Selected Items
  if (elements.deleteSelectedBtn) {
    elements.deleteSelectedBtn.addEventListener('click', () => {
      deleteSelectedEntries();
    });
  }
  
  // Add To-Do Item
  const handleAddTodo = () => {
    const text = elements.todoInput.value.trim();
    if (!text) return;
    if (!state.currentCourseId) {
      alert("Please select or create a course first!");
      return;
    }
    
    const newTodo = {
      id: 'todo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      courseId: state.currentCourseId,
      text: text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    state.todos.push(newTodo);
    elements.todoInput.value = '';
    saveState();
    renderTodos();
  };
  
  elements.addTodoBtn.addEventListener('click', handleAddTodo);
  elements.todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTodo();
    }
  });
  
  // Toggle Collapsible Books Section
  elements.booksToggleBtn.addEventListener('click', (e) => {
    if (e.target.closest('#add-book-btn')) return;
    elements.booksSidebarSection.classList.toggle('collapsed');
  });

  // Toggle Collapsible To-Do Section
  elements.todoToggleBtn.addEventListener('click', () => {
    elements.todoSidebarSection.classList.toggle('collapsed');
  });
  
  elements.addCourseBtn.addEventListener('click', () => openCourseDialog());
  elements.editCourseBtn.addEventListener('click', () => openCourseDialog(state.currentCourseId));
  elements.deleteCourseBtn.addEventListener('click', deleteCourse);
  
  // Book Add
  elements.addBookBtn.addEventListener('click', () => openBookDialog());
  
  // Modals Actions
  document.querySelectorAll('.close-dialog-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.target.closest('dialog').close();
    });
  });
  
  elements.courseDialogForm.addEventListener('submit', handleCourseDialogSubmit);
  elements.bookDialogForm.addEventListener('submit', handleBookDialogSubmit);
  
  // Book Dialog Preset Colors Click
  elements.colorPresets.forEach(preset => {
    preset.addEventListener('click', (e) => {
      elements.colorPresets.forEach(p => p.classList.remove('selected'));
      preset.classList.add('selected');
      elements.dialogBookColor.value = preset.getAttribute('data-color');
    });
  });
  
  // Auto-sync input color to preset selection
  elements.dialogBookColor.addEventListener('input', (e) => {
    elements.colorPresets.forEach(preset => {
      if (preset.getAttribute('data-color').toLowerCase() === e.target.value.toLowerCase()) {
        preset.classList.add('selected');
      } else {
        preset.classList.remove('selected');
      }
    });
  });

  // Entry CRUD Submit
  elements.entryForm.addEventListener('submit', handleEntrySubmit);
  elements.cancelEditBtn.addEventListener('click', endEditEntry);
  
  // Bind contenteditable active state tracking for main notes
  elements.entryNotesInput.addEventListener('keyup', () => updateFormatButtonsActiveStates(elements.entryForm));
  elements.entryNotesInput.addEventListener('mouseup', () => updateFormatButtonsActiveStates(elements.entryForm));
  elements.entryNotesInput.addEventListener('click', () => updateFormatButtonsActiveStates(elements.entryForm));

  // Handle main entry form formatting toolbar click events
  document.querySelectorAll('.format-btn').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevents selection loss
    });
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const format = btn.getAttribute('data-format');
      applyFormatting(elements.entryNotesInput, format);
      updateFormatButtonsActiveStates(elements.entryForm);
    });
  });

  // Textarea/Div hotkey handler function
  const handleTextareaHotkeys = (e, textarea) => {
    if (e.ctrlKey || e.metaKey) {
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        applyFormatting(textarea, 'bold');
        updateFormatButtonsActiveStates(textarea.closest('.form-group') || textarea.closest('tr') || document);
      } else if (key === 'i') {
        e.preventDefault();
        applyFormatting(textarea, 'italic');
        updateFormatButtonsActiveStates(textarea.closest('.form-group') || textarea.closest('tr') || document);
      } else if (key === 'u') {
        e.preventDefault();
        applyFormatting(textarea, 'underline');
        updateFormatButtonsActiveStates(textarea.closest('.form-group') || textarea.closest('tr') || document);
      }
    }
  };

  // Bind main entry notes hotkeys
  elements.entryNotesInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter allows newline insertion
        return;
      }
      e.preventDefault();
      // Publish the entry!
      handleEntrySubmit(e);
      return;
    }
    handleTextareaHotkeys(e, elements.entryNotesInput);
  });
  
  // Auto-suggestion listener for SANS Courses in modal dialog
  elements.dialogCourseName.addEventListener('input', (e) => {
    showCourseAutocomplete(e.target.value.trim());
  });
  
  elements.dialogCourseName.addEventListener('keydown', handleCourseAutocompleteKeys);
  
  // Close autocomplete on click outside
  document.addEventListener('click', (e) => {
    if (e.target !== elements.dialogCourseName && e.target !== elements.courseAutocompleteList) {
      closeCourseAutocomplete();
    }
  });

  // Auto-suggestion listener for Topic input in Entry Form
  elements.entryTopicInput.addEventListener('input', (e) => {
    showSuggestions(e.target.value.trim());
  });
  
  elements.entryTopicInput.addEventListener('keydown', handleAutocompleteKeys);
  
  document.addEventListener('click', (e) => {
    if (e.target !== elements.entryTopicInput && e.target !== elements.autocompleteList) {
      closeSuggestions();
    }
  });

  // Table Search and Filters
  elements.tableSearchInput.addEventListener('input', () => {
    renderEntries();
  });
  
  elements.filterBookSelect.addEventListener('change', () => {
    renderEntries();
  });

  if (elements.settingsShowAiBadges) {
    elements.settingsShowAiBadges.checked = localStorage.getItem('show_ai_badges') !== 'false';
    elements.settingsShowAiBadges.addEventListener('change', () => {
      localStorage.setItem('show_ai_badges', elements.settingsShowAiBadges.checked);
      renderEntries();
    });
  }

  // Sort Table Headers
  elements.tableHeaders.forEach(th => {
    th.addEventListener('click', () => {
      const field = th.getAttribute('data-sort');
      
      if (sortField === field) {
        sortAsc = !sortAsc;
      } else {
        sortField = field;
        sortAsc = true;
      }
      
      // Update header icons
      elements.tableHeaders.forEach(h => {
        h.classList.remove('sorted-asc', 'sorted-desc');
        const icon = h.querySelector('.sort-icon');
        if (icon) {
          icon.setAttribute('data-lucide', 'chevrons-up-down');
        }
      });
      
      th.classList.add(sortAsc ? 'sorted-asc' : 'sorted-desc');
      const activeIcon = th.querySelector('.sort-icon');
      if (activeIcon) {
        activeIcon.setAttribute('data-lucide', sortAsc ? 'chevron-up' : 'chevron-down');
      }
      
      lucide.createIcons({
        attrs: { class: 'lucide-icon' },
        nameAttr: 'data-lucide',
        nodeList: elements.indexTableContainer.querySelectorAll('[data-lucide]')
      });
      
      renderEntries();
    });
  });
  

  
  // Print trigger
  elements.printIndexBtn.addEventListener('click', openPrintPreview);
  
  elements.printPreviewConfirmBtn.addEventListener('click', () => {
    elements.printPreviewDialog.close();
    // Delay slightly to allow dialog close transition to complete
    setTimeout(() => {
      window.print();
    }, 150);
  });

  if (elements.printPreviewSavePdfBtn) {
    elements.printPreviewSavePdfBtn.addEventListener('click', async () => {
      const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
      const courseName = activeCourse ? activeCourse.name.replace(/[^a-z0-9]/gi, '_') : 'SANS_Index';
      const format = elements.printFormatSelect.value;
      const defaultName = `${courseName}_${format === 'booklet' ? 'Booklet' : 'Standard'}_Index.pdf`;

      const span = elements.printPreviewSavePdfBtn.querySelector('span');
      const originalText = span ? span.textContent : 'Save as PDF';
      
      try {
        if (span) span.textContent = 'Generating PDF...';
        elements.printPreviewSavePdfBtn.disabled = true;

        const result = await window.api.savePdf({ defaultName });

        if (span) span.textContent = originalText;
        elements.printPreviewSavePdfBtn.disabled = false;

        if (result.success) {
          alert(`PDF successfully generated and saved to:\n\n${result.filePath}`);
        } else if (!result.canceled && result.error) {
          alert(`Failed to save PDF: ${result.error}`);
        }
      } catch (err) {
        if (span) span.textContent = originalText;
        elements.printPreviewSavePdfBtn.disabled = false;
        console.error('Save PDF Error:', err);
        alert(`Error saving PDF: ${err.message}`);
      }
    });
  }

  elements.printFormatSelect.addEventListener('change', renderPrintPreview);

  // Include Notes checkbox — persist and re-render preview when toggled
  if (elements.printIncludeNotes) {
    elements.printIncludeNotes.checked = localStorage.getItem('print_include_notes') !== 'false';
    elements.printIncludeNotes.addEventListener('change', () => {
      localStorage.setItem('print_include_notes', elements.printIncludeNotes.checked);
      renderPrintPreview();
    });
  }

  // Confirm Deletion checkbox — persist state in localStorage
  if (elements.settingsConfirmDelete) {
    elements.settingsConfirmDelete.checked = localStorage.getItem('confirm_delete') !== 'false';
    elements.settingsConfirmDelete.addEventListener('change', () => {
      localStorage.setItem('confirm_delete', elements.settingsConfirmDelete.checked);
    });
  }

  // Delete Confirmation Dialog — wiring
  if (elements.deleteConfirmDialog) {
    // Cancel button closes the dialog without deleting
    elements.deleteConfirmCancelBtn.addEventListener('click', () => {
      pendingDeleteEntryId = null;
      pendingDeleteEntryIds = null;
      elements.deleteConfirmDontShowAgain.checked = false;
      elements.deleteConfirmDialog.close();
    });

    // Confirm button performs the actual deletion
    elements.deleteConfirmOkBtn.addEventListener('click', () => {
      // Only set skip warning if it was a single entry deletion
      if (!pendingDeleteEntryIds && elements.deleteConfirmDontShowAgain.checked) {
        if (elements.settingsConfirmDelete) {
          elements.settingsConfirmDelete.checked = false;
        }
        localStorage.setItem('confirm_delete', 'false');
      }
      elements.deleteConfirmDialog.close();
      if (pendingDeleteEntryId) {
        performDeleteEntry(pendingDeleteEntryId);
        pendingDeleteEntryId = null;
      } else if (pendingDeleteEntryIds) {
        performDeleteEntries(pendingDeleteEntryIds);
        pendingDeleteEntryIds = null;
      }
      elements.deleteConfirmDontShowAgain.checked = false;
    });
  }
  // Close button on floating exam date notification banner
  const closeBannerBtn = elements.examNotificationBanner.querySelector('.close-banner-btn');
  if (closeBannerBtn) {
    closeBannerBtn.addEventListener('click', () => {
      if (bannerTimeoutId) {
        clearTimeout(bannerTimeoutId);
        bannerTimeoutId = null;
      }
      elements.examNotificationBanner.classList.add('hidden');
      elements.examCautionBanner.classList.remove('hidden');
    });
  }

  // Click banner / "Set Date" buttons to open dialog
  const setExamDateBtn = elements.examNotificationBanner.querySelector('.set-exam-date-banner-btn');
  if (setExamDateBtn) {
    setExamDateBtn.addEventListener('click', openTestDateDialog);
  }
  const setExamDateLink = elements.examCautionBanner.querySelector('.set-exam-date-link');
  if (setExamDateLink) {
    setExamDateLink.addEventListener('click', (e) => {
      e.preventDefault();
      openTestDateDialog();
    });
  }

  // Bind Dismiss Forever actions
  if (elements.dismissForeverBannerBtn) {
    elements.dismissForeverBannerBtn.addEventListener('click', dismissExamAlertsForever);
  }
  if (elements.dismissForeverCautionLink) {
    elements.dismissForeverCautionLink.addEventListener('click', (e) => {
      e.preventDefault();
      dismissExamAlertsForever();
    });
  }

  // Click stats card to set/change exam date
  const statCardBookCount = elements.statBookCount.closest('.stat-card');
  if (statCardBookCount) {
    statCardBookCount.addEventListener('click', () => {
      const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
      if (activeCourse && activeCourse.dismissExamAlert && !activeCourse.testDate) {
        return;
      }
      openTestDateDialog();
    });
  }

  // Exam Date Dialog bindings
  if (elements.testDateDialogForm) {
    elements.testDateDialogForm.addEventListener('submit', handleTestDateDialogSubmit);
  }
  const closeTestDateDialogBtn = elements.testDateDialog.querySelector('.close-dialog-btn');
  if (closeTestDateDialogBtn) {
    closeTestDateDialogBtn.addEventListener('click', () => {
      elements.testDateDialog.close();
    });
  }
  if (elements.clearTestDateBtn) {
    elements.clearTestDateBtn.addEventListener('click', () => {
      const activeCourse = state.courses.find(c => c.id === state.currentCourseId);
      if (activeCourse) {
        delete activeCourse.testDate;
        saveState();
        elements.testDateDialog.close();
        
        if (bannerTimeoutId) {
          clearTimeout(bannerTimeoutId);
          bannerTimeoutId = null;
        }
        elements.examNotificationBanner.classList.add('hidden');
        elements.examCautionBanner.classList.remove('hidden');
        
        renderAll();
      }
    });
  }

function openPrintPreview() {
  elements.printFormatSelect.value = 'standard';
  syncCustomSelect(elements.printFormatSelect);
  renderPrintPreview();
  elements.printPreviewDialog.showModal();
}

function renderPrintPreview() {
  const format = elements.printFormatSelect.value;
  const activeEntries = state.entries.filter(entry => entry && entry.courseId === state.currentCourseId);
  
  let generatedHtml = '';
  if (format === 'booklet') {
    generatedHtml = generateBookletPrintHTML(activeEntries);
  } else if (format === 'topic-by-book') {
    generatedHtml = generateTopicByBookPrintHTML(activeEntries);
  } else {
    generatedHtml = generateStandardPrintHTML(activeEntries);
  }
  
  elements.printPreviewPageContainer.innerHTML = generatedHtml;
  elements.printOnlyContainer.innerHTML = generatedHtml;
  
  // Re-render Lucide icons in the preview container (for book badge dots, etc.)
  lucide.createIcons({
    attrs: { class: 'lucide-icon' },
    nameAttr: 'data-lucide',
    nodeList: elements.printPreviewPageContainer.querySelectorAll('[data-lucide]')
  });
}

function generateStandardPrintHTML(activeEntries) {
  const includeNotes = elements.printIncludeNotes.checked;

  // Dynamic column widths based on whether notes are shown
  const topicW = includeNotes ? '25%' : '40%';
  const refsW  = includeNotes ? '35%' : '60%';
  const notesW = '40%';
  // Topic column: only break words when they would overflow (not aggressively)
  const topicWordWrap = 'overflow-wrap: break-word; word-break: normal;';

  // Always sort alphabetically by topic
  const sorted = [...activeEntries].sort((a, b) =>
    a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true })
  );

  // Combine like topics: group entries by topic (case-insensitive)
  const topicMap = new Map();
  sorted.forEach(entry => {
    const key = entry.topic.trim().toLowerCase();
    if (!topicMap.has(key)) {
      topicMap.set(key, { topic: entry.topic, entries: [], notes: [] });
    }
    const group = topicMap.get(key);
    group.entries.push(entry);
    if (entry.notes && entry.notes.trim()) {
      group.notes.push(entry.notes.trim());
    }
  });

  // Build rows — one per unique topic
  const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);
  const bookOrderMap = new Map(activeBooks.map((b, i) => [b.id, i]));

  const rowsHtml = [...topicMap.values()].map(group => {
    // Sort book references by sidebar book order
    const booksSorted = [...group.entries].sort((a, b) => {
      const ai = bookOrderMap.has(a.bookId) ? bookOrderMap.get(a.bookId) : 999;
      const bi = bookOrderMap.has(b.bookId) ? bookOrderMap.get(b.bookId) : 999;
      return ai - bi;
    });

    // Build ref inline HTML — one line per book: "Book X:  pages"
    const refLines = booksSorted.map(entry => {
      const book = state.books.find(b => b && b.id === entry.bookId);
      const bookNameFull = book ? book.name : 'Unknown';
      const bookNameShort = bookNameFull.includes(':') ? bookNameFull.split(':')[0].trim() : bookNameFull;
      const bookColor = book ? book.color : '#4b5563';
      // Normalize pages: single space after each comma
      const normalizedPages = entry.pages.replace(/\s*,\s*/g, ', ');
      return `<div style="line-height: 1.65;"><span style="color: ${bookColor}; font-weight: 700;">${escapeHtml(bookNameShort)}:</span>&nbsp;&nbsp;${escapeHtml(normalizedPages)}</div>`;
    }).join('');

    const refsHtml = `<div>${refLines}</div>`;

    // Combine notes (deduplicated)
    const uniqueNotes = [...new Set(group.notes)];
    const combinedNotes = uniqueNotes.map(n => formatNoteMarkup(n)).join('<hr style="border:none; border-top: 1px solid #e2e8f0; margin: 4px 0;">');

    // Starred if any entry is starred
    const isStarred = group.entries.some(e => e.starred);
    const rowClass = isStarred ? 'starred-row' : '';

    const notesCell = includeNotes
      ? `<td class="col-notes">${combinedNotes}</td>`
      : '';

    return `
      <tr class="${rowClass}">
        <td class="col-topic" style="font-weight: 700; ${topicWordWrap}">${escapeHtml(group.topic)}</td>
        <td class="col-references">${refsHtml}</td>
        ${notesCell}
      </tr>`;
  }).join('');

  const notesHeader = includeNotes ? `<th class="col-notes" style="width: ${notesW};">Notes / Reference Details</th>` : '';

  return `
    <div class="print-header">
      <h1>${escapeHtml(elements.currentCourseTitle.textContent)}</h1>
      <div class="print-meta">
        <span>SANS Study Index</span>
        <span>Date: ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>Total Topics: ${topicMap.size}</span>
      </div>
    </div>
    <table class="index-table" style="table-layout: fixed; width: 100%;">
      <thead>
        <tr>
          <th class="col-topic" style="width: ${topicW}; ${topicWordWrap}">Topic</th>
          <th class="col-references" style="width: ${refsW};">References</th>
          ${notesHeader}
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

function generateBookletPrintHTML(activeEntries) {
  const includeNotes = elements.printIncludeNotes.checked;

  // Dynamic column widths based on whether notes are shown
  const topicW = includeNotes ? '25%' : '40%';
  const refsW  = includeNotes ? '35%' : '60%';
  const notesW = '40%';
  // Topic column: only break words when they would overflow (not aggressively)
  const topicWordWrap = 'overflow-wrap: break-word; word-break: normal;';

  // Get books in sidebar order (only those that have entries)
  const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);

  let html = `
    <div class="print-header">
      <h1>${escapeHtml(elements.currentCourseTitle.textContent)}</h1>
      <div class="print-meta">
        <span>SANS Study Index — Booklet Format</span>
        <span>Date: ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>Total Entries: ${activeEntries.length}</span>
      </div>
    </div>
  `;

  const notesHeader = includeNotes ? `<th class="col-notes" style="width: ${notesW};">Notes / Reference Details</th>` : '';

  let firstBook = true;
  activeBooks.forEach(book => {
    const bookEntries = activeEntries.filter(e => e && e.bookId === book.id);
    if (bookEntries.length === 0) return; // skip books with no entries

    // Sort by page number of first reference, then topic as tiebreaker
    const sortedBookEntries = [...bookEntries].sort((a, b) => {
      const pageComp = comparePages(a.pages, b.pages);
      if (pageComp !== 0) return pageComp;
      return a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true });
    });

    // Build the book section header — using book color
    const headerMargin = firstBook ? 'margin-top: 16px;' : 'margin-top: 32px;';
    html += `
      <div class="print-book-section-header" style="${headerMargin}">
        <h3 style="color: ${book.color};">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${book.color}; margin-right:6px; vertical-align:middle;"></span>
          ${escapeHtml(book.name)}
        </h3>
      </div>
      <table class="index-table" style="table-layout: fixed; width: 100%;">
        <thead>
          <tr>
            <th class="col-topic" style="width: ${topicW}; ${topicWordWrap}">Topic</th>
            <th class="col-references" style="width: ${refsW};">References</th>
            ${notesHeader}
          </tr>
        </thead>
        <tbody>
    `;

    sortedBookEntries.forEach(entry => {
      const formattedNotes = entry.notes ? formatNoteMarkup(entry.notes) : '';
      const rowClass = entry.starred ? 'starred-row' : '';

      // References cell: single book entry — inline format "Book X:  pages"
      const normalizedPages = entry.pages.replace(/\s*,\s*/g, ', ');
      const bookNameShort = book.name.includes(':') ? book.name.split(':')[0].trim() : book.name;
      const refsHtml = `<div><span style="color: ${book.color}; font-weight: 700;">${escapeHtml(bookNameShort)}:</span>&nbsp;&nbsp;${escapeHtml(normalizedPages)}</div>`;

      const notesCell = includeNotes
        ? `<td class="col-notes">${formattedNotes}</td>`
        : '';

      html += `
          <tr class="${rowClass}">
            <td class="col-topic" style="font-weight: 700; ${topicWordWrap}">${escapeHtml(entry.topic)}</td>
            <td class="col-references">${refsHtml}</td>
            ${notesCell}
          </tr>`;
    });

    html += `
        </tbody>
      </table>
    `;

    firstBook = false;
  });

  return html;
}

function generateTopicByBookPrintHTML(activeEntries) {
  const includeNotes = elements.printIncludeNotes.checked;

  // Dynamic column widths based on whether notes are shown
  const topicW = includeNotes ? '25%' : '40%';
  const refsW  = includeNotes ? '35%' : '60%';
  const notesW = '40%';
  const topicWordWrap = 'overflow-wrap: break-word; word-break: normal;';

  // Get books in sidebar order
  const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);

  let html = `
    <div class="print-header">
      <h1>${escapeHtml(elements.currentCourseTitle.textContent)}</h1>
      <div class="print-meta">
        <span>SANS Study Index — Topic Sorted By Book</span>
        <span>Date: ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>Total Entries: ${activeEntries.length}</span>
      </div>
    </div>
  `;

  const notesHeader = includeNotes ? `<th class="col-notes" style="width: ${notesW};">Notes / Reference Details</th>` : '';

  let firstBook = true;
  activeBooks.forEach(book => {
    const bookEntries = activeEntries.filter(e => e && e.bookId === book.id);
    if (bookEntries.length === 0) return;

    // Sort alphabetically by topic within each book
    const sortedBookEntries = [...bookEntries].sort((a, b) =>
      a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true })
    );

    const headerMargin = firstBook ? 'margin-top: 16px;' : 'margin-top: 32px;';
    html += `
      <div class="print-book-section-header" style="${headerMargin}">
        <h3 style="color: ${book.color};">
          <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${book.color}; margin-right:6px; vertical-align:middle;"></span>
          ${escapeHtml(book.name)}
        </h3>
      </div>
      <table class="index-table" style="table-layout: fixed; width: 100%;">
        <thead>
          <tr>
            <th class="col-topic" style="width: ${topicW}; ${topicWordWrap}">Topic</th>
            <th class="col-references" style="width: ${refsW};">References</th>
            ${notesHeader}
          </tr>
        </thead>
        <tbody>
    `;

    sortedBookEntries.forEach(entry => {
      const formattedNotes = entry.notes ? formatNoteMarkup(entry.notes) : '';
      const rowClass = entry.starred ? 'starred-row' : '';
      const normalizedPages = entry.pages.replace(/\s*,\s*/g, ', ');
      const bookNameShort = book.name.includes(':') ? book.name.split(':')[0].trim() : book.name;
      const refsHtml = `<div><span style="color: ${book.color}; font-weight: 700;">${escapeHtml(bookNameShort)}:</span>&nbsp;&nbsp;${escapeHtml(normalizedPages)}</div>`;

      const notesCell = includeNotes
        ? `<td class="col-notes">${formattedNotes}</td>`
        : '';

      html += `
          <tr class="${rowClass}">
            <td class="col-topic" style="font-weight: 700; ${topicWordWrap}">${escapeHtml(entry.topic)}</td>
            <td class="col-references">${refsHtml}</td>
            ${notesCell}
          </tr>`;
    });

    html += `
        </tbody>
      </table>
    `;

    firstBook = false;
  });

  return html;
}

  // Import/Export dialog binds
  elements.exportJsonBtn.addEventListener('click', exportToJSON);
  elements.exportCsvBtn.addEventListener('click', exportToCSV);
  
  elements.importBtn.addEventListener('click', () => {
    elements.importJsonFile.value = '';
    elements.importCsvFile.value = '';
    elements.importDialog.showModal();
  });
  
  elements.confirmImportBtn.addEventListener('click', processImport);
  
  // Switch import tabs
  document.querySelectorAll('.import-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.import-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.import-tab-content').forEach(c => c.classList.add('hidden'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.remove('hidden');
    });
  });


  
  // Global Keyboard Shortcuts listener
  window.addEventListener('keydown', (e) => {
    // Alt + N -> Focus Topic
    if (e.altKey && e.key.toLowerCase() === 'n') {
      e.preventDefault();
      elements.entryTopicInput.focus();
      elements.entryTopicInput.select();
    }

    // Ctrl + F -> Focus Search bar
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      elements.tableSearchInput.focus();
      elements.tableSearchInput.select();
    }
    
    // Esc -> Clear entry form / Cancel editing
    if (e.key === 'Escape' && document.activeElement.closest('#entry-form')) {
      endEditEntry();
    }
  });
  
  // Initialize Auto-indexing events
  initAutoIndexingBindings();
}

function htmlToMarkdown(html) {
  if (!html) return '';
  let md = html;
  
  // Replace <br> and <div>/</div> with newlines
  md = md.replace(/<br\s*\/?>/gi, '\n');
  md = md.replace(/<div>(.*?)<\/div>/gi, '\n$1');
  
  // Replace list items
  md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n');
  md = md.replace(/<ul[^>]*>/gi, '');
  md = md.replace(/<\/ul>/gi, '');
  
  // Replace bold tags
  md = md.replace(/<(strong|b)>(.*?)<\/\1>/gi, '**$2**');
  // Replace italic tags
  md = md.replace(/<(em|i)>(.*?)<\/\1>/gi, '*$2*');
  // Replace underline tags
  md = md.replace(/<u>(.*?)<\/u>/gi, '__$1__');
  
  // Replace highlight tags
  md = md.replace(/<span[^>]*class="[^"]*note-highlight[^"]*"[^>]*>(.*?)<\/span>/gi, '==$1==');
  md = md.replace(/<span[^>]*style="[^"]*background-color:[^"]*"[^>]*>(.*?)<\/span>/gi, '==$1==');
  md = md.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '==$1==');
  
  // Clean up any remaining HTML tags (like <div> or <span>)
  md = md.replace(/<[^>]+>/g, '');
  
  // Decode HTML entities (like &lt; &gt; &amp;)
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = md;
  return tempDiv.innerText;
}

function markdownToHtml(markdown) {
  if (!markdown) return '';
  let html = markdown;
  
  // Escape HTML tags to prevent cross-site scripting
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // Replace newlines with <br>
  html = html.replace(/\n/g, '<br>');
  
  // Replace bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  // Replace italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  // Replace underline
  html = html.replace(/__(.*?)__/g, '<u>$1</u>');
  // Replace highlight
  html = html.replace(/==(.*?)==/g, '<span class="note-highlight">$1</span>');
  
  // Convert lines starting with "- " or "* " to ul/li tags
  const lines = html.split('<br>');
  let inList = false;
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      const content = trimmed.substring(2);
      let res = '';
      if (!inList) {
        res += '<ul>';
        inList = true;
      }
      res += `<li>${content}</li>`;
      return res;
    } else if (trimmed.startsWith('* ')) {
      const content = trimmed.substring(2);
      let res = '';
      if (!inList) {
        res += '<ul>';
        inList = true;
      }
      res += `<li>${content}</li>`;
      return res;
    } else {
      let res = '';
      if (inList) {
        res += '</ul>';
        inList = false;
      }
      res += line;
      return res;
    }
  });
  if (inList) {
    processedLines.push('</ul>');
  }
  html = processedLines.join('<br>');
  html = html.replace(/<br>\s*<ul>/g, '<ul>');
  html = html.replace(/<\/ul>\s*<br>/g, '</ul>');
  
  return html;
}

function updateFormatButtonsActiveStates(container) {
  const boldBtn = container.querySelector('[data-format="bold"]');
  const italicBtn = container.querySelector('[data-format="italic"]');
  const underlineBtn = container.querySelector('[data-format="underline"]');
  const bulletBtn = container.querySelector('[data-format="bullet"]');
  
  if (boldBtn) boldBtn.classList.toggle('active', document.queryCommandState('bold'));
  if (italicBtn) italicBtn.classList.toggle('active', document.queryCommandState('italic'));
  if (underlineBtn) underlineBtn.classList.toggle('active', document.queryCommandState('underline'));
  if (bulletBtn) bulletBtn.classList.toggle('active', document.queryCommandState('insertUnorderedList'));
}

function applyFormatting(textarea, formatType) {
  textarea.focus();
  
  if (formatType === 'bold') {
    document.execCommand('bold', false, null);
  } else if (formatType === 'italic') {
    document.execCommand('italic', false, null);
  } else if (formatType === 'underline') {
    document.execCommand('underline', false, null);
  } else if (formatType === 'bullet') {
    document.execCommand('insertUnorderedList', false, null);
  }
}

// ==========================================================================
/* AUTO-INDEXING SYSTEM CLIENT-SIDE CONTROLLER */
// ==========================================================================
let autoExtractedEntries = [];
let selectedPdfPath = '';

const CYBER_FACTS = [
  "The term 'bug' was coined in 1947 when Grace Hopper found a real moth trapped in a relay of the Harvard Mark II computer.",
  "The first computer virus, 'Creeper', was created in 1971 as an experiment and simply displayed: 'I'm the creeper, catch me if you can!'",
  "Over 90% of all cybersecurity breaches are caused by human error or social engineering (phishing).",
  "SANS stands for SysAdmin, Audit, Network, and Security. It was founded in 1989.",
  "In 2023, the global average cost of a data breach reached $4.45 million.",
  "A strong 12-character password containing letters, numbers, and symbols can take an attacker up to 62 trillion years to crack.",
  "The word 'spam' for junk email comes from a Monty Python sketch where characters repeat 'spam' repeatedly in a restaurant.",
  "The first commercial antivirus software was released in 1987 by John McAfee.",
  "AI models don't actually understand text; they use complex probability and mathematics to predict the next word in a sequence.",
  "The concept of Artificial Intelligence dates back to ancient Greece with myths of robots and mechanical men.",
  "The Turing Test, created by Alan Turing in 1950, measures a machine's ability to exhibit intelligent behavior equivalent to a human.",
  "About 30,000 websites are hacked every single day worldwide.",
  "Captcha stands for: 'Completely Automated Public Turing test to tell Computers and Humans Apart'.",
  "The 'Melissa' virus in 1999 was so successful it forced Microsoft and other companies to shut down their incoming email systems.",
  "The highest bounty ever paid for a single software bug was $2 million for a vulnerability in a cryptocurrency network.",
  "The majority of internet traffic is not generated by humans, but by automated bots and scrapers.",
  "In cybersecurity, 'Red Teaming' refers to offensive security testing, while 'Blue Teaming' refers to defense.",
  "Symmetric encryption uses the same key to encrypt and decrypt data, whereas Asymmetric encryption uses public and private keys.",
  "The 'Stuxnet' worm discovered in 2010 was designed specifically to target and physically damage uranium enrichment centrifuges.",
  "The largest DDoS attack recorded exceeded 3.4 Terabits per second.",
  "The term 'phishing' was coined in the mid-1990s by hackers targeting AOL users' passwords.",
  "Cybersecurity expert SANS courses are widely considered the gold standard of technical training in the industry.",
  "Google's Gemini model uses a mixture-of-experts (MoE) architecture to route queries to specialized sub-networks.",
  "An average SANS textbook page can contain up to 500 potential index candidate words.",
  "OCR (Optical Character Recognition) technology has been in development since the 1920s to help read text for the blind.",
  "The first compiler was created by Grace Hopper in 1952 for the A-0 system.",
  "More than 50% of people use the same password for multiple accounts, despite knowing the security risks.",
  "The most common password in the world is still '123456', followed closely by 'password'.",
  "A 'honeypot' is a decoy computer system designed to attract and analyze cyber attackers.",
  "Zero-day vulnerabilities are security flaws that are exploited before the software creator becomes aware of them.",
  "The word 'cryptography' comes from the Greek words 'kryptos' (hidden) and 'graphein' (writing).",
  "In 1983, the movie 'WarGames' popularized the concept of computer hacking and influenced US federal computer security policies.",
  "The world's first programmer was Ada Lovelace, who wrote an algorithm for Charles Babbage's Analytical Engine in 1843.",
  "In 1997, IBM's Deep Blue became the first computer program to defeat a world chess champion (Garry Kasparov) under tournament conditions.",
  "Ransomware attacks happen globally every 11 seconds.",
  "The concept of neural networks was first proposed in 1943 by Warren McCulloch and Walter Pitts.",
  "SANS GIAC certifications are highly valued by governments and defense agencies worldwide.",
  "A 'Man-in-the-Middle' (MitM) attack occurs when an attacker secretly relays and alters communications between two parties.",
  "Salt is added to passwords before hashing to protect against pre-computed table attacks (like Rainbow Tables).",
  "Machine learning models can occasionally hallucinate facts due to patterns in their training data that don't match reality.",
  "The 'Morris Worm' of 1988 was the first widespread internet worm, infecting about 10% of all computers connected at the time.",
  "A 'Logic Bomb' is code secretly inserted into a software system that will set off a malicious function when specified conditions are met.",
  "Multi-Factor Authentication (MFA) can prevent up to 99% of bulk automated cyberattacks.",
  "WPA3 is the latest security standard for Wi-Fi, offering better protection against dictionary attacks.",
  "Google AI Studio provides developer keys to access Gemini API models with generous free tier request quotas.",
  "The Enigma machine was an electro-mechanical rotor cipher machine used by Germany during World War II.",
  "AI systems are increasingly used by defenders to detect cyber threats in real-time by analyzing network anomalies.",
  "Social engineering relies on psychological triggers like urgency, authority, fear, and curiosity.",
  "The SANS Auto-Indexer tool uses local Python libraries to parse PDF textbooks in memory without sending them to the cloud.",
  "The SANS Auto-Indexer's AI Curation can clean a raw index of 1,000+ words down to under 400 highly distinct SANS concepts."
];

let funFactsIntervalId = null;

function startFunFactsRotation() {
  if (funFactsIntervalId) clearInterval(funFactsIntervalId);
  
  const showRandomFact = () => {
    if (elements.funFactText) {
      const randIdx = Math.floor(Math.random() * CYBER_FACTS.length);
      elements.funFactText.textContent = CYBER_FACTS[randIdx];
    }
  };
  
  showRandomFact();
  funFactsIntervalId = setInterval(showRandomFact, 30000);
}

function stopFunFactsRotation() {
  if (funFactsIntervalId) {
    clearInterval(funFactsIntervalId);
    funFactsIntervalId = null;
  }
}

function initAutoIndexingBindings() {
  // Native File Picker Trigger
  // Native File Picker Trigger (Dashed Drop/Click Area)
  if (elements.autoIndexFileArea) {
    elements.autoIndexFileArea.addEventListener('click', async () => {
      const filePath = await window.api.selectPdfFile();
      if (filePath) {
        selectedPdfPath = filePath;
        elements.autoIndexFileName.textContent = filePath.split(/[\\/]/).pop();
        elements.autoIndexFileName.title = filePath;
        elements.autoIndexFileArea.style.borderColor = 'var(--color-accent)';
        elements.autoIndexFileArea.style.backgroundColor = 'rgba(20, 184, 166, 0.05)';
      }
    });
  }

  // Load and save Gemini API Key and PDF password from/to localStorage
  if (elements.autoIndexGeminiKey && elements.autoIndexUseAi) {
    let isKeyLocked = false;

    const lockSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`;
    const unlockSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`;

    const updateLockUi = () => {
      if (isKeyLocked) {
        elements.autoIndexGeminiKey.readOnly = true;
        elements.autoIndexGeminiKey.style.opacity = '0.7';
        elements.autoIndexGeminiKey.style.cursor = 'not-allowed';
        if (elements.apiKeyLockBtn) {
          elements.apiKeyLockBtn.innerHTML = unlockSvg + '<span>Unlock</span>';
        }
        if (elements.apiKeyStatusIcon) {
          elements.apiKeyStatusIcon.outerHTML = `<i id="api-key-status-icon" class="status-locked" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; color: var(--color-accent); pointer-events: none;">${lockSvg}</i>`;
          elements.apiKeyStatusIcon = document.getElementById('api-key-status-icon');
        }
      } else {
        elements.autoIndexGeminiKey.readOnly = false;
        elements.autoIndexGeminiKey.style.opacity = '1';
        elements.autoIndexGeminiKey.style.cursor = 'text';
        if (elements.apiKeyLockBtn) {
          elements.apiKeyLockBtn.innerHTML = lockSvg + '<span>Lock</span>';
        }
        if (elements.apiKeyStatusIcon) {
          elements.apiKeyStatusIcon.outerHTML = `<i id="api-key-status-icon" class="status-unlocked" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; color: var(--text-muted); pointer-events: none;">${unlockSvg}</i>`;
          elements.apiKeyStatusIcon = document.getElementById('api-key-status-icon');
        }
      }
    };

    if (elements.apiKeyLockBtn) {
      elements.apiKeyLockBtn.addEventListener('click', () => {
        const keyVal = elements.autoIndexGeminiKey.value.trim();
        if (!isKeyLocked && !keyVal) {
          alert("Please enter an API Key first before locking.");
          return;
        }
        localStorage.setItem('gemini_api_key', keyVal);
        isKeyLocked = !isKeyLocked;
        updateLockUi();
      });
    }

    if (elements.getFreeKeyBtn && elements.apiKeyGuideModal) {
      elements.getFreeKeyBtn.addEventListener('click', () => {
        elements.apiKeyGuideModal.showModal();
      });
    }
    if (elements.apiKeyGuideCloseBtn && elements.apiKeyGuideModal) {
      elements.apiKeyGuideCloseBtn.addEventListener('click', () => {
        elements.apiKeyGuideModal.close();
      });
    }
    if (elements.apiKeyGuideCloseX && elements.apiKeyGuideModal) {
      elements.apiKeyGuideCloseX.addEventListener('click', () => {
        elements.apiKeyGuideModal.close();
      });
    }

    const updateAiOptionsVisibility = () => {
      const isEnabled = elements.autoIndexUseAi ? elements.autoIndexUseAi.checked : false;
      if (elements.aiCurationOptionsContainer) {
        if (isEnabled) {
          elements.aiCurationOptionsContainer.classList.remove('hidden');
        } else {
          elements.aiCurationOptionsContainer.classList.add('hidden');
        }
      }
    };

    const validateGeminiKey = () => {
      if (elements.autoIndexUseAi) {
        elements.autoIndexUseAi.disabled = false;
      }
      if (elements.autoIndexGeminiKey) {
        elements.autoIndexGeminiKey.style.borderColor = 'var(--border-color)';
      }
      updateAiOptionsVisibility();
    };

    const LOCAL_SLM_METADATA = {
      '0.5b': { name: 'Qwen 0.5B Instruct (Micro)', size: '~398 MB', ram: '~800 MB RAM', quality: 'Basic', badgeId: 'badge-model-0.5b' },
      '1.5b': { name: 'Qwen 1.5B Instruct (Recommended)', size: '~1.1 GB', ram: '~1.5 GB RAM', quality: 'Good / High', badgeId: 'badge-model-1.5b' },
      '3b': { name: 'Qwen 3B Instruct (Near-Cloud)', size: '~2.0 GB', ram: '~2.8 GB RAM', quality: 'Near-Cloud Quality', badgeId: 'badge-model-3b' }
    };

    const DEFAULT_LOCAL_SLM_PROMPT = `You are a strict SANS Cybersecurity Course Index Curator.
Your sole task is to filter candidate index terms extracted from course materials and KEEP ONLY genuine technical cybersecurity concepts.

### INCLUSION CRITERIA (KEEP):
- Cybersecurity tools, utilities, and software (e.g., Nmap, Wireshark, Mimikatz, Metasploit, Volatility, Sysmon, Snort, Tcpdump, Certify.exe, Rubeus.exe, SharpHound)
- Protocols, network standards, and acronyms (e.g., Kerberos, BGP, IPsec, TLS 1.3, DNSSEC, SNMPv3, ARP, SMBv3)
- Operating system commands, parameters, and flags (e.g., chmod 755, netstat -an, reg add, vssadmin, ps -ef, ls -la)
- System artifacts, registry keys, and file paths (e.g., HKLM\\Software, MFT, NTFS, SAM database, Event ID 4624, Prefetch)
- Attack vectors, vulnerability classes, and malware terms (e.g., Pass-the-Hash, SQL Injection, XSS, Golden Ticket, Buffer Overflow)
- Security frameworks, standards, and laws (e.g., NIST SP 800-53, ISO 27001, MITRE ATT&CK, CIS Controls, HIPAA)

### EXCLUSION CRITERIA (REJECT / DROP):
- Generic textbook headings, section titles, and page markers (e.g., Overview, Introduction, Summary, Discussion, Chapter 1, Figure 2.3, Table of Contents)
- Action verbs, phrasal verbs, or prepositions (e.g., 'turned off', 'setting up', 'getting started', 'looking for', 'used by', 'refer to', 'based on')
- Non-technical English words or generic meta-phrases (e.g., Following Steps, Basic Concept, Main Features, System Configuration, Important Note, Additional Information, Key Takeaway, Best Practices, Module Summary)
- Standalone generic English words unless part of a technical phrase (e.g., reject 'system', 'process', 'method', 'data', 'user' alone; keep 'Access Control List' or 'System Call')

### FEW-SHOT EXAMPLES:
Input: ["Nmap", "Overview of Chapter 2", "Kerberos Authentication", "Turned Off", "Mimikatz", "Following Steps", "Event ID 4624", "Setting Up"]
Output: ["Nmap", "Kerberos Authentication", "Mimikatz", "Event ID 4624"]

Output ONLY a raw JSON array of strings containing the kept terms. Do NOT include any markdown code fences, preambles, or conversational commentary.`;

    if (elements.localSlmCustomPrompt) {
      const savedPrompt = localStorage.getItem('local_slm_prompt');
      elements.localSlmCustomPrompt.value = savedPrompt !== null ? savedPrompt : DEFAULT_LOCAL_SLM_PROMPT;
      elements.localSlmCustomPrompt.addEventListener('input', () => {
        localStorage.setItem('local_slm_prompt', elements.localSlmCustomPrompt.value);
      });
    }

    if (elements.resetLocalPromptBtn && elements.localSlmCustomPrompt) {
      elements.resetLocalPromptBtn.addEventListener('click', () => {
        elements.localSlmCustomPrompt.value = DEFAULT_LOCAL_SLM_PROMPT;
        localStorage.removeItem('local_slm_prompt');
      });
    }

    let selectedLocalModel = localStorage.getItem('local_slm_model') || '1.5b';

    const checkModelStatusAndBadge = async (modelKey) => {
      const meta = LOCAL_SLM_METADATA[modelKey];
      if (!meta) return;
      const badgeEl = document.getElementById(meta.badgeId);
      if (window.api && window.api.checkLocalModelStatus) {
        const status = await window.api.checkLocalModelStatus(modelKey);
        if (badgeEl && status.downloaded) {
          badgeEl.textContent = 'Installed (Offline)';
          badgeEl.className = 'badge badge-success model-status-badge';
        }
      }
    };

    ['0.5b', '1.5b', '3b'].forEach(m => checkModelStatusAndBadge(m));

    let pendingDownloadModelKey = null;

    const promptModelDownloadIfNeeded = async (modelKey) => {
      selectedLocalModel = modelKey;
      localStorage.setItem('local_slm_model', modelKey);

      if (window.api && window.api.checkLocalModelStatus) {
        const status = await window.api.checkLocalModelStatus(modelKey);
        if (!status.downloaded) {
          pendingDownloadModelKey = modelKey;
          const meta = LOCAL_SLM_METADATA[modelKey];
          if (elements.dlModalModelName) elements.dlModalModelName.textContent = meta.name;
          if (elements.dlModalModelDesc) {
            elements.dlModalModelDesc.innerHTML = `File Size: <strong>${meta.size}</strong> | RAM Demand: <strong>${meta.ram}</strong> | Quality: <strong>${meta.quality}</strong>`;
          }
          if (elements.dlModalProgressContainer) elements.dlModalProgressContainer.classList.add('hidden');
          if (elements.dlModalLogs) elements.dlModalLogs.textContent = '[+] Ready to download model weights...';
          if (elements.dlModalStartBtn) {
            elements.dlModalStartBtn.disabled = false;
            elements.dlModalStartBtn.textContent = 'Confirm & Download Model';
          }
          if (elements.modelDownloadConfirmModal) elements.modelDownloadConfirmModal.showModal();
        }
      }
    };

    if (elements.dlModalCancelBtn && elements.modelDownloadConfirmModal) {
      elements.dlModalCancelBtn.addEventListener('click', () => elements.modelDownloadConfirmModal.close());
    }
    if (elements.dlModalCloseX && elements.modelDownloadConfirmModal) {
      elements.dlModalCloseX.addEventListener('click', () => elements.modelDownloadConfirmModal.close());
    }

    if (elements.dlModalStartBtn && elements.modelDownloadConfirmModal) {
      elements.dlModalStartBtn.addEventListener('click', async () => {
        if (!pendingDownloadModelKey) return;
        elements.dlModalStartBtn.disabled = true;
        elements.dlModalStartBtn.textContent = 'Downloading...';
        if (elements.dlModalProgressContainer) elements.dlModalProgressContainer.classList.remove('hidden');

        if (window.api && window.api.onModelDownloadProgress) {
          window.api.onModelDownloadProgress((data) => {
            if (elements.dlModalLogs) {
              elements.dlModalLogs.textContent += '\n' + data.text;
              elements.dlModalLogs.scrollTop = elements.dlModalLogs.scrollHeight;
            }
          });
        }

        const res = await window.api.downloadLocalModel(pendingDownloadModelKey);
        if (res.success) {
          if (elements.dlModalStatusText) elements.dlModalStatusText.textContent = '✅ Download Completed Successfully!';
          if (elements.dlModalStartBtn) elements.dlModalStartBtn.textContent = 'Done!';
          checkModelStatusAndBadge(pendingDownloadModelKey);
          setTimeout(() => {
            elements.modelDownloadConfirmModal.close();
          }, 1200);
        } else {
          if (elements.dlModalStatusText) elements.dlModalStatusText.textContent = '❌ Download Error';
          if (elements.dlModalStartBtn) {
            elements.dlModalStartBtn.disabled = false;
            elements.dlModalStartBtn.textContent = 'Retry Download';
          }
        }
      });
    }

    const setCurationEngine = (engineVal, modelKey = null) => {
      if (elements.autoIndexCurationEngine) {
        elements.autoIndexCurationEngine.value = engineVal;
      }
      localStorage.setItem('curation_engine', engineVal);

      if (modelKey) {
        selectedLocalModel = modelKey;
        localStorage.setItem('local_slm_model', modelKey);
      } else {
        modelKey = localStorage.getItem('local_slm_model') || '1.5b';
      }

      if (elements.curationCardGemini) elements.curationCardGemini.classList.toggle('active', engineVal === 'gemini');
      if (elements.curationCardLocal05b) elements.curationCardLocal05b.classList.toggle('active', engineVal === 'local-slm' && modelKey === '0.5b');
      if (elements.curationCardLocal15b) elements.curationCardLocal15b.classList.toggle('active', engineVal === 'local-slm' && modelKey === '1.5b');
      if (elements.curationCardLocal3b) elements.curationCardLocal3b.classList.toggle('active', engineVal === 'local-slm' && modelKey === '3b');

      if (elements.geminiSettingsContainer) {
        if (engineVal === 'gemini') {
          elements.geminiSettingsContainer.classList.remove('hidden');
        } else {
          elements.geminiSettingsContainer.classList.add('hidden');
        }
      }
      if (elements.localSlmInfoContainer) {
        if (engineVal === 'local-slm') {
          elements.localSlmInfoContainer.classList.remove('hidden');
        } else {
          elements.localSlmInfoContainer.classList.add('hidden');
        }
      }

      if (elements.curationEngineBadge) {
        if (engineVal === 'local-slm') {
          const modelName = LOCAL_SLM_METADATA[modelKey] ? LOCAL_SLM_METADATA[modelKey].name.split(' ')[1] : modelKey.toUpperCase();
          elements.curationEngineBadge.textContent = `⚡ Local Qwen ${modelName}`;
          elements.curationEngineBadge.className = 'badge badge-info';
        } else {
          elements.curationEngineBadge.textContent = 'Cloud Gemini';
          elements.curationEngineBadge.className = 'badge badge-success';
        }
      }

      validateGeminiKey();
    };

    if (elements.curationCardGemini) {
      elements.curationCardGemini.addEventListener('click', () => setCurationEngine('gemini'));
    }
    if (elements.curationCardLocal05b) {
      elements.curationCardLocal05b.addEventListener('click', () => {
        setCurationEngine('local-slm', '0.5b');
        promptModelDownloadIfNeeded('0.5b');
      });
    }
    if (elements.curationCardLocal15b) {
      elements.curationCardLocal15b.addEventListener('click', () => {
        setCurationEngine('local-slm', '1.5b');
        promptModelDownloadIfNeeded('1.5b');
      });
    }
    if (elements.curationCardLocal3b) {
      elements.curationCardLocal3b.addEventListener('click', () => {
        setCurationEngine('local-slm', '3b');
        promptModelDownloadIfNeeded('3b');
      });
    }

    if (elements.autoIndexCurationEngine) {
      elements.autoIndexCurationEngine.addEventListener('change', () => {
        setCurationEngine(elements.autoIndexCurationEngine.value);
      });
    }

    const savedEngine = localStorage.getItem('curation_engine') || 'gemini';
    const savedModel = localStorage.getItem('local_slm_model') || '1.5b';
    setCurationEngine(savedEngine, savedModel);

    const initialKey = localStorage.getItem('gemini_api_key') || '';
    elements.autoIndexGeminiKey.value = initialKey;

    // Checkbox restore
    const savedUseAi = localStorage.getItem('use_gemini_ai') === 'true';
    if (elements.autoIndexUseAi) {
      elements.autoIndexUseAi.checked = savedUseAi;
    }

    validateGeminiKey();

    // Auto-lock on startup if key is present
    if (initialKey) {
      isKeyLocked = true;
      updateLockUi();
    } else {
      isKeyLocked = false;
      updateLockUi();
    }

    elements.autoIndexGeminiKey.addEventListener('input', () => {
      localStorage.setItem('gemini_api_key', elements.autoIndexGeminiKey.value.trim());
      validateGeminiKey();
    });

    elements.autoIndexUseAi.addEventListener('change', () => {
      localStorage.setItem('use_gemini_ai', elements.autoIndexUseAi.checked);
      updateAiOptionsVisibility();
    });

    // Model selection persistence and sync
    if (elements.autoIndexModelSelect) {
      const savedModel = localStorage.getItem('gemini_model') || 'gemini-flash-latest';
      elements.autoIndexModelSelect.value = savedModel;
      if (elements.aiCurationRetryModelSelect) {
        elements.aiCurationRetryModelSelect.value = savedModel;
      }
      
      elements.autoIndexModelSelect.addEventListener('change', () => {
        localStorage.setItem('gemini_model', elements.autoIndexModelSelect.value);
        if (elements.aiCurationRetryModelSelect) {
          elements.aiCurationRetryModelSelect.value = elements.autoIndexModelSelect.value;
        }
      });
    }

    if (elements.aiCurationRetryModelSelect) {
      elements.aiCurationRetryModelSelect.addEventListener('change', () => {
        localStorage.setItem('gemini_model', elements.aiCurationRetryModelSelect.value);
        if (elements.autoIndexModelSelect) {
          elements.autoIndexModelSelect.value = elements.aiCurationRetryModelSelect.value;
        }
      });
    }
  }

  if (elements.autoIndexPassword) {
    elements.autoIndexPassword.value = localStorage.getItem('sans_pdf_password') || '';
    elements.autoIndexPassword.addEventListener('input', () => {
      localStorage.setItem('sans_pdf_password', elements.autoIndexPassword.value.trim());
    });
  }

  if (elements.autoIndexFname) {
    elements.autoIndexFname.value = localStorage.getItem('sans_fname') || '';
    elements.autoIndexFname.addEventListener('input', () => {
      localStorage.setItem('sans_fname', elements.autoIndexFname.value.trim());
    });
  }

  if (elements.autoIndexLname) {
    elements.autoIndexLname.value = localStorage.getItem('sans_lname') || '';
    elements.autoIndexLname.addEventListener('input', () => {
      localStorage.setItem('sans_lname', elements.autoIndexLname.value.trim());
    });
  }

  if (elements.autoIndexEmail) {
    elements.autoIndexEmail.value = localStorage.getItem('sans_email') || '';
    elements.autoIndexEmail.addEventListener('input', () => {
      localStorage.setItem('sans_email', elements.autoIndexEmail.value.trim());
    });
  }

  // Collapsible Dependency Checker
  if (elements.autoIndexDepToggle && elements.autoIndexDepContent) {
    // Keep it expanded by default
    elements.autoIndexDepToggle.classList.add('active');
    
    elements.autoIndexDepToggle.addEventListener('click', () => {
      elements.autoIndexDepToggle.classList.toggle('active');
      elements.autoIndexDepContent.classList.toggle('hidden');
      const icon = elements.autoIndexDepToggle.querySelector('.collapse-icon');
      if (icon) {
        icon.style.transform = elements.autoIndexDepToggle.classList.contains('active') ? 'rotate(0deg)' : 'rotate(-180deg)';
      }
    });
  }
  // Tab Switching
  const tabButtons = document.querySelectorAll('.workspace-tabs .tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetTab = btn.getAttribute('data-view-tab');
      if (targetTab === 'manual-index') {
        elements.manualIndexView.classList.remove('hidden');
        elements.autoIndexView.classList.add('hidden');
        if (elements.notesEditorView) elements.notesEditorView.classList.add('hidden');
      } else if (targetTab === 'auto-index') {
        elements.manualIndexView.classList.add('hidden');
        elements.autoIndexView.classList.remove('hidden');
        if (elements.notesEditorView) elements.notesEditorView.classList.add('hidden');
        runDependencyCheck();
      } else if (targetTab === 'notes-editor') {
        elements.manualIndexView.classList.add('hidden');
        elements.autoIndexView.classList.add('hidden');
        if (!elements.notesEditorView) elements.notesEditorView = document.getElementById('notes-editor-view');
        if (elements.notesEditorView) elements.notesEditorView.classList.remove('hidden');
        if (typeof initNotesEditor === 'function') initNotesEditor();
        if (window.lucide) lucide.createIcons();
        if (typeof updateNotesStats === 'function') updateNotesStats();
      }
    });
  });

  // Settings Accordion
  if (elements.autoIndexSettingsToggle) {
    elements.autoIndexSettingsToggle.addEventListener('click', () => {
      elements.autoIndexSettingsToggle.classList.toggle('active');
      elements.autoIndexSettingsContent.classList.toggle('hidden');
      const icon = elements.autoIndexSettingsToggle.querySelector('.collapse-icon');
      if (icon) {
        icon.style.transform = elements.autoIndexSettingsToggle.classList.contains('active') ? 'rotate(90deg)' : 'rotate(0deg)';
      }
    });
  }

  // Generic Dependency Installation Triggers
  const installButtons = document.querySelectorAll('.dep-install-btn');
  installButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dependencyName = btn.getAttribute('data-dep');
      const element = btn.closest('.dependency-item');
      handleDependencyInstall(dependencyName, element);
    });
  });

  // Auto Index Form Submission
  if (elements.autoIndexForm) {
    elements.autoIndexForm.addEventListener('submit', handleAutoIndexSubmit);
  }

  // Verification preview actions
  if (elements.previewSelectAll) {
    elements.previewSelectAll.addEventListener('click', () => {
      const checkboxes = elements.previewTableBody.querySelectorAll('.preview-row-checkbox');
      checkboxes.forEach(cb => cb.checked = true);
      updateSelectedCount();
    });
  }

  if (elements.previewSelectNone) {
    elements.previewSelectNone.addEventListener('click', () => {
      const checkboxes = elements.previewTableBody.querySelectorAll('.preview-row-checkbox');
      checkboxes.forEach(cb => cb.checked = false);
      updateSelectedCount();
    });
  }

  if (elements.previewHeaderCheckbox) {
    elements.previewHeaderCheckbox.addEventListener('change', (e) => {
      const checkboxes = elements.previewTableBody.querySelectorAll('.preview-row-checkbox');
      checkboxes.forEach(cb => cb.checked = e.target.checked);
      updateSelectedCount();
    });
  }

  if (elements.previewSearchInput) {
    elements.previewSearchInput.addEventListener('keyup', () => {
      filterPreviewTable();
    });
  }

  if (elements.previewCancelBtn) {
    elements.previewCancelBtn.addEventListener('click', () => {
      elements.verificationPreviewSection.classList.add('hidden');
      elements.autoIndexForm.closest('section').classList.remove('hidden');
      if (elements.aiCurationErrorAlert) {
        elements.aiCurationErrorAlert.classList.add('hidden');
      }
      if (elements.quizGenerationErrorAlert) {
        elements.quizGenerationErrorAlert.classList.add('hidden');
      }
      
      wizardCurrentStep = 1;
      updateWizardUI();
    });
  }

  if (elements.previewImportCheckedBtn) {
    elements.previewImportCheckedBtn.addEventListener('click', handleImportCheckedEntries);
  }

  if (elements.aiCurationRetryBtn) {
    elements.aiCurationRetryBtn.addEventListener('click', async () => {
      const geminiApiKey = elements.autoIndexGeminiKey ? elements.autoIndexGeminiKey.value.trim() : '';
      const geminiModel = elements.autoIndexModelSelect ? elements.autoIndexModelSelect.value : 'gemini-flash-latest';
      if (!geminiApiKey) {
        alert("Please enter a valid Gemini API key first to retry AI curation.");
        return;
      }
      
      elements.verificationPreviewSection.classList.add('hidden');
      elements.indexingProgressSection.classList.remove('hidden');
      elements.indexingProgressStatus.textContent = 'Retrying Gemini AI Curation...';
      
      startFunFactsRotation();

      const removeProgressListener = window.api.onAutoIndexProgress((progress) => {
        if (progress.step === 'curating') {
          if (progress.isOverloaded) {
            elements.indexingProgressStatus.innerHTML = `
              <div style="font-size: 1.1rem; font-weight: 600; color: #eab308; line-height: 1.4; max-width: 550px; margin-left: auto; margin-right: auto;">
                ${progress.message || 'Gemini models are experiencing high volumes of traffic right now. Hang tight while we try again 🤙'}
              </div>
              <div style="font-size: 0.88rem; font-weight: 500; color: var(--text-secondary); margin-top: 8px;">
                Attempt ${progress.attempt}/${progress.maxAttempts}
              </div>
            `;
          } else {
            elements.indexingProgressStatus.innerHTML = `
              Running Gemini AI Curation...
              <div style="font-size: 0.8rem; font-weight: normal; color: var(--text-secondary); margin-top: 8px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.4;">
                Note: This process can take a few minutes (5-10 minutes is expected for large books).
              </div>
            `;
          }
        } else {
          elements.indexingProgressStatus.textContent = progress.message;
        }
      });

      try {
        const result = await window.api.retryCuration({ entries: autoExtractedEntries, geminiApiKey, geminiModel });
        elements.indexingProgressSection.classList.add('hidden');
        stopFunFactsRotation();

        if (result.success) {
          autoExtractedEntries = result.entries;
          if (elements.aiCurationErrorAlert) {
            elements.aiCurationErrorAlert.classList.add('hidden');
          }
          alert("AI Curation retry succeeded! The list has been successfully cleaned.");
        } else {
          if (elements.aiCurationErrorText) {
            elements.aiCurationErrorText.textContent = result.error;
          }
          if (elements.aiCurationErrorAlert) {
            elements.aiCurationErrorAlert.classList.remove('hidden');
          }
          alert("AI Curation failed again: " + result.error);
        }
      } catch (err) {
        alert("An unexpected error occurred during retry: " + err.message);
        elements.indexingProgressSection.classList.add('hidden');
        stopFunFactsRotation();
      } finally {
        if (removeProgressListener && typeof removeProgressListener === 'function') {
          removeProgressListener();
        }
        window.api.removeListener('auto-index-progress');
        elements.verificationPreviewSection.classList.remove('hidden');
        renderVerificationTable();
      }
    });
  }

  // Initialize wizard logic
  initAutoIndexWizard();

  // Practice Quiz button inside header
  if (elements.practiceQuizBtn) {
    const newQuizBtn = elements.practiceQuizBtn.cloneNode(true);
    elements.practiceQuizBtn.parentNode.replaceChild(newQuizBtn, elements.practiceQuizBtn);
    elements.practiceQuizBtn = newQuizBtn;
    
    elements.practiceQuizBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert("Practice Quiz - Feature Coming Soon!\n\nWe are currently optimizing the quiz engine for reduced token consumption and local AI model support.");
    });
  }

  // Quiz config dialog bindings
  if (elements.quizConfigForm) {
    const newForm = elements.quizConfigForm.cloneNode(true);
    elements.quizConfigForm.parentNode.replaceChild(newForm, elements.quizConfigForm);
    elements.quizConfigForm = newForm;
    elements.quizConfigForm.addEventListener('submit', handleQuizConfigSubmit);
    
    elements.quizConfigBooksChecklist = document.getElementById('quiz-config-books-checklist');
    elements.quizConfigCount = document.getElementById('quiz-config-count');
    elements.quizConfigDifficulty = document.getElementById('quiz-config-difficulty');
    elements.quizConfigFeedback = document.getElementById('quiz-config-feedback');
    elements.quizConfigCloseBtn = document.getElementById('quiz-config-close-btn');
  }
  
  if (elements.quizConfigCloseBtn) {
    elements.quizConfigCloseBtn.addEventListener('click', () => {
      if (elements.quizConfigDialog) elements.quizConfigDialog.close();
    });
  }

  // Quiz Practice View Exit & Next bindings
  if (elements.quizExitBtn) {
    elements.quizExitBtn.addEventListener('click', handleQuizExit);
  }

  if (elements.quizNextQuestionBtn) {
    elements.quizNextQuestionBtn.addEventListener('click', handleQuizNextClick);
  }

  // Scorecard View retry & close bindings
  if (elements.scorecardRetryBtn) {
    elements.scorecardRetryBtn.addEventListener('click', retryQuizSession);
  }

  if (elements.scorecardCloseBtn) {
    elements.scorecardCloseBtn.addEventListener('click', exitQuizMode);
  }
}

async function runDependencyCheck() {
  document.querySelectorAll('.dep-progress-container').forEach(c => c.classList.add('hidden'));
  document.querySelectorAll('.dep-install-btn').forEach(b => b.classList.add('hidden'));
  document.querySelectorAll('.dep-action-container').forEach(a => a.classList.remove('hidden'));

  updateDependencyUI(elements.depPython, 'Checking...', 'circle-help', 'warning');
  updateDependencyUI(elements.depQpdf, 'Checking...', 'circle-help', 'warning');
  updateDependencyUI(elements.depPdftotext, 'Checking...', 'circle-help', 'warning');
  updateDependencyUI(elements.depOcr, 'Checking...', 'circle-help', 'warning');
  
  elements.depWarnings.classList.add('hidden');
  elements.startIndexingBtn.disabled = true;

  try {
    const deps = await window.api.checkDependencies();
    
    // Python
    if (deps.python) {
      updateDependencyUI(elements.depPython, 'Installed', 'check-circle-2', 'success', false, 'python');
    } else {
      updateDependencyUI(elements.depPython, 'Missing', 'alert-circle', 'error', true, 'python');
    }

    // qpdf
    if (deps.qpdf) {
      updateDependencyUI(elements.depQpdf, 'Installed', 'check-circle-2', 'success', false, 'qpdf');
    } else {
      updateDependencyUI(elements.depQpdf, 'Missing', 'alert-circle', 'error', true, 'qpdf');
    }

    // pdftotext
    if (deps.pdftotext) {
      updateDependencyUI(elements.depPdftotext, 'Installed', 'check-circle-2', 'success', false, 'pdftotext');
    } else {
      updateDependencyUI(elements.depPdftotext, 'Not Found (Fallback active)', 'alert-triangle', 'warning', true, 'pdftotext');
    }

    // OCR
    if (deps.ocr) {
      updateDependencyUI(elements.depOcr, 'Ready', 'check-circle-2', 'success', false, 'ocr');
      elements.autoIndexUseOcr.disabled = false;
    } else {
      updateDependencyUI(elements.depOcr, 'Not Installed', 'alert-triangle', 'warning', deps.python, 'ocr');
      elements.autoIndexUseOcr.disabled = true;
      elements.autoIndexUseOcr.checked = false;
    }

    // Setup Warnings Alerts
    const isMac = (navigator.platform && navigator.platform.toUpperCase().indexOf('MAC') >= 0) || (navigator.userAgent && navigator.userAgent.includes('Mac'));
    const warnings = [];
    if (!deps.python) {
      const pyCmd = isMac ? 'brew install python' : 'winget install Python.Python.3.12';
      warnings.push(`<li><strong>Python is missing:</strong> Python 3.10+ is required. Click Install, or run <code>${pyCmd}</code></li>`);
    }
    if (!deps.qpdf) {
      const qpdfCmd = isMac ? 'brew install qpdf' : 'winget install QPDF.QPDF';
      warnings.push(`<li><strong>qpdf is missing:</strong> Decryption of password-protected SANS books will fail. Click Install, or run <code>${qpdfCmd}</code></li>`);
    }
    if (!deps.pdftotext) {
      const popplerCmd = isMac ? 'brew install poppler' : 'winget install oschwartz10612.Poppler';
      warnings.push(`<li><strong>pdftotext not found:</strong> The app will fall back to direct PDF text extraction. Click Install, or run <code>${popplerCmd}</code></li>`);
    }

    // Update overall badge
    if (elements.depOverallBadge) {
      if (deps.python && deps.qpdf) {
        if (deps.ocr) {
          elements.depOverallBadge.textContent = 'Ready';
          elements.depOverallBadge.className = 'badge badge-success';
        } else {
          elements.depOverallBadge.textContent = 'OCR Missing (Optional)';
          elements.depOverallBadge.className = 'badge badge-warning';
        }
        
        // Auto-collapse dependency checker if everything is ready to save space
        if (elements.autoIndexDepToggle && elements.autoIndexDepContent && elements.autoIndexDepToggle.classList.contains('active')) {
          elements.autoIndexDepToggle.classList.remove('active');
          elements.autoIndexDepContent.classList.add('hidden');
          const icon = elements.autoIndexDepToggle.querySelector('.collapse-icon');
          if (icon) {
            icon.style.transform = 'rotate(-180deg)';
          }
        }
      } else {
        elements.depOverallBadge.textContent = 'Attention Required';
        elements.depOverallBadge.className = 'badge badge-danger';
        
        // Auto-expand dependency checker if things are missing
        if (elements.autoIndexDepToggle && elements.autoIndexDepContent && !elements.autoIndexDepToggle.classList.contains('active')) {
          elements.autoIndexDepToggle.classList.add('active');
          elements.autoIndexDepContent.classList.remove('hidden');
          const icon = elements.autoIndexDepToggle.querySelector('.collapse-icon');
          if (icon) {
            icon.style.transform = 'rotate(0deg)';
          }
        }
      }
    }

    if (warnings.length > 0) {
      elements.depWarnings.innerHTML = `<strong>Attention Required:</strong><ul>${warnings.join('')}</ul>`;
      elements.depWarnings.classList.remove('hidden');
    }

    if (deps.python && deps.qpdf) {
      elements.startIndexingBtn.disabled = false;
    }

  } catch (err) {
    console.error("Dependency check failed:", err);
  }
}

function updateDependencyUI(element, label, iconName, statusClass, showInstall = false, depName = '') {
  element.className = `dependency-item ${statusClass}`;
  const icon = element.querySelector('.status-icon');
  if (icon) {
    icon.setAttribute('data-lucide', iconName);
  }
  const labelSpan = element.querySelector('.status-label');
  if (labelSpan) {
    labelSpan.textContent = label;
  }
  
  const installBtn = element.querySelector('.dep-install-btn');
  if (installBtn) {
    if (showInstall) {
      installBtn.classList.remove('hidden');
    } else {
      installBtn.classList.add('hidden');
    }
  }

  lucide.createIcons({
    attrs: { class: 'lucide-icon status-icon' },
    nameAttr: 'data-lucide',
    nodeList: [icon]
  });
}

async function handleDependencyInstall(dependencyName, element) {
  const actionContainer = element.querySelector('.dep-action-container');
  if (actionContainer) actionContainer.classList.add('hidden');
  
  const progressContainer = element.querySelector('.dep-progress-container');
  progressContainer.classList.remove('hidden');
  
  const fill = progressContainer.querySelector('.progress-bar-fill');
  const percentLabel = progressContainer.querySelector('.dep-progress-label');
  fill.style.width = '5%';
  percentLabel.textContent = '5%';

  // Show log console
  elements.depInstallConsole.classList.remove('hidden');
  elements.depInstallActiveTxt.textContent = `Installing ${dependencyName}...`;
  elements.depInstallLogTerminal.textContent = `Starting installer for ${dependencyName}...\n`;

  window.api.onDepInstallStatus((data) => {
    if (data.dependency === dependencyName) {
      fill.style.width = `${data.percent}%`;
      percentLabel.textContent = `${data.percent}%`;
      const labelSpan = element.querySelector('.status-label');
      if (labelSpan) {
        labelSpan.textContent = data.status;
      }
    }
  });

  window.api.onDepInstallLog((log) => {
    elements.depInstallLogTerminal.textContent += log;
    elements.depInstallLogTerminal.scrollTop = elements.depInstallLogTerminal.scrollHeight;
  });

  try {
    const res = await window.api.installDependency(dependencyName);
    if (res.success) {
      alert(`Successfully installed ${dependencyName}!`);
    }
  } catch (err) {
    alert(`Failed to install ${dependencyName}: ${err.message}\n\nPlease try installing manually.`);
  } finally {
    window.api.removeListener('dep-install-status');
    window.api.removeListener('dep-install-log');
    runDependencyCheck();
  }
}

async function handleAutoIndexSubmit(e) {
  e.preventDefault();
  
  if (!state.currentCourseId) {
    alert("Please select or create a course first!");
    return;
  }
  
  const bookId = elements.autoIndexBookSelect.value;
  if (!bookId) {
    alert("Please select a target book to assign the index terms.");
    return;
  }

  if (!selectedPdfPath) {
    alert("Please select a SANS PDF book first using the Select SANS PDF Book button.");
    return;
  }

  const pdfPath = selectedPdfPath;
  const password = elements.autoIndexPassword.value.trim();
  const fname = elements.autoIndexFname.value.trim();
  const lname = elements.autoIndexLname.value.trim();
  const email = elements.autoIndexEmail.value.trim();
  const useAi = elements.autoIndexUseAi ? elements.autoIndexUseAi.checked : false;
  const geminiModel = elements.autoIndexModelSelect ? elements.autoIndexModelSelect.value : 'gemini-flash-latest';
  const geminiApiKey = useAi && elements.autoIndexGeminiKey ? elements.autoIndexGeminiKey.value.trim() : '';
  
  const curationEngine = elements.autoIndexCurationEngine ? elements.autoIndexCurationEngine.value : 'gemini';
  const selectedLocalModel = localStorage.getItem('local_slm_model') || '1.5b';
  
  const settings = {
    curationEngine: useAi ? curationEngine : 'none',
    localSlmModel: selectedLocalModel,
    localSlmPrompt: elements.localSlmCustomPrompt ? elements.localSlmCustomPrompt.value.trim() : '',
    offset: parseInt(elements.autoIndexOffset.value) || 0,
    minLength: parseInt(elements.autoIndexMinLen.value) || 2,
    maxLength: parseInt(elements.autoIndexMaxLen.value) || 50,
    minFrequency: parseInt(elements.autoIndexMinFreq.value) || 1,
    maxFrequency: parseInt(elements.autoIndexMaxFreq.value) || 10,
    zipf: parseFloat(elements.autoIndexZipf.value) || 4.0,
    useOcr: elements.autoIndexUseOcr.checked,
    generateQuiz: elements.autoIndexGenerateQuiz ? elements.autoIndexGenerateQuiz.checked : false,
    quizCount: parseInt(elements.autoIndexQuizCount.value) || 10,
    quizDifficulty: elements.autoIndexQuizDifficulty.value || 'Conceptual'
  };

  const startProcess = () => {
    elements.autoIndexForm.closest('section').classList.add('hidden');
    elements.indexingProgressSection.classList.remove('hidden');
    elements.indexingProgressStatus.textContent = 'Initializing Auto-Indexer...';
    
    // Start fun facts rotation
    startFunFactsRotation();

    window.api.onAutoIndexProgress((progress) => {
      // Dynamic loading warnings for AI curation/quiz step
      if (progress.step === 'curating-slm') {
        elements.indexingProgressStatus.innerHTML = `
          <div style="font-size: 1.1rem; font-weight: 600; color: #38bdf8; line-height: 1.4;">
            ⚡ Running Local 0.5B SLM Curation Engine...
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 6px;">
            Filtering noise words & merging duplicates 100% offline
          </div>
        `;
      } else if (progress.step === 'curating') {
        if (progress.isOverloaded) {
          elements.indexingProgressStatus.innerHTML = `
            <div style="font-size: 1.1rem; font-weight: 600; color: #eab308; line-height: 1.4; max-width: 550px; margin-left: auto; margin-right: auto;">
              ${progress.message || 'Gemini models are experiencing high volumes of traffic right now. Hang tight while we try again 🤙'}
            </div>
            <div style="font-size: 0.88rem; font-weight: 500; color: var(--text-secondary); margin-top: 8px;">
              Attempt ${progress.attempt}/${progress.maxAttempts}
            </div>
          `;
        } else {
          elements.indexingProgressStatus.innerHTML = `
            Running Gemini AI Curation...
            <div style="font-size: 0.8rem; font-weight: normal; color: var(--text-secondary); margin-top: 8px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.4;">
              Note: This process can take a few minutes (5-10 minutes is expected for large books).
            </div>
          `;
        }
      } else if (progress.step === 'quiz-generating') {
        elements.indexingProgressStatus.innerHTML = `
          Generating Practice Quiz...
          <div style="font-size: 0.8rem; font-weight: normal; color: var(--text-secondary); margin-top: 8px; max-width: 500px; margin-left: auto; margin-right: auto; line-height: 1.4;">
            ${progress.message || 'Prompting Gemini to write Cybersecurity Practice questions...'}
          </div>
        `;
      } else {
        elements.indexingProgressStatus.textContent = progress.message;
      }
    });

    window.api.runAutoIndex({ pdfPath, password, fname, lname, email, geminiApiKey, geminiModel, settings })
      .then((result) => {
        elements.indexingProgressSection.classList.add('hidden');
        stopFunFactsRotation();
        
        if (result.success) {
          autoExtractedEntries = result.entries;
          
          let addedQuestions = false;
          if (result.quizGenerated && result.quizQuestions && result.quizQuestions.length > 0) {
            if (!state.quizzes) state.quizzes = [];
            const newQuiz = {
              id: 'quiz-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
              courseId: state.currentCourseId,
              bookId: bookId,
              difficulty: settings.quizDifficulty,
              questions: result.quizQuestions,
              createdAt: new Date().toISOString()
            };
            state.quizzes.push(newQuiz);
            saveState();
            addedQuestions = true;
          }
          
          lastQuizError = result.quizError;

          if (autoExtractedEntries.length === 0) {
            alert("Auto-indexing completed, but no words or phrases matched your filter settings. Try adjusting the parameters and try again.");
            elements.autoIndexForm.closest('section').classList.remove('hidden');
          } else {
            if (addedQuestions && elements.quizNewQuestionsToast) {
              elements.quizNewQuestionsToast.classList.remove('hidden');
              
              if (window.quizToastTimeout) {
                clearTimeout(window.quizToastTimeout);
              }
              window.quizToastTimeout = setTimeout(() => {
                elements.quizNewQuestionsToast.classList.add('hidden');
              }, 8000);
            }
            // Display AI curation error if it occurred
            if (elements.aiCurationErrorAlert && elements.aiCurationErrorText) {
              if (result.curationError) {
                elements.aiCurationErrorText.textContent = result.curationError;
                elements.aiCurationErrorAlert.classList.remove('hidden');
              } else {
                elements.aiCurationErrorAlert.classList.add('hidden');
              }
            }

            // Display Quiz generation error if it occurred
            if (elements.quizGenerationErrorAlert && elements.quizGenerationErrorText) {
              if (result.quizError) {
                elements.quizGenerationErrorText.textContent = result.quizError;
                elements.quizGenerationErrorAlert.classList.remove('hidden');
              } else {
                elements.quizGenerationErrorAlert.classList.add('hidden');
              }
            }
            
            elements.verificationPreviewSection.classList.remove('hidden');
            renderVerificationTable();
          }
        } else {
          alert("Error building index: " + result.error);
          elements.autoIndexForm.closest('section').classList.remove('hidden');
        }
      })
      .catch((err) => {
        alert("An unexpected error occurred during indexing: " + err.message);
        elements.indexingProgressSection.classList.add('hidden');
        elements.autoIndexForm.closest('section').classList.remove('hidden');
        stopFunFactsRotation();
      })
      .finally(() => {
        window.api.removeListener('auto-index-progress');
      });
  };

  // If AI Curation is enabled, show the warning modal first
  if (useAi && elements.aiCurationConfirmModal) {
    // Show confirmation modal
    elements.aiCurationConfirmModal.showModal();

    // Event listener for Go Back (Cancel)
    const handleCancel = () => {
      elements.aiCurationConfirmModal.close();
      cleanupListeners();
    };

    // Event listener for Continue
    const handleContinue = () => {
      elements.aiCurationConfirmModal.close();
      cleanupListeners();
      startProcess();
    };

    const cleanupListeners = () => {
      elements.aiCurationCancelBtn.removeEventListener('click', handleCancel);
      elements.aiCurationContinueBtn.removeEventListener('click', handleContinue);
    };

    elements.aiCurationCancelBtn.addEventListener('click', handleCancel);
    elements.aiCurationContinueBtn.addEventListener('click', handleContinue);
  } else {
    // Run immediately without modal
    startProcess();
  }
}

function renderVerificationTable() {
  elements.previewTableBody.innerHTML = '';
  elements.previewHeaderCheckbox.checked = true;
  elements.previewSearchInput.value = '';

  autoExtractedEntries.forEach((entry, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'preview-row';
    tr.innerHTML = `
      <td style="text-align: center;">
        <input type="checkbox" class="preview-row-checkbox" checked data-idx="${idx}">
      </td>
      <td>
        <input type="text" class="preview-topic-input" value="${escapeHtml(entry.topic)}" data-idx="${idx}">
      </td>
      <td style="width: 150px;">
        <input type="text" class="preview-pages-input" value="${escapeHtml(compressPageList(entry.pages))}" data-idx="${idx}">
      </td>
      <td>
        <input type="text" class="preview-notes-input" placeholder="Optional notes context..." data-idx="${idx}">
      </td>
    `;
    elements.previewTableBody.appendChild(tr);
  });

  elements.previewTableBody.querySelectorAll('.preview-row-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      updateSelectedCount();
    });
  });

  updateSelectedCount();
}

function updateSelectedCount() {
  const selectedCbs = elements.previewTableBody.querySelectorAll('.preview-row-checkbox:checked');
  elements.previewSelectedCount.textContent = `${selectedCbs.length} items selected`;
  if (elements.previewImportCheckedBtn) {
    elements.previewImportCheckedBtn.disabled = (selectedCbs.length === 0);
  }
}

function filterPreviewTable() {
  const query = elements.previewSearchInput.value.toLowerCase().trim();
  const rows = elements.previewTableBody.querySelectorAll('.preview-row');
  
  rows.forEach(row => {
    const topicVal = row.querySelector('.preview-topic-input').value.toLowerCase();
    const pagesVal = row.querySelector('.preview-pages-input').value.toLowerCase();
    const notesVal = row.querySelector('.preview-notes-input').value.toLowerCase();
    
    if (!query || topicVal.includes(query) || pagesVal.includes(query) || notesVal.includes(query)) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

async function handleImportCheckedEntries() {
  const selectedRows = elements.previewTableBody.querySelectorAll('.preview-row');
  const targetBookId = elements.autoIndexBookSelect.value;
  
  let importCount = 0;
  selectedRows.forEach(row => {
    const checkbox = row.querySelector('.preview-row-checkbox');
    if (checkbox.checked) {
      const idx = checkbox.getAttribute('data-idx');
      const topicInput = row.querySelector('.preview-topic-input');
      const pagesInput = row.querySelector('.preview-pages-input');
      const notesInput = row.querySelector('.preview-notes-input');
      
      const isAiCurated = elements.autoIndexUseAi && elements.autoIndexUseAi.checked && (!elements.aiCurationErrorAlert || elements.aiCurationErrorAlert.classList.contains('hidden'));

      const newEntry = {
        id: 'entry-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9) + '-' + importCount,
        courseId: state.currentCourseId,
        bookId: targetBookId,
        topic: topicInput.value.trim(),
        pages: compressPageList(pagesInput.value.trim()),
        notes: notesInput.value.trim(),
        source: isAiCurated ? 'auto-ai' : 'auto',
        createdAt: new Date().toISOString()
      };
      
      state.entries.push(newEntry);
      importCount++;
    }
  });

  if (importCount > 0) {
    await saveState();

    alert(`Successfully imported ${importCount} auto-indexed entries!`);

    if (lastQuizError) {
      alert(`Friendly Notice:\nCuration succeeded and entries were imported, but practice quiz generation failed due to API limits/traffic:\n\n${lastQuizError}\n\nPlease try generating a quiz next time or tomorrow!`);
      lastQuizError = null;
    }
    
    elements.verificationPreviewSection.classList.add('hidden');
    elements.autoIndexForm.closest('section').classList.remove('hidden');
    if (elements.aiCurationErrorAlert) {
      elements.aiCurationErrorAlert.classList.add('hidden');
    }
    if (elements.quizGenerationErrorAlert) {
      elements.quizGenerationErrorAlert.classList.add('hidden');
    }
    
    // Reset setup wizard steps
    wizardCurrentStep = 1;
    updateWizardUI();

    selectedPdfPath = '';
    elements.autoIndexFileName.textContent = 'No file selected';
    elements.autoIndexFileName.title = '';
    if (elements.autoIndexFileArea) {
      elements.autoIndexFileArea.style.borderColor = 'var(--border-color)';
      elements.autoIndexFileArea.style.backgroundColor = 'rgba(15, 23, 42, 0.3)';
    }
    elements.autoIndexPassword.value = localStorage.getItem('sans_pdf_password') || '';
    if (elements.autoIndexGeminiKey) {
      elements.autoIndexGeminiKey.value = localStorage.getItem('gemini_api_key') || '';
    }
    if (elements.autoIndexFname) {
      elements.autoIndexFname.value = localStorage.getItem('sans_fname') || '';
    }
    if (elements.autoIndexLname) {
      elements.autoIndexLname.value = localStorage.getItem('sans_lname') || '';
    }
    if (elements.autoIndexEmail) {
      elements.autoIndexEmail.value = localStorage.getItem('sans_email') || '';
    }
    
    const tabButtons = document.querySelectorAll('.workspace-tabs .tab-btn');
    tabButtons.forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-view-tab') === 'manual-index') {
        b.classList.add('active');
      }
    });
    
    elements.manualIndexView.classList.remove('hidden');
    elements.autoIndexView.classList.add('hidden');
    
    renderAll();
  }
}

// ==========================================================================
// AUTO-INDEX MULTI-STEP SETUP WIZARD & QUIZ HUB
// ==========================================================================
let wizardCurrentStep = 1;

function initAutoIndexWizard() {
  wizardCurrentStep = 1;
  updateWizardUI();

  if (elements.wizardNextBtn) {
    const nextBtnClone = elements.wizardNextBtn.cloneNode(true);
    elements.wizardNextBtn.parentNode.replaceChild(nextBtnClone, elements.wizardNextBtn);
    elements.wizardNextBtn = nextBtnClone;
    elements.wizardNextBtn.addEventListener('click', () => {
      if (validateWizardStep(wizardCurrentStep)) {
        wizardCurrentStep++;
        updateWizardUI();
      }
    });
  }

  if (elements.wizardPrevBtn) {
    const prevBtnClone = elements.wizardPrevBtn.cloneNode(true);
    elements.wizardPrevBtn.parentNode.replaceChild(prevBtnClone, elements.wizardPrevBtn);
    elements.wizardPrevBtn = prevBtnClone;
    elements.wizardPrevBtn.addEventListener('click', () => {
      if (wizardCurrentStep > 1) {
        wizardCurrentStep--;
        updateWizardUI();
      }
    });
  }

  if (elements.autoIndexAddBookBtn) {
    const addBtnClone = elements.autoIndexAddBookBtn.cloneNode(true);
    elements.autoIndexAddBookBtn.parentNode.replaceChild(addBtnClone, elements.autoIndexAddBookBtn);
    elements.autoIndexAddBookBtn = addBtnClone;
    elements.autoIndexAddBookBtn.addEventListener('click', () => {
      openBookDialog();
    });
  }

  if (elements.autoIndexGenerateQuiz) {
    const quizToggleClone = elements.autoIndexGenerateQuiz.cloneNode(true);
    elements.autoIndexGenerateQuiz.parentNode.replaceChild(quizToggleClone, elements.autoIndexGenerateQuiz);
    elements.autoIndexGenerateQuiz = quizToggleClone;
    
    elements.autoIndexGenerateQuiz.checked = false;
    elements.autoIndexGenerateQuiz.disabled = true;
    
    elements.quizGenerationSettings = document.getElementById('quiz-generation-settings');
    elements.autoIndexQuizCount = document.getElementById('auto-index-quiz-count');
    elements.autoIndexQuizDifficulty = document.getElementById('auto-index-quiz-difficulty');
    
    const syncQuizToggle = () => {
      elements.autoIndexGenerateQuiz.checked = false;
      if (elements.quizGenerationSettings) elements.quizGenerationSettings.classList.add('hidden');
    };
    
    elements.autoIndexGenerateQuiz.addEventListener('change', syncQuizToggle);
    syncQuizToggle();
  }
}

function validateWizardStep(step) {
  if (step === 1) {
    if (!elements.autoIndexBookSelect.value) {
      alert("Please select a target book to assign the index terms.");
      return false;
    }
    if (!selectedPdfPath) {
      alert("Please select a course book PDF file.");
      return false;
    }
  } else if (step === 3) {
    const useAi = elements.autoIndexUseAi ? elements.autoIndexUseAi.checked : false;
    const isLocalSlm = elements.autoIndexCurationEngine && elements.autoIndexCurationEngine.value === 'local-slm';
    if (useAi && !isLocalSlm) {
      const key = elements.autoIndexGeminiKey ? elements.autoIndexGeminiKey.value.trim() : '';
      if (!key) {
        alert("Please enter a Gemini API Key to use Gemini Cloud AI Curation.");
        return false;
      }
    }
  }
  return true;
}

function updateWizardUI() {
  for (let i = 1; i <= 5; i++) {
    const panel = document.getElementById(`step-panel-${i}`);
    if (panel) {
      if (i === wizardCurrentStep) {
        panel.classList.remove('hidden');
      } else {
        panel.classList.add('hidden');
      }
    }
    
    const indicator = document.querySelector(`.wizard-step-indicator[data-step="${i}"]`);
    if (indicator) {
      indicator.classList.remove('active', 'completed');
      if (i < wizardCurrentStep) {
        indicator.classList.add('completed');
      } else if (i === wizardCurrentStep) {
        indicator.classList.add('active');
      }
    }
  }

  if (elements.wizardProgressBar) {
    const percentage = ((wizardCurrentStep - 1) / 4) * 100;
    elements.wizardProgressBar.style.width = `${percentage}%`;
  }

  if (wizardCurrentStep === 1) {
    elements.wizardPrevBtn.classList.add('hidden');
  } else {
    elements.wizardPrevBtn.classList.remove('hidden');
  }

  if (wizardCurrentStep === 5) {
    elements.wizardNextBtn.classList.add('hidden');
    elements.startIndexingBtn.classList.remove('hidden');
    updateWizardSummary();
  } else {
    elements.wizardNextBtn.classList.remove('hidden');
    elements.startIndexingBtn.classList.add('hidden');
  }
}

function updateWizardSummary() {
  const summaryTargetBook = document.getElementById('summary-target-book');
  const summaryPdfFile = document.getElementById('summary-pdf-file');
  const summaryWatermarkStatus = document.getElementById('summary-watermark-status');
  const summaryAiCuration = document.getElementById('summary-ai-curation');
  const summaryGeminiModel = document.getElementById('summary-gemini-model');
  const summaryQuizStatus = document.getElementById('summary-quiz-status');

  if (summaryTargetBook) {
    const selectedOpt = elements.autoIndexBookSelect.options[elements.autoIndexBookSelect.selectedIndex];
    summaryTargetBook.textContent = selectedOpt ? selectedOpt.textContent : 'None selected';
  }

  if (summaryPdfFile) {
    const fileName = selectedPdfPath ? selectedPdfPath.split(/[\\/]/).pop() : 'None selected';
    summaryPdfFile.textContent = fileName;
    summaryPdfFile.title = selectedPdfPath || '';
  }

  if (summaryWatermarkStatus) {
    const fname = elements.autoIndexFname.value.trim();
    const lname = elements.autoIndexLname.value.trim();
    const email = elements.autoIndexEmail.value.trim();
    if (fname || lname || email) {
      summaryWatermarkStatus.textContent = `Enabled (${[fname, lname].filter(Boolean).join(' ')} - ${email || 'No email'})`;
    } else {
      summaryWatermarkStatus.textContent = 'Disabled';
    }
  }

  if (summaryAiCuration) {
    const useAi = elements.autoIndexUseAi ? elements.autoIndexUseAi.checked : false;
    summaryAiCuration.textContent = useAi ? 'Enabled' : 'Disabled';
  }

  if (summaryGeminiModel) {
    const useAi = elements.autoIndexUseAi ? elements.autoIndexUseAi.checked : false;
    const isLocalSlm = elements.autoIndexCurationEngine && elements.autoIndexCurationEngine.value === 'local-slm';
    if (useAi) {
      if (isLocalSlm) {
        summaryGeminiModel.textContent = 'Qwen 0.5B (Offline)';
      } else if (elements.autoIndexModelSelect) {
        const selectedModelOpt = elements.autoIndexModelSelect.options[elements.autoIndexModelSelect.selectedIndex];
        summaryGeminiModel.textContent = selectedModelOpt ? selectedModelOpt.textContent.split(' ')[0] : '-';
      } else {
        summaryGeminiModel.textContent = 'Gemini Flash';
      }
    } else {
      summaryGeminiModel.textContent = 'Disabled';
    }
  }

  if (summaryQuizStatus) {
    summaryQuizStatus.textContent = 'Disabled (Coming Soon)';
  }

  // Toggle API Free Tier rate limit advisory card (only show if Gemini Cloud AI is selected)
  const geminiRateLimitCard = document.getElementById('gemini-rate-limit-card');
  if (geminiRateLimitCard) {
    const useAi = elements.autoIndexUseAi ? elements.autoIndexUseAi.checked : false;
    const isLocalSlm = elements.autoIndexCurationEngine && elements.autoIndexCurationEngine.value === 'local-slm';
    if (useAi && !isLocalSlm) {
      geminiRateLimitCard.classList.remove('hidden');
    } else {
      geminiRateLimitCard.classList.add('hidden');
    }
  }
}

// Quiz Hub Gameplay logic
let quizSession = {
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: [],
  score: 0,
  feedbackMode: 'immediate',
  selectedBooks: [],
  difficulty: 'Conceptual'
};

function openQuizConfig() {
  if (!state.currentCourseId) {
    alert("Please select or create a course first!");
    return;
  }

  if (elements.quizConfigBooksChecklist) {
    elements.quizConfigBooksChecklist.innerHTML = '';
    const courseBooks = state.books.filter(b => b.courseId === state.currentCourseId);
    
    // Filter books that actually have questions in state.quizzes
    const booksWithQs = courseBooks.filter(book => {
      const totalQs = state.quizzes
        .filter(q => q.bookId === book.id)
        .reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);
      return totalQs > 0;
    });

    if (booksWithQs.length === 0) {
      elements.quizConfigBooksChecklist.innerHTML = `
        <div style="font-size: 0.88rem; color: var(--text-secondary); font-style: italic; line-height: 1.4; padding: 12px 8px; border: 1px dashed var(--border-color); border-radius: var(--radius-sm); text-align: center; width: 100%;">
          You haven't generated any quiz questions yet. Visit the Auto-Indexer to get started!
        </div>
      `;
    } else {
      booksWithQs.forEach(book => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '8px';
        
        const totalQs = state.quizzes
          .filter(q => q.bookId === book.id)
          .reduce((sum, q) => sum + (q.questions ? q.questions.length : 0), 0);

        div.innerHTML = `
          <label style="display: inline-flex; align-items: center; gap: 8px; font-weight: normal; cursor: pointer; font-size: 0.85rem; width: 100%;">
            <input type="checkbox" class="quiz-book-checkbox" value="${book.id}" checked style="flex-shrink: 0;">
            <span class="book-indicator-dot" style="width: 10px; height: 10px; border-radius: 50%; background-color: ${book.color || 'var(--color-accent)'}; flex-shrink: 0; display: inline-block;"></span>
            <span style="line-height: 1.2;">${book.name} (${totalQs} Qs available)</span>
          </label>
        `;
        elements.quizConfigBooksChecklist.appendChild(div);
      });
    }
  }

  if (elements.quizConfigDialog) {
    elements.quizConfigDialog.showModal();
  }
}

function handleQuizConfigSubmit(e) {
  e.preventDefault();
  
  const checkedCheckboxes = elements.quizConfigBooksChecklist.querySelectorAll('.quiz-book-checkbox:checked');
  const selectedBookIds = Array.from(checkedCheckboxes).map(cb => cb.value);
  
  if (selectedBookIds.length === 0) {
    alert("Please select at least one book to pull questions from!");
    return;
  }

  const questionCount = parseInt(elements.quizConfigCount.value) || 10;
  const difficulty = elements.quizConfigDifficulty.value;
  const feedbackMode = elements.quizConfigFeedback.value;

  let pool = [];
  state.quizzes.forEach(quiz => {
    if (selectedBookIds.includes(quiz.bookId) && quiz.difficulty === difficulty) {
      if (quiz.questions && Array.isArray(quiz.questions)) {
        const bookObj = state.books.find(b => b.id === quiz.bookId);
        quiz.questions.forEach(q => {
          pool.push({
            ...q,
            bookName: bookObj ? bookObj.name : 'Unknown Book',
            bookColor: bookObj ? bookObj.color : '#0d9488'
          });
        });
      }
    }
  });

  if (pool.length === 0) {
    alert(`No questions found matching difficulty "${difficulty}" in the selected books. Please generate some questions first by auto-indexing a book and selecting "Generate Practice Quiz" in Step 4.`);
    return;
  }

  pool = shuffleArray(pool);
  const selectedQuestions = pool.slice(0, questionCount);

  quizSession = {
    questions: selectedQuestions,
    currentQuestionIndex: 0,
    userAnswers: new Array(selectedQuestions.length).fill(null),
    score: 0,
    feedbackMode: feedbackMode,
    selectedBooks: selectedBookIds,
    difficulty: difficulty
  };

  if (elements.quizConfigDialog) {
    elements.quizConfigDialog.close();
  }

  enterQuizMode();
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function enterQuizMode() {
  document.querySelectorAll('.no-print-in-quiz').forEach(el => el.classList.add('hidden'));
  elements.manualIndexView.classList.add('hidden');
  elements.autoIndexView.classList.add('hidden');
  
  elements.quizPracticeView.classList.remove('hidden');
  elements.quizScorecardView.classList.add('hidden');

  if (quizSession.feedbackMode === 'immediate') {
    elements.quizLiveScoreContainer.classList.remove('hidden');
    elements.quizLiveScore.textContent = '0/0';
  } else {
    elements.quizLiveScoreContainer.classList.add('hidden');
  }

  displayQuizQuestion();
}

function displayQuizQuestion() {
  const currentQ = quizSession.questions[quizSession.currentQuestionIndex];
  
  elements.quizProgressText.textContent = `Question ${quizSession.currentQuestionIndex + 1} of ${quizSession.questions.length}`;
  if (elements.quizProgressFill) {
    const fillPercent = ((quizSession.currentQuestionIndex + 1) / quizSession.questions.length) * 100;
    elements.quizProgressFill.style.width = `${fillPercent}%`;
  }

  elements.quizQuestionBookBadge.textContent = currentQ.bookName || 'SANS Book';
  elements.quizQuestionBookBadge.style.color = currentQ.bookColor || 'var(--color-accent)';
  elements.quizQuestionBookBadge.style.borderColor = currentQ.bookColor || 'var(--color-accent)';
  
  elements.quizQuestionDiffBadge.textContent = quizSession.difficulty;
  elements.quizQuestionText.textContent = currentQ.question;
  elements.quizFeedbackPanel.classList.add('hidden');
  elements.quizOptionsContainer.innerHTML = '';
  
  const isLastQuestion = quizSession.currentQuestionIndex === quizSession.questions.length - 1;
  elements.quizNextQuestionBtn.innerHTML = isLastQuestion 
    ? `<span>Submit Quiz</span><i data-lucide="check" style="width: 16px; height: 16px; margin-left: 4px;"></i>`
    : `<span>Next Question</span><i data-lucide="chevron-right" style="width: 16px; height: 16px; margin-left: 4px;"></i>`;
  lucide.createIcons({ nodeList: [elements.quizNextQuestionBtn] });

  elements.quizNextQuestionBtn.classList.add('hidden');

  currentQ.options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-choice-btn';
    btn.innerHTML = `
      <span class="option-letter">${String.fromCharCode(65 + index)}</span>
      <span>${escapeHtml(optText)}</span>
    `;

    btn.addEventListener('click', () => handleQuizOptionClick(index));
    elements.quizOptionsContainer.appendChild(btn);
  });
}

function handleQuizOptionClick(selectedIndex) {
  const currentQ = quizSession.questions[quizSession.currentQuestionIndex];
  quizSession.userAnswers[quizSession.currentQuestionIndex] = selectedIndex;

  const buttons = elements.quizOptionsContainer.querySelectorAll('.quiz-choice-btn');

  if (quizSession.feedbackMode === 'immediate') {
    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === currentQ.correctIndex) {
        btn.classList.add('correct');
      } else if (idx === selectedIndex) {
        btn.classList.add('incorrect');
      }
    });

    const isCorrect = selectedIndex === currentQ.correctIndex;
    if (isCorrect) {
      quizSession.score++;
    }
    
    const answeredCount = quizSession.currentQuestionIndex + 1;
    elements.quizLiveScore.textContent = `${quizSession.score}/${answeredCount}`;

    elements.quizFeedbackPanel.classList.remove('hidden');
    elements.quizFeedbackTitle.textContent = isCorrect ? 'Correct!' : 'Incorrect';
    
    if (elements.quizFeedbackIndicator) {
      elements.quizFeedbackIndicator.style.color = isCorrect ? '#10b981' : '#ef4444';
    }
    
    if (elements.quizFeedbackIcon) {
      elements.quizFeedbackIcon.setAttribute('data-lucide', isCorrect ? 'check-circle-2' : 'alert-circle');
      lucide.createIcons({ nodeList: [elements.quizFeedbackIcon] });
    }

    elements.quizExplanationText.textContent = currentQ.explanation;
  } else {
    buttons.forEach((btn, idx) => {
      btn.classList.remove('selected');
      if (idx === selectedIndex) {
        btn.classList.add('selected');
      }
    });
  }

  elements.quizNextQuestionBtn.classList.remove('hidden');
}

function handleQuizNextClick() {
  const isLastQuestion = quizSession.currentQuestionIndex === quizSession.questions.length - 1;
  
  if (isLastQuestion) {
    showQuizScorecard();
  } else {
    quizSession.currentQuestionIndex++;
    displayQuizQuestion();
  }
}

function showQuizScorecard() {
  elements.quizPracticeView.classList.add('hidden');
  elements.quizScorecardView.classList.remove('hidden');

  let correctCount = 0;
  if (quizSession.feedbackMode === 'graded') {
    quizSession.questions.forEach((q, idx) => {
      if (quizSession.userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    quizSession.score = correctCount;
  } else {
    correctCount = quizSession.score;
  }

  const accuracy = Math.round((correctCount / quizSession.questions.length) * 100) || 0;

  elements.scorecardRatio.textContent = `${correctCount}/${quizSession.questions.length}`;
  elements.scorecardPercent.textContent = `${accuracy}%`;
  
  if (accuracy >= 80) {
    elements.scorecardPercent.style.color = '#10b981';
  } else if (accuracy >= 60) {
    elements.scorecardPercent.style.color = '#eab308';
  } else {
    elements.scorecardPercent.style.color = '#ef4444';
  }

  elements.scorecardReviewContainer.innerHTML = '';
  quizSession.questions.forEach((q, idx) => {
    const userAns = quizSession.userAnswers[idx];
    const isCorrect = userAns === q.correctIndex;
    const itemDiv = document.createElement('div');
    itemDiv.className = 'scorecard-review-item';
    
    const letter = userAns !== null ? String.fromCharCode(65 + userAns) : 'None';
    const correctLetter = String.fromCharCode(65 + q.correctIndex);

    itemDiv.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; gap: 12px;">
        <span style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary);">Q${idx + 1}: ${escapeHtml(q.question)}</span>
        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 0.72rem; font-weight: 700; color: ${isCorrect ? '#10b981' : '#ef4444'}; flex-shrink: 0; padding: 2px 6px; background: ${isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)'}; border: 1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; border-radius: 4px;">
          <i data-lucide="${isCorrect ? 'check' : 'x'}" style="width: 12px; height: 12px;"></i>
          <span>${isCorrect ? 'Correct' : 'Incorrect'}</span>
        </span>
      </div>
      
      <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 8px;">
        <span>Your Answer: <strong style="color: ${isCorrect ? '#10b981' : '#ef4444'};">${letter}</strong></span> | 
        <span>Correct Answer: <strong style="color: #10b981;">${correctLetter}</strong></span>
      </div>
      
      <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45; padding: 10px; background: rgba(255, 255, 255, 0.02); border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
        <strong>Explanation:</strong> ${escapeHtml(q.explanation)}
      </div>
    `;
    elements.scorecardReviewContainer.appendChild(itemDiv);
  });
  lucide.createIcons({ nodeList: elements.scorecardReviewContainer });
}

function handleQuizExit() {
  if (confirm("Are you sure you want to exit the practice session? Your progress will not be saved.")) {
    exitQuizMode();
  }
}

function exitQuizMode() {
  elements.quizPracticeView.classList.add('hidden');
  elements.quizScorecardView.classList.add('hidden');

  document.querySelectorAll('.no-print-in-quiz').forEach(el => el.classList.remove('hidden'));
  
  const activeTab = document.querySelector('.workspace-tabs .tab-btn.active');
  const targetTab = activeTab ? activeTab.getAttribute('data-view-tab') : 'manual-index';
  
  if (targetTab === 'manual-index') {
    elements.manualIndexView.classList.remove('hidden');
    elements.autoIndexView.classList.add('hidden');
    if (elements.notesEditorView) elements.notesEditorView.classList.add('hidden');
  } else if (targetTab === 'notes-editor') {
    elements.manualIndexView.classList.add('hidden');
    elements.autoIndexView.classList.add('hidden');
    if (elements.notesEditorView) elements.notesEditorView.classList.remove('hidden');
  } else {
    elements.manualIndexView.classList.add('hidden');
    elements.autoIndexView.classList.remove('hidden');
    if (elements.notesEditorView) elements.notesEditorView.classList.add('hidden');
  }
}

function retryQuizSession() {
  const shuffled = shuffleArray(quizSession.questions);
  
  quizSession = {
    ...quizSession,
    questions: shuffled,
    currentQuestionIndex: 0,
    userAnswers: new Array(shuffled.length).fill(null),
    score: 0
  };

  elements.quizPracticeView.classList.remove('hidden');
  elements.quizScorecardView.classList.add('hidden');

  if (quizSession.feedbackMode === 'immediate') {
    elements.quizLiveScoreContainer.classList.remove('hidden');
    elements.quizLiveScore.textContent = '0/0';
  } else {
    elements.quizLiveScoreContainer.classList.add('hidden');
  }

  displayQuizQuestion();
}

// ==========================================================================
// NOTES TEXT EDITOR MODULE (FULL WORD-LIKE EDITOR)
// ==========================================================================

let notesSaveTimeout = null;
let currentNotesZoom = 100;
let notesEditorInitialized = false;

function initNotesEditor() {
  if (notesEditorInitialized) return;

  if (!elements.notesEditorView) {
    elements.notesEditorView = document.getElementById('notes-editor-view');
  }
  const container = elements.notesEditorView;
  if (!container) return;

  notesEditorInitialized = true;

  const docTitleInput = document.getElementById('notes-doc-title');
  const docHeaderTitle = document.getElementById('page-header-doc-title');
  const editor = document.getElementById('notes-content-editor');
  const themeToggleBtn = document.getElementById('notes-theme-toggle-btn');
  const printBtn = document.getElementById('notes-print-btn');
  const pagesWrapper = document.getElementById('notes-pages-wrapper');
  
  // Toolbar Selects & Inputs
  const fontSelect = document.getElementById('tb-font-family');
  const sizeSelect = document.getElementById('tb-font-size');
  const headingSelect = document.getElementById('tb-heading-select');
  const textColorInput = document.getElementById('tb-text-color');
  const bgColorInput = document.getElementById('tb-bg-color');
  
  // Insert buttons
  const insertTableBtn = document.getElementById('tb-insert-table-btn');
  const insertPageBreakBtn = document.getElementById('tb-insert-page-break-btn');
  const insertLinkBtn = document.getElementById('tb-insert-link-btn');

  // Zoom controls
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomLevelText = document.getElementById('zoom-level-text');

  // 1. Load persisted theme preference
  const savedTheme = localStorage.getItem('sans_notes_theme') || 'dark';
  setNotesEditorTheme(savedTheme);

  // 2. Load persisted note title & content
  const savedTitle = localStorage.getItem('sans_notes_title');
  if (savedTitle && docTitleInput) {
    docTitleInput.value = savedTitle;
    if (docHeaderTitle) docHeaderTitle.textContent = savedTitle;
  }

  const savedContent = localStorage.getItem('sans_notes_content');
  if (savedContent && editor) {
    editor.innerHTML = savedContent;
  }

  // 3. Document Title Change Listener
  if (docTitleInput) {
    docTitleInput.addEventListener('input', () => {
      const val = docTitleInput.value.trim() || 'Untitled Notes';
      if (docHeaderTitle) docHeaderTitle.textContent = val;
      triggerNotesAutoSave();
    });
  }

  // 4. Editor Content Input & Keyboard Shortcuts
  if (editor) {
    editor.addEventListener('input', () => {
      triggerNotesAutoSave();
      updateNotesStats();
    });

    editor.addEventListener('keyup', updateToolbarActiveStates);
    editor.addEventListener('mouseup', updateToolbarActiveStates);
    
    // Tab key support in editor (insert 4 spaces or indent)
    editor.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand(e.shiftKey ? 'outdent' : 'indent', false, null);
      }
    });
  }

  // 5. Toolbar Buttons (command execution)
  const tbButtons = container.querySelectorAll('.tb-btn[data-command]');
  tbButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const command = btn.getAttribute('data-command');
      if (command) {
        document.execCommand(command, false, null);
        updateToolbarActiveStates();
        triggerNotesAutoSave();
        if (editor) editor.focus();
      }
    });
  });

  // 6. Font Family Change
  if (fontSelect) {
    fontSelect.addEventListener('change', () => {
      document.execCommand('fontName', false, fontSelect.value);
      if (editor) editor.focus();
      triggerNotesAutoSave();
    });
  }

  // 7. Font Size Change
  if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
      document.execCommand('fontSize', false, sizeSelect.value);
      if (editor) editor.focus();
      triggerNotesAutoSave();
    });
  }

  // 8. Format / Heading Change
  if (headingSelect) {
    headingSelect.addEventListener('change', () => {
      const tag = headingSelect.value;
      document.execCommand('formatBlock', false, tag);
      if (editor) editor.focus();
      triggerNotesAutoSave();
    });
  }

  // 9. Text & Background Color Pickers
  if (textColorInput) {
    textColorInput.addEventListener('input', () => {
      document.execCommand('foreColor', false, textColorInput.value);
      triggerNotesAutoSave();
    });
  }

  if (bgColorInput) {
    bgColorInput.addEventListener('input', () => {
      document.execCommand('hiliteColor', false, bgColorInput.value) ||
      document.execCommand('backColor', false, bgColorInput.value);
      triggerNotesAutoSave();
    });
  }

  // 10. Insert Table
  if (insertTableBtn) {
    insertTableBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const tableHTML = `
        <table style="width: 100%; border-collapse: collapse; margin: 12px 0;">
          <thead>
            <tr>
              <th style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Header 1</th>
              <th style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Header 2</th>
              <th style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Header 3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Data 1</td>
              <td style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Data 2</td>
              <td style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Data 3</td>
            </tr>
            <tr>
              <td style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Data 4</td>
              <td style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Data 5</td>
              <td style="border: 1px solid rgba(148,163,184,0.4); padding: 8px 12px;">Data 6</td>
            </tr>
          </tbody>
        </table>
        <p><br></p>
      `;
      document.execCommand('insertHTML', false, tableHTML);
      triggerNotesAutoSave();
    });
  }

  // 11. Insert Page Break
  if (insertPageBreakBtn) {
    insertPageBreakBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const breakHTML = `<div class="page-break-divider" contenteditable="false">✂ --- PAGE BREAK ---</div><p><br></p>`;
      document.execCommand('insertHTML', false, breakHTML);
      updateNotesStats();
      triggerNotesAutoSave();
    });
  }

  // 12. Insert Link
  if (insertLinkBtn) {
    insertLinkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = prompt('Enter link URL (e.g. https://sans.org):');
      if (url) {
        document.execCommand('createLink', false, url);
        triggerNotesAutoSave();
      }
    });
  }

  // 13. Theme Toggle Button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const editorContainer = container.querySelector('.notes-editor-container');
      const isDark = editorContainer.classList.contains('notes-theme-dark');
      setNotesEditorTheme(isDark ? 'light' : 'dark');
    });
  }

  // 14. Zoom Controls
  if (zoomInBtn && zoomOutBtn && pagesWrapper && zoomLevelText) {
    zoomInBtn.addEventListener('click', () => {
      if (currentNotesZoom < 150) {
        currentNotesZoom += 10;
        pagesWrapper.style.transform = `scale(${currentNotesZoom / 100})`;
        zoomLevelText.textContent = `${currentNotesZoom}%`;
      }
    });
    zoomOutBtn.addEventListener('click', () => {
      if (currentNotesZoom > 70) {
        currentNotesZoom -= 10;
        pagesWrapper.style.transform = `scale(${currentNotesZoom / 100})`;
        zoomLevelText.textContent = `${currentNotesZoom}%`;
      }
    });
  }

  // 15. Print / PDF Button
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      printNotesEditorContent();
    });
  }

  // Initial Stats Calculation
  updateNotesStats();
}

// Set Theme function
function setNotesEditorTheme(theme) {
  const container = document.querySelector('.notes-editor-container');
  const themeText = document.getElementById('notes-theme-text');
  const iconSun = document.getElementById('notes-theme-icon-sun');
  const iconMoon = document.getElementById('notes-theme-icon-moon');

  if (!container) return;

  if (theme === 'light') {
    container.classList.remove('notes-theme-dark');
    container.classList.add('notes-theme-light');
    if (themeText) themeText.textContent = 'Light Mode';
    if (iconSun) iconSun.classList.remove('hidden');
    if (iconMoon) iconMoon.classList.add('hidden');
  } else {
    container.classList.remove('notes-theme-light');
    container.classList.add('notes-theme-dark');
    if (themeText) themeText.textContent = 'Dark Mode';
    if (iconSun) iconSun.classList.add('hidden');
    if (iconMoon) iconMoon.classList.remove('hidden');
  }

  localStorage.setItem('sans_notes_theme', theme);
  if (window.lucide) lucide.createIcons();
}

// Update Active Toolbar States based on Selection
function updateToolbarActiveStates() {
  const container = elements.notesEditorView;
  if (!container) return;

  const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'insertUnorderedList', 'insertOrderedList'];
  
  commands.forEach(cmd => {
    const btn = container.querySelector(`.tb-btn[data-command="${cmd}"]`);
    if (btn) {
      try {
        if (document.queryCommandState(cmd)) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      } catch (err) {
        // Ignore unsupported state queries
      }
    }
  });
}

// Update Word Count, Char Count, Page Calculation
function updateNotesStats() {
  const editor = document.getElementById('notes-content-editor');
  const wordCountEl = document.getElementById('notes-word-count');
  const charCountEl = document.getElementById('notes-char-count');
  const pageBadgeEl = document.getElementById('notes-page-count-badge');

  if (!editor) return;

  const text = editor.innerText || editor.textContent || '';
  const cleanText = text.trim();
  
  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
  const chars = text.length;

  if (wordCountEl) wordCountEl.textContent = `${words.toLocaleString()} words`;
  if (charCountEl) charCountEl.textContent = `${chars.toLocaleString()} characters`;

  // Page break divider count + height based estimation
  const pageBreaks = editor.querySelectorAll('.page-break-divider').length;
  const editorHeight = editor.scrollHeight || 0;
  const estPagesByHeight = Math.max(1, Math.ceil(editorHeight / 850));
  const totalPages = Math.max(estPagesByHeight, pageBreaks + 1);

  if (pageBadgeEl) {
    const pageSpan = pageBadgeEl.querySelector('span');
    if (pageSpan) pageSpan.textContent = `Page 1 of ${totalPages}`;
  }
}

// Trigger Auto-Save to localStorage
function triggerNotesAutoSave() {
  const statusBadge = document.getElementById('notes-save-status');
  if (statusBadge) {
    statusBadge.style.opacity = '0.5';
    statusBadge.querySelector('span').textContent = 'Saving...';
  }

  if (notesSaveTimeout) clearTimeout(notesSaveTimeout);

  notesSaveTimeout = setTimeout(() => {
    const docTitleInput = document.getElementById('notes-doc-title');
    const editor = document.getElementById('notes-content-editor');

    if (docTitleInput) {
      localStorage.setItem('sans_notes_title', docTitleInput.value);
    }
    if (editor) {
      localStorage.setItem('sans_notes_content', editor.innerHTML);
    }

    if (statusBadge) {
      statusBadge.style.opacity = '1';
      statusBadge.querySelector('span').textContent = 'Saved';
    }
  }, 500);
}

// Print Notes Content
function printNotesEditorContent() {
  const docTitle = document.getElementById('notes-doc-title')?.value || 'SANS Notes';
  const editorHTML = document.getElementById('notes-content-editor')?.innerHTML || '';

  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${docTitle}</title>
      <style>
        body { font-family: 'Inter', Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
        h1, h2, h3 { color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        table th, table td { border: 1px solid #cbd5e1; padding: 8px 12px; }
        table th { background: #f1f5f9; }
        blockquote { border-left: 4px solid #0d9488; padding: 8px 16px; background: #f0fdf4; margin: 16px 0; }
        pre { background: #0f172a; color: #38bdf8; padding: 12px; border-radius: 4px; font-family: monospace; }
        .page-break-divider { page-break-after: always; display: none; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <h1 style="border-bottom: 2px solid #0d9488; padding-bottom: 8px; margin-bottom: 24px;">${docTitle}</h1>
      <div>${editorHTML}</div>
      <script>
        window.onload = function() { window.print(); window.close(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
