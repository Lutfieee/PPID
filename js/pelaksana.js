// ============================================
// PPID Kota Tangerang - PPID Pelaksana Dashboard
// Charts: Distribusi OPD Stacked Bar, Ringkasan Status Donut
// Table: Daftar Permohonan Bantuan
// ============================================

let chartDistribusiOPD = null;
let chartRingkasanStatus = null;
let pelaksanaInitialized = false;

function initPelaksana() {
    const data = PPID_DATA.ppidPelaksana;

    // Update summary cards
    document.getElementById('pelTotalBantuan').textContent = data.totalBantuan;
    document.getElementById('pelPerluRespon').textContent = data.perluRespon;
    document.getElementById('pelDiterima').textContent = data.bantuanDiterima;
    document.getElementById('pelDitolak').textContent = data.bantuanDitolak;

    // Animate counters
    animateCounter2(document.getElementById('pelTotalBantuan'), data.totalBantuan);
    animateCounter2(document.getElementById('pelPerluRespon'), data.perluRespon);
    animateCounter2(document.getElementById('pelDiterima'), data.bantuanDiterima);
    animateCounter2(document.getElementById('pelDitolak'), data.bantuanDitolak);

    // Destroy existing charts
    if (chartDistribusiOPD) chartDistribusiOPD.destroy();
    if (chartRingkasanStatus) chartRingkasanStatus.destroy();

    renderDistribusiOPDChart(data);
    renderRingkasanStatusChart(data);
    renderPelaksanaTable(data);

    pelaksanaInitialized = true;
}

// ---- Distribusi OPD Stacked Bar Chart ----
function renderDistribusiOPDChart(data) {
    const ctx = document.getElementById('chartDistribusiOPD').getContext('2d');
    const opd = data.distribusiOPD;

    chartDistribusiOPD = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: opd.map(o => o.nama),
            datasets: [
                {
                    label: 'Diterima',
                    data: opd.map(o => o.diterima),
                    backgroundColor: '#16a34a',
                    borderRadius: { topLeft: 0, topRight: 0 },
                    barThickness: 32
                },
                {
                    label: 'Ditolak',
                    data: opd.map(o => o.ditolak),
                    backgroundColor: '#dc2626',
                    barThickness: 32
                },
                {
                    label: 'Pending',
                    data: opd.map(o => o.pending),
                    backgroundColor: '#eab308',
                    borderRadius: { topLeft: 3, topRight: 3 },
                    barThickness: 32
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        font: { family: 'Inter', size: 11 },
                        usePointStyle: true,
                        pointStyleWidth: 10,
                        padding: 16
                    }
                },
                tooltip: {
                    backgroundColor: '#1a1a2e',
                    titleFont: { family: 'Inter' },
                    bodyFont: { family: 'Inter' },
                    padding: 10,
                    cornerRadius: 6,
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: { display: false },
                    ticks: {
                        font: { family: 'Inter', size: 9 },
                        maxRotation: 45,
                        minRotation: 30
                    }
                },
                y: {
                    stacked: true,
                    beginAtZero: true,
                    grid: { color: '#f0f0f0' },
                    ticks: {
                        font: { family: 'Inter', size: 11 },
                        stepSize: 10
                    }
                }
            },
            animation: {
                duration: 1200,
                easing: 'easeOutQuart'
            }
        },
        plugins: [{
            afterDatasetsDraw(chart) {
                const { ctx: c } = chart;
                // Draw totals on top of stacked bars
                const meta0 = chart.getDatasetMeta(0);
                const meta1 = chart.getDatasetMeta(1);
                const meta2 = chart.getDatasetMeta(2);

                const ds = chart.data.datasets;
                for (let i = 0; i < ds[0].data.length; i++) {
                    // Draw individual segment values
                    [meta0, meta1, meta2].forEach((meta, di) => {
                        const bar = meta.data[i];
                        const val = ds[di].data[i];
                        if (val > 0 && (bar.height || bar.base - bar.y) > 14) {
                            c.save();
                            c.fillStyle = '#fff';
                            c.font = 'bold 9px Inter';
                            c.textAlign = 'center';
                            c.textBaseline = 'middle';
                            const y = (bar.y + bar.base) / 2;
                            c.fillText(val, bar.x, y);
                            c.restore();
                        }
                    });
                }
            }
        }]
    });
}

