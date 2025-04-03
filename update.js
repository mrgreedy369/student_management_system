// Sample user data for login
const users = {
    student: [
        { username: "Mohan Saini", password: "ms@123", name: "Mohan Saini", email: "mohansaini8772532@Gmail.com", phone: "123-456-7890", address: "123 Main St", studentId: "STU001", bio: "I am a dedicated student.", profilePic: "https://via.placeholder.com/100", joined: "2025-01-01", courses: ["Python", "Html", "Java Script"] },
        { username: "Shivam Sahaghal", password: "shiv@123", name: "Shivam Sahaghal", email: "Shivam8433@Gmail.com", phone: "234-567-8901", address: "456 Oak St", studentId: "STU002", bio: "Passionate about learning.", profilePic: "https://via.placeholder.com/100", joined: "2025-01-01", courses: ["React.js", "Java", "C"] },
        { username: "Anshul Kapil", password: "kapil@123", name: "Anshul Kapil", email: "Anshul9090@Gmail.com", phone: "345-678-9012", address: "789 Pine St", studentId: "STU003", bio: "Aspiring scientist.", profilePic: "https://via.placeholder.com/100", joined: "2025-01-01", courses: ["C", "Css", "C++"] }
    ],
    faculty: [
        { username: "professor", password: "prof123", name: "Professor Smith", email: "professor@example.com", phone: "456-789-0123", address: "101 College Rd", studentId: "FAC001", bio: "Experienced educator.", profilePic: "https://via.placeholder.com/100", joined: "2024-01-01", courses: ["Java", "DSA", "OOPs C++"] }
    ]
};

// Sample data
let attendanceData = [
    { name: "Junaid", date: "2025-03-20", status: "Present" },
    { name: "Mohan Saini", date: "2025-03-20", status: "Absent" },
    { name: "Shivam Sahaghal", date: "2025-03-20", status: "Present" }
];
let gradesData = [
    { name: "Shivam Sahaghal", subject: "IwT", marks: 85 },
    { name: "Mohan Saini", subject: "DAA", marks: 78 },
    { name: "Anshul Kapil", subject: "DSA", marks: 92 }
];
let assignmentsData = [
    { title: "DSA Assignment 1", dueDate: "2025-03-30", file: null, submissions: [] },
    { title: "SMS Project", dueDate: "2025-04-05", file: null, submissions: [] }
];
let feesData = [
    { studentName: "Mohan Saini", amount: 500, date: "2025-03-01", status: "Paid" },
    { studentName: "Koushindra", amount: 500, date: "2025-03-01", status: "Pending" }
];
let examSchedule = [
    { subject: "Software Engineering", date: "2025-04-15", time: "10:00 AM" },
    { subject: "Data Structure", date: "2025-04-16", time: "10:00 AM" }
];
let leaveRequests = [];
let feedbackData = [];
let notifications = [];
let eventsData = [
    { name: "Science Fair", date: "2025-04-20", time: "10:00", location: "School Hall", description: "Annual science exhibition." },
    { name: "Parent-Teacher Meeting", date: "2025-04-25", time: "14:00", location: "Conference Room", description: "Discuss student progress." }
];
let queriesData = [];
let documentsData = [];

let currentUser = null;
let currentRole = null;
let sessionTimeout = null;
let generatedOTP = null;

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeToggleBtn = document.querySelector('.theme-toggle');
    themeToggleBtn.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Load theme and event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').textContent = '🌙';
    }
    const profilePicContainer = document.querySelector('.profile-pic-container');
    const profilePicInput = document.getElementById('profile-pic-input');
    profilePicContainer.addEventListener('click', () => profilePicInput.click());
    resetSessionTimeout();
    showLogin(); // Show login page by default
});

// Session Management
function resetSessionTimeout() {
    if (sessionTimeout) clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        logout();
        addNotification('Session expired due to inactivity.');
    }, 30 * 60 * 1000);
}

document.addEventListener('mousemove', resetSessionTimeout);
document.addEventListener('keypress', resetSessionTimeout);

// Show Login/Register Pages
function showLogin() {
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('register-page').style.display = 'none';
}

