const STORAGE_KEY = 'fatimaAcademicPlannerTasks';

function loadTasks() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        return Array.isArray(saved) ? saved.filter((task) => task && typeof task.text === 'string') : [];
    } catch {
        return [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const input = document.getElementById('taskInput');
    const list = document.getElementById('taskList');
    const message = document.getElementById('plannerMessage');
    if (!form || !input || !list) return;

    let tasks = loadTasks();
    const saveTasks = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
            if (message) message.textContent = '';
        } catch {
            if (message) message.textContent = 'Could not save tasks in this browser. Check your storage settings.';
        }
    };
    const renderTasks = () => {
        list.replaceChildren();
        if (tasks.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-state';
            empty.textContent = 'No tasks yet. Add one above to get started.';
            list.append(empty);
            return;
        }
        tasks.forEach((task) => {
            const item = document.createElement('li');
            item.className = `task-item${task.done ? ' is-complete' : ''}`;
            const label = document.createElement('label');
            label.className = 'task-label';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = Boolean(task.done);
            checkbox.dataset.action = 'toggle';
            checkbox.dataset.id = task.id;
            checkbox.setAttribute('aria-label', `Mark ${task.text} as ${task.done ? 'incomplete' : 'complete'}`);
            const text = document.createElement('span');
            text.textContent = task.text;
            label.append(checkbox, text);
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'delete-task';
            remove.textContent = 'Delete';
            remove.dataset.action = 'delete';
            remove.dataset.id = task.id;
            remove.setAttribute('aria-label', `Delete task: ${task.text}`);
            item.append(label, remove);
            list.append(item);
        });
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const text = input.value.trim();
        if (!text) {
            input.focus();
            return;
        }
        tasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, done: false });
        saveTasks();
        renderTasks();
        input.value = '';
        input.focus();
    });

    list.addEventListener('change', (event) => {
        const control = event.target.closest('[data-action="toggle"]');
        if (!control) return;
        const task = tasks.find((item) => item.id === control.dataset.id);
        if (task) task.done = control.checked;
        saveTasks();
        renderTasks();
    });
    list.addEventListener('click', (event) => {
        const control = event.target.closest('[data-action="delete"]');
        if (!control) return;
        tasks = tasks.filter((task) => task.id !== control.dataset.id);
        saveTasks();
        renderTasks();
    });

    renderTasks();
});
