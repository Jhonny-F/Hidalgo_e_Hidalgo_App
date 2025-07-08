CREATE DATABASE HHDB;
USE HHDB;

CREATE TABLE Warehouse (
	id					INT IDENTITY(1,1)	PRIMARY KEY,
	fullName			VARCHAR(250)		NULL,
	identification		VARCHAR(250)		NULL,
	phone				VARCHAR(250)		NULL,
	email				VARCHAR(250)		NULL,
	yearsOfExperience	INT					NULL,
	shift				VARCHAR(250)		NULL,
	estado				INT					NULL		DEFAULT 1,
	fechaReg			DATE				NULL		DEFAULT CAST(GETDATE() AS DATE) 
);

CREATE TABLE Machinery (
	id					INT IDENTITY(1,1) PRIMARY KEY,
	name				VARCHAR(250)		NULL,
	type				VARCHAR(250)		NULL,
	brand				VARCHAR(250)		NULL,
	model				VARCHAR(250)		NULL,
	originCountry		VARCHAR(250)		NULL,
	imageUrl			VARCHAR(500)		NULL,
	estado				INT					NULL		DEFAULT 1,
	fechaReg			DATE				NULL		DEFAULT CAST(GETDATE() AS DATE)
);
