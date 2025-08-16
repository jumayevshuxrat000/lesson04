document.addEventListener("DOMContentLoaded", function() {
  const addBtn = document.getElementById("add-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const counter = document.getElementById("counter");
  let currentFilter = "all";
  let tasks = [];

  loadTasks();
  runner();

  addBtn.addEventListener("click", function() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({
        text: text,
        done: false,
        added: getTime(),
        edited: null
      });
      taskInput.value = "";
      runner();
    }
  });

  document.querySelectorAll(".filters button").forEach(function(btn) {
    btn.addEventListener("click", function() {
      document.querySelectorAll(".filters button").forEach(function(b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      currentFilter = btn.dataset.filter;
      runner();
    });
  });

  darkModeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark");
    darkModeToggle.innerHTML = document.body.classList.contains("dark")
      ? '<i class="fa-solid fa-moon"></i> Light Mode'
      : '<i class="fa-solid fa-sun"></i> Dark Mode';
  });

  function runner() {
    taskList.innerHTML = "";
    let filteredTasks = tasks.filter(function(task) {
      if (currentFilter === "done") return task.done;
      if (currentFilter === "undone") return !task.done;
      return true;
    });

    filteredTasks.forEach(function(task, i) {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      li.innerHTML = `
        <div>
          <span>${task.text}</span>
          <p>Added: ${task.added}${task.edited ? ` | Edited: ${task.edited}` : ""}</p>
        </div>
        <div>
          <button class="done-btn"><i class="fa-solid fa-check"></i></button>
          <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
          <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;

      li.querySelector(".done-btn").onclick = function() {
        tasks[i].done = !tasks[i].done;
        runner();
      };

      // Edit
      li.querySelector(".edit-btn").onclick = function() {
        const input = document.createElement("input");
        input.type = "text";
        input.value = task.text;
        input.onblur = function() {
          const newText = input.value.trim();
          if (newText) {
            task.text = newText;
            task.edited = getTime();
          }
          runner();
        };
        input.onkeypress = function(e) {
          if (e.key === "Enter") input.blur();
        };
        li.querySelector("span").replaceWith(input);
        input.focus();
      };

      li.querySelector(".delete-btn").onclick = function() {
        tasks.splice(i, 1);
        runner();
      };

      taskList.appendChild(li);
    });

    counter();
    saveTasks();
  }

  function counter() {
    const doneCount = tasks.filter(function(t) { return t.done; }).length;
    const undoneCount = tasks.length - doneCount;
    counter.textContent = `Bajarilgan: ${doneCount} ta | Bajarilmagan: ${undoneCount} ta`;
  }

  function getTime() {
    const now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    if (m < 10) m = "0" + m;
    return h + ":" + m;
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) tasks = JSON.parse(saved);
  }
});