// ---- Ringkasan Status Donut Chart ----
function renderRingkasanStatusChart(data) {
    const ctx = document.getElementById('chartRingkasanStatus').getContext('2d');
    const r = data.ringkasanStatus;
    const total = r.diterima + r.ditolak + r.inProgress;

    chartRingkasanStatus = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Diterima', 'Ditolak', 'In Progress'],
            datasets: [{
                data: [r.diterima, r.ditolak, r.inProgress],
                backgroundColor: ['#16a34a', '#dc2626', '#eab308'],
                borderWidth: 2,
                borderColor: '#ffffff',
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        font: { family: 'Inter', size: 11 },
                        padding: 14,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                        generateLabels: function(chart) {
                            const ds = chart.data.datasets[0];
                            return chart.data.labels.map((label, i) => {
                                const val = ds.data[i];
                                const pct = ((val / total) * 100).toFixed(0);
                                return {
                                    text: `${label} (${val}, ${pct}%)`,
                                    fillStyle: ds.backgroundColor[i],
                                    strokeStyle: ds.backgroundColor[i],
                                    lineWidth: 0,
                                    pointStyle: 'rectRounded',
                                    index: i
                                };
                            });
                        }
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
                            const pct = ((val / total) * 100).toFixed(0);
                            return ` ${context.label}: ${val} (${pct}%)`;
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
                const { ctx: c } = chart;
                const ds = chart.data.datasets[0];
                const meta = chart.getDatasetMeta(0);

                meta.data.forEach((arc, i) => {
                    const val = ds.data[i];
                    const pct = ((val / total) * 100).toFixed(0);
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

                // Center text
                const centerX = meta.data[0].x;
                const centerY = meta.data[0].y;
                c.save();
                c.fillStyle = '#333';
                c.font = 'bold 24px Inter';
                c.textAlign = 'center';
                c.textBaseline = 'middle';
                c.fillText(total, centerX, centerY - 6);
                c.font = '11px Inter';
                c.fillStyle = '#999';
                c.fillText('Total', centerX, centerY + 14);
                c.restore();
            }
        }]
    });
}

