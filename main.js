
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
                <td class="name " data-id="${tasks[i].taskId}" ">
                    <span class="was_changed" style="display: ${tasks[i].isChanged === true ? 'block' : 'none'}">Відредаговано</span>
                    ${tasks[i].taskName}
                </td>
                <td class="statusContainer" data-status="${tasks[i].taskStatus}"  >
                 ${+tasks[i].taskStatus === 0 ? 'Очікується' : +tasks[i].taskStatus === 1 ? 'В роботі' : 'Завершено'   }
                       
                </td>
                <td class="task cor" data-id="${tasks[i].taskId}" data-canBeChanged="${tasks[i].canBeChanged}" >${tasks[i].taskDesc}</td>
                <td class="date cor" data-id="${tasks[i].taskId}">${tasks[i].taskDate} 
                    <span class="correct" data-id="${tasks[i].taskId}" data-canBeChanged="${tasks[i].canBeChanged}">✎</span>
                </td>
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
        const sortName = document.querySelector('.taskList .headName span');
        document.querySelector('.taskList .headDate span').style.display = 'none';
        sortName.style.display = 'inline-block';
        let data = checkLocalStorage();
        asc = asc*-1;
        sortName.style.transform = `rotate(${90*-asc +90+'deg'})`;
        data.sort((a,b)=>{
            if (a.taskName.toLocaleLowerCase() > b.taskName.toLocaleLowerCase())return asc;
            else return -asc;
        });

        drowTable(data)
    });
    headDate.addEventListener('click', ()=>{
        const sortHead = document.querySelector('.taskList .headDate span');
        document.querySelector('.taskList .headName span').style.display = 'none';
        sortHead.style.display = 'inline-block';
        headName.children = [];
        let data = checkLocalStorage();
        asc = asc*-1;
        sortHead.style.transform = `rotate(${90*asc +90+'deg'})`;
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

    table.addEventListener('click',(e)=>{

        if(e.target.className === 'correct'){
            const data = checkLocalStorage();
            const corectRow = document.createElement('div');
            const coreactName = document.createElement('textarea');
            if (e.path[2].children[0].innerText.indexOf('Відредаговано') !== -1){
                coreactName.value = (e.path[2].children[0].innerText.substring('Відредаговано'.length)).trim();
            }else{
                coreactName.value = (e.path[2].children[0].innerText).trim();
            }
            coreactName.disabled = (e.target.dataset.canbechanged !== 'true');
            const correctStatus = document.createElement('div');
            correctStatus.innerHTML =
                `
                <select class="status" 
                style="background: white;
                outline:none; 
                border:none; 
                width:100%;
                height: 100% ;
                cursor: ${ e.target.dataset.canbechanged !== 'true' ? 'not-allowed' : 'pointer'} 
                 "
               ${(e.target.dataset.canbechanged !== 'true') ? 'disabled' : ''}
                >
                         <option ${+e.path[2].children[1].dataset.status === 0 ? 'selected' : ''}>Очікується</option>
                        <option ${+e.path[2].children[1].dataset.status === 1 ? 'selected' : ''}>В роботі</option>
                        <option ${+e.path[2].children[1].dataset.status === 2 ? 'selected' : ''}>Завершено</option>
                    </select>
                `;
            const coreactDesc = document.createElement('textarea');
            coreactDesc.disabled = e.target.dataset.canbechanged !== 'true';
            coreactDesc.value = e.path[2].children[2].innerText;

            const coreactDate = document.createElement('input');
            coreactDate.type = 'date';
            coreactDate.value = e.path[2].children[3].innerHTML.substring(0,10);
            coreactDate.disabled = (e.target.dataset.canbechanged !== 'true');

            const changeButton = document.createElement('button');
            changeButton.innerText = 'Змінити';
            const exitButton = document.createElement('button');
            exitButton.innerText = '✕';
            const deleteTask = document.createElement('button');
            deleteTask.innerText = 'Видалити';

            corectRow.appendChild(coreactName);
            corectRow.appendChild(correctStatus);
            corectRow.appendChild(coreactDesc);
            corectRow.appendChild(coreactDate);
            corectRow.appendChild(changeButton);
            corectRow.appendChild(exitButton);
            corectRow.appendChild(deleteTask);

            function getCoords(elem) {
                // (1)
                let box = elem.getBoundingClientRect();

                let body = document.body;
                var docEl = document.documentElement;

                // (2)
                let scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
                let scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

                // (3)
                let clientTop = docEl.clientTop || body.clientTop || 0;
                let clientLeft = docEl.clientLeft || body.clientLeft || 0;

                // (4)
                let top = box.top + scrollTop - clientTop;
                let left = box.left + scrollLeft - clientLeft;

                return top;
            }

            document.body.appendChild(corectRow);
            corectRow.style.cssText =
                `
                position : absolute;
                top:0;
                bottom:0;
                height: ${document.body.offsetHeight+'px'};
                left:0;
                right:0;
                background:rgba(0,0,0,0.6); 
                overflow:hidden;
                                                  
                `;
            coreactName.style.cssText =
                `
                position:absolute;
                top:${getCoords(e.path[2].children[0])+'px'};
                left:${e.path[2].children[0].getBoundingClientRect().x+'px'};
                width: ${e.path[2].children[0].getBoundingClientRect().width+'px'};
                height: ${e.path[2].children[0].getBoundingClientRect().height+'px'};
                padding:20px;
                border:none;
                outline:none;
                background:white;
                box-shadow: 0px 0px 0px 2px black;
                cursor: ${ e.target.dataset.canbechanged !== 'true' ? 'not-allowed' : 'pointer'} 
                `;

            correctStatus.style.cssText =
                `
                position:absolute;
                top:${getCoords(e.path[2].children[1])+'px'};
                left:${e.path[2].children[1].getBoundingClientRect().x+'px'};
                width: ${e.path[2].children[1].getBoundingClientRect().width+'px'};
                height: ${e.path[2].children[1].getBoundingClientRect().height+'px'};
                margin : auto;
                background:white;
                box-shadow: 0px 0px 0px 2px black;
                z-index=${e.target.dataset.canbechanged !== 'true' ? '10' : '0'} ;
                
                `;

            coreactDesc.style.cssText =
                `
                position:absolute;
                top:${getCoords(e.path[2].children[2])+'px'};
                left:${e.path[2].children[2].getBoundingClientRect().x+'px'};
                width: ${e.path[2].children[2].getBoundingClientRect().width+'px'};
                height: ${e.path[2].children[2].getBoundingClientRect().height+'px'};
                padding:${getComputedStyle(e.path[2].children[2]).padding};
                border:none;
                outline:none;
                box-shadow: 0px 0px 0px 2px black;
                background:white;
                cursor: ${ e.target.dataset.canbechanged !== 'true' ? 'not-allowed' : 'pointer'} 
                `;
            coreactDate.style.cssText =
                `
                position:absolute;
                top:${getCoords(e.path[2].children[3])+'px'};
                left:${e.path[2].children[3].getBoundingClientRect().x+'px'};
                width: ${e.path[2].children[3].getBoundingClientRect().width+'px'};
                height: ${e.path[2].children[3].getBoundingClientRect().height+'px'};
                padding:${getComputedStyle(e.path[2].children[3]).padding};
                padding-right:0;
                border:none;
                outline:none;
                background:white;
                box-shadow: 0px 0px 0px 2px black;
                cursor: ${ e.target.dataset.canbechanged !== 'true' ? 'not-allowed' : 'pointer'} 
                `;
            changeButton.style.cssText =
                `
                 position:absolute;
                 top:${getCoords(e.path[2].children[3])+e.path[2].children[3].getBoundingClientRect().height+10+'px'};
                 left:${e.path[2].children[3].getBoundingClientRect().x + e.path[2].children[3].getBoundingClientRect().width+-67+'px'};
                 padding:10px;
                 border:none;
                 outline:none;
                 background:white;
                 cursor:pointer;
                 `;
            exitButton.style.cssText =
                `
                 position:absolute;
                 top:${getCoords(e.path[2]) -45+'px'};
                 left:${e.path[2].children[3].getBoundingClientRect().x +
                      e.path[2].children[3].getBoundingClientRect().width -40 + 'px'};
                 padding:10px;
                 font-size:24px;
                 border:none;
                 outline:none;
                 color:white;
                 background:none;
                 cursor:pointer;
            
                `;
            deleteTask.style.cssText =
                `
                 position:absolute;
                 top:${getCoords(e.path[2])+e.path[2].getBoundingClientRect().height +10 +'px'};
                 left:${e.path[2].children[3].getBoundingClientRect().x +'px'};
                 padding:10px;
                 border:1px;
                 outline:none;
                 color:red;
                 background:white;
                 cursor:pointer;
            
                `;
            exitButton.addEventListener('click',()=>{
                document.body.removeChild(corectRow);
            });
            deleteTask.addEventListener('click',(event)=>{
                for (let i = 0; i < data.length ; i++) {
                    if (+data[i].taskId === +e.target.dataset.id){
                        data.splice(i,1);
                        break
                    }
                }
                localStorage.tasks = JSON.stringify(data);
                document.body.removeChild(corectRow);
                drowTable();

            });
            changeButton.addEventListener('click',(event)=>{
                const changedData = {
                    isChanged : true,
                    taskDate : coreactDate.value,
                    taskDesc : coreactDesc.value,
                    taskName : coreactName.value,
                    taskStatus : correctStatus.children[0].value === 'Очікується' ? 0 : (correctStatus.children[0].value === 'В роботі' ? 1 : 2),
                    canBeChanged : correctStatus.children[0].value !== 'Завершено' ,
                    taskId : e.target.dataset.id,
                };
                for (let i = 0; i < data.length ; i++) {
                    if (+data[i].taskId === +e.target.dataset.id){
                        data[i] = changedData;
                        break
                    }
                }
                localStorage.tasks = JSON.stringify(data);
                document.body.removeChild(corectRow);
                document.body.style.overflow = 'scroll';
                drowTable();
            })

        }
    });
}
correction();

