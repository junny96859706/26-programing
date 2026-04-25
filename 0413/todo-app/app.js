(function () {
  "use strict";

  var STORAGE_KEY = "daily-todo-items";
  var YMD_RE = /^\d{4}-\d{2}-\d{2}$/;

  var form = document.getElementById("add-form");
  var input = document.getElementById("todo-input");
  var dueInput = document.getElementById("due-input");
  var board = document.getElementById("todo-board");
  var pendingList = document.getElementById("todo-list-pending");
  var doneList = document.getElementById("todo-list-done");
  var emptyHint = document.getElementById("empty-hint");
  var emptyPending = document.getElementById("empty-pending");
  var emptyDone = document.getElementById("empty-done");

  var editingId = null;

  function normalizeDue(v) {
    if (v == null || typeof v !== "string") return null;
    var s = v.trim();
    if (!YMD_RE.test(s)) return null;
    return s;
  }

  function startOfToday() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function parseYmdLocal(ymd) {
    var p = ymd.split("-");
    if (p.length !== 3) return null;
    var y = parseInt(p[0], 10);
    var m = parseInt(p[1], 10);
    var d = parseInt(p[2], 10);
    if (!y || m < 1 || m > 12 || d < 1 || d > 31) return null;
    return new Date(y, m - 1, d);
  }

  function isOverdue(ymd) {
    if (!ymd) return false;
    var dt = parseYmdLocal(ymd);
    if (!dt || isNaN(dt.getTime())) return false;
    return dt < startOfToday();
  }

  function formatDueLabel(ymd) {
    var dt = parseYmdLocal(ymd);
    if (!dt) return ymd;
    return dt.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  }

  function loadItems() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(function (item) {
          return item && typeof item.id === "string" && typeof item.text === "string";
        })
        .map(function (item) {
          return {
            id: item.id,
            text: item.text,
            done: Boolean(item.done),
            due: normalizeDue(item.due),
          };
        });
    } catch (e) {
      return [];
    }
  }

  function saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* quota or private mode */
    }
  }

  var items = loadItems();

  function nextId() {
    return "t-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
  }

  function dueFieldIdForEdit(itemId) {
    return "edit-due-" + itemId.replace(/[^a-zA-Z0-9]/g, "_");
  }

  function buildEditRow(item) {
    var li = document.createElement("li");
    li.className = "todo-item todo-item--editing";
    li.dataset.id = item.id;

    var editForm = document.createElement("form");
    editForm.className = "todo-edit-form";
    editForm.setAttribute("novalidate", "");

    var textIn = document.createElement("input");
    textIn.type = "text";
    textIn.className = "todo-input todo-edit-text";
    textIn.value = item.text;
    textIn.maxLength = 500;
    textIn.setAttribute("aria-label", "할 일 내용");
    textIn.placeholder = "할 일을 입력하세요";

    var dueWrap = document.createElement("div");
    dueWrap.className = "todo-edit-due";

    var dueFieldId = dueFieldIdForEdit(item.id);
    var dueLbl = document.createElement("label");
    dueLbl.className = "due-field-label";
    dueLbl.setAttribute("for", dueFieldId);
    dueLbl.textContent = "마감 기한";

    var dueIn = document.createElement("input");
    dueIn.type = "date";
    dueIn.id = dueFieldId;
    dueIn.className = "todo-input todo-input--date todo-edit-due-input";
    dueIn.value = item.due || "";

    dueWrap.appendChild(dueLbl);
    dueWrap.appendChild(dueIn);

    var actions = document.createElement("div");
    actions.className = "todo-edit-actions";

    var saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.className = "btn btn-primary btn--compact";
    saveBtn.textContent = "저장";

    var cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "btn btn-secondary btn--compact btn-edit-cancel";
    cancelBtn.textContent = "취소";

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    editForm.appendChild(textIn);
    editForm.appendChild(dueWrap);
    editForm.appendChild(actions);

    li.appendChild(editForm);
    return li;
  }

  function buildItemRow(item) {
    var overdue = !item.done && isOverdue(item.due);

    var li = document.createElement("li");
    li.className = "todo-item" + (item.done ? " done" : "") + (overdue ? " todo-item--overdue" : "");
    li.dataset.id = item.id;

    var label = document.createElement("label");
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "todo-checkbox";
    cb.checked = item.done;
    var ariaBase = item.done ? "예정으로 되돌리기: " : "완료로 이동: ";
    var ariaDue = item.due ? ", 마감 " + formatDueLabel(item.due) : "";
    cb.setAttribute("aria-label", ariaBase + item.text + ariaDue);

    var body = document.createElement("span");
    body.className = "todo-body";

    var span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = item.text;

    body.appendChild(span);

    if (item.due) {
      var dueEl = document.createElement("time");
      dueEl.className = "todo-due";
      dueEl.dateTime = item.due;
      dueEl.textContent = "마감: " + formatDueLabel(item.due);
      body.appendChild(dueEl);
    }

    label.appendChild(cb);
    label.appendChild(body);

    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.className = "btn btn-edit";
    editBtn.textContent = "편집";
    editBtn.setAttribute("aria-label", "편집: " + item.text);

    var delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn btn-danger";
    delBtn.textContent = "삭제";
    delBtn.setAttribute("aria-label", "삭제: " + item.text);

    li.appendChild(label);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    return li;
  }

  function rowForItem(item) {
    return editingId === item.id ? buildEditRow(item) : buildItemRow(item);
  }

  function updateEmptyStates(pending, done) {
    emptyHint.hidden = items.length > 0;
    board.hidden = items.length === 0;

    if (items.length === 0) return;

    emptyPending.hidden = pending.length > 0;
    emptyDone.hidden = done.length > 0;
  }

  function render() {
    var pending = items.filter(function (x) {
      return !x.done;
    });
    var done = items.filter(function (x) {
      return x.done;
    });

    pendingList.innerHTML = "";
    doneList.innerHTML = "";

    pending.forEach(function (item) {
      pendingList.appendChild(rowForItem(item));
    });
    done.forEach(function (item) {
      doneList.appendChild(rowForItem(item));
    });

    updateEmptyStates(pending, done);

    if (editingId) {
      var textEl = board.querySelector(".todo-edit-text");
      if (textEl) {
        requestAnimationFrame(function () {
          textEl.focus();
          textEl.select();
        });
      }
    }
  }

  board.addEventListener("change", function (e) {
    var target = e.target;
    if (!target.classList.contains("todo-checkbox")) return;
    var li = target.closest(".todo-item");
    if (!li || li.classList.contains("todo-item--editing")) return;
    var id = li.dataset.id;
    var item = items.find(function (x) {
      return x.id === id;
    });
    if (item) {
      item.done = target.checked;
      saveItems(items);
      render();
    }
  });

  board.addEventListener("click", function (e) {
    var cancelBtn = e.target.closest(".btn-edit-cancel");
    if (cancelBtn) {
      e.preventDefault();
      editingId = null;
      render();
      return;
    }

    var editBtn = e.target.closest(".btn-edit");
    if (editBtn) {
      var li = editBtn.closest(".todo-item");
      if (!li) return;
      editingId = li.dataset.id;
      render();
      return;
    }

    var delBtn = e.target.closest(".btn-danger");
    if (!delBtn) return;
    var li = delBtn.closest(".todo-item");
    if (!li || li.classList.contains("todo-item--editing")) return;
    var id = li.dataset.id;
    if (editingId === id) editingId = null;
    items = items.filter(function (x) {
      return x.id !== id;
    });
    saveItems(items);
    render();
  });

  board.addEventListener("submit", function (e) {
    var editForm = e.target.closest(".todo-edit-form");
    if (!editForm) return;
    e.preventDefault();
    var li = editForm.closest(".todo-item");
    if (!li) return;
    var id = li.dataset.id;
    var item = items.find(function (x) {
      return x.id === id;
    });
    if (!item) {
      editingId = null;
      render();
      return;
    }

    var textIn = editForm.querySelector(".todo-edit-text");
    var dueIn = editForm.querySelector(".todo-edit-due-input");
    var text = textIn ? textIn.value.trim() : "";
    if (!text) {
      if (textIn) textIn.focus();
      return;
    }
    var dueRaw = dueIn && dueIn.value ? dueIn.value.trim() : "";
    var due = dueRaw ? normalizeDue(dueRaw) : null;

    item.text = text;
    item.due = due;
    saveItems(items);
    editingId = null;
    render();
  });

  board.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || !editingId) return;
    var row = e.target.closest(".todo-item--editing");
    if (!row) return;
    editingId = null;
    render();
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    var dueRaw = dueInput.value.trim();
    var due = dueRaw ? normalizeDue(dueRaw) : null;
    items.push({ id: nextId(), text: text, done: false, due: due });
    saveItems(items);
    input.value = "";
    render();
    input.focus();
  });

  render();
})();
