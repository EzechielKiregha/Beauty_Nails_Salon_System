import { Html5Qrcode } from "html5-qrcode"
import { useEffect } from "react"
import { toast } from "sonner"

export function QRScanner({
  onClose,
  onScan
}: {
  onClose: () => void
  onScan: (value: string) => void
}) {
  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader")

    scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      (decodedText) => {
        onScan(decodedText)
        scanner.stop()
      },
      (errorMessage) => {
        toast(`QR scan error: ${errorMessage}`)
      }
    )

    return () => {
      scanner.stop().catch(() => { })
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div id="qr-reader" className="w-75" />
      <button onClick={onClose} className="mt-4 text-white">Close</button>
    </div>
  )
}