const taskContainer = document.querySelector(".task-container");

let taskStorage = [];
let favTaskStorage = [];

// const openTaskHTML = (taskData) => ``;

const generateHTML = (taskData) => {
  return `  
  <div id=${taskData.id} class="col-md-6 col-lg-4 col-sm-12 my-4">

    <div class="modal fade" id="delete${taskData.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Alert!!!</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this event card?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal" name=${taskData.id} onclick="deleteCard.apply(this, arguments)">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card-header d-sm-inline-flex justify-content-between align-items-center w-100">
      <h5 class="card-title">${taskData.title}</h5>
      <div class="d-sm-inline-flex align-items-center">
        <i class="${taskData.class == "fav" ? "fas fa-star me-3" : "far fa-star me-3"}" role="button" style="color: #c9cc00;" name=${taskData.id} onClick="addFav.apply(this,arguments)"></i>
        <i class="fas fa-trash-alt me-1 link-danger me-3" role="button" data-bs-toggle="modal" data-bs-target="#delete${taskData.id}"></i>
        <i class="fas fa-edit link-primary" role="button" name=${taskData.id} onclick="editCard.apply(this, arguments)"></i>
      </div>
    </div>
    <div class="card">
      <img src="${taskData.image}" class="card-img-top" alt="${taskData.title}-image">
      <div class="card-body">
        <p class="card-text">${taskData.description}</p>
        <span class="badge bg-primary">${taskData.type}</span>
      </div>
    </div>
    <div class="card-footer">
      <button class="btn btn-outline-primary" name=${taskData.id} data-bs-toggle="modal" data-bs-target="#modal${taskData.id}">Open Task</button>
    </div>

     <div class="modal fade" id="modal${taskData.id}" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="taskModalLabel">${taskData.title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <img src="${taskData.image}" height=300 style="width: 100%; text-align: center;" class="rounded" alt="image">
              <h3 class="my-2">Description</h3>
              <p>${taskData.description}</p>
              <h3 class="my-2">Event Type</h3>
              <span class="badge bg-primary">${taskData.type}</span>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

  </div>`;
};

//insert newCard at last 
const insertToDOM = (newCard) =>{
  return taskContainer.insertAdjacentHTML("beforeend", newCard);
};

// updating the users and curUser in local storage with new cards
const updateLocalStorage = () => {
  let curUser = JSON.parse(localStorage.getItem("taskySidLoginUser")).loginUser;
  let users = JSON.parse(localStorage.getItem("taskySidUser")).users;

  curUser.cards = taskStorage;
  for(let i = 0 ; i < users.length; i++)
  {
    if(users[i].email == curUser.email)
    {
      users[i] = curUser;
      break;
    }
  }
  localStorage.setItem("taskySidUser", JSON.stringify({users: users}));
  localStorage.setItem("taskySidLoginUser", JSON.stringify({loginUser: curUser}));
}

// updating the users and curUser in local storage with new favorite cards
const updateFavLocalStorage = () => {
  let curUser = JSON.parse(localStorage.getItem("taskySidLoginUser")).loginUser;
  let users = JSON.parse(localStorage.getItem("taskySidUser")).users;

  curUser.favCards = favTaskStorage;
  for(let i = 0 ; i < users.length; i++)
  {
    if(users[i].email == curUser.email)
    {
      users[i] = curUser;
      break;
    }
  }
  localStorage.setItem("taskySidUser", JSON.stringify({users: users}));
  localStorage.setItem("taskySidLoginUser", JSON.stringify({loginUser: curUser}));
}

//reload favorites cards
const loadFavorites = () => {
  taskContainer.replaceChildren();
  document.getElementById("nav-fav").setAttribute("class", "nav-link active");
  document.getElementById("nav-home").setAttribute("class", "nav-link");
  localStorage.setItem("taskySidCurPage", JSON.stringify({activePage: "fav"}));

  const curUser = JSON.parse(localStorage.getItem("taskySidLoginUser")).loginUser;

  favTaskStorage = (curUser && curUser != null && curUser.favCards) || [];

  // console.log(favTaskStorage);

  if(favTaskStorage.length == 0)
  {
    insertToDOM(`<h3 class="text-muted">No items in Favorites Section</h3>`);
    return ;
  }

  favTaskStorage.map((taskData) => {
    const newCard = generateHTML(taskData);
    // console.log(newCard);
    insertToDOM(newCard);
  });

  return;
}


//reloading existing cards
const reloadLocalStorage = () => {
  taskContainer.replaceChildren();
  document.getElementById("nav-home").setAttribute("class", "nav-link active");
  document.getElementById("nav-fav").setAttribute("class", "nav-link");
  localStorage.setItem("taskySidCurPage", JSON.stringify({activePage: "home"}));

  const curUser = JSON.parse(localStorage.getItem("taskySidLoginUser")).loginUser;
  if(!curUser || curUser == null)
  {
    document.getElementById("body").replaceChildren();
    document.getElementById("body").innerHTML = 
    `<h3 class="mx-5">Unauthorized Access</h3>
     <a href="login.html" class="mx-5 btn btn-primary btn-block login-btn">Login</a>`
     return;
  }
  
  taskStorage = (curUser && curUser != null && curUser.cards) || [];
  if(taskStorage.length == 0)
  {
    insertToDOM(`<h3 class="text-muted">No items in Home Section</h3>`);
    return ;
  }

  taskStorage.map((taskData) => {
    const newCard = generateHTML(taskData);
    console.log(newCard);
    insertToDOM(newCard);
  });

  return;
  
};

const logout = () => {
  localStorage.setItem("taskySidLoginUser", JSON.stringify({loginUser: null}))
}

