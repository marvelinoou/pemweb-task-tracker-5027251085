// state: array of objects
let tugas = [
  { id: 1, judul: "Lab 10 event delegation", matkul: "Pemrograman Web", deadline: "2026-10-08", selesai: false },
  { id: 2, judul: "Topologi jaringan kampus", matkul: "Komdat Jaringan Komputer", deadline: "2026-10-12", selesai: true },
];

const daftar = document.getElementById("daftar");
const counter = document.getElementById("counter");
const kosong = document.getElementById("kosong");

function render() {
  daftar.textContent = "";

  for (const t of tugas) {
    const li = document.createElement("li");
    li.dataset.id = t.id;
    if (t.selesai) {
      li.classList.add("selesai");
    }

    const cek = document.createElement("input");
    cek.type = "checkbox";
    cek.checked = t.selesai;

    const info = document.createElement("div");
    info.className = "info";

    const judul = document.createElement("span");
    judul.className = "judul";
    judul.textContent = t.judul;

    const detail = document.createElement("small");
    detail.textContent = t.matkul + " · deadline " + t.deadline;

    const hapus = document.createElement("button");
    hapus.className = "hapus";
    hapus.textContent = "✕";

    info.appendChild(judul);
    info.appendChild(detail);
    li.appendChild(cek);
    li.appendChild(info);
    li.appendChild(hapus);
    daftar.appendChild(li);
  }

  // counter
  let aktif = 0;
  for (const t of tugas) {
    if (!t.selesai) {
      aktif++;
    }
  }
  counter.textContent = aktif + " tugas aktif";

  // pesan kalau kosong
  if (tugas.length === 0) {
    kosong.textContent = "Belum ada tugas.";
  } else {
    kosong.textContent = "";
  }
}

render();