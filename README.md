# 🏥 Hospital Management System (Hospitex)

A full-stack, web-based application designed for managing core operations within a clinic or hospital. It provides a simple, interactive dashboard for CRUD operations on patient and doctor data, appointment scheduling, and transactional billing.

---

## 💻 Technology Stack

This project is built using the **P.E.E.N. stack**, a modern technology combination ideal for robust web development:

* **Backend Framework:** **Express.js** (Node.js)
* **Database:** **PostgreSQL (pg)**, used for secure and relational data storage.
* **Templating Engine:** **EJS (Embedded JavaScript)**, used for dynamic server-side rendering of the UI.
* **Styling:** Custom **CSS** for a responsive, modern interface.



---

## ✨ Core Features

The system manages the essential entities required for clinic operations:

### **Patient Management** (`/patients`)
* **CRUD** operations for registering and viewing patient demographics.
* Uses asynchronous JavaScript (`fetch`) to handle new patient form submissions.

### **Doctor Management** (`/doctors`)
* Allows adding, viewing, and **editing** doctor profiles, including specialization, contact, and email. (`editDoctor.ejs`)

### **Appointments** (`/appointments`)
* Displays a list of all scheduled appointments, linking patients and doctors.
* Includes functionality to **delete** appointments (using `method-override` for `DELETE` requests).

### **Medical Records** (`/medicalRecords`)
* Provides a comprehensive view of patient histories, including detailed lists of **Medications** and **Prescriptions** associated with each record.

### **Transactional Billing & Payment** (`/billing`, `/payment`)
* Displays all issued bills, linking the billing record to the corresponding patient.
* Handles **payment processing** via a dedicated page (`payment.ejs`) that updates the bill status from "Pending" to **"Paid"** in the database upon form submission.

---

### Technologies

* **Node.js** (LTS version recommended)
* **npm** (Node Package Manager)
* **PostgreSQL** installed and running on your local machine.



