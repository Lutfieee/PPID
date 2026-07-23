// ============================================
// PPID Kota Tangerang - Dashboard Monitoring
// Charts: OPD Bar, Status Donut, Media Pie, Kategori Bar
// ============================================

let chartOPD = null;
let chartStatusKeputusan = null;
let chartMedia = null;
let chartKategori = null;
let dashboardInitialized = false;

function initDashboard() {
    const data = PPID_DATA.dashboardMonitoring;

    // Update texts
    document.getElementById('totalPermohonan').textContent = data.totalPermohonan;
    document.getElementById('totalPermohonanLabel').textContent = `Total Permohonan Masuk ${data.bulan} ${data.tahun}`;
    document.getElementById('dashboardTitle').textContent = `DASHBOARD MONITORING PERMOHONAN ${data.bulan.toUpperCase()} ${data.tahun}`;
    document.getElementById('opdChartTitle').textContent = `5 OPD Termohon Terbanyak ${data.bulan} ${data.tahun}`;
    document.getElementById('statusChartTitle').textContent = `Status Keputusan PPID ${data.bulan} ${data.tahun}`;
    document.getElementById('mediaChartTitle').textContent = `Berdasarkan Media Pengajuan ${data.bulan} ${data.tahun}`;
    document.getElementById('kategoriChartTitle').textContent = `Kategori Pengajuan ${data.bulan} ${data.tahun}`;

    // Animate total number
    animateCounter(document.getElementById('totalPermohonan'), data.totalPermohonan);

    // Destroy existing charts
    if (chartOPD) chartOPD.destroy();
    if (chartStatusKeputusan) chartStatusKeputusan.destroy();
    if (chartMedia) chartMedia.destroy();
    if (chartKategori) chartKategori.destroy();

    renderOPDChart(data);
    renderStatusKeputusanChart(data);
    renderMediaChart(data);
    renderKategoriChart(data);

    dashboardInitialized = true;
}

// ---- OPD Horizontal Bar Chart ----
function renderOPDChart(data) {
    const ctx = document.getElementById('chartOPD').getContext('2d');
    const opd = data.opdTerbanyak;

    chartOPD = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: opd.map(o => o.nama),
            datasets: [{
                data: opd.map(o => o.jumlah),
                backgroundColor: [
                    '#2563eb', '#2563eb', '#2563eb', '#2563eb', '#2563eb'
                ],
                borderRadius: 3,
                barThickness: 22
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a2e',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    padding: 10,
                    cornerRadius: 6
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Inter', size: 11 }
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Inter', size: 11 }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        },
        plugins: [{
            afterDatasetsDraw(chart) {
                const { ctx: c, data: d } = chart;
                chart.getDatasetMeta(0).data.forEach((bar, i) => {
                    const val = d.datasets[0].data[i];
                    c.save();
                    c.fillStyle = '#333';
                    c.font = 'bold 11px Inter';
                    c.textAlign = 'left';
                    c.textBaseline = 'middle';
                    c.fillText(`(${val})`, bar.x + 6, bar.y);
                    c.restore();
                });
            }
        }]
    });
}

// ---- Status Keputusan Donut Chart ----
function renderStatusKeputusanChart(data) {
    const ctx = document.getElementById('chartStatusKeputusan').getContext('2d');
    const s = data.statusKeputusan;
    const total = s.diberikanSeluruhnya + s.dalamPengerjaan + s.ditolakSebagian;

    chartStatusKeputusan = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                `Diberikan Seluruhnya (${s.diberikanSeluruhnya})`,
                `Dalam Pengerjaan (${s.dalamPengerjaan})`,
                `Ditolak/Sebagian (${s.ditolakSebagian})`
            ],
            datasets: [{
                data: [s.diberikanSeluruhnya, s.dalamPengerjaan, s.ditolakSebagian || 0.1],
                backgroundColor: ['#166534', '#eab308', '#9ca3af'],
                borderWidth: 2,
                borderColor: '#ffffff',
                cutout: '55%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: 'Inter', size: 10 },
                        padding: 12,
                        usePointStyle: true,
                        pointStyleWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: '#1a1a2e',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    padding: 10,
                    cornerRadius: 6,
                    callbacks: {
                        label: function(context) {
                            const val = context.raw;
                            const pct = total > 0 ? ((val / total) * 100).toFixed(0) : 0;
                            return ` ${val} (${pct}%)`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                duration: 1200
            }
        },
        plugins: [{
            afterDraw(chart) {
                const { ctx: c, chartArea } = chart;
                const dataset = chart.data.datasets[0];
                const meta = chart.getDatasetMeta(0);

                meta.data.forEach((arc, i) => {
                    if (dataset.data[i] === 0 || dataset.data[i] === 0.1) return;
                    const pct = ((dataset.data[i] / total) * 100).toFixed(0);
                    const midAngle = (arc.startAngle + arc.endAngle) / 2;
                    const radius = (arc.innerRadius + arc.outerRadius) / 2;
                    const x = arc.x + Math.cos(midAngle) * radius;
                    const y = arc.y + Math.sin(midAngle) * radius;

                    c.save();
                    c.fillStyle = '#fff';
                    c.font = 'bold 11px Inter';
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillText(`${pct}%`, x, y);
                    c.restore();
                });
            }
        }]
    });
}

