import { useState, useEffect } from "react";

interface ImageInputProps {
  image: File | null;
  setImage: (image: File | null) => void;
  existingImageUrl?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({
  image,
  setImage,
  existingImageUrl,
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        setImage(file);
      } else {
        alert("Please select a valid image file.");
      }
    }
  };

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImageUrl(objectUrl);

      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setImageUrl(null);
    }
  }, [image]);

  return (
    <div className="image-input">
      <input
        type="file"
        onChange={handleImageChange}
        aria-label="Select an image"
      />
      {(image || existingImageUrl) ? (
        <img
          src={imageUrl || existingImageUrl || ""}
          alt="Selected"
          className="selected-image"
        />
      ) : (
        <span>No image selected</span>
      )}
    </div>
  );
};

export default ImageInput;
