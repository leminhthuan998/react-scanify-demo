import { useEffect, useRef, useState } from 'react';
import './scanner.css';
import { jsPDF } from 'jspdf';
// const images = [{ src: '/paper-high.png' }, { src: '/paper-2.png' }, { src: '/test.png' }, { src: '/test2.png' }];

export const Scanner = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const resultRef = useRef(null);
  const initLoad = useRef(true)
  const openCvURL = 'https://docs.opencv.org/4.7.0/opencv.js';

  const [loadedOpenCV, setLoadedOpenCV] = useState(false);
  // const [selectedImage, setSelectedImage] = useState(undefined);
  // const [openCam, setOpenCam] = useState(false);

  // useEffect(() => {
  //   // eslint-disable-next-line no-undef
  //   const scanner = new jscanify();
  //   loadOpenCv(() => {
  //     if (selectedImage) {
  //       containerRef.current.innerHTML = '';
  //       const newImg = document.createElement('img');
  //       newImg.src = selectedImage.src;

  //       newImg.onload = function () {
  //         const resultCanvas = scanner.extractPaper(newImg, 386, 500);
  //         containerRef.current.append(resultCanvas);

  //         const highlightedCanvas = scanner.highlightPaper(newImg);
  //         containerRef.current.append(highlightedCanvas);
  //       };
  //     }
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedImage]);

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const scanner = new jscanify();
    loadOpenCv(() => {

      const videoE = document.getElementById('video');

      canvasRef.current.width = videoE ? videoE.videoWidth : 500;
      canvasRef.current.height = videoE ? videoE.videoHeight : 500;
      resultRef.current.width = videoE ? videoE.videoWidth : 500;
      resultRef.current.height = videoE ? videoE.videoHeight : 500;

      const canvasCtx = canvasRef.current.getContext("2d");
      const resultCtx = resultRef.current.getContext("2d");
      console.log(canvasCtx, navigator.mediaDevices, videoE)
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        }
      }).then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.mute = true;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setInterval(() => {
            canvasCtx.drawImage(videoRef.current, 0, 0);
            console.log(canvasRef.current)

            if (canvasRef.current.width !== 0 && canvasRef.current.height !== 0) {
              const resultCanvas = scanner.highlightPaper(canvasRef.current);
              resultCtx.drawImage(resultCanvas, 0, 0);
            }


            // containerRef.current.innerHTML = '';
            // const newImg = document.createElement('img');
            // newImg.onload = function () {
            //   containerRef.current.append(resultCanvas);
            // };
          }, 10);
        };
      })
        .catch((err) => {
          /* handle the error */
        });



    });
    // initLoad.current = false
  }, []);

  const loadOpenCv = (onComplete) => {
    const isScriptPresent = !!document.getElementById('open-cv');
    if (isScriptPresent || loadedOpenCV) {
      setLoadedOpenCV(true);
      setTimeout(function () {
        onComplete();
      }, 2000);
    } else {
      const script = document.createElement('script');
      script.id = 'open-cv';
      script.src = openCvURL;

      script.onload = function () {
        setTimeout(function () {
          onComplete();
        }, 2000);
        setLoadedOpenCV(true);
      };
      document.body.appendChild(script);
    }
  };
  console.log(2)

  return (
    <>
      {/* <div className="scanner-container">
        <div>
          {!loadedOpenCV && (
            <div>
              <h2>Loading OpenCV...</h2>
            </div>
          )}
          {images.map((image, index) => (
            <img
              key={index}
              className={selectedImage && selectedImage.src === image.src ? 'selected' : ''}
              src={image.src}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>

      </div>
      <div ref={containerRef} id="result-container"></div> */}
      <div>
        <video
          id='video' className='video-custom' ref={videoRef} />

      </div>
      <div> <canvas id='myCanvas' ref={canvasRef} width="700" height="400" style={{ display: 'none' }} /></div>
      <div>   <canvas width="700" height="400" ref={resultRef} /></div>
      <div ref={containerRef} id="result-container"></div>
      <button onClick={() => {

        // const context = canvasRef.current.getContext("2d");
        // context.beginPath();
        // context.moveTo(170, 80);
        // context.bezierCurveTo(130, 100, 130, 150, 230, 150);
        // context.bezierCurveTo(250, 180, 320, 180, 340, 150);
        // context.bezierCurveTo(420, 150, 420, 120, 390, 100);
        // context.bezierCurveTo(430, 40, 370, 30, 340, 50);
        // context.bezierCurveTo(320, 5, 250, 20, 250, 50);
        // context.bezierCurveTo(200, 5, 150, 20, 170, 80);
        // context.closePath();
        // context.lineWidth = 5;
        // context.fillStyle = '#8ED6FF';
        // context.fill();
        // context.strokeStyle = '#0000ff';
        // context.stroke();
        // eslint-disable-next-line no-undef
        const scanner = new jscanify();
        // const imgData = resultRef.current.toDataURL("image/jpeg", 1.0);
        const resultCanvas = scanner.extractPaper(resultRef.current, 386, 500);
        const imgData1 = resultCanvas.toDataURL("image/jpeg", 1.0);

        const pdf = new jsPDF();

        pdf.addImage(imgData1, 'JPEG', 0, 0);
        pdf.save("download.pdf");

      }}>take</button>
    </>
  );
};
