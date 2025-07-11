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


GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[SP_WAREHOUSE_FLORES] ( @iTransaccion VARCHAR(50),  @iXml XML )
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @respuesta VARCHAR(50)
    DECLARE @leyenda VARCHAR(255)

    DECLARE @id INT
    DECLARE @fullName VARCHAR(255)
    DECLARE @identification VARCHAR(50)
    DECLARE @phone VARCHAR(50)
    DECLARE @email VARCHAR(255)
    DECLARE @yearsOfExperience INT
    DECLARE @shift VARCHAR(50)

    BEGIN TRY

        SET @id                 = @iXml.value('(/Warehouse/Id)[1]', 'INT')
        SET @fullName           = @iXml.value('(/Warehouse/FullName)[1]', 'VARCHAR(250)')
        SET @identification     = @iXml.value('(/Warehouse/Identification)[1]', 'VARCHAR(250)')
        SET @phone              = @iXml.value('(/Warehouse/Phone)[1]', 'VARCHAR(250)')
        SET @email              = @iXml.value('(/Warehouse/Email)[1]', 'VARCHAR(250)')
        SET @yearsOfExperience  = @iXml.value('(/Warehouse/YearsOfExperience)[1]', 'INT')
        SET @shift              = @iXml.value('(/Warehouse/Shift)[1]', 'VARCHAR(250)')

        IF @iTransaccion = 'INSERTAR'
        BEGIN
            BEGIN TRANSACTION

            INSERT INTO Warehouse (FullName, Identification, Phone, Email, YearsOfExperience, Shift)
            VALUES (@fullName, @identification, @phone, @email, @yearsOfExperience, @shift)

            COMMIT

            SET @respuesta = 'OK'
            SET @leyenda = 'Registro insertado correctamente'
        END

        ELSE IF @iTransaccion = 'ACTUALIZAR'
        BEGIN
            UPDATE Warehouse
            SET
                FullName = @fullName,
                Identification = @identification,
                Phone = @phone,
                Email = @email,
                YearsOfExperience = @yearsOfExperience,
                Shift = @shift
            WHERE Id = @id

            SET @respuesta = 'OK'
            SET @leyenda = 'Registro actualizado correctamente'
        END

        ELSE IF @iTransaccion = 'ELIMINAR'
        BEGIN
            DELETE FROM Warehouse WHERE Id = @id

            SET @respuesta = 'OK'
            SET @leyenda = 'Registro eliminado correctamente'
        END

        ELSE IF @iTransaccion = 'CONSULTAR_TODO'
        BEGIN
            SELECT * FROM Warehouse

            SET @respuesta = 'OK'
            SET @leyenda = 'Consulta exitosa'
        END

        ELSE IF @iTransaccion = 'CONSULTAR_POR_ID'
        BEGIN
            SELECT * FROM Warehouse WHERE Id = @id

            SET @respuesta = 'OK'
            SET @leyenda = 'Consulta exitosa'
        END

        ELSE
        BEGIN
            SET @respuesta = 'ERROR'
            SET @leyenda = 'Transacción no reconocida'
        END

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK
        SET @respuesta = 'ERROR'
        SET @leyenda = ERROR_MESSAGE()
    END CATCH

    SELECT @respuesta AS respuesta, @leyenda AS leyenda
END
