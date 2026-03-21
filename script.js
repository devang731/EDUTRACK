// 1. SUPABASE CONFIG
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 2. DATA (Restoring the names so the app has something to show)
const TEACHERS = [
    { id: 't1', name: 'Devang Sharma', pin: '1234' },
    { id: 't2', name: 'Admin User', pin: '0000' }
];

// 3. GLOBAL FUNCTIONS (Attached to window so buttons work)
window.showTeacherLogin = () => document.getElementById('teacher-pop').style.display = 'flex';
window.showStudentLogin = () => document.getElementById('student-pop').style.display = 'flex';
window.showAdminLogin = () => document.getElementById('admin-pop').style.display = 'flex';
window.closePop = () => document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');

window.switchTo = function(id) {
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'flex';
};

// 4. LOGIN LOGIC (This makes the "Login" button actually work)
window.handleTeacherLogin = function() {
    const pin = document.getElementById('t-pin').value;
    const t = TEACHERS.find(x => x.pin === pin);
    if (t) {
        localStorage.setItem('session', JSON.stringify({ role: 'teacher', uid: t.id }));
        window.location.reload(); // Refresh to show dashboard
    } else {
        alert("Invalid PIN");
    }
};

// 5. ATTENDANCE SYNC
async function markAttendance(studentId, status) {
    console.log("Syncing...");
    try {
        await fetch(`${SB_URL}/rest/v1/appdata?key=eq.edutrack`, {
            method: 'PATCH',
            headers: {
                'apikey': SB_KEY,
                'Authorization': `Bearer ${SB_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attendance: `ID: ${studentId} - ${status} (${new Date().toLocaleTimeString()})`
            })
        });
    } catch (e) { console.error("Sync Error", e); }
}

// 6. INITIALIZE
window.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('session');
    if (session) {
        const data = JSON.parse(session);
        window.switchTo(data.role === 'teacher' ? 'sc-teacher' : 'sc-student');
    } else {
        window.switchTo('sc-login');
    }
});
