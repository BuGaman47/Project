const BASE_URL = 'http://localhost:9999';

const check_info = async () => {
   // ดึงค่าผู้ใช้/รหัสผ่านจากฟอร์ม
   const username = document.getElementById("username").value;
   const password = document.getElementById("password").value;

   try {
      // ส่งข้อมูลไปที่ server
      const response = await axios.post(`${BASE_URL}/login`, {
         username, password
      });

      // ตรวจสอบผลลัพธ์จากเซิฟเวอร์
      if (response.data.success) {
         alert(response.data.message);

         // เช็คว่าเป็น Admin หรือ User
         if (response.data.isAdmin) {
            console.log("Redirecting to home.html...");
            window.location.href = 'admin_db.html'; // เปลี่ยนหน้าไปที่ home.html
         } else {
            console.log("Redirecting to home_User.html...");
            window.location.href = 'Home_p.html'; // เปลี่ยนหน้าไปที่ home_User.html
         }
      } else {
         alert(response.data.message || 'เบอร์โทรหรือรหัสผ่านไม่ถูกต้อง!');
      }
   } catch (error) {
      console.error('เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
   } finally {
      // เปิดปุ่มกลับหลังจากทำงานเสร็จ
      loginButton.disabled = false;
      loginButton.innerText = "เข้าสู่ระบบ";
   }
};

// Event listener สำหรับฟอร์ม login
document.getElementById("loginForm").addEventListener("submit", async function(event) {
   event.preventDefault(); // ป้องกันการรีเฟรชหน้า
   await check_info(); // เรียกใช้ฟังก์ชัน cheack_info() เพื่อทำการล็อกอิน
});