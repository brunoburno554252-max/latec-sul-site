import { useState, useRef, useCallback } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ZoomIn, ZoomOut, RotateCcw, RotateCw, Check, X, Move } from "lucide-react";

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
  minWidth?: number;
  minHeight?: number;
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageCropper({
  imageSrc,
  onCropComplete,
  onCancel,
  aspectRatio = 16 / 9,
  minWidth = 100,
  minHeight = 100,
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    },
    [aspectRatio]
  );

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;

    const rotateRads = (rotate * Math.PI) / 180;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    ctx.restore();

    // Convert canvas to blob and create URL
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          onCropComplete(croppedImageUrl);
        }
      },
      "image/jpeg",
      0.95
    );
  }, [completedCrop, scale, rotate, onCropComplete]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleRotateLeft = () => {
    setRotate((prev) => prev - 90);
  };

  const handleRotateRight = () => {
    setRotate((prev) => prev + 90);
  };

  const handleReset = () => {
    setScale(1);
    setRotate(0);
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, aspectRatio));
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Move className="w-5 h-5" />
            Ajustar Imagem
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Instruções */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-amber-700">
            <strong>Dica:</strong> Arraste a área de seleção para posicionar a imagem. Use os controles abaixo para zoom e rotação.
          </div>

          {/* Área de Crop */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ maxHeight: "50vh" }}>
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              minWidth={minWidth}
              minHeight={minHeight}
              className="max-h-[50vh]"
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Imagem para cortar"
                style={{
                  transform: `scale(${scale}) rotate(${rotate}deg)`,
                  maxHeight: "50vh",
                  maxWidth: "100%",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>

          {/* Controles */}
          <div className="flex flex-col gap-4 bg-gray-50 rounded-lg p-4">
            {/* Zoom */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-16">Zoom:</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Slider
                value={[scale]}
                min={0.5}
                max={3}
                step={0.1}
                onValueChange={([value]) => setScale(value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500 w-12">{Math.round(scale * 100)}%</span>
            </div>

            {/* Rotação */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-16">Rotação:</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRotateLeft}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Slider
                value={[rotate]}
                min={-180}
                max={180}
                step={1}
                onValueChange={([value]) => setRotate(value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRotateRight}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-500 w-12">{rotate}°</span>
            </div>

            {/* Reset */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                className="text-gray-600"
              >
                Resetar ajustes
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button type="button" onClick={handleCropComplete} className="bg-gradient-to-r from-[#1B8C3D] to-[#D4A017] hover:from-[#146B2F] hover:to-[#B8860B]/90">
            <Check className="w-4 h-4 mr-2" />
            Aplicar Ajustes
          </Button>
        </DialogFooter>

        {/* Canvas oculto para processamento */}
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
}
