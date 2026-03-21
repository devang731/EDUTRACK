// 1. SUPABASE CONFIG
const SB_URL = "https://iexrhkrsonhdnloznjru.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlleHJoa3Jzb25oZG5sb3puanJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODkzNTksImV4cCI6MjA4OTA2NTM1OX0.v4XIg2jH1irE4XzDGnYLmVAR1VMhC0ScxcPtlCNQZ9s";

// 2. DATA RESTORE (The app needs these to function)
const TEACHERS = [{ id: 't1', name: 'Devang Sharma', pin: '1234' }];

// 3. THE "AUTO-RESTORE" ENGINE
document.addEventListener('DOMContentLoaded', () => {
    console.log("EduTrack: Manual Override Active");

    // Fix Teacher Card
    const tCard = document.querySelector('.card:nth-of-type(1)');
    if (tCard) tCard.onclick = () => document.getElementById('teacher-pop').style.display = 'flex';

    // Fix Student Card
    const sCard = document.querySelector('.card:nth-of-type(2)');
    if (sCard) sCard.onclick = () => document.getElementById('student-pop').style.display = 'flex';

    // Fix Admin Card
    const aCard = document.querySelector('.card:nth-of-type(3)');
    if (aCard) aCard.onclick = () => document.getElementById('admin-pop').style.display = 'flex';

    // Fix Close Buttons (any click outside the white box closes it)
    document.querySelectorAll('.overlay').forEach(overlay => {
        overlay.onclick = (e) => { if(e.target === overlay) overlay.style.display = 'none'; };
    });

    // Fix Teacher Login Button
    const tLoginBtn = document.querySelector('#teacher-pop button');
    if (tLoginBtn) {
        tLoginBtn.onclick = () => {
            const pin = document.getElementById('t-pin').value;
            if (pin === '1234') {
                localStorage.setItem('session', JSON.stringify({ role: 'teacher', uid: 't1' }));
                location.reload();
            } else { alert("Invalid PIN. Try 1234"); }
        };
    }

    // SCREEN ROUTING
    const session = localStorage.getItem('session');
    document.querySelectorAll('.screen').forEach(s => s.style.display = 'none');

    if (session) {
        const data = JSON.parse(session);
        const targetId = data.role === 'teacher' ? 'sc-teacher' : 'sc-student';
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) targetScreen.style.display = 'flex';
    } else {
        const loginScreen = document.getElementById('sc-login');
        if (loginScreen) loginScreen.style.display = 'flex';
    }
});

// 4. DATABASE SYNC (Supabase logic)
async function markAttendance(studentId, status) {
    try {
        await fetch(`${SB_URL}/rest/v1/appdata?key=eq.edutrack`, {
            method: 'PATCH',
            headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ attendance: `ID: ${studentId} - ${status} (${new Date().toLocaleTimeString()})` })
        });
    } catch (e) { console.error("Database connection failed."); }
}
