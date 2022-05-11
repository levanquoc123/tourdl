create table user( 
    id int primary key AUTO_INCREMENT, 
    email varchar(250),
    password varchar(50),
    fullName varchar(250),   
    sdt varchar(10), 
    cmnd varchar(12),   
    ngaySinh date,
    gioiTinh varchar(250),
    diaChi varchar(255),
    status varchar(10),
    role (10),
    UNIQUE (cmnd)
);
insert into taiKhoan(email, password, fullName, sdt, cmnd, ngaySinh, gioiTinh, status, role) values('Admin@gmail.com','12345678','1231231233','Le Van Quoc','197392677','1999-03-27','nam','true','admin')
 
create table tour(
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    description varchar(255),
    status varchar(20), 
    primary key (id)
);

create table chuyenDi(
    id int NOT NULL AUTO_INCREMENT,
    startTime date NOT NULL,
    endTime date NOT NULL,
    status varchar(20), 
    tourId int NOT NULL,
    primary key (id) 
);

create table img(
    id int NOT NULL AUTO_INCREMENT,
    tourId int NOT NULL,
    img blob,
    primary key (id) 
);

create table phieu(
    id int NOT NULL AUTO_INCREMENT,
    chuyenDiId int NOT NULL,
    userId int NOT NULL,
    soNguoi int NOT NULL,
    donGia int,
    giamGia int,
    thanhTien int,
    primary key (id) 
);

create table phieuCT(
    id int NOT NULL AUTO_INCREMENT,
    phieuId int NOT NULL,
    fullName varchar(255),
    CMND varchar(12),
    ngaySinh date,
    gioiTinh varchar(20),
    primary key (id) 
)