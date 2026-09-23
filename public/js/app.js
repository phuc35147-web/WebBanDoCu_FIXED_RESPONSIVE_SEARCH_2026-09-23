// --- 1. XỬ LÝ ĐÓNG/MỞ MODAL & FORM ĐĂNG NHẬP/ĐĂNG KÝ ---
function showAuthLogin(e) {
    if (e) e.preventDefault();
    document.getElementById('loginPanel').classList.remove('d-none');
    document.getElementById('registerPanel').classList.add('d-none');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('authModal')).show();
}

function updateAuthUI() {
    const loginButton = document.getElementById('loginButton');
    const accountDropdown = document.getElementById('accountDropdown');

    const accountName = document.getElementById('accountName');
    const accountAvatar = document.getElementById('accountAvatar');

    const accountMenuName = document.getElementById('accountMenuName');
    const accountMenuEmail = document.getElementById('accountMenuEmail');
    const accountAvatarMenu = document.getElementById('accountAvatarMenu');

    const postButton = document.getElementById('btnPostForm');

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch (error) {
        console.error('Lỗi đọc thông tin tài khoản:', error);
        localStorage.removeItem('user');
    }

    const token = localStorage.getItem('token');

    // ==============================
    // CHƯA ĐĂNG NHẬP
    // ==============================
    if (!token || !user) {

        if (loginButton) {
            loginButton.style.display = 'inline-flex';
        }

        if (accountDropdown) {
            accountDropdown.style.display = 'none';
            accountDropdown.classList.remove('open');
        }

        if (postButton) {
            postButton.style.display = 'none';
        }

        return;
    }

    // ==============================
    // ĐÃ ĐĂNG NHẬP
    // ==============================

    // Ẩn nút Đăng nhập
    if (loginButton) {
        loginButton.style.display = 'none';
    }

    // Hiện khu vực Tài khoản
    if (accountDropdown) {
        accountDropdown.style.display = 'block';
    }

    // Lấy tên người dùng
    const name = user.hoTen || user.HoTen || user.name || 'Tài khoản';

    // Lấy email
    const email = user.email || user.Email || '';

    // Chữ cái đầu làm avatar
    const firstLetter = name
        .trim()
        .charAt(0)
        .toUpperCase() || 'P';

    // Tên trên Header
    if (accountName) {
        accountName.textContent = name;
    }

    // Avatar trên Header
    if (accountAvatar) {
        accountAvatar.textContent = firstLetter;
    }

    // Tên trong menu
    if (accountMenuName) {
        accountMenuName.textContent = name;
    }

    // Email trong menu
    if (accountMenuEmail) {
        accountMenuEmail.textContent = email;
    }

    // Avatar trong menu
    if (accountAvatarMenu) {
        accountAvatarMenu.textContent = firstLetter;
    }

    // Hiển thị nút Đăng bài nếu là người bán/admin
    if (postButton) {
        const role = String(
            user.vaiTro ||
            user.VaiTro ||
            user.role ||
            ''
        ).toLowerCase();

        postButton.style.display =
            role === 'seller' ||
            role === 'admin' ||
            role === 'nguoi_ban'
                ? 'inline-block'
                : 'none';
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Đóng menu tài khoản nếu đang mở
    const accountDropdown = document.getElementById('accountDropdown');

    if (accountDropdown) {
        accountDropdown.classList.remove('open');
    }

    // Quay về trang chủ
    window.location.href = '/index.html';
}
// ============================================
// XỬ LÝ MENU TÀI KHOẢN
// ============================================

function initAccountDropdown() {

    const accountButton = document.getElementById('accountButton');
    const accountDropdown = document.getElementById('accountDropdown');

    if (!accountButton || !accountDropdown) {
        return;
    }

    // Click nút Tài khoản
    accountButton.addEventListener('click', function (e) {

        e.stopPropagation();

        accountDropdown.classList.toggle('open');

    });

    // Click bên ngoài thì đóng menu
    document.addEventListener('click', function (e) {

        if (!accountDropdown.contains(e.target)) {
            accountDropdown.classList.remove('open');
        }

    });

}

function showAuthRegister(e) {
    if (e) e.preventDefault();
    document.getElementById('loginPanel').classList.add('d-none');
    document.getElementById('registerPanel').classList.remove('d-none');
    showRegistrationPhoneStep();
    bootstrap.Modal.getOrCreateInstance(document.getElementById('authModal')).show();
}

function showRegistrationPhoneStep(e) {
    if (e) e.preventDefault();
    document.getElementById('registerPhoneForm').classList.remove('d-none');
    document.getElementById('registerForm').classList.add('d-none');
}

async function handleRegistrationPhone(e) {
    e.preventDefault();
    try {
        const phone = document.getElementById('registerPhone').value.trim();
        const response = await fetch('/api/auth/check-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ soDienThoai: phone })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Không thể kiểm tra số điện thoại.');
        if (data.exists) return alert('Số điện thoại này đã được đăng ký.');
        document.getElementById('registrationPhoneVerified').value = phone;
        document.getElementById('registerPhoneForm').classList.add('d-none');
        document.getElementById('registerForm').classList.remove('d-none');
    } catch (error) {
        alert(error.message);
    }
}

// --- 2. XỬ LÝ ĐĂNG NHẬP / ĐĂNG KÝ ---
async function handleLogin(e) {
    e.preventDefault();
    const button = e.submitter;
    if (button) button.disabled = true;
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: document.getElementById('loginIdentifier').value.trim(),
                matKhau: document.getElementById('loginPass').value
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại.');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        bootstrap.Modal.getOrCreateInstance(document.getElementById('authModal')).hide();
        location.reload();
    } catch (error) {
        alert(error.message);
    } finally {
        if (button) button.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const button = e.submitter;
    if (button) button.disabled = true;
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hoTen: document.getElementById('registerName').value.trim(),
                email: document.getElementById('registerEmail').value.trim(),
                soDienThoai: document.getElementById('registrationPhoneVerified').value.trim(),
                matKhau: document.getElementById('registerPass').value,
                tinhThanh: document.querySelector('#registerProvince option:checked')?.textContent,
                quanHuyen: null,
                phuongXa: document.querySelector('#registerWard option:checked')?.textContent,
                diaChiChiTiet: document.getElementById('registerAddress').value.trim()
            })
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Đăng ký thất bại.');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Đăng ký thành công.');
        location.reload();
    } catch (error) {
        alert(error.message);
    } finally {
        if (button) button.disabled = false;
    }
}

