function Todos () {
  this.input = document.querySelector(".inputTodo");
  this.todoWrapper = document.querySelector(".todoWrapper");
  this.needEndingTodos = document.querySelector(".needEnding_text");
  this.buttonAllTodos = document.querySelector(".categoryTodos_all");
  this.buttonActiveTodos = document.querySelector(".categoryTodos_active");
  this.buttonComletedTodos = document.querySelector(".categoryTodos_completed");
  this.buttonClearTodos = document.querySelector(".clearCompletedTodosButton");

  this.dataAllTodos = [];
}
Todos.prototype.start = function () {
  /*this.getTodosFromServer();*/
  this.getTodosFromServer2("http://localhost:3000/todos")
      .then(data => {
        this.renderTodos(data);
      });
  this.calcTodos();
  this.clickInput();
  this.buttonAllTodos.addEventListener("click", this.clickAllTodos);
  this.buttonActiveTodos.addEventListener("click", this.clickActiveTodos);
  this.buttonComletedTodos.addEventListener("click", this.clickComletedTodos);
  this.buttonClearTodos.addEventListener("click", this.clickClearTodos);
}
/*Todos.prototype.getTodosFromServer = async () => {
  await fetch("http://localhost:3000/todos")
      .then((resp) => resp.json())
      .then(data => {
        myTodos.renderTodos(data);
      })
      .catch(function(error) {
          console.log(error);
        });
}*/
Todos.prototype.getTodosFromServer2 = async (url) => {
  let res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, статус: ${res.status}`);
  }
  return await res.json();
}
Todos.prototype.renderTodos = function (data) {
  data.forEach(function (item) {
    let status = null;
    let styleTextDone = null;
    if (item.checked) {
      status = "checked";
      styleTextDone = "todoDescriptionChecked";
    } else {
      status = "";
      styleTextDone = "todoDescription";
    }
    myTodos.todoWrapper.insertAdjacentHTML("beforeend", `
        <div class="todo animate__bounceIn">
            <input type="checkbox" name="doneOrNot" class="todoCheckbox" ${status}>
            <p class="${styleTextDone}">${item.text}</p>
        </div>
      `);
  });
}
Todos.prototype.pushTodosToServer = async (object) => {
  await fetch("http://localhost:3000/todos", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      'Accept': 'application/json'
    },
    body: object
  });
}
Todos.prototype.deleteTodosFromSever = async function (id) {
  await fetch("http://localhost:3000/todos/" + id, {
    method: "DELETE",
    headers: {
      'Content-type': 'application/json'
    }
  })
}
Todos.prototype.patchTodosToServer = async (object, id) => {
  await fetch("http://localhost:3000/todos/"+id , {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
      'Accept': 'application/json'
    },
    body: object
  });
}

Todos.prototype.clickInput = function (event) {
  const that = this;
  this.input.addEventListener("change", function (event) {
    if (that.input.value !== "" && that.input.value !== " ") {
      that.todoWrapper.insertAdjacentHTML("beforeend", `
        <div class="todo animate__bounceIn">
            <input type="checkbox" name="doneOrNot" class="todoCheckbox">
            <p class="todoDescription">${that.input.value}</p>
        </div>
      `);
      let object = {
        id: null,
        checked: false,
        text: that.input.value,
      }
      that.pushTodosToServer(JSON.stringify(object));
    } else {
      console.log("inputError");
    }
    that.input.value = "";
  });
}
Todos.prototype.calcTodos = function (event) {
  let countTodos = 0;
  this.getTodosFromServer2("http://localhost:3000/todos")
      .then(data => {
        data.forEach(function (item) {
          if (item.checked) {
            countTodos++;
            console.log(countTodos);
          }
        });
        this.needEndingTodos.innerHTML = `${parseInt(countTodos)} items left`;
      });

}
Todos.prototype.clickAllTodos = function (event) {
  document.querySelectorAll(".todo").forEach(function (item) {
    item.remove();
  });
  myTodos.getTodosFromServer2("http://localhost:3000/todos")
      .then(data => {
        myTodos.renderTodos(data);
      });
  myTodos.calcTodos();
}
Todos.prototype.clickActiveTodos = function (event) {
  document.querySelectorAll(".todo").forEach(function (item) {
    item.remove();
  });
  myTodos.getTodosFromServer2("http://localhost:3000/todos")
      .then(data => {
        data.forEach(function (item) {
          let status = null;
          let styleTextDone = null;
          if (item.checked) {
            status = "checked";
            styleTextDone = "todoDescriptionChecked";
          } else {
            status = "";
            styleTextDone = "todoDescription";
          }
          if (!item.checked) {
            myTodos.todoWrapper.insertAdjacentHTML("beforeend", `
              <div class="todo animate__bounceIn">
                  <input type="checkbox" name="doneOrNot" class="todoCheckbox" ${status}>
                  <p class="${styleTextDone}">${item.text}</p>
              </div>
            `);
          }
        });
      });
  myTodos.calcTodos();
}
Todos.prototype.clickComletedTodos = function (event) {
  document.querySelectorAll(".todo").forEach(function (item) {
    item.remove();
  });
  myTodos.getTodosFromServer2("http://localhost:3000/todos")
      .then(data => {
        data.forEach(function (item) {
          let status = null;
          let styleTextDone = null;
          if (item.checked) {
            status = "checked";
            styleTextDone = "todoDescriptionChecked";
          } else {
            status = "";
            styleTextDone = "todoDescription";
          }
          if (item.checked) {
            myTodos.todoWrapper.insertAdjacentHTML("beforeend", `
              <div class="todo animate__bounceIn">
                  <input type="checkbox" name="doneOrNot" class="todoCheckbox" ${status}>
                  <p class="${styleTextDone}">${item.text}</p>
              </div>
            `);
          }
        });
      });
  myTodos.calcTodos();
/*  myTodos.dataAllTodos.forEach(function (item) {
    let status = null;
    if (item.checked) {
      status = "checked";
    } else {
      status = "";
    }
    if (item.checked) {
      myTodos.todoWrapper.insertAdjacentHTML("beforeend", `
        <div class="todo animate__bounceIn">
            <input type="checkbox" name="doneOrNot" class="todoCheckbox" ${status}>
            <p class="todoDescription">${item.text}</p>
        </div>
      `);
    } else {

    }
  });*/
}
Todos.prototype.clickClearTodos = function (event) {
  myTodos.getTodosFromServer2("http://localhost:3000/todos")
      .then(data => {
        for (let i = 0; data.length > i; i++) {
          if (data[i].checked) {
            myTodos.deleteTodosFromSever(data[i].id);
           /* i--;*/
          }
        }
      });

  document.querySelectorAll(".todo").forEach(function (item) {
    if (item.children[0].checked) {
      item.classList.add("animate__bounceOut");
      item.remove();
    }
  });
  myTodos.calcTodos();
}

window.addEventListener("click", function (event) {
  let target = event.target;
  if (target.closest(".todo")) {
    let target2 = target.closest(".todo");
    if (target2.children[1].classList.contains("todoDescription")) {
      target2.children[1].classList.remove("todoDescription");
      target2.children[1].classList.add("todoDescriptionChecked");
    } else {
      target2.children[1].classList.remove("todoDescriptionChecked");
      target2.children[1].classList.add("todoDescription");
    }
    myTodos.getTodosFromServer2("http://localhost:3000/todos")
        .then(data => {
          data.forEach(function (item) {
            if (item.text === target2.children[1].innerText) {
              item.checked = target2.children[0].checked;
              let id = item.id;
              /*myTodos.deleteTodosFromSever(item.id);
              myTodos.pushTodosToServer(JSON.stringify(item));*/
              myTodos.patchTodosToServer(JSON.stringify(item), id);
            }
          });
          myTodos.calcTodos();
        });
  }
})


const myTodos = new Todos();
myTodos.start();
