const BASE_URL = 'http://localhost:9999';

// Keep the existing window.onload function for the edit functionality
window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        mode = 'EDIT';
        selectedID = id;
        try {
            const response = await axios.get(`${BASE_URL}/tb_user/${id}`);
            const user = response.data;
            
            document.querySelector("input[name=username]").value = user.username;
            document.querySelector("input[name=password]").value = user.password;
            
            let roleDOMs = document.querySelectorAll("input[name=role]");
            roleDOMs.forEach(radio => {
                if (radio.value === user.role) {
                    radio.checked = true;
                }
            });
        } catch (error) {
            console.log('Error:', error);
        }
    }
};

// Modify the form submission to handle login functionality
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // ป้องกันการ reload หน้า
    
    let submitButton = document.getElementById('submitButton');
    let username = document.querySelector("input[name=username]").value;
    let password = document.querySelector("input[name=password]").value;
    let messageDOM = document.getElementById('message');
    
    try {
        submitButton.style.display = "none"; // ซ่อนปุ่มชั่วคราว
        
        // Send login request instead of create/update
        const response = await axios.post(`${BASE_URL}/login`, { username, password });
        
        // Assuming server returns user data with role information
        const userData = response.data;
        
        messageDOM.innerText = "เข้าสู่ระบบสำเร็จ";
        messageDOM.className = "message success";
        
        // Redirect based on user role
        if (userData.username =="admin" && userData.password == "1234"&& userData.role === "admin") {
            window.location.href = "admin_db.html";
        } else { 
            window.location.href = "Home_p.html"; // หรือหน้าอื่นสำหรับ user ปกติ
        }
        
    } catch (error) {
        console.log('Error:', error);
        messageDOM.innerHTML = `<div>${error.response?.data?.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"}</div>`;
        messageDOM.className = "message danger";
        submitButton.style.display = "block"; // แสดงปุ่มกลับมา
    }
});