// ---- Pelaksana Table (CRUD) ----
function renderPelaksanaTable(data) {
    const tbody = document.getElementById('pelaksanaTableBody');
    if (!tbody) return;

    tbody.innerHTML = data.daftarPermohonanBantuan.map((item, idx) => {
        const statusClass = getStatusBadgeClass(item.status);
        return `<tr>
            <td><strong>${item.id}</strong></td>
            <td>${item.opd}</td>
            <td>${item.tanggal}</td>
            <td>${item.subjek}</td>
            <td><span class="badge ${statusClass}">${item.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn btn-view" onclick="showPelaksanaDetail('${item.id}')" title="Detail"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="editPelaksanaBantuan('${item.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn btn-delete" onclick="deletePelaksanaBantuan('${item.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');
}

// READ
window.showPelaksanaDetail = function(id) {
    const item = PPID_DATA.ppidPelaksana.daftarPermohonanBantuan.find(b=>b.id===id);
    if (!item) return;
    const sc = getStatusBadgeClass(item.status);
    const html = `
        <div class="detail-item"><span class="detail-label">ID Permohonan</span><span class="detail-value">${item.id}</span></div>
        <div class="detail-item"><span class="detail-label">Asal OPD</span><span class="detail-value">${item.opd}</span></div>
        <div class="detail-item"><span class="detail-label">Tanggal Masuk</span><span class="detail-value">${item.tanggal}</span></div>
        <div class="detail-item"><span class="detail-label">Subjek</span><span class="detail-value">${item.subjek}</span></div>
        <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ${sc}">${item.status}</span></span></div>`;
    let footer = '<button class="btn btn-secondary" onclick="closeModal()">Tutup</button>';
    if (item.status === 'Ditolak') {
        footer += ' <button class="btn btn-danger" onclick="closeModal();showAlasanModal()"><i class="fas fa-info-circle"></i> Lihat Alasan</button>';
    }
    showModal('Detail Permohonan Bantuan', html, footer);
};

// CREATE
window.addPelaksanaBantuan = function() {
    const opdList = PPID_DATA.ppidPelaksana.distribusiOPD.map(o=>o.nama);
    const html = `
        <div class="form-group" style="margin-bottom:12px"><label class="form-label">Asal PPID Pelaksana (OPD)</label>
            <select class="filter-select" id="fldPelOpd" style="width:100%">${opdList.map(o=>`<option value="${o}">${o}</option>`).join('')}</select></div>
        <div class="form-group" style="margin-bottom:12px"><label class="form-label">Subjek Bantuan</label><input type="text" class="form-input" id="fldPelSubjek" value=""></div>
        <div class="form-group" style="margin-bottom:12px"><label class="form-label">Status</label>
            <select class="filter-select" id="fldPelStatus" style="width:100%">
                <option value="In Progress">In Progress</option><option value="Diterima">Diterima</option><option value="Ditolak">Ditolak</option>
            </select></div>`;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
        <button class="btn btn-primary" onclick="savePelaksanaBantuan('')"><i class="fas fa-save"></i> Simpan</button>`;
    showModal('Tambah Permohonan Bantuan', html, footer);
};

// UPDATE
window.editPelaksanaBantuan = function(id) {
    const item = PPID_DATA.ppidPelaksana.daftarPermohonanBantuan.find(b=>b.id===id);
    if (!item) return;
    const opdList = PPID_DATA.ppidPelaksana.distribusiOPD.map(o=>o.nama);
    const html = `
        <div class="form-group" style="margin-bottom:12px"><label class="form-label">Asal PPID Pelaksana (OPD)</label>
            <select class="filter-select" id="fldPelOpd" style="width:100%">${opdList.map(o=>`<option value="${o}" ${item.opd===o?'selected':''}>${o}</option>`).join('')}</select></div>
        <div class="form-group" style="margin-bottom:12px"><label class="form-label">Subjek Bantuan</label><input type="text" class="form-input" id="fldPelSubjek" value="${item.subjek}"></div>
        <div class="form-group" style="margin-bottom:12px"><label class="form-label">Status</label>
            <select class="filter-select" id="fldPelStatus" style="width:100%">
                <option value="In Progress" ${item.status==='In Progress'?'selected':''}>In Progress</option>
                <option value="Diterima" ${item.status==='Diterima'?'selected':''}>Diterima</option>
                <option value="Ditolak" ${item.status==='Ditolak'?'selected':''}>Ditolak</option>
            </select></div>`;
    const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
        <button class="btn btn-primary" onclick="savePelaksanaBantuan('${id}')"><i class="fas fa-save"></i> Update</button>`;
    showModal('Edit Permohonan Bantuan', html, footer);
};

window.savePelaksanaBantuan = function(editId) {
    const opd = document.getElementById('fldPelOpd').value;
    const subjek = document.getElementById('fldPelSubjek').value;
    const status = document.getElementById('fldPelStatus').value;
    if (!subjek) { showToast('Harap isi subjek bantuan!','danger'); return; }

    if (editId) {
        const item = PPID_DATA.ppidPelaksana.daftarPermohonanBantuan.find(b=>b.id===editId);
        if (item) {
            // Subtract old
            if (item.status==='Diterima') PPID_DATA.ppidPelaksana.bantuanDiterima--;
            else if (item.status==='Ditolak') PPID_DATA.ppidPelaksana.bantuanDitolak--;
            else PPID_DATA.ppidPelaksana.perluRespon--;
            
            let oldOpdObj = PPID_DATA.ppidPelaksana.distribusiOPD.find(o => o.nama === item.opd);
            if (oldOpdObj) {
                if (item.status==='Diterima') oldOpdObj.diterima--;
                else if (item.status==='Ditolak') oldOpdObj.ditolak--;
                else oldOpdObj.pending--;
            }

            item.opd=opd; item.subjek=subjek; item.status=status; 
            
            // Add new
            if (item.status==='Diterima') PPID_DATA.ppidPelaksana.bantuanDiterima++;
            else if (item.status==='Ditolak') PPID_DATA.ppidPelaksana.bantuanDitolak++;
            else PPID_DATA.ppidPelaksana.perluRespon++;
            
            let newOpdObj = PPID_DATA.ppidPelaksana.distribusiOPD.find(o => o.nama === item.opd);
            if (!newOpdObj) { newOpdObj = { nama: item.opd, diterima: 0, ditolak: 0, pending: 0 }; PPID_DATA.ppidPelaksana.distribusiOPD.push(newOpdObj); }
            if (item.status==='Diterima') newOpdObj.diterima++;
            else if (item.status==='Ditolak') newOpdObj.ditolak++;
            else newOpdObj.pending++;

            showToast('Data bantuan berhasil diupdate!','success');
        }
    } else {
        const cnt = PPID_DATA.ppidPelaksana.daftarPermohonanBantuan.length+1;
        const newId = `#BPID${String(cnt).padStart(3,'0')}`;
        const now = new Date();
        const months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
        const tanggal = `${String(now.getDate()).padStart(2,'0')}-${months[now.getMonth()]}-${now.getFullYear()}`;
        PPID_DATA.ppidPelaksana.daftarPermohonanBantuan.push({ id:newId, opd, tanggal, subjek, status });
        
        PPID_DATA.ppidPelaksana.totalBantuan++;
        if (status==='Diterima') PPID_DATA.ppidPelaksana.bantuanDiterima++;
        else if (status==='Ditolak') PPID_DATA.ppidPelaksana.bantuanDitolak++;
        else PPID_DATA.ppidPelaksana.perluRespon++;
        
        let newOpdObj = PPID_DATA.ppidPelaksana.distribusiOPD.find(o => o.nama === opd);
        if (!newOpdObj) { newOpdObj = { nama: opd, diterima: 0, ditolak: 0, pending: 0 }; PPID_DATA.ppidPelaksana.distribusiOPD.push(newOpdObj); }
        if (status==='Diterima') newOpdObj.diterima++;
        else if (status==='Ditolak') newOpdObj.ditolak++;
        else newOpdObj.pending++;

        showToast('Bantuan berhasil ditambahkan!','success');
    }
    
    // Sync ringkasan status
    PPID_DATA.ppidPelaksana.ringkasanStatus.diterima = PPID_DATA.ppidPelaksana.bantuanDiterima;
    PPID_DATA.ppidPelaksana.ringkasanStatus.ditolak = PPID_DATA.ppidPelaksana.bantuanDitolak;
    PPID_DATA.ppidPelaksana.ringkasanStatus.inProgress = PPID_DATA.ppidPelaksana.perluRespon;

    closeModal();
    initPelaksana(); // refresh charts + table
};

// DELETE
window.deletePelaksanaBantuan = function(id) {
    showConfirmModal('Hapus Bantuan', 'Yakin ingin menghapus data bantuan ini?', () => {
        const item = PPID_DATA.ppidPelaksana.daftarPermohonanBantuan.find(b=>b.id===id);
        if (item) {
            PPID_DATA.ppidPelaksana.totalBantuan = Math.max(0, PPID_DATA.ppidPelaksana.totalBantuan - 1);
            if (item.status==='Diterima') PPID_DATA.ppidPelaksana.bantuanDiterima = Math.max(0, PPID_DATA.ppidPelaksana.bantuanDiterima - 1);
            else if (item.status==='Ditolak') PPID_DATA.ppidPelaksana.bantuanDitolak = Math.max(0, PPID_DATA.ppidPelaksana.bantuanDitolak - 1);
            else PPID_DATA.ppidPelaksana.perluRespon = Math.max(0, PPID_DATA.ppidPelaksana.perluRespon - 1);
            
            let oldOpdObj = PPID_DATA.ppidPelaksana.distribusiOPD.find(o => o.nama === item.opd);
            if (oldOpdObj) {
                if (item.status==='Diterima') oldOpdObj.diterima = Math.max(0, oldOpdObj.diterima - 1);
                else if (item.status==='Ditolak') oldOpdObj.ditolak = Math.max(0, oldOpdObj.ditolak - 1);
                else oldOpdObj.pending = Math.max(0, oldOpdObj.pending - 1);
            }
            
            PPID_DATA.ppidPelaksana.ringkasanStatus.diterima = PPID_DATA.ppidPelaksana.bantuanDiterima;
            PPID_DATA.ppidPelaksana.ringkasanStatus.ditolak = PPID_DATA.ppidPelaksana.bantuanDitolak;
            PPID_DATA.ppidPelaksana.ringkasanStatus.inProgress = PPID_DATA.ppidPelaksana.perluRespon;
        }

        PPID_DATA.ppidPelaksana.daftarPermohonanBantuan = PPID_DATA.ppidPelaksana.daftarPermohonanBantuan.filter(b=>b.id!==id);
        initPelaksana();
        showToast('Bantuan berhasil dihapus','danger');
    });
};

// ---- Alasan Modal ----
window.showAlasanModal = function() {
    const html = `
        <div class="detail-item">
            <span class="detail-label">Alasan Penolakan:</span>
            <span class="detail-value">Data yang diminta termasuk dalam kategori informasi yang dikecualikan sesuai dengan UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik Pasal 17.</span>
        </div>
        <div class="detail-item" style="margin-top:12px">
            <span class="detail-label">Tanggal Penolakan:</span>
            <span class="detail-value">15-07-2026</span>
        </div>
        <div class="detail-item">
            <span class="detail-label">Ditolak Oleh:</span>
            <span class="detail-value">Administrator PPID</span>
        </div>
    `;
    showModal('Alasan Penolakan', html, '<button class="btn btn-secondary" onclick="closeModal()">Tutup</button>');
};

// ---- Counter Animation ----
function animateCounter2(element, target) {
    let current = 0;
    const increment = Math.ceil(target / 25);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current;
    }, 30);
}
