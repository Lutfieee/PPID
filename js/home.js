// ============================================
// PPID Kota Tangerang - Home Overview Page
// Ringkasan semua modul (Permohonan, Antrian, Keberatan, Dokumen, Pelaksana)
// ============================================

function initHomeOverview() {
    // Sapaan nama admin
    const nameEl = document.getElementById('welcomeName');
    if (nameEl) nameEl.textContent = PPID_DATA.adminProfile?.nama || 'Admin PPID';

    // Tanggal
    const dateEl = document.getElementById('homeDate');
    if (dateEl) {
        const now = new Date();
        const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    // ---- Total Permohonan bulan ini (ambil dari dataset dashboard aktif) ----
    const dash = PPID_DATA.dashboardMonitoring;
    setText('homePermohonanLabel', `TOTAL PERMOHONAN ${dash.bulan.toUpperCase()} ${dash.tahun}`);
    setText('homeTotalPermohonan', dash.totalPermohonan);

    // ---- Antrian Registrasi ----
    const antrian = PPID_DATA.antrianRegistrasi.summary;
    setText('homeAntrianPending', antrian.belumDiputuskan);
    setText('homeAntrianTotal', antrian.totalAntrian);
    setText('homeAntrianSelesai', antrian.selesai);
    setText('homeAntrianBelum', antrian.belumDiputuskan);
    setText('homeAntrianPerbaikan', antrian.menungguPerbaikan);

    // ---- Keberatan ----
    const keberatanDalamProses = PPID_DATA.keberatan.filter(k => k.status === 'Dalam Proses').length;
    setText('homeKeberatan', keberatanDalamProses);

    // ---- Dokumen Informasi ----
    setText('homeDokumen', PPID_DATA.dokumenInformasi.length);

    // ---- PPID Pelaksana ----
    const pel = PPID_DATA.ppidPelaksana;
    setText('homePelTotal', pel.totalBantuan);
    setText('homePelDiterima', pel.bantuanDiterima);
    setText('homePelDitolak', pel.bantuanDitolak);
    setText('homePelRespon', pel.perluRespon);
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

// ---- Klik kartu ringkasan & menu cepat untuk pindah halaman ----
document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-nav]');
    if (target && typeof window.navigateTo === 'function') {
        window.navigateTo(target.getAttribute('data-nav'));
    }
});
