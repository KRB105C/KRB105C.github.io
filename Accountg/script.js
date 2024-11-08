const blobSize = 100; // Ukuran blob

    // Membuat elemen blob dinamis dan menambahkannya ke background-container
    for (let i = 0; i < 3; i++) { // Menambah lebih banyak blob
      const blob = document.createElement('div');
      blob.classList.add('blob');
      document.getElementById('background-container').appendChild(blob);

      // Mengatur posisi awal blob agar tidak keluar dari layar
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const maxTop = viewportHeight - blobSize;
      const maxLeft = viewportWidth - blobSize;

      const topPosition = Math.random() * maxTop + 'px';
      const leftPosition = Math.random() * maxLeft + 'px';

      blob.style.top = topPosition;
      blob.style.left = leftPosition;

      // Memberi kecepatan animasi acak
      blob.style.animationDuration = Math.random() * 10 + 10 + 's';
    }

    // Fungsi untuk menyesuaikan posisi blob ketika ukuran jendela diubah
    window.addEventListener('resize', () => {
      const blobs = document.querySelectorAll('.blob');
      blobs.forEach(blob => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const maxTop = viewportHeight - blobSize;
        const maxLeft = viewportWidth - blobSize;

        blob.style.top = Math.min(parseFloat(blob.style.top), maxTop) + 'px';
        blob.style.left = Math.min(parseFloat(blob.style.left), maxLeft) + 'px';
      });
    });
  
    const storageKey = 'generatedAccountDate';

    function getAccountsUrl(platform) {
      switch (platform) {
        case 'spotify':
          return 'https://raw.githubusercontent.com/KRB105C/Tess/main/akunspotifyyy';
        case 'netflix':
          return 'https://raw.githubusercontent.com/KRB105C/Tess/main/akunnetflixx';
        case 'cloudflare':
          return 'https://raw.githubusercontent.com/KRB105C/Tess/main/cloudflaree';
        default:
          return '';
      }
    }

    async function fetchAccountsForSpotify() {
      const response = await fetch(getAccountsUrl('spotify'));
      const text = await response.text();
      return text.trim().split('\n\n').map(account => {
        const lines = account.split('\n');
        return {
          email: lines[0].replace('Email: ', '').trim(),
          password: lines[1].replace('Sandi: ', '').trim(),
        };
      });
    }

    async function fetchAccountsForNetflix() {
      const response = await fetch(getAccountsUrl('netflix'));
      const text = await response.text();
      return text.trim().split('\n\n').map(account => {
        const lines = account.split('\n');
        return {
          email: lines[0].replace('Email: ', '').trim(),
          password: lines[1].replace('Sandi: ', '').trim(),
        };
      });
    }

    async function fetchAccountsForCloudflare() {
      const response = await fetch(getAccountsUrl('cloudflare'));
      const text = await response.text();
      return text.trim().split('\n\n').map(entry => {
        const lines = entry.split('\n');
        return {
          key: lines[0].trim(),
          value: lines[1].trim(),
        };
      });
    }

    function getLastGeneratedDate() {
      return localStorage.getItem(storageKey);
    }

    function setLastGeneratedDate(date) {
      localStorage.setItem(storageKey, date);
    }

    function isOneDayPassed(lastDate) {
      if (!lastDate) return true;
      const lastDateTime = new Date(lastDate).getTime();
      const today = new Date().setHours(0, 0, 0, 0);
      return lastDateTime < today;
    }

    function updateCooldownTimer() {
      const lastGeneratedDate = getLastGeneratedDate();
      if (!lastGeneratedDate) {
        document.getElementById('cooldown').innerText = '';
        return;
      }

      const lastDateTime = new Date(lastGeneratedDate).getTime();
      const now = new Date().getTime();
      const cooldownEnd = lastDateTime + 24 * 60 * 60 * 1000; // 24 hours cooldown

      if (now >= cooldownEnd) {
        document.getElementById('cooldown').innerText = 'You can generate an account now.';
        return;
      }

      const remainingTime = cooldownEnd - now;
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      document.getElementById('cooldown').innerText = `Cooldown time remaining: ${hours}h ${minutes}m ${seconds}s`;
      setTimeout(updateCooldownTimer, 1000); // Update every second
    }

    async function updateAvailableAccounts() {
      const platform = document.getElementById('platform').value;
      let fetchAccounts;

      switch (platform) {
    case 'spotify':
      fetchAccounts = fetchAccountsForSpotify();
      formatAccountDetails = account => `Email: ${account.email}\nSandi: ${account.password}`;
      fileName = 'spotify_account.txt';
      break;
    case 'netflix':
      fetchAccounts = fetchAccountsForNetflix();
      formatAccountDetails = account => `Email: ${account.email}\nSandi: ${account.password}`;
      fileName = 'netflix_account.txt';
          break;
        case 'cloudflare':
          fetchAccounts = fetchAccountsForCloudflare();
          break;
        default:
          document.getElementById('available').innerText = '';
          return;
      }

      const accounts = await fetchAccounts;
      const availableAccounts = platform === 'cloudflare' ?
        accounts.filter(entry => !localStorage.getItem(entry.key)) :
        accounts.filter(account => !localStorage.getItem(account.email));

      const count = availableAccounts.length;
      const platformText = platform.charAt(0).toUpperCase() + platform.slice(1);

      document.getElementById('available').innerText = `Available ${platformText} accounts: ${count}`;
    }

    async function generateAndDownload() {
      const platform = document.getElementById('platform').value;
      let fetchAccounts;
      let formatAccountDetails;
      let fileName;

      switch (platform) {
        case 'spotify':
          fetchAccounts = fetchAccountsForSpotify();
          formatAccountDetails = account => `Email: ${account.email}\nSandi: ${account.password}`;
          fileName = 'spotify_account.txt';
          break;
        case 'netflix':
          fetchAccounts = fetchAccountsForNetflix();
          formatAccountDetails = account => `Username: ${account.email}\nSandi: ${account.password}`;
          fileName = 'steam_account.txt';
          break;
        case 'cloudflare':
          fetchAccounts = fetchAccountsForCloudflare();
          formatAccountDetails = entry => `Cloudflare key = ${entry.value}`;
          fileName = 'cloudflare_key.txt';
          break;
        default:
          document.getElementById('message').innerText = 'Invalid platform selected.';
          return;
      }

      const lastGeneratedDate = getLastGeneratedDate();
      if (!isOneDayPassed(lastGeneratedDate)) {
        document.getElementById('message').innerText = 'You can only generate one account per day.';
        return;
      }

      const accounts = await fetchAccounts;
      const availableAccounts = platform === 'cloudflare' ?
        accounts.filter(entry => !localStorage.getItem(entry.key)) :
        accounts.filter(account => !localStorage.getItem(account.email));

      if (availableAccounts.length === 0) {
        document.getElementById('message').innerText = 'No accounts available.';
        return;
      }

      const account = availableAccounts[Math.floor(Math.random() * availableAccounts.length)];

      if (platform === 'cloudflare') {
        localStorage.setItem(account.key, 'generated');
      } else {
        localStorage.setItem(account.email, 'generated');
      }

      setLastGeneratedDate(new Date().toISOString());

      const accountDetails = formatAccountDetails(account);
      const blob = new Blob([accountDetails], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      document.getElementById('message').innerText = platform === 'cloudflare' ?
        `Cloudflare key generated! ${accountDetails}` :
        `Account for ${platform.charAt(0).toUpperCase() + platform.slice(1)} generated! Email: ${account.email}`;

      updateAvailableAccounts();
    }

    // Initialize the cooldown timer and update available accounts
    updateCooldownTimer();
    updateAvailableAccounts();
    

// Refresh account availability every 30 seconds (30000 milliseconds)
setInterval(updateAvailableAccounts, 1000);  // 30 detik
