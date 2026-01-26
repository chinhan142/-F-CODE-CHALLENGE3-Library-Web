document.addEventListener("DOMContentLoaded", function () {
    fetchBooks();
    checkLoginStatus();
});

async function fetchBooks() {
    const carouselInner = document.getElementById('dynamic-carousel-inner');
    try {
        const response = await fetch('http://localhost:8080/api/books');
        const books = await response.json();
        if (books.length == 0) {
            carouselInner.innerHTML = '<div class="text-center p-5">Thư viện hiện tại đang trống.</div>'
            return;
        }
        carouselInner.innerHTML = '';
        for (let i = 0; i < books.length; i += 4) {
            const activeClass = i === 0 ? 'active' : '';
            const bookGroup = books.slice(i, i + 4);
            let slideHtml = `
                <div class="carousel-item ${activeClass}">
                    <div class="row justify-content-center">
                        ${bookGroup.map(book => createBookCard(book)).join('')}
                    </div>
                </div>
            `
            carouselInner.innerHTML += slideHtml;
        }
    } catch (error) {
        console.error("Lỗi kết nối Backend: ", error);
        carouselInner.innerHTML = '<div class="text-center p-5 text-danger">Không thể kết nối tới máy chủ</div>'
    }
}

function createBookCard(book) {
    const imgPath = book.imageUrl || book.image_url || book.imageURL;
    return `
    <div class="col-md-3 mb-3">
        <div class="card featured-card h-100 shadow-sm border-0">
            <!-- Sửa src ở đây để dùng imgPath -->
            <div class="position-relative" style="height: 300px; overflow: hidden; border-radius: 8px 8px 0 0;">
                <img src="${imgPath}" 
                     class="card-img-top w-100 h-100" 
                     style="object-fit: cover;" 
                     onerror="this.src='https://via.placeholder.com/200x300?text=Error+Image'"
                     alt="${book.bookName}">
            </div>
            <div class="card-body text-center d-flex flex-column">
                <h6 class="card-title fw-bold text-truncate">${book.bookName}</h6>
                <p class="card-text text-muted small mb-3">${book.author}</p>
                <div class="mt-auto d-flex justify-content-center gap-2">
                    <a href="books.html?id=${book.bookId}" class="btn btn-outline-primary btn-sm px-3">Xem</a>
                    <button onclick="borrowBook('${book.bookId}')" class="btn btn-success btn-sm px-3">Mượn</button>
                </div>
            </div>
        </div>
    </div>
    `;
}

function borrowBook(bookId) {
    alert("Chức năng mượn sách đang được xây dựng cho mã: " + bookId);
}

function checkLoginStatus() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const loginItem = document.getElementById('login-item');

    if (username && loginItem) {
        const myBooksLink = `<a href="my-books.html" class="btn btn-outline-info btn-sm me-2">Sách của tôi</a>`;
        let adminLink = "";
        if (role && role.toUpperCase() === "ADMIN") {
            adminLink = `
        <a href="add-book.html" class="btn btn-warning btn-sm me-2 fw-bold">+ Nhập Sách</a>
        <a href="admin.html" class="btn btn-outline-warning btn-sm me-3">Dashboard</a>
            `;
        }
        loginItem.innerHTML = `
            <div class="d-flex align-items-center">
                ${adminLink}
                <a href="my-books.html" class="btn btn-outline-info btn-sm me-3">Sách của tôi</a>
                <span class="text-white me-3 small">
                    <i class="fas fa-user-circle me-1 text-info"></i>Chào, <b>${username}</b>
                </span>
                <button onclick="logout()" class="btn btn-sm btn-danger px-3 shadow-sm">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

async function borrowBook(bookId) {
    let userId = localStorage.getItem('userId');
    if (!userId || userId === "undefined") {
        alert("Phiên đăng nhập hết hạn hoặc lỗi. Vui lòng đăng nhập lại!");
        localStorage.clear();
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch('http://127.0.0.1:8080/api/rent/borrow', {
            method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
                userId: userId, bookId: bookId
            })
        });
        const result = await response.json();
        if (response.ok) {
            const transactionId = result.rentId || result.rentID || result.rentid || result.id;
            alert("Mượn sách thành công! Mã giao dịch: " + transactionId);
            location.reload();
        } else {
            alert("Không thể mượn: " + result.message);
        }

    } catch (e) {
        alert("Không thể kết nối tới máy chủ để mượn sách!");
    }
}

