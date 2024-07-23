import React, { startTransition, useEffect } from "react";
import "./App.css";
import Grid from "@mui/material/Grid";
import { Box, Button, Card, CardMedia, Paper, Typography } from "@mui/material";
import { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DragAndDrop from "./components/DragAndDrop";
import JSZip from 'jszip';
import Skeleton from '@mui/material/Skeleton';

const styles = {
  styleBoxImg:{
    position: "relative",
    maxWidth: "100%",
    overflow: "hidden",
    borderRadius: "8px",
    height: "400px",
    backgroundColor: "black",
    display: "flex",
    alignItems: "center", 
  },
  img:{
    width: "100%",
    objectFit: "cover",
  }
};

function dataURItoBlob(dataURI) {
  // Convertir la URL de datos a un array de bytes
  const byteString = atob(dataURI.split(',')[1]);
  // Crear un array de bytes vacío y asignarle la longitud del byteString
  const arrayBuffer = new ArrayBuffer(byteString.length);
  // Crear una vista de bytes para el arrayBuffer
  const uint8Array = new Uint8Array(arrayBuffer);
  // Copiar los datos de byteString a uint8Array
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  // Crear y devolver un objeto Blob
  return new Blob([arrayBuffer], { type: 'image/jpeg' });
}
function App() {
  const [blobImage1, setBlobImage1] = useState(null);
  const [blobImage2, setBlobImage2] = useState(null);
  const [imageUrl1, setimageUrl1] = useState(<Skeleton variant="rounded" width={210} height={60} />);
  const [imageUrl2, setimageUrl2] = useState(null);
  const [percent, setPercent] = useState(null);

  const handleImage1 =  (files) =>{


    const blob = dataURItoBlob(files[0].path);

    if (blob instanceof Blob) {
      console.log("myBlob is a Blob object");
      setBlobImage1(blob)
    } else {
      console.log("myBlob is not a Blob object");
    }


    console.log(blob)

  }
  const handleImage2 = (files) =>{
    const blob = dataURItoBlob(files[0].path);
    if (blob instanceof Blob) {
      console.log("myBlob is a Blob object");
      setBlobImage2(blob)
    } else {
      console.log("myBlob is not a Blob object");
    }


    console.log(blob)
  }
  

  useEffect (() =>{

  },[])


  const handleSendData= () =>{
    
    const formData = new FormData();
    formData.append("file1",blobImage1)
    formData.append("file2",blobImage2)
    //dataImage1.forEach((file) => formData.append("files", file))

    console.log("dataSendtoApi")

    // Enviar los bytes al servidor utilizando fetch
    fetch('http://127.0.0.1:5000/api/v1/similarity', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ocurrió un error al enviar la imagen :().');
      }
      return response.arrayBuffer();
    })
    .then(buffer => {
      const zip = new JSZip();
      return zip.loadAsync(buffer);
    })
    .then (async zip => {
      console.log('La respuesta del servidor fue:', zip);

      const img1 =await zip.file('img1.jpg').async('uint8array');
      const img2 =await zip.file('img2.jpg').async('uint8array');
      const percent = await zip.file('percent.txt').async('text');
      const img1Url = URL.createObjectURL(new Blob([img1], {type: 'image/jpeg'}));
      const img2Url = URL.createObjectURL(new Blob([img2], {type: 'image/jpeg'}));


      console.log(percent)
      console.log(img1Url)
      console.log(img2Url)

      setimageUrl1(img1Url)
      setimageUrl2(img2Url)
      setPercent(percent)

    })
    .catch(error => {
      console.error('Ocurrió un error al enviar la imagen:', error);
    });
  }


  return (
    <div className="App">
      <Grid container padding={5} spacing={3} justifyContent="center">
      <Grid item xs={12}>
          <Typography variant="h4">HOW SIMILAR?</Typography>
        </Grid>

        <Grid item xs={6}>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DragAndDrop handleImage={handleImage1}/>
            </Grid>
            <Grid item xs={6}>
              <DragAndDrop handleImage={handleImage2}/>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">Original images</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    sx={styles.styleBoxImg}
                  >
                    <img
                      src={imageUrl2}
                      style={styles.img}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={styles.styleBoxImg}
                  >
                    <img
                      src={imageUrl1}
                      style={styles.img}
                      alt="my image"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={handleSendData}>
                GO!
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Grid container spacing={2}>
            
            <Grid item xs={12}>
              <Typography sx={{color:"white", backgroundColor:"#1976d2", fontSize:"1.5em"}} >processed images</Typography>
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={2}>

                <Grid item xs={6}>
                  <Box
                    sx={styles.styleBoxImg}
                  >
                    <img
                      src={imageUrl2}
                      style={styles.img}
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box
                    sx={styles.styleBoxImg}
                  >
                    <img
                      src={imageUrl1}
                      style={styles.img}
                      alt="my image"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>


            <Grid item xs={12}>
              <Typography sx={{color:"white", backgroundColor:"#1976d2", fontSize:"1.5em"}} >{percent}% similarity</Typography>
            </Grid>


          </Grid>
        </Grid>

        
      </Grid>
    </div>
  );
}

export default App;
