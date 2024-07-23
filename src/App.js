import React, { useState } from "react";
import "./App.css";
import Grid from "@mui/material/Grid";
import { Box, Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import DragAndDrop from "./components/DragAndDrop";
import JSZip from 'jszip';
import Skeleton from '@mui/material/Skeleton';

const styles = {
  styleBoxImg: {
    position: "relative",
    maxWidth: "100%",
    overflow: "hidden",
    borderRadius: "8px",
    height: "400px",
    backgroundColor: "black",
    display: "flex",
    alignItems: "center",
  },
  img: {
    width: "100%",
    objectFit: "cover",
  },
  header: {
    backgroundColor: "#1976d2",
    padding: "10px 20px",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
  },
  headerRight: {
    textAlign: "right",
  },
  list: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    marginBottom: "20px",
  },
  listItem: {
    borderBottom: "1px solid #ddd",
  },
  listItemText: {
    display: "flex",
    justifyContent: "space-between",
  },
  listTitle: {
    backgroundColor: "#1976d2",
    color: "white",
    padding: "10px",
    borderRadius: "8px 8px 0 0",
    marginBottom: "10px",
  },
};

function dataURItoBlob(dataURI) {
  const byteString = atob(dataURI.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  return new Blob([arrayBuffer], { type: 'image/jpeg' });
}

function App() {
  const [blobImage1, setBlobImage1] = useState(null);
  const [blobImage2, setBlobImage2] = useState(null);
  const [imageUrl1, setImageUrl1] = useState(<Skeleton variant="rounded" width={210} height={60} />);
  const [imageUrl2, setImageUrl2] = useState(null);
  const [percent, setPercent] = useState(null);
  const [features1, setFeatures1] = useState({});
  const [features2, setFeatures2] = useState({});

  const handleImage1 = (files) => {
    const blob = dataURItoBlob(files[0].path);
    if (blob instanceof Blob) {
      setBlobImage1(blob);
    }
  };

  const handleImage2 = (files) => {
    const blob = dataURItoBlob(files[0].path);
    if (blob instanceof Blob) {
      setBlobImage2(blob);
    }
  };

  const handleSendData = () => {
    const formData = new FormData();
    formData.append("file1", blobImage1);
    formData.append("file2", blobImage2);

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
      .then(async zip => {
        const img1 = await zip.file('img1.jpg').async('uint8array');
        const img2 = await zip.file('img2.jpg').async('uint8array');
        const percent = await zip.file('percent.txt').async('text');
        const features1 = JSON.parse(await zip.file('features1.json').async('text'));
        const features2 = JSON.parse(await zip.file('features2.json').async('text'));
        const img1Url = URL.createObjectURL(new Blob([img1], { type: 'image/jpeg' }));
        const img2Url = URL.createObjectURL(new Blob([img2], { type: 'image/jpeg' }));

        setImageUrl1(img1Url);
        setImageUrl2(img2Url);
        setPercent(percent);
        setFeatures1(features1);
        setFeatures2(features2);
      })
      .catch(error => {
        console.error('Ocurrió un error al enviar la imagen:', error);
      });
  };

  const renderFeaturesList = (features) => (
    <Box sx={styles.list}>
      <Typography sx={styles.listTitle} variant="h6">Características</Typography>
      <List>
        {Object.keys(features).map((key) => (
          <ListItem sx={styles.listItem} key={key}>
            <ListItemText sx={styles.listItemText} primary={key} secondary={features[key]} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div className="App">
      <Box sx={styles.header}>
        <Box sx={styles.headerLeft}>
          <Typography variant="h6">BSIDE</Typography>
        </Box>
        <Box sx={styles.headerRight}>
          <Typography variant="h6">Demo</Typography>
        </Box>
      </Box>
      <Grid container padding={5} spacing={3} justifyContent="center">
        <Grid item xs={12}>
          <Typography variant="h4">DEMO IA</Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <DragAndDrop handleImage={handleImage1} />
            </Grid>
            <Grid item xs={6}>
              <DragAndDrop handleImage={handleImage2} />
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h4">Imagenes a comparar rostro y extraer características</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={styles.styleBoxImg}>
                    <img
                      src={imageUrl2}
                      style={styles.img}
                      alt="imagen"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={styles.styleBoxImg}>
                    <img
                      src={imageUrl1}
                      style={styles.img}
                      alt="imagen"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={handleSendData}>
                PROCESAR
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography sx={{ color: "white", backgroundColor: "#1976d2", fontSize: "1.5em" }} >RESULTADOS</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {renderFeaturesList(features1)}
                </Grid>
                <Grid item xs={6}>
                  {renderFeaturesList(features2)}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ color: "white", backgroundColor: "#1976d2", fontSize: "1.5em" }} >{percent}% Similitud</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
