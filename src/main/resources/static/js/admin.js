let allHistory = []; // Lưu trữ dữ liệu lịch sử mượn
let allBooks = [];   // Lưu trữ dữ liệu kho sách

document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập!");
        window.location.href = "index.html";
        return;
    }

    // Kiểm tra nếu đang ở trang Admin Dashboard (có bảng history)
    const historyTable = document.getElementById('borrow-history-body');
    if (historyTable) {
        initAdminDashboard();
    }

    // KIỂM TRA VÀ LẮNG NGHE FORM THÊM SÁCH (Phần bị thiếu)
    const addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function (event) {
            event.preventDefault();
            addBook(); // Gọi hàm thêm sách
        });
    }
});

async function initAdminDashboard() {
    // Chạy song song các tiến trình load dữ liệu
    await Promise.all([
        loadInventory(),
        loadAllHistory(),
        loadQuickStats()
    ]);
}

// ======================== QUẢN LÝ KHO SÁCH (INVENTORY) ========================

async function loadInventory() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/books');
        allBooks = await response.json();
        renderInventoryTable(allBooks);
    } catch (error) {
        console.error("Lỗi load kho sách:", error);
    }
}

function filterInventory() {
    const nameVal = document.getElementById('invSearchName').value.toLowerCase();
    const catVal = document.getElementById('invSearchCategory').value.toLowerCase();

    const filtered = allBooks.filter(book => {
        const matchesName = book.bookName.toLowerCase().includes(nameVal);
        const matchesCat = (book.category || "").toLowerCase().includes(catVal);
        return matchesName && matchesCat;
    });
    renderInventoryTable(filtered);
}

function renderInventoryTable(data) {
    const tbody = document.getElementById('book-manage-body');
    if (!tbody) return;
    tbody.innerHTML = data.map(book => `
        <tr>
            <td><img src="${book.imageUrl || 'https://via.placeholder.com/50'}" width="35" height="50" style="object-fit:cover"></td>
            <td class="fw-bold small">${book.bookId}</td>
            <td class="text-start small">${book.bookName}</td>
            <td><span class="badge bg-light text-primary border">${book.category || 'N/A'}</span></td>
            <td>${book.quantity}</td>
            <td>
                <div class="btn-group shadow-sm">
                    <button onclick="goToEditPage('${book.bookId}')" class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteBook('${book.bookId}')" class="btn btn-sm btn-outline-danger"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ======================== LỊCH SỬ MƯỢN TRẢ (HISTORY) ========================

async function loadAllHistory() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/rent/all-history');
        allHistory = await response.json();
        renderHistoryTable(allHistory);
    } catch (error) {
        console.error("Lỗi loadAllHistory:", error);
    }
}

function filterHistory() {
    const query = document.getElementById('historySearch').value.toLowerCase();
    const filtered = allHistory.filter(r =>
        r.username.toLowerCase().includes(query) || r.bookName.toLowerCase().includes(query)
    );
    renderHistoryTable(filtered);
}

function renderHistoryTable(data) {
    const tbody = document.getElementById('borrow-history-body');
    if (!tbody) return;
    tbody.innerHTML = data.map((r, index) => `
        <tr>
            <td>${index + 1}</td>
            <td class="fw-bold text-dark small">${r.username}</td>
            <td class="small">${r.bookName}</td>
            <td class="small">${r.borrowDate}</td>
            <td class="text-danger fw-bold small">${r.dueDate}</td>
            <td><span class="badge ${r.status === 'ONGOING' ? 'bg-success' : 'bg-secondary'}">${r.status}</span></td>
        </tr>
    `).join('');
}

// ======================== THỐNG KÊ & CHỨC NĂNG KHÁC ========================

async function loadQuickStats() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/rent/book-stats');
        const stats = await response.json();
        const summaryDiv = document.getElementById('summary-stats');
        summaryDiv.innerHTML = stats.map(item => `
            <div class="p-3 border rounded bg-white shadow-sm text-center" style="min-width: 160px;">
                <div class="small text-muted text-truncate mb-1" style="max-width: 140px;">${item.bookName}</div>
                <div class="h4 mb-0 text-primary fw-bold">${item.borrowCount}</div>
                <div class="small text-muted">lượt mượn</div>
            </div>`).join('');
    } catch (e) { console.error(e); }
}

function goToEditPage(bookId) {
    window.location.href = `edit-book.html?id=${bookId}`;
}

async function deleteBook(bookId) {
    if (confirm(`Bạn chắc chắn muốn xóa sách [${bookId}]? Lịch sử liên quan sẽ bị xóa sạch!`)) {
        try {
            const response = await fetch(`http://127.0.0.1:8080/api/books/${bookId}`, { method: 'DELETE' });
            const result = await response.json();
            alert(result.message);
            if (response.ok) loadInventory();
        } catch (error) { alert("Lỗi khi kết nối để xóa!"); }
    }
}

// ======================== CHỨC NĂNG THÊM SÁCH MỚI ========================
async function addBook() {
    // Lấy dữ liệu từ các ô Input
    const bookData = {
        bookId: document.getElementById('bookId').value,
        bookName: document.getElementById('bookName').value,
        author: document.getElementById('author').value,
        category: document.getElementById('category').value,
        publishDate: document.getElementById('publishDate').value,
        quantity: parseInt(document.getElementById('quantity').value),
        imageUrl: document.getElementById('imageUrl').value
    };

    try {
        const response = await fetch('http://127.0.0.1:8080/api/books/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(bookData)
        });

        const data = await response.json();
        if (response.ok) {
            alert("Thêm sách thành công: " + (data.bookName || "Sách mới"));
            document.getElementById('addBookForm').reset();
            window.location.href = "admin.html"; // Thêm xong quay về dashboard
        } else {
            let errorMsg = data.message || data.error || "Lỗi không xác định";
            alert("Không thể lưu: " + errorMsg);
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        alert("Lỗi: Không thể kết nối tới máy chủ!");
    }
}