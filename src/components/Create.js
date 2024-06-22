import React, { useEffect, useRef, useState } from 'react';

export default function Create() {
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(842);
  const [canvasWidth, setCanvasWidth] = useState(595);
  const fillColor = 'rgb(71 85 105)';
  const [color, setColor] = useState('#000000');
  const [shape, setShape] = useState('');
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
  }, [canvasColor, canvasHeight, canvasWidth]);

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

    const startDrawing = (event) => {
      const { x, y } = getEventCoordinates(event);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;

      if (shape === '') {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (shape === 'Square') {
        ctx.beginPath();
        ctx.rect(x, y, shapeWidth, shapeHeight);
        ctx.stroke();
        saveStateToHistory();
      } else if (shape === 'Circle') {
        ctx.beginPath();
        ctx.arc(x, y, shapeHeight, 0, 2 * Math.PI);
        ctx.stroke();
        saveStateToHistory();
      } else if (shape === 'Line') {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (shape === 'Eraser') {
        ctx.strokeStyle = canvasColor;
        ctx.lineWidth = strokeWidth * 2;
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(x, y);
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

    const stopDrawing = (event) => {
      if (!drawing) return;
      if (shape === 'Line') {
        const { x, y } = getEventCoordinates(event);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
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
  }, [color, shape, shapeHeight, shapeWidth, strokeWidth, canvasColor]);

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
      <div className="w-auto pr-7 pl-5 self-center mt-10 flex flex-row items-center rounded-lg py-2 border">
        <div className="flex flex-row flex-grow">
          <div className='self-center flex flex-row mr-1'>
            {/* Bold */}
            <div className="relative group justify-center self-center inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={fillColor} className="cursor-pointer bi bi-type-bold" viewBox="0 0 16 16">
                <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
              </svg>
              <div className="absolute bottom-full mb-2 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs rounded">
                Bold
              </div>
            </div>

            {/* Underline */}
            <div className="relative group justify-center self-center inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={fillColor} className="cursor-pointer bi bi-type-underline" viewBox="0 0 16 16">
                <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57s-2.687-1.08-2.687-2.57zM12.5 15h-9v-1h9z" />
              </svg>
              <div className="absolute bottom-full mb-2 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs rounded">
                Underline
              </div>
            </div>

            {/* Text */}
            <div className="relative group justify-center self-center inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill={fillColor} className="cursor-pointer bi bi-fonts" viewBox="0 0 16 16">
                <path d="M12.258 3h-8.51l-.083 2.46h.479c.26-1.544.758-1.783 2.693-1.845l.424-.013v7.827c0 .663-.144.82-1.3.923v.52h4.082v-.52c-1.162-.103-1.306-.26-1.306-.923V3.602l.431.013c1.934.062 2.434.301 2.693 1.846h.479z" />
              </svg>
              <div className="absolute bottom-full mb-2 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs rounded">
                Text
              </div>
            </div>
          </div>

          <div className='flex items-center flex-row border-x-2 px-3'>
            {/* Color */}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-4 w-5"
            />
            {/* Shape */}
            <select className='h-4 bg-transparent ml-2' style={{ color: fillColor }} onChange={(e) => setShape(e.target.value)}>
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

            {/* Eraser */}
            <div className="relative group justify-center self-center inline-block">
              <svg onClick={() => setShape('Eraser')} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill={fillColor} viewBox="0 0 16 16">
                <path d="M8.086 2.207a2 2 0 0 1 2.828 0l3.879 3.879a2 2 0 0 1 0 2.828l-5.5 5.5A2 2 0 0 1 7.879 15H5.12a2 2 0 0 1-1.414-.586l-2.5-2.5a2 2 0 0 1 0-2.828zm2.121.707a1 1 0 0 0-1.414 0L4.16 7.547l5.293 5.293 4.633-4.633a1 1 0 0 0 0-1.414zM8.746 13.547 3.453 8.254 1.914 9.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 .707.293H7.88a1 1 0 0 0 .707-.293z" />
              </svg>
              <div className="absolute bottom-full mb-2 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs rounded">
                Eraser
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className='relative group flex items-center flex-row border-r-2 px-3'>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill={fillColor} viewBox="0 0 16 16">
              <path d="M2.5 1A1.5 1.5 0 0 0 1 2.5v11A1.5 1.5 0 0 0 2.5 15h6.086a1.5 1.5 0 0 0 1.06-.44l4.915-4.914A1.5 1.5 0 0 0 15 8.586V2.5A1.5 1.5 0 0 0 13.5 1zM2 2.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5V8H9.5A1.5 1.5 0 0 0 8 9.5V14H2.5a.5.5 0 0 1-.5-.5zm7 11.293V9.5a.5.5 0 0 1 .5-.5h4.293z" />
            </svg>
            <div className="absolute bottom-full mb-2 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs rounded">
              Notes
            </div>
          </div>

          {/* background color  */}

          <div className='flex items-center flex-row border-r-2 px-3' style={{color: fillColor}}>
            <div className='flex flex-row'>
              <label className='mr-2'>Bg color</label>

              <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-4 w-5 mt-1"
            />
            </div>
          </div>

          <div className='flex flex-row self-center'>
            {/* Undo */}
            <div className="relative group inline-block">
              <svg className='cursor-pointer mx-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fillColor} viewBox="0 0 16 16" onClick={undo}>
                <path fillRule="evenodd" d="M1.146 4.854a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H12.5A2.5 2.5 0 0 1 15 6.5v8a.5.5 0 0 1-1 0v-8A1.5 1.5 0 0 0 12.5 5H2.707l3.147 3.146a.5.5 0 1 1-.708.708z" />
              </svg>
              <div className="absolute bottom-full mb-2 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs rounded">
                Undo
              </div>
            </div>

            {/* Redo */}
            <div className="relative group inline-block">
              <svg className='cursor-pointer mx-1' xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill={fillColor} viewBox="0 0 16 16" onClick={redo}>
                <path fillRule="evenodd" d="M14.854 4.854a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 4H3.5A2.5 2.5 0 0 0 1 6.5v8a.5.5 0 0 0 1 0v-8A1.5 1.5 0 0 1 3.5 5h9.793l-3.147 3.146a.5.5 0 0 0 .708.708z" />
              </svg>
              <div className="absolute bottom-full mb-2 hidden group-hover:flex px-2 py-1 bg-gray-800 text-white text-xs rounded">
                Redo
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={saveDrawing}
          className="text-white ml-10 bg-violet-500 active:bg-purple-950 hover:bg-purple-800 px-4 py-2 rounded-lg">
          Save
        </button>
      </div>

      <div className="flex flex-row  mt-16  justify-around">
        <div className="flex flex-col">
          <div className="w-60 rounded-lg border" style={{ height: '35vh' }}>
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

        <div className="w-60 border flex flex-col" style={{ height: '30rem' }}>
          <div className={`flex flex-col px-7 pt-2 pb-3 ${shape === '' ? 'opacity-50' : ''}`}>
            <div className='self-center mb1'>
              <label className='text-base'>Shape size</label>
            </div>

            <div className='flex flex-row justify-around'>
              <div className={`flex flex-col items-center ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`}>
                <label className={`text-xs ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`}>{shape === 'Circle' ? 'Radius' : 'Height'}</label>
                <input type='number' value={shapeHeight} className={`w-14 bg-slate-200 ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`} onChange={(e) => setShapeHeight(e.target.value)} />
              </div>
              <div className={`${shape === 'Circle' ? 'opacity-50' : ''} ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'} flex flex-col items-center `}>
                <label className={`text-xs ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`}>Width</label>
                <input type='number' value={shapeWidth} className={`w-14 bg-slate-200 ${shape === '' ? 'cursor-not-allowed' : 'cursor-default'}`} onChange={(e) => setShapeWidth(e.target.value)} />
              </div>
            </div>
          </div>
          <hr />
          <div className='self-center text-base mt-3'>
            Line width
          </div>
          <div className="flex flex-row justify-around px-7 py-2">
            <input id='strokeWidth' type='range' min='0' max='40' value={strokeWidth} className='w-4/5' onChange={(e) => setStrokeWidth(e.target.value)} />
            <label>{strokeWidth}</label>
          </div>
          <hr />
          <div className={`flex flex-col justify-around px-7 pb-3`}>
            <div className='self-center mb-1'>
              <label className='text-base'>Page size</label>
            </div>
            <div className='flex flex-row justify-around'>
              <div className={`flex flex-col items-center cursor-default`}>
                <label className={`text-xs cursor-default`}>Height</label>
                <input type='number' value={canvasHeight} className={`w-14 bg-slate-200 `} onChange={(e) => setCanvasHeight(e.target.value)} />
              </div>
              <div className='flex flex-col items-center'>
                <label className={`text-xs cursor-default`}>Width</label>
                <input type='number' value={canvasWidth} className={`w-14 bg-slate-200 `} onChange={(e) => setCanvasWidth(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