function handleSellerRegistration(e) {
    e.preventDefault();
    alert("Hồ sơ cửa hàng đã được gửi! Chờ admin duyệt.");
    let modal = bootstrap.Modal.getInstance(document.getElementById('sellerModal'));
    modal.hide();
}

function handlePostProduct(e) {
    e.preventDefault();
    alert("Đăng tin rao bán thành công!");
    let modal = bootstrap.Modal.getInstance(document.getElementById('postModal'));
    modal.hide();
}

function handleSocialLogin(provider) {
    alert(`Chức năng đăng nhập bằng ${provider} đang được phát triển.`);
}

function handleSocialRegister(provider) {
    alert(`Chức năng đăng ký bằng ${provider} đang được phát triển.`);
}

// --- 3. TÌM KIẾM ---
function searchTag(tag) {
    document.getElementById('searchKeyword').value = tag;
    fetchProducts();
}
// --- 4. GỌI API TỈNH/THÀNH PHỐ VIỆT NAM (Tự động) ---
async function loadProvinces(selectId) {
    try {
        const res = await fetch('https://provinces.open-api.vn/api/v2/p/');
        const data = await res.json();
        const select = document.getElementById(selectId);
        if (!select) return;
        select.innerHTML = '<option value="">Chọn Tỉnh/Thành phố</option>';
        data.forEach(p => {
            select.innerHTML += `<option value="${p.code}">${p.name}</option>`;
        });
    } catch (err) {
        console.error("Lỗi tải tỉnh thành:", err);
    }
}

async function loadWards(provinceCode, wardSelectId) {
    if (!provinceCode) return;
    try {
        const res = await fetch(`https://provinces.open-api.vn/api/v2/p/${provinceCode}?depth=2`);
        const data = await res.json();
        const select = document.getElementById(wardSelectId);
        if (!select) return;

        // API v2 sau sáp nhập 07/2025 trả danh sách phường/xã trực tiếp ở data.wards.
        let wards = Array.isArray(data.wards) ? data.wards : [];

        // Fallback cho cấu trúc API cũ nếu còn dữ liệu districts/wards.
        if (!wards.length && Array.isArray(data.districts)) {
            data.districts.forEach(d => (d.wards || []).forEach(w => {
                wards.push({ ...w, district_name: d.name });
            }));
        }

        select.innerHTML = '<option value="">Chọn Phường/Xã</option>';
        wards.sort((a, b) => a.name.localeCompare(b.name, 'vi')).forEach(w => {
            select.innerHTML += `<option value="${w.code}">${w.name}</option>`;
        });
        select.disabled = wards.length === 0;
    } catch (err) {
        console.error("Lỗi tải quận huyện:", err);
    }
}

