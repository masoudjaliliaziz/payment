import { useState, useRef, useImperativeHandle, forwardRef } from "react";
import { toast } from "react-toastify";

interface FileUploaderProps {
  orderNumber?: string;
  subFolder?: string;
  title?: string;
  inputId: string; // اضافه شد
}

export interface FileUploaderHandle {
  getFile: () => File | null;
  clearFile: () => void;
  uploadFile: () => Promise<void>;
}

const FileUploader = forwardRef<FileUploaderHandle, FileUploaderProps>(
  ({ orderNumber, subFolder, title, inputId }, ref) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      getFile: () => selectedFile,
      clearFile: () => {
        setSelectedFile(null);
        setUploadStatus("");
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
      uploadFile: async () => {
        if (!selectedFile) {
          setUploadStatus("لطفا یک فایل انتخاب کنید");
          return;
        }
        if (!orderNumber) {
          setUploadStatus("شماره سفارش معتبر نیست");
          return;
        }

        const cleanOrderNumber = orderNumber.replace(/[#%*<>?/\\|]/g, "_");
        const isCheckPic = title === "تصویر چک";
        const subTypeFolder = isCheckPic ? "checkPic" : "checkPicConfirm";
        const webUrl = "https://crm.zarsim.com";
        const libraryName = "customer_checks";
        const fullFolderPath = `${libraryName}/${cleanOrderNumber}/${subFolder}/${subTypeFolder}`;

        try {
          const contextInfo = await fetch(`${webUrl}/_api/contextinfo`, {
            method: "POST",
            headers: { Accept: "application/json;odata=verbose" },
          });
          const data = await contextInfo.json();
          const digest = data.d.GetContextWebInformation.FormDigestValue;

          const createFolder = (path: string) =>
            fetch(`${webUrl}/_api/web/folders/add('${path}')`, {
              method: "POST",
              headers: {
                Accept: "application/json;odata=verbose",
                "X-RequestDigest": digest,
              },
            }).catch((err) => {
              console.error("ایجاد پوشه ناموفق بود:", err.message);
            });

          await createFolder(`${libraryName}/${cleanOrderNumber}`);
          await createFolder(`${libraryName}/${cleanOrderNumber}/${subFolder}`);
          await createFolder(fullFolderPath);

          const cleanFileName = selectedFile.name.replace(/[#%*<>?/\\|]/g, "_");
          const arrayBuffer = await selectedFile.arrayBuffer();

          const uploadRes = await fetch(
            `${webUrl}/_api/web/GetFolderByServerRelativeUrl('${fullFolderPath}')/Files/add(overwrite=true, url='${cleanFileName}')`,
            {
              method: "POST",
              body: arrayBuffer,
              headers: {
                Accept: "application/json;odata=verbose",
                "X-RequestDigest": digest,
              },
            }
          );

          if (uploadRes.ok) {
            toast.success(`فایل ${selectedFile.name} با موفقیت آپلود شد`);
            setUploadStatus("فایل با موفقیت آپلود شد");
            setUploadProgress(100);
          } else {
            throw new Error("خطا در آپلود فایل");
          }
        } catch (error) {
          console.error("خطا در آپلود:", error);
          toast.error("خطا در آپلود فایل");
          setUploadStatus("خطا در آپلود فایل");
          setUploadProgress(0);
        }
      },
    }));

    return (
      <div
        className="
          flex justify-between items-center gap-5 px-4 py-1.5
           border-2 border-primary rounded-md
          "
      >
        <label
          htmlFor={inputId}
          className="
              rounded-md 
             p-2
            bg-gray-800 text-white flex justify-center items-center 
            cursor-pointer transition-colors duration-300
            hover:bg-white hover:text-gray-800
          "
        >
          {title}
        </label>

        <input
          id={inputId}
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
              setUploadStatus("");
              setUploadProgress(0);
            }
          }}
        />

        {selectedFile ? (
          <div className="flex items-center justify-between gap-3 ">
            <p className="text-sm font-bold ">{selectedFile.name}</p>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setUploadStatus("");
                setUploadProgress(0);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              aria-label="پاک کردن فایل"
              className="
    w-[30px] h-[30px]
    flex items-center justify-center
    bg-red-600 text-white rounded-md 
    text-lg font-bold cursor-pointer transition-colors duration-300
    hover:bg-white hover:text-red-600
  "
            >
              ×
            </button>
          </div>
        ) : (
          <p className="text-sm  ">هنوز فایلی انتخاب نشده</p>
        )}

        {uploadStatus && (
          <div
            className={`font-bold ${
              uploadProgress === 100 ? "text-green-700" : "text-red-700"
            }`}
          >
            {uploadStatus}
          </div>
        )}
      </div>
    );
  }
);

export { FileUploader };
