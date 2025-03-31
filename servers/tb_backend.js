const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 9999;

app.use(bodyParser.json());
app.use(cors());
const moment = require('moment');

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
app.get('/check-room-status', async (req, res) => {
    try {
        const { date, startTime, endTime } = req.query;

        const formattedDate = moment(date).format('YYYY-MM-DD');
        const formattedStartTime = `${formattedDate} ${startTime}:00`;
        const formattedEndTime = `${formattedDate} ${endTime}:00`;

        const [bookings] = await conn.query(
            'SELECT room_id FROM tb_booking WHERE booking_date = ? AND ((start_time <= ? AND end_time >= ?) OR (start_time <= ? AND end_time >= ?))',
            [formattedDate, formattedStartTime, formattedStartTime, formattedEndTime, formattedEndTime]
        );

        const bookedRoomIds = bookings.map(booking => booking.room_id);

        const [rooms] = await conn.query('SELECT * FROM tb_room');

        const roomStatuses = rooms.map(room => ({
            ...room,
            status: bookedRoomIds.includes(room.id) ? 'ไม่ว่าง' : 'ว่าง'
        }));

        res.json(roomStatuses);
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
app.post('/login', async (req, res) => {
    try {
        const { username, password,role } = req.body;
        
        // ตรวจสอบว่ามีการส่งข้อมูลมาครบหรือไม่
        if (!username || !password) {
            return res.status(400).json({ message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
        }
        
        // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
        const [users] = await conn.query('SELECT * FROM tb_user WHERE username = ? AND password = ? AND role = ?', [username, password,role]);
        
        // ตรวจสอบว่ามีผู้ใช้ในระบบหรือไม่
        if (users.length === 0) {
            return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
        }
        
        // ส่งข้อมูลผู้ใช้กลับไป (ไม่รวมรหัสผ่าน)
        const user = users[0];
        delete user.password; // ไม่ส่งรหัสผ่านกลับไป
        
        res.json({ message: 'เข้าสู่ระบบสำเร็จ', user });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
    }
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
        let id = req.params.id;
        let updateBooking = req.body;

        // ตรวจสอบข้อมูล
        const errors = validateBookingData(updateBooking);
        if (errors.length > 0) {
            throw { message: 'กรุณากรอกข้อมูลให้ครบ', errors: errors };
        }

        // ✅ แปลง booking_date เป็นรูปแบบ 'YYYY-MM-DD HH:mm:ss'
        updateBooking.booking_date = moment(updateBooking.booking_date).format('YYYY-MM-DD HH:mm:ss');

        const [results] = await conn.query('UPDATE tb_booking SET ? WHERE id = ?', [updateBooking, id]);
        res.json({ message: 'อัปเดตข้อมูลการจองสำเร็จ', data: results });
    } catch (error) {
        res.status(500).json({ message: 'เกิดข้อผิดพลาด', errorMessage: error.message });
    }
});app.put('/tb_room/:id', async (req, res) => {
    try {
        let id = req.params.id;
        let updateRoom = req.body;
        const errors = validateroomData(updateRoom);
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