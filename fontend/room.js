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

                    <td>${booking.Name}</td>
                    <td>${booking.room_id}</td>
                    <td>${booking.booking_date}</td>
                    <td>${booking.start_time}</td>
                    <td>${booking.end_time}</td>
                </tr>
            `;
        }
        bookingDOM.innerHTML = htmlData;
    } catch (error) {
        console.error('Error loading user:', error);
        showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    }
};