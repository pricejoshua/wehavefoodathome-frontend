import React, { useEffect, useState } from 'react'


// basic file upload form
function sendFile(file: File | null) {
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    fetch('http://localhost:5000/api/v1/upload', {
        method: 'POST',
        body: formData
    })
}

function UploadReciept() {

    const [file, setFile] = useState<File | null>(null)
    return (
        <div>
            <h1>Upload Reciept</h1>
            <form>
                <input type="file" onChange={(e) => {
                    setFile(e.target.files?.[0] || null)
                }} />
            </form>
            <button onClick={() => sendFile(file)}>Upload</button>
        </div>
    )
}

export default UploadReciept