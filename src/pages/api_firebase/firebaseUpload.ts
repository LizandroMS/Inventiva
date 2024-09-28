import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebaseConfig"; // Asegúrate de importar el almacenamiento correctamente

export const uploadImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No se ha proporcionado ningún archivo");
      return;
    }

    try {
      // Verifica si el almacenamiento está disponible
      if (!storage) {
        reject("Firebase Storage no está inicializado");
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
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL); // Resuelve la promesa con la URL
          } catch (error) {
            reject("Error al obtener la URL de descarga");
          }
        }
      );
    } catch (error) {
      reject("Error al subir la imagen");
    }
  });
};
