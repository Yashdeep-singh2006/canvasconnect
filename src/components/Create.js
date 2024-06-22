import React, { useEffect, useRef, useState } from 'react';

export default function Create() {
  const canvasRef = useRef(null);
  const [canvasHeight] = useState('842') // to be set by user
  const [canvasWidth] = useState('595') // to be set by user
  const fillColor = 'rgb(71 85 105)'; // color to be filled in all the svg
  const [color, setColor] = useState('#000000'); // color of the drawing, shapes etc.
  const [shape, setShape] = useState(''); // default is to draw manually
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [shapeHeight, setShapeHeight] = useState(100);
  const [shapeWidth, setShapeWidth] = useState(100);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [canvasColor] = useState('white');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    saveStateToHistory();
  });

  const saveStateToHistory = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL();
    setHistory((prevHistory) => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(dataURL);
      return newHistory;
    });
    setHistoryIndex((prevIndex) => prevIndex + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prevIndex) => {
        const newHistoryIndex = prevIndex - 1;
        restoreStateFromHistory(newHistoryIndex);
        return newHistoryIndex;
      });
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prevIndex) => {
        const newHistoryIndex = prevIndex + 1;
        restoreStateFromHistory(newHistoryIndex);
        return newHistoryIndex;
      });
    }
  };

  const restoreStateFromHistory = (index) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = history[index];
    img.onload = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, 0, 0);
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let drawing = false;
    let startX, startY;

    const getEventCoordinates = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (event.touches) {
        return {
          x: event.touches[0].clientX - rect.left,
          y: event.touches[0].clientY - rect.top,
        };
      } else {
        return {
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        };
      }
    };

    // change the width of drawing stroke 

    const rangeOutput = document.getElementById('strokeWidth');
    const handleStrokeWidth = () => {
      setStrokeWidth(rangeOutput.value)
    }
    rangeOutput.addEventListener('input', handleStrokeWidth);

    const startDrawing = (event) => {
      drawing = true;
      const { x, y } = getEventCoordinates(event);
      startX = x;
      startY = y;
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;  // to be set by user
      if (shape === '') {  //for drawing manually
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (shape === 'Square') { // for square
        ctx.beginPath();
        ctx.rect(x, y, shapeWidth, shapeHeight); // height and width to be set by user 
        ctx.stroke();
        drawing = false; // stop further drawing for shape
        saveStateToHistory();
      } else if (shape === 'Circle') { // for Circle
        ctx.beginPath();
        ctx.arc(x, y, (shapeHeight), 0, 2 * Math.PI);
        ctx.stroke();
        saveStateToHistory();
      } else if (shape === 'Line') { // for Straight line
        ctx.beginPath();
        ctx.moveTo(startX, startY); // assuming startX and startY are the starting coordinates of the line
        ctx.lineTo(x, y); // x and y are the ending coordinates of the line
        ctx.stroke();
        saveStateToHistory();
      }
    };

    const draw = (event) => {
      if (!drawing) return;
      const { x, y } = getEventCoordinates(event);
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
      if (!drawing) return;
      drawing = false;
      ctx.beginPath();
      saveStateToHistory();
    };

    const handleMouseMove = (event) => {
      draw(event);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', handleMouseMove);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);

      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', handleMouseMove);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  });

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    const dataURL = tempCanvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'drawing.jpg';
    link.click();
  };

  return (
    <div className="flex flex-col">
      <div className="w-3/5 self-center mt-10 flex flex-row items-center rounded-lg py-2 px-5 border">
        <div className="flex flex-row flex-grow">
          <div className='self-center flex flex-row mr-1'>

            {/* Bold  */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={fillColor} className="cursor-pointer bi bi-type-bold" viewBox="0 0 16 16">
              <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
            </svg>

            {/* underline */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={fillColor} className="cursor-pointer bi bi-type-underline" viewBox="0 0 16 16">
              <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z" />
            </svg>

            {/* text  */}
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={fillColor} className="cursor-pointer bi bi-fonts" viewBox="0 0 16 16">
              <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479z" />
            </svg>
          </div>

          <div className='flex items-center flex-row border-x-2 px-3'>
            {/* color  */}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-4 w-5"
            />

            {/* shape  */}
            <select className='h-4 bg-transparent ml-2' onChange={(e) => setShape(e.target.value)}>
              <option value="">
                Draw
              </option>
              <option value="Line">
                Line
              </option>
              <option value="Square">
                Square
              </option>
              <option value="Circle">
                Circle
              </option>
            </select>
          </div>

          {/* page size  */}
          <div className='flex items-center flex-row border-x-2 px-3'>

          </div>

          <div className='flex flex-row border-l-2 self-center'>

            {/* undo  */}
            <svg className='cursor-pointer mx-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fillColor} viewBox="0 0 16 16" onClick={undo}>
              <path fillRule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z" />
            </svg>

            {/* redo  */}
            <svg className='cursor-pointer mx-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fillColor} viewBox="0 0 16 16" onClick={redo}>
              <path fillRule="evenodd" d="M14.854 4.854a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 4H3.5A2.5 2.5 0 0 0 1 6.5v8a.5.5 0 0 0 1 0v-8A1.5 1.5 0 0 1 3.5 5h9.793l-3.147 3.146a.5.5 0 0 0 .708.708z" />
            </svg>
          </div>
        </div>
        <button
          onClick={saveDrawing}
          className="text-white bg-violet-500 active:bg-purple-950 hover:bg-purple-800 px-4 py-2 rounded-lg">
          Save
        </button>
      </div>
      <div className="flex flex-row px-10 mt-16 mx-10 justify-between">
        <div className="flex flex-col">
          <div className="w-40 rounded-lg border" style={{ height: '35vh' }}>
            people online will be shown here
          </div>
          <button className="self-center text-white mt-3 bg-indigo-500 active:bg-purple-950 hover:bg-purple-800 px-4 py-2 rounded-lg">
            Invite
          </button>
        </div>
        <div className="border cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
          />
        </div>

        {/* other tools  */}

        <div className="w-60 border flex flex-col" style={{ height: '30rem' }}>
          <div className={`flex flex-row justify-around px-7 pt-7 pb-3 ${shape === '' ? 'opacity-50' : ''}`}>

            {/* height and width  */}
            <div className={`flex flex-col items-center ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`}>
              <label className={`text-xs ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`}> {shape === 'Circle' ? 'Radius' : 'Height'}</label>
              <input type='number' value={shapeHeight} className={`w-14 bg-slate-200 ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`} onChange={(e) => setShapeHeight(e.target.value)} />
            </div>
            <div className={`${shape === 'Circle' ? 'opacity-50' : ''} ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'} flex flex-col items-center `}>
              <label className={`text-xs ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`}>Width</label>
              <input type='number' value={shapeWidth} className={`w-14 bg-slate-200 ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`} onChange={(e) => setShapeWidth(e.target.value)} />
            </div>
          </div>

          {/* line width (stroke) */}
          <div className='self-center text-xs mt-3'>
            Line width
          </div>
          <div className="flex flex-row justify-around px-7 py-2">
            <input id='strokeWidth' type='range' min='0' max='40' value={strokeWidth} className='w-4/5' />
            <label>{strokeWidth}</label>
          </div>


          
        </div>
      </div>
    </div>
  );
}
