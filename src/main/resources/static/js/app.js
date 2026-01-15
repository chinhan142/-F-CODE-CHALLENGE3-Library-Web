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
            <div class="card featured-card h-100">
                <img src="https://via.placeholder.com/150x200?text=Book" class="card-img-top" alt="${book.bookName}">
                <div class="card-body text-center d-flex flex-column">
                    <h5 class="card-title">${book.bookName}</h5>
                    <p class="card-text text-muted small">${book.author}</p>
                    <div class="mt-auto">
                        <a href="books.html?id=${book.bookId}" class="btn btn-outline-primary btn-sm">Xem</a>
                        <button onclick="borrowBook('${book.bookId}')" class="btn btn-success btn-sm">Mượn</button>
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
            adminLink = `<a href="admin.html" class="btn btn-outline-warning btn-sm me-3">Quản trị</a>`;
        }
        loginItem.innerHTML = `
            <div class="d-flex align-item-center">
                ${adminLink}
                <span class="nav-link text-warning me-2">Chào, ${username}</span>
                <button onclick="logout()" class="btn btn-outline-danger btn-sm">Đăng xuất</button>
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
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: userId,
                bookId: bookId
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

