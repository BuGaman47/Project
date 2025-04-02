const BASE_URL = 'http://localhost:9999';
window.onload = async () => {
    await loadData();
    await checkEditMode();
};
const loadData = async () => {
        console.log("user page loaded");
        try {
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
        
                // Validate data before submitting
        const errors = validateuserData(userData);
        if (errors.length > 0) {
            let errorHtml = '<div>กรุณาตรวจสอบข้อมูล</div><ul>';
            errors.forEach(err => {
                errorHtml += `<li>${err}</li>`;
            });
            errorHtml += '</ul>';
            
            messageDOM.innerHTML = errorHtml;
            messageDOM.className = 'message danger';
            return;
        }
        
        let message = 'บันทึกข้อมูลสำเร็จ';
        if (mode === 'CREATE') {
            await axios.post(`${BASE_URL}/tb_user`, userData); // ส่งข้อมูล POST
        } else {
            await axios.put(`${BASE_URL}/tb_user/${selectedID}`, userData); // ส่งข้อมูล PUT
            message = 'แก้ไขข้อมูลสำเร็จ';
        }
        
        messageDOM.innerText = message;
        messageDOM.className = "message success";
        
        loadData();
        
        } catch (error) {
        console.log('Error message:', error.message);
        
        let errorMessage = error.message;
        let errorList = [];
        
        if (error.response) {
            errorMessage = error.response.data.message || errorMessage;
            errorList = error.response.data.errors || [];
        }
        
        let htmlData = `<div>${errorMessage}</div><ul>`;
        errorList.forEach(err => {
            htmlData += `<li>${err}</li>`;
        });
        htmlData += '</ul>';
        
        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger'; 
        }
        };
        
        // Add event listener to submit button if it exists
        document.addEventListener('DOMContentLoaded', function() {
        const submitButton = document.getElementById('submit-booking');
        if (submitButton) {
        submitButton.addEventListener('click', submitData);
        }
        }); 
    } catch (error) {
        console.error('Error loading user:', error);
        showMessage('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    }
    // ✅ ฟังก์ชันแสดงข้อความแจ้งเตือน
function showMessage(message, type) {
    alert(message); 
}
document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.getElementById('submit-booking');
    if (submitButton) {
        submitButton.addEventListener('click', submitData);
    }
});
};
