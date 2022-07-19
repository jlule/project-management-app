
// When the user clicks the logout button they're redirected to the homepage and their token is cleared...

function logout() {


    localStorage.removeItem("token");
    window.location.href = "/index.html";

}

document.querySelector("#logout").addEventListener("click", logout)



// Create Project Form ======================================================================================================================================

const addProjectButton = document.querySelector("#add-project");

function generateProjectForm(){

    document.querySelector("#add-project").innerHTML = 
    `
    <form id="add-project">
        <label for="project-title">Project Title</label>
        <input required id="project-title" type="text" name="project-title">
        <label for="project-desc">Project Description</label>
        <textarea required id="project-desc"  name="project-desc" resize="none" cols="30" rows="10"></textarea>
        <input type="submit" value="Create Project">
    </form>
    `

    document.querySelector("#add-project-button").style.display = 'none';
    document.querySelector("#my-projects-button").style.display = 'none';
}

document.querySelector("#add-project-button").addEventListener("click", generateProjectForm)
// progress bar
function move() {
  var elem = document.getElementById("myBar");   
  var width = 20;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
    } else {
      width++; 
      elem.style.width = width + '%'; 
      elem.innerHTML = width * 1  + '%';
    }
  }
}

// (POSTS Project Form to Database) ======================================================================================================================

const createProjectForm = document.querySelector('#add-project');

function createProject(event) {

    event.preventDefault(event);

    // turns data into JSON...

    const data = new FormData(event.target);
    const object = {};
    data.forEach((value, key) => object[key] = value);
    const json = JSON.stringify(object);
    const parsed = JSON.parse(json)

    const projectTitle = parsed["project-title"];
    const projectDesc = parsed["project-desc"];

    // POSTS JSON into JSON server...

    axios.post("http://localhost:3000/projects", {

        title: projectTitle,
        description: projectDesc,
        userID: sessionStorage.getItem("currentUser")

      })

      .then((response) => {
        console.log(response.data);
        window.alert("Your Project has been posted!")

      })

      .catch(function (error) {
        console.log(error.toJSON());
        window.alert("invalid credentials, try again.")
      });
      

}

createProjectForm.addEventListener('submit', createProject);



// (GET Project from Database) =======================================================================================================================

// When button clicked, fetch data...


const myProjectsButton = document.querySelector('#my-projects-button');

function getProjects(){

  let projTitle = "";
  let projDesc = "";


    // POSTS JSON into JSON server...

    axios.get('http://localhost:3000/projects')
    .then(function (response) {
        console.log(response.data[0]['userID']); // returns 1.
        // 1. iterate through all projects, and pull the ones from the user...
        // Loops through all of the projects in the database and console.logs all the ones belonging to the logged in user...
        let index = 0;
        let index2 = 0;
        let counter = 0;
        let userProjectsArray = []



        while(index < response.data.length){

          if(response.data[index]["userID"] === sessionStorage.getItem('currentUser'))

            userProjectsArray.push(response.data[index])
            index += 1;
            counter += 1;

        }

        console.log(userProjectsArray)
        console.log(userProjectsArray.length)

        if (userProjectsArray == 0) {
          alert("You don't have any projects.")
        }

        //1. Get all projects.
        //2. Count how many there are.
        //3. Post the HTML x amount of times
        // GET Title = console.log(response.data[index]["title"])
        // GET Description = console.log(response.data[index]["description"])

        // 2. Generate HTMl with info about each project, add an edit tool for PUT/DELETE requests...
        while(index2 < userProjectsArray.length){

          const projTitle = userProjectsArray[index2]["title"];
          const projDesc = userProjectsArray[index2]["description"];
          const projId = userProjectsArray[index2]["id"];

          document.querySelector("#my-projects").innerHTML +=
          `
          <div id="project-${index2 + 1}"class="project-box" data-id=${projId}>
            <span id="edit-icon" class="material-symbols-outlined">
                edit
            </span>
            <span id="delete-icon" class="material-symbols-outlined" data-id=${projId}>
                delete_forever 
            </span>
            <h1>${projTitle}</h1>
            <p>${projDesc}</p>
          </div>
          `
          index2 += 1;
        
        }

    })
      .catch(function (error) {
        console.log(error.toJSON());
        window.alert("You don't have any projects.")
      });

      eraseButton = document.querySelector('#delete-icon');
      eraseButton.addEventListener('click', deleteProject);

}

myProjectsButton.addEventListener('click', getProjects);



// EDIT PROJECTS (PUT) ========================================================================================================================
// DELETE PROJECTS (DELETE) ==========================================================================================================================

// 1. Identify which project you're deleting



const projectDiv = document.querySelector('#my-projects');



function deleteProject(element) {

    // event.preventDefault(event);

    const projectId = parseInt(element)

    console.log(projectId)

    axios.delete(`http://localhost:3000/projects/${projectId}`)

      .then((response) => {
        
        window.alert("Project has been deleted.")

      })

      .catch(function (error) {
        console.log(error.toJSON());
        window.alert("Something went wrong, try again later.")
      });

}

function editProject(element) {

  // 1. Remove the title and description and turn them into an input and text area form field with those values.
  // 2. Allow the user to submit their changes and click submit.



  // event.preventDefault(event);

  const projectId = parseInt(element)

  console.log(projectId)

  axios.put(`http://localhost:3000/projects/${projectId}`)({





  }).then((response) => {
      
      window.alert("Project has been deleted.")

    })

    .catch(function (error) {
      console.log(error.toJSON());
      window.alert("Something went wrong, try again later.")
    });

}

projectDiv.addEventListener("click", (e)=>{

  if (e.target && e.target.nodeName === 'SPAN' && e.target.id === "delete-icon"){

    deleteProject(e.target.attributes["data-id"]["value"])
    console.log('DELETE')




  }

  else if (e.target && e.target.nodeName === 'SPAN' && e.target.id === "edit-icon") {

    editProject(e.target.attributes["data-id"]["value"])
    console.log("EDIT")

    

  }

})
