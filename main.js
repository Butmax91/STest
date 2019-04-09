
function checkLocalStorage(){
    if (localStorage.tasks){
        tasks = JSON.parse(localStorage.tasks);
        return tasks;
    }else {
        localStorage.tasks = JSON.stringify([]);
    }
}
checkLocalStorage();

function drowTable(tasks = checkLocalStorage()){
    const tableBody = document.querySelector('.taskList tbody');
    tableBody.innerHTML = '';
    if (tasks.length){
        for (let i = 0; i <tasks.length ; i++) {
            let tableRow = document.createElement('tr');
            tableRow.innerHTML =
                `
                <td class="name cor">${tasks[i].taskName}</td>
                <td class="status">
                    <select>
                        <option >Очікується</option>
                        <option >В роботі</option>
                        <option >Завершено</option>
                    </select>
                </td>
                <td class="task cor">${tasks[i].taskDesc}</td>
                <td class="date cor">${tasks[i].taskDate}</td>
        `;
            tableBody.appendChild(tableRow);
        }
    }else{
        let tableRow = document.createElement('tr');
        tableRow.innerHTML =
            `
                <td colspan="4">Немає завдань</td>

            `;
        tableBody.appendChild(tableRow);
    }
}
drowTable();


function addToLocalStorage(data){
    tasks = checkLocalStorage();
    if (tasks){
        tasks.push(data);
        localStorage.tasks = JSON.stringify(tasks);
    }
}
function addTask(){
    const addButton = document.querySelector('.addButton');
    let taskName = document.getElementById('taskName');
    let taskDesc = document.getElementById('taskDesc');
    let taskDate = document.getElementById('taskDate');
    taskName.addEventListener('input', ()=>{
        if (taskName.value.trim() && taskDesc.value.trim() && taskDate.value.trim()){
            addButton.disabled = false;
        }else{
            addButton.disabled = true;
        }
    });
    taskDesc.addEventListener('input', ()=>{
        if (taskName.value.trim() && taskDesc.value.trim() && taskDate.value.trim()){
            addButton.disabled = false;
        }else{
            addButton.disabled = true;
        }
    });
    taskDate.addEventListener('input', ()=>{
        if (taskName.value.trim() && taskDesc.value.trim() && taskDate.value.trim()){
            addButton.disabled = false;
        }else{
            addButton.disabled = true;
        }
    });

    addButton.addEventListener('click', (e)=>{
        e.preventDefault();
        task = {
            taskName : taskName.value.trim(),
            taskStatus : 'Очікується',
            taskDesc : taskDesc.value.trim(),
            taskDate : taskDate.value.trim(),
        };
        taskName.value = taskDesc.value = taskDate.value = '';
        addButton.disabled = true;
        addToLocalStorage(task);
        drowTable();
    })
}
addTask();

function sortBy(){
    let asc = -1;
    let headName = document.querySelector('.headName');
    let headDate = document.querySelector('.headDate');
    headName.addEventListener('click', ()=>{
        let data = checkLocalStorage();
        asc = asc*-1;
        data.sort((a,b)=>{
            if (a.taskName > b.taskName)return asc;
            else return -asc;
        });
        drowTable(data)
    })
    headDate.addEventListener('click', ()=>{
        let data = checkLocalStorage();
        asc = asc*-1;
        data.sort((a,b)=>{
            if (a.taskDate > b.taskDate)return asc;
            else return -asc;
        });
        drowTable(data)
    })
}
sortBy();

function correction(){
    const table = document.querySelector('.taskList');
    table.addEventListener('dblclick',(e)=>{
        for (let i = 0; i < e.target.classList.length ; i++) {
            if (e.target.classList[i] === 'cor'){
                const style = getComputedStyle(e.target);
                console.log(style);
                let modal = document.createElement('div');
                let correctionInput = document.createElement('input');
                correctionInput.style.cssText = JSON.stringify(style);
                modal.className = 'modal';
                modal.appendChild(correctionInput);

                document.body.appendChild(modal)
            }
        }
    })
}
correction();