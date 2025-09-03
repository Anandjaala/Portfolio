 // Utilities
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => [...document.querySelectorAll(sel)];

    // Smooth scroll for in-page links
    $$("a[href^='#']").forEach(a => a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id.length > 1) { e.preventDefault(); document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }));

    // Footer year
    $('#year').textContent = new Date().getFullYear();

    // Contact form (local save)
    function handleSubmit(e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
      msgs.push({ ...data, at: new Date().toISOString() });
      localStorage.setItem('messages', JSON.stringify(msgs));
      e.target.reset();
      alert('Thanks! Your message was saved locally (demo only).');
      return false;
    }

    // Mini Contact Manager Demo
    function openDemo(id){ document.getElementById(id).showModal(); renderContacts(); }
    function closeDemo(id){ document.getElementById(id).close(); }

    function getContacts(){ return JSON.parse(localStorage.getItem('contacts') || '[]'); }
    function saveContacts(list){ localStorage.setItem('contacts', JSON.stringify(list)); }

    function addContact(){
      const name = $('#cname').value.trim();
      const phone = $('#cphone').value.trim();
      const email = $('#cemail').value.trim();
      if(!name) return alert('Please add a name');
      const list = getContacts();
      list.push({ id: Date.now(), name, phone, email });
      saveContacts(list);
      $('#cname').value = $('#cphone').value = $('#cemail').value = '';
      renderContacts();
    }

    function renderContacts(){
      const q = $('#csearch').value?.toLowerCase() || '';
      const list = getContacts().filter(c => [c.name, c.phone, c.email].join(' ').toLowerCase().includes(q));
      const root = $('#clist');
      root.innerHTML = '';
      if(list.length === 0){ root.innerHTML = '<div class="meta">No contacts yet.</div>'; return; }
      list.forEach(c => {
        const row = document.createElement('div');
        row.className = 'card';
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.innerHTML = `
          <div>
            <strong>${c.name}</strong>
            <div class="meta">${c.phone || ''} ${c.email ? ' • ' + c.email : ''}</div>
          </div>
          <div style="display:flex; gap:8px;">
            <button class="chip" onclick="editContact(${c.id})">Edit</button>
            <button class="chip" onclick="delContact(${c.id})">Delete</button>
          </div>
        `;
        root.appendChild(row);
      });
    }

    function delContact(id){
      const list = getContacts().filter(c => c.id !== id);
      saveContacts(list); renderContacts();
    }

    function editContact(id){
      const list = getContacts();
      const c = list.find(x => x.id === id);
      const name = prompt('Name', c.name) ?? c.name;
      const phone = prompt('Phone', c.phone) ?? c.phone;
      const email = prompt('Email', c.email) ?? c.email;
      Object.assign(c, { name: name.trim(), phone: phone.trim(), email: email.trim() });
      saveContacts(list); renderContacts();
    }