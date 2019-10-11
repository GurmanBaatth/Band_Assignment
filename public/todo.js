(function() {
  let input = document.querySelector("#inp");
  let btn = document.querySelector("#btn");
  btn.onmouseover = function() {
    btn.style.backgroundColor = "wheat";
    btn.style.color = "black";
    btn.style.transition = ".8s";
  };
  btn.onmouseout = function() {
    btn.style.backgroundColor = "black";
    btn.style.color = "white";
    btn.style.transition = ".8s";
  };
  let list = document.querySelector("#list");
  let store = [];

  getArray();

  btn.addEventListener("click", addItm);
  function addItm() {
    let inpu = input.value;

    fetch(`/add`, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ todo: inpu })
    }).then(function(data) {
      if (data.status != 200) {
        console.error("Internal Server Error");
        return;
      }
      return data.json().then(function(d) {
        console.log(d);
        store.push(d);
        display(d);
        input.value = "";
        input.focus();
        console.log(store);
        localStorage.setItem("task", JSON.stringify(store));
      });
    });
  }

  function display(obj) {
    let li = document.createElement("li");
    li.style.paddingTop = "10px";

    li.setAttribute("id", obj._id);

    let span = document.createElement("div");
    span.style.paddingTop = "10px";
    let delbtn = document.createElement("button");
    delbtn.textContent = "delete";
    delbtn.style.border = "1px solid black";
    delbtn.style.padding = "5px";
    delbtn.style.boxShadow = "1px 2px 13px 7px rgba(0, 0, 0, 0.75)";

    delbtn.onmouseover = function() {
      delbtn.style.backgroundColor = "black";
      delbtn.style.color = "white";
      delbtn.style.transition = ".8s";
    };
    delbtn.onmouseout = function() {
      delbtn.style.backgroundColor = "lightgrey";
      delbtn.style.color = "black";
      delbtn.style.transition = ".8s";
    };
    let update = document.createElement("button");
    update.style.boxShadow = "1px 2px 13px 7px rgba(0, 0, 0, 0.75)";
    update.textContent = "Update";
    update.style.border = "1px solid black";
    update.style.padding = "5px";
    update.style.marginLeft = "10px";
    update.onmouseover = function() {
      update.style.backgroundColor = "black";
      update.style.color = "white";
      update.style.transition = ".8s";
    };
    update.onmouseout = function() {
      update.style.backgroundColor = "lightgrey";
      update.style.color = "black";
      update.style.transition = ".8s";
    };
    delbtn.addEventListener("click", delFunc);

    update.addEventListener("click", updFunc);

    let text = document.createTextNode(obj.a);
    li.appendChild(text);
    li.style.marginRight = "50px";
    span.appendChild(delbtn);

    span.appendChild(update);

    padding = "10px";
    list.appendChild(li);
    list.appendChild(span);
  }
  function updFunc() {
    let input = document.createElement("input");

    input.type = "text";
    input.style.height = "15px";

    var li = this.parentElement.previousElementSibling;

    input.value = li.textContent;
    var that = this;
    let list = that.parentNode.parentNode;

    let p_id = this.parentElement.previousSibling.id;
    let index = store
      .map(function(obj) {
        return obj._id;
      })
      .indexOf(p_id);
    list.replaceChild(input, li);

    input.style.height = "25px";
    input.style.marginTop = "15px";
    input.style.border = "2px solid black";
    input.style.fontSize = "17px";
    input.style.fontFamily = "Georgia, serif";
    input.focus();
    input.addEventListener("click", function() {
      li.textContent = input.value;
      let updatedVal = li.textContent;
      list.replaceChild(li, input);
      store[index] = updatedVal;

      fetch(`/update`, {
        method: "POST",
        headers: new Headers({ "content-type": "application/json" }),
        body: JSON.stringify({ index: index, id: p_id, value: updatedVal })
      })
        .then(function(data) {
          if (data.status !== 200) {
            console.error("Internal Server Error");
            return;
          }
          data.json().then(function(d) {
            console.log(d);
            store = d;
            localStorage.setItem("task", JSON.stringify(store));
          });
        })
        .catch(function(e) {
          console.log(e);
        });
    });
  }
  function delFunc() {
    var that = this;
    var li = this.parentNode.previousElementSibling;
    let p_id = this.parentElement.previousSibling.id;
    let index = store
      .map(function(obj) {
        return obj._id;
      })
      .indexOf(p_id);

    fetch(`/del`, {
      method: "POST",
      headers: new Headers({ "content-type": "application/json" }),
      body: JSON.stringify({ id: index, p_id: p_id })
    })
      .then(function(data) {
        if (data.status !== 200) {
          console.error("Internal Server Error");
          return;
        }
        data.json().then(function(d) {
          store = d;
          localStorage.setItem("task", JSON.stringify(store));
          that.parentNode.parentNode.removeChild(li);
          that.parentNode.parentNode.removeChild(that.parentNode);
        });
      })
      .catch(function(e) {
        console.log(e);
      });
  }

  function getArray() {
    // fetch(`/dashBoard`, { mode: "no-cors" }).then(function(data) {
    //     if (data.status != 200) {
    //       console.error("Internal Server Error");
    //       return;
    //     }
    //     return data.json().then(function(d) {
    //       console.log(d);
    //       store=[];
    //       store = d;
    //       store.forEach(function(i) {
    //         display(i);
    //       });
    //     });
    //   });
    fetch(`/data`, { mode: "no-cors" }).then(function(data) {
      if (data.status != 200) {
        console.error("Internal Server Error");
        return;
      }
      return data.json().then(function(d) {
        console.log(d);
        store=[];
        store = d;
        store.forEach(function(i) {
          display(i);
        });
      });
    });
  }
})();
