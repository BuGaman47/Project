document.addEventListener('DOMContentLoaded', function() {
    // ดึงปุ่มเมนูและเมนู
    const menuButton = document.querySelector('.menu-button');
    const nav = document.querySelector('.nav');

    // เมื่อคลิกปุ่มเมนู
    menuButton.addEventListener('click', function() {
        // สลับการแสดงผลของเมนู
        if (nav.style.display === 'flex') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
        }
    });

    // ป้องกันไม่ให้เมนูหายไปเมื่อขยายหน้าจอ
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            nav.style.display = 'flex';
        } else {
            nav.style.display = 'none';
        }
    });

    // เพิ่มฟังก์ชันการจองห้อง
    const bookButtons = document.querySelectorAll('.book-button');

    bookButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // ดึงข้อมูลห้องจาก card
            const roomCard = button.closest('.room-card');
            const roomName = roomCard.querySelector('h3').textContent;

            // แสดงข้อความยืนยัน
            alert('คุณได้จอง ' + roomName + ' แล้ว!');

            // คุณสามารถเพิ่มโค้ดสำหรับการส่งข้อมูลการจองไปยังเซิร์ฟเวอร์ได้ที่นี่
        });
    });
});