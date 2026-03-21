  }
  role=session.role;uid=session.uid;
  if(role==='teacher'){
    const t=TEACHERS.find(x=>x.id===uid);
    if(!t){lsSet('session',null);return;}
    document.getElementById('t-hdr').textContent=t.name;
    document.getElementById('t-dot').textContent=t.name.substring(0,2).toUpperCase();
    switchTo('sc-teacher');
    pullCloud().then(()=>renderTDash());
  }else if(role==='student'){
    const{cls,sid}=uid;
    const s=(allStudents[cls]||[]).find(x=>x.id===sid);
    if(!s){lsSet('session',null);return;}
    document.getElementById('s-hdr').textContent=CAP(s.name);
    document.getElementById('s-dot').textContent=s.name.substring(0,2).toUpperCase();
    switchTo('sc-student');
    pullCloud().then(()=>renderSDash());
  }else if(role==='admin'){
    // Admin should never auto-login for security — always require password
    lsSet('session',null);
    const loginEl=document.getElementById('sc-login');
    loginEl.style.display='';loginEl.style.height='';loginEl.style.overflow='';
    loginEl.classList.add('active');
  }
})();
