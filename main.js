let form = document.querySelector("#createUserForm");
let formBtn = document.querySelector("#formBtn");
let alertsContainer = document.querySelector("#alerts");
let baseUrl = "http://127.0.0.1";
let port = ":8000";

form.addEventListener("submit", createUser);
getUsers();

function createUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/createUser`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("sukurtas");
                form.reset();
                getUsers();
            }
        })
}

function getUsers() {
    fetch(`${baseUrl}${port}/getUsers`)
        .then(response => response.json())
        .then(data => {
            fillTable(data);
        })
}

function fillTable(data) {
    let tbody = document.querySelector("#tbody");
    let HTML = "";
    let counter = 1;
    data.forEach(user => {
        HTML += `<tr>
                    <td>${counter++}</td>
                    <td>${user.firstName}</td>
                    <td>${user.lastName}</td>
                    <td>${user.email}</td>
                    <td><img src="${user.avatar}" alt="Avatar" class="img-thumbnail"></td>
                    <td>
                        <a href="" userId="${user.id}"class="btn btn-sm btn-primary update"><i class="fas fa-edit"></i> Edit</a>
                        <a href="" userId="${user.id}" class="btn btn-sm btn-danger delete"><i class="fas fa-trash-alt"></i> Delete</a>
                    </td>
                </tr>`;
});
    tbody.innerHTML = HTML;
    addEventListenersOnDelete();
    addEventListenersOnUpdate();
}

function addEventListenersOnUpdate() {
    let updateBnts = document.querySelectorAll(".update");
    updateBnts.forEach(btn => {
        btn.addEventListener("click", function (event) {
            event.preventDefault();
            editUser(btn.getAttribute("userId"));
            window.scrollTo(0, 0);
        })
    });
}

function addEventListenersOnDelete() {
    let deleteBnts = document.querySelectorAll(".delete");
    deleteBnts.forEach(btn => {
        btn.addEventListener("click", function (event) {
            deleteUser(btn.getAttribute("userId"));
        })
    });
}

function deleteUser(userId) {
    event.preventDefault();
    const formData = { "id": userId };
    fetch(`${baseUrl}${port}/deleteUser`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("ištrintas");
                getUsers();
            }
        })
    window.scrollTo(0, 0);
}

function editUser(id) {
    toggleForm(true);
    getUser(id);
}

function getUser(id) {
    fetch(`${baseUrl}${port}/getUser?id=${id}`)
        .then(response => response.json())
        .then(data => {
            fillForm(data);
        })
}

function fillForm(user) {
    document.querySelector("#firstName").value = user.firstName;
    document.querySelector("#lastName").value = user.lastName;
    document.querySelector("#avatar").value = user.avatar;
    document.querySelector("#email").value = user.email;
    document.querySelector("#id").value = user.id;
}

function updateUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch(`${baseUrl}${port}/updateUser`, {
        method: "POST",
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (response.ok) {
                showAlert("atnaujintas");
                form.reset();
                getUsers();
                toggleForm(false);
            }
        })
}

function toggleForm(state) {
    formBtn.classList.toggle("btn-success");
    formBtn.classList.toggle("btn-primary");
    document.querySelector("#id").value = "";
    if (state) {
        formBtn.innerText = "Atnaujinti";
        form.removeEventListener("submit", createUser);
        form.addEventListener("submit", updateUser);

    } else {
        formBtn.innerText = "Įrašyti";
        form.removeEventListener("submit", updateUser);
        form.addEventListener("submit", createUser);
    }
}

function showAlert(status) {
    alertsContainer.innerHTML = `
        <div class="alert alert-success">
            <strong>Success!</strong> Vartotojas sėkmingai ${status}.
        </div>
    `;
    setTimeout(() => {
        alertsContainer.innerHTML = ''; // Clear the alert message
    }, 3000);
}