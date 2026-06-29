import { useRef, useEffect, useState, useCallback } from 'react'
import { Camera, Upload, RotateCcw, Check } from 'lucide-react'
import { analyzePixels, type PixelQualityResult } from '../../lib/imageQuality'
import { QualityPanel } from './QualityPanel'

type CameraState = 'idle' | 'loading' | 'live' | 'captured' | 'upload' | 'error'

interface Props {
  label: string
  onCapture: (result: PixelQualityResult) => void
  captured: boolean
}

export function CameraCapture({ label, onCapture, captured }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [state, setState] = useState<CameraState>('idle')
  const [quality, setQuality] = useState<PixelQualityResult | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }, [])

  useEffect(() => () => {
    stopStream()
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopStream])

  const processCanvas = useCallback((canvas: HTMLCanvasElement) => {
    if (!canvas.width || !canvas.height) return
    const ctx = canvas.getContext('2d')!
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const result = analyzePixels(imageData.data, canvas.width, canvas.height)
    setPreviewUrl(canvas.toDataURL('image/jpeg', 0.85))
    setQuality(result)
    if (result.eligible) onCapture(result)
  }, [onCapture])

  const startCamera = async () => {
    setState('loading')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setState('live')
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Kamera tidak tersedia')
      setState('error')
    }
  }

  const captureFrame = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    if (!video.videoWidth || !video.videoHeight) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(video, 0, 0)
    processCanvas(canvas)
    stopStream()
    setState('captured')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setState('upload')
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = canvasRef.current!
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      processCanvas(canvas)
      setState('captured')
    }
    img.src = url
  }

  const retry = () => {
    setQuality(null)
    setPreviewUrl(null)
    setState('idle')
  }

  return (
    <div className="card">
      {/* Hidden off-screen canvas — only one canvas ref, avoids getImageData width=0 bug */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="card-header">
        <h3 className="card-title">{label}</h3>
        {captured && <span className="badge badge-info">Selesai</span>}
      </div>

      {state === 'idle' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{
            height: 180, background: 'var(--color-surface-subtle)',
            borderRadius: 'var(--radius-md)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: '2px dashed var(--color-border)',
          }}>
            <Camera size={40} color="var(--color-border-strong)" />
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={startCamera}>
              <Camera size={16} /> Buka Kamera
            </button>
            <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
              <Upload size={16} /> Upload
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          </div>
        </div>
      )}

      {state === 'loading' && (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-muted)' }}>
          Memuat kamera…
        </div>
      )}

      {state === 'upload' && (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-ink-muted)' }}>
          Memproses…
        </div>
      )}

      {state === 'live' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <video
            ref={videoRef}
            style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: 240, objectFit: 'cover', background: '#000' }}
            muted playsInline
          />
          <button className="btn btn-action btn-lg" style={{ width: '100%' }} onClick={captureFrame}>
            <Camera size={18} /> Ambil Foto
          </button>
        </div>
      )}

      {state === 'captured' && quality && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview foto yang diambil"
              style={{ width: '100%', borderRadius: 'var(--radius-md)', maxHeight: 200, objectFit: 'cover' }}
            />
          )}
          {quality.eligible ? (
            <div className="alert alert-success">
              <Check size={16} /> Kualitas foto memenuhi syarat
            </div>
          ) : (
            <div className="alert alert-warning">
              <div>
                <strong>Foto belum memenuhi syarat:</strong>
                <ul style={{ marginTop: 4, paddingLeft: 16 }}>
                  {quality.feedback.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          )}
          <QualityPanel quality={quality} />
          <button className="btn btn-ghost" onClick={retry}>
            <RotateCcw size={15} /> Ulangi Foto
          </button>
        </div>
      )}

      {state === 'error' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="alert alert-danger">{errorMsg || 'Kamera tidak tersedia'}</div>
          <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> Upload foto
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
        </div>
      )}
    </div>
  )
}
