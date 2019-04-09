
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
                <td class="name " data-id="${tasks[i].taskId}" ">${tasks[i].taskName}</td>
                <td   >
                    <select class="status" data-id="${tasks[i].taskId}">
                        <option ${+tasks[i].taskStatus === 0 ? 'selected' : ''}>Очікується</option>
                        <option ${+tasks[i].taskStatus === 1 ? 'selected' : ''}>В роботі</option>
                        <option ${+tasks[i].taskStatus === 2 ? 'selected' : ''}>Завершено</option>
                    </select>
                </td>
                <td class="task cor" data-id="${tasks[i].taskId}" data-canBeChanged="${tasks[i].canBeChanged}" >${tasks[i].taskDesc}</td>
                <td class="date cor" data-id="${tasks[i].taskId}">${tasks[i].taskDate}</td>
                `;
            tableRow.className = 'changed';
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
        function getId(){
            const tasks = checkLocalStorage();
            const ids = [];
            let id = Math.floor(Math.random()*1000);
            console.log(id);
            for (let i = 0; i <tasks.length ; i++) {
               if (id === +tasks[i].taskId){
                   return getId()
               }
            }
            return id;
        }
        task = {
            taskName : taskName.value.trim(),
            taskStatus : 0,
            taskDesc : taskDesc.value.trim(),
            taskDate : taskDate.value.trim(),
            taskId : getId(),
            isChanged: false,
            canBeChanged: true,
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
    const data = checkLocalStorage();
    table.addEventListener('dblclick',(e)=>{
        const data = checkLocalStorage();
        for (let i = 0; i < e.target.classList.length ; i++) {
           console.log((e.target.classList[i] === 'cor') && !!e.target.dataset.canbechanged);
           console.log(!!e.target.dataset.canbechanged);
            if ((e.target.classList[i] === 'cor') && !!e.target.dataset.canbechanged ){
                console.log(!e.target.dataset.canbechanged);
                const modal = document.createElement('div');
                const correctionInput = document.createElement('input');
                correctionInput.value = e.target.innerText;
                const addButton = document.createElement('button');
                addButton.innerText = 'Change';
                correctionInput.style.cssText =
                    `
                    position:absolute;
                    top:${e.target.getBoundingClientRect().y+'px'};
                    left:${e.target.getBoundingClientRect().x+'px'};
                    width: ${e.target.getBoundingClientRect().width+'px'};
                    height: ${e.target.getBoundingClientRect().height+'px'};
                    padding:${getComputedStyle(e.target).padding};
                    
                    `;
                addButton.style.cssText =
                    `
                    position:absolute;
                    top:${e.target.getBoundingClientRect().y+e.target.getBoundingClientRect().height+10+'px'};
                    left:${e.target.getBoundingClientRect().x +e.target.getBoundingClientRect().width - 
                    60 +'px'};
                    width:60px;
                    padding:5px ;
                    cursor:pointer;
                    `;
                modal.className = 'modal';
                console.log(e.target.getBoundingClientRect());
                modal.appendChild(correctionInput);
                modal.appendChild(addButton);
                document.body.appendChild(modal);
                modal.addEventListener('click',(event)=>{
                        if(event.target === addButton){
                        for (let j = 0; j < data.length  ; j++) {
                            console.log(data[j].taskId);
                            console.log(e.target);
                            if (data[j].taskId === +e.target.dataset.id){
                                data[j].taskDesc = correctionInput.value;
                                data[j].isChanged = true;
                                break;
                            }
                        }
                        console.log(data);
                        localStorage.tasks = JSON.stringify(data);
                        drowTable();
                        document.body.removeChild(modal);
                    }
                })
            }
        }
    });
    const select = document.querySelectorAll('select');
    table.addEventListener('change',(e)=>{
        const data = checkLocalStorage();
        if(e.target.className === 'status'){
            for (let i = 0; i <data.length ; i++) {
                if (+data[i].taskId === +e.target.dataset.id){

                    console.log(1)
                    if(e.target.value === 'Завершено'){
                            data[i].canBeChanged = false;
                            data[i].taskStatus=2;
                        }
                    else if(e.target.value === 'В роботі') {
                            data[i].canBeChanged = true;
                            data[i].taskStatus = 1;

                    }else{
                        data[i].canBeChanged = true;
                        data[i].taskStatus = 0;
                    }
                }
            }
        }
        localStorage.tasks = JSON.stringify(data);
        drowTable();
    })
}
correction();