function showRegister() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('register-page').style.display = 'flex';
}
// Handle Registration
function handleRegister(event) {
    event.preventDefault();
    const role = document.getElementById('reg-role').value;
    const username = sanitizeInput(document.getElementById('reg-username').value);
    const password = sanitizeInput(document.getElementById('reg-password').value);
    const name = sanitizeInput(document.getElementById('reg-name').value);
    const email = sanitizeInput(document.getElementById('reg-email').value);
    const phone = sanitizeInput(document.getElementById('reg-phone').value);
    const address = sanitizeInput(document.getElementById('reg-address').value);
    const error = document.getElementById('register-error');

    if (users[role].some(u => u.username === username)) {
        error.textContent = 'Username already exists!';
        return;
    }

    if (username.length < 3 || password.length < 6) {
        error.textContent = 'Username must be at least 3 characters and password at least 6 characters!';
        return;
    }

    const newUser = {
        username,
        password,
        name,
        email,
        phone: phone || '',
        address: address || '',
        studentId: role === 'student' ? `STU${String(users.student.length + 1).padStart(3, '0')}` : `FAC${String(users.faculty.length + 1).padStart(3, '0')}`,
        bio: '',
        profilePic: 'https://via.placeholder.com/100',
        joined: new Date().toISOString().split('T')[0],
        courses: role === 'student' ? ['Math', 'Science', 'History'] : []
    };

    users[role].push(newUser);
    error.textContent = '';
    alert('Registration successful! Please login.');
    showLogin();
    document.getElementById('register-form').reset();
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const role = document.getElementById('role').value;
    const username = sanitizeInput(document.getElementById('username').value);
    const password = sanitizeInput(document.getElementById('password').value);
    const error = document.getElementById('login-error');

    if (!username || !password || username.length < 3 || password.length < 6) {
        error.textContent = 'Username and password must be at least 3 and 6 characters long!';
        return;
    }

    const user = users[role].find(u => u.username === username && u.password === password);
    if (user) {
        generatedOTP = generateSecureOTP();
        alert(`Your OTP is: ${generatedOTP} (This would normally be sent to ${user.email})`); // Display OTP for demo
        document.getElementById('otp-group').style.display = 'block';
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('verify-otp-btn').style.display = 'block';
        currentUser = user;
        currentRole = role;
        error.textContent = 'Please enter the OTP shown in the alert.';
        setTimeout(() => {
            if (generatedOTP) {
                generatedOTP = null;
                error.textContent = 'OTP expired. Please try again.';
                resetLoginForm();
            }
        }, 5 * 60 * 1000); // 5 minutes expiration
    } else {
        error.textContent = 'Invalid username or password!';
    }
}

function generateSecureOTP() {
    return crypto.getRandomValues(new Uint32Array(1))[0].toString().slice(0, 6).padStart(6, '0');
}

function resetLoginForm() {
    document.getElementById('otp-group').style.display = 'none';
    document.getElementById('login-btn').style.display = 'block';
    document.getElementById('verify-otp-btn').style.display = 'none';
    document.getElementById('otp').value = '';
}

function verifyOTP() {
    const enteredOTP = document.getElementById('otp').value;
    const error = document.getElementById('login-error');
    if (!enteredOTP) {
        error.textContent = 'Please enter the OTP!';
        return;
    }
    if (enteredOTP === generatedOTP) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('register-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        initializeDashboard();
        addNotification(`Welcome, ${currentUser.name}! You have logged in successfully.`);
        resetLoginForm(); // Reset form after successful login
        error.textContent = '';
    } else {
        error.textContent = 'Invalid OTP! Please try again.';
    }
}

// Logout
function logout() {
    currentUser = null;
    currentRole = null;
    generatedOTP = null;
    if (sessionTimeout) clearTimeout(sessionTimeout);
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('register-page').style.display = 'none';
    document.getElementById('login-form').reset();
    resetLoginForm();
    document.getElementById('login-error').textContent = '';
    addNotification('You have logged out successfully.');
}

