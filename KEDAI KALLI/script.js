const menuData = {
  paket: [
    {
      nama: 'Paket 1', harga: 29000,
      pilihan: {
        sate: ['Sate Ayam', 'Sate Kambing'],
        teh: ['Teh Manis', 'Teh Tawar'],
        nasi: ['Nasi Putih']
      },
      gambar: 'images/paket1.jpeg'
    },
    {
      nama: 'Paket 2', harga: 34000,
      pilihan: {
        tongseng: ['Tongseng Ayam', 'Tongseng Kambing'],
        teh: ['Teh Manis', 'Teh Tawar'],
        nasi: ['Nasi Putih']
      },
      gambar: 'images/paket2.jpeg'
    },
    {
      nama: 'Paket 3', harga: 59000,
      pilihan: {
        tongseng: ['Tongseng Ayam', 'Tongseng Kambing'],
        sate: ['Sate Ayam', 'Sate Kambing'],
        teh: ['Teh Manis', 'Teh Tawar'],
        nasi: ['Nasi Putih']
      },
      gambar: 'images/paket3.jpeg'
    },
    {
      nama: 'Paket 4', harga: 24000,
      pilihan: {
        gorengan1: ['Bakwan'],
        gorengan2: ['Risoles'],
        teh: ['Teh Manis', 'Teh Tawar (2x)']
      },
      gambar: 'images/paket4.jpeg'
    }
  ],
  makanan: [
    { nama: "Tongseng Ayam", harga: 30000, gambar: "images/tongsengayam.png" },
    { nama: "Tongseng Kambing", harga: 30000, gambar: "images/tongsengkambing.png" },
    { nama: "Sate Ayam", harga: 24000, gambar: "images/sateayam.png" },
    { nama: "Sate Kambing", harga: 25000, gambar: "images/satekambing.png" }
  ],
  minuman: [
    { nama: "Teh", harga: 5000, gambar: "images/teh.png" },
    { nama: "Lemon Tea", harga: 8000, gambar: "images/lemontea.png" },
    { nama: "Jeruk", harga: 8000, gambar: "images/jeruk.png" },
    { nama: "Milo", harga: 8000, gambar: "images/milo.png" }
  ],
  tambahan: [
    { nama: "Nasi Putih", harga: 5000, gambar: "images/nasiputih.png" },
    { nama: "Kerupuk", harga: 5000, gambar: "images/kerupuk.png" },
    { nama: "Bakwan", harga: 10000, gambar: "images/bakwan.png" },
    { nama: "Risoles", harga: 10000, gambar: "images/risoles.png" }
  ]
};

let keranjang = [];

