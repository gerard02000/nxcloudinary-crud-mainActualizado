'use client'
import Imagen from '@/components/Imagen';
import { imgCreate, imgUpdate, imgDelete } from '@/lib/actions';
import { toast } from 'react-hot-toast';


async function Galeria({ images }) {
  // console.log(images);

  async function crear(data) {
    const { type, message } = await imgCreate(data); // Server action: imgCreate
    if (type == 'success') toast.success(message)
    if (type == 'error') toast.error(message)
  }

  async function eliminar(data) {
    const { type, message } = await imgDelete(data); // Server action: imgDelete
    if (type == 'success') toast.success(message)
    if (type == 'error') toast.error(message)
  }

  async function actualizar(data) {
    const { type, message } = await imgUpdate(data); // Server action: imgUpdate
    if (type == 'success') toast.success(message)
    if (type == 'error') toast.error(message)
  }

  return (
    <>
      <Imagen img='image.png'>
        <input type='file' name='file' accept='image/*' style={{ display: 'none' }} />
        <input type='hidden' name='public_id' />

        <button formAction={crear} > Subir imagen</button>
      </Imagen>
      <h1>Galería de imágenes</h1>
      <p>Para actualizar una imagen, arrastra y suelta sobre ella la nueva imagen, y luego pulsa en el botón <strong>Actualizar imagen</strong></p>
      <br />
      <div className='galeria'>
        {images.resources.map(img => (
          <Imagen key={img.public_id} img={img.secure_url}>
            <input type='file' name='file' accept='image/*' style={{ display: 'none' }} />
            <input type='hidden' name='public_id' value={img.public_id} />

            <button formAction={actualizar} > Actualizar imagen</button>
            <button formAction={eliminar} > Eliminar imagen</button>
          </Imagen>
        ))
        }
      </div>
    </>
  )
}

export default Galeria