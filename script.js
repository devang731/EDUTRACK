// 1. Connection Keys
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 2. CORE NAVIGATION (Makes buttons work)
function switchTo(id) {
    document.querySelectorAll('.screen').forEach(s => {
        s.style.display = 'none';
        s.classList.remove('active');
    });
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        target.classList.add('active');
    }
}

// 3. LOGIN FUNCTIONS (For the buttons on your home screen)
function showTeacherLogin() { 
    const pop = document.getElementById('teacher-pop');
    if(pop) pop.style.display = 'flex'; 
}

function showStudentLogin() { 
    const pop = document.getElementById('student-pop');
    if(pop) pop.style.display = 'flex'; 
}

function closePop() {
    document.querySelectorAll('.overlay').forEach(o => o.style.display = 'none');
}

// 4. ATTENDANCE SYNC (The Supabase Part)
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
    } catch (e) { console.error("Sync failed", e); }
}

// 5. STARTUP LOGIC
window.addEventListener('load', () => {
    const session = localStorage.getItem('session');
    if (!session) {
        switchTo('sc-login');
    } else {
        const data = JSON.parse(session);
        switchTo(data.role === 'teacher' ? 'sc-teacher' : 'sc-student');
    }
});
