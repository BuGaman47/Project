const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 9999;
const moment = require('moment');
app.use(bodyParser.json());
app.use(cors());

let conn = null;

// เชื่อมต่อฐานข้อมูล MySQL
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8811
    });
};
const validateBookingData = (bookingData) => {
    let errors = [];
    if (!bookingData.Name) errors.push('กรุณากรอกชื่อผู้จอง');
    if (!bookingData.room_id) errors.push('กรุณากรอกหมายเลขห้อง');
    if (!bookingData.booking_date) errors.push('กรุณากรอกวันที่ต้องการจอง');
    if (!bookingData.start_time) errors.push('กรุณากรอกเวลาเริ่มใช้ห้อง');
    if (!bookingData.end_time) errors.push('กรุณากรอกเวลาที่ออกจากห้อง');
    if (!bookingData.title) errors.push('กรุณากรอกชื่อการประชุม');
    return errors;
};
const validateroomData = (roomData) => {
    let errors = [];
    if (!roomData.name) errors.push('กรุณาเลือกชนิดห้อง');
    if (!roomData.capacity) errors.push('กรุณาเลือกความจุ');
    return errors;
};
const validateuserData = (userData) => {
    let errors = [];
    if (!userData.username) errors.push('กรุณากรอกUsername');
    if (!userData.password) errors.push('กรุณากรอกPassword');
    if (!userData.Tel) errors.push('กรุณากรอกเบอร์โทรศัพท์');
    if (!userData.role) errors.push('กรุณาเลือกRole');
    return errors;
};