// --- 5. RENDER DỮ LIỆU SẢN PHẨM VÀ COUNTDOWN ---
function startCountdown() {
    let h = 8, m = 45, s = 12;
    setInterval(() => {
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; }
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('minutes').innerText = m.toString().padStart(2, '0');
        document.getElementById('seconds').innerText = s.toString().padStart(2, '0');
    }, 1000);
}

async function fetchProducts() {
    const dealList = document.getElementById('productList');
    const allList = document.getElementById('allProductList');
    if (!dealList && !allList) return;
    try {
        const keyword = document.getElementById('searchKeyword')?.value.trim() || '';
        const response = await fetch(`/api/products?${new URLSearchParams({ keyword })}`);
        if (!response.ok) throw new Error('Không thể tải danh sách sản phẩm.');
        const products = await response.json();
        const renderProducts = items => items.length ? items.map(product => `
            <div class="col-6 col-md-3 mb-4">
                <a href="/product-detail.html?id=${encodeURIComponent(product.MaSanPham)}" class="text-decoration-none text-dark">
                    <div class="card product-card h-100 shadow-sm">
                        <img src="${product.HinhAnh || '/uploads/default.jpg'}" class="card-img-top product-img" alt="${product.TenSanPham}">
                        <div class="card-body">
                            <span class="badge badge-condition mb-2">${product.TenDanhMuc}</span>
                            <h6 class="card-title text-truncate fw-bold">${product.TenSanPham}</h6>
                            <p class="price-tag mb-1 text-danger fw-bold">${Number(product.GiaBan).toLocaleString('vi-VN')} đ</p>
                            <small class="text-muted"><i class="bi bi-person me-1"></i>${product.TenNguoiBan || 'Người bán'}</small>
                        </div>
                    </div>
                </a>
            </div>`).join('') : '<div class="col-12 text-center text-muted py-5">Chưa có sản phẩm nào phù hợp.</div>';
        if (dealList) dealList.innerHTML = renderProducts(products.slice(0, 5));
        if (allList) allList.innerHTML = renderProducts(products.slice(5));
    } catch (error) {
        console.error(error);
        if (dealList) dealList.innerHTML = '<div class="col-12 text-center text-danger py-5">Không thể tải danh sách sản phẩm.</div>';
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggleSeoBtn');
    const wrapper = document.getElementById('seoContentWrapper');
    const icon = document.getElementById('toggleSeoIcon');

    if (toggleBtn && wrapper) {
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = wrapper.classList.contains('collapsed');

            if (isCollapsed) {
                // Mở rộng văn bản
                wrapper.classList.remove('collapsed');
                wrapper.classList.add('expanded');
                toggleBtn.querySelector('span').textContent = 'Thu gọn';
                if (icon) {
                    icon.classList.remove('bi-chevron-down');
                    icon.classList.add('bi-chevron-up');
                }
            } else {
                // Thu gọn văn bản lại
                wrapper.classList.remove('expanded');
                wrapper.classList.add('collapsed');
                toggleBtn.querySelector('span').textContent = 'Xem thêm';
                if (icon) {
                    icon.classList.remove('bi-chevron-up');
                    icon.classList.add('bi-chevron-down');
                }

                // Cuộn mượt về đầu phần giới thiệu để người dùng không bị mất vị trí
                wrapper.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
});
// Khởi chạy mọi thứ khi trang đã tải xong
document.addEventListener("DOMContentLoaded", () => {

    // Cho phép nhấn Enter trong ô tìm kiếm để tìm sản phẩm.
    const searchInput = document.getElementById('searchKeyword');
    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchProducts();
            }
        });
    }

    startCountdown();

    fetchProducts();

    // Kiểm tra trạng thái đăng nhập
    updateAuthUI();

    // Khởi tạo menu Tài khoản
    initAccountDropdown();

    // Nạp API Tỉnh Thành
    loadProvinces('registerProvince');
    loadProvinces('sellerProvince');

    const registerProvince = document.getElementById('registerProvince');

    if (registerProvince) {

        registerProvince.addEventListener('change', function () {

            loadWards(
                this.value,
                'registerWard'
            );

        });

    }

    const sellerProvince = document.getElementById('sellerProvince');

    if (sellerProvince) {

        sellerProvince.addEventListener('change', function () {

            loadWards(
                this.value,
                'sellerWard'
            );

        });

    }

});
    
