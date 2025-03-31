'5-20 คนต่อห้อง', '21-30 คนต่อห้อง','31-40 คนต่อห้อง', '41-50 คนต่อห้อง','5-20 คนต่อห้อง'
INSERT INTO tb_room (name, capacity,status) VALUES ('ห้องขนาดเล็ก', '5-20 คนต่อห้อง','ว่าง');
INSERT INTO tb_room (name, capacity,status) VALUES ('ห้องขนาดกลาง', '21-30 คนต่อห้อง','ว่าง');
INSERT INTO tb_room (name, capacity,status) VALUES ('ห้องขนาดใหญ่', '31-40 คนต่อห้อง','ว่าง');
INSERT INTO tb_room (name, capacity,status) VALUES ('ห้องขนาดใหญ่พิเศษ', '41-50 คนต่อห้อง','ว่าง');
INSERT INTO tb_room (name, capacity,status) VALUES ('ห้องVIP', '2-20 คนต่อห้อง','ว่าง');
body {
    display: flex;
    align-items: center; /* จัดให้อยู่ตรงกลางแนวนอน */
    justify-content: center; /* จัดให้อยู่ตรงกลางแนวตั้ง */
    height: 100vh; /* ใช้พื้นที่เต็มจอ */
    background-image: url('https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMnd3MWw2cXl4MXBtOXEzbjBoeDdwcjNmd2Y4ZTZsaTlzcGswZm5xdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KZFrf9JusXzmpnPsT6/giphy.gif');
    background-size: cover;
    color: #fff;
    font-family: 'CounterStreamDemoRegular';
    margin: 20px;
}
form {
    height: 60%; // ปรับความสูงของ form
    width: 400px;// ปรับความกว้างของ form
    background-color: rgba(255, 255, 255, 0.29);// ปรับสีพื้นหลังของ form
    position: absolute; //
    transform: translate(-50%,-50%);
    top: 50%;
    left: 50%;
    border-radius: 20px;
    backdrop-filter: blur(30px);
    border: 2px solid rgba(255, 255, 255, 0);
    box-shadow: 0 0 80px rgba(255, 255, 255, 0.48);
    padding: 50px 35px;
}
.header {
    font-weight: bold;
        font-size: 20px;
        text-align: center;
        margin-bottom: 10px;    
    }
.login {
    font-size: 16px;   
    
}
.register {
    font-size: 16px;
    margin-top: 10px;
}
.background{
    width: 420px;
    height: 520px;
    position: absolute;
    transform: translate(-50%,-50%);
    left: 50%;
    top: 50%;
    
}
.login-btn{
    height: 40px;
    width: 25%;
    text-align: center;
    position: absolute;
    border-radius: 10px;
}
.background .shape{
    height: 200px;
    width: 200px;
    position: absolute;
    border-radius: 50%;
}
.shape:first-child{
    background: linear-gradient(
        #1845ad,
        #23a2f6
    );
    box-shadow: 0 0 80px rgba(0, 118, 197, 0.47);
    left: -80px;
    top: -80px;
}
.shape:last-child{
    background: linear-gradient(
        to right,
        #ff512f,
        #f09819
    );
    box-shadow: 0 0 80px rgb(172, 123, 51);
    right: -80px;
    bottom: -80px;
}

.signin  {
    display: flex;
    justify-content: center;
    padding: 10px;
    font-size: 16px;
    background-color: lightblue;
    margin: 0 auto;
    text-align: center;
    width: 40%;
    height: 40px;
    border-radius: 10px;

}
button:hover {
    background-color:#23a2f6;
    background: linear-gradient(
        to right,
        #ff512f,
        #f09819
    );

}

