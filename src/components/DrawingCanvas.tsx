// components/DrawingCanvas.tsx
import { useRef, useEffect, useState } from 'react';
import * as tf from "@tensorflow/tfjs"

const DrawingCanvas = () => {
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const smallCanvasRef = useRef<HTMLCanvasElement>(null);

  const [isDrawing, setIsDrawing] = useState(false);

  const [prediccion, setPrediccion] = useState(null)

    var modelo: any = null

    const load_model = async () => {
        modelo = await tf.loadLayersModel("/model/model.json")
    }

    load_model()

  useEffect(() => {
    const mainCanvas = mainCanvasRef.current;
    if (!mainCanvas) return;

    const mainContext = mainCanvas.getContext('2d');
    if (!mainContext) return;

    // Set initial drawing styles
    mainContext.strokeStyle = '#000000';
    mainContext.lineWidth = 5;

    // Function to get the canvas coordinates from a mouse or touch event
    const getCanvasCoordinates = (e: MouseEvent | TouchEvent) => {
        const rect = mainCanvas.getBoundingClientRect();
        if (e instanceof MouseEvent) {
          return {
            offsetX: e.offsetX,
            offsetY: e.offsetY,
          };
        } else if (e instanceof TouchEvent) {
          const touch = e.touches[0];
          return {
            offsetX: touch.clientX - rect.left,
            offsetY: touch.clientY - rect.top,
          };
        }
        return { offsetX: 0, offsetY: 0 };
      };

    const startDrawing = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        setIsDrawing(true);
        const { offsetX, offsetY } = getCanvasCoordinates(e);
        mainContext.beginPath();
        mainContext.moveTo(offsetX, offsetY);
      };
  
      const draw = (e: MouseEvent | TouchEvent) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = getCanvasCoordinates(e);
        mainContext.lineTo(offsetX, offsetY);
        mainContext.stroke();
      };

    const stopDrawing = () => {
      setIsDrawing(false);
      mainContext.closePath();
    };

    // Add event listeners
    mainCanvas.addEventListener('mousedown', startDrawing);
    mainCanvas.addEventListener('mousemove', draw);
    mainCanvas.addEventListener('mouseup', stopDrawing);
    mainCanvas.addEventListener('mouseout', stopDrawing);

    // Add touch event listeners
    mainCanvas.addEventListener('touchstart', startDrawing);
    mainCanvas.addEventListener('touchmove', draw);
    mainCanvas.addEventListener('touchend', stopDrawing);

    // Cleanup event listeners
    return () => {
      mainCanvas.removeEventListener('mousedown', startDrawing);
      mainCanvas.removeEventListener('mousemove', draw);
      mainCanvas.removeEventListener('mouseup', stopDrawing);
      mainCanvas.removeEventListener('mouseout', stopDrawing);

      mainCanvas.removeEventListener('touchstart', startDrawing);
      mainCanvas.removeEventListener('touchmove', draw);
      mainCanvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing]);

  // Function to clear both canvases
  const clearCanvas = () => {
    const mainCanvas = mainCanvasRef.current;
    const smallCanvas = smallCanvasRef.current;
    if (!mainCanvas || !smallCanvas) return;

    const mainContext = mainCanvas.getContext('2d');
    const smallContext = smallCanvas.getContext('2d');
    if (!mainContext || !smallContext) return;

    // Clear both canvases
    mainContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    smallContext.clearRect(0, 0, smallCanvas.width, smallCanvas.height);
  };

  // Function to update the small canvas and extract pixel values
  const getPixelValues = () => {
    const mainCanvas = mainCanvasRef.current;
    const smallCanvas = smallCanvasRef.current;
    if (!mainCanvas || !smallCanvas) return;

    const mainContext = mainCanvas.getContext('2d');
    const smallContext = smallCanvas.getContext('2d', { willReadFrequently: true });
    if (!mainContext || !smallContext) return;

    // Clear the small canvas
    smallContext.clearRect(0, 0, smallCanvas.width, smallCanvas.height);

    // Draw the scaled-down version of the main canvas onto the small canvas
    smallContext.drawImage(
      mainCanvas,
      0,
      0,
      mainCanvas.width,
      mainCanvas.height,
      0,
      0,
      smallCanvas.width,
      smallCanvas.height
    );

    // Get the image data from the small canvas
    const imageData = smallContext.getImageData(0, 0, smallCanvas.width, smallCanvas.height);
    const data = imageData.data; // RGBA array

    // Create a 2D array to store the pixel values
    const pixelArray: number[][] = Array.from({ length: 28 }, () => Array(28).fill(0));

    var arr = []; //El arreglo completo
    var arr28 = []; //Al llegar a 28 posiciones se pone en 'arr' como un nuevo indice
    for (var p=0, i=0; p < data.length; p+=4) {
        var valor = data[p+3]/255;
        arr28.push([valor]); //Agregar al arr28 y normalizar a 0-1. Aparte queda dentro de un arreglo en el indice 0... again
        if (arr28.length == 28) {
            arr.push(arr28);
            arr28 = [];
        }
    }

    // Return the 2D array (optional)
    arr = [arr]
    var tensor4 = tf.tensor4d(arr);
    var resultados = modelo.predict(tensor4).dataSync();
    var mayorIndice = resultados.indexOf(Math.max.apply(null, resultados));
    
    setPrediccion(mayorIndice)
    // document.getElementById("resultado").innerHTML = mayorIndice;
    return pixelArray;
  };

  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        margin: "0px auto 0px auto"
    }}>

      <div style={{
        display: "flex",
        flexDirection: "column",
        margin: "15px auto 0px auto"
      }}>
        <h3 style={{
            margin: "auto auto 5px auto"
        }}>
            Dibujar digito a predecir:
        </h3>
        <canvas
          ref={mainCanvasRef}
          width={200}
          height={200}
          style={{
            width: "200px",
            height: "200px",
            backgroundColor: '#FFF',
            borderRadius: '10px',
            touchAction: 'none'
          }}
        />
      </div>
      <div style={{
        marginTop: '10px',
        }}>
        <canvas
          ref={smallCanvasRef}
          width={28}
          height={28}
          style={{
            display: 'none',
            backgroundColor: '#000000',
            imageRendering: 'pixelated' // Ensure pixelated rendering
        }}
        />
      </div>
      <div style={{
        width: "200px",
        display: "flex",
        flexDirection: "row"
        }}>
        <div style={{
            width: "95px",
            alignContent: "right"
        }}>
            <button className="button" onClick={clearCanvas}>Limpiar</button>
        </div>

        <div style={{
            width: "10px"
        }}></div>

        <div style={{
            width: "95px",
            margin: "0px 0px 0px auto"
        }}>
            <button className="button" onClick={getPixelValues} >Predecir</button>
        </div>
      </div>
      <div
        style={{
            fontSize: "40px",
            color: '#E5E5E5',
            display: "flex",
            flexDirection: "row",
            marginTop: "30px"
        }}>
        <div style={{
            margin: "0px auto 0px auto",
            backgroundColor: "#343A40",
            border: "5px solid #8D959D",
            borderRadius: "15px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "150px",
            height: "150px",
            fontSize: "100px"
        }}>
            {prediccion}
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
