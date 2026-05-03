import { useState, useRef, useEffect, useCallback } from 'react'

export function useAudioPlayer() {
  const audioRef = useRef(new Audio())
  const analyserRef = useRef(null)
  const sourceRef = useRef(null)
  const animFrameRef = useRef(null)
  const barsRef = useRef(new Uint8Array(64))

  const [playlist, setPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [isShuffle, setIsShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('none') // 'none' | 'all' | 'one'
  const [analyserBars, setAnalyserBars] = useState(new Uint8Array(64))

  const currentTrack = playlist[currentIndex] ?? null

  // ── Web Audio API setup ──────────────────────────────────────────────────
  const initAnalyser = useCallback(() => {
    const audio = audioRef.current
    if (sourceRef.current) return // already wired

    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 128
    analyser.smoothingTimeConstant = 0.8
    analyserRef.current = analyser

    const source = ctx.createMediaElementSource(audio)
    source.connect(analyser)
    analyser.connect(ctx.destination)
    sourceRef.current = source

    const tick = () => {
      const data = new Uint8Array(analyser.frequencyBinCount)
      analyser.getByteFrequencyData(data)
      barsRef.current = data
      setAnalyserBars(new Uint8Array(data))
      animFrameRef.current = requestAnimationFrame(tick)
    }
    tick()
  }, [])

  // ── Load tracks from file input ─────────────────────────────────────────
  const loadFiles = useCallback((files) => {
    const tracks = Array.from(files).map((file, i) => ({
      id: `${file.name}-${file.lastModified}-${i}`,
      name: stripExt(file.name),
      file,
      url: URL.createObjectURL(file),
      duration: 0,
    }))
    setPlaylist(tracks)
    setCurrentIndex(0)
    setCurrentTime(0)
    setIsPlaying(false)
  }, [])

  // ── Core audio events ───────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    const onLoaded = () => setDuration(audio.duration || 0)
    const onTime = () => setCurrentTime(audio.currentTime)
    const onEnded = () => handleEnded()
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      cancelAnimationFrame(animFrameRef.current)
    }
  }, []) // eslint-disable-line

  // ── Load new track when index changes ───────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current
    if (!currentTrack) return
    audio.src = currentTrack.url
    audio.volume = volume
    audio.load()
    if (isPlaying) audio.play().catch(() => {})
  }, [currentIndex, playlist]) // eslint-disable-line

  // ── Volume sync ─────────────────────────────────────────────────────────
  useEffect(() => {
    audioRef.current.volume = volume
  }, [volume])

  // ── handleEnded ─────────────────────────────────────────────────────────
  function handleEnded() {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
      return
    }
    if (repeatMode === 'all' || isShuffle) {
      next()
    } else if (currentIndex < playlist.length - 1) {
      next()
    } else {
      setIsPlaying(false)
    }
  }

  // ── Controls ─────────────────────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!currentTrack) return
    if (audio.paused) {
      initAnalyser()
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [currentTrack, initAnalyser])

  const next = useCallback(() => {
    setCurrentIndex(prev => {
      if (isShuffle) {
        let r
        do { r = Math.floor(Math.random() * playlist.length) } while (r === prev && playlist.length > 1)
        return r
      }
      return (prev + 1) % playlist.length
    })
    setIsPlaying(true)
  }, [isShuffle, playlist.length])

  const prev = useCallback(() => {
    const audio = audioRef.current
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      return
    }
    setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length)
    setIsPlaying(true)
  }, [playlist.length])

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
  }, [])

  const cycleRepeat = useCallback(() => {
    setRepeatMode(m => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none')
  }, [])

  const playAt = useCallback((index) => {
    setCurrentIndex(index)
    setIsPlaying(true)
    setTimeout(() => audioRef.current.play().catch(() => {}), 50)
  }, [])

  return {
    playlist, currentTrack, currentIndex,
    isPlaying, duration, currentTime, volume, isShuffle, repeatMode, analyserBars,
    loadFiles, togglePlay, next, prev, seek,
    setVolume, setIsShuffle, cycleRepeat, playAt,
  }
}

function stripExt(name) {
  return name.replace(/\.[^/.]+$/, '')
}
