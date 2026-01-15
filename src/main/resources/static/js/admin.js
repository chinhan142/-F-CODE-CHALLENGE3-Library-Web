let allRecords = [];

document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
        alert("Bạn không có quyền truy cập!");
        window.location.href = "index.html";
        return;
    }
    initAdminDashboard();
});

async function initAdminDashboard() {
    await Promise.all([
        loadBooksToDropdown(),
        loadAllHistory(),
        loadQuickStats()
    ]);
    console.log("Tất cả dữ liệu đã sẵn sàng!");
}

async function loadAllHistory() {
    try {
        const response = await fetch('http://127.0.0.1:8080/api/rent/all-history');
        const data = await response.json();

        allRecords = data;
        console.log("Đã nạp 7 bản ghi vào allRecords:", allRecords);

        renderTable(allRecords);
    } catch (error) {
        console.error("Lỗi loadAllHistory:", error);
    }
}

function filterRecords() {
    const selectedBookId = document.getElementById('bookSelector').value;
    console.log("Đang lọc theo mã sách:", selectedBookId);

    let filtered = [];
    if (selectedBookId === "ALL") {
        filtered = allRecords;
    } else {
        filtered = allRecords.filter(r => {
            const bid = r.bookId || (r.bookForRent && r.bookForRent.book && r.bookForRent.book.bookId);
            return String(bid) === String(selectedBookId);
        });
    }

    document.getElementById('statsInfo').innerText = `Tìm thấy: ${filtered.length} lượt mượn`;
    renderTable(filtered);
}

function renderTable(data) {
    const tbody = document.getElementById('borrow-history-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    data.forEach((r, index) => {
        const userName = r.username;
        const bookName = r.bookName;
        const bookDate = r.borrowDate;
        const status = r.status;
        const badgeClass = status === 'ONGOING' ? 'bg-success' : 'bg-secondary';
        const dueDate = r.dueDate;
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td class="fw-bold">${userName}</td>
                <td>${bookName}</td>
                <td>${bookDate}</td>
                <td class="text-danger fw-bold">${dueDate}</td>
                <td><span class="badge ${badgeClass}">${status}</span></td>
            </tr>
        `;
    });
}


async function loadBooksToDropdown() {
    const response = await fetch('http://127.0.0.1:8080/api/books');
    const books = await response.json();
    const selector = document.getElementById('bookSelector');
    books.forEach(book => {
        selector.innerHTML += `<option value="${book.bookId}">${book.bookName}</option>`;
    });
}

async function loadQuickStats() {
    const response = await fetch('http://127.0.0.1:8080/api/rent/book-stats');
    const stats = await response.json();
    const summaryDiv = document.getElementById('summary-stats');
    summaryDiv.innerHTML = '';
    stats.forEach(item => {
        summaryDiv.innerHTML += `
            <div class="p-3 border rounded bg-white shadow-sm text-center" style="min-width: 150px;">
                <div class="small text-muted text-truncate" style="max-width: 140px;">${item.bookName}</div>
                <div class="h4 mb-0 text-primary">${item.borrowCount}</div>
                <div class="small">lượt mượn</div>
            </div>`;
    });
}