// Initialize Dashboard
function initializeDashboard() {
    updateDashboard();
    populateAttendance();
    populateGrades();
    populateAssignments();
    populateFees();
    populateProfile();
    populateNotifications();
    populateLeave();
    populateFeedback();
    populateEvents();
    populateQueries();
    populateDocuments();

    if (currentRole === 'student') {
        document.querySelector('a[href="#fees"]').style.display = 'none';
        document.getElementById('student-dashboard').style.display = 'block';
        document.getElementById('faculty-dashboard').style.display = 'none';
        document.getElementById('attendance-student-view').style.display = 'block';
        document.getElementById('attendance-faculty-view').style.display = 'none';
        document.getElementById('fees-faculty-view').style.display = 'none';
        document.getElementById('assignments-faculty-view').style.display = 'none';
        document.getElementById('assignments-student-view').style.display = 'block';
        document.getElementById('leave-student-view').style.display = 'block';
        document.getElementById('leave-faculty-view').style.display = 'none';
        document.getElementById('feedback-student-view').style.display = 'block';
        document.getElementById('feedback-faculty-view').style.display = 'none';
        document.getElementById('events-student-view').style.display = 'block';
        document.getElementById('events-faculty-view').style.display = 'none';
        document.getElementById('queries-student-view').style.display = 'block';
        document.getElementById('queries-faculty-view').style.display = 'none';
        document.getElementById('documents-student-view').style.display = 'block';
        document.getElementById('documents-faculty-view').style.display = 'none';
        populateAssignmentDropdown();
        sendDynamicNotifications();
    } else if (currentRole === 'faculty') {
        document.getElementById('student-dashboard').style.display = 'none';
        document.getElementById('faculty-dashboard').style.display = 'block';
        document.getElementById('attendance-student-view').style.display = 'none';
        document.getElementById('attendance-faculty-view').style.display = 'block';
        document.getElementById('fees-faculty-view').style.display = 'block';
        document.getElementById('assignments-faculty-view').style.display = 'block';
        document.getElementById('assignments-student-view').style.display = 'none';
        document.getElementById('leave-student-view').style.display = 'none';
        document.getElementById('leave-faculty-view').style.display = 'block';
        document.getElementById('feedback-student-view').style.display = 'none';
        document.getElementById('feedback-faculty-view').style.display = 'block';
        document.getElementById('events-student-view').style.display = 'none';
        document.getElementById('events-faculty-view').style.display = 'block';
        document.getElementById('queries-student-view').style.display = 'none';
        document.getElementById('queries-faculty-view').style.display = 'block';
        document.getElementById('documents-student-view').style.display = 'none';
        document.getElementById('documents-faculty-view').style.display = 'block';
        populateDocumentStudentFilter();
    }
}

