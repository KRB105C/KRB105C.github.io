



const user = 'KRB105C';
const repo = 'KRB105C.github.io';
const baseURL = 'https://sskrb.cloud/'; // Domain baru
const token = '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'; // Token Anda

async function fetchFiles() {
    const url = `https://api.github.com/repos/${user}/${repo}/contents/`;
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${token}`
            }
        });
        const data = await response.json();

        if (!Array.isArray(data)) {
            console.error('Expected array but received:', data);
            return;
        }

        let output = '';
        let folderPromises = [];
        let categories = new Set();

        data.forEach(item => {
            if (item.type === 'dir') {
                // Cek apakah ada file index.html di dalam folder
                const folderURL = `https://api.github.com/repos/${user}/${repo}/contents/${item.name}`;
                folderPromises.push(
                    fetch(folderURL, {
                        headers: {
                            'Authorization': `token ${token}`
                        }
                    })
                        .then(response => response.json())
                        .then(folderData => {
                            const indexFile = folderData.find(file => file.name === 'index.html');
                            if (indexFile) {
                                const folderName = item.name;
                                const folderFileURL = baseURL + folderName + '/index.html';

                                // Ambil isi dari index.html untuk menampilkan meta description dan kategori
                                return fetch(folderFileURL)
                                    .then(response => response.text())
                                    .then(html => {
                                        // Parsing HTML untuk mendapatkan meta description dan kategori
                                        const parser = new DOMParser();
                                        const doc = parser.parseFromString(html, 'text/html');
                                        const metaDescription = doc.querySelector('meta[name="description"]') ? doc.querySelector('meta[name="description"]').content : 'Tidak ada deskripsi tersedia.';
                                        const metaCategory = doc.querySelector('meta[name="categ"]') ? doc.querySelector('meta[name="categ"]').content : 'Tanpa Kategori';

                                        // Debugging
                                        console.log(`Folder: ${folderName}`);
                                        console.log(`Meta Description: ${metaDescription}`);
                                        console.log(`Meta Category: ${metaCategory}`);

                                        // Tambahkan kategori ke set
                                        categories.add(metaCategory);

                                        // Tampilkan nama folder, link, dan deskripsi
                                        output += `
                                            <a href="${folderFileURL}" target="_blank" class="file-item" data-category="${metaCategory}">
                                                <div>
                                                    <p>${folderName}</p>
                                                    <p>${metaDescription}</p>
                                                </div>
                                            </a>
                                        `;
                                    });
                            }
                        })
                        .catch(error => console.log('Error fetching folder contents:', error))
                );
            }
        });

        // Tunggu sampai semua folder dicek sebelum ditampilkan
        await Promise.all(folderPromises);
        document.getElementById('file-list').innerHTML = output;

        // Tambahkan kategori ke dropdown filter
        const categoryFilter = document.getElementById('category-filter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

    } catch (error) {
        console.log('Error fetching file list:', error);
    }
}

document.getElementById('filter-button').addEventListener('click', () => {
    const filterSelect = document.getElementById('category-filter');
    filterSelect.style.display = filterSelect.style.display === 'block' ? 'none' : 'block';
});

function searchFiles() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const files = document.querySelectorAll('.file-item');

    files.forEach(file => {
        const fileName = file.querySelector('p').textContent.toLowerCase();
        if (fileName.includes(searchValue)) {
            file.style.display = '';
        } else {
            file.style.display = 'none';
        }
    });
}

function filterByCategory() {
    const selectedCategory = document.getElementById('category-filter').value;
    const files = document.querySelectorAll('.file-item');

    files.forEach(file => {
        if (selectedCategory === '' || file.dataset.category === selectedCategory) {
            file.style.display = '';
        } else {
            file.style.display = 'none';
        }
    });
}

fetchFiles();

// Ukuran blob
const blobSize = 500; // Sesuaikan dengan ukuran blob

// Menambahkan lebih banyak blobs secara dinamis
for (let i = 0; i < 1; i++) {
    const blob = document.createElement('div');
    blob.classList.add('blob');
    document.getElementById('background-container').appendChild(blob);

    // Mengatur posisi awal blob agar tidak keluar layar
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const maxTop = viewportHeight - blobSize;
    const maxLeft = viewportWidth - blobSize;

    const topPosition = Math.random() * maxTop + 'px';
    const leftPosition = Math.random() * maxLeft + 'px';

    blob.style.top = topPosition;
    blob.style.left = leftPosition;

    // Kecepatan animasi secara acak
    blob.style.animationDuration = Math.random() * 10 + 10 + 's';
}

// Fungsi untuk menyesuaikan posisi blob jika ukuran jendela diubah
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

function fetchFileList() {
  // Tampilkan animasi loading
  document.getElementById('loading-spinner').style.display = 'block';

  fetch('url-ke-file-list')
    .then(response => response.json())
    .then(data => {
      // Proses data file list di sini
      console.log(data);

      // Sembunyikan animasi loading setelah data dimuat
      document.getElementById('loading-spinner').style.display = 'none';

      // Tampilkan data file list di halaman
      displayFileList(data);
    })
    .catch(error => {
      console.error('Error:', error);

      // Sembunyikan animasi loading jika terjadi error
      document.getElementById('loading-spinner').style.display = 'none';
    });
}

function displayFileList(fileList) {
  const listContainer = document.getElementById('file-list');
  fileList.forEach(file => {
    const listItem = document.createElement('li');
    listItem.textContent = file.name;
    listContainer.appendChild(listItem);
  });
}

// Panggil fungsi fetch saat halaman dimuat
window.onload = fetchFileList;
