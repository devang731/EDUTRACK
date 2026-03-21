// 1. Connection Keys
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 2. Emergency Function Restore (In case they were deleted from HTML)
function switchTo(screenId) {
    const screens = ['sc-login', 'sc-teacher', 'sc-student'];
    screens.forEach(s => {
        const el = document.getElementById(s);
        if (el) el.classList.remove('active');
    });
    const target = document.getElementById(screenId);
    if (target) target.classList.add('active');
}

// 3. The Logic to Save Attendance
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
                attendance: `Student ${studentId}: ${status} at ${new Date().toLocaleString()}`
            })
        });
        console.log("Synced!");
    } catch (e) { console.error("Sync Error", e); }
}

// 4. Start the App
document.addEventListener('DOMContentLoaded', () => {
    console.log("System Initializing...");
    const sessionData = localStorage.getItem('session');
    
    if (!sessionData) {
        switchTo('sc-login');
    } else {
        const session = JSON.parse(sessionData);
        if (session.role === 'teacher') {
            switchTo('sc-teacher');
        } else if (session.role === 'student') {
            switchTo('sc-student');
        } else {
            switchTo('sc-login');
        }
    }
});
