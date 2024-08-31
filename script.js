
 
 
 

 
 
 var currentLink = null;
 
 

// Fungsi untuk memparsing teks menjadi objek
function parseAccountData(text) {
    const accounts = [];
    const lines = text.trim().split('\n');
    let currentAccount = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('Akun')) {
            if (Object.keys(currentAccount).length > 0) {
                accounts.push(currentAccount);
            }
            currentAccount = {};
        } else if (line.startsWith('Email:')) {
            currentAccount.email = line.split(':')[1].trim();
        } else if (line.startsWith('Sandi:') || line.startsWith('Sandj:')) {
            currentAccount.password = line.split(':')[1].trim();
        }
    });

    if (Object.keys(currentAccount).length > 0) {
        accounts.push(currentAccount);
    }

    return accounts;
}

// Fungsi untuk memperbarui elemen-elemen HTML
function updateAccountDivs(accounts) {
    accounts.forEach((account, index) => {
        const emailElem = document.getElementById(`email${index + 1}`);
        const passwordElem = document.getElementById(`password${index + 1}`);

        if (emailElem) {
            emailElem.textContent = account.email || 'Tidak tersedia';
        } else {
            console.warn(`Element dengan ID email${index + 1} tidak ditemukan.`);
        }

        if (passwordElem) {
            passwordElem.textContent = account.password || 'Tidak tersedia';
        } else {
            console.warn(`Element dengan ID password${index + 1} tidak ditemukan.`);
        }
    });
}

// Fetch file dari GitHub dan update divs
fetch('https://raw.githubusercontent.com/KRB105C/Tess/main/akunspotifyyy')
    .then(response => response.text())
    .then(text => {
        console.log('Data fetched:', text); // Debug: tampilkan data yang diambil
        const accounts = parseAccountData(text);
        updateAccountDivs(accounts);
    })
    .catch(error => console.error('Error fetching account data:', error));


        function openModal(event) {
            event.preventDefault(); // Mencegah aksi default link
            currentLink = event.target.href; // Menyimpan link target
            document.getElementById('confirmationModal').style.display = "block"; // Menampilkan modal
        }

        function closeModal() {
            document.getElementById('confirmationModal').style.display = "none"; // Menyembunyikan modal
        }

        function confirmAction() {
            window.location.href = currentLink; // Mengarahkan ke link target
        }

        window.onclick = function(event) {
            var modal = document.getElementById('confirmationModal');
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        function copyToClipboard(elementId) {
            var text = document.getElementById(elementId).innerText;
            var textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Teks disalin ke clipboard: ' + text);
        }

        function showHelp() {
            document.getElementById('helpPopup').style.display = 'block';
        }

        function closeHelp() {
            document.getElementById('helpPopup').style.display = 'none';
        }

        function detectLocationAndTranslate() {
            fetch('https://ipapi.co/json/')
                .then(response => response.json())
                .then(data => {
                    if (data.country_code === 'IN') {
                        document.body.innerHTML = document.body.innerHTML.replace(/Koleksi Akun Netflix/g, 'नेटफ्लिक्स खातों का संग्रह');
                       
                  document.body.innerHTML = document.body.innerHTML.replace(/Akun/g,'खाता');
             
                      document.body.innerHTML = document.body.innerHTML.replace(/Kumpulan akun Spotify Premium dengan masa aktif hingga periode yang tidak ditentukan./g, 'अनिर्दिष्ट अवधि तक की सक्रिय अवधि वाले Spotify प्रीमियम खातों का संग्रह।न है।');
                        document.body.innerHTML = document.body.innerHTML.replace(/Anda telah mengunjungi situs ini/g, 'आपने इस साइट का दौरा किया है');
                        document.body.innerHTML = document.body.innerHTML.replace(/kali/g, 'बार');
                        document.body.innerHTML = document.body.innerHTML.replace(/Salin/g, 'प्रतिलिपि करें');
                        document.body.innerHTML = document.body.innerHTML.replace(/hubungi admin melalui Whatsapp/g, 'व्हाट्सएप के माध्यम से एडमिन से संपर्क करें');
                        document.body.innerHTML = document.body.innerHTML.replace(/Ya/g, 'हाँ');
                        document.body.innerHTML = document.body.innerHTML.replace(/Tak/g, 'नहीं');
                        document.body.innerHTML = document.body.innerHTML.replace(/Bantuan/g, 'सहायता');
                        document.body.innerHTML = document.body.innerHTML.replace(/Jika butuh bantuan hubungi WhatsApp 6285751882714/g, 'मदद की ज़रूरत है?  व्हाट्सएप +6285751882714 पर संपर्क करेंं।');
                        document.body.innerHTML = document.body.innerHTML.replace(/Tutup/g, 'बंद करें');
                        document.body.innerHTML = document.body.innerHTML.replace(/email:/g, 'ईमेल:');
                        
                        
                        
                        document.body.innerHTML = document.body.innerHTML.replace(/pw:/g, 'पासवर्ड:');
                        
                        
                    }
                });
        }

        document.addEventListener('DOMContentLoaded', detectLocationAndTranslate);

        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'hidden') {
                console.log('User has left the page.');
            } else if (document.visibilityState === 'visible') {
                console.log('User has returned to the page.');
                

                        
                }
            });
          

        if (localStorage.getItem('visitorCount')) {
            let count = parseInt(localStorage.getItem('visitorCount'));
            count++;
            localStorage.setItem('visitorCount', count);
            document.getElementById('visitorCount').innerText = count;
        } else {
            localStorage.setItem('visitorCount', 1);
            document.getElementById('visitorCount').innerText = 1;
        }

        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });

        document.addEventListener('selectstart', function(e) {
            e.preventDefault();
        });

        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && (e.key === 'c' || e.key === 'C') || e.metaKey && (e.key === 'c' || e.key === 'C')) {
                e.preventDefault();
            }
        });
    