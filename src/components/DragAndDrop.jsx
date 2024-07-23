import React, { startTransition } from "react";
import FileUpload from "react-mui-fileuploader";

import Grid from "@mui/material/Grid";
import { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const DragAndDrop=({handleImage}) =>{
    const [filesToUpload, setFilesToUpload] = useState([])
    const [base64Image, setBase64Image] = useState('');

    const handleFilesChange = (files) => {
        if (files.length > 0) {
        // Update chosen files
        setFilesToUpload([ ...files ])
        handleImage([ ...files ])
        }
      };

    const handleFileUploadError = (error) => {
      console.error(error);
    };
    const inputStyles = {
        background: '#f2f2f2',
        border: 'none',
        borderRadius: '5px',
        padding: '10px',
      };
    
  return (
    <FileUpload
      getBase64={false}
      multiFile={false}
      disabled={false}
      title="My awesome file uploader"
      header="[Drag to drop]"
      leftLabel="or"
      rightLabel="to select files"
      buttonLabel="click here"
      buttonRemoveLabel="Remove all"
      maxFileSize={10}
      maxUploadFiles={1}
      maxFilesContainerHeight={357}
      acceptedType={"image/*"}
      errorSizeMessage={"fill it or remove it to use the default error message"}
      //allowedExtensions={["jpg", "jpeg"]}
      onFilesChange={handleFilesChange}
      onError={handleFileUploadError}
      //imageSrc={'path/to/custom/image'}
      BannerProps={{ elevation: 0, variant: "outlined" }}
      onContextReady={(context) => {}}
      PlaceholderGridProps={{ md: 6 }}
      LabelsGridProps={{ md: 6 }}
      ContainerProps={{
        style: inputStyles,
        elevation: 0,
        variant: "outlined",
        sx: { p: 2 },
      }}
      placeholderImageDimension={{
        xs: { width: 95, height: 95 },
        sm: { width: 95, height: 95 },
        md: { width: 95, height: 95 },
        lg: { width: 95, height: 95 },
      }}
      inputProps={{
        style: inputStyles,
      }}
    />
  );
}

export default DragAndDrop;
