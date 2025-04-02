const BASE_URL = 'http://localhost:9999';
let mode = 'CREATE';
let selectedID = null;

window.onload = async () => {
    await loadData();
    await checkEditMode();
};

// โหลดข้อมูลทั้งหมด
const loadData = async () => {
    console.log("User page loaded");
    try {
        const response = await axios.get(`${BASE_URL}/tb_booking`);
        const bookingDOM = document.getElementById('booking');
        let htmlData = '';
        
        response.data.forEach(booking => {
            htmlData += `
                <tr>
                    <td>${booking.id}</td>
                    <td>${booking.Name}</td>
                    <td>${booking.room_id}</td>
                    <td>${booking.booking_date}</td>
                    <td>${booking.start_time}</td>
                    <td>${booking.end_time}</td>
                    <td>${booking.title}</td>
                    <td>
                        <a href="user_bk.html?id=${booking.id}">
                            <button>Edit</button>
                        </a>
                        <button class="delete-booking" data-id="${booking.id}">Delete</button>
                    </td>
                </tr>
            `;
        });

        bookingDOM.innerHTML = htmlData;

        // เพิ่มฟังก์ชันลบ
        document.querySelectorAll('.delete-booking').forEach(button => {
            button.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                if (!confirm(`คุณต้องการลบ Booking ID: ${id} ใช่หรือไม่?`)) return;

                try {
                    await axios.delete(`${BASE_URL}/tb_booking/${id}`);
                    alert(`Booking ID: ${id} ถูกลบแล้ว`);
                    loadData();
                } catch (error) {
                    console.error('Error deleting booking:', error);
                    alert('เกิดข้อผิดพลาดในการลบข้อมูล');
                }
            });
        });

    } catch (error) {
        console.error('Error loading user:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
};

// ตรวจสอบว่าอยู่ในโหมดแก้ไขหรือไม่
const checkEditMode = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        mode = 'EDIT';
        selectedID = id;
        await loadBookingData(id);
    }
};

// โหลดข้อมูลการจอง
const loadBookingData = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/tb_booking/${id}`);
        const booking = response.data;
        document.getElementById('Name').value = booking.Name;
        document.getElementById('room_id').value = booking.room_id;
        document.getElementById('booking_date').value = booking.booking_date;
        document.getElementById('start_time').value = booking.start_time;
        document.getElementById('end_time').value = booking.end_time;
        document.getElementById('title').value = booking.title;
    } catch (error) {
        console.error('Error loading booking data:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลการจอง');
    }
};

// ส่งข้อมูลการจองไปบันทึก
const submitData = async () => {
    let NameDOM = document.querySelector('input[name=Name]');
    let room_idDOM = document.querySelector('input[name=room_id]');
    let booking_dateDOM = document.querySelector('input[name=booking_date]');
    let start_timeDOM = document.querySelector('input[name=start_time]');
    let end_timeDOM = document.querySelector('input[name=end_time]');
    let titleDOM = document.querySelector('input[name=title]');
    
    let messageDOM = document.getElementById('message');
    
    try {
        let bookingData = {
            Name: NameDOM.value,
            room_id: room_idDOM.value,
            booking_date: booking_dateDOM.value,
            start_time: start_timeDOM.value,
            end_time: end_timeDOM.value,
            title: titleDOM.value
        };

        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/tb_booking`, bookingData);
            alert('บันทึกข้อมูลการจองเรียบร้อยแล้ว');
        } else if (mode === 'EDIT') {
            await axios.put(`${BASE_URL}/tb_booking/${selectedID}`, bookingData);
            alert('แก้ไขข้อมูลการจองเรียบร้อยแล้ว');
        }

        window.location.href = 'user_bk.html';
    } catch (error) {
        console.error('Error saving booking data:', error);
        messageDOM.textContent = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
    }
};

// ✅ โหลดข้อมูลห้องที่สามารถจองได้
const loadAvailableRooms = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/available-rooms`);
        const roomSelect = document.getElementById('room_id');
        roomSelect.innerHTML = '<option value="">-- เลือกห้อง --</option>';

        response.data.forEach(room => {
            const option = document.createElement('option');
            option.value = room.id;
            option.textContent = room.name;
            roomSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading available rooms:', error);
        alert('เกิดข้อผิดพลาดในการโหลดข้อมูลห้องที่สามารถจองได้');
    }
};



// ✅ กำหนด event ให้ปุ่ม "ยืนยันการจอง"
const submitButton = document.getElementById('submit-booking');
if (submitButton) {
    submitButton.addEventListener('click', submitData);
}
