import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '../utils/ImageCanvas'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Form, } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';


const Main = () => {
    const [imageSrc, setImageSrc] = React.useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedFiles, setSelectedFiles] = useState([]);

    // console.log("croppedImage",croppedImage)
    const listItemStyle = {
        width: '300px',
        height: '100px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '10px',
        borderRadius: '4px',
        backgroundColor: '#fff',
      };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const showCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(
                imageSrc,
                croppedAreaPixels,
            )
            console.log('donee', { croppedImage })
            setCroppedImage(croppedImage)
    
            let data = { type: "image", name: croppedImage }
            setSelectedFiles([...selectedFiles, data]);

            handleClose()
        } catch (e) {
            console.error(e)
        }
    }



    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            if (file?.type.includes("image")) {

                let imageDataUrl = await readFile(file)
                setImageSrc(imageDataUrl)
                handleShow()
            } else {
                const files = e.target.files;
                setSelectedFiles([...selectedFiles, ...files]);
            }


        }
    }



    const deleteTheItem = (e,ele, index) => {
        e.preventDefault()
       setSelectedFiles(selectedFiles.filter((e)=>e.name !== ele.name))
    }


    return (
        <div>
            <Form>
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Choose file</Form.Label>
                    <Form.Control type="file" onChange={onFileChange} />
                </Form.Group>

            </Form>

            {selectedFiles?.length > 0 &&
                <>
                    <h3>Selected file</h3>
                    <ol>
                        {selectedFiles.map((file, index) => {
                            return (
                                <>
                                   <span className="close-icon"onClick={(e)=>deleteTheItem(e,file, index)}> <FaTimes /></span>
                                   
                                    {file.type.includes("image") ?
                                        <li key={index}><img src={file.name} alt='img' height={300} width={300} />  </li> :
                                        <li key={index} style={listItemStyle}>
                                        {file.name}
                                      </li>
                                    }

                                </>
                            )
                        }

                        )}
                    </ol>
                </>
            }
            {imageSrc ?
                <Modal show={show} onHide={handleClose} fullscreen={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>RESIZE IMAGE</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <React.Fragment>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={4 / 3}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />

                        </React.Fragment></Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            CLOSE
                        </Button>
                        <Button variant="primary" onClick={showCroppedImage}>
                            UPLOAD
                        </Button>
                    </Modal.Footer>
                </Modal> : null}
        </div>
    )
}

function readFile(file) {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => resolve(reader.result), false)
        reader.readAsDataURL(file)
    })
}

export default Main
