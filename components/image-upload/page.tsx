import { useState } from "react";
import Resizer from "react-image-file-resizer";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";

interface ImageUploaderProps {
  onChange: (name: string, value: string) => void;
  text: string;
  id: string;
  name: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onChange, text, id, name }) => {
  const [preview, setPreview] = useState<string | null>(null);

  // Function to resize and compress image before setting formData
  const handleImageUpload = (file: File) => {
    Resizer.imageFileResizer(
      file,
      100,
      100,
      "JPEG",
      80,
      0,
      (resizedImage) => {
        const base64WithPrefix = resizedImage as string; // Already includes 'data:image/jpeg;base64,...'
        onChange(name, base64WithPrefix);
        setPreview(base64WithPrefix);
      },
      "base64"
    );
  };
  
  

  // Replacing `handleImageChange` with `onFileChange`
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onChange(name, ""); // Clear uploaded image
  };

  return (
    <div className="rounded-lg w-full py-5 bg-gray-300 text-gray-700 font-semibold p-1 flex flex-col items-center">
      {!preview ? (
        <>
          <input
            type="file"
            id={id}
            name={name}
            accept="image/*"
            className="hidden"
            onChange={onFileChange} // <-- Use onFileChange here
          />
          <label htmlFor={id} className="cursor-pointer flex flex-row items-center gap-x-3">
            <AiOutlineCloudUpload size={24} />
            <p className="capitalize">{text}</p>
          </label>
        </>
      ) : (
        <div className="relative w-full flex flex-col items-center">
          <img src={preview} alt="Preview" className="w-full h-auto rounded-lg" />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
          >
            <MdClose size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
