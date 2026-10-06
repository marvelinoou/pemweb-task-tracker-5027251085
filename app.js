// state: array of objects, diambil dari localStorage
let tugas = JSON.parse(localStorage.getItem("tugas")) || [];
let filter = "semua";

const form = document.getElementById("form-tugas");
const inputJudul = document.getElementById("judul");
const inputMatkul = document.getElementById("matkul");
const inputDeadline = document.getElementById("deadline");
const pesanError = document.getElementById("error");
const daftar = document.getElementById("daftar");
const counter = document.getElementById("counter");
const kosong = document.getElementById("kosong");
const tombolFilter = document.querySelectorAll(".filter button");

function simpan() {
  localStorage.setItem("tugas", JSON.stringify(tugas));
}

function render() {
  daftar.textContent = "";

  // pilih tugas sesuai filter
  let tampil = [];
  for (const t of tugas) {
    if (filter === "semua") {
      tampil.push(t);
    } else if (filter === "aktif" && !t.selesai) {
      tampil.push(t);
    } else if (filter === "selesai" && t.selesai) {
      tampil.push(t);
    }
  }

  // urutkan deadline terdekat
  tampil.sort(function (a, b) {
    return a.deadline.localeCompare(b.deadline);
  });

  for (const t of tampil) {
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

  // counter (dari semua tugas, bukan yang difilter)
  let aktif = 0;
  for (const t of tugas) {
    if (!t.selesai) {
      aktif++;
    }
  }
  counter.textContent = aktif + " tugas aktif";

  // pesan kalau kosong
  if (tampil.length === 0) {
    kosong.textContent = "Belum ada tugas.";
  } else {
    kosong.textContent = "";
  }
}

// form tambah tugas
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const judul = inputJudul.value.trim();
  const matkul = inputMatkul.value;
  const deadline = inputDeadline.value;

  if (judul.length < 3) {
    pesanError.textContent = "Judul minimal 3 karakter.";
    return;
  }
  if (deadline === "") {
    pesanError.textContent = "Deadline wajib diisi.";
    return;
  }

  pesanError.textContent = "";

  tugas.push({
    id: Date.now(),
    judul: judul,
    matkul: matkul,
    deadline: deadline,
    selesai: false,
  });

  inputJudul.value = "";
  inputDeadline.value = "";

  simpan();
  render();
});

// event delegation: satu listener di ul untuk semua item
daftar.addEventListener("click", function (e) {
  const li = e.target.parentElement;
  const id = Number(li.dataset.id);

  if (e.target.className === "hapus") {
    tugas = tugas.filter(function (t) {
      return t.id !== id;
    });
    simpan();
    render();
  }

  if (e.target.type === "checkbox") {
    for (const t of tugas) {
      if (t.id === id) {
        t.selesai = e.target.checked;
      }
    }
    simpan();
    render();
  }
});

// filter Semua / Aktif / Selesai
for (const tombol of tombolFilter) {
  tombol.addEventListener("click", function () {
    filter = tombol.dataset.filter;

    for (const b of tombolFilter) {
      b.classList.remove("on");
    }
    tombol.classList.add("on");

    render();
  });
}

render();