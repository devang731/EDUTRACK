// 1. DATABASE CONNECTION
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 2. CLOUD SYNC FUNCTION
async function markAttendance(studentId, status) {
    console.log(`Syncing to appdata: Student ${studentId} is ${status}`);
    try {
        const response = await fetch(`${SB_URL}/rest/v1/appdata?key=eq.edutrack`, {
            method: 'PATCH', 
            headers: {
                'apikey': SB_KEY,
                'Authorization': `Bearer ${SB_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                attendance: `Student ${studentId}: ${status} at ${new Date().toLocaleString()}`
            })
        });
        if (response.ok) console.log("✅ Synced to Supabase");
    } catch (e) {
        console.error("Sync Error:", e);
    }
}

// 3. SESSION & INITIALIZATION (The part that prevents the black screen)
window.onload = function() {
    console.log("EduTrack v4: Loading System...");
    
    // Check if session exists in local storage
    const session = JSON.parse(localStorage.getItem('session'));
    
    if (session && session.role && session.uid) {
        const role = session.role;
        const uid = session.uid;

        if (role === 'teacher') {
            const t = TEACHERS.find(x => x.id === uid);
            if (t) {
                document.getElementById('t-hdr').textContent = t.name;
                document.getElementById('t-dot').textContent = t.name.substring(0, 2).toUpperCase();
                switchTo('sc-teacher');
                if (typeof pullCloud === "function") pullCloud().then(() => renderTDash());
            }
        } else if (role === 'student') {
            const { cls, sid } = uid;
            const s = (allStudents[cls] || []).find(x => x.id === sid);
            if (s) {
                document.getElementById('s-hdr').textContent = s.name;
                document.getElementById('s-dot').textContent = s.name.substring(0, 2).toUpperCase();
                switchTo('sc-student');
                if (typeof pullCloud === "function") pullCloud().then(() => renderSDash());
            }
        }
    } else {
        // No session found, show login screen
        switchTo('sc-login');
    }
};
