/**
 * Réduit une photo de téléphone (souvent 4 à 8 Mo) à 1600 px de large en JPEG :
 * envoi plus rapide, page plus légère pour les visiteurs.
 */
export async function resizeImage(file: File, maxSide = 1600, quality = 0.82): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new Error('Format de photo non reconnu. Envoyez une photo JPEG ou PNG.')
  }
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('La photo n’a pas pu être préparée.'))),
      'image/jpeg',
      quality,
    ),
  )
}
