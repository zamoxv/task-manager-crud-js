let tasks = []; //array de tareas

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");

    form.addEventListener('submit', (event) =>{
        event.preventDefault();

        const titleInput = document.getElementById("task-title");
        const descInput = document.getElementById("task-desc");
        const errorMsg = document.getElementById("title-error");

        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        
        if(!title){
            errorMsg.textContent = "Ingresa un título a la tarea";
            errorMsg.style.display = "block";
            titleInput.classList.add("input-error");
            return;
        }
        
        errorMsg.textContent = "";
        errorMsg.style.display = "none";
        titleInput.classList.remove("input-error");

        const newTask = {
            id:Date.now(),
            title,
            desc,
        }
        
        tasks.push(newTask);

        renderTasks();

        titleInput.value = "";
        descInput.value = "";
    })
})

function renderTasks(){
    const list = document.getElementById("task-list");
    list.innerHTML = "";

    if(tasks.length === 0){
        const li = document.createElement("li");
        li.textContent = "No hay tareas aún.";
        list.appendChild(li);
        return;
    }

    tasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-item";
//      li.textContent = task.title;
//      list.appendChild(li);

        const header = document.createElement("div");
        header.className = "task-header";

        const titleSpan = document.createElement("span");
        titleSpan.className = "task-title";
        titleSpan.textContent = task.title;

        header.appendChild(titleSpan);

        const descP = document.createElement("p");
        descP.className = "task-desc";
        descP.textContent = task.desc;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Editar";
        editBtn.addEventListener("click",() => editTask(task.id));

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Eliminar";
        deleteBtn.addEventListener("click", () => deleteTask(task.id));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(header);
        if(task.desc){
            li.appendChild(descP);
        }
        li.appendChild(actions);

        list.appendChild(li);

    })
}

function editTask(id){
    const task = tasks.find((t) => t.id === id);
    if(!task) return;

    const newTitle = prompt("Nuevo título:", task.title);
    if(newTitle === null) return;

    const trimmedTitle = newTitle.trim();
     if (!trimmedTitle) {
        alert("El título no puede estar vacío.");
        return;
     }

  const newDesc = prompt("Nueva descripción (puede estar vacía):", task.desc || "");
  if (newDesc === null) return;

  task.title = trimmedTitle;
  task.desc = newDesc.trim();

  renderTasks();
}

function deleteTask(id) {
  const ok = confirm("¿Seguro que deseas eliminar esta tarea?");
  if (!ok) return;

  tasks = tasks.filter((t) => t.id !== id);
  renderTasks();
}