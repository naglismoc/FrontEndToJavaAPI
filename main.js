document.querySelector("#createUserForm").addEventListener("submit",createUser);

function createUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = {};
    for (let field of form.elements) {
        if (field.name) {
            formData[field.name] = field.value;
        }
    }
    fetch("http://127.0.0.1:8000/createUser", {
        method: "POST",
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            document.querySelector("#alerts").innerHTML = 
            `<div class="alert alert-success">
                <strong>Success!</strong> Vartotojas sėkmingai sukurtas.
            </div>`;
            form.reset();
            getUsers();
        }
    })
}

function getUsers() {
    fetch("http://127.0.0.1:8000/getUsers")
    // fetch("http://localhost:8000/getUsers")
    .then(response =>response.json())
    .then(data => {
        console.log(data);
        fillTable(data);
    })
}
getUsers();

function fillTable(data) {
    let tbody = document.querySelector("#tbody");
    let HTML = "";
    let counter = 1;
    data.forEach(user => {
        console.log(user.firstName);
        HTML += `<tr>
                                <td>${counter++}</td>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td>${user.email}</td>
                                <td><img src="${user.avatar}" alt="Avatar" class="img-thumbnail"></td>
                                <td>
                                    <a href="#" class="btn btn-sm btn-primary"><i class="fas fa-edit"></i> Edit</a>
                                    <a href="#" class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i> Delete</a>
                                </td>
                            </tr>`;
    }); 
    tbody.innerHTML = HTML;
}