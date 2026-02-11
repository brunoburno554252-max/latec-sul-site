import { useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import ReactCrop, { type Crop as CropType, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  aspectRatio?: number;
  enableCrop?: boolean;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
}

export default function ImageUpload({ 
  value, 
  onChange, 
  onRemove, 
  aspectRatio = 16 / 9,
  enableCrop = true 
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string>("");
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const uploadMutation = trpc.upload.uploadImage.useMutation();

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspectRatio));
  }, [aspectRatio]);

  const uploadImage = async (base64: string, filename: string, contentType: string) => {
    try {
      const result = await uploadMutation.mutateAsync({ base64, filename, contentType });
      onChange(result.url);
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Erro ao fazer upload da imagem");
    } finally {
      setIsUploading(false);
      setShowCropper(false);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setOriginalFile(file);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const src = reader.result?.toString() || "";
      setTempImageSrc(src);
      if (enableCrop) {
        setShowCropper(true);
      } else {
        setIsUploading(true);
        uploadImage(src, file.name, file.type);
      }
    });
    reader.readAsDataURL(file);
  }, [enableCrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) return;
    setIsUploading(true);
    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      setIsUploading(false);
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const base64 = canvas.toDataURL(originalFile?.type || "image/jpeg");
    uploadImage(base64, originalFile?.name || "image.jpg", originalFile?.type || "image/jpeg");
  }, [completedCrop, originalFile]);

  const handleUploadDirect = () => {
    if (tempImageSrc && originalFile) {
      setIsUploading(true);
      uploadImage(tempImageSrc, originalFile.name, originalFile.type);
    }
  };

  return (
    <div className="space-y-4">
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-gray-100 shadow-sm">
          <img src={value} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" variant="destructive" size="sm" onClick={onRemove} className="rounded-full">
              <X className="w-4 h-4 mr-2" /> Remover
            </Button>
          </div>
        </div>
      ) : (
        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${isDragActive ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:border-pink-400 hover:bg-gray-50"}`}>
          <input {...getInputProps()} />
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
            {isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Clique ou arraste uma imagem</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP até 50MB</p>
          </div>
        </div>
      )}

      <Dialog open={showCropper} onOpenChange={setShowCropper}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Ajustar Imagem</DialogTitle></DialogHeader>
          <div className="space-y-6">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center" style={{ maxHeight: "45vh" }}>
              {tempImageSrc && (
                <ReactCrop crop={crop} onChange={(_, percentCrop) => setCrop(percentCrop)} onComplete={(c) => setCompletedCrop(c)} aspectRatio={aspectRatio} className="max-h-[45vh]">
                  <img ref={imgRef} src={tempImageSrc} alt="Crop" style={{ maxHeight: "45vh", maxWidth: "100%" }} onLoad={onImageLoad} />
                </ReactCrop>
              )}
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setShowCropper(false)}>Cancelar</Button>
            <Button type="button" variant="secondary" onClick={handleUploadDirect} disabled={isUploading}>Enviar sem cortar</Button>
            <Button type="button" onClick={handleCropComplete} className="bg-pink-600 hover:bg-pink-700" disabled={isUploading}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 mr-2" />} Aplicar Corte
            </Button>
          </DialogFooter>
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>
    </div>
  );
}
