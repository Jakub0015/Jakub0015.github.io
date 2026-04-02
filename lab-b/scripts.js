class Todo {
  constructor() {
    this.tasks = [];
    this.term = '';
    this.load();
    this.przycisk();
    this.draw();
  }

  get filteredTasks() {

    if (this.term.length < 2) return this.tasks;
    const szukana = this.term.toLowerCase();
    return this.tasks.filter(task => task.text.toLowerCase().includes(szukana));

  }

  highlight(text) {

    if (this.term.length < 2) return text;
    const re = new RegExp(`(${this.term})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');

  }

  draw() {

    const lista = document.getElementById('zadania');
    lista.innerHTML = '';

    this.filteredTasks.forEach(task => {

      const div = document.createElement('div');
      div.className = 'task';

      const span = document.createElement('span');
      span.innerHTML = this.highlight(task.text);

      span.addEventListener('click', () => {

        const inputTekst = document.createElement('input');
        inputTekst.type = 'text';
        inputTekst.value = task.text;

        const inputData = document.createElement('input');
        inputData.type = 'datetime-local';
        inputData.value = task.date || '';

        inputTekst.addEventListener('blur', () => {
          this.edit(task.id, inputTekst.value, inputData.value);
        });

        div.replaceChild(inputTekst, span);
        inputTekst.focus();
        div.appendChild(inputData);
      });

      const btnUsun = document.createElement('button');
      btnUsun.textContent = 'Usuń';

      btnUsun.addEventListener('click', () => {
        this.remove(task.id);
      });

      div.appendChild(span);
      div.appendChild(btnUsun);
      lista.appendChild(div);
    });
  }

  add(text, date = '') {

    text = text.trim();

    if (text.length < 3) return 'Za krótkie';
    if (text.length > 255) return 'Za długie';
    if (date) {
      const wybrana = new Date(date);
      if (wybrana <= new Date()) return 'Data musi być w przyszłości';
    }

    this.tasks.push({ id: Date.now(), text, date });
    this.save();
    this.draw();

    return null;
  }

  przycisk() {

    const przycisk = document.getElementById('button');
    const inputTekst = document.getElementById('new_task');
    const inputData = document.getElementById('new_date');
    const error = document.getElementById('error');

    przycisk.addEventListener('click', () => {

      const tekst = inputTekst.value;
      const data = inputData.value;

      const blad = this.add(tekst, data);

      if (blad) {

        error.textContent = blad;

      } else {

        error.textContent = '';
        inputTekst.value = '';
        inputData.value = '';

      }
    });

    const wyszukiwarka = document.getElementById('search_input');
    wyszukiwarka.addEventListener('input', (e) => {

      this.term = e.target.value;
      this.draw();

    });
  }

  remove(id) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.save();
    this.draw();
  }

  save() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  load() {
    const data = localStorage.getItem('tasks');
    this.tasks = data ? JSON.parse(data) : [];
  }

  edit(id, newTekst, newData) {
    newTekst = newTekst.trim();

    if (newTekst.length < 3 || newTekst.length > 255) return;
    if (newData && new Date(newData) <= new Date()) return;

    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.text = newTekst;
      task.date = newData || '';
    }

    this.save();
    this.draw();
  }
}

document.todo = new Todo();
