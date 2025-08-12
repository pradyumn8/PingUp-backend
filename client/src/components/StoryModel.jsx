import { ArrowLeft, Sparkle, TextIcon, Upload } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const StoryModel = ({ setShowModel, fetchStories }) => {

  const bgColors = ['#4f46e5', '#f59e0b', '#dc2626', '#16a34a', '#0ea5e9', '#8b5cf6', '#ec4899', '#f97316', '#059669', '#2563eb'];

  const [mode, setMode] = useState('text');
  const [background, setBackground] = useState(bgColors[0]);
  const [text, setText] = useState('');
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMedia(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }

  const handleCreateStory = async () => {

  }

  return (
    <div className='fixed inset-0 z-110 min-h-screen bg-black/80 flex backdrop-blur items-center justify-center text-white'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-4 flex items-center justify-between'>
          <button onClick={() => setShowModel(false)} className='text-white p-2 cursor-pointer'>
            <ArrowLeft />
          </button>
          <h2 className='text-lg font-semibold'>Create Story</h2>
          <span className="w-10"></span>
        </div>
        <div className="rounded-lg h-96 flex items-center justify-center relative" style={{ backgroundColor: background }}>
          {mode === 'text' && (
            <textarea className='bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none' placeholder="What's on your mind?" onChange={(e) => setText(e.target.value)} value={text} />
          )}
          {
            mode === 'media' && previewUrl && (
              media?.type.startsWith('image') ? (
                <img src={previewUrl} alt="" className='object-contain max-h-full' />
              ) : (
                <video src={previewUrl} className='object-contain max-h-full'/>
              )
            )
          }
        </div>
        <div className='flex mt-4 gap-2'>
          {bgColors.map((color)=>(
            <button key={color} className='w-6 h-6 rounded-full ring cursor-pointer' style={{backgroundColor: color}} onClick={()=>setBackground(color)}/>
          ))}

        </div>
        <div className='flex gap-2 mt-4'>
          <button className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${mode === 'text' ? 'bg-white text-black' : 'bg-zinc-800'}`}>
          <TextIcon size={18}/> Text
          </button>
          <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded ${mode === 'media' ? 'bg-white text-black' : 'bg-zinc-800'}`}>
            <input onChange={(e)=>{handleMediaUpload(e); setMode('media')}} type="file" accept='image/*, video/*' className='hidden' />
            <Upload size={18}/> Photo/Video
          </label>
          
        </div>
        <button onClick={()=>toast.promise(handleCreateStory(),{
          loading: 'Saving...',
          success: <p>Story Added</p>,
          error: e =><p>{e.message}</p>,
        })} className='flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer'>
          <Sparkle size={18}/> Create Story
        </button>
      </div>
    </div>
  )
}

export default StoryModel