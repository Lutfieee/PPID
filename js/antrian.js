// ============================================
// PPID Kota Tangerang - Monitoring Antrian Registrasi
// Table with filter, tabs, pagination
// ============================================

let antrianCurrentPage = 1;
const antrianPerPage = 7;
let antrianCurrentTab = 'putusan';
let antrianFilterText = '';
let antrianInitialized = false;

function initAntrian() {
    const summary = PPID_DATA.antrianRegistrasi.summary;

    // Update summary cards
    document.getElementById('antrianTotal').textContent = summary.totalAntrian;
    document.getElementById('antrianBelum').textContent = summary.belumDiputuskan;
    document.getElementById('antrianSelesai').textContent = summary.selesai;
    document.getElementById('antrianPerbaikan').textContent = summary.menungguPerbaikan;

    // Bind tab clicks
    const tabBtns = document.querySelectorAll('#page-antrian .tab-btn');
    tabBtns.forEach(btn => {
        btn.onclick = function() {
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            antrianCurrentTab = this.getAttribute('data-tab');
            antrianCurrentPage = 1;
            renderAntrianTable();
        };
    });

    // Bind filter
    const filterInput = document.getElementById('antrianFilter');
    if (filterInput) {
        filterInput.oninput = function() {
            antrianFilterText = this.value.toLowerCase();
            antrianCurrentPage = 1;
            renderAntrianTable();
        };
    }

    // Bind pagination nav buttons
    document.getElementById('antrianPrevPage').onclick = function() {
        if (antrianCurrentPage > 1) {
            antrianCurrentPage--;
            renderAntrianTable();
        }
    };
    document.getElementById('antrianNextPage').onclick = function() {
        const filtered = getFilteredAntrianData();
        const totalPages = Math.ceil(filtered.length / antrianPerPage);
        if (antrianCurrentPage < totalPages) {
            antrianCurrentPage++;
            renderAntrianTable();
        }
    };

    // Bind checkAll
    const checkAll = document.getElementById('checkAll');
    if (checkAll) {
        checkAll.onchange = function() {
            const checkboxes = document.querySelectorAll('#antrianTableBody input[type="checkbox"]');
            checkboxes.forEach(cb => cb.checked = this.checked);
        };
    }

    renderAntrianTable();
    antrianInitialized = true;
}

function getFilteredAntrianData() {
    let data = PPID_DATA.antrianRegistrasi.data;

    // Filter by tab
    if (antrianCurrentTab === 'putusan') {
        // Show all but highlight Belum Diputuskan
        // Actually show all for this tab as per screenshot
    } else if (antrianCurrentTab === 'kelengkapan') {
        // Show items that need document completion
        data = data.filter(d => d.statusType === 'pending' || d.statusType === 'repair');
    } else if (antrianCurrentTab === 'perbaikan') {
        data = data.filter(d => d.statusType === 'repair');
    }

    // Filter by search text
    if (antrianFilterText) {
        data = data.filter(d =>
            d.noRegister.toLowerCase().includes(antrianFilterText) ||
            d.nama.toLowerCase().includes(antrianFilterText) ||
            d.kategori.toLowerCase().includes(antrianFilterText) ||
            d.status.toLowerCase().includes(antrianFilterText)
        );
    }

    return data;
}

function renderAntrianTable() {
    const tbody = document.getElementById('antrianTableBody');
    if (!tbody) return;

    const filtered = getFilteredAntrianData();
    const totalPages = Math.ceil(filtered.length / antrianPerPage) || 1;

    // Clamp page
    if (antrianCurrentPage > totalPages) antrianCurrentPage = totalPages;

    const start = (antrianCurrentPage - 1) * antrianPerPage;
    const end = start + antrianPerPage;
    const pageData = filtered.slice(start, end);

    // Render rows
    tbody.innerHTML = pageData.map(item => {
        const slaClass = `sla-${item.slaType}`;
        const statusClass = getStatusBadgeClass(item.status);

        return `<tr>
            <td class="th-check"><input type="checkbox"></td>
            <td><small>${item.noRegister}</small></td>
            <td><strong>${item.tanggalMasuk}</strong></td>
            <td>${item.nama}</td>
            <td>${item.kategori}</td>
            <td><span class="sla-badge ${slaClass}">${item.sla}</span></td>
            <td><span class="badge ${statusClass}">${item.status}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn btn-view" onclick="showAntrianDetail(${filtered.indexOf(item)})" title="Detail"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn btn-delete" title="Hapus"><i class="fas fa-minus-circle"></i></button>
                </div>
            </td>
        </tr>`;
    }).join('');

    // Render pagination buttons
    renderAntrianPagination(totalPages);

    // Update row info
    document.getElementById('antrianRowInfo').textContent = `${filtered.length} Baris`;
}

