const apiKey = process.env.api_key;
const newsContainer = document.getElementById('news-container');
const pagination = document.getElementById('pagination');
let currentPage = 1;
const articlesPerPage = 6;
let totalResults = 0;

async function fetchNews(page = 1) {
    try {
        const response = await fetch(`https://newsapi.org/v2/everything?q=deployment&apiKey=${apiKey}&page=${page}&pageSize=${articlesPerPage}`);
        const data = await response.json();
        
        if (data.status === 'ok') {
            totalResults = Math.min(data.totalResults, articlesPerPage * 4); // Limit to 4 pages worth of results
            displayArticles(data.articles);
            displayPagination();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-danger">Failed to load articles. Please try again later.</p>
            </div>
        `;
    }
}

function displayArticles(articles) {
    newsContainer.innerHTML = '';
    
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'card';
        
        // Handle missing or invalid image URLs
        const imageUrl = article.urlToImage && isValidUrl(article.urlToImage) 
            ? article.urlToImage 
            : 'https://via.placeholder.com/400x200?text=No+Image+Available';

        articleElement.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${imageUrl}" class="card-img-top" alt="${article.title}" 
                    onerror="this.src='https://via.placeholder.com/400x200?text=Error+Loading+Image'">
            </div>
            <div class="card-body">
                <h5 class="card-title">${article.title || 'Untitled'}</h5>
                <p class="card-text">${article.description || 'No description available'}</p>
            </div>
            <div class="card-footer">
                <a href="${article.url}" class="btn btn-primary w-100" target="_blank" rel="noopener noreferrer">
                    Read More
                </a>
            </div>
        `;
        
        newsContainer.appendChild(articleElement);
    });
}

function displayPagination() {
    const totalPages = Math.min(Math.ceil(totalResults / articlesPerPage), 4); // Limit to 4 pages
    pagination.innerHTML = '';
    
    // Previous button
    const prevButton = createPaginationButton('Previous', currentPage > 1);
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchNews(currentPage);
        }
    });
    pagination.appendChild(prevButton);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = createPaginationButton(i, true, i === currentPage);
        pageButton.addEventListener('click', () => {
            if (currentPage !== i) {
                currentPage = i;
                fetchNews(i);
            }
        });
        pagination.appendChild(pageButton);
    }
    
    // Next button
    const nextButton = createPaginationButton('Next', currentPage < totalPages);
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchNews(currentPage);
        }
    });
    pagination.appendChild(nextButton);
}

function createPaginationButton(text, enabled, isActive = false) {
    const li = document.createElement('li');
    li.className = `page-item${!enabled ? ' disabled' : ''}${isActive ? ' active' : ''}`;
    
    li.innerHTML = `
        <button class="page-link" ${!enabled ? 'disabled' : ''}>
            ${text}
        </button>
    `;
    
    return li;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Initial fetch
fetchNews(currentPage);

// Refresh news every 12 hours
setInterval(() => {
    fetchNews(currentPage);
}, 43200000);