document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  let currentFilter = "all";
  let tasks = [];

  // 🔹 Yuklash
  loadTasks();
  runner();

  // 🔹 Vazifa qo‘shish
  addBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({
        text,
        done: false,
        added: new Date().toLocaleString(),
        edited: null
      });
      taskInput.value = "";
      runner();
    }
  });

  // 🔹 Filter tugmalari
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      runner();
    });
  });

  // 🔹 Dark mode
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    darkModeToggle.innerHTML = document.body.classList.contains("dark")
      ? '<i class="fa-solid fa-sun"></i> Light Mode'
      : '<i class="fa-solid fa-moon"></i> Dark Mode';
  });

  // 🔹 Runner (render)
  function runner() {
    taskList.innerHTML = "";
    let filteredTasks = tasks.filter(task => {
      if (currentFilter === "done") return task.done;
      if (currentFilter === "undone") return !task.done;
      return true;
    });

    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const originalIndex = tasks.indexOf(task);

      li.innerHTML = `
        <div>
          <span>${task.text}</span>
          <small>Added: ${task.added}${task.edited ? ` | Edited: ${task.edited}` : ""}</small>
        </div>
        <div>
          <button onclick="toggleDone(${originalIndex})"><i class="fa-solid fa-check"></i></button>
          <button onclick="editTask(${originalIndex})"><i class="fa-solid fa-pen"></i></button>
          <button onclick="deleteTask(${originalIndex})"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
      taskList.appendChild(li);
    });

    updateCounter();
    saveTasks();
  }

  // 🔹 Toggle done
  window.toggleDone = index => {
    tasks[index].done = !tasks[index].done;
    runner();
  };

  // 🔹 O‘chirish
  window.deleteTask = index => {
    tasks.splice(index, 1);
    runner();
  };

  // 🔹 Tahrirlash
  window.editTask = index => {
    const li = taskList.children[index];
    const task = tasks[index];
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;

    input.addEventListener("blur", () => {
      const newText = input.value.trim();
      if (newText) {
        task.text = newText;
        task.edited = new Date().toLocaleString();
      }
      runner();
    });

    input.addEventListener("keypress", e => {
      if (e.key === "Enter") input.blur();
    });

    li.querySelector("span").replaceWith(input);
    input.focus();
  };

  // 🔹 Counter
  function updateCounter() {
    const doneCount = tasks.filter(t => t.done).length;
    const undoneCount = tasks.filter(t => !t.done).length;
    document.getElementById("counter").textContent =
      `Bajarilgan: ${doneCount} ta | Bajarilmagan: ${undoneCount} ta`;
  }

  // 🔹 Saqlash
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // 🔹 Yuklash
  function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) tasks = JSON.parse(saved);
  }
});
