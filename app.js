// state: status = "loading" | "error" | "success"
const state = { status: "loading", tugas: [], error: "", filter: "semua" };

const daftar = document.getElementById("daftar");
const counter = document.getElementById("counter");
const kosong = document.getElementById("kosong");
const info = document.getElementById("info");
const inputMatkul = document.getElementById("matkul");
const tombolFilter = document.querySelectorAll(".filter button");

// helper: semua request lewat sini
async function api(url, method, data) {
  const opsi = { method: method || "GET" };

  if (data) {
    opsi.headers = { "Content-Type": "application/json" };
    opsi.body = JSON.stringify(data);
  }

  const res = await fetch(url, opsi);

  if (!res.ok) {
    const isi = await res.json();
    throw new Error(isi.error || "HTTP " + res.status);
  }

  if (res.status === 204) {
    return null;
  }
  return res.json();
}

function render() {
  daftar.textContent = "";
  kosong.textContent = "";
  info.textContent = "";
  info.className = "";
  counter.textContent = "";

  // state loading
  if (state.status === "loading") {
    info.textContent = "Memuat tugas dari server...";
    return;
  }

  // state error + tombol coba lagi
  if (state.status === "error") {
    info.className = "gagal";
    info.textContent = "Gagal memuat: " + state.error;

    const ulang = document.createElement("button");
    ulang.id = "ulang";
    ulang.textContent = "Coba lagi";
    info.appendChild(ulang);
    return;
  }

  // state success: filter lalu urutkan deadline terdekat
  const tampil = [];
  for (const t of state.tugas) {
    if (state.filter === "semua") {
      tampil.push(t);
    } else if (state.filter === "aktif" && !t.selesai) {
      tampil.push(t);
    } else if (state.filter === "selesai" && t.selesai) {
      tampil.push(t);
    }
  }
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

    const isi = document.createElement("div");
    isi.className = "info";

    const judul = document.createElement("span");
    judul.className = "judul";
    judul.textContent = t.judul;

    const detail = document.createElement("small");
    detail.textContent = t.matkul + " · deadline " + t.deadline;

    const hapus = document.createElement("button");
    hapus.className = "hapus";
    hapus.textContent = "✕";

    isi.appendChild(judul);
    isi.appendChild(detail);
    li.appendChild(cek);
    li.appendChild(isi);
    li.appendChild(hapus);
    daftar.appendChild(li);
  }

  // counter dihitung dari semua tugas, bukan yang difilter
  let aktif = 0;
  for (const t of state.tugas) {
    if (!t.selesai) {
      aktif++;
    }
  }
  counter.textContent = aktif + " tugas aktif";

  // state kosong
  if (tampil.length === 0) {
    kosong.textContent = "Belum ada tugas.";
  }
}

function isiMatkul(daftarMatkul) {
  inputMatkul.textContent = "";
  for (const m of daftarMatkul) {
    const opsi = document.createElement("option");
    opsi.value = m.nama;
    opsi.textContent = m.nama;
    inputMatkul.appendChild(opsi);
  }
}

async function muat() {
  state.status = "loading";
  render();

  try {
    const hasil = await Promise.all([api("/api/tugas"), api("/api/matkul")]);
    state.tugas = hasil[0];
    isiMatkul(hasil[1]);
    state.status = "success";
  } catch (err) {
    state.status = "error";
    state.error = err.message;
  }

  render();
}

// tombol coba lagi dibuat lewat JS, jadi pakai delegation di #info
info.addEventListener("click", function (e) {
  if (e.target.id === "ulang") {
    muat();
  }
});

// filter Semua / Aktif / Selesai
for (const tombol of tombolFilter) {
  tombol.addEventListener("click", function () {
    state.filter = tombol.dataset.filter;

    for (const b of tombolFilter) {
      b.classList.remove("on");
    }
    tombol.classList.add("on");

    render();
  });
}

muat();