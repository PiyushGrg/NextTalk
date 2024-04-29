import { Modal, Upload, Button } from "antd";
import React from "react";
import toast from "react-hot-toast";

function ImageSelector({
  showImageSelector,
  setShowImageSelector,
  selectedImageFile,
  setSelectedImageFile,
  onSend,
  loading = false,
}: {
  showImageSelector: boolean;
  setShowImageSelector: React.Dispatch<React.SetStateAction<boolean>>;
  selectedImageFile: File | null;
  setSelectedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  onSend: () => void;
  loading?: boolean;
}) {
  return (
    <Modal
      open={showImageSelector}
      onCancel={() => {
        setSelectedImageFile(null);
        setShowImageSelector(false);
      }}
      title={
        <span className="text-xl font-semibold text-center text-rose-500">
          Select an image
        </span>
      }
      centered
      footer={null}
    >
      <Upload
        beforeUpload={(file) => {
            const isImage = /\.(png|jpg|jpeg)$/i.test(file.name);
            if (!isImage) {
                toast.error('Only image files are allowed');
                setSelectedImageFile(null);
                return false;
            }
            if(isImage){
                setSelectedImageFile(file);
                return false;
            }
        }}
        accept=".png,.jpg,.jpeg"
        className="cursor-pointer"
        onRemove={() => setSelectedImageFile(null)}
        showUploadList={{ showPreviewIcon: false }}
        listType="picture-card"
        maxCount={1}
      >
        <span className="p-5 text-xs text-gray-500">
          Click here to select an image
        </span>
      </Upload>

      <div className="flex justify-end gap-5 mt-5">
        <Button
          className="bg-primary-dark text-white px-3 rounded-md"
          onClick={() => {
            setSelectedImageFile(null);
            setShowImageSelector(false);
          }}
        >
          Cancel
        </Button>
        <Button
          className="bg-rose-500 text-white px-3 rounded-md"
          onClick={onSend}
          disabled={!selectedImageFile}
          loading={loading}
        >
          Send
        </Button>
      </div>
    </Modal>
  );
}

export default ImageSelector;