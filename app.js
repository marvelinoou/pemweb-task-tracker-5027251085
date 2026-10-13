// state: status = "loading" | "error" | "success"
const state = { status: "loading", tugas: [], error: "", filter: "semua" };

const form = document.getElementById("form-tugas");
const inputJudul = document.getElementById("judul");
const inputMatkul = document.getElementById("matkul");
const inputDeadline = document.getElementById("deadline");
const pesanError = document.getElementById("error");
const tombolTambah = document.querySelector(".tambah");
const daftar = document.getElementById("daftar");
const counter = document.getElementById("counter");
const kosong = document.getElementById("kosong");
const info = document.getElementById("info");
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

  if (state.status === "loading") {
    info.textContent = "Memuat tugas dari server...";
    return;
  }

  if (state.status === "error") {
    info.className = "gagal";
    info.textContent = "Gagal memuat: " + state.error;

    const ulang = document.createElement("button");
    ulang.id = "ulang";
    ulang.textContent = "Coba lagi";
    info.appendChild(ulang);
    return;
  }

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

  let aktif = 0;
  for (const t of state.tugas) {
    if (!t.selesai) {
      aktif++;
    }
  }
  counter.textContent = aktif + " tugas aktif";

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

// form tambah tugas: POST ke server
form.addEventListener("submit", async function (e) {
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

  tombolTambah.disabled = true;
  tombolTambah.textContent = "Menyimpan...";

  try {
    const baru = await api("/api/tugas", "POST", {
      judul: judul,
      matkul: matkul,
      deadline: deadline,
    });

    state.tugas.push(baru);
    inputJudul.value = "";
    inputDeadline.value = "";
    render();
  } catch (err) {
    pesanError.textContent = "Gagal menyimpan: " + err.message;
  } finally {
    tombolTambah.disabled = false;
    tombolTambah.textContent = "Tambah";
  }
});

// event delegation: satu listener di ul, PATCH (selesai) dan DELETE (hapus)
daftar.addEventListener("click", async function (e) {
  const li = e.target.parentElement; // checkbox dan tombol hapus anak langsung dari li
  const id = Number(li.dataset.id);
  const hapus = e.target.className === "hapus";
  const centang = e.target.type === "checkbox";

  // klik di tempat lain diabaikan
  if (!hapus && !centang) {
    return;
  }

  // tandai item sedang diproses
  li.classList.add("proses");
  pesanError.textContent = "";

  try {
    if (hapus) {
      await api("/api/tugas/" + id, "DELETE");
      state.tugas = state.tugas.filter(function (t) {
        return t.id !== id;
      });
    } else {
      const baru = await api("/api/tugas/" + id, "PATCH", {
        selesai: e.target.checked,
      });

      // ganti item lama dengan objek terbaru dari server
      for (let i = 0; i < state.tugas.length; i++) {
        if (state.tugas[i].id === id) {
          state.tugas[i] = baru;
        }
      }
    }
  } catch (err) {
    pesanError.textContent = "Gagal memperbarui: " + err.message;
  }

  // render ulang: sukses atau gagal, tampilan kembali sesuai state
  render();
});

info.addEventListener("click", function (e) {
  if (e.target.id === "ulang") {
    muat();
  }
});

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