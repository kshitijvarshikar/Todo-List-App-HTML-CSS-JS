// Select DOM Elements
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");

// Load saved todos from localStorage (if any)
const saved = localStorage.getItem("todos");
const todos = saved ? JSON.parse(saved) : [];

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

// Create a DOM node for a todo object
function createTodoNode(todo, index) {
    const li = document.createElement("li");

    // Checkbox to toggle completion
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!todo.completed;

    // Text span for the todo
    const textSpan = document.createElement("span");
    textSpan.textContent = todo.text;
    textSpan.style.margin = "0 8px";
    textSpan.style.textDecoration = todo.completed ? "line-through" : "";

    // Toggle completion
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;
        textSpan.style.textDecoration = todo.completed ? "line-through" : "";
        saveTodos();
    });

    // Double-click or double-tap to edit
    let lastTap = 0;
    function editTodo() {
        const newText = prompt("Edit Todo", todo.text);
        if (newText !== null) {
            todo.text = newText.trim();
            textSpan.textContent = todo.text;
            saveTodos();
        }
    }

    // Desktop double-click
    textSpan.addEventListener("dblclick", editTodo);

    // Mobile double-tap
    textSpan.addEventListener("touchstart", (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            e.preventDefault(); // Prevent zoom
            editTodo();
        }
        lastTap = currentTime;
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.style.marginLeft = "8px";
    delBtn.addEventListener("click", () => {
        todos.splice(index, 1);
        render();
        saveTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    return li;
}

// Render the todo list
function render() {
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        const node = createTodoNode(todo, index);
        list.appendChild(node);
    });
}

// Add a new todo
function addTodo() {
    const text = input.value.trim();
    if (!text) return;

    todos.push({ text, completed: false });
    input.value = "";
    render();
    saveTodos();
}

addBtn.addEventListener("click", addTodo);

// Allow pressing Enter to add
input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

render();
