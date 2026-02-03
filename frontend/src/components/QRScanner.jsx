import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { Flashlight, FlashlightOff } from "lucide-react";

const QRScanner = ({ onClose }) => {
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const trackRef = useRef(null);
  const isProcessing = useRef(false);

  const [torchOn, setTorchOn] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
            focusMode: "continuous",
          }
        };

        const controls = await codeReader.decodeFromConstraints(
          constraints,
          videoRef.current,
          (result) => {
            if (result && !isProcessing.current) {
              isProcessing.current = true;
              const text = result.getText();
              controlsRef.current?.stop();
              
              if (text.startsWith("http")) {
                window.open(text, "_blank", "noopener,noreferrer");
              }
              onClose();
            }
          }
        );

        controlsRef.current = controls;

        const stream = videoRef.current?.srcObject;
        const track = stream?.getVideoTracks?.()[0];
        trackRef.current = track;

        if (track) {
          const capabilities = track.getCapabilities?.();
          
          // 🔦 Handle Torch
          if (capabilities?.torch) {
            setTorchSupported(true);
          }

          // 🎯 Apply Focus and 2x Zoom
          const advancedConstraints = {};

          if (capabilities?.focusMode?.includes("continuous")) {
            advancedConstraints.focusMode = "continuous";
          }

          // ✅ ADDED: Apply 2x Zoom if supported
          // capabilities.zoom returns { min, max, step }
          if (capabilities?.zoom) {
            const zoomValue = Math.min(2, capabilities.zoom.max); // Use 2x or the max possible
            advancedConstraints.zoom = zoomValue;
          }

          if (Object.keys(advancedConstraints).length > 0) {
            await track.applyConstraints({
              advanced: [advancedConstraints]
            });
          }
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startScanner();

    return () => {
      controlsRef.current?.stop();
    };
  }, [onClose]);

  const toggleTorch = async () => {
    if (!trackRef.current) return;
    try {
      await trackRef.current.applyConstraints({
        advanced: [{ torch: !torchOn }]
      });
      setTorchOn(!torchOn);
    } catch (err) {
      console.error("Torch error:", err);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border bg-black shadow-2xl">
      <video
        ref={videoRef}
        className="w-full h-[380px] object-cover"
        muted
        playsInline
      />

      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-64 h-64 border-2 border-indigo-500 rounded-lg opacity-50 animate-pulse" />
      </div>

      {torchSupported && (
        <button
          onClick={toggleTorch}
          type="button"
          className="absolute top-3 right-3 p-3 rounded-full bg-black/60 text-white hover:bg-black/80 z-10"
        >
          {torchOn ? <FlashlightOff size={20} /> : <Flashlight size={20} />}
        </button>
      )}

      {/* Added Zoom Indicator */}
      <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 rounded text-[10px] text-white font-bold uppercase">
        2x Zoom Active
      </div>

      <p className="absolute bottom-0 w-full text-[10px] text-gray-300 text-center py-3 bg-black/60 uppercase tracking-widest">
        Hold 20-30cm away for best focus
      </p>
    </div>
  );
};

export default QRScanner;