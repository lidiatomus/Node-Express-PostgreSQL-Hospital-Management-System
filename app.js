const express = require('express');
const { Pool } = require('pg');
const methodOverride = require('method-override');
const app = express();
const port = 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Serve static files like CSS and images
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.json()); // Middleware to parse JSON payloads
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded payloads

// Set up the PostgreSQL connection pool
const pool = new Pool({
   });

// Basic route to test database connection
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/patients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Patients');
        res.render('patients', { patients: result.rows });
    } catch (err) {
        console.error('Error retrieving patients:', err);
        res.status(500).send('Error retrieving patients');
    }
});

app.post('/patients', async (req, res) => {
    const { firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, insuranceProvider } = req.body;
    console.log('Received data:', req.body); // Log received data
    try {
        const result = await pool.query(
            'INSERT INTO Patients (FirstName, LastName, DateOfBirth, Gender, Address, PhoneNumber, Email, InsuranceProvider) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, insuranceProvider]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding patient:', err);
        res.status(500).send('Error adding patient');
    }
});

app.put('/patients/:id', async (req, res) => {
    const patientId = req.params.id;
    const { firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, insuranceProvider } = req.body;
    console.log('Received data for update:', req.body); // Log received data for update
    try {
        const result = await pool.query(
            'UPDATE Patients SET FirstName = $1, LastName = $2, DateOfBirth = $3, Gender = $4, Address = $5, PhoneNumber = $6, Email = $7, InsuranceProvider = $8 WHERE PatientID = $9 RETURNING *',
            [firstName, lastName, dateOfBirth, gender, address, phoneNumber, email, insuranceProvider, patientId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating patient:', err);
        res.status(500).send('Error updating patient');
    }
});

app.delete('/patients/:id', async (req, res) => {
    const patientId = req.params.id;
    console.log('Deleting patient with ID:', patientId); // Log patient ID to be deleted
    try {
        await pool.query('DELETE FROM Patients WHERE PatientID = $1', [patientId]);
        res.send(`Patient with ID ${patientId} deleted`);
    } catch (err) {
        console.error('Error deleting patient:', err);
        res.status(500).send('Error deleting patient');
    }
});

app.get('/doctors', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Doctors');
        res.render('doctors', { doctors: result.rows });
    } catch (err) {
        console.error('Error retrieving doctors:', err);
        res.status(500).send('Error retrieving doctors');
    }
});

app.get('/doctors/:id/edit', async (req, res) => {
    const doctorId = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM Doctors WHERE DoctorID = $1', [doctorId]);
        const doctor = result.rows[0];
        res.render('editDoctor', { doctor: doctor });
    } catch (err) {
        console.error('Error retrieving doctor:', err);
        res.status(500).send('Error retrieving doctor');
    }
});

app.put('/doctors/:id', async (req, res) => {
    const doctorId = req.params.id;
    const { phoneNumber } = req.body;
    console.log('Updating phone number for doctor with ID:', doctorId); // Log doctor ID to be updated
    try {
        const result = await pool.query(
            'UPDATE Doctors SET PhoneNumber = $1 WHERE DoctorID = $2 RETURNING *',
            [phoneNumber, doctorId]
        );
        res.redirect('/doctors');
    } catch (err) {
        console.error('Error updating doctor:', err);
        res.status(500).send('Error updating doctor');
    }
});

app.post('/doctors', async (req, res) => {
    const { firstName, lastName, specialization, phoneNumber, email } = req.body;
    console.log('Received data:', req.body); // Log received data
    try {
        const result = await pool.query(
            'INSERT INTO Doctors (FirstName, LastName, Specialization, PhoneNumber, Email) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [firstName, lastName, specialization, phoneNumber, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding doctor:', err);
        res.status(500).send('Error adding doctor');
    }
});

app.delete('/doctors/:id', async (req, res) => {
    const doctorId = req.params.id;
    console.log('Deleting doctor with ID:', doctorId); // Log doctor ID to be deleted
    try {
        await pool.query('DELETE FROM Doctors WHERE DoctorID = $1', [doctorId]);
        res.send(`Doctor with ID ${doctorId} deleted`);
    } catch (err) {
        console.error('Error deleting doctor:', err);
        res.status(500).send('Error deleting doctor');
    }
});

