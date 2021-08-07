export const isArrayEmpty = (arr?: any[]) => !Array.isArray(arr) || arr.length === 0

/**
 * @description 将 Blob 类型转换为 File 类型
 * @param theBlob 
 * @param fileName 
 */
export const convertBlob2File = (theBlob: Blob, fileName: string): File => {
  let b: any = theBlob
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date()
  b.name = fileName

  //Cast to a File() type
  return <File>theBlob
}