// Update Dashboard
function updateDashboard() {
    if (currentRole === 'student') {
        const studentGrades = gradesData.filter(g => g.name === currentUser.name);
        const totalMarks = studentGrades.reduce((sum, g) => sum + g.marks, 0);
        const maxMarks = studentGrades.length * 100;
        const progress = maxMarks ? (totalMarks / maxMarks) * 100 : 0;
        document.getElementById('academic-progress').style.width = `${progress}%`;
        document.getElementById('academic-progress').textContent = `${progress.toFixed(2)}%`;

        const studentRecords = attendanceData.filter(record => record.name === currentUser.name);
        const presentDays = studentRecords.filter(r => r.status === 'Present').length;
        const totalDays = studentRecords.length;
        const attendancePercentage = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : 0;
        document.getElementById('student-attendance-summary').innerHTML = `
            Total Present: ${presentDays} days<br>
            Total Absent: ${totalDays - presentDays} days<br>
            Attendance Percentage: ${attendancePercentage}%
        `;

        const studentFees = feesData.find(f => f.studentName === currentUser.name);
        document.getElementById('fee-payment-status').textContent = studentFees ? `Status: ${studentFees.status}, Amount: $${studentFees.amount}, Date: ${studentFees.date}` : 'No fee records found.';

        const deadlinesList = document.getElementById('assignment-deadlines');
        deadlinesList.innerHTML = '';
        assignmentsData.forEach(assignment => {
            const li = document.createElement('li');
            li.textContent = `${assignment.title} - Due: ${assignment.dueDate}`;
            deadlinesList.appendChild(li);
        });

        const examBody = document.getElementById('exam-schedule-body');
        examBody.innerHTML = '';
        examSchedule.forEach(exam => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${exam.subject}</td><td>${exam.date}</td><td>${exam.time}</td>`;
            examBody.appendChild(row);
        });
    } else if (currentRole === 'faculty') {
        const totalMarks = gradesData.reduce((sum, g) => sum + g.marks, 0);
        const averageGrade = gradesData.length ? (totalMarks / gradesData.length).toFixed(2) : 0;
        const topStudent = gradesData.reduce((top, g) => (g.marks > (top.marks || 0) ? g : top), {});
        const totalDays = attendanceData.length / users.student.length;
        const presentDays = attendanceData.filter(a => a.status === 'Present').length / users.student.length;
        const attendanceRate = totalDays ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

        document.getElementById('average-grade').textContent = averageGrade;
        document.getElementById('top-performer').textContent = topStudent.name || '-';
        document.getElementById('faculty-attendance-rate').textContent = `${attendanceRate}%`;

        updateFacultyAttendanceSummary();

        const reviewList = document.getElementById('assignment-review-list');
        reviewList.innerHTML = '';
        assignmentsData.forEach(assignment => {
            const li = document.createElement('li');
            li.textContent = `${assignment.title} - Due: ${assignment.dueDate}`;
            if (assignment.file) {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(assignment.file);
                link.download = assignment.file.name;
                link.textContent = ' (Download Assignment)';
                li.appendChild(link);
            }
            if (assignment.submissions.length > 0) {
                const subList = document.createElement('ul');
                assignment.submissions.forEach(sub => {
                    const subLi = document.createElement('li');
                    subLi.textContent = `${sub.student} submitted on ${sub.date}`;
                    if (sub.file) {
                        const subLink = document.createElement('a');
                        subLink.href = URL.createObjectURL(sub.file);
                        subLink.download = sub.file.name;
                        subLink.textContent = ' (Download Submission)';
                        subLi.appendChild(subLink);
                    }
                    subList.appendChild(subLi);
                });
                li.appendChild(subList);
            }
            reviewList.appendChild(li);
        });
    }
}

// Show Section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    document.querySelector(`a[href="#${sectionId}"]`).classList.add('active');

    if (sectionId === 'attendance') {
        document.getElementById('filter-date').value = '';
        document.getElementById('filter-student').value = '';
        populateAttendance();
    }
    if (sectionId === 'grades') {
        document.getElementById('search-grade-student').value = '';
        document.getElementById('filter-grade-subject').value = '';
        populateGrades();
    }
    if (sectionId === 'assignments' && currentRole === 'student') {
        populateAssignmentDropdown();
    }
    if (sectionId === 'documents') {
        populateDocuments();
        if (currentRole === 'faculty') populateDocumentStudentFilter();
    }
}

// Dynamic Notifications
function sendDynamicNotifications() {
    if (currentRole !== 'student') return;
    const studentFees = feesData.find(f => f.studentName === currentUser.name);
    if (studentFees && studentFees.status === 'Pending') {
        addNotification(`Reminder: Your fee payment of $${studentFees.amount} is pending. Please pay by ${studentFees.date}.`);
    }
    assignmentsData.forEach(assignment => {
        const dueDate = new Date(assignment.dueDate);
        const today = new Date();
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 3 && diffDays >= 0) {
            addNotification(`Reminder: Assignment "${assignment.title}" is due on ${assignment.dueDate}.`);
        }
    });
    eventsData.forEach(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays <= 7 && diffDays >= 0) {
            addNotification(`Upcoming Event: "${event.name}" on ${event.date} at ${event.time}.`);
        }
    });
}

// Attendance Management
function populateAttendance() {
    if (currentRole === 'student') {
        const tbody = document.getElementById('attendance-student-body');
        tbody.innerHTML = '';
        const studentRecords = attendanceData.filter(record => record.name === currentUser.name);
        studentRecords.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${record.date}</td><td>${record.status}</td>`;
            tbody.appendChild(row);
        });
    } else if (currentRole === 'faculty') {
        filterAttendance();
    }
}

function markAttendance(event) {
    event.preventDefault();
    const date = document.getElementById('attendance-date').value;
    const selects = document.getElementById('mark-attendance-form').querySelectorAll('select');
    selects.forEach(select => {
        const studentName = select.name;
        const status = select.value;
        attendanceData.push({ name: studentName, date, status });
        addNotification(`Attendance marked for ${studentName} on ${date}: ${status}`);
    });
    populateAttendance();
    updateDashboard();
    document.getElementById('mark-attendance-form').reset();
}

