const GRID = 4;
const PIECE_SIZE = 120;
const MAP_SIZE = GRID * PIECE_SIZE;

const map = L.map('map').setView([53.4289, 14.5530], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let userMarker = null;

document.getElementById('btn-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Twoja przeglądarka nie obsługuje geolokalizacji');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      map.setView([lat, lon], 15);

      if (userMarker) {
        map.removeLayer(userMarker);
      }

      userMarker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup(`Jesteś tutaj!<br>Lat: ${lat.toFixed(5)}<br>Lon: ${lon.toFixed(5)}`)
        .openPopup();
    },
    (err) => {
      alert('Błąd geolokalizacji: ' + err.message);
    }
  );
});

function latLngToTile(lat, lng, zoom) {
  const n = Math.pow(2, zoom);
  const x = Math.floor((lng + 180) / 360 * n);
  const latRad = lat * Math.PI / 180;
  const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
  return { x, y };
}

document.getElementById('btn-download').addEventListener('click', () => {
  const canvas = document.getElementById('map-canvas');
  canvas.width = MAP_SIZE;
  canvas.height = MAP_SIZE;
  const ctx = canvas.getContext('2d');

  const zoom = map.getZoom();
  const center = map.getCenter();
  const centerTile = latLngToTile(center.lat, center.lng, zoom);

  let loaded = 0;
  const total = GRID * GRID;

  for (let row = 0; row < GRID; row++) {
    for (let col = 0; col < GRID; col++) {
      const tx = centerTile.x - Math.floor(GRID / 2) + col;
      const ty = centerTile.y - Math.floor(GRID / 2) + row;

      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        ctx.drawImage(img, col * PIECE_SIZE, row * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE);
        loaded++;
        if (loaded === total) {
          canvas.style.display = 'block';
          console.debug('Mapa pobrana!');
          initPuzzle(canvas);
        }
      };

      img.src = `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`;
      img.referrerPolicy = 'no-referrer';
    }
  }
});

let pieces = [];
let slots = [];

function initPuzzle(sourceCanvas) {
  pieces = [];
  slots = [];

  const piecesContainer = document.getElementById('puzzle-pieces');
  const boardContainer = document.getElementById('puzzle-board');
  piecesContainer.innerHTML = '';
  boardContainer.innerHTML = '';

  for (let i = 0; i < GRID * GRID; i++) {
    const row = Math.floor(i / GRID);
    const col = i % GRID;

    const pieceCanvas = document.createElement('canvas');
    pieceCanvas.width = PIECE_SIZE;
    pieceCanvas.height = PIECE_SIZE;
    const pCtx = pieceCanvas.getContext('2d');
    pCtx.drawImage(
      sourceCanvas,
      col * PIECE_SIZE, row * PIECE_SIZE, PIECE_SIZE, PIECE_SIZE,
      0, 0, PIECE_SIZE, PIECE_SIZE
    );

    const div = document.createElement('div');
    div.className = 'puzzle-piece';
    div.draggable = true;
    div.addEventListener('dragstart', onDragStart);
    div.addEventListener('dragend', onDragEnd);
    div.dataset.id = i;
    div.appendChild(pieceCanvas);

    piecesContainer.appendChild(div);
    pieces.push({ id: i, el: div });
  }

  shufflePieces(piecesContainer);

  for (let i = 0; i < GRID * GRID; i++) {
    const slot = document.createElement('div');
    slot.className = 'puzzle-slot';
    slot.dataset.slot = i;
    slot.addEventListener('dragover', onDragOver);
    slot.addEventListener('drop', onDrop);
    slot.addEventListener('dragleave', onDragLeave);
    boardContainer.appendChild(slot);
    slots.push(slot);
  }
}

function shufflePieces(container) {
  const children = Array.from(container.children);
  for (let i = children.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    container.appendChild(children[j]);
    children.splice(j, 1);
  }
  children.forEach(c => container.appendChild(c));
}

let draggedPieceId = null;
let dragSource = null;

function onDragStart(e) {
  draggedPieceId = parseInt(e.currentTarget.dataset.id);
  dragSource = e.currentTarget.parentElement.id === 'puzzle-pieces'
    ? 'table'
    : parseInt(e.currentTarget.parentElement.dataset.slot);
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', draggedPieceId);
}

function onDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
}

function onDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function onDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');

  const targetSlot = e.currentTarget;
  const targetSlotIdx = parseInt(targetSlot.dataset.slot);
  const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
  const piece = pieces[pieceId];
  const pieceEl = piece.el;

  if (targetSlot.children.length > 0) {
    const occupant = targetSlot.children[0];
    const occupantId = parseInt(occupant.dataset.id);

    if (dragSource === 'table') {
      document.getElementById('puzzle-pieces').appendChild(occupant);
    } else {
      slots[dragSource].innerHTML = '';
      slots[dragSource].appendChild(occupant);
    }

    pieces[occupantId].placed = false;
  } else {
    if (dragSource === 'table') {
      pieceEl.remove();
    } else {
      slots[dragSource].innerHTML = '';
    }
  }

  targetSlot.appendChild(pieceEl);
  piece.placed = (targetSlotIdx === pieceId);

  checkWin();
}

function checkWin() {
  for (let i = 0; i < GRID * GRID; i++) {
    const slot = slots[i];
    if (slot.children.length === 0) return;
    const placedId = parseInt(slot.children[0].dataset.id);
    if (placedId !== i) return;
  }

  console.debug('Puzzle ułożone poprawnie!');
  alert('Gratulacje!');
  sendWinNotification();
}

function sendWinNotification() {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification('PTW LAB C', {
      body: 'Gratulacje!'
    });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(perm => {
      if (perm === 'granted') {
        new Notification('PTW LAB C', {
          body: 'Gratulacje!'
        });
      }
    });
  }
}

requestNotificationPermission();

function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