// ---- Media Pengajuan Pie Chart ----
function renderMediaChart(data) {
    const ctx = document.getElementById('chartMedia').getContext('2d');
    const m = data.mediaPengajuan;

    chartMedia = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: [
                `Website (${m.website})`,
                `Email (${m.email})`,
                `Datang Langsung (${m.datangLangsung})`,
                `Media Sosial (${m.mediaSosial})`
            ],
            datasets: [{
                data: [m.website, m.email, m.datangLangsung || 0.1, m.mediaSosial || 0.1],
                backgroundColor: ['#2563eb', '#eab308', '#f97316', '#22c55e'],
                borderWidth: 2,
                borderColor: '#ffffff',
                cutout: '50%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: 'Inter', size: 10 },
                        padding: 12,
                        usePointStyle: true,
                        pointStyleWidth: 10
                    }
                },
                tooltip: {
                    backgroundColor: '#1a1a2e',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    padding: 10,
                    cornerRadius: 6
                }
            },
            animation: {
                animateRotate: true,
                duration: 1200
            }
        },
        plugins: [{
            afterDraw(chart) {
                const { ctx: c } = chart;
                const dataset = chart.data.datasets[0];
                const meta = chart.getDatasetMeta(0);
                const total = m.website + m.email + m.datangLangsung + m.mediaSosial;

                meta.data.forEach((arc, i) => {
                    const realVal = [m.website, m.email, m.datangLangsung, m.mediaSosial][i];
                    if (realVal === 0) return;
                    const midAngle = (arc.startAngle + arc.endAngle) / 2;
                    const radius = (arc.innerRadius + arc.outerRadius) / 2;
                    const x = arc.x + Math.cos(midAngle) * radius;
                    const y = arc.y + Math.sin(midAngle) * radius;

                    c.save();
                    c.fillStyle = '#fff';
                    c.font = 'bold 11px Inter';
                    c.textAlign = 'center';
                    c.textBaseline = 'middle';
                    c.fillText(realVal, x, y);
                    c.restore();
                });
            }
        }]
    });
}

// ---- Kategori Pengajuan Bar Chart ----
function renderKategoriChart(data) {
    const ctx = document.getElementById('chartKategori').getContext('2d');
    const kat = data.kategoriPengajuan;

    chartKategori = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: kat.map(k => k.nama),
            datasets: [{
                data: kat.map(k => k.jumlah),
                backgroundColor: ['#2563eb', '#22c55e', '#f97316', '#8b5cf6', '#06b6d4'],
                borderRadius: 4,
                barThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1a1a2e',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    padding: 10,
                    cornerRadius: 6
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Inter', size: 10 },
                        maxRotation: 0,
                        autoSkip: false
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: { color: '#f0f0f0' },
                    ticks: {
                        font: { family: 'Inter', size: 11 },
                        stepSize: 5
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart'
            }
        },
        plugins: [{
            afterDatasetsDraw(chart) {
                const { ctx: c, data: d } = chart;
                chart.getDatasetMeta(0).data.forEach((bar, i) => {
                    const val = d.datasets[0].data[i];
                    c.save();
                    c.fillStyle = '#333';
                    c.font = 'bold 12px Inter';
                    c.textAlign = 'center';
                    c.textBaseline = 'bottom';
                    c.fillText(val, bar.x, bar.y - 4);
                    c.restore();
                });
            }
        }]
    });
}

// ---- Counter Animation ----
function animateCounter(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 30);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, 30);
}

// ---- Ganti dataset aktif sesuai bulan & tahun yang dipilih ----
function switchPeriode(bulan, tahun) {
    const key = `${bulan}-${tahun}`;
    const data = PPID_DATA.dashboardByPeriode[key];

    if (data) {
        PPID_DATA.dashboardMonitoring = data;
        initDashboard();
    } else {
        // Belum ada data untuk periode ini
        PPID_DATA.dashboardMonitoring = {
            bulan, tahun,
            totalPermohonan: 0,
            opdTerbanyak: [],
            statusKeputusan: { diberikanSeluruhnya: 0, dalamPengerjaan: 0, ditolakSebagian: 0 },
            mediaPengajuan: { website: 0, email: 0, datangLangsung: 0, mediaSosial: 0 },
            kategoriPengajuan: []
        };
        initDashboard();
        console.warn(`Belum ada data untuk periode ${bulan} ${tahun}.`);
    }
}

// ---- Filter change handlers ----
document.getElementById('filterBulan').addEventListener('change', function() {
    const tahun = document.getElementById('filterTahun').value;
    switchPeriode(this.value, parseInt(tahun));
});

document.getElementById('filterTahun').addEventListener('change', function() {
    const bulan = document.getElementById('filterBulan').value;
    switchPeriode(bulan, parseInt(this.value));
});

// ---- Set nilai dropdown filter mengikuti bulan & tahun berjalan saat halaman dimuat ----
(function setDefaultFilterUI() {
    const now = new Date();
    const bulanSekarang = BULAN_LIST[now.getMonth()];
    const tahunSekarang = String(now.getFullYear());
    const selBulan = document.getElementById('filterBulan');
    const selTahun = document.getElementById('filterTahun');

    // Hanya set kalau opsinya memang tersedia di dropdown, kalau tidak biarkan default HTML
    if (selBulan && [...selBulan.options].some(o => o.value === bulanSekarang)) {
        selBulan.value = bulanSekarang;
    }
    if (selTahun && [...selTahun.options].some(o => o.value === tahunSekarang)) {
        selTahun.value = tahunSekarang;
    }
})();
