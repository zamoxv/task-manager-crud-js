const STORAGE_KEY = "crud_tareas";
let tasks = []; //array de tareas
let editingId = null;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("task-form");
    const titleInput = document.getElementById("task-title");
    const descInput = document.getElementById("task-desc");
    const errorMsg = document.getElementById("title-error");
    const formTitle = document.getElementById("form-title");
    const submitBtn = document.getElementById("submit-btn");
    const cancelBtn = document.getElementById("cancel-btn");


    loadFromStorage();
    renderTasks();

    form.addEventListener('submit', (event) =>{
        event.preventDefault();

        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        
        if(!title){
            errorMsg.textContent = "Ingresa un título a la tarea";
            errorMsg.style.display = "block";
            titleInput.classList.add("input-error");
            return;
        };
        
        errorMsg.textContent = "";
        errorMsg.style.display = "none";
        titleInput.classList.remove("input-error");

        if(editingId === null){
            const newTask = {
                id:Date.now(),
                title,
                desc,
            };
            tasks.push(newTask);
        }else{
            const task = tasks.find((t) => t.id === editingId);
            if(task){
                task.title = title;
                task.desc = desc;
            }
            editingId = null;
            formTitle.textContent = "Nueva tarea";
            submitBtn.textContent = "Guardar Tarea";
            cancelBtn.style.display = "none";
        }
        
        
        saveToStorage();
        renderTasks();

        titleInput.value = "";
        descInput.value = "";
    });

    titleInput.addEventListener("input", () => {
    const value = titleInput.value.trim();

    if (value) {
      errorMsg.textContent = "";
      errorMsg.style.display = "none";
      titleInput.classList.remove("input-error");
    }
  });
  window._formRefs = {titleInput, descInput, formTitle, submitBtn, cancelBtn};

  cancelBtn.addEventListener("click", () => {
    editingId = null;

    formTitle.textContent = "Nueva tarea";
    submitBtn.textContent = "Guardar tarea";
    cancelBtn.style.display = "none";

    titleInput.value = "";
    descInput.value = "";
    titleInput.classList.remove("input-error");
    errorMsg.style.display = "none";
});

});

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
        deleteBtn.className = "delete-btn";
        deleteBtn.addEventListener("click", () => deleteTask(task.id, li, deleteBtn));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(header);
        if(task.desc){
            const descP = document.createElement("p");
            descP.className = "task-desc";
            descP.textContent = task.desc;
            li.appendChild(descP);
        }
        li.appendChild(actions);

        list.appendChild(li);

    })
}

function editTask(id){
    const task = tasks.find((t) => t.id === id);
    if(!task) return;

    editingId = id;

    const {titleInput, descInput, formTitle, submitBtn, cancelBtn} = window._formRefs;

    titleInput.value = task.title;
    descInput.value = task.desc || "";

    formTitle.textContent = "Editando tarea";
    submitBtn.textContent = "Guardar Cambios";
    cancelBtn.style.display = "block";

    titleInput.focus();
}

function deleteTask(id, taskItem, deleteBtn) {
  const wrapper = document.createElement("span")

  wrapper.innerHTML = `
    ¿Seguro?
    <button class="yes-mini">Sí</button>
    <button class="no-mini">No</button>
  `;

  deleteBtn.replaceWith(wrapper);

  const yesBtn = taskItem.querySelector(".yes-mini");
  const noBtn = taskItem.querySelector(".no-mini");

  yesBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => t.id !== id);
    saveToStorage();
    renderTasks();
  });

  noBtn.addEventListener("click", () => {
    renderTasks();
  });
}

function saveToStorage(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromStorage(){
    const data = localStorage.getItem(STORAGE_KEY);
    if(!data){
        tasks = [];
        return;
    }
    try{
        tasks = JSON.parse(data);
    }catch(error){
        console.error("Error al leer LocalStorage", error);
    }
}