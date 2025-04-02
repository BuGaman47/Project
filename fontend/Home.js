document.addEventListener('DOMContentLoaded', function() {
// เรียกฟังก์ชัน updateRoomStatus เมื่อหน้าเว็บโหลดเสร็จ
    updateRoomStatus();

    // ตั้งค่าให้เรียกฟังก์ชัน updateRoomStatus ทุกๆ 5 วินาที
    setInterval(updateRoomStatus, 1000);

    // ใช้ event delegation เพื่อรองรับปุ่มที่เพิ่มใหม่
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('book-button')) {
            const roomCard = event.target.closest('.room-card');
            if (roomCard) {
                const roomName = roomCard.querySelector('h3').textContent;
                alert('คุณได้จอง ' + roomName + ' แล้ว!');
                window.location.href = 'user_bk.html';
            }
        }
    });
});

// ฟังก์ชันอัปเดตสถานะห้อง
function updateRoomStatus() {
    fetch('http://localhost:9999/check-room-status')
        .then(response => response.json())
        .then(data => {
            if (data.available !== undefined && data.unavailable !== undefined && data.total !== undefined) {
                document.querySelector('.status-number.available').textContent = data.available;
                document.querySelector('.status-number.unavailable').textContent = data.unavailable;
                document.querySelector('.status-number.total').textContent = data.total;
            } else {
                console.error("ข้อมูลสถานะห้องไม่สมบูรณ์:", data);
            }
        })
        .catch(error => {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสถานะห้อง:", error);
        });
}
