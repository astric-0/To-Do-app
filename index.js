function initDocument(){
    allTasks=getData();
    allTasksRow.innerHTML="";
    if(allTasks!=[]){
        allTasks.forEach(function(item, ind){            
            rows = getHtmlCode(ind, item.task);
            allTasksRow.appendChild(rows[0]);
            allTasksRow.appendChild(rows[1]);

            if(item.checked){
                document.querySelector(`#taskcheck${ind}`).checked=true;
                document.querySelector(`#taskid${ind}`).style.textDecoration='line-through';
            }
        });       
    }
}
document.querySelector("#addtaskbtn").addEventListener("click",addTask);
let allTasksRow=document.querySelector("#alltasksrow");
let allTasks=[];
let editorVisible=false;

initDocument();

let newTask=document.querySelector("#newtask");
newTask.addEventListener("keyup",function(event){
    if(event.keyCode==13){
        addTask();
    }
});
newTask.addEventListener("click",resetEditor);

function getHtmlCode(id, taskText){

    let div_row1 = document.createElement("div");
    div_row1.classList.add("row", "labelrow");
    div_row1.id=`labelrow${id}`;
        let div_col1_row1 = document.createElement("div")
        div_col1_row1.classList.add(...["col-3", "d-flex", "p-0"]);
            let label_1 = document.createElement("label");
            label_1.classList.add("m-0", "labels");
            let icon1 = document.createElement("ion-icon");
            icon1.classList.add("btn", "text-light", "edits");
            icon1.name="create";
            icon1.title="Click to edit";
            icon1.setAttribute("onclick",`editTask(${id})`);                            
            label_1.innerText=(`Task ${id+1}`);            
        div_col1_row1.appendChild(label_1);
        div_col1_row1.appendChild(icon1);
    div_row1.appendChild(div_col1_row1);

    let div_row2 = document.createElement("div");
    div_row2.id=`taskrow${id}`;
    div_row2.classList.add(...["mt-0", "mb-3", "row", "align-items-center", "text-dark", "taskrow"]);
        let div_col1_row2=document.createElement("div");
        div_col1_row2.classList.add(...["col-9", "m-0", "bg-light", "p-2", "rounded", "bold"]);
            let p=document.createElement("p");
            p.id=`taskid${id}`;
            p.classList.add("m-0","tasks");
            p.innerText=`${taskText}`;
        div_col1_row2.appendChild(p);
        
        let div_col2_row2 = document.createElement("div");
        div_col2_row2.classList.add("col-1","p-0");
            let checkbox = document.createElement("input");
            checkbox.id=`taskcheck${id}`;
            checkbox.type="checkbox";
            checkbox.classList.add("form-control", "task-check", "checks");
            checkbox.setAttribute("onclick",`strikeTask(${id})`);
            checkbox.title="Mark Completed";
        div_col2_row2.appendChild(checkbox);

        let div_col3_row2 = document.createElement("div");
        div_col3_row2.classList.add("col-1", "m-0");
            let btn = document.createElement("button");
            btn.id=`taskcross${id}`;
            btn.classList.add(...["btn", "btn-danger", "text-light", "task-cross", "crosses"]);
            btn.setAttribute("onclick",`deleteTask(${id});`);
            btn.title="Click to delete";
            btn.innerText="X";
        div_col3_row2.appendChild(btn);
    div_row2.appendChild(div_col1_row2);
    div_row2.appendChild(div_col2_row2);
    div_row2.appendChild(div_col3_row2);

    return [div_row1, div_row2];
}

function getData(){
    data = JSON.parse(localStorage.getItem("allTasks"));
    return (data==null) ? [] : data;
}

function setData(newTaskValue){    
    allTasks=getData();    
    allTasks.push({
        'task':newTaskValue,
        'checked':false
    });    
    setAllTasks();
}

function setAllTasks(){
    localStorage.setItem("allTasks",JSON.stringify(allTasks));
}

function addTask(){    
    let newTask=document.querySelector("#newtask");
    let newTaskValue=newTask.value.trim();
    
    if(newTaskValue==""){  
        return;
    }
    else if(newTask.value=="\n"){
        newTask.value='';
        return;
    }
    setData(newTaskValue);
    let id = allTasks.length-1;
    rows = getHtmlCode(id, newTaskValue);
    allTasksRow.appendChild(rows[0]);
    allTasksRow.appendChild(rows[1]);
    newTask.value='';    
}

function strikeTask(id){
    resetEditor();
    let taskcheckid=`taskcheck${id}`;
    allTasks=getData();
    if(document.querySelector('#'+taskcheckid).checked){
        allTasks[id].checked=true;
        document.querySelector(`#taskid${id}`).style.textDecoration="line-through";
    }
    else{
        allTasks[id].checked=false;
        document.querySelector(`#taskid${id}`).style.textDecoration="none";
    }
    setAllTasks();   
}

function deleteTask(id){
    resetEditor();
    allTasks=getData();
    allTasks.splice(id,1);
    setAllTasks(allTasks);

    document.querySelector(`#taskrow${id}`).remove();
    document.querySelector(`#labelrow${id}`).remove();

    let taskrows = document.querySelectorAll(".taskrow");
    let tasks = document.querySelectorAll(".tasks");
    let checks = document.querySelectorAll(".checks");
    let crosses = document.querySelectorAll(".crosses");
    let labels = document.querySelectorAll(".labels");
    let labelrow = document.querySelectorAll(".labelrow");
    let edits = document.querySelectorAll(".edits");

    for(let i=0;i<allTasks.length;i++){
        edits[i].setAttribute("onclick",`editTask(${i})`);

        taskrows[i].id=`taskrow${i}`;
        tasks[i].id=`taskid${i}`;
        
        checks[i].id=`taskcheck${i}`;
        checks[i].setAttribute("onclick",`strikeTask(${i})`);

        crosses[i].id=`taskcross${i}`;
        crosses[i].setAttribute("onclick",`deleteTask(${i})`);

        labels[i].innerText=`Task ${i+1}`;
        labelrow[i].id=`labelrow${i}`;
    }   
}

function editTask(id){    
    task=document.querySelector(`#taskid${id}`);    
    document.querySelector("#editor").classList.remove("invisible");  
    let updateTask=document.querySelector("#updatetask");
    updateTask.value=task.innerText;
    updateTask.focus();
    document.querySelector("#tasktoedit").innerText=id;    
    editorVisible=true;
}

function updateTask(){        
    allTasks=getData();
    let id = document.querySelector("#tasktoedit").innerText;    
    let updateTask=document.querySelector("#updatetask");
    let updated = updateTask.value;
    if(updated==''){
        return;
    }
    else if(updated=='\n'){
        updateTask.value='';
        return;
    }
    document.querySelector(`#taskid${id}`).innerText=updated;
    allTasks[id].task=updated;
    setAllTasks(allTasks);    
    resetEditor();
}
document.querySelector("#updatetask").addEventListener("keypress",function(event){
    if(event.keyCode==13){
        updateTask();
    }
});

function resetEditor(){
    if(editorVisible){
        document.querySelector("#editor").classList.add("invisible");
        document.querySelector("#updatetask").value='';
        editorVisible=false;
        document.querySelector("#newtask").focus();        
    }   
}