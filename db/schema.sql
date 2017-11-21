create database sdyeksdp5nh5lxf7;
use sdyeksdp5nh5lxf7;


CREATE TABLE ownerdata
(
	id INT AUTO_INCREMENT NOT NULL,
    username varchar(50) NOT NULL,
    `password` varchar(50) NOT NULL,
    firstname varchar(50) NOT NULL,
    lastname varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
    address varchar(50),
	PRIMARY KEY(id)
);

CREATE TABLE Dogs
(
	id INT AUTO_INCREMENT NOT NULL,
    owner_name varchar(50) NOT NULL,
    breed varchar(50) NOT NULL,
    location varchar(5),
    treats int(50) DEFAULT 0,
    shedding int NOT NULL DEFAULT 0,
    energy int NOT NULL DEFAULT 0,
    trainability int NOT NULL DEFAULT 0,
    kid	int NOT NULL DEFAULT 0,
    groom int NOT NULL DEFAULT 0,
    drool int NOT NULL DEFAULT 0,
    bark int NOT NULL DEFAULT 0,
    independence int NOT NULL DEFAULT 0,
    weight int NOT NULL DEFAULT 0,
    image varchar(50),
    
	PRIMARY KEY(id)
);

CREATE TABLE Users
(
    id INT AUTO_INCREMENT NOT NULL,
    name varchar(50) NOT NULL,
    location varchar(5),
    shedding int NOT NULL DEFAULT 0,
    energy int NOT NULL DEFAULT 0,
    trainability int NOT NULL DEFAULT 0,
    kid int NOT NULL DEFAULT 0,
    groom int NOT NULL DEFAULT 0,
    drool int NOT NULL DEFAULT 0,
    bark int NOT NULL DEFAULT 0,
    independence int NOT NULL DEFAULT 0,
    weight int NOT NULL DEFAULT 0,
    
    PRIMARY KEY(id)
);

Select * from Dogs;
