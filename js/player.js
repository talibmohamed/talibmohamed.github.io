const clientId = '099161de866c4da8a6e971654ea8aa0c';
const clientSecret = 'ce970393ed3e47039cbec3fa18cd396c';
const refreshToken = 'AQDrfh-bIEKWoc8EJEOuCbtmLGMsFVEKN-_m434gDJJwk05yeaEpHAV_AIuhkOox2UkHoAmKzZPdqMGH9GiCZyAAUBvzNuW40S2CDS888ujULZbOyBm6IE7cSwgbEdoKgfI';
let lastPlayedItem = null;

const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`)
    },
    form: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    },
    json: true
};

// Function to get a new access token
const getAccessToken = async () => {
    const response = await fetch(authOptions.url, {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`)
        },
        body: new URLSearchParams(authOptions.form)
    });

    const { access_token: accessToken, expires_in: expiresIn } = await response.json();
    return { accessToken, expiresIn };
};

// Function to fetch currently playing track
const getNowPlaying = async () => {
    const { accessToken } = await getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const { item } = await response.json();
    return item;
};

// Function to display currently playing track on the webpage
const displayNowPlaying = async () => {
    try {
        const nowPlaying = await getNowPlaying();
        const songInfoElement = document.getElementById('song-info');

        if (nowPlaying) {
            const { name: songName, album } = nowPlaying;
            const { name: artistName } = album.artists[0];
            const artistLink = album.artists[0].external_urls.spotify;
            const albumCover = album.images[0].url;

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
        console.error('Error fetching the currently playing track:', error);
    }
};

// Call the function to display the currently playing track
displayNowPlaying();