const reloadStorage = () => {
  let curUser = JSON.parse(localStorage.getItem("taskySidLoginUser")).loginUser;
  // console.log(curUser);
  if(!curUser || curUser == null)
  {
    document.getElementById("body").replaceChildren();
    document.getElementById("body").innerHTML = 
    `<h3 class="mx-5">Unauthorized Access</h3>
     <a href="login.html" class="mx-5 btn btn-primary btn-block login-btn">Login</a>`
     return;
  }

  document.getElementById("username").innerHTML = `Welcome Back ${JSON.parse(localStorage.getItem("taskySidLoginUser")).loginUser.name} !`
  const activePage = localStorage.getItem("taskySidCurPage");
  if(!activePage)
  {
    reloadLocalStorage();
    return;
  }
  const curPage = JSON.parse(activePage).activePage;
  if(curPage == "fav")
  loadFavorites();
  else
  reloadLocalStorage();  
}

//get task

const addNewCard = () => {
  const taskData = {
    id: `${Date.now()}`,
    title: document.getElementById("taskTitle").value,
    image: document.getElementById("imageurl").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("des").value,
    class: ""
  };
 
  taskStorage.push(taskData);

  updateLocalStorage();  
  reloadLocalStorage();

  // const newCard = generateHTML(taskData);

  // insertToDOM(newCard);

  //clear form

  document.getElementById("taskTitle").value = "";
  document.getElementById("imageurl").value = "";
  document.getElementById("taskType").value = "";
  document.getElementById("des").value = "";

  return;
};

const addFav = (event) => {
  let c = 0;
  const task_id = event.target.getAttribute("name");
  console.log(task_id);
  for(let i = 0 ; i < favTaskStorage.length ; i++)
  {
    const task = favTaskStorage[i];
    if(task.id.toString() == task_id.toString())
    {
      c = c + 1;
      favTaskStorage.splice(i, 1);
      break;
    }
  }
  if(c == 0)
  {
    let task;
    for(let i = 0 ; i < taskStorage.length ; i++)
    {
      // console.log(taskStorage[i].id);
      if(taskStorage[i].id.toString() == task_id)
      {
        taskStorage[i].class = "fav"
        task = taskStorage[i];
        break;
      }
    }
    // console.log(task);
    event.target.setAttribute("class", "fas fa-star me-3")
    if(task)
    favTaskStorage.push(task);
  }
  else
  {
    for(let i = 0 ; i < taskStorage.length ; i++)
    {
      if(taskStorage[i].id.toString() == task_id)
      {
        taskStorage[i].class = ""
        break;
      }
    }
    event.target.setAttribute("class", "far fa-star me-3")
  }
  updateFavLocalStorage();
  updateLocalStorage();

  reloadStorage();
}

const deleteCard = (event) => {
  const targetID = event.target.getAttribute("name");

  const parentElement = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;

  const updatedArray = taskStorage.filter((taskData) => taskData.id !== targetID);

  taskStorage = updatedArray;
  updateLocalStorage();
  reloadLocalStorage();

  return;

};

const editCard = (event) =>{
  const parentElement = event.target.parentNode.parentNode.parentNode;

  let taskTitle = parentElement.childNodes[3].childNodes[1];
  let taskType = parentElement.childNodes[5].childNodes[3].childNodes[3];
  let des = parentElement.childNodes[5].childNodes[3].childNodes[1];
  let changeButton = parentElement.childNodes[7].childNodes[1];

  taskTitle.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  des.setAttribute("contenteditable", "true");
  changeButton.innerHTML = "Save Changes";
  changeButton.removeAttribute("data-bs-toggle");

  changeButton.setAttribute("onclick", "saveEdit.apply(this, arguments)");

};

const saveEdit = (event) => {
  const targetID = event.target.getAttribute("name");

  const parentElement = event.target.parentNode.parentNode;

  //main card
  let taskTitle = parentElement.childNodes[3].childNodes[1];
  let taskType = parentElement.childNodes[5].childNodes[3].childNodes[3];
  let des = parentElement.childNodes[5].childNodes[3].childNodes[1];
  let changeButton = parentElement.childNodes[7].childNodes[1];

  //open task modal
  let openTaskTitle = parentElement.childNodes[9].childNodes[1].childNodes[1].childNodes[1].childNodes[1];
  let openTaskType = parentElement.childNodes[9].childNodes[1].childNodes[1].childNodes[3].childNodes[9];
  let openTaskDes = parentElement.childNodes[9].childNodes[1].childNodes[1].childNodes[3].childNodes[5];

  taskStorage.forEach((task) =>{
    if(task.id === targetID)
    {
      //changes in main card
      task.title = taskTitle.innerHTML;
      task.type = taskType.innerHTML;
      task.description = des.innerHTML;

      //changes in open task modal
      openTaskTitle.innerHTML = taskTitle.innerHTML;
      openTaskType.innerHTML = taskType.innerHTML;
      openTaskDes.innerHTML = des.innerHTML;
    }
    return task;
  });

  updateLocalStorage();

  taskTitle.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  des.setAttribute("contenteditable", "false");
  changeButton.innerHTML = "Open Task";

  changeButton.setAttribute("data-bs-toggle", "modal");

  return;

};

const searchFunction = () =>{
  let searchInput = document.getElementById("searchbar").value.toUpperCase();

  taskStorage.forEach((taskData) => {
    if(taskData.title.toUpperCase().indexOf(searchInput) >= 0)
    {
      document.getElementById(taskData.id).style.display = "";
    }
    else{
      document.getElementById(taskData.id).style.display = "none";
    }
  });
};
