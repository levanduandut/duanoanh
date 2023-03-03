const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLYER_STORAGE_KEY = "DO_PLAYER"

const heading = $('header h2')
const cdThumb = $(".cd-thumb")
const audio = $('#audio')
const cd = $(".cd")
const cdWidth = cd.offsetWidth
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const player = $('.player')
const progress = $('.progress')
const btnRandom = $('.btn-random')
const btnRepeat = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isplaying: false,
    isRandom: false,
    config: JSON.parse(localStorage.getItem(PLYER_STORAGE_KEY)) || {},
    setconfig: function (key, val) {
        this.config[key] = val
        localStorage.setItem(PLYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: "Thiêu thân",
            singer: "Bray",
            path: './music/Bray.mp3',
            image: './img/Bray.jpg'
        },
        {
            name: "Không gặp sẽ tốt hơn",
            singer: "Hiền Hồ",
            path: './music/HienHo.mp3',
            image: './img/HienHo.jpg'
        },
        {
            name: "Chia cách bình yên",
            singer: "Hoài Lâm",
            path: './music/HoaiLam.mp3',
            image: './img/HoaiLam.png'
        },
        {
            name: "Bài của Quân",
            singer: "QUân AP",
            path: './music/QuanAp.mp3',
            image: './img/QuanAp.jpg'
        },
        {
            name: "Thiêu thân",
            singer: "Bray",
            path: './music/Bray.mp3',
            image: './img/Bray.jpg'
        },
        {
            name: "Không gặp sẽ tốt hơn",
            singer: "Hiền Hồ",
            path: './music/HienHo.mp3',
            image: './img/HienHo.jpg'
        },
        {
            name: "Chia cách bình yên",
            singer: "Hoài Lâm",
            path: './music/HoaiLam.mp3',
            image: './img/HoaiLam.png'
        },
        {
            name: "Bài của Quân",
            singer: "QUân AP",
            path: './music/QuanAp.mp3',
            image: './img/QuanAp.jpg'
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join("")
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function () {
        const _this = this

        //Xu li cd
        const cdT = cdThumb.animate([
            { transform: 'rotate(260deg)' }
            ,], {
            duration: 10000,
            iteration: Infinity
        })

        cdT.pause()

        document.onscroll = function () {
            const scrTop = window.scrollY | document.documentElement.scrollTop
            const newcdWidth = cdWidth - scrTop
            cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0
            cd.style.opacity = newcdWidth / cdWidth
        }
        playBtn.onclick = function () {
            if (_this.isplaying) {
                audio.pause()
            }
            else {
                audio.play()
            }

        }
        audio.onplay = function () {
            console.log([cdT])
            cdT.play()
            _this.isplaying = true
            player.classList.add("playing")
        }
        audio.onpause = function () {
            _this.isplaying = false
            cdT.pause()
            player.classList.remove("playing")
        }


        audio.ontimeupdate = function () {
            // console.log(this.currentTime / this.duration)
            progress.value = `${this.currentTime / this.duration * 100}`
        }

        progress.onchange = function (e) {
            // console.log(e.target.value)
            audio.currentTime = e.target.value / 100 * audio.duration;
            console.log(audio.currentTime)
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }
            _this.scrollToActiveSong()
            audio.play()
            _this.render()
        }
        prevBtn.onclick = function () {
            _this.scrollToActiveSong()
            _this.prevSong()
            audio.play()
        }

        btnRandom.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            _this.setconfig('isRamdom', _this.isRandom)
            btnRandom.classList.toggle("active", _this.isRandom)
        }

        audio.onended = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.nextSong()
            }

            audio.play()
        }
        btnRepeat.onclick = function () {
            audio.currentTime = 0
            audio.play()
        }

        playlist.onclick = function (e) {
            const song = e.target.closest('.song:not(.active)');

            if (song || e.target.closest('.option')) {
                if (song) {
                    _this.currentIndex = Number(song.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

            }
        }
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    loadCurrentSong: function () {
        console.log(heading, cdThumb, audio)
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    nextSong: function () {
        console.log(this.currentIndex)
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    }
    ,
    nextSong: function () {
        this.currentIndex++
        console.log(this.currentIndex)
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong();
    }
    ,
    prevSong: function () {
        this.currentIndex--
        console.log(this.currentIndex)
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong();
    }
    ,
    loadConfig: function () {
        this.isRandom = this.config.isRandom
    },
    reloadSong: function () {
        this.loadCurrentSong();
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }, 1000);
    },
    start: function () {
        this.loadConfig()
        this.defineProperties()
        this.handleEvents()
        this.loadCurrentSong()
        this.render()
        btnRandom.classList.toggle("active", _this.isRandom)
    }
}
app.start()



