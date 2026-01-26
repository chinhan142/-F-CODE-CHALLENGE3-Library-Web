document.addEventListener("DOMContentLoaded", async function () {
    // 1. Lấy ID từ URL (ví dụ: ?id=10)
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    if (!bookId) {
        alert("Không tìm thấy mã sách!");
        window.location.href = "admin.html";
        return;
    }

    // 2. Fetch thông tin sách từ Server để điền vào Form
    try {
        const response = await fetch(`http://localhost:8080/api/books/${bookId}`);
        if (response.ok) {
            const book = await response.json();

            // Đổ dữ liệu vào các ô input (phải khớp ID với HTML)
            document.getElementById('bookId').value = book.bookId;
            document.getElementById('bookId').readOnly = true; // Khóa mã sách, không cho sửa ID

            document.getElementById('bookName').value = book.bookName;
            document.getElementById('author').value = book.author;
            document.getElementById('category').value = book.category;
            document.getElementById('publishDate').value = book.publishDate;
            document.getElementById('quantity').value = book.quantity;
            document.getElementById('imageUrl').value = book.imageUrl;
        } else {
            alert("Lỗi: Không tìm thấy sách này trên hệ thống!");
        }
    } catch (error) {
        console.error("Lỗi khi load dữ liệu sách:", error);
    }

    // 3. Xử lý sự kiện khi bấm nút LƯU SÁCH (Sửa thành PUT)
    const form = document.getElementById('addBookForm');
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const updatedData = {
            bookName: document.getElementById('bookName').value,
            author: document.getElementById('author').value,
            category: document.getElementById('category').value,
            publishDate: document.getElementById('publishDate').value,
            quantity: parseInt(document.getElementById('quantity').value),
            imageUrl: document.getElementById('imageUrl').value
        };

        try {
            const resp = await fetch(`http://localhost:8080/api/books/${bookId}`, {
                method: 'PUT', // Dùng PUT để sửa
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(updatedData)
            });

            if (resp.ok) {
                alert("Cập nhật sách thành công!");
                window.location.href = "admin.html"; // Quay lại dashboard
            } else {
                alert("Cập nhật thất bại. Vui lòng kiểm tra lại!");
            }
        } catch (error) {
            alert("Lỗi kết nối server!");
        }
    });
});