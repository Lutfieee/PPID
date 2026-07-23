// ============================================
<<<<<<< HEAD
// PPID Kota Tangerang 
=======
// PPID Kota Tangerang - Mock Data
// Data sesuai screenshot referensi
>>>>>>> 31788e1916d360237923f69af9b1ce860bf364f9
// ============================================

const PPID_DATA = {
    // ---- Dashboard Monitoring Permohonan, per periode (bulan-tahun) ----
<<<<<<< HEAD
=======
    // Tambahkan entry baru di sini untuk bulan lain. Key format: 'NamaBulan-Tahun'
>>>>>>> 31788e1916d360237923f69af9b1ce860bf364f9
    dashboardByPeriode: {
        'Mei-2026': {
            bulan: 'Mei',
            tahun: 2026,
            totalPermohonan: 58,
            opdTerbanyak: [
                { nama: 'Disdukcapil', jumlah: 28 },
                { nama: 'PPID', jumlah: 8 },
                { nama: 'BPBD', jumlah: 6 },
                { nama: 'Bappeda', jumlah: 4 },
                { nama: 'DPUPR', jumlah: 3 }
            ],
            statusKeputusan: {
                diberikanSeluruhnya: 49,
                dalamPengerjaan: 9,
                ditolakSebagian: 0
            },
            mediaPengajuan: {
                website: 54,
                email: 4,
                datangLangsung: 0,
                mediaSosial: 0
            },
            kategoriPengajuan: [
                { nama: 'Dokumen Kependudukan', jumlah: 28 },
                { nama: 'Pendidikan', jumlah: 15 },
                { nama: 'Perpajakan', jumlah: 3 },
                { nama: 'Dokumen Kelengkapan', jumlah: 3 },
                { nama: 'Lingkungan', jumlah: 2 },
                { nama: 'Sosial', jumlah: 2 },
                { nama: 'Transportasi', jumlah: 1 },
                { nama: 'Kesehatan', jumlah: 1 },
                { nama: 'Ekonomi', jumlah: 1 },
                { nama: 'Perizinan', jumlah: 1 },
                { nama: 'Sarana Prasarana', jumlah: 1 },
            ]
        },
        'Juni-2026': {
            bulan: 'Juni',
            tahun: 2026,
            totalPermohonan: 37,
            opdTerbanyak: [
                { nama: 'Disdukcapil', jumlah: 17 },
                { nama: 'PPID', jumlah: 10 },
                { nama: 'DLH', jumlah: 4 },
                { nama: 'BPBD', jumlah: 3 },
                { nama: 'DPUPR', jumlah: 3 }
            ],
            statusKeputusan: {
                diberikanSeluruhnya: 25,
                dalamPengerjaan: 12,
                ditolakSebagian: 0
            },
            mediaPengajuan: {
                website: 29,
                email: 7,
                datangLangsung: 1,
                mediaSosial: 0
            },
            kategoriPengajuan: [
                { nama: 'Dokumen Kependudukan', jumlah: 17 },
                { nama: 'Pendidikan', jumlah: 9 },
                { nama: 'Dokumen Kelengkapan', jumlah: 3 },
                { nama: 'Sosial', jumlah: 3 },
                { nama: 'Lingkungan', jumlah: 2 },
                { nama: 'Transportasi', jumlah: 1 },
                { nama: 'Dokumen Resmi', jumlah: 1 },
                { nama: 'Perizinan', jumlah: 1 },
            ]
<<<<<<< HEAD
        },
        'Juli-2026': {
            bulan: 'Juli',
            tahun: 2026,
            totalPermohonan: 37,
            opdTerbanyak: [
                { nama: 'Disdukcapil', jumlah: 17 },
                { nama: 'PPID', jumlah: 10 },
                { nama: 'DLH', jumlah: 4 },
                { nama: 'BPBD', jumlah: 3 },
                { nama: 'DPUPR', jumlah: 3 }
            ],
            statusKeputusan: {
                diberikanSeluruhnya: 25,
                dalamPengerjaan: 12,
                ditolakSebagian: 0
            },
            mediaPengajuan: {
                website: 29,
                email: 7,
                datangLangsung: 1,
                mediaSosial: 0
            },
            kategoriPengajuan: [
                { nama: 'Dokumen Kependudukan', jumlah: 17 },
                { nama: 'Pendidikan', jumlah: 9 },
                { nama: 'Dokumen Kelengkapan', jumlah: 3 },
                { nama: 'Sosial', jumlah: 3 },
                { nama: 'Lingkungan', jumlah: 2 },
                { nama: 'Transportasi', jumlah: 1 },
                { nama: 'Dokumen Resmi', jumlah: 1 },
                { nama: 'Perizinan', jumlah: 1 },
            ]
        }
    },

    // Dataset yang sedang aktif ditampilkan.
    // dashboard.js akan mengganti isi ini secara otomatis mengikuti bulan & tahun berjalan.
=======
        }
    },

    // Dataset yang sedang aktif ditampilkan (default: Juni 2026).
    // dashboard.js akan mengganti isi ini saat filter bulan/tahun berubah.
