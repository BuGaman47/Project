const BASE_URL = 'http://localhost:9999';

document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // ป้องกันการ reload หน้า
    
    let username = document.querySelector("input[name=username]").value;
    let password = document.querySelector("input[name=password]").value;
    let role = document.querySelector("input[name=role]:checked").value;
    let telephone = document.querySelector("input[name=telephone]").value;
    let messageDOM = document.getElementById('message');
    
    // ตรวจสอบข้อมูลเบื้องต้น
    if (!username || !password || !role || !telephone) {
        messageDOM.innerHTML = `<div>กรุณากรอกข้อมูลให้ครบถ้วน</div>`;
        messageDOM.className = "message danger";
        return;
    }
    try {
        // สร้างข้อมูลผู้ใช้
        const userData = {
            username: username,
            password: password,
            role: role,
            Tel: telephone // ใช้ชื่อฟิลด์ Tel ตามที่ backend กำหนด
        };
        
        // ส่งข้อมูลไปยัง API เพื่อเพิ่มผู้ใช้ใหม่
        const response = await axios.post(`${BASE_URL}/tb_user`, userData);
        
        // แสดงข้อความสำเร็จ
        messageDOM.innerText = "ลงทะเบียนสำเร็จ";
        messageDOM.className = "message success";
        
        // รอสักครู่แล้วไปยังหน้า login
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
        
    } catch (error) {
        console.error('Error:', error);
        let errorMessage = "เกิดข้อผิดพลาดในการลงทะเบียน";
        
        // แสดงข้อความผิดพลาดจาก backend ถ้ามี
        if (error.response && error.response.data) {
            if (error.response.data.message) {
                errorMessage = error.response.data.message;
            }
            if (error.response.data.errors && error.response.data.errors.length > 0) {
                errorMessage += ": " + error.response.data.errors.join(", ");
            }
        }
        
        messageDOM.innerHTML = `<div>${errorMessage}</div>`;
        messageDOM.className = "message danger";
    }
});