const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 1. THE SWITCHER FUNCTION (Crucial)
function switchTo(id) {
    // Hide everything
    document.querySelectorAll('.screen').forEach(s => {
        s.style.display = 'none';
        s.style.height = 'auto';
        s.style.overflow = 'visible';
        s.classList.remove('active');
    });
    // Show the target
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        target.style.height = 'auto';
        target.style.overflow = 'visible';
        target.classList.add('active');
    }
}

// 2. THE STARTUP LOGIC
document.addEventListener('DOMContentLoaded', () => {
    console.log("EduTrack Initializing...");
    
    // Check if a session exists
    const session = localStorage.getItem('session');
    
    if (!session) {
        switchTo('sc-login');
    } else {
        try {
            const data = JSON.parse(session);
            if (data.role === 'teacher') switchTo('sc-teacher');
            else if (data.role === 'student') switchTo('sc-student');
            else switchTo('sc-login');
        } catch (e) {
            switchTo('sc-login');
        }
    }
});

// 3. ATTENDANCE LOGIC
async function markAttendance(studentId, status) {
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
}