// **1. ดึงรายการจองห้องทั้งหมด**
app.get('/tb_booking', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM tb_booking');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});
app.get('/tb_room', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM tb_room');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});
app.get('/tb_user', async (req, res) => {
    try {
        const [results] = await conn.query('SELECT * FROM tb_user');
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

//เช็คสถานะห้องว่างหรือไม่ว่าง โดยการดึงข้อมูลมาจากSQLเพื่อบอกจำนวนห้องที่ว่าง,ไม่ว่างและห้องทั้งหมด//
app.get('/check-room-status', async (req, res) => {
    try {
        const [rooms] = await conn.query('SELECT * FROM tb_room');

        // คำนวณจำนวนห้องว่างและไม่ว่าง
        const available = rooms.filter(room => room.status === 'ว่าง').length;
        const unavailable = rooms.filter(room => room.status === 'ไม่ว่าง').length;
        const total = rooms.length;

        // ส่งข้อมูลไปให้ frontend
        res.json({ available, unavailable, total });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});

// **2. เพิ่มการจองห้อง**
app.post('/tb_booking', async (req, res) => {
    try {
        let booking = req.body;
        // ตรวจสอบข้อมูล
        const errors = validateBookingData(booking);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        // แปลง booking_date เป็นรูปแบบที่ MySQL รองรับ
        const formattedBookingDate = moment(booking.booking_date).format('YYYY-MM-DD HH:mm:ss');
        
        // บันทึกข้อมูลลงฐานข้อมูล
        const [results] = await conn.query(
            'INSERT INTO tb_booking ( Name, room_id, booking_date, start_time, end_time, title) VALUES ( ?, ?, ?, ?, ?, ?)',
            [ booking.Name, booking.room_id, formattedBookingDate, booking.start_time, booking.end_time, booking.title]
        );

        res.json({ message: 'เพิ่มการจองสำเร็จ', data: results });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message, errors: error.errors || [] });
    }
});

app.post('/tb_room', async (req, res) => {
    try {
        let room = req.body;
        
        // ตรวจสอบข้อมูล
        const errors = validateroomData(room);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        // บันทึกข้อมูลลงฐานข้อมูล
        const [results] = await conn.query(
            'INSERT INTO tb_room ( name,capacity,status) VALUES ( ?, ?, ?)',
            [ room.name,room.capacity,room.status]
        );

        res.json({ message: 'เพิ่มห้องสำเร็จ', data: results });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message, errors: error.errors || [] });
    }
}); 
app.post('/tb_user', async (req, res) => {
    try {
        let user = req.body;
        // ตรวจสอบข้อมูล
        const errors = validateuserData(user);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        // บันทึกข้อมูลลงฐานข้อมูล
        const [results] = await conn.query(
            'INSERT INTO tb_user (username,password,role,Tel) VALUES ( ?, ?, ?, ?)',
            [ user.username,user.password,user.role,user.Tel]
        );

        res.json({ message: 'Signin สำเร็จ', data: results });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message, errors: error.errors || [] });
    }
}); 
const ADMIN_USER = "admin";
const ADMIN_PASSWORD = "1234";

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("📩 รับข้อมูลจาก Frontend:", { username, password });

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'กรุณากรอกUsernameและรหัสผ่าน' });
    }

    try {
        // เช็คการเข้าสู่ระบบ Admin
        if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
            console.log("✅ Login สำเร็จ (admin)");
            return res.json({ success: true, message: 'เข้าสู่ระบบ admin สำเร็จ', isAdmin: true });
        }

        // ค้นหาผู้ใช้ในฐานข้อมูล
        const [rows] = await conn.execute('SELECT * FROM tb_user WHERE username = ?', [username]);
        console.log("🔍 ผลลัพธ์จากฐานข้อมูล:", rows);

        if (rows.length === 0) {
            console.log("❌ ไม่พบUserนี้ในระบบ");
            return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        const user = rows[0];

        // ตรวจสอบรหัสผ่านแบบตรงๆ
        console.log("🔑 รหัสผ่านที่ได้รับจากผู้ใช้:", password);
        console.log("🔑 รหัสผ่านในฐานข้อมูล:", user.password);
        
        // เปรียบเทียบรหัสผ่านจากผู้ใช้กับรหัสผ่านที่เก็บในฐานข้อมูล
        if (password !== user.password) {
            console.log("❌ รหัสผ่านไม่ถูกต้อง");
            return res.status(401).json({ success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }

        delete user.password;  // ลบรหัสผ่านก่อนส่งข้อมูลกลับ
        console.log("✅ Login สำเร็จ (User)");

        res.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ', user, isAdmin: false });

    } catch (error) {
        console.error("❗เกิดข้อผิดพลาดในเซิร์ฟเวอร์:", error);
        res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
    }
});
app.post('/tb_booking', (req, res) => {
    const { Name, room_id, booking_date, start_time, end_time, title } = req.body;
    
    // บันทึกข้อมูลการจอง
    const insertQuery = `INSERT INTO tb_booking (Name, room_id, booking_date, start_time, end_time, title) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(insertQuery, [Name, room_id, booking_date, start_time, end_time, title], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // อัปเดตสถานะห้องเป็น "ไม่ว่าง"
        const updateQuery = `UPDATE tb_room SET status = 'ไม่ว่าง' WHERE id = ?`;
        db.query(updateQuery, [room_id], (err, updateResults) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'จองห้องสำเร็จ!', booking_id: results.insertId });
        });
    });
});



// *3. ดึงข้อมูลการจองห้องตาม ID*
app.get('/tb_booking/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM tb_booking WHERE id = ?', [id]);
        if (results.length == 0) {
            throw { statusCode: 404, message: 'ไม่พบข้อมูลการจองห้อง' };
        }
        res.json(results[0]);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});
app.get('/tb_room/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM tb_room WHERE id = ?', [id]);
        if (results.length == 0) {
            throw { statusCode: 404, message: 'ไม่พบข้อมูลห้อง' };
        }
        res.json(results[0]);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});
app.get('/tb_user/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('SELECT * FROM tb_user WHERE id = ?', [id]);
        if (results.length == 0) {
            throw { statusCode: 404, message: 'ไม่พบข้อมูลผู้ใช้' };
        }
        res.json(results[0]);
    } catch (error) {
        res.status(error.statusCode || 500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// **4. อัปเดตข้อมูลหนังสือตาม ID**
app.put('/tb_booking/:id', async (req, res) => {
    try {
        let id = req.params.id; // ใช้ id ตัวพิมพ์เล็กตรงกับพารามิเตอร์ :id
        let updateData = req.body;

        // ตรวจสอบว่ามีข้อมูลที่จำเป็นหรือไม่
        if (!updateData.Name && !updateData.room_id && !updateData.booking_date && !updateData.start_time && !updateData.end_time && !updateData.title) {
            return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
        }

        const [results] = await conn.query('UPDATE tb_booking SET ? WHERE id = ?', [updateData, id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการอัปเดต' });
        }

        res.json({ message: 'อัปเดตข้อมูลสำเร็จ', data: results });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', error: error.message });
    }
});
app.put('/tb_room/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateRoom = req.body;
        if (!updateData.name && !updateData.capacity && !updateData.status && !updateData.start_time && !updateData.end_time && !updateData.title) {
            return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
        }
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        const [results] = await conn.query('UPDATE tb_room SET ? WHERE id = ?', [updateRoom, id]);
        res.json({ message: 'อัปเดตข้อมูลห้องที่จอง', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});
app.put('/tb_user/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateUser = req.body;
        const errors = validateuserData(updateUser);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }
        const [results] = await conn.query('UPDATE tb_user SET ? WHERE id = ?', [updateUser, id]);
        res.json({ message: 'อัปเดตข้อมูลผู้ใช้', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

// **5. ลบหนังสือตาม ID**
app.delete('/tb_booking/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM tb_booking WHERE id = ?', [id]);
        res.json({ message: 'ลบการจองสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});
app.delete('/tb_room/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM tb_room WHERE id = ?', [id]);
        res.json({ message: 'ลบห้องสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});
app.delete('/tb_user/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const [results] = await conn.query('DELETE FROM tb_user WHERE id = ?', [id]);
        res.json({ message: 'ลบผู้ใช้สำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});

app.listen(port, async () => {
    await initMySQL();
    console.log(`เซิร์ฟเวอร์ทำงานที่พอร์ต ${port}`); // ควรแสดงพอร์ตที่ตั้งค่าไว้
});