import { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdClose } from "react-icons/md";

interface FileUploaderProps {
  onChange: (name: string, value: string) => void;
  text: string;
  id: string;
  name: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onChange, text, id, name }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const convertFileToBase64 = (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      onChange(name, base64String);
      setFileName(file.name);
    };
    reader.onerror = () => {
      console.error("File reading failed");
    };
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      convertFileToBase64(file);
    }
  };

  const removeFile = () => {
    setFileName(null);
    onChange(name, "");
  };

  return (
    <div className="rounded-lg w-full bg-gray-300 text-gray-700 font-semibold p-3 flex flex-col items-center">
      {!fileName ? (
        <>
          <input
            type="file"
            id={id}
            name={name}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={onFileChange}
            className="hidden"
          />
          <label htmlFor={id} className="flex flex-col items-center cursor-pointer">
            <AiOutlineCloudUpload size={32} />
            <span className="mt-2">{text}</span>
          </label>
        </>
      ) : (
        <div className="flex justify-between items-center w-full bg-white p-2 rounded-md shadow">
          <span className="truncate">{fileName}</span>
          <button onClick={removeFile} className="ml-4 text-red-500">
            <MdClose size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