function filterAttendance() {
    const filterDate = document.getElementById('filter-date').value;
    const filterStudent = document.getElementById('filter-student').value;
    let filteredData = attendanceData;
    if (filterDate) filteredData = filteredData.filter(record => record.date === filterDate);
    if (filterStudent) filteredData = filteredData.filter(record => record.name === filterStudent);

    const tbody = document.getElementById('attendance-faculty-body');
    tbody.innerHTML = '';
    filteredData.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.date}</td>
            <td>${record.status}</td>
            <td><button class="edit-btn" onclick="editAttendance(${index})">Edit</button></td>
        `;
        tbody.appendChild(row);
    });
}

function editAttendance(index) {
    const newStatus = prompt('Enter new status (Present/Absent):', attendanceData[index].status);
    if (newStatus && (newStatus === 'Present' || newStatus === 'Absent')) {
        attendanceData[index].status = newStatus;
        addNotification(`Attendance updated for ${attendanceData[index].name} on ${attendanceData[index].date}`);
        populateAttendance();
        updateDashboard();
    }
}

function exportAttendance(format) {
    if (format === 'pdf') {
        html2pdf().from(document.getElementById('attendance-faculty-table')).save('attendance-report.pdf');
    } else if (format === 'excel') {
        const wb = XLSX.utils.table_to_book(document.getElementById('attendance-faculty-table'), { sheet: "Attendance" });
        XLSX.writeFile(wb, 'attendance-report.xlsx');
    }
}

function updateFacultyAttendanceSummary() {
    const summaryDiv = document.getElementById('faculty-attendance-summary');
    summaryDiv.innerHTML = '';
    const students = [...new Set(attendanceData.map(record => record.name))];
    students.forEach(student => {
        const studentRecords = attendanceData.filter(record => record.name === student);
        const presentDays = studentRecords.filter(r => r.status === 'Present').length;
        const totalDays = studentRecords.length;
        summaryDiv.innerHTML += `
            ${student}: Present ${presentDays}/${totalDays} (${((presentDays / totalDays) * 100).toFixed(2)}%)<br>
        `;
    });
}

// Grades Management
function populateGrades() {
    const tbody = document.getElementById('grades-body');
    tbody.innerHTML = '';
    let filteredGrades = currentRole === 'student' ? gradesData.filter(g => g.name === currentUser.name) : gradesData;
    const search = document.getElementById('search-grade-student').value.toLowerCase();
    const subject = document.getElementById('filter-grade-subject').value;
    if (search) filteredGrades = filteredGrades.filter(g => g.name.toLowerCase().includes(search));
    if (subject) filteredGrades = filteredGrades.filter(g => g.subject === subject);

    filteredGrades.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.name}</td>
            <td>${record.subject}</td>
            <td>${record.marks}</td>
            <td>${currentRole === 'faculty' ? `<button class="edit-btn" onclick="editGrade(${index})">Edit</button>` : ''}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterGrades() {
    populateGrades();
}

function submitGrade(event) {
    event.preventDefault();
    const student = document.getElementById('grade-student').value;
    const subject = document.getElementById('grade-subject').value;
    const marks = parseInt(document.getElementById('grade-marks').value);
    const existingGrade = gradesData.find(g => g.name === student && g.subject === subject);
    if (existingGrade) {
        existingGrade.marks = marks;
    } else {
        gradesData.push({ name: student, subject, marks });
    }
    addNotification(`Grade submitted for ${student} in ${subject}: ${marks}`);
    populateGrades();
    updateDashboard();
    document.getElementById('grade-submission-form').reset();
}

function editGrade(index) {
    const newMarks = prompt('Enter new marks (0-100):', gradesData[index].marks);
    if (newMarks && !isNaN(newMarks) && newMarks >= 0 && newMarks <= 100) {
        gradesData[index].marks = parseInt(newMarks);
        addNotification(`Grade updated for ${gradesData[index].name} in ${gradesData[index].subject}`);
        populateGrades();
        updateDashboard();
    }
}

function exportGrades(format) {
    if (format === 'pdf') {
        html2pdf().from(document.getElementById('grades-table')).save('grades-report.pdf');
    } else if (format === 'excel') {
        const wb = XLSX.utils.table_to_book(document.getElementById('grades-table'), { sheet: "Grades" });
        XLSX.writeFile(wb, 'grades-report.xlsx');
    }
}

// Assignments Management
function populateAssignmentDropdown() {
    const select = document.getElementById('submit-assignment-title');
    select.innerHTML = '<option value="" disabled selected>Select Assignment</option>';
    assignmentsData.forEach(assignment => {
        const option = document.createElement('option');
        option.value = assignment.title;
        option.textContent = `${assignment.title} (Due: ${assignment.dueDate})`;
        select.appendChild(option);
    });
}

function submitAssignment(event) {
    event.preventDefault();
    const title = document.getElementById('submit-assignment-title').value;
    const file = document.getElementById('submit-assignment-file').files[0];
    const assignment = assignmentsData.find(a => a.title === title);
    if (assignment) {
        assignment.submissions.push({ student: currentUser.name, file, date: new Date().toISOString().split('T')[0] });
        addNotification(`Assignment "${title}" submitted successfully.`);
        populateAssignments();
        updateDashboard();
        document.getElementById('submit-assignment-form').reset();
    }
}

function uploadAssignment(event) {
    event.preventDefault();
    const title = document.getElementById('assignment-title').value;
    const dueDate = document.getElementById('assignment-due-date').value;
    const file = document.getElementById('assignment-file').files[0];
    assignmentsData.push({ title, dueDate, file, submissions: [] });
    addNotification(`Assignment "${title}" uploaded successfully.`);
    populateAssignments();
    updateDashboard();
    document.getElementById('upload-assignment-form').reset();
}

function populateAssignments() {
    const list = document.getElementById('assignments-list');
    list.innerHTML = '';
    assignmentsData.forEach(assignment => {
        const li = document.createElement('li');
        li.textContent = `${assignment.title} - Due: ${assignment.dueDate}`;
        if (assignment.file) {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(assignment.file);
            link.download = assignment.file.name;
            link.textContent = ' (Download)';
            li.appendChild(link);
        }
        list.appendChild(li);
    });
}

// Fees Management
function populateFees() {
    const tbody = document.getElementById('fees-body');
    tbody.innerHTML = '';
    let filteredFees = currentRole === 'student' ? feesData.filter(f => f.studentName === currentUser.name) : feesData;
    filteredFees.forEach(fee => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${fee.studentName}</td><td>$${fee.amount}</td><td>${fee.date}</td>`;
        tbody.appendChild(row);
    });
}

