
  // ---------- TRACKS DATA (8 songs, extended) ----------
  const tracks = [
    { id: 1, title: "Midnight Drive", artist: "Luna Wave", duration: "3:24", durationSec: 204, cover: "https://picsum.photos/id/104/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { id: 2, title: "Neon Lights", artist: "The Stellar Echoes", duration: "4:12", durationSec: 252, cover: "https://picsum.photos/id/100/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { id: 3, title: "Echoes in the Dark", artist: "Aurora Sky", duration: "3:56", durationSec: 236, cover: "https://picsum.photos/id/96/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
    { id: 4, title: "Golden Hour", artist: "Coastline", duration: "2:48", durationSec: 168, cover: "https://picsum.photos/id/15/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { id: 5, title: "Fading Memories", artist: "Eliot Park", duration: "5:03", durationSec: 303, cover: "https://picsum.photos/id/169/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
    { id: 6, title: "Rise Again", artist: "Nova Collective", duration: "3:35", durationSec: 215, cover: "https://picsum.photos/id/145/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
    { id: 7, title: "City Rain", artist: "Midnight Pulse", duration: "4:01", durationSec: 241, cover: "https://picsum.photos/id/42/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
    { id: 8, title: "Velvet Skies", artist: "Jasmine Veil", duration: "3:48", durationSec: 228, cover: "https://picsum.photos/id/22/300/300", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" }
  ];

  // DOM elements
  const audio = new Audio();
  const playBtn = document.getElementById('playBtn');
  const playIcon = document.getElementById('playIcon');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');
  const progressContainer = document.getElementById('progressContainer');
  const currentTimeSpan = document.getElementById('currentTime');
  const durationSpan = document.getElementById('duration');
  const songTitleEl = document.getElementById('songTitle');
  const songArtistEl = document.getElementById('songArtist');
  const albumCover = document.getElementById('albumCover');
  const volumeSlider = document.getElementById('volumeSlider');
  const repeatBtn = document.getElementById('repeatBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatModeBtn = document.getElementById('repeatModeBtn');
  const shuffleModeBtn = document.getElementById('shuffleModeBtn');
  const speedBtn = document.getElementById('speedBtn');
  const tracklistEl = document.getElementById('tracklist');
  const visualizerBars = document.querySelectorAll('.viz-bar');

  // player state
  let currentIndex = 0;
  let isPlaying = false;
  let repeatState = "none"; // "none", "one", "all"
  let shuffleActive = false;
  let playbackSpeed = 1.0;
  let originalOrder = [...tracks];
  let shuffledOrder = [...tracks];

  // helper: show toast
  function showToast(message) {
    const toast = document.getElementById('toastMsg');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // format sec to mm:ss
  function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  }

  // update active playlist UI
  function updateActivePlaylist() {
    const items = document.querySelectorAll('.track');
    const currentTrackObj = getCurrentTrack();
    items.forEach((item, idx) => {
      const trackData = getTrackByDisplayIndex(idx);
      if (trackData && currentTrackObj && trackData.id === currentTrackObj.id) {
        item.classList.add('active-track');
        const iconSpan = item.querySelector('.playing-icon i');
        if (iconSpan) iconSpan.className = isPlaying ? 'fas fa-waveform' : 'fas fa-play';
      } else {
        item.classList.remove('active-track');
        const iconSpan = item.querySelector('.playing-icon i');
        if (iconSpan) iconSpan.className = 'fas fa-music';
      }
    });
  }

  function getCurrentTrack() {
    const playlist = shuffleActive ? shuffledOrder : originalOrder;
    return playlist[currentIndex];
  }

  function getTrackByDisplayIndex(idx) {
    const playlist = shuffleActive ? shuffledOrder : originalOrder;
    return playlist[idx];
  }

  // load track by index
  function loadTrack(index) {
    const playlist = shuffleActive ? shuffledOrder : originalOrder;
    const track = playlist[index];
    if (!track) return;
    audio.src = track.src;
    songTitleEl.textContent = track.title;
    songArtistEl.textContent = track.artist;
    albumCover.src = track.cover;
    durationSpan.textContent = track.duration;
    audio.load();
    audio.playbackRate = playbackSpeed;
    progressFill.style.width = '0%';
    currentTimeSpan.textContent = "0:00";
    updateActivePlaylist();
    if (isPlaying) {
      audio.play().catch(e => console.log("autoplay blocked", e));
    }
    // start visualizer animation
    startVisualizer();
  }

  // visualizer random bars effect
  let vizInterval = null;
  function startVisualizer() {
    if (vizInterval) clearInterval(vizInterval);
    if (isPlaying) {
      vizInterval = setInterval(() => {
        visualizerBars.forEach(bar => {
          const newH = Math.floor(Math.random() * 28) + 8;
          bar.style.height = `${newH}px`;
        });
      }, 150);
    } else {
      if (vizInterval) clearInterval(vizInterval);
      visualizerBars.forEach(bar => bar.style.height = "12px");
    }
  }

  function playMusic() {
    audio.play();
    isPlaying = true;
    playIcon.classList.remove('fa-play');
    playIcon.classList.add('fa-pause');
    startVisualizer();
    updateActivePlaylist();
  }

  function pauseMusic() {
    audio.pause();
    isPlaying = false;
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    if (vizInterval) clearInterval(vizInterval);
    visualizerBars.forEach(bar => bar.style.height = "12px");
    updateActivePlaylist();
  }

  function togglePlay() {
    if (isPlaying) pauseMusic();
    else playMusic();
  }

  function nextTrackLogic() {
    const playlist = shuffleActive ? shuffledOrder : originalOrder;
    if (repeatState === "one") {
      // replay same track
      audio.currentTime = 0;
      if (!isPlaying) playMusic();
      else audio.play();
      return;
    }
    let nextIdx = currentIndex + 1;
    if (nextIdx >= playlist.length) {
      if (repeatState === "all") {
        nextIdx = 0;
      } else {
        pauseMusic();
        return;
      }
    }
    currentIndex = nextIdx;
    loadTrack(currentIndex);
    if (isPlaying) playMusic();
    else playMusic();
  }

  function prevTrackLogic() {
    const playlist = shuffleActive ? shuffledOrder : originalOrder;
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) {
      if (repeatState === "all") prevIdx = playlist.length - 1;
      else prevIdx = 0;
    }
    currentIndex = prevIdx;
    loadTrack(currentIndex);
    if (isPlaying) playMusic();
    else playMusic();
  }

  // update progress + time
  function updateProgress() {
    if (audio.duration && !isNaN(audio.duration)) {
      const percent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${percent}%`;
      currentTimeSpan.textContent = formatTime(audio.currentTime);
    }
  }

  function seek(e) {
    const rect = progressContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percent = x / width;
    if (audio.duration) {
      audio.currentTime = percent * audio.duration;
    }
  }

  function onTrackEnd() {
    if (repeatState === "one") {
      audio.currentTime = 0;
      playMusic();
      return;
    }
    const playlist = shuffleActive ? shuffledOrder : originalOrder;
    let next = currentIndex + 1;
    if (next >= playlist.length) {
      if (repeatState === "all") {
        currentIndex = 0;
        loadTrack(0);
        playMusic();
      } else {
        pauseMusic();
        currentIndex = 0;
      }
    } else {
      currentIndex = next;
      loadTrack(currentIndex);
      playMusic();
    }
  }

  // volume
  function setVolume(val) {
    audio.volume = val;
    volumeSlider.value = val;
  }

  // repeat mode change
  function cycleRepeatMode() {
    if (repeatState === "none") {
      repeatState = "one";
      repeatModeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> 1';
      showToast("Repeat: Track loop");
    } else if (repeatState === "one") {
      repeatState = "all";
      repeatModeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> All';
      showToast("Repeat: Playlist loop");
    } else {
      repeatState = "none";
      repeatModeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Off';
      showToast("Repeat: Off");
    }
  }

  // Shuffle toggle
  function toggleShuffle() {
    shuffleActive = !shuffleActive;
    if (shuffleActive) {
      // create shuffled copy excluding current track but preserve current?
      let currentTrack = getCurrentTrack();
      let otherTracks = originalOrder.filter(t => t.id !== currentTrack.id);
      for (let i = otherTracks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherTracks[i], otherTracks[j]] = [otherTracks[j], otherTracks[i]];
      }
      shuffledOrder = [currentTrack, ...otherTracks];
      currentIndex = 0;
      shuffleModeBtn.innerHTML = '<i class="fas fa-random"></i> On';
      showToast("Shuffle mode ON");
    } else {
      shuffledOrder = [...originalOrder];
      // map current index based on original track id
      const currentTrackId = getCurrentTrack().id;
      currentIndex = originalOrder.findIndex(t => t.id === currentTrackId);
      if (currentIndex === -1) currentIndex = 0;
      shuffleModeBtn.innerHTML = '<i class="fas fa-random"></i> Off';
      showToast("Shuffle mode OFF");
    }
    loadTrack(currentIndex);
    if (isPlaying) playMusic();
    renderPlaylist();
  }

  // Speed change
  const speeds = [0.75, 1.0, 1.25, 1.5];
  let speedIdx = 1;
  function changeSpeed() {
    speedIdx = (speedIdx + 1) % speeds.length;
    playbackSpeed = speeds[speedIdx];
    audio.playbackRate = playbackSpeed;
    speedBtn.textContent = `${playbackSpeed}x`;
    showToast(`Playback speed: ${playbackSpeed}x`);
  }

  // render playlist
  function renderPlaylist() {
    const playlist = shuffleActive ? shuffledOrder : originalOrder;
    tracklistEl.innerHTML = '';
    playlist.forEach((track, idx) => {
      const li = document.createElement('li');
      li.className = 'track';
      if (getCurrentTrack() && getCurrentTrack().id === track.id) li.classList.add('active-track');
      li.innerHTML = `
        <div class="track-left">
          <span class="track-title">${escapeHtml(track.title)}</span>
          <span class="track-artist">${escapeHtml(track.artist)}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="track-duration">${track.duration}</span>
          <span class="playing-icon"><i class="fas ${(getCurrentTrack() && getCurrentTrack().id === track.id && isPlaying) ? 'fa-waveform' : 'fa-music'}"></i></span>
        </div>
      `;
      li.addEventListener('click', () => {
        currentIndex = idx;
        loadTrack(currentIndex);
        if (isPlaying) playMusic();
        else playMusic();
      });
      tracklistEl.appendChild(li);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // event listeners
  function bindEvents() {
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', prevTrackLogic);
    nextBtn.addEventListener('click', nextTrackLogic);
    progressContainer.addEventListener('click', seek);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', onTrackEnd);
    volumeSlider.addEventListener('input', (e) => setVolume(parseFloat(e.target.value)));
    repeatModeBtn.addEventListener('click', cycleRepeatMode);
    shuffleModeBtn.addEventListener('click', toggleShuffle);
    speedBtn.addEventListener('click', changeSpeed);
    audio.addEventListener('loadedmetadata', () => {
      durationSpan.textContent = formatTime(audio.duration);
    });
  }

  // init
  function init() {
    originalOrder = [...tracks];
    shuffledOrder = [...tracks];
    shuffleActive = false;
    currentIndex = 0;
    repeatState = "none";
    playbackSpeed = 1.0;
    audio.volume = 0.7;
    volumeSlider.value = 0.7;
    audio.playbackRate = 1.0;
    bindEvents();
    renderPlaylist();
    loadTrack(0);
    isPlaying = false;
    playIcon.classList.remove('fa-pause');
    playIcon.classList.add('fa-play');
    repeatModeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Off';
    shuffleModeBtn.innerHTML = '<i class="fas fa-random"></i> Off';
    speedBtn.textContent = "1.0x";
  }

  init();
