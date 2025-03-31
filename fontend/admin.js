const BASE_URL = 'http://localhost:9999';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log("user page loaded");
    try {
        const response = await axios.get(`${BASE_URL}/tb_booking`);
        const bookingDOM = document.getElementById('booking');
        let htmlData = '';
        for (let i = 0; i < response.data.length; i++) {
            let booking = response.data[i];
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
        }
        bookingDOM.innerHTML = htmlData;

        const responses = await axios.get(`${BASE_URL}/tb_room`);
        const roomDOM = document.getElementById('room');
        let roomsData = '';
        for (let i = 0; i < responses.data.length; i++) {
            let room = responses.data[i];
            roomsData += `
                <tr>
                    <td>${room.id}</td>
                    <td>${room.name}</td>
                    <td>${room.capacity}</td>
                    <td>${room.status}</td>
                    <td>
                        <a href="user_bk.html?id=${room.id}">
                            <button>Edit</button>
                        </a>
                        <button class="delete-room" data-id="${room.id}">Delete</button>
                    </td>
                </tr>
            `;
        }
        roomDOM.innerHTML = roomsData;

        const response_u = await axios.get(`${BASE_URL}/tb_user`);
        const userDOM = document.getElementById('user');
        let usersData = '';
        for (let i = 0; i < response_u.data.length; i++) {
            let user = response_u.data[i];
            usersData += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.password}</td>
                    <td>${user.role}</td>
                    <td>${user.Tel}</td>
                    <td>${user.created_at}</td>
                    <td>
                        <a href="user_bk.html?id=${user.id}">
                            <button>Edit</button>
                        </a>
                        <button class="delete-user" data-id="${user.id}">Delete</button>
                    </td>
                </tr>
            `;
        }
        userDOM.innerHTML = usersData;

        // ✅ ลบ Booking พร้อมแจ้งเตือน
        const deleteBookingDOMs = document.getElementsByClassName('delete-booking');
        for (let i = 0; i < deleteBookingDOMs.length; i++) {
            deleteBookingDOMs[i].addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                const confirmDelete = confirm(`คุณต้องการลบ Booking ID: ${id} ใช่หรือไม่?`);
                if (!confirmDelete) return;

                try {
                    await axios.delete(`${BASE_URL}/tb_booking/${id}`);
                    showMessage(`Booking ID: ${id} ถูกลบแล้ว`, 'success');
                    loadData();
                } catch (error) {
                    console.error('Error deleting booking:', error);
                    showMessage('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
                }
            });
        }
        const deleteroomDOMs = document.getElementsByClassName('delete-room');
        for (let i = 0; i < deleteroomDOMs.length; i++) {
            deleteroomDOMs[i].addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                const confirmDelete = confirm(`คุณต้องการลบ Booking ID: ${id} ใช่หรือไม่?`);
                if (!confirmDelete) return;

                try {
                    await axios.delete(`${BASE_URL}/tb_room/${id}`);
                    showMessage(`Booking ID: ${id} ถูกลบแล้ว`, 'success');
                    loadData();
                } catch (error) {
                    console.error('Error deleting Room:', error);
                    showMessage('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
                }
            });
        }
          // ✅ ลบ user พร้อมแจ้งเตือน
          const deleteUserDOMs = document.getElementsByClassName('delete-user');
          for (let i = 0; i < deleteUserDOMs.length; i++) {
              deleteUserDOMs[i].addEventListener('click', async (event) => {
                  const id = event.target.dataset.id;
                  const confirmDelete = confirm(`คุณต้องการลบ User ID: ${id} ใช่หรือไม่?`);
                  if (!confirmDelete) return;
  
                  try {
                      await axios.delete(`${BASE_URL}/tb_user/${id}`);
                      showMessage(`User ID: ${id} ถูกลบแล้ว`, 'success');
                      loadData();
                  } catch (error) {
                      console.error('Error deleting user:', error);
                      showMessage('เกิดข้อผิดพลาดในการลบข้อมูล', 'error');
                  }
              });
          }

    } catch (error) {
        console.error('Error loading user:', error);
        showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    }
};

// ✅ ฟังก์ชันแสดงข้อความแจ้งเตือน
function showMessage(message, type) {
    alert(message); // แสดง alert (คุณสามารถปรับเปลี่ยนเป็นการแสดงผลในรูปแบบอื่นได้)
}
