document.addEventListener("DOMContentLoaded", function () {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert("Vui lòng đăng nhập để xem trang này!");
        window.location.href = "login.html";
    }
    loadMyBooks(userId);
});

async function loadMyBooks(userId) {
    try {
        const response = await fetch(`http://127.0.0.1:8080/api/rent/user/${userId}`);
        const data = await response.json();

        const tbody = document.getElementById('my-books-body');
        tbody.innerHTML = '';
        if (data.length == 0) {
            document.getElementById('no-data').style.display = 'block';
            return;
        }
        data.forEach(item => {
            const statusBadge = item.status === 'ONGOING' ? 'bg-success' : 'bg-secondary';
            tbody.innerHTML += `
            <tr>
                    <td class="fw-bold">${item.bookName}</td>
                    <td>${item.borrowDate}</td>
                    <td class="text-danger fw-bold">${item.dueDate}</td>
                    <td><span class="badge ${statusBadge}">${item.status}</span></td>
                </tr>
            `
        })
    } catch (error) {
        console.error("Lỗi: ", error);
    }
}