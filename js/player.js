const clientId = 'ce970393ed3e47039cbec3fa18cd396c';
const clientSecret = '7b47c120683748bbaa4ddb556b45b7ee';
const refreshToken = 'AQCcAPNjJKKx0f5UyuLN3WyFOQ69a0HpHx5tdIY5PWCWVsV5g9I_njuPkFaF5453C8yQHpF0w8WTOsG2-gwhpe31fYZwNw74DnW_pgJMGbGZJ_icuhJ_t2b5oyYRXyv5ti0';

const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    },
    form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    }
};

// Function to get a new access token
const getAccessToken = async () => {
    try {
        const response = await fetch(authOptions.url, {
            method: 'POST',
            headers: {
                Authorization: authOptions.headers.Authorization,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(authOptions.form)
        });

        if (!response.ok) {
            throw new Error(`Failed to get access token: ${response.status}`);
        }

        const { access_token: accessToken, expires_in: expiresIn } = await response.json();
        return { accessToken, expiresIn };
    } catch (error) {
        console.error('Error fetching access token:', error);
        return null;
    }
};

// Function to fetch currently playing track
const getNowPlaying = async () => {
    try {
        const tokenData = await getAccessToken();
        if (!tokenData) return null;

        const { accessToken } = tokenData;
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            console.warn('No currently playing track or unauthorized.');
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching the currently playing track:', error);
        return null;
    }
};

// Function to display currently playing track on the webpage
const displayNowPlaying = async () => {
    try {
        const nowPlaying = await getNowPlaying();
        const songInfoElement = document.getElementById('song-info');

        if (!songInfoElement) {
            console.error('Element with ID "song-info" not found.');
            return;
        }

        if (nowPlaying && nowPlaying.item) {
            const { name: songName, album } = nowPlaying.item;
            const { name: artistName } = album.artists[0] || {};
            const artistLink = album.artists[0]?.external_urls.spotify || '#';
            const albumCover = album.images[0]?.url || 'default-image.jpg';

            songInfoElement.innerHTML = `
                <div class="song container">
                    <div class="cover" style="padding-bottom: 0px;">
                        <a href="${album.external_urls.spotify}" target="_blank">
                            <img src="${albumCover}" style="width: 50px; border-radius: 50%;">
                        </a>
                    </div>
                    <div class="song-details container" style="margin-left: 10px; display: flex;">
                        <h4 id="playing-title" style="flex: none;">Now Playing on Spotify:</h4>
                        <div style="flex: none; display: flex; flex-direction: column;">
                            <a href="${album.external_urls.spotify}" target="_blank" class="song-title" style="font-size: 0.95rem; width: fit-content;">${songName}</a>
                            <a href="${artistLink}" target="_blank" style="font-size: 0.8rem;">by ${artistName}</a>
                        </div>
                    </div>
                </div>
            `;
        } else {
            songInfoElement.innerHTML = `
                <div class="song">
                    <img src="assets/spotify-color-svgrepo-com.svg" alt="spotify logo" style="width: 50px; border-radius: 50%;">
                    <h4 id="offline-title">Nothing is currently playing.</h4>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error displaying the currently playing track:', error);
    }
};

// Call the function to display the currently playing track
displayNowPlaying();
