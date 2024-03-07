const client_id = 'ce970393ed3e47039cbec3fa18cd396c';
const client_secret = '099161de866c4da8a6e971654ea8aa0c';
const refresh_token = 'AQDrfh-bIEKWoc8EJEOuCbtmLGMsFVEKN-_m434gDJJwk05yeaEpHAV_AIuhkOox2UkHoAmKzZPdqMGH9GiCZyAAUBvzNuW40S2CDS888ujULZbOyBm6IE7cSwgbEdoKgfI';

let lastPlayedItem = null;

const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
    },
    form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
    },
    json: true
};

const getAccessToken = async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: new URLSearchParams(authOptions.form)
    });
    const { access_token, expires_in } = await response.json();
    return { access_token, expires_in };
}

const getNowPlaying = async () => {
    const { access_token } = await getAccessToken();
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    });
    const { item } = await response.json();
    return item;
}

const displayNowPlaying = async () => {
    try {
        const item = await getNowPlaying();
        if (item) {
            const { name, album } = item;
            const { name: artistName } = album.artists[0];
            const artistLink = album.artists[0].external_urls.spotify;
            const songInfo = document.getElementById('song-info');
            songInfo.innerHTML = `
                <div class="song container">
                    <div class="cover" style=" padding-bottom: 0px;">
                        <a href="${item.external_urls.spotify}" target="_blank" ><img src="${album.images[0].url}" style="width: 50px; border-radius: 50%; "></a> 
                    </div>
                    <div class="song-details container" style="margin-left: 10px; display: flex;">
                        <h4 id="playing-title" style="flex: none;">Now Playing on spotify:</h4>
                        <div style="flex: none; display: flex; flex-direction: column;">
                            <a href="${item.external_urls.spotify}" style="font-size: 0.95rem; width: fit-content;" target="_blank" class="song-title">${name}</a>
                        </div>
                        <a href="${artistLink}" target="_blank" style="font-size: 0.8rem;">by ${artistName}</a>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching now playing:', error);
        const songInfo = document.getElementById('song-info');
                songInfo.innerHTML = `
            <div class="song">
                <img src="assets/spotify-color-svgrepo-com.svg" alt="spotify logo" style="width: 50px; border-radius: 50%;">
                <h4 id="offline-title">Nothing is currently playing.</h4>
            </div>
        `;
    }
}

displayNowPlaying();

