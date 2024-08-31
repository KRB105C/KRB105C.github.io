var blogId = '1337572638676421245';
        var apiKey = 'AIzaSyCajPuSxO1itrMNcvQVzX1-b7T6srVyAQg';
        var maxResults = 199;


let targetNetflixUrl = '';
let targetSpotifyUrl = '';

function showOptions(event, netflixUrl, spotifyUrl) {
    event.preventDefault();
    targetNetflixUrl = netflixUrl;
    targetSpotifyUrl = spotifyUrl;
    document.getElementById('options-modal').style.display = 'flex';
}

function navigateTo(option) {
    if (option === 'netflix' && targetNetflixUrl) {
        window.location.href = targetNetflixUrl;
    } else if (option === 'spotify' && targetSpotifyUrl) {
        window.location.href = targetSpotifyUrl;
    }
}

function closeModal() {
    document.getElementById('options-modal').style.display = 'none';
}

        function fetchPosts() {
            var url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=${maxResults}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    var posts = data.items;
                    var output = '';
                    posts.forEach(post => {
                        var title = post.title;
                        var postUrl = post.url;
                        var content = post.content;

                        // Ekstraksi gambar pertama dari konten
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(content, 'text/html');
                        var firstImage = doc.querySelector('img');
                        var thumbnail = firstImage ? firstImage.src : 'https://krb.home.blog/wp-content/uploads/2024/08/inshot_20240825_1125134798457414340051033372.jpg';

                        output += `
    <div class="post-item">
        <a href="${postUrl}">
            <img src="${thumbnail}" alt="Thumbnail">
        </a>
        <div class="post-details">
            <a href="${postUrl}">${title}</a>
            <p>${new Date(post.published).toLocaleDateString()}p>
                                </div>
                            </div>
                        `;
                    });
                    document.getElementById('blog-posts').innerHTML = output;

                    // Tambahkan scroll reveal setelah konten dimuat
                    addScrollReveal();
                    
                  // Hilangkan loading overlay setelah konten berhasil dimuat
document.getElementById('loading-overlay').style.display = 'none';
                })
                .catch(error => console.log('Error:', error));
        }
        
        

        function addScrollReveal() {
    var posts = document.querySelectorAll('.post-item');

    function revealOnScroll() {
        posts.forEach(function(post) {
            var position = post.getBoundingClientRect();
            
            // Menambahkan efek jika elemen berada dalam viewport
            if (position.top < window.innerHeight && position.bottom >= 0) {
                post.classList.add('visible');
                post.classList.remove('hidden');
            } else {
                post.classList.remove('visible');
                post.classList.add('hidden');
            }
        });
    
    

    


                

                // Tampilkan tombol scroll jika pengguna menggulir ke bawah
                var scrollToTopBtn = document.getElementById('scrollToTopBtn');
                if (window.scrollY > 300) {
                    scrollToTopBtn.classList.add('visible');
                } else {
                    scrollToTopBtn.classList.remove('visible');
                }
            };
            window.addEventListener('scroll', revealOnScroll);
            revealOnScroll(); // Panggil sekali untuk elemen yang mungkin sudah terlihat saat load
        }

        document.getElementById('scrollToTopBtn').addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
window.addEventListener('scroll', function() {
    var searchContainer = document.getElementById('search-container');

    if (window.scrollY > 100 && !searchContainer.classList.contains('shrunk')) {
        searchContainer.classList.add('shrunk');
    } else if (window.scrollY <= 100 && searchContainer.classList.contains('shrunk')) {
        searchContainer.classList.remove('shrunk');
    }
});


        fetchPosts();
        