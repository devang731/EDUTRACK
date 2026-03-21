// 1. Connection Keys
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 2. GLOBAL FUNCTIONS (These must be outside any {} to work with buttons)
window.showTeacherLogin = function() {
    console.log("Opening Teacher Login...");
    const pop = document.getElementById('teacher-pop');
    if(pop) pop.style.display = 'flex';
};

window.showStudentLogin = function() {
    console.log("Opening Student Login...");
    const pop = document.getElementById('student-pop');
    if(pop) pop.style.display = 'flex';
};

window.closePop = function() {
    document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');
};

window.switchTo = function(id) {
    console.log("Switching to screen: " + id);
    document.querySelectorAll('.screen').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }
};

// 3. STARTUP LOGIC
window.addEventListener('DOMContentLoaded', () => {
    console.log("EduTrack System Online");
    const session = localStorage.getItem('session');
    if (!session) {
        window.switchTo('sc-login');
    } else {
        try {
            const data = JSON.parse(session);
            window.switchTo(data.role === 'teacher' ? 'sc-teacher' : 'sc-student');
        } catch(e) {
            window.switchTo('sc-login');
        }
    }
});

// 4. DATABASE SYNC
async function markAttendance(studentId, status) {
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
    } catch (e) { console.error("Database Sync Error", e); }
}
