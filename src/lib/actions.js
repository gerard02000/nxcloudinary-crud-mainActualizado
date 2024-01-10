// Importamos la librería de Cloudinary y la función de revalidación de caché de Next.js
import cloudinary from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

/*
OPERACIONES CRUD

C: CREATE -> imgCreate
R: READ   -> imgRetrieveAll
U: UPDATE -> imgUpdate
D: DELETE -> imgDelete

*/

// Función auxiliar para transformar y cargar la imagen en Cloudinary
const transformAndUpload = async (fileUri, options) => {
  try {
    // Subimos la imagen a Cloudinary con las opciones especificadas
    const result = await cloudinary.uploader.upload(fileUri, options);

    // Volvemos a validar la ruta para actualizar la caché
    revalidatePath('/');

    // Devolvemos un objeto con información sobre el éxito de la operación
    return { type: 'success', message: `Imagen ${options.public_id ? 'actualizada' : 'subida'} a ${result.public_id}` };
  } catch (error) {
    // En caso de error, devolvemos un objeto con información sobre el error
    return { type: 'error', message: error.message };
  }
};

// Función auxiliar para obtener datos base64 del archivo
const getBase64Data = async (file) => {
  // Convertimos el archivo a un buffer y luego a una cadena base64
  const fileBuffer = await file.arrayBuffer();
  return Buffer.from(fileBuffer).toString('base64');
};

// Función auxiliar para construir la URI del archivo
const buildFileUri = (mime, encoding, base64Data) => `data:${mime};${encoding},${base64Data}`;

// Función para crear una nueva imagen en Cloudinary
export async function imgCreate(formData) {
  // Obtenemos el archivo y los datos base64
  const file = formData.get('file');
  const base64Data = await getBase64Data(file);

  // Construimos la URI del archivo
  const fileUri = buildFileUri(file.type, 'base64', base64Data);

  // Definimos las opciones para la carga de la imagen
  const options = {
    invalidate: true,
    folder: 'tienda',
    public_id: file.name,
    aspect_ratio: '1.62',
    width: 600,
    crop: 'fill',
    gravity: 'center',
  };

  // Llamamos a la función auxiliar para transformar y cargar la imagen
  return transformAndUpload(fileUri, options);
}

// Función para obtener todas las imágenes de la carpeta 'tienda' en Cloudinary
export async function imgRetrieveAll() {
  // Utilizamos la API de Cloudinary para obtener recursos con ciertas opciones
  const result = await cloudinary.api.resources({
    max_results: 500,
    type: 'upload',
    prefix: 'tienda',
  });

  // Devolvemos el resultado
  return result;
}

// Función para actualizar una imagen existente en Cloudinary
export async function imgUpdate(formData) {
  // Obtenemos el ID público de la imagen y el archivo actualizado
  const public_id = formData.get('public_id');
  const file = formData.get('file');
  const base64Data = await getBase64Data(file);

  // Construimos la URI del archivo
  const fileUri = buildFileUri(file.type, 'base64', base64Data);

  // Definimos las opciones para la actualización de la imagen
  const options = {
    invalidate: true,
    public_id,
    aspect_ratio: '1.62',
    width: 600,
    crop: 'fill',
    gravity: 'center',
  };

  // Llamamos a la función auxiliar para transformar y cargar la imagen
  return transformAndUpload(fileUri, options);
}

// Función para eliminar una imagen en Cloudinary
export async function imgDelete(formData) {
  // Obtenemos el ID público de la imagen a eliminar
  const public_id = formData.get('public_id');

  try {
    // Utilizamos la API de Cloudinary para eliminar la imagen
    const result = await cloudinary.uploader.destroy(public_id);

    // Volvemos a validar la ruta para actualizar la caché
    revalidatePath('/');

    // Devolvemos un objeto con información sobre el éxito de la operación
    return { type: 'success', message: `Imagen eliminada de ${public_id}` };
  } catch (error) {
    // En caso de error, devolvemos un objeto con información sobre el error
    return { type: 'error', message: error.message };
  }
}
