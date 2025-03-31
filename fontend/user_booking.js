async function checkRoomStatus() {
    const date = document.getElementById('booking_date').value.split('T')[0];
    const startTime = document.getElementById('start_time').value;
    const endTime = document.getElementById('end_time').value;

    const response = await fetch(`/check-room-status?date=${date}&startTime=${startTime}&endTime=${endTime}`);
    const roomStatuses = await response.json();

    displayRoomStatus(roomStatuses);
}

function displayRoomStatus(roomStatuses) {
    const tableBody = document.querySelector('#roomStatusTable tbody');
    tableBody.innerHTML = '';

    roomStatuses.forEach(room => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${room.name}</td>
            <td>${room.status}</td>
            <td><button class="bookButton" data-room-id="${room.id}" ${room.status === 'ไม่ว่าง' ? 'disabled' : ''}>จอง</button></td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('roomStatusTable').style.display = 'block';

    // เพิ่ม event listener สำหรับปุ่ม "จอง"
    const bookButtons = document.querySelectorAll('.bookButton');
    bookButtons.forEach(button => {
        button.addEventListener('click', bookRoom);
    });
}

async function bookRoom(event) {
    const roomId = event.target.dataset.roomId;
    const name = document.getElementById('name').value;
    const bookingDate = document.getElementById('booking_date').value;
    const startTime = document.getElementById('start_time').value;
    const endTime = document.getElementById('end_time').value;
    const title = document.getElementById('title').value;

    const response = await fetch('/tb_booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            Name: name,
            room_id: roomId,
            booking_date: bookingDate,
            start_time: startTime,
            end_time: endTime,
            title: title
        })
    });

    const result = await response.json();

    console.log(result);
    alert(JSON.stringify(result));

    // อัปเดตตารางสถานะห้องหลังจากจอง
    checkRoomStatus();
}

document.getElementById('bookingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // ป้องกันการส่งฟอร์มแบบปกติ (การจองจะทำเมื่อคลิกปุ่ม "จอง" ในตาราง)
});