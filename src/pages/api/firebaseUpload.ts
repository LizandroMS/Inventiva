import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Asegúrate de tener tu configuración de Firebase correctamente

// Tipado correcto para indicar que la función devuelve una Promise<string>
export const uploadImage = async (file: File): Promise<string> => {
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
        // Obtén la URL de descarga cuando termine la subida
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL); // Resuelve la promesa con la URL
      }
    );
  });
};