>>>>>>> 31788e1916d360237923f69af9b1ce860bf364f9
    dashboardMonitoring: null,

    // ---- PPID Pelaksana (Screenshot 3) ----
    ppidPelaksana: {
        totalBantuan: 215,
        perluRespon: 23,
        bantuanDiterima: 160,
        bantuanDitolak: 32,
        distribusiOPD: [
            { nama: 'Dinas Pendidikan', diterima: 45, ditolak: 5, pending: 3 },
            { nama: 'Dinas Kesehatan', diterima: 38, ditolak: 7, pending: 5 },
            { nama: 'DPUPR', diterima: 29, ditolak: 3, pending: 3 },
            { nama: 'Disnaker', diterima: 27, ditolak: 5, pending: 5 },
            { nama: 'Dinas Perdagangan', diterima: 19, ditolak: 5, pending: 1 },
            { nama: 'Dinas Sosial', diterima: 13, ditolak: 2, pending: 13 },
            { nama: 'Dinas Bersama', diterima: 13, ditolak: 3, pending: 1 },
            { nama: 'Dinas Pembinaan', diterima: 6, ditolak: 1, pending: 5 },
            { nama: 'PPID', diterima: 3, ditolak: 1, pending: 1 }
        ],
        ringkasanStatus: {
            diterima: 160,
            ditolak: 32,
            inProgress: 23
        },
        daftarPermohonanBantuan: [
            {
                id: '#BPID001',
                opd: 'Dinas Pendidikan',
                tanggal: '12-07-2026',
                subjek: 'Bantuan Data Anggaran Sekolah',
                status: 'Diterima'
            },
            {
                id: '#BPID002',
                opd: 'Dinas Kesehatan',
                tanggal: '13-07-2026',
                subjek: 'Klarifikasi Data Vaksinasi',
                status: 'Ditolak'
            },
            {
                id: '#BPID003',
                opd: 'DPUPR',
                tanggal: '14-07-2026',
                subjek: 'Data Proyek Infrastruktur',
                status: 'Diterima'
            },
            {
                id: '#BPID004',
                opd: 'Disnaker',
                tanggal: '14-07-2026',
                subjek: 'Laporan Tenaga Kerja',
                status: 'In Progress'
            },
            {
                id: '#BPID005',
                opd: 'Dinas Sosial',
                tanggal: '15-07-2026',
                subjek: 'Data Bantuan Sosial',
                status: 'Diterima'
            }
        ]
    },

    // ---- Monitoring Antrian Registrasi (Screenshot 1) ----
    antrianRegistrasi: {
        summary: {
            totalAntrian: 130,
            belumDiputuskan: 10,
            selesai: 87,
            menungguPerbaikan: 3
        },
        data: [
            {
                noRegister: '20260713/PPID/070723122/2280',
                tanggalMasuk: '07 Juli 2026',
                nama: 'IWAN HARI RUSAWAN',
                kategori: 'PERORANGAN',
                sla: 'Sisa 4 Hari',
                slaType: 'warning',
                status: 'Belum Diputuskan',
                statusType: 'pending'
            },
            {
                noRegister: '20260710/PPID/17071941/1072',
                tanggalMasuk: '10 Jul 2026',
                nama: 'LILY YULIANTI',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Diterima',
                statusType: 'success'
            },
            {
                noRegister: '20260710/PPID/17071850/1472',
                tanggalMasuk: '10 Jul 2026',
                nama: 'LILY YULIANTI',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Diterima',
                statusType: 'success'
            },
            {
                noRegister: '20260709/PPID/16070252/5304',
                tanggalMasuk: '09 Jul 2026',
                nama: 'DESSY SETYANINGRUM',
                kategori: 'PERORANGAN',
                sla: 'Perbaikan',
                slaType: 'repair',
                status: 'Perbaikan',
                statusType: 'repair'
            },
            {
                noRegister: '20260703/PPID/22075504/8065',
                tanggalMasuk: '03 Jul 2026',
                nama: 'SUPRIADI ARI',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Ditolak',
                statusType: 'danger'
            },
            {
                noRegister: '20260703/PPID/09070205/1563',
                tanggalMasuk: '03 Jul 2026',
                nama: 'IWAN HARI RUSAWAN',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Diterima',
                statusType: 'success'
            },
            {
                noRegister: '20260701/PPID/01070198/4421',
                tanggalMasuk: '01 Jul 2026',
                nama: 'AHMAD FAUZI',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Diterima',
                statusType: 'success'
            },
            {
                noRegister: '20260630/PPID/30060872/3310',
                tanggalMasuk: '30 Jun 2026',
                nama: 'SITI NURHALIZA',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Diterima',
                statusType: 'success'
            },
            {
                noRegister: '20260628/PPID/28060543/2201',
                tanggalMasuk: '28 Jun 2026',
                nama: 'BUDI SANTOSO',
                kategori: 'BADAN HUKUM',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Ditolak',
                statusType: 'danger'
            },
            {
                noRegister: '20260625/PPID/25060312/1190',
                tanggalMasuk: '25 Jun 2026',
                nama: 'RINA WATI',
                kategori: 'PERORANGAN',
                sla: 'Sisa 2 Hari',
                slaType: 'warning',
                status: 'Belum Diputuskan',
                statusType: 'pending'
            },
            {
                noRegister: '20260620/PPID/20060221/8870',
                tanggalMasuk: '20 Jun 2026',
                nama: 'DEDI KURNIAWAN',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Diterima',
                statusType: 'success'
            },
            {
                noRegister: '20260618/PPID/18060110/7760',
                tanggalMasuk: '18 Jun 2026',
                nama: 'FITRI HANDAYANI',
                kategori: 'BADAN HUKUM',
                sla: 'Perbaikan',
                slaType: 'repair',
                status: 'Perbaikan',
                statusType: 'repair'
            },
            {
                noRegister: '20260615/PPID/15060098/6650',
                tanggalMasuk: '15 Jun 2026',
                nama: 'HENDRA WIJAYA',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Diterima',
                statusType: 'success'
            },
            {
                noRegister: '20260612/PPID/12060087/5540',
                tanggalMasuk: '12 Jun 2026',
                nama: 'MAYA SARI',
                kategori: 'PERORANGAN',
                sla: 'Selesai',
                slaType: 'done',
                status: 'Ditolak',
                statusType: 'danger'
            }
        ]
    },

    // ---- Permohonan Data ----
    permohonan: [
        {
            id: 'PRM-001',
            noRegister: '20260713/PPID/070723122/2280',
            pemohon: 'IWAN HARI RUSAWAN',
            nik: '3671012345670001',
            email: 'iwan.rusawan@email.com',
            telepon: '081234567890',
            kategori: 'PERORANGAN',
            informasi: 'Data Kependudukan Kecamatan Tangerang',
            tujuan: 'Keperluan Penelitian',
            tanggalMasuk: '07 Juli 2026',
            status: 'Belum Diputuskan',
            opd: 'Disdukcapil'
        },
        {
            id: 'PRM-002',
            noRegister: '20260710/PPID/17071941/1072',
            pemohon: 'LILY YULIANTI',
            nik: '3671012345670002',
            email: 'lily.yulianti@email.com',
            telepon: '081234567891',
            kategori: 'PERORANGAN',
            informasi: 'Data Statistik Pendidikan',
            tujuan: 'Keperluan Jurnalistik',
            tanggalMasuk: '10 Jul 2026',
            status: 'Diterima',
            opd: 'Dinas Pendidikan'
        },
        {
            id: 'PRM-003',
            noRegister: '20260710/PPID/17071850/1472',
            pemohon: 'LILY YULIANTI',
            nik: '3671012345670002',
            email: 'lily.yulianti@email.com',
            telepon: '081234567891',
            kategori: 'PERORANGAN',
            informasi: 'Data Anggaran Pendidikan 2026',
            tujuan: 'Keperluan Jurnalistik',
            tanggalMasuk: '10 Jul 2026',
            status: 'Diterima',
            opd: 'Dinas Pendidikan'
        }
    ],

    // ---- Keberatan Data ----
    keberatan: [
        {
            id: 'KBR-001',
            pemohon: 'BUDI SANTOSO',
            tanggal: '15 Jul 2026',
            alasan: 'Informasi tidak diberikan sesuai permintaan',
            status: 'Dalam Proses',
            noPermohonan: 'PRM-009'
        },
        {
            id: 'KBR-002',
            pemohon: 'RINA WATI',
            tanggal: '12 Jul 2026',
            alasan: 'Waktu penyelesaian melebihi batas SLA',
            status: 'Selesai',
            noPermohonan: 'PRM-010'
        }
    ],

    // ---- Dokumen Informasi ----
    dokumenInformasi: [
        {
            id: 'DOK-001',
            judul: 'Laporan Keuangan Semester 1 Tahun 2026',
            kategori: 'Informasi Berkala',
            tanggalUpload: '01 Jul 2026',
            ukuran: '2.5 MB',
            tipe: 'PDF'
        },
        {
            id: 'DOK-002',
            judul: 'Rencana Kerja Pemerintah Daerah 2026',
            kategori: 'Informasi Serta Merta',
            tanggalUpload: '15 Jun 2026',
            ukuran: '4.1 MB',
            tipe: 'PDF'
        },
        {
            id: 'DOK-003',
            judul: 'Daftar Informasi Publik Kota Tangerang',
            kategori: 'Informasi Setiap Saat',
            tanggalUpload: '01 Jun 2026',
            ukuran: '1.8 MB',
            tipe: 'PDF'
        },
        {
            id: 'DOK-004',
            judul: 'SK Penetapan PPID Kota Tangerang',
            kategori: 'Informasi Setiap Saat',
            tanggalUpload: '15 Mei 2026',
            ukuran: '800 KB',
            tipe: 'PDF'
        }
    ],

    // ---- Daftar Pembantu ----
    daftarPembantu: [
        { id: 1, nama: 'Disdukcapil', kepala: 'Drs. Ahmad Hidayat, M.Si', telepon: '021-55791234', email: 'disdukcapil@tangerangkota.go.id' },
        { id: 2, nama: 'Dinas Pendidikan', kepala: 'Dr. Siti Aminah, M.Pd', telepon: '021-55791235', email: 'disdik@tangerangkota.go.id' },
        { id: 3, nama: 'Dinas Kesehatan', kepala: 'dr. Bambang Suryadi, Sp.PD', telepon: '021-55791236', email: 'dinkes@tangerangkota.go.id' },
        { id: 4, nama: 'DPUPR', kepala: 'Ir. Hendra Kusuma, MT', telepon: '021-55791237', email: 'dpupr@tangerangkota.go.id' },
        { id: 5, nama: 'DLH', kepala: 'Ir. Eko Prasetyo, M.Env', telepon: '021-55791238', email: 'dlh@tangerangkota.go.id' },
        { id: 6, nama: 'BPBD', kepala: 'Kol. (Purn) Agus Setiawan', telepon: '021-55791239', email: 'bpbd@tangerangkota.go.id' },
        { id: 7, nama: 'Disnaker', kepala: 'Dra. Ratna Dewi, MM', telepon: '021-55791240', email: 'disnaker@tangerangkota.go.id' },
        { id: 8, nama: 'Dinas Perdagangan', kepala: 'H. Mulyadi, SE, MM', telepon: '021-55791241', email: 'disdag@tangerangkota.go.id' }
    ],

    // ---- Dasar Hukum ----
    dasarHukum: [
        { id: 1, nomor: 'UU No. 14 Tahun 2008', judul: 'Keterbukaan Informasi Publik', kategori: 'Undang-Undang' },
        { id: 2, nomor: 'PP No. 61 Tahun 2010', judul: 'Pelaksanaan UU No. 14 Tahun 2008', kategori: 'Peraturan Pemerintah' },
        { id: 3, nomor: 'Perki No. 1 Tahun 2010', judul: 'Standar Layanan Informasi Publik', kategori: 'Peraturan Komisi Informasi' },
        { id: 4, nomor: 'Perwal No. 35 Tahun 2020', judul: 'Pengelolaan dan Pelayanan Informasi Publik', kategori: 'Peraturan Walikota' },
        { id: 5, nomor: 'SK Walikota No. 480/2024', judul: 'Penetapan PPID Kota Tangerang', kategori: 'Surat Keputusan' }
    ],

    // ---- Admin Profile ----
    adminProfile: {
        nama: 'Administrator PPID',
        nip: '198501012010011001',
        jabatan: 'Admin PPID Utama',
        email: 'admin@ppid.tangerangkota.go.id',
        telepon: '021-55791234',
        foto: null
    }
};

<<<<<<< HEAD
=======
// Set dataset aktif default (bulan yang tampil pertama kali saat halaman dibuka)
PPID_DATA.dashboardMonitoring = PPID_DATA.dashboardByPeriode['Juni-2026'];

>>>>>>> 31788e1916d360237923f69af9b1ce860bf364f9
// Bulan options
const BULAN_LIST = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const TAHUN_LIST = [2024, 2025, 2026];
<<<<<<< HEAD

// ---- Set dataset aktif default: otomatis ikut bulan & tahun berjalan ----
// Kalau data bulan berjalan belum tersedia, fallback ke periode terbaru yang ada.
(function setDefaultPeriode() {
    const now = new Date();
    const key = `${BULAN_LIST[now.getMonth()]}-${now.getFullYear()}`;

    if (PPID_DATA.dashboardByPeriode[key]) {
        PPID_DATA.dashboardMonitoring = PPID_DATA.dashboardByPeriode[key];
    } else {
        const keys = Object.keys(PPID_DATA.dashboardByPeriode);
        PPID_DATA.dashboardMonitoring = PPID_DATA.dashboardByPeriode[keys[keys.length - 1]];
    }
})();
=======
>>>>>>> 31788e1916d360237923f69af9b1ce860bf364f9
