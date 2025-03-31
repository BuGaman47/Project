document.addEventListener('DOMContentLoaded', function() {
    loadRooms(); // โหลดข้อมูลห้องเมื่อโหลดหน้าเสร็จ
});

// ดึงข้อมูลห้องจาก Backend
async function loadRooms() {
    try {
        const response = await axios.get('http://localhost:9999/tb_room');
        const rooms = response.data;

        const select = document.getElementById('roomSelect');
        rooms.forEach(room => {
            const option = new Option(`${room.name} (${room.capacity})`, room.id);
            option.dataset.rate = getRoomRate(room.name); // กำหนดราคาตามขนาดห้อง
            select.add(option);
        });
    } catch (error) {
        console.error('Error loading rooms:', error);
        alert('Failed to load rooms.');
    }
}

// กำหนดราคาตามขนาดห้อง (อิงตามภาพ)
function getRoomRate(roomName) {
    switch (roomName) {
        case 'ห้องขนาดเล็ก':
            return 500;
        case 'ห้องขนาดกลาง':
            return 1000;
        case 'ห้องขนาดใหญ่':
            return 1500;
        case 'ห้องขนาดใหญ่พิเศษ':
            return 2500;
        case 'ห้อง VIP':
            return 3500;
        default:
            return 500; // ราคาเริ่มต้นหากไม่ตรงกับเงื่อนไขใดๆ
    }
}

// ตรวจสอบสถานะห้องและคำนวณราคา
async function checkAvailability() {
    const date = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const roomId = document.getElementById('roomSelect').value;

    try {
        if (!date || !startTime || !endTime || !roomId) {
            alert('กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        const response = await axios.get(`http://localhost:9999/check-room-status?date=${date}&startTime=${startTime}&endTime=${endTime}&room_id=${roomId}`);
        const roomStatuses = response.data;

        if (roomStatuses && roomStatuses.length > 0) {
            const selectedRoom = roomStatuses[0]; // เลือกห้องแรกที่ได้

            if (selectedRoom) {
                const roomRate = document.querySelector(`#roomSelect option[value="${roomId}"]`).dataset.rate;
                displayStatus(selectedRoom.status === 'ว่าง', roomRate);
            } else {
                alert('ไม่พบข้อมูลห้อง');
            }
        } else {
            const roomRate = document.querySelector(`#roomSelect option[value="${roomId}"]`).dataset.rate;
            displayStatus(true, roomRate); // กำหนดสถานะว่างและราคาเริ่มต้น
            alert('ห้องว่าง');
        }
    } catch (error) {
        console.error('Error checking availability:', error);
        alert('Failed to check availability.');
    }
}

// แสดงผลลัพธ์
function displayStatus(available, rate) {
    const statusDiv = document.getElementById('availability-status');
    const priceDiv = document.getElementById('price');
    const confirmBtn = document.getElementById('confirmBtn');

    statusDiv.innerHTML = available ?
        `<span style="color:green">ห้องว่าง</span>` :
        `<span style="color:red">ห้องไม่ว่าง</span>`;

    if (available) {
        const start = document.getElementById('startTime').value;
        const end = document.getElementById('endTime').value;

        if (start && end) {
            const startHour = parseInt(start.split(':')[0]);
            const endHour = parseInt(end.split(':')[0]);

            if (!isNaN(startHour) && !isNaN(endHour)) { // ตรวจสอบว่าเป็นตัวเลขหรือไม่
                let diff = endHour - startHour;
                if (diff < 0) {
                    diff = 0; // หรือแสดงข้อความผิดพลาด
                }
                const totalPrice = diff * rate;

                priceDiv.textContent = `ราคารวม: ${totalPrice} บาท`;
                confirmBtn.disabled = false;
            } else {
                priceDiv.textContent = 'เวลาไม่ถูกต้อง';
                confirmBtn.disabled = true;
            }
        } else {
            priceDiv.textContent = 'กรุณาระบุเวลาเริ่มและสิ้นสุด';
            confirmBtn.disabled = true;
        }
    } else {
        priceDiv.textContent = '';
        confirmBtn.disabled = true;
    }
}

// ยืนยันการจอง
async function confirmBooking() {
    const name = document.getElementById('userName').value;
    const roomId = document.getElementById('roomSelect').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const title = document.getElementById('title').value;

    try {
        const bookingData = {
            Name: name,
            room_id: roomId,
            booking_date: bookingDate,
            start_time: startTime,
            end_time: endTime,
            title: title
        };

        const response = await axios.post('http://localhost:9999/tb_booking', bookingData);
        alert(response.data.message);
        // หลังจากจองสำเร็จ อาจจะรีโหลดข้อมูลหรือเคลียร์ฟอร์ม
    } catch (error) {
        console.error('Error booking room:', error);
        alert('Failed to book room.');
    }
}