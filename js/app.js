// ============================================
// PPID Kota Tangerang - Main Application Logic
// Full CRUD: Create, Read, Update, Delete
// ============================================

(function() {
    'use strict';

    // ---- DOM References ----
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const toastContainer = document.getElementById('toastContainer');

    let currentPage = 'home';
    let sidebarCollapsed = false;

    // ============================================
    // SIDEBAR TOGGLE
    // ============================================
    hamburgerBtn.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('mobile-open');
        } else {
            sidebarCollapsed = !sidebarCollapsed;
            sidebar.classList.toggle('collapsed', sidebarCollapsed);
            mainContent.classList.toggle('expanded', sidebarCollapsed);
        }
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 &&
            sidebar.classList.contains('mobile-open') &&
            !sidebar.contains(e.target) &&
            !hamburgerBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
        }
    });

    // ============================================
    // SIDEBAR SUBMENU TOGGLE
    // ============================================
    document.querySelectorAll('.nav-link.has-sub').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-toggle');
            const subMenu = document.getElementById(targetId);
            document.querySelectorAll('.sub-menu.open').forEach(sm => {
                if (sm.id !== targetId) {
                    sm.classList.remove('open');
                    const pl = document.querySelector(`[data-toggle="${sm.id}"]`);
                    if (pl) pl.classList.remove('open');
                }
            });
            link.classList.toggle('open');
            subMenu.classList.toggle('open');
        });
    });

    // ============================================
    // PAGE NAVIGATION
    // ============================================
    function navigateTo(pageName) {
        if (currentPage === pageName) return;
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const targetPage = document.getElementById(`page-${pageName}`);
        if (targetPage) {
            targetPage.classList.add('active');
            currentPage = pageName;
            initPage(pageName);
        }
        updateActiveNav(pageName);
        if (window.innerWidth <= 768) sidebar.classList.remove('mobile-open');
    }

    function updateActiveNav(pageName) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('.sub-link').forEach(l => l.classList.remove('active'));
        const directLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
        if (directLink && !directLink.classList.contains('has-sub')) directLink.classList.add('active');
        const subLink = document.querySelector(`.sub-link[data-page="${pageName}"]`);
        if (subLink) {
            subLink.classList.add('active');
            const parentId = subLink.getAttribute('data-parent');
            if (parentId) {
                const parentLink = document.getElementById(parentId);
                if (parentLink) {
                    parentLink.classList.add('open');
                    const subMenu = document.getElementById(parentLink.getAttribute('data-toggle'));
                    if (subMenu) subMenu.classList.add('open');
                }
            }
        }
        if (pageName === 'home') document.getElementById('nav-home').classList.add('active');
    }

    window.navigateTo = navigateTo;

    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.classList.contains('has-sub')) return;
            e.preventDefault();
            navigateTo(link.getAttribute('data-page'));
        });
    });
    document.querySelectorAll('.sub-link[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(link.getAttribute('data-page'));
        });
    });

    // ============================================
    // PAGE INITIALIZATION
    // ============================================
    function initPage(pageName) {
        switch(pageName) {
            case 'home': if (typeof initHomeOverview === 'function') initHomeOverview(); break;
            case 'monitoring': if (typeof initDashboard === 'function') initDashboard(); break;
            case 'pelaksana': if (typeof initPelaksana === 'function') initPelaksana(); break;
            case 'antrian': if (typeof initAntrian === 'function') initAntrian(); break;
            case 'permohonan': renderPermohonanTable(); break;
            case 'keberatan': renderKeberatanTable(); break;
            case 'dokumen': renderDokumenTable(); break;
            case 'pembantu': renderPembantuTable(); break;
            case 'hukum': renderHukumTable(); break;
        }
    }

    // ============================================
    // DATE/TIME
    // ============================================
    function updateDateTime() {
        const now = new Date();
        const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        const el = document.getElementById('currentDateTime');
        if (el) el.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    // ============================================
    // MODAL
    // ============================================
    window.showModal = function(title, bodyHtml, footerHtml) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = bodyHtml;
        if (footerHtml) document.getElementById('modalFooter').innerHTML = footerHtml;
        modalOverlay.classList.add('show');
    };
    window.closeModal = function() { modalOverlay.classList.remove('show'); };
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

    // ============================================
    // TOAST
    // ============================================
    window.showToast = function(message, type = 'success') {
        const iconMap = { success:'fas fa-check-circle', danger:'fas fa-exclamation-circle', info:'fas fa-info-circle' };
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<i class="${iconMap[type]||iconMap.info}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => { toast.style.animation='slideOutRight 0.4s ease forwards'; setTimeout(()=>toast.remove(),400); }, 3000);
    };

    // ============================================
    // UTILITY
    // ============================================
    function getStatusBadgeClass(status) {
        const map = { 'Diterima':'badge-success','Ditolak':'badge-danger','Perbaikan':'badge-repair','Belum Diputuskan':'badge-pending','Dalam Proses':'badge-warning','In Progress':'badge-in-progress','Selesai':'badge-success' };
        return map[status] || 'badge-pending';
    }
    window.getStatusBadgeClass = getStatusBadgeClass;

    function generateDate() {
        const now = new Date();
        const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Ags','Sep','Okt','Nov','Des'];
        return `${String(now.getDate()).padStart(2,'0')} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    function bindFilter(inputId, tbodyId) {
        const input = document.getElementById(inputId);
        const tbody = document.getElementById(tbodyId);
        if (input && tbody) {
            input.oninput = function() {
                const term = this.value.toLowerCase();
                tbody.querySelectorAll('tr').forEach(row => {
                    row.style.display = row.textContent.toLowerCase().includes(term) ? '' : 'none';
                });
            };
        }
    }

    // ========================================================================
    //  C R U D  :  P E R M O H O N A N
    // ========================================================================
    function renderPermohonanTable() {
        const tbody = document.getElementById('permohonanTableBody');
        if (!tbody) return;
        tbody.innerHTML = PPID_DATA.permohonan.map(item => {
            const sc = getStatusBadgeClass(item.status);
            return `<tr>
                <td>${item.id}</td>
                <td><small>${item.noRegister}</small></td>
                <td>${item.pemohon}</td>
                <td>${item.kategori}</td>
                <td>${item.informasi}</td>
                <td>${item.tanggalMasuk}</td>
                <td><span class="badge ${sc}">${item.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn btn-view" onclick="showPermohonanDetail('${item.id}')" title="Detail"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="editPermohonan('${item.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn btn-delete" onclick="deletePermohonan('${item.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
        }).join('');
        bindFilter('permohonanFilter', 'permohonanTableBody');
        const sf = document.getElementById('permohonanStatusFilter');
        if (sf) sf.onchange = function() { const s=this.value; document.querySelectorAll('#permohonanTableBody tr').forEach(r=>{if(!s){r.style.display='';return;} const b=r.querySelector('.badge'); r.style.display=b&&b.textContent===s?'':'none';}); };
    }

    // READ
    window.showPermohonanDetail = function(id) {
        const item = PPID_DATA.permohonan.find(p=>p.id===id);
        if (!item) return;
        const html = `
            <div class="detail-item"><span class="detail-label">ID</span><span class="detail-value">${item.id}</span></div>
            <div class="detail-item"><span class="detail-label">No. Register</span><span class="detail-value">${item.noRegister}</span></div>
            <div class="detail-item"><span class="detail-label">Pemohon</span><span class="detail-value">${item.pemohon}</span></div>
            <div class="detail-item"><span class="detail-label">NIK</span><span class="detail-value">${item.nik}</span></div>
            <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${item.email}</span></div>
            <div class="detail-item"><span class="detail-label">Telepon</span><span class="detail-value">${item.telepon}</span></div>
            <div class="detail-item"><span class="detail-label">Kategori</span><span class="detail-value">${item.kategori}</span></div>
            <div class="detail-item"><span class="detail-label">Informasi</span><span class="detail-value">${item.informasi}</span></div>
            <div class="detail-item"><span class="detail-label">Tujuan</span><span class="detail-value">${item.tujuan}</span></div>
            <div class="detail-item"><span class="detail-label">Tanggal</span><span class="detail-value">${item.tanggalMasuk}</span></div>
            <div class="detail-item"><span class="detail-label">OPD</span><span class="detail-value">${item.opd}</span></div>
            <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ${getStatusBadgeClass(item.status)}">${item.status}</span></span></div>`;
        showModal('Detail Permohonan', html, '<button class="btn btn-secondary" onclick="closeModal()">Tutup</button>');
    };

    // CREATE
    const btnAddPermohonan = document.getElementById('btnAddPermohonan');
    if (btnAddPermohonan) btnAddPermohonan.addEventListener('click', () => showPermohonanForm());

    function showPermohonanForm(item) {
        const isEdit = !!item;
        const html = `
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Nama Pemohon</label><input type="text" class="form-input" id="fldNama" value="${isEdit?item.pemohon:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">NIK</label><input type="text" class="form-input" id="fldNik" value="${isEdit?item.nik:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Email</label><input type="email" class="form-input" id="fldEmail" value="${isEdit?item.email:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Telepon</label><input type="text" class="form-input" id="fldTelepon" value="${isEdit?item.telepon:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Kategori</label>
                <select class="filter-select" id="fldKategori" style="width:100%">
                    <option value="PERORANGAN" ${isEdit&&item.kategori==='PERORANGAN'?'selected':''}>PERORANGAN</option>
                    <option value="BADAN HUKUM" ${isEdit&&item.kategori==='BADAN HUKUM'?'selected':''}>BADAN HUKUM</option>
                </select></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Informasi yang Diminta</label><input type="text" class="form-input" id="fldInformasi" value="${isEdit?item.informasi:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Tujuan Penggunaan</label><input type="text" class="form-input" id="fldTujuan" value="${isEdit?item.tujuan:''}"></div>
            ${isEdit ? `<div class="form-group" style="margin-bottom:12px"><label class="form-label">Status</label>
                <select class="filter-select" id="fldStatus" style="width:100%">
                    <option value="Belum Diputuskan" ${item.status==='Belum Diputuskan'?'selected':''}>Belum Diputuskan</option>
                    <option value="Diterima" ${item.status==='Diterima'?'selected':''}>Diterima</option>
                    <option value="Ditolak" ${item.status==='Ditolak'?'selected':''}>Ditolak</option>
                    <option value="Perbaikan" ${item.status==='Perbaikan'?'selected':''}>Perbaikan</option>
                </select></div>` : ''}`;
        const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
            <button class="btn btn-primary" onclick="savePermohonan('${isEdit?item.id:''}')"><i class="fas fa-save"></i> ${isEdit?'Update':'Simpan'}</button>`;
        showModal(isEdit?'Edit Permohonan':'Tambah Permohonan Baru', html, footer);
    }

    // UPDATE
    window.editPermohonan = function(id) {
        const item = PPID_DATA.permohonan.find(p=>p.id===id);
        if (item) showPermohonanForm(item);
    };

    window.savePermohonan = function(editId) {
        const nama = document.getElementById('fldNama').value;
        const nik = document.getElementById('fldNik').value;
        const email = document.getElementById('fldEmail').value;
        const telepon = document.getElementById('fldTelepon').value;
        const kategori = document.getElementById('fldKategori').value;
        const informasi = document.getElementById('fldInformasi').value;
        const tujuan = document.getElementById('fldTujuan').value;
        if (!nama||!nik||!email) { showToast('Harap lengkapi semua field!','danger'); return; }

        if (editId) {
            const item = PPID_DATA.permohonan.find(p=>p.id===editId);
            if (item) {
                // Subtract old dashboard metrics
                if (item.status === 'Diterima' || item.status === 'Selesai') PPID_DATA.dashboardMonitoring.statusKeputusan.diberikanSeluruhnya = Math.max(0, PPID_DATA.dashboardMonitoring.statusKeputusan.diberikanSeluruhnya - 1);
                else if (item.status === 'Ditolak') PPID_DATA.dashboardMonitoring.statusKeputusan.ditolakSebagian = Math.max(0, PPID_DATA.dashboardMonitoring.statusKeputusan.ditolakSebagian - 1);
                else PPID_DATA.dashboardMonitoring.statusKeputusan.dalamPengerjaan = Math.max(0, PPID_DATA.dashboardMonitoring.statusKeputusan.dalamPengerjaan - 1);

                item.pemohon=nama.toUpperCase(); item.nik=nik; item.email=email; item.telepon=telepon;
                item.kategori=kategori; item.informasi=informasi; item.tujuan=tujuan;
                const statusEl = document.getElementById('fldStatus');
                if (statusEl) item.status = statusEl.value;

                // Add new dashboard metrics
                if (item.status === 'Diterima' || item.status === 'Selesai') PPID_DATA.dashboardMonitoring.statusKeputusan.diberikanSeluruhnya++;
                else if (item.status === 'Ditolak') PPID_DATA.dashboardMonitoring.statusKeputusan.ditolakSebagian++;
                else PPID_DATA.dashboardMonitoring.statusKeputusan.dalamPengerjaan++;
            }
            showToast('Permohonan berhasil diupdate!','success');
        } else {
            const newId = `PRM-${String(PPID_DATA.permohonan.length+1).padStart(3,'0')}`;
            const noReg = `${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}/PPID/${Math.floor(Math.random()*99999999).toString().padStart(8,'0')}/${Math.floor(Math.random()*9999).toString().padStart(4,'0')}`;
            PPID_DATA.permohonan.push({ id:newId, noRegister:noReg, pemohon:nama.toUpperCase(), nik,email,telepon,kategori,informasi,tujuan, tanggalMasuk:generateDate(), status:'Belum Diputuskan', opd:'PPID' });
            
            // Add new dashboard metrics
            PPID_DATA.dashboardMonitoring.totalPermohonan++;
            PPID_DATA.dashboardMonitoring.statusKeputusan.dalamPengerjaan++;
            let topOpd = PPID_DATA.dashboardMonitoring.opdTerbanyak.find(o => o.nama === 'PPID');
            if (topOpd) topOpd.jumlah++;
            
            showToast('Permohonan berhasil ditambahkan!','success');
        }
        closeModal(); renderPermohonanTable();
        if (typeof initDashboard === 'function') initDashboard();
    };

    // DELETE
    window.deletePermohonan = function(id) {
        showConfirmModal('Hapus Permohonan', 'Yakin ingin menghapus permohonan ini?', () => {
            const item = PPID_DATA.permohonan.find(p=>p.id===id);
            if (item) {
                // Subtract dashboard metrics
                PPID_DATA.dashboardMonitoring.totalPermohonan = Math.max(0, PPID_DATA.dashboardMonitoring.totalPermohonan - 1);
                if (item.status === 'Diterima' || item.status === 'Selesai') PPID_DATA.dashboardMonitoring.statusKeputusan.diberikanSeluruhnya = Math.max(0, PPID_DATA.dashboardMonitoring.statusKeputusan.diberikanSeluruhnya - 1);
                else if (item.status === 'Ditolak') PPID_DATA.dashboardMonitoring.statusKeputusan.ditolakSebagian = Math.max(0, PPID_DATA.dashboardMonitoring.statusKeputusan.ditolakSebagian - 1);
                else PPID_DATA.dashboardMonitoring.statusKeputusan.dalamPengerjaan = Math.max(0, PPID_DATA.dashboardMonitoring.statusKeputusan.dalamPengerjaan - 1);
                
                let topOpd = PPID_DATA.dashboardMonitoring.opdTerbanyak.find(o => o.nama === item.opd);
                if (topOpd) topOpd.jumlah = Math.max(0, topOpd.jumlah - 1);
            }
            
            PPID_DATA.permohonan = PPID_DATA.permohonan.filter(p=>p.id!==id);
            renderPermohonanTable();
            if (typeof initDashboard === 'function') initDashboard();
            showToast('Permohonan berhasil dihapus','danger');
        });
    };

    // ========================================================================
    //  C R U D  :  K E B E R A T A N
    // ========================================================================
    function renderKeberatanTable() {
        const tbody = document.getElementById('keberatanTableBody');
        if (!tbody) return;
        tbody.innerHTML = PPID_DATA.keberatan.map(item => {
            const sc = item.status==='Selesai'?'badge-success':'badge-warning';
            return `<tr>
                <td>${item.id}</td>
                <td>${item.pemohon}</td>
                <td>${item.noPermohonan}</td>
                <td>${item.tanggal}</td>
                <td>${item.alasan}</td>
                <td><span class="badge ${sc}">${item.status}</span></td>
                <td>
                    <div class="action-btns">
                        <button class="action-btn btn-view" onclick="showKeberatanDetail('${item.id}')" title="Detail"><i class="fas fa-eye"></i></button>
                        <button class="action-btn" onclick="editKeberatan('${item.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn btn-delete" onclick="deleteKeberatan('${item.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>`;
        }).join('');
        bindFilter('keberatanFilter','keberatanTableBody');
    }

    // READ
    window.showKeberatanDetail = function(id) {
        const item = PPID_DATA.keberatan.find(k=>k.id===id);
        if (!item) return;
        const html = `
            <div class="detail-item"><span class="detail-label">ID</span><span class="detail-value">${item.id}</span></div>
            <div class="detail-item"><span class="detail-label">Pemohon</span><span class="detail-value">${item.pemohon}</span></div>
            <div class="detail-item"><span class="detail-label">No. Permohonan</span><span class="detail-value">${item.noPermohonan}</span></div>
            <div class="detail-item"><span class="detail-label">Tanggal</span><span class="detail-value">${item.tanggal}</span></div>
            <div class="detail-item"><span class="detail-label">Alasan</span><span class="detail-value">${item.alasan}</span></div>
            <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value"><span class="badge ${item.status==='Selesai'?'badge-success':'badge-warning'}">${item.status}</span></span></div>`;
        showModal('Detail Keberatan', html, '<button class="btn btn-secondary" onclick="closeModal()">Tutup</button>');
    };

    // CREATE & UPDATE
    const btnAddKeberatan = document.getElementById('btnAddKeberatan');
    if (btnAddKeberatan) btnAddKeberatan.addEventListener('click', () => showKeberatanForm());

    function showKeberatanForm(item) {
        const isEdit = !!item;
        const html = `
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Nama Pemohon</label><input type="text" class="form-input" id="fldKbrPemohon" value="${isEdit?item.pemohon:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">No. Permohonan Asal</label><input type="text" class="form-input" id="fldKbrNoPrm" value="${isEdit?item.noPermohonan:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Alasan Keberatan</label><textarea class="form-input" id="fldKbrAlasan" rows="3" style="resize:vertical">${isEdit?item.alasan:''}</textarea></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Status</label>
                <select class="filter-select" id="fldKbrStatus" style="width:100%">
                    <option value="Dalam Proses" ${isEdit&&item.status==='Dalam Proses'?'selected':''}>Dalam Proses</option>
                    <option value="Selesai" ${isEdit&&item.status==='Selesai'?'selected':''}>Selesai</option>
                </select></div>`;
        const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
            <button class="btn btn-primary" onclick="saveKeberatan('${isEdit?item.id:''}')"><i class="fas fa-save"></i> ${isEdit?'Update':'Simpan'}</button>`;
        showModal(isEdit?'Edit Keberatan':'Tambah Keberatan', html, footer);
    }

    window.editKeberatan = function(id) { const i=PPID_DATA.keberatan.find(k=>k.id===id); if(i) showKeberatanForm(i); };

    window.saveKeberatan = function(editId) {
        const pemohon = document.getElementById('fldKbrPemohon').value;
        const noPrm = document.getElementById('fldKbrNoPrm').value;
        const alasan = document.getElementById('fldKbrAlasan').value;
        const status = document.getElementById('fldKbrStatus').value;
        if (!pemohon||!alasan) { showToast('Harap lengkapi semua field!','danger'); return; }

        if (editId) {
            const item = PPID_DATA.keberatan.find(k=>k.id===editId);
            if (item) { item.pemohon=pemohon; item.noPermohonan=noPrm; item.alasan=alasan; item.status=status; }
            showToast('Keberatan berhasil diupdate!','success');
        } else {
            const newId = `KBR-${String(PPID_DATA.keberatan.length+1).padStart(3,'0')}`;
            PPID_DATA.keberatan.push({ id:newId, pemohon, noPermohonan:noPrm, tanggal:generateDate(), alasan, status });
            showToast('Keberatan berhasil ditambahkan!','success');
        }
        closeModal(); renderKeberatanTable();
    };

    // DELETE
    window.deleteKeberatan = function(id) {
        showConfirmModal('Hapus Keberatan', 'Yakin ingin menghapus data keberatan ini?', () => {
            PPID_DATA.keberatan = PPID_DATA.keberatan.filter(k=>k.id!==id);
            renderKeberatanTable();
            showToast('Keberatan berhasil dihapus','danger');
        });
    };

    // ========================================================================
    //  C R U D  :  D O K U M E N   I N F O R M A S I
    // ========================================================================
    function renderDokumenTable() {
        const tbody = document.getElementById('dokumenTableBody');
        if (!tbody) return;
        tbody.innerHTML = PPID_DATA.dokumenInformasi.map(item => `<tr>
            <td>${item.id}</td>
            <td>${item.judul}</td>
            <td><span class="badge badge-info">${item.kategori}</span></td>
            <td>${item.tanggalUpload}</td>
            <td>${item.ukuran}</td>
            <td>${item.tipe}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn btn-view" onclick="showDokumenDetail('${item.id}')" title="Detail"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="editDokumen('${item.id}')" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn btn-delete" onclick="deleteDokumen('${item.id}')" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`).join('');
        bindFilter('dokumenFilter','dokumenTableBody');
        const kf = document.getElementById('dokumenKategoriFilter');
        if (kf) kf.onchange = function() { const k=this.value; document.querySelectorAll('#dokumenTableBody tr').forEach(r=>{if(!k){r.style.display='';return;} const b=r.querySelector('.badge'); r.style.display=b&&b.textContent===k?'':'none';}); };
    }

    // READ
    window.showDokumenDetail = function(id) {
        const item = PPID_DATA.dokumenInformasi.find(d=>d.id===id);
        if (!item) return;
        const html = `
            <div class="detail-item"><span class="detail-label">ID</span><span class="detail-value">${item.id}</span></div>
            <div class="detail-item"><span class="detail-label">Judul</span><span class="detail-value">${item.judul}</span></div>
            <div class="detail-item"><span class="detail-label">Kategori</span><span class="detail-value"><span class="badge badge-info">${item.kategori}</span></span></div>
            <div class="detail-item"><span class="detail-label">Tanggal Upload</span><span class="detail-value">${item.tanggalUpload}</span></div>
            <div class="detail-item"><span class="detail-label">Ukuran</span><span class="detail-value">${item.ukuran}</span></div>
            <div class="detail-item"><span class="detail-label">Tipe</span><span class="detail-value">${item.tipe}</span></div>`;
        showModal('Detail Dokumen', html, '<button class="btn btn-secondary" onclick="closeModal()">Tutup</button>');
    };

    // CREATE & UPDATE
    const btnAddDokumen = document.getElementById('btnAddDokumen');
    if (btnAddDokumen) btnAddDokumen.addEventListener('click', () => showDokumenForm());

    function showDokumenForm(item) {
        const isEdit = !!item;
        const cats = ['Informasi Berkala','Informasi Serta Merta','Informasi Setiap Saat','Informasi Dikecualikan'];
        const html = `
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Judul Dokumen</label><input type="text" class="form-input" id="fldDokJudul" value="${isEdit?item.judul:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Kategori</label>
                <select class="filter-select" id="fldDokKategori" style="width:100%">${cats.map(c=>`<option value="${c}" ${isEdit&&item.kategori===c?'selected':''}>${c}</option>`).join('')}</select></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Tipe File</label>
                <select class="filter-select" id="fldDokTipe" style="width:100%">
                    <option value="PDF" ${isEdit&&item.tipe==='PDF'?'selected':''}>PDF</option>
                    <option value="DOCX" ${isEdit&&item.tipe==='DOCX'?'selected':''}>DOCX</option>
                    <option value="XLSX" ${isEdit&&item.tipe==='XLSX'?'selected':''}>XLSX</option>
                </select></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">File (simulasi)</label><input type="file" class="form-input" id="fldDokFile"></div>`;
        const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
            <button class="btn btn-primary" onclick="saveDokumen('${isEdit?item.id:''}')"><i class="fas fa-save"></i> ${isEdit?'Update':'Upload'}</button>`;
        showModal(isEdit?'Edit Dokumen':'Upload Dokumen Baru', html, footer);
    }

    window.editDokumen = function(id) { const i=PPID_DATA.dokumenInformasi.find(d=>d.id===id); if(i) showDokumenForm(i); };

    window.saveDokumen = function(editId) {
        const judul = document.getElementById('fldDokJudul').value;
        const kategori = document.getElementById('fldDokKategori').value;
        const tipe = document.getElementById('fldDokTipe').value;
        if (!judul) { showToast('Harap isi judul dokumen!','danger'); return; }

        if (editId) {
            const item = PPID_DATA.dokumenInformasi.find(d=>d.id===editId);
            if (item) { item.judul=judul; item.kategori=kategori; item.tipe=tipe; }
            showToast('Dokumen berhasil diupdate!','success');
        } else {
            const newId = `DOK-${String(PPID_DATA.dokumenInformasi.length+1).padStart(3,'0')}`;
            PPID_DATA.dokumenInformasi.push({ id:newId, judul, kategori, tanggalUpload:generateDate(), ukuran:'1.0 MB', tipe });
            showToast('Dokumen berhasil diupload!','success');
        }
        closeModal(); renderDokumenTable();
    };

    // DELETE
    window.deleteDokumen = function(id) {
        showConfirmModal('Hapus Dokumen', 'Yakin ingin menghapus dokumen ini?', () => {
            PPID_DATA.dokumenInformasi = PPID_DATA.dokumenInformasi.filter(d=>d.id!==id);
            renderDokumenTable();
            showToast('Dokumen berhasil dihapus','danger');
        });
    };

    // ========================================================================
    //  C R U D  :  D A F T A R   P E M B A N T U
    // ========================================================================
    function renderPembantuTable() {
        const tbody = document.getElementById('pembantuTableBody');
        if (!tbody) return;
        tbody.innerHTML = PPID_DATA.daftarPembantu.map(item => `<tr>
            <td>${item.id}</td>
            <td>${item.nama}</td>
            <td>${item.kepala}</td>
            <td>${item.telepon}</td>
            <td>${item.email}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn btn-view" onclick="showPembantuDetail(${item.id})" title="Detail"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="editPembantu(${item.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn btn-delete" onclick="deletePembantu(${item.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`).join('');
        bindFilter('pembantuFilter','pembantuTableBody');
    }

    // READ
    window.showPembantuDetail = function(id) {
        const item = PPID_DATA.daftarPembantu.find(p=>p.id===id);
        if (!item) return;
        const html = `
            <div class="detail-item"><span class="detail-label">No</span><span class="detail-value">${item.id}</span></div>
            <div class="detail-item"><span class="detail-label">Nama OPD</span><span class="detail-value">${item.nama}</span></div>
            <div class="detail-item"><span class="detail-label">Kepala/Pejabat</span><span class="detail-value">${item.kepala}</span></div>
            <div class="detail-item"><span class="detail-label">Telepon</span><span class="detail-value">${item.telepon}</span></div>
            <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${item.email}</span></div>`;
        showModal('Detail PPID Pembantu', html, '<button class="btn btn-secondary" onclick="closeModal()">Tutup</button>');
    };

    // CREATE & UPDATE
    const btnAddPembantu = document.getElementById('btnAddPembantu');
    if (btnAddPembantu) btnAddPembantu.addEventListener('click', () => showPembantuForm());

    function showPembantuForm(item) {
        const isEdit = !!item;
        const html = `
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Nama OPD</label><input type="text" class="form-input" id="fldPmbNama" value="${isEdit?item.nama:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Kepala / Pejabat</label><input type="text" class="form-input" id="fldPmbKepala" value="${isEdit?item.kepala:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Telepon</label><input type="text" class="form-input" id="fldPmbTelepon" value="${isEdit?item.telepon:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Email</label><input type="email" class="form-input" id="fldPmbEmail" value="${isEdit?item.email:''}"></div>`;
        const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
            <button class="btn btn-primary" onclick="savePembantu(${isEdit?item.id:0})"><i class="fas fa-save"></i> ${isEdit?'Update':'Simpan'}</button>`;
        showModal(isEdit?'Edit PPID Pembantu':'Tambah PPID Pembantu', html, footer);
    }

    window.editPembantu = function(id) { const i=PPID_DATA.daftarPembantu.find(p=>p.id===id); if(i) showPembantuForm(i); };

    window.savePembantu = function(editId) {
        const nama = document.getElementById('fldPmbNama').value;
        const kepala = document.getElementById('fldPmbKepala').value;
        const telepon = document.getElementById('fldPmbTelepon').value;
        const email = document.getElementById('fldPmbEmail').value;
        if (!nama||!kepala) { showToast('Harap lengkapi semua field!','danger'); return; }

        if (editId) {
            const item = PPID_DATA.daftarPembantu.find(p=>p.id===editId);
            if (item) { item.nama=nama; item.kepala=kepala; item.telepon=telepon; item.email=email; }
            showToast('Data pembantu berhasil diupdate!','success');
        } else {
            const newId = PPID_DATA.daftarPembantu.length > 0 ? Math.max(...PPID_DATA.daftarPembantu.map(p=>p.id))+1 : 1;
            PPID_DATA.daftarPembantu.push({ id:newId, nama, kepala, telepon, email });
            showToast('Pembantu berhasil ditambahkan!','success');
        }
        closeModal(); renderPembantuTable();
    };

    // DELETE
    window.deletePembantu = function(id) {
        showConfirmModal('Hapus Pembantu', 'Yakin ingin menghapus data pembantu ini?', () => {
            PPID_DATA.daftarPembantu = PPID_DATA.daftarPembantu.filter(p=>p.id!==id);
            renderPembantuTable();
            showToast('Pembantu berhasil dihapus','danger');
        });
    };

    // ========================================================================
    //  C R U D  :  D A S A R   H U K U M
    // ========================================================================
    function renderHukumTable() {
        const tbody = document.getElementById('hukumTableBody');
        if (!tbody) return;
        tbody.innerHTML = PPID_DATA.dasarHukum.map(item => `<tr>
            <td>${item.id}</td>
            <td>${item.nomor}</td>
            <td>${item.judul}</td>
            <td><span class="badge badge-info">${item.kategori}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn btn-view" onclick="showHukumDetail(${item.id})" title="Detail"><i class="fas fa-eye"></i></button>
                    <button class="action-btn" onclick="editHukum(${item.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn btn-delete" onclick="deleteHukum(${item.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>`).join('');
        bindFilter('hukumFilter','hukumTableBody');
    }

    // READ
    window.showHukumDetail = function(id) {
        const item = PPID_DATA.dasarHukum.find(h=>h.id===id);
        if (!item) return;
        const html = `
            <div class="detail-item"><span class="detail-label">No</span><span class="detail-value">${item.id}</span></div>
            <div class="detail-item"><span class="detail-label">Nomor</span><span class="detail-value">${item.nomor}</span></div>
            <div class="detail-item"><span class="detail-label">Judul</span><span class="detail-value">${item.judul}</span></div>
            <div class="detail-item"><span class="detail-label">Kategori</span><span class="detail-value"><span class="badge badge-info">${item.kategori}</span></span></div>`;
        showModal('Detail Dasar Hukum', html, '<button class="btn btn-secondary" onclick="closeModal()">Tutup</button>');
    };

    // CREATE & UPDATE
    const btnAddHukum = document.getElementById('btnAddHukum');
    if (btnAddHukum) btnAddHukum.addEventListener('click', () => showHukumForm());

    function showHukumForm(item) {
        const isEdit = !!item;
        const cats = ['Undang-Undang','Peraturan Pemerintah','Peraturan Komisi Informasi','Peraturan Walikota','Surat Keputusan'];
        const html = `
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Nomor</label><input type="text" class="form-input" id="fldHkmNomor" value="${isEdit?item.nomor:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Judul</label><input type="text" class="form-input" id="fldHkmJudul" value="${isEdit?item.judul:''}"></div>
            <div class="form-group" style="margin-bottom:12px"><label class="form-label">Kategori</label>
                <select class="filter-select" id="fldHkmKategori" style="width:100%">${cats.map(c=>`<option value="${c}" ${isEdit&&item.kategori===c?'selected':''}>${c}</option>`).join('')}</select></div>`;
        const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
            <button class="btn btn-primary" onclick="saveHukum(${isEdit?item.id:0})"><i class="fas fa-save"></i> ${isEdit?'Update':'Simpan'}</button>`;
        showModal(isEdit?'Edit Dasar Hukum':'Tambah Dasar Hukum', html, footer);
    }

    window.editHukum = function(id) { const i=PPID_DATA.dasarHukum.find(h=>h.id===id); if(i) showHukumForm(i); };

    window.saveHukum = function(editId) {
        const nomor = document.getElementById('fldHkmNomor').value;
        const judul = document.getElementById('fldHkmJudul').value;
        const kategori = document.getElementById('fldHkmKategori').value;
        if (!nomor||!judul) { showToast('Harap lengkapi semua field!','danger'); return; }

        if (editId) {
            const item = PPID_DATA.dasarHukum.find(h=>h.id===editId);
            if (item) { item.nomor=nomor; item.judul=judul; item.kategori=kategori; }
            showToast('Dasar hukum berhasil diupdate!','success');
        } else {
            const newId = PPID_DATA.dasarHukum.length > 0 ? Math.max(...PPID_DATA.dasarHukum.map(h=>h.id))+1 : 1;
            PPID_DATA.dasarHukum.push({ id:newId, nomor, judul, kategori });
            showToast('Dasar hukum berhasil ditambahkan!','success');
        }
        closeModal(); renderHukumTable();
    };

    // DELETE
    window.deleteHukum = function(id) {
        showConfirmModal('Hapus Dasar Hukum', 'Yakin ingin menghapus dasar hukum ini?', () => {
            PPID_DATA.dasarHukum = PPID_DATA.dasarHukum.filter(h=>h.id!==id);
            renderHukumTable();
            showToast('Dasar hukum berhasil dihapus','danger');
        });
    };

    // ========================================================================
    //  CONFIRMATION MODAL (replaces browser confirm())
    // ========================================================================
    window.showConfirmModal = function(title, message, onConfirm) {
        const html = `<p style="font-size:14px;color:#374151;margin-bottom:8px">${message}</p>
            <p style="font-size:12px;color:#9ca3af">Tindakan ini tidak dapat dibatalkan.</p>`;
        const footer = `<button class="btn btn-secondary" onclick="closeModal()">Batal</button>
            <button class="btn btn-danger" id="confirmDeleteBtn"><i class="fas fa-trash"></i> Hapus</button>`;
        showModal(title, html, footer);
        // Bind the confirm button after modal is shown
        setTimeout(() => {
            const btn = document.getElementById('confirmDeleteBtn');
            if (btn) btn.onclick = function() { closeModal(); onConfirm(); };
        }, 50);
    };

    // ========================================================================
    //  SETTINGS FORM
    // ========================================================================
    const formSettings = document.getElementById('formSettings');
    if (formSettings) {
        formSettings.addEventListener('submit', (e) => {
            e.preventDefault();
            PPID_DATA.adminProfile.nama = document.getElementById('settNama').value;
            PPID_DATA.adminProfile.nip = document.getElementById('settNip').value;
            PPID_DATA.adminProfile.jabatan = document.getElementById('settJabatan').value;
            PPID_DATA.adminProfile.email = document.getElementById('settEmail').value;
            PPID_DATA.adminProfile.telepon = document.getElementById('settTelepon').value;
            showToast('Profil berhasil disimpan!','success');
        });
    }

    // ============================================
    // INIT
    // ============================================
    updateDateTime();
    setInterval(updateDateTime, 60000);
    initPage('home');
})();
