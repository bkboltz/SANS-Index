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
  printFormatSelect: document.getElementById('print-format-select'),
  printOnlyContainer: document.getElementById('print-only-container'),

  // Sidebar To-Do
  todoInput: document.getElementById('todo-input'),
  addTodoBtn: document.getElementById('add-todo-btn'),
  todoListActive: document.getElementById('todo-list-active'),
  todoListCompleted: document.getElementById('todo-list-completed'),
  todoCompletedSection: document.getElementById('todo-completed-section')
};

// Application State Store
let state = {
  courses: [],
  books: [],
  entries: [],
  todos: [],
  currentCourseId: null
};

// Runtime helpers
let editEntryId = null;
let sortField = 'default'; // Default: custom book order -> topic -> page
let sortAsc = true;
let activeAutocompleteIndex = -1;
let courseAutocompleteIndex = -1;

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
    
    if (state.courses.length > 0) {
      state.currentCourseId = state.courses[0].id;
    }
  }



  // Bind Event Listeners
  initEventBindings();
  
  // Initial Render
  renderAll();
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
}

function renderBooks() {
  // Clear lists
  elements.booksList.innerHTML = '';
  elements.entryBookSelect.innerHTML = '<option value="" disabled selected>Select Book</option>';
  elements.filterBookSelect.innerHTML = '<option value="all">All Books</option>';
  
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
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 0;">
          No index entries found. Add your first topic above!
        </td>
      </tr>
    `;
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
          <textarea class="inline-edit-input inline-notes-input" placeholder="Use: **bold**, *italic*, __underline__, ==highlight==" style="background-color: var(--bg-sidebar); border: 1px solid var(--border-color); color: var(--text-primary); padding: 6px 8px; border-radius: 4px; font-size: 0.85rem; width: 100%; resize: vertical; min-height: 32px; font-family: inherit; line-height: 1.4; box-sizing: border-box; display: block; overflow-y: hidden;">${entry.notes || ''}</textarea>
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
      
      tr.innerHTML = `
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
        <td class="col-pages">${entry.pages}</td>
        <td class="col-topic">${highlightText(entry.topic, query)}</td>
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

  // Bind inline keyboard events
  const inlineEditingRow = elements.indexTableBody.querySelector('tr[style*="rgba(20, 184, 166"]');
  if (inlineEditingRow) {
    inlineEditingRow.querySelectorAll('.inline-edit-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
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
      inlineNotesInput.style.height = 'auto';
      inlineNotesInput.style.height = inlineNotesInput.scrollHeight + 'px';
      
      inlineNotesInput.addEventListener('input', () => {
        inlineNotesInput.style.height = 'auto';
        inlineNotesInput.style.height = inlineNotesInput.scrollHeight + 'px';
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
  const notes = rowElement.querySelector('.inline-notes-input').value.trim();

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

// Helper to parse Markdown-like markup in SANS notes:
// ==highlight==, **bold**, __underline__, *italic*
function formatNoteMarkup(text) {
  if (!text) return '';
  
  let escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
    
  // 1. Highlight: ==text==
  escaped = escaped.replace(/==(.*?)==/g, '<mark class="note-highlight">$1</mark>');
  
  // 2. Bold: **text**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 3. Underline: __text__
  escaped = escaped.replace(/__(.*?)__/g, '<u>$1</u>');
  
  // 4. Italics: *text*
  escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
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
    
    container.addEventListener('dragstart', (e) => {
      // Only drag if the target or its ancestor is the drag handle
      if (!e.target.closest('.todo-drag-handle')) {
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
  } else {
    elements.courseDialogTitle.textContent = "Create New Course";
    elements.dialogCourseId.value = "";
    elements.dialogCourseName.value = "";
  }
  elements.courseDialog.showModal();
  elements.dialogCourseName.focus();
}

function handleCourseDialogSubmit(e) {
  e.preventDefault();
  const id = elements.dialogCourseId.value.trim();
  const name = elements.dialogCourseName.value.trim();
  
  if (id) {
    // Edit Mode
    const course = state.courses.find(c => c.id === id);
    if (course) {
      course.name = name;
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

    state.courses.push({ id: newId, name });
    
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
    
    saveState();
    renderAll();
  }
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

  const parsedItems = [];

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
      
      const actualStart = Math.min(start, end);
      const actualEnd = Math.max(start, end);
      
      parsedItems.push({
        type: 'range',
        start: actualStart,
        end: actualEnd,
        display: `${actualStart}-${actualEnd}`
      });
    } else {
      const val = parseInt(part, 10);
      if (isNaN(val)) {
        return { isValid: false, error: `Invalid page number: '${part}'.` };
      }
      parsedItems.push({
        type: 'single',
        start: val,
        end: val,
        display: `${val}`
      });
    }
  }

  // Sort: single page goes right before the range it falls within, else sort by start page
  parsedItems.sort((a, b) => {
    if (a.type === 'single' && b.type === 'range') {
      if (a.start >= b.start && a.start <= b.end) {
        return -1;
      }
    }
    if (b.type === 'single' && a.type === 'range') {
      if (b.start >= a.start && b.start <= a.end) {
        return 1;
      }
    }
    
    if (a.start !== b.start) {
      return a.start - b.start;
    }
    return a.end - b.end;
  });

  const formattedString = parsedItems.map(item => item.display).join(', ');

  return {
    isValid: true,
    formatted: formattedString
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
  const notes = elements.entryNotesInput.value.trim();
  
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
    elements.entryNotesInput.value = '';
    elements.entryNotesInput.style.height = '38px';
    
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
  state.entries = state.entries.filter(e => e && e.id !== entryId);
  
  saveState();
  renderEntries();
  renderStats();
  
  // Trigger pulses
  triggerStatPulse(elements.statTotalEntries.closest('.stat-card'));
  
  if (editEntryId === entryId) {
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
    endEditEntry();
    renderAll();
  });
  
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
  
  // Auto-expanding textarea for notes
  elements.entryNotesInput.addEventListener('input', () => {
    elements.entryNotesInput.style.height = 'auto';
    elements.entryNotesInput.style.height = (elements.entryNotesInput.scrollHeight) + 'px';
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

  elements.printFormatSelect.addEventListener('change', renderPrintPreview);

function openPrintPreview() {
  elements.printFormatSelect.value = 'standard';
  renderPrintPreview();
  elements.printPreviewDialog.showModal();
}

function renderPrintPreview() {
  const format = elements.printFormatSelect.value;
  const activeEntries = state.entries.filter(entry => entry && entry.courseId === state.currentCourseId);
  
  let generatedHtml = '';
  if (format === 'booklet') {
    generatedHtml = generateBookletPrintHTML(activeEntries);
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
  const entriesCopy = [...activeEntries];
  sortData(entriesCopy);

  const rowsHtml = entriesCopy.map(entry => {
    const book = state.books.find(b => b.id === entry.bookId);
    const bookNameFull = book ? book.name : 'Unknown';
    const bookNameShort = bookNameFull.includes(':') ? bookNameFull.split(':')[0].trim() : bookNameFull;
    const bookColor = book ? book.color : '#4b5563';
    const formattedNotes = entry.notes ? formatNoteMarkup(entry.notes) : '';
    
    return `
      <tr class="${entry.starred ? 'starred-row' : ''}">
        <td class="col-book">
          <span class="book-badge" style="color: ${bookColor}">
            <span class="badge-dot" style="background-color: ${bookColor}"></span>
            <span>${bookNameShort}</span>
          </span>
        </td>
        <td class="col-pages">${entry.pages}</td>
        <td class="col-topic">${entry.topic}</td>
        <td class="col-notes">${formattedNotes}</td>
      </tr>
    `;
  }).join('');

  return `
    <div class="print-header">
      <h1>${elements.currentCourseTitle.textContent}</h1>
      <div class="print-meta">
        <span>SANS Study Index</span>
        <span>Date: ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        <span>Total Topics: ${entriesCopy.length}</span>
      </div>
    </div>
    <table class="index-table">
      <thead>
        <tr>
          <th class="col-book">Book</th>
          <th class="col-pages">Pages</th>
          <th class="col-topic">Topic</th>
          <th class="col-notes">Notes / Reference Details</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

function generateBookletPrintHTML(activeEntries) {
  // 1. Cover Page Index (Quick scan index sorted by topic alphabetically, with NO notes)
  const sortedByTopic = [...activeEntries].sort((a, b) => a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true }));
  const masterRowsHtml = sortedByTopic.map(entry => {
    const book = state.books.find(b => b.id === entry.bookId);
    const bookNameFull = book ? book.name : 'Unknown';
    const bookNameShort = bookNameFull.includes(':') ? bookNameFull.split(':')[0].trim() : bookNameFull;
    const bookColor = book ? book.color : '#4b5563';
    return `
      <tr>
        <td class="col-topic" style="font-weight: 600;">${entry.topic}</td>
        <td class="col-book">
          <span class="book-badge" style="color: ${bookColor}">
            <span class="badge-dot" style="background-color: ${bookColor}"></span>
            <span>${bookNameShort}</span>
          </span>
        </td>
        <td class="col-pages" style="font-weight: 600;">${entry.pages}</td>
      </tr>
    `;
  }).join('');

  let html = `
    <div class="print-header">
      <h1>${elements.currentCourseTitle.textContent}</h1>
      <div class="print-meta">
        <strong>MASTER COVER PAGE INDEX (Quick Scan)</strong>
        <span>Date: ${new Date().toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>
    </div>
    <table class="index-table">
      <thead>
        <tr>
          <th class="col-topic">Topic</th>
          <th class="col-book">Book</th>
          <th class="col-pages">Page(s)</th>
        </tr>
      </thead>
      <tbody>
        ${masterRowsHtml}
      </tbody>
    </table>
    
    <div class="print-page-break"></div>
  `;

  // 2. Individual Booklets per Book
  const activeBooks = state.books.filter(b => b && b.courseId === state.currentCourseId);
  activeBooks.forEach((book, index) => {
    const bookEntries = activeEntries.filter(e => e.bookId === book.id);
    if (bookEntries.length === 0) return; // skip books with no entries

    // Sort book entries by page number
    const sortedBookEntries = [...bookEntries].sort((a, b) => {
      const pageComp = comparePages(a.pages, b.pages);
      if (pageComp !== 0) return pageComp;
      return a.topic.localeCompare(b.topic, undefined, { sensitivity: 'base', numeric: true });
    });

    const bookRowsHtml = sortedBookEntries.map(entry => {
      const formattedNotes = entry.notes ? formatNoteMarkup(entry.notes) : '';
      return `
        <tr class="${entry.starred ? 'starred-row' : ''}">
          <td class="col-pages" style="font-weight: 700;">${entry.pages}</td>
          <td class="col-topic" style="font-weight: 600;">${entry.topic}</td>
          <td class="col-notes">${formattedNotes}</td>
        </tr>
      `;
    }).join('');

    html += `
      <div class="booklet-header">
        <h2 style="color: ${book.color}; border-bottom: 2px solid ${book.color}; padding-bottom: 6px; display: inline-block; width: 100%;">
          ${book.name} - Detailed Booklet Index
        </h2>
      </div>
      <table class="index-table">
        <thead>
          <tr>
            <th class="col-pages">Page(s)</th>
            <th class="col-topic">Topic</th>
            <th class="col-notes">Notes / Reference Details</th>
          </tr>
        </thead>
        <tbody>
          ${bookRowsHtml}
        </tbody>
      </table>
    `;

    // Add page break after each booklet (except the last one)
    if (index < activeBooks.length - 1) {
      html += `<div class="print-page-break"></div>`;
    }
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
}
