// state: data dari server disimpan di sini
const state = { tugas: [] };

const daftar = document.getElementById("daftar");
const counter = document.getElementById("counter");
const inputMatkul = document.getElementById("matkul");

// helper: semua request lewat sini
async function api(url, method, data) {
  const opsi = { method: method || "GET" };

  // kalau ada data, kirim sebagai JSON
  if (data) {
    opsi.headers = { "Content-Type": "application/json" };
    opsi.body = JSON.stringify(data);
  }

  const res = await fetch(url, opsi);

  // fetch tidak reject untuk 400/500, jadi kita cek res.ok sendiri
  if (!res.ok) {
    const isi = await res.json();
    throw new Error(isi.error || "HTTP " + res.status);
  }

  // DELETE membalas 204 tanpa body, jadi tidak ada yang dibaca
  if (res.status === 204) {
    return null;
  }
  return res.json();
}

function render() {
  daftar.textContent = "";

  for (const t of state.tugas) {
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

  let aktif = 0;
  for (const t of state.tugas) {
    if (!t.selesai) {
      aktif++;
    }
  }
  counter.textContent = aktif + " tugas aktif";
}

// isi <select> dari daftar matkul server
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
  // dua request jalan bersamaan (paralel), bukan satu-satu
  const hasil = await Promise.all([api("/api/tugas"), api("/api/matkul")]);

  state.tugas = hasil[0]; // hasil pertama = tugas
  isiMatkul(hasil[1]); // hasil kedua = matkul
  render();
}

muat();