app.get('/appointments', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                a.AppointmentID, 
                a.AppointmentDate, 
                a.Reason, 
                a.Status, 
                p.FirstName AS PatientFirstName, 
                p.LastName AS PatientLastName, 
                d.FirstName AS DoctorFirstName, 
                d.LastName AS DoctorLastName 
            FROM 
                Appointments a
            JOIN 
                Patients p ON a.PatientID = p.PatientID
            JOIN 
                Doctors d ON a.DoctorID = d.DoctorID
        `);
        res.render('appointments', { appointments: result.rows });
    } catch (err) {
        console.error('Error retrieving appointments:', err);
        res.status(500).send('Error retrieving appointments');
    }
});

app.post('/appointments', async (req, res) => {
    const { patientId, doctorId, appointmentDate, reason, status } = req.body;
    console.log('Received data:', req.body); // Log received data
    try {
        const result = await pool.query(
            'INSERT INTO Appointments (PatientID, DoctorID, AppointmentDate, Reason, Status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [patientId, doctorId, appointmentDate, reason, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error adding appointment:', err);
        res.status(500).send('Error adding appointment');
    }
});

app.delete('/appointments/:id', async (req, res) => {
    const appointmentId = req.params.id;
    console.log('Deleting appointment with ID:', appointmentId); // Log appointment ID to be deleted
    try {
        await pool.query('DELETE FROM Appointments WHERE AppointmentID = $1', [appointmentId]);
        res.send(`Appointment with ID ${appointmentId} deleted`);
    } catch (err) {
        console.error('Error deleting appointment:', err);
        res.status(500).send('Error deleting appointment');
    }
});

app.get('/medicalRecords', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                mr.RecordID, 
                mr.PatientID,
                mr.DoctorID,
                mr.Diagnosis, 
                mr.TreatmentPlan, 
                mr.DateCreated, 
                p.FirstName AS PatientFirstName, 
                p.LastName AS PatientLastName, 
                d.FirstName AS DoctorFirstName, 
                d.LastName AS DoctorLastName 
            FROM 
                MedicalRecords mr
            JOIN 
                Patients p ON mr.PatientID = p.PatientID
            JOIN 
                Doctors d ON mr.DoctorID = d.DoctorID
        `);

        const medicalRecords = result.rows;

        for (let record of medicalRecords) {
            const medicationsResult = await pool.query(`
                SELECT 
                    m.MedicationName, 
                    m.Dosage 
                FROM 
                    Medications m
                JOIN 
                    Prescriptions pr ON m.MedicationID = pr.MedicationID
                WHERE 
                    pr.PatientID = $1 AND pr.DoctorID = $2
            `, [record.patientid, record.doctorid]);

            const prescriptionsResult = await pool.query(`
                SELECT 
                    m.MedicationName, 
                    pr.DosageInstructions 
                FROM 
                    Medications m
                JOIN 
                    Prescriptions pr ON m.MedicationID = pr.MedicationID
                WHERE 
                    pr.PatientID = $1 AND pr.DoctorID = $2
            `, [record.patientid, record.doctorid]);

            record.medications = medicationsResult.rows;
            record.prescriptions = prescriptionsResult.rows;
        }

        res.render('medicalRecords', { medicalRecords: medicalRecords });
    } catch (err) {
        console.error('Error retrieving medical records:', err);
        res.status(500).send('Error retrieving medical records');
    }
});
app.get('/billing', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                b.BillingID, 
                b.TotalAmount, 
                b.DateIssued, 
                b.PaymentStatus, 
                p.FirstName AS PatientFirstName, 
                p.LastName AS PatientLastName 
            FROM 
                Billing b
            JOIN 
                Patients p ON b.PatientID = p.PatientID
        `);
        res.render('billing', { billing: result.rows });
    } catch (err) {
        console.error('Error retrieving billing information:', err);
        res.status(500).send('Error retrieving billing information');
    }
});
app.get('/payment/:billingId', (req, res) => {
    const billingId = req.params.billingId;
    res.render('payment', { billingId: billingId });
});
app.post('/payment', async (req, res) => {
    const billingId = req.body.billingId;
    try {
        await pool.query('UPDATE Billing SET PaymentStatus = $1 WHERE BillingID = $2', ['Paid', billingId]);
        res.redirect('/billing');
    } catch (err) {
        console.error('Error updating payment status:', err);
        res.status(500).send('Error updating payment status');
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});