function handlePayment(event) {
    event.preventDefault();
    const studentName = document.getElementById('student-name').value;
    const amount = parseInt(document.getElementById('amount').value);
    const date = new Date().toISOString().split('T')[0];
    feesData.push({ studentName, amount, date, status: 'Paid' });
    addNotification(`Payment recorded for ${studentName}: $${amount}`);
    populateFees();
    updateDashboard();
    document.getElementById('fees-form').reset();
}

function exportFees() {
    html2pdf().from(document.getElementById('fees-table')).save('fees-report.pdf');
}

// Profile Management
function populateProfile() {
    document.getElementById('profile-details-name').textContent = currentUser.name;
    document.getElementById('profile-details-role').textContent = currentRole.charAt(0).toUpperCase() + currentRole.slice(1);
    document.getElementById('profile-details-username').textContent = currentUser.username;
    document.getElementById('profile-details-email').textContent = currentUser.email;
    document.getElementById('profile-details-phone').textContent = currentUser.phone || 'Not provided';
    document.getElementById('profile-details-address').textContent = currentUser.address || 'Not provided';
    document.getElementById('profile-details-student-id').textContent = currentUser.studentId;
    document.getElementById('profile-details-bio').textContent = currentUser.bio || 'Not provided';
    document.getElementById('profile-details-joined').textContent = currentUser.joined;
    document.getElementById('profile-details-courses').textContent = currentUser.courses.join(', ');
    document.getElementById('profile-pic').src = currentUser.profilePic;

    document.getElementById('profile-name').value = currentUser.name;
    document.getElementById('profile-email').value = currentUser.email;
    document.getElementById('profile-phone').value = currentUser.phone || '';
    document.getElementById('profile-address').value = currentUser.address || '';
    document.getElementById('profile-student-id').value = currentUser.studentId;
    document.getElementById('profile-bio').value = currentUser.bio || '';
}

function updateProfile(event) {
    event.preventDefault();
    currentUser.name = document.getElementById('profile-name').value;
    currentUser.email = document.getElementById('profile-email').value;
    currentUser.phone = document.getElementById('profile-phone').value;
    currentUser.address = document.getElementById('profile-address').value;
    currentUser.bio = document.getElementById('profile-bio').value;
    const userIndex = users[currentRole].findIndex(u => u.username === currentUser.username);
    users[currentRole][userIndex] = { ...currentUser };
    populateProfile();
    addNotification('Profile updated successfully.');
}

function previewProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentUser.profilePic = e.target.result;
            document.getElementById('profile-pic').src = e.target.result;
            const userIndex = users[currentRole].findIndex(u => u.username === currentUser.username);
            users[currentRole][userIndex].profilePic = e.target.result;
            addNotification('Profile picture updated successfully.');
        };
        reader.readAsDataURL(file);
    }
}

function modifyStudentData(event) {
    event.preventDefault();
    const studentName = document.getElementById('modify-student').value;
    const email = document.getElementById('modify-email').value;
    const bio = document.getElementById('modify-bio').value;
    const student = users.student.find(s => s.name === studentName);
    if (student) {
        if (email) student.email = email;
        if (bio) student.bio = bio;
        addNotification(`Student data updated for ${studentName}.`);
        if (currentUser.name === studentName) populateProfile();
    }
    document.getElementById('student-data-form').reset();
}

// Notifications Management
function addNotification(message) {
    notifications.push({ message, date: new Date().toISOString() });
    populateNotifications();
}

function populateNotifications() {
    const list = document.getElementById('notifications-list');
    list.innerHTML = '';
    notifications.forEach(notification => {
        const div = document.createElement('div');
        div.className = 'notification';
        div.textContent = `${notification.date}: ${notification.message}`;
        list.appendChild(div);
    });
}

// Leave Management
function populateLeave() {
    if (currentRole === 'student') {
        const tbody = document.getElementById('leave-student-body');
        tbody.innerHTML = '';
        leaveRequests.filter(lr => lr.student === currentUser.name).forEach(lr => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${lr.startDate}</td><td>${lr.endDate}</td><td>${lr.reason}</td><td>${lr.status}</td>`;
            tbody.appendChild(row);
        });
    } else if (currentRole === 'faculty') {
        const tbody = document.getElementById('leave-faculty-body');
        tbody.innerHTML = '';
        leaveRequests.forEach((lr, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${lr.student}</td>
                <td>${lr.startDate}</td>
                <td>${lr.endDate}</td>
                <td>${lr.reason}</td>
                <td>${lr.status}</td>
                <td>${lr.status === 'Pending' ? `
                    <button class="approve-btn" onclick="approveLeave(${index})">Approve</button>
                    <button class="reject-btn" onclick="rejectLeave(${index})">Reject</button>
                ` : ''}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

function applyLeave(event) {
    event.preventDefault();
    const startDate = document.getElementById('leave-start-date').value;
    const endDate = document.getElementById('leave-end-date').value;
    const reason = document.getElementById('leave-reason').value;
    leaveRequests.push({ student: currentUser.name, startDate, endDate, reason, status: 'Pending' });
    addNotification(`Leave application submitted for ${startDate} to ${endDate}.`);
    populateLeave();
    document.getElementById('leave-application-form').reset();
}

function approveLeave(index) {
    leaveRequests[index].status = 'Approved';
    addNotification(`Leave request from ${leaveRequests[index].student} approved.`);
    populateLeave();
}

function rejectLeave(index) {
    leaveRequests[index].status = 'Rejected';
    addNotification(`Leave request from ${leaveRequests[index].student} rejected.`);
    populateLeave();
}

// Feedback Management
function populateFeedback() {
    if (currentRole === 'faculty') {
        const tbody = document.getElementById('feedback-faculty-body');
        tbody.innerHTML = '';
        feedbackData.forEach(fb => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${fb.course}</td><td>${fb.student}</td><td>${fb.rating}</td><td>${fb.comments}</td>`;
            tbody.appendChild(row);
        });
    }
}

function submitFeedback(event) {
    event.preventDefault();
    const course = document.getElementById('feedback-course').value;
    const faculty = document.getElementById('feedback-faculty').value;
    const rating = document.getElementById('feedback-rating').value;
    const comments = document.getElementById('feedback-comments').value;
    feedbackData.push({ course, student: currentUser.name, rating, comments });
    addNotification(`Feedback submitted for ${course}.`);
    document.getElementById('feedback-form').reset();
}

