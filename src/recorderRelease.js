// The free Screen Recorder downloads (files live in public/downloads).
// Update the version, file names and sizes here when a new release is copied in.
export const RECORDER = {
  version: '1.0.0',
  page: '/products/screen-recorder',
  mac: { label: 'Mac', file: '/downloads/Recorder-1.0.0-mac.dmg', kind: 'DMG', size: '0.4 MB' },
  windows: { label: 'Windows', file: '/downloads/Recorder-1.0.0-windows.zip', kind: 'ZIP', size: '0.6 MB' },
}

// Starts a download from a click, without leaving the page.
export function startDownload(file) {
  const a = document.createElement('a')
  a.href = file
  a.download = ''
  document.body.append(a)
  a.click()
  a.remove()
}

// 'mac' or 'windows' for the visitor's computer, used to put their download first.
export function detectPlatform() {
  const p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || navigator.userAgent
  return /win/i.test(p) ? 'windows' : 'mac'
}
