import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import * as tf from "@tensorflow/tfjs"
import DrawingCanvas from "@/components/DrawingCanvas";
import { useState } from 'react';
import { RxCross2 } from "react-icons/rx";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const capaStyle = {
  margin: "auto 5px 5px 8px",
  padding: "3px 8px 3px 8px",
  borderRadius: "5px",
  backgroundColor: "#495057"
}

export default function Home() {
  const [acercaDelModelo, setAcercaDelModelo] = useState(false)

  return (
    <div>

      { acercaDelModelo && (
        <>
          <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", /* Semi-transparent black background */
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999" /* Ensure it's on top of other elements */
          }} onClick={() => setAcercaDelModelo(!acercaDelModelo)}>
            
          </div>

          <div style={{
            margin: "0px auto 0px auto",
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            top: "50%",
            left: "50%",
            width: "95%",
            transform: "translate(-50%, -50%)",
            zIndex: "1000"
          }}>
            

            <div style={{
              backgroundColor: "#343A40",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              width: "100%",
              height: "100%",
              margin: "0px auto 0px auto"
            }}>
              <div style={{
                display: "flex",
                flexDirection: "row"
              }}>
                <div style={{
                  fontWeight: "bold",
                  fontSize: "20px",
                  marginBottom: "5px",
                }}>
                  Acerca del Modelo
                </div>
                <div style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  <div style={{
                    backgroundColor: "#484A62",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                    margin: "auto 0px auto auto",
                  }} onClick={() => setAcercaDelModelo(!acercaDelModelo)}>
                      <RxCross2 />
                  </div>
                </div>
              </div>
              
              <div>
                <div style={{
                  marginTop: "10px",
                  marginBottom: "10px"
                }}>
                  Se utilizó una red neuronal convolucional con las siguientes capas:
                </div>
                <div style={capaStyle}>1.- Capa Convolucional - 32 filtros (3 x 3)</div>
                <div style={capaStyle}>2.- Capa de Max Pooling - (2 x 2)</div>
                <div style={capaStyle}>3.- Capa Convolucional - 64 filtros (3 x 3)</div>
                <div style={capaStyle}>4.- Capa de Max Pooling - (2 x 2)</div>
                <div style={capaStyle}>5.- Capa Convolucional - 128 filtros (3 x 3)</div>
                <div style={capaStyle}>6.- Capa de Droput - Removiendo 50% de informacion</div>
                <div style={capaStyle}>7.- Capa Densa - 512 neuronas, activación "relu"</div>
                <div style={capaStyle}>8.- Capa Densa (Final) - 10 neuronas, activación "softmax"</div>
              </div>
            </div>
          </div>
        </>
        )}

        <div style={{
          height: "20px"
        }}>
        </div>
        
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          width: "100%",
          fontWeight: "bold",
          fontSize: "20px",
          marginTop: "30px",
        }}>
          PREDICCIÓN DE DÍGITO
        </div>

        <div style={{
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          width: "100%",
          fontSize: "15px",
          marginBottom: "10px"
        }}>
          Manuel Cota
        </div>

        <div style={{
          margin: "auto",
          width: "150px",
        }}>
          <button className="button" onClick={() => setAcercaDelModelo(!acercaDelModelo)} >Acerca del Modelo</button>
        </div>

        <div className="container" style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          margin: "0px auto 0px auto",
        }}>
          <DrawingCanvas />
        </div>
    </div>
  );
}
