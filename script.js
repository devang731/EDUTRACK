// 1. Connection Keys
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 2. THE FIX: Force everything to be visible
function switchTo(id) {
    console.log("Switching to: " + id);
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
        s.style.display = 'none';
        s.style.height = 'auto';
        s.style.opacity = '1';
        s.style.overflow = 'visible';
    });
    
    const target = document.getElementById(id);
    if (target) {
        target.style.display = 'block';
        target.style.height = 'auto';
        target.style.opacity = '1';
        target.style.visibility = 'visible';
    }
}

// 3. STARTUP LOGIC
window.onload = function() {
    console.log("EduTrack v4 Live.");
    
    // Check for existing session
    const session = localStorage.getItem('session');
    
    if (!session) {
        switchTo('sc-login');
    } else {
        // If there's an error in the data, just go to login
        try {
            const data = JSON.parse(session);
            switchTo(data.role === 'teacher' ? 'sc-teacher' : 'sc-student');
        } catch(e) {
            switchTo('sc-login');
        }
    }
};

// 4. ATTENDANCE SYNC
async function markAttendance(studentId, status) {
    console.log("Syncing...");
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