// Events Management
function populateEvents() {
    if (currentRole === 'student') {
        const tbody = document.getElementById('events-student-body');
        tbody.innerHTML = '';
        eventsData.forEach(event => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.time}</td>
                <td>${event.location}</td>
                <td>${event.description}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (currentRole === 'faculty') {
        const tbody = document.getElementById('events-faculty-body');
        tbody.innerHTML = '';
        eventsData.forEach((event, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${event.name}</td>
                <td>${event.date}</td>
                <td>${event.time}</td>
                <td>${event.location}</td>
                <td>${event.description}</td>
                <td><button class="edit-btn" onclick="deleteEvent(${index})">Delete</button></td>
            `;
            tbody.appendChild(row);
        });
    }
}

function addEvent(event) {
    event.preventDefault();
    const name = document.getElementById('event-name').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const location = document.getElementById('event-location').value;
    const description = document.getElementById('event-description').value;

    eventsData.push({ name, date, time, location, description });
    addNotification(`Event "${name}" added successfully for ${date}.`);
    populateEvents();
    document.getElementById('event-form').reset();
}

function deleteEvent(index) {
    const eventName = eventsData[index].name;
    eventsData.splice(index, 1);
    addNotification(`Event "${eventName}" deleted successfully.`);
    populateEvents();
}

// Queries Management
function populateQueries() {
    if (currentRole === 'student') {
        const tbody = document.getElementById('queries-student-body');
        tbody.innerHTML = '';
        queriesData.filter(q => q.student === currentUser.name).forEach(q => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${q.subject}</td>
                <td>${q.query}</td>
                <td>${q.status}</td>
                <td>${q.response || 'No response yet'}</td>
            `;
            tbody.appendChild(row);
        });
    } else if (currentRole === 'faculty') {
        const tbody = document.getElementById('queries-faculty-body');
        tbody.innerHTML = '';
        queriesData.forEach((q, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${q.student}</td>
                <td>${q.subject}</td>
                <td>${q.query}</td>
                <td>${q.status}</td>
                <td>${q.status === 'Pending' ? `
                    <button class="edit-btn" onclick="respondToQuery(${index})">Respond</button>
                ` : q.response || 'No response'}</td>
            `;
            tbody.appendChild(row);
        });
    }
}

function submitQuery(event) {
    event.preventDefault();
    if (currentRole !== 'student') return; // Only students can submit queries
    const subject = document.getElementById('query-subject').value;
    const queryText = document.getElementById('query-text').value;

    queriesData.push({ student: currentUser.name, subject, query: queryText, status: 'Pending', response: '' });
    addNotification(`Query submitted for ${subject}.`);
    populateQueries();
    document.getElementById('query-form').reset();
}

function respondToQuery(index) {
    const response = prompt(`Enter response for ${queriesData[index].student}'s query on ${queriesData[index].subject}:`, queriesData[index].response);
    if (response) {
        queriesData[index].response = response;
        queriesData[index].status = 'Resolved';
        addNotification(`Response sent to ${queriesData[index].student}'s query on ${queriesData[index].subject}.`);
        populateQueries();
    }
}

// Documents Management
function uploadDocument(event) {
    event.preventDefault();
    const type = document.getElementById('document-type').value;
    const file = document.getElementById('document-file').files[0];
    if (file && file.type === 'application/pdf') {
        documentsData.push({
            student: currentUser.name,
            type,
            file,
            fileName: file.name,
            uploadDate: new Date().toISOString().split('T')[0]
        });
        addNotification(`Document "${type}" uploaded successfully.`);
        populateDocuments();
        document.getElementById('document-upload-form').reset();
    } else {
        alert('Please upload a PDF file only.');
    }
}

function populateDocuments() {
    if (currentRole === 'student') {
        const tbody = document.getElementById('documents-body');
        tbody.innerHTML = '';
        const studentDocs = documentsData.filter(doc => doc.student === currentUser.name);
        studentDocs.forEach((doc, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${doc.type}</td>
                <td>${doc.fileName}</td>
                <td>${doc.uploadDate}</td>
                <td><a href="${URL.createObjectURL(doc.file)}" download="${doc.fileName}">Download</a></td>
            `;
            tbody.appendChild(row);
        });
    } else if (currentRole === 'faculty') {
        filterDocuments();
    }
}

function populateDocumentStudentFilter() {
    const select = document.getElementById('filter-document-student');
    select.innerHTML = '<option value="">All Students</option>';
    const studentNames = [...new Set(documentsData.map(doc => doc.student))];
    studentNames.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });
}

function filterDocuments() {
    const filterStudent = document.getElementById('filter-document-student').value;
    let filteredDocs = filterStudent ? documentsData.filter(doc => doc.student === filterStudent) : documentsData;
    
    const tbody = document.getElementById('documents-faculty-body');
    tbody.innerHTML = '';
    filteredDocs.forEach(doc => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${doc.student}</td>
            <td>${doc.type}</td>
            <td>${doc.fileName}</td>
            <td>${doc.uploadDate}</td>
            <td><a href="${URL.createObjectURL(doc.file)}" download="${doc.fileName}">Download</a></td>
        `;
        tbody.appendChild(row);
    });
}

// Input sanitization
function sanitizeInput(input) {
    return input.replace(/[<>&'"]/g, '');
}