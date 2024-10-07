import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../../firebaseConfig"; // Asegúrate de que esta importación esté correcta

// Función para eliminar una imagen existente
export const deleteImage = async (imageUrl: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    if (!imageUrl) {
      reject("No se ha proporcionado ninguna URL de imagen para eliminar");
      return;
    }

    // Referencia a la imagen en Firebase Storage basada en la URL
    const storageRef = ref(storage, imageUrl);

    // Eliminar la imagen
    try {
      await deleteObject(storageRef);
      console.log(`Imagen eliminada: ${imageUrl}`);
      resolve();
    } catch (error) {
      console.error("Error al eliminar la imagen:", error);
      reject(error); // Maneja el error
    }
  });
};

// Función para subir la nueva imagen y devolver la URL
export const uploadNewImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No se ha proporcionado ningún archivo");
      return;
    }

    const storageRef = ref(storage, `images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Subiendo imagen: ${progress}%`);
      },
      (error) => {
        reject(error); // Maneja errores de la subida
      },
      async () => {
        try {
          // Obtén la URL de descarga cuando termine la subida
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL); // Resuelve la promesa con la URL
        } catch (error) {
          reject(error); // En caso de error al obtener la URL
        }
      }
    );
  });
};

// Función para manejar el proceso completo de eliminar la imagen anterior y subir la nueva
export const replaceImage = async (file: File, oldImageUrl?: string): Promise<string> => {
  // Si existe una imagen anterior, primero la eliminamos
  if (oldImageUrl) {
    try {
      await deleteImage(oldImageUrl);
      console.log("Imagen anterior eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar la imagen anterior:", error);
    }
  }

  // Subimos la nueva imagen
  try {
    const newImageUrl = await uploadNewImage(file);
    console.log("Nueva imagen subida con éxito");
    return newImageUrl;
  } catch (error) {
    throw new Error("Error al subir la nueva imagen: " + error);
  }
};