function tampilkanKategori(kategori) {
  const daftar = document.getElementById("daftar-menu");
  daftar.innerHTML = "";
  document.getElementById("judul-kategori").textContent = kategori.toUpperCase();

  menuData[kategori].forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <img src="${item.gambar}" alt="${item.nama}" />
      <h3>${item.nama}</h3>
      <p>Rp ${item.harga.toLocaleString()}</p>
      <button onclick="${kategori === 'paket' ? `bukaPilihan('${kategori}', ${index})` : `tambahKeKeranjang('${kategori}', ${index})`}">Tambah</button>
    `;
    daftar.appendChild(div);
  });
}

function bukaPilihan(kategori, index) {
  const item = menuData[kategori][index];
  const modal = document.getElementById("modal-pilihan");
  const content = document.getElementById("konten-modal");

  let html = `<h3>Pilihan untuk ${item.nama}</h3><form id="form-pilihan">`;
  for (let k in item.pilihan) {
    html += `<label>${k}</label><select name="${k}" required>`;
    item.pilihan[k].forEach(opt => {
      html += `<option value="${opt}">${opt}</option>`;
    });
    html += `</select>`;
  }
  html += `<button type="submit">Simpan</button></form>`;
  content.innerHTML = html;
  modal.classList.remove("hidden");

  document.getElementById("form-pilihan").onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const detail = {};
    for (let [k, v] of formData.entries()) detail[k] = v;
    keranjang.push({ ...item, jumlah: 1, detail });
    modal.classList.add("hidden");
    tampilkanKeranjang();
  }

  modal.addEventListener("click", function (e) {
    if (e.target === this) this.classList.add("hidden");
  });
}

function tambahKeKeranjang(kategori, index) {
  const item = menuData[kategori][index];
  keranjang.push({ ...item, jumlah: 1 });
  tampilkanKeranjang();
}

function tampilkanKeranjang() {
  // Cek jika keranjang kosong dan sedang di halaman ringkasan
  const ringkasanAktif = document.getElementById("halaman-ringkasan")?.classList.contains("section") &&
                         !document.getElementById("halaman-ringkasan").classList.contains("hidden");

  if (keranjang.length === 0 && ringkasanAktif) {
    alert("Keranjang kosong. Kembali ke menu utama.");
    kembaliKeHome();
    return;
  }

  const totalSpan = document.getElementById("keranjang-total");
  const isiBox = document.getElementById("isi-keranjang");
  const total = keranjang.reduce((sum, item) => sum + (item.harga * (item.jumlah || 1)), 0);
  totalSpan.textContent = `Total : Rp. ${total.toLocaleString()}`;

  if (!isiBox) return;
  isiBox.innerHTML = '';
  keranjang.forEach((item, i) => {
    let detail = '';
    if (item.detail) {
      for (let k in item.detail) {
        detail += `<br><small>${k}: ${item.detail[k]}</small>`;
      }
    }
    isiBox.innerHTML += `
      <div class="keranjang-item">
        <img src="${item.gambar}" style="width:40px;height:40px;border-radius:6px;margin-right:8px;">
        <span>${item.nama} - Rp ${item.harga.toLocaleString()}${detail}</span>
        ${item.detail ? `<button onclick="editPesanan(${i})">Edit</button>` : ""}
        <button onclick="hapusDariKeranjang(${i})">Hapus</button>
      </div>
    `;
  });
}

function editPesanan(index) {
  const item = keranjang[index];
  if (!item.detail) return alert("Item ini tidak memiliki opsi untuk diedit.");

  const modal = document.getElementById("modal-pilihan");
  const content = document.getElementById("konten-modal");

  let html = `<h3>Edit ${item.nama}</h3><form id="form-edit-pilihan">`;
  for (let k in item.detail) {
    html += `<label>${k}</label><select name="${k}" required>`;
    const opsi = menuData.paket.find(p => p.nama === item.nama)?.pilihan?.[k] || [];
    opsi.forEach(opt => {
      const selected = item.detail[k] === opt ? "selected" : "";
      html += `<option value="${opt}" ${selected}>${opt}</option>`;
    });
    html += `</select>`;
  }
  html += `<button type="submit">Simpan</button></form>`;
  content.innerHTML = html;
  modal.classList.remove("hidden");

  document.getElementById("form-edit-pilihan").onsubmit = function(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (let [k, v] of formData.entries()) {
      item.detail[k] = v;
    }
    modal.classList.add("hidden");
    tampilkanKeranjang();
  }

  modal.addEventListener("click", function (e) {
    if (e.target === this) this.classList.add("hidden");
  });
}

function hapusDariKeranjang(index) {
  keranjang.splice(index, 1);
  tampilkanKeranjang();
}

function tampilkanRingkasan() {
  document.getElementById("ringkasan-pesanan").innerHTML = ""; // kosongkan
  const total = keranjang.reduce((sum, item) => sum + (item.harga * (item.jumlah || 1)), 0);
  document.getElementById("total-harga").textContent = `Total: Rp ${total.toLocaleString()}`;
}

function tampilkanQRCode() {
  if (keranjang.length === 0) {
    alert("Keranjang kosong. Tambahkan pesanan terlebih dahulu.");
    return;
  }

  document.querySelector("main").classList.add("hidden");
  document.querySelector(".keranjang-bar").classList.add("hidden");
  document.getElementById("halaman-ringkasan").classList.add("hidden");
  document.getElementById("halaman-qr").classList.remove("hidden");

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  // Buat isi QR berupa daftar pesanan + total
  let teksQR = "Pesanan:\n";
  keranjang.forEach(item => {
    let line = `- ${item.nama}`;
    if (item.detail) {
      const det = Object.entries(item.detail).map(([k, v]) => `${k}: ${v}`).join(", ");
      line += ` (${det})`;
    }
    teksQR += line + "\n";
  });

  const total = keranjang.reduce((sum, item) => sum + item.harga, 0);
  teksQR += `Total: Rp ${total.toLocaleString()}`;

  new QRCode(qrContainer, {
    text: teksQR,
    width: 250,
    height: 250
  });
}

function kirimStrukViaWA() {
  const nama = document.getElementById("nama-wa").value.trim();
  const wa = document.getElementById("wa-wa").value.trim();
  const catatan = document.getElementById("catatan").value.trim();

  if (!nama) {
    alert("Nama harus diisi untuk mengirim struk.");
    return;
  }

  let teks = `Halo, ini struk pesanan atas nama ${nama}\nPesanan:\n`;
  keranjang.forEach(item => {
    let baris = `- ${item.nama}`;
    if (item.detail) {
      const det = Object.entries(item.detail).map(([k, v]) => `${k}: ${v}`).join(', ');
      baris += ` (${det})`;
    }
    teks += baris + `\n`;
  });

  const total = keranjang.reduce((sum, item) => sum + item.harga, 0);
  teks += `Total: Rp ${total.toLocaleString()}`;
  if (catatan) teks += `\nCatatan: ${catatan}`;

  if (wa) {
    const link = `https://wa.me/62${wa.replace(/^0/, '')}?text=${encodeURIComponent(teks)}`;
    window.open(link, '_blank');
  } else {
    alert("Struk tidak dikirim ke WhatsApp karena nomor tidak diisi.\nBerikut isi struk:\n\n" + teks);
  }

  document.getElementById("modal-struk").classList.add("hidden");
}

function lanjutkanKeRingkasan() {
  document.querySelector("main").classList.add("hidden");
  document.querySelector(".keranjang-bar").classList.add("hidden");
  document.getElementById("halaman-ringkasan").classList.remove("hidden");
  tampilkanRingkasan();
  tampilkanKeranjang();
}

function kembaliKeHome() {
  location.reload();
}

window.addEventListener("DOMContentLoaded", () => {
  tampilkanKategori("paket");
  tampilkanKeranjang();
});
