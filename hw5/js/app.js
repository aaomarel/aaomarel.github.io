// DOM Elements
const usernameInput = document.getElementById('username-input');
const searchButton = document.getElementById('search-button');
const repositoriesContainer = document.getElementById('repositories-container');
const profileInfoContainer = document.getElementById('profile-info');
const errorMessageContainer = document.getElementById('error-message');
const loadingElement = document.getElementById('loading');
const defaultUsername = 'aaomarel';

// GitHub API URLs
const getReposUrl = (username) => `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`;
const getUserUrl = (username) => `https://api.github.com/users/${username}`;
const getCommitsUrl = (username, repo) => `https://api.github.com/repos/${username}/${repo}/commits`;
const getLanguagesUrl = (username, repo) => `https://api.github.com/repos/${username}/${repo}/languages`;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubData(defaultUsername);
});

searchButton.addEventListener('click', handleSearch);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const username = usernameInput.value.trim();
    if (username) {
        fetchGitHubData(username);
    }
}

// Fetch GitHub Data
async function fetchGitHubData(username) {
    showLoading();
    clearPreviousData();

    try {
        // Fetch user profile information
        const userResponse = await fetch(getUserUrl(username));
        if (!userResponse.ok) {
            throw new Error(`User not found: ${username}`);
        }
        const userData = await userResponse.json();
        
        // Display user profile
        displayUserProfile(userData);
        
        // Fetch user repositories
        const reposResponse = await fetch(getReposUrl(username));
        if (!reposResponse.ok) {
            throw new Error('Failed to fetch repositories');
        }
        const reposData = await reposResponse.json();
        
        // Fetch additional data for each repository
        const enhancedRepos = await Promise.all(reposData.map(async (repo) => {
            // Fetch commit count
            const commitsResponse = await fetch(getCommitsUrl(username, repo.name));
            let commitCount = 0;
            
            if (commitsResponse.ok) {
                const linkHeader = commitsResponse.headers.get('Link');
                //Line 67 was changed by VSCode debugger to include the ? after linkHeader
                if (linkHeader?.includes('rel="last"')) { 
                    // Extract the total count from the Link header if it exists
                    const regex = /page=(\d+)>; rel="last"/;
                    const match = regex.exec(linkHeader);
                    if (match) {
                        commitCount = parseInt(match[1]) * 30; // GitHub paginates commits by 30
                    }
                } else {
                    // Count the commits in the current response
                    const commitsData = await commitsResponse.json();
                    commitCount = commitsData.length;
                }
            }
            
            // Fetch languages used
            const languagesResponse = await fetch(getLanguagesUrl(username, repo.name));
            let languages = [];
            
            if (languagesResponse.ok) {
                const languagesData = await languagesResponse.json();
                languages = Object.keys(languagesData);
            }
            
            return {
                ...repo,
                commit_count: commitCount,
                languages: languages
            };
        }));
        
        // Display repositories
        displayRepositories(enhancedRepos);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

// Display User Profile
function displayUserProfile(user) {
    profileInfoContainer.innerHTML = `
        <img class="profile-avatar" src="${user.avatar_url}" alt="${user.login}'s avatar">
        <div class="profile-details">
            <h2>${user.name || user.login}</h2>
            <p>${user.bio || ''}</p>
            <div class="profile-stats">
                <div class="stat-item">
                    <i class="fas fa-users"></i>
                    <span>${user.followers} followers</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-user-friends"></i>
                    <span>${user.following} following</span>
                </div>
                <div class="stat-item">
                    <i class="fas fa-code-branch"></i>
                    <span>${user.public_repos} repositories</span>
                </div>
            </div>
        </div>
    `;
}

// Display Repositories
function displayRepositories(repositories) {
    if (repositories.length === 0) {
        repositoriesContainer.innerHTML = '<p class="no-repos">No repositories found</p>';
        return;
    }

    repositoriesContainer.innerHTML = repositories.map(repo => {
        const creationDate = new Date(repo.created_at).toLocaleDateString();
        const updateDate = new Date(repo.updated_at).toLocaleDateString();
        
        return `
            <div class="repository-card">
                <h3 class="repository-name">
                    <a href="${repo.html_url}" target="_blank">
                        <i class="fas fa-book-open"></i> ${repo.name}
                    </a>
                </h3>
                <p class="repository-description">${repo.description || 'No description'}</p>
                <div class="repository-details">
                    <p><i class="fas fa-calendar-plus"></i> Created: ${creationDate}</p>
                    <p><i class="fas fa-calendar-check"></i> Updated: ${updateDate}</p>
                    <p><i class="fas fa-code-commit"></i> Commits: ${repo.commit_count}</p>
                    <p><i class="fas fa-eye"></i> Watchers: ${repo.watchers_count}</p>
                </div>
                <div class="languages-list">
                    ${repo.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('')}
                </div>
                <div class="repository-stats">
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-code"></i>
                        <span>${repo.size} KB</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// UI Helpers
function clearPreviousData() {
    repositoriesContainer.innerHTML = '';
    profileInfoContainer.innerHTML = '';
    errorMessageContainer.style.display = 'none';
}

function showLoading() {
    loadingElement.style.display = 'flex';
}

function hideLoading() {
    loadingElement.style.display = 'none';
}

function showError(message) {
    errorMessageContainer.textContent = message;
    errorMessageContainer.style.display = 'block';
}