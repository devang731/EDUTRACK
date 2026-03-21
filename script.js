// 1. Initialize Supabase Connection
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

console.log("EduTrack v4: Connected to appdata layer");

// 2. Updated Logic for your specific 'appdata' table
async function markAttendance(studentId, status) {
    console.log(`Syncing to appdata: Student ${studentId} is ${status}`);
    
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

    if (response.ok) {
        console.log("✅ Success: Synced to Supabase appdata");
    } else {
        console.error("❌ Error: Sync failed. Check RLS policies in Supabase.");
    }
}

// 3. Keep your session logic here
(function() {
    role = session.role; uid = session.uid;
    if (role === 'teacher') {
        const t = TEACHERS.find(x => x.id === uid);
        if (!t) { lsSet('session', null); return; }
        document.getElementById('t-hdr').textContent = t.name;
        document.getElementById('t-dot').textContent = t.name.substring(0, 2).toUpperCase();
        switchTo('sc-teacher');
        pullCloud().then(() => renderTDash());
    } else if (role === 'student') {
        const { cls, sid } = uid;
        const s = (allStudents[cls] || []).find(x => x.id === sid);
        if (!s) { lsSet('session', null); return; }
        document.getElementById('s-hdr').textContent = CAP(s.name);
        document.getElementById('s-dot').textContent = s.name.substring(0, 2).toUpperCase();
        switchTo('sc-student');
        pullCloud().then(() => renderSDash());
    }
})();