function renderAntrianPagination(totalPages) {
    const container = document.getElementById('antrianPagination');
    if (!container) return;

    let html = '';

    // First & Prev
    html += `<button class="page-btn" onclick="goAntrianPage(1)" ${antrianCurrentPage === 1 ? 'disabled' : ''}><i class="fas fa-angle-double-left"></i></button>`;
    html += `<button class="page-btn" onclick="goAntrianPage(${antrianCurrentPage - 1})" ${antrianCurrentPage === 1 ? 'disabled' : ''}><i class="fas fa-angle-left"></i></button>`;

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, antrianCurrentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === antrianCurrentPage ? 'active' : ''}" onclick="goAntrianPage(${i})">${i}</button>`;
    }

    // Next & Last
    html += `<button class="page-btn" onclick="goAntrianPage(${antrianCurrentPage + 1})" ${antrianCurrentPage === totalPages ? 'disabled' : ''}><i class="fas fa-angle-right"></i></button>`;
    html += `<button class="page-btn" onclick="goAntrianPage(${totalPages})" ${antrianCurrentPage === totalPages ? 'disabled' : ''}><i class="fas fa-angle-double-right"></i></button>`;

    container.innerHTML = html;
}

window.goAntrianPage = function(page) {
    const filtered = getFilteredAntrianData();
    const totalPages = Math.ceil(filtered.length / antrianPerPage) || 1;
    if (page < 1 || page > totalPages) return;
    antrianCurrentPage = page;
    renderAntrianTable();
};

// ---- Detail Modal ----
window.showAntrianDetail = function(index) {
    const data = getFilteredAntrianData();
    const item = data[index];
    if (!item) return;

    const slaClass = `sla-${item.slaType}`;
    const statusClass = getStatusBadgeClass(item.status);

    const html = `
        <div class="detail-item"><span class="detail-label">No. Register</span><span class="detail-value">${item.noRegister}</span></div>
        <div class="detail-item"><span class="detail-label">Tanggal Masuk</span><span class="detail-value">${item.tanggalMasuk}</span></div>
        <div class="detail-item"><span class="detail-label">Nama Pemohon</span><span class="detail-value">${item.nama}</span></div>
        <div class="detail-item"><span class="detail-label">Kategori</span><span class="detail-value">${item.kategori}</span></div>
        <div class="detail-item"><span class="detail-label">SLA</span><span class="detail-value"><span class="sla-badge ${slaClass}">${item.sla}</span></span></div>
        <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ${statusClass}">${item.status}</span></span></div>
    `;

    const footer = `
        <button class="btn btn-secondary" onclick="closeModal()">Tutup</button>
        ${item.status === 'Belum Diputuskan' ? `
            <button class="btn btn-success" onclick="updateAntrianStatus(${index}, 'Diterima')"><i class="fas fa-check"></i> Terima</button>
            <button class="btn btn-danger" onclick="updateAntrianStatus(${index}, 'Ditolak')"><i class="fas fa-times"></i> Tolak</button>
        ` : ''}
    `;

    showModal('Detail Antrian Registrasi', html, footer);
};

// ---- Update Status ----
window.updateAntrianStatus = function(index, newStatus) {
    const data = getFilteredAntrianData();
    const item = data[index];
    if (!item) return;

    // Find in original data and update
    const original = PPID_DATA.antrianRegistrasi.data.find(d => d.noRegister === item.noRegister);
    if (original) {
        if (original.status === 'Belum Diputuskan') PPID_DATA.antrianRegistrasi.summary.belumDiputuskan = Math.max(0, PPID_DATA.antrianRegistrasi.summary.belumDiputuskan - 1);
        else if (original.status === 'Perbaikan') PPID_DATA.antrianRegistrasi.summary.menungguPerbaikan = Math.max(0, PPID_DATA.antrianRegistrasi.summary.menungguPerbaikan - 1);

        original.status = newStatus;
        original.statusType = newStatus === 'Diterima' ? 'success' : 'danger';
        original.sla = 'Selesai';
        original.slaType = 'done';
        
        PPID_DATA.antrianRegistrasi.summary.selesai++;
    }

    closeModal();
    initAntrian(); // Re-render everything
    showToast(`Permohonan berhasil ${newStatus.toLowerCase()}!`, newStatus === 'Diterima' ? 'success' : 